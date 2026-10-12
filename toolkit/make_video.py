#!/usr/bin/env python3
"""Build one episode: frames -> music -> MP4 -> thumbnail -> check sheets.

    python3 toolkit/make_video.py episodes/NNN-slug            # full build
    python3 toolkit/make_video.py episodes/NNN-slug --stills 2.5,8,14.2   # quick look at a few moments

The episode folder needs scene.html (defines window.renderAt(t), optionally
window.renderThumb()) and episode.json. Everything is written to <episode>/build/.
"""
import sys, os, json, asyncio, subprocess, shutil, glob

FPS = 30
W, H = 1280, 720
HERE = os.path.dirname(os.path.abspath(__file__))


async def open_page(p, ep):
    b = await p.chromium.launch()
    pg = await b.new_page(viewport={"width": W, "height": H})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    await pg.goto("file://" + os.path.join(ep, "scene.html"))
    await pg.evaluate("document.fonts.load('700 50px Poppins')")
    await pg.evaluate("document.fonts.ready")
    if errs:
        sys.exit("scene.html has a script error: " + errs[0])
    if not await pg.evaluate("typeof window.renderAt === 'function'"):
        sys.exit("scene.html must define window.renderAt(t)")
    return b, pg


async def shoot(pg, t, path):
    try:
        await pg.evaluate(f"renderAt({t})")
    except Exception as e:
        sys.exit(f"renderAt({t:.2f}) failed: {e}")
    await pg.screenshot(path=path)


async def worker(ep, a, e, out):
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b, pg = await open_page(p, ep)
        for f in range(a, e):
            await shoot(pg, f / FPS, os.path.join(out, f"f{f:05d}.png"))
        await b.close()


async def stills(ep, times, out, thumb_path=None):
    from playwright.async_api import async_playwright
    paths = []
    async with async_playwright() as p:
        b, pg = await open_page(p, ep)
        for t in times:
            path = os.path.join(out, f"t{t:06.2f}.png")
            await shoot(pg, t, path)
            paths.append(path)
        if thumb_path and await pg.evaluate("typeof window.renderThumb === 'function'"):
            await pg.evaluate("renderThumb()")
            await pg.screenshot(path=thumb_path)
        await b.close()
    return paths


def sheets(paths, out, per=6):
    from PIL import Image
    made = []
    for n in range(0, len(paths), per):
        part = [Image.open(f).convert("RGB").resize((640, 360), Image.LANCZOS) for f in paths[n:n + per]]
        sheet = Image.new("RGB", (1280, 360 * ((len(part) + 1) // 2)), (30, 30, 30))
        for i, im in enumerate(part):
            sheet.paste(im, ((i % 2) * 640, (i // 2) * 360))
        name = os.path.join(out, f"sheet{n // per + 1}.png")
        sheet.save(name)
        made.append(name)
    return made


def rhyme_args(cfg):
    r = cfg.get("rhyme")
    if not r:
        return []
    return ["--rhyme", r["name"], "--bpm", str(r.get("bpm", 0)), "--start", str(r.get("start", 4)),
            "--repeat", str(r.get("repeat", 1)), "--gap", str(r.get("gap", 4))]


def main():
    if len(sys.argv) >= 6 and sys.argv[1] == "--worker":
        asyncio.run(worker(sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]))
        return
    ep = os.path.abspath(sys.argv[1])
    cfg = json.load(open(os.path.join(ep, "episode.json")))
    slug, dur = cfg["slug"], float(cfg["duration"])
    build = os.path.join(ep, "build")
    check = os.path.join(build, "check")
    os.makedirs(check, exist_ok=True)

    if "--stills" in sys.argv:
        times = [float(x) for x in sys.argv[sys.argv.index("--stills") + 1].split(",")]
        for f in glob.glob(os.path.join(check, "*.png")):
            os.remove(f)
        made = sheets(asyncio.run(stills(ep, times, check)), check)
        print("stills:", " ".join(made))
        return

    frames = os.path.join(build, "frames")
    shutil.rmtree(frames, ignore_errors=True)
    os.makedirs(frames)
    n = int(round(dur * FPS))
    half = n // 2
    procs = [subprocess.Popen([sys.executable, __file__, "--worker", ep, str(a), str(e), frames])
             for a, e in ((0, half), (half, n))]
    if any(p.wait() != 0 for p in procs):
        sys.exit("frame rendering failed")
    got = len(glob.glob(os.path.join(frames, "f*.png")))
    if got != n:
        sys.exit(f"expected {n} frames, got {got}")

    wav = os.path.join(build, "audio.wav")
    subprocess.run([sys.executable, os.path.join(HERE, "audio.py"), wav, "--duration", str(dur),
                    "--seed", str(cfg.get("seed", 1)), "--events", json.dumps(cfg.get("sfx", [])),
                    "--lullaby-from", str(cfg.get("lullaby_from") or 0)] + rhyme_args(cfg), check=True)

    mp4 = os.path.join(build, slug + ".mp4")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(frames, "f%05d.png"),
                    "-i", wav, "-c:v", "libx264", "-preset", "slow", "-crf", "21", "-pix_fmt", "yuv420p",
                    "-c:a", "aac", "-b:a", "128k", "-shortest", "-movflags", "+faststart", mp4], check=True)
    shutil.rmtree(frames, ignore_errors=True)

    # check sheets: 12 moments spread over the video (mid-points, so scene changes are avoided)
    for f in glob.glob(os.path.join(check, "*.png")):
        os.remove(f)
    times = [round(dur * (k + 0.5) / 12, 2) for k in range(12)] + [float(x) for x in cfg.get("check_times", [])]
    thumb = os.path.join(build, slug + "-thumb.png")
    made = sheets(asyncio.run(stills(ep, sorted(times), check, thumb)), check)
    size = os.path.getsize(mp4) / 1e6
    print(f"video: {mp4} ({size:.1f} MB, {dur:.0f}s)")
    print("thumbnail:", thumb if os.path.exists(thumb) else "none (scene has no renderThumb)")
    print("check sheets (LOOK at every one before publishing):", " ".join(made))
    if size > 20:
        print("WARNING: file is large; keep videos under 20 MB")


if __name__ == "__main__":
    main()
