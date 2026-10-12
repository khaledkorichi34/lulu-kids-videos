#!/usr/bin/env python3
"""Soundtrack for an episode: a gentle music-box tune (different for every seed)
plus sound effects placed at given times.

    audio.py out.wav --duration 47 --seed 3 --events '[{"t":13.6,"type":"boing_low"}]' --lullaby-from 40

Effect types: boing_low, boing_high, buzz, sparkle, pop, ding

Sing-along mode plays a nursery rhyme from rhymes.js instead of the generated tune:
    audio.py out.wav --duration 76 --rhyme twinkle --bpm 92 --start 5 --repeat 2 --gap 4
"""
import os, sys, json, wave, random, argparse
import numpy as np

SR = 44100
NOTE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}


def freq(n):
    p, i = NOTE[n[0]], 1
    if n[1] in "#b":
        p += 1 if n[1] == "#" else -1
        i = 2
    return 440 * 2 ** ((12 * (int(n[i:]) + 1) + p - 69) / 12)


def load_rhymes():
    src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "rhymes.js")).read()
    return json.loads(src[src.index("{"):src.rindex("}") + 1])


def bell(f, dur, vol):
    t = np.arange(int(SR * (dur + 0.9))) / SR
    env = np.exp(-t * 3.2) * (1 - np.exp(-t * 300))
    w = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) * np.exp(-t * 5) + 0.12 * np.sin(6 * np.pi * f * t) * np.exp(-t * 9)
    return vol * env * w


def bass(f, dur, vol):
    t = np.arange(int(SR * (dur + 0.3))) / SR
    env = np.exp(-t * 2.2) * (1 - np.exp(-t * 120))
    return vol * env * (np.sin(2 * np.pi * f * t) + 0.45 * np.sin(4 * np.pi * f * t) + 0.2 * np.sin(6 * np.pi * f * t))


