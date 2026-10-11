#!/usr/bin/env python3
"""Soundtrack for an episode: a gentle music-box tune (different for every seed)
plus sound effects placed at given times.

    audio.py out.wav --duration 47 --seed 3 --events '[{"t":13.6,"type":"boing_low"}]' --lullaby-from 40

Effect types: boing_low, boing_high, buzz, sparkle, pop, ding
"""
import sys, json, wave, random, argparse
import numpy as np

SR = 44100


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
    a = ap.parse_args()
    rnd = random.Random(a.seed)
    out = np.zeros(int(SR * (a.duration + 2)))

    def add(sig, t0):
        i = int(max(0, t0) * SR)
        j = min(len(out), i + len(sig))
        if i < len(out):
            out[i:j] += sig[: j - i]

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


def h_ok(root):
    """Second half of the bar moves up a fifth, except where that would get muddy."""
    return root in (0, 5)


if __name__ == "__main__":
    main()