def boing(f0, f1, dur, vol):
    t = np.arange(int(SR * dur)) / SR
    f = f0 + (f1 - f0) * (t / dur) ** 0.7 + 12 * np.sin(2 * np.pi * 18 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return vol * np.sin(np.pi * t / dur) ** 0.6 * (np.sin(ph) + 0.25 * np.sin(2 * ph))


def buzz(dur, vol):
    t = np.arange(int(SR * dur)) / SR
    saw = np.convolve(2 * ((165 * t) % 1) - 1, np.ones(14) / 14, mode="same")
    return vol * np.sin(np.pi * t / dur) ** 0.5 * (0.65 + 0.35 * np.sin(2 * np.pi * 27 * t)) * saw


def effect(kind):
    if kind == "boing_low":
        return boing(260, 560, 0.42, 0.20)
    if kind == "boing_high":
        return boing(420, 840, 0.30, 0.17)
    if kind == "buzz":
        return buzz(0.45, 0.085)
    if kind == "pop":
        return boing(700, 1100, 0.12, 0.16)
    if kind == "ding":
        return bell(1567.98, 0.3, 0.14)
    if kind == "sparkle":
        out = np.zeros(int(SR * 1.8))
        for k, f in enumerate((1046.5, 1318.5, 1568.0, 2093.0)):
            s = bell(f, 0.2, 0.10)
            i = int(k * 0.16 * SR)
            out[i:i + len(s)] += s[: len(out) - i]
        return out
    raise SystemExit(f"unknown sound effect type: {kind}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out")
    ap.add_argument("--duration", type=float, required=True)
    ap.add_argument("--seed", type=int, default=1)
    ap.add_argument("--events", default="[]")
    ap.add_argument("--lullaby-from", type=float, default=0)
    ap.add_argument("--rhyme", default="")
    ap.add_argument("--bpm", type=float, default=0)
    ap.add_argument("--start", type=float, default=4)
    ap.add_argument("--repeat", type=int, default=1)
    ap.add_argument("--gap", type=float, default=4)
    a = ap.parse_args()
    rnd = random.Random(a.seed)
    out = np.zeros(int(SR * (a.duration + 2)))

    def add(sig, t0):
        i = int(max(0, t0) * SR)
        j = min(len(out), i + len(sig))
        if i < len(out):
            out[i:j] += sig[: j - i]

    if a.rhyme:
        sing_along(a, add)
    else:
        generated_tune(a, rnd, add)

    for ev in json.loads(a.events):
        add(effect(ev["type"]), float(ev["t"]))

    out = out[: int(SR * a.duration)]
    n = int(SR * 1.2)
    out[-n:] *= np.linspace(1, 0, n)
    out = out / max(1e-9, np.abs(out).max()) * 0.8
    with wave.open(a.out, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((out * 32767).astype(np.int16).tobytes())
    print("audio: %.1fs, rms %.3f" % (a.duration, float(np.sqrt((out ** 2).mean()))))


def sing_along(a, add):
    """Melody on music-box bells, a soft bass that follows the tune, a short intro and a closing chord.
    Timing matches rhymeTimes() in lib.js exactly."""
    r = load_rhymes()[a.rhyme]
    spb = 60 / (a.bpm or r["bpm"])
    t, notes = a.start, []
    for k in range(a.repeat):
        for line in r["lines"]:
            for _, note, b in line:
                notes.append((t, t + b * spb, note))
                add(bell(freq(note), b * spb, 0.24), t)
                t += b * spb
        if k < a.repeat - 1:
            t += a.gap * spb
    end = t
    root_of = {0: 0, 4: 0, 7: 0, 5: 5, 9: 5, 2: 7, 11: 7}       # C, F or G chord under each melody note
    bt = a.start
    while bt < end - 0.05:
        cur = next((n for s, e, n in notes if s <= bt + 1e-6 < e), None)
        if cur:
            root = root_of.get(NOTE[cur[0]], 0)
            add(bass(130.81 * 2 ** (root / 12), 2 * spb, 0.15), bt)
        bt += 2 * spb
    # intro: gentle broken chords until the singing starts
    it = 0.6
    for k, f in enumerate([523.25, 659.25, 783.99, 659.25] * 8):
        if it + k * spb > a.start - 0.8:
            break
        add(bell(f, spb, 0.11), it + k * spb)
    for f in (523.25, 659.25, 783.99, 1046.5):
        add(bell(f, 1.6, 0.12), end + 0.4)


def generated_tune(a, rnd, add):
    # --- tune: major pentatonic, new key / tempo / melody for every seed ---
    tonic = 523.25 * 2 ** (rnd.choice([0, 2, -3, -5, 5]) / 12)
    ladder = [tonic * 2 ** (s / 12) for s in (0, 2, 4, 7, 9, 12, 14, 16, 19, 21)]
    beat = 60 / rnd.choice([104, 112, 120, 126])
    rhythms = [[1, 1, 1, 1], [1, 1, 2], [2, 1, 1], [.5, .5, 1, 1, 1], [1, .5, .5, 2], [1, 1, 1, .5, .5]]

    def phrase():
        notes, idx = [], rnd.choice([2, 3, 4, 5])
        for bar in range(8):
            pat = [1, 1, 2] if bar in (3, 7) else rnd.choice(rhythms)
            for k, d in enumerate(pat):
                idx = max(0, min(9, idx + rnd.choice([-2, -1, -1, 0, 1, 1, 2])))
                if k == len(pat) - 1 and bar == 3:
                    idx = 3 if idx < 6 else 8
                if k == len(pat) - 1 and bar == 7:
                    idx = 0 if idx < 3 else 5
                notes.append((idx, d))
        return notes

    A, B = phrase(), phrase()
    roots = rnd.choice([[0, 7, 9, 5], [0, 5, 7, 0], [0, 9, 5, 7], [0, 5, 0, 7]])
    music_end = (a.lullaby_from - 1.0) if a.lullaby_from else (a.duration - 2.6)
    t, k = 0.5, 0
    while t < music_end:
        tt = t
        for idx, d in (A, A, B, A)[k % 4]:
            if tt < music_end:
                add(bell(ladder[idx], d * beat, 0.22), tt)
            tt += d * beat
        for bar in range(8):
            r = roots[bar % 4] if bar < 7 else 0
            for h, semis in enumerate((r, r + 7 if h_ok(r) else r)):
                bt = t + (bar * 4 + h * 2) * beat
                if bt < music_end:
                    add(bass(tonic / 4 * 2 ** (semis / 12), 2 * beat, 0.15), bt)
        t, k = tt, k + 1

    if a.lullaby_from:        # slow, soft ending for bedtime scenes
        tt = a.lullaby_from + 0.6
        for idx, d in ((7, 1), (6, 1), (5, 2), (3, 1), (4, 1), (5, 3)):
            add(bell(ladder[idx], d * 0.72, 0.17), tt)
            tt += d * 0.72
    else:                     # closing chord
        for idx in (0, 2, 3, 5):
            add(bell(ladder[idx], 1.2, 0.13), a.duration - 2.4)



def h_ok(root):
    """Second half of the bar moves up a fifth, except where that would get muddy."""
    return root in (0, 5)


if __name__ == "__main__":
    main()
