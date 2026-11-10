#!/usr/bin/env python3
"""Generates ALL audio for FRAIDY CATS from scratch (original, copyright-free).
Usage:  python3 scripts/generate_audio.py     (needs numpy)
Writes WAV files into public/audio/."""
import wave, os, numpy as np
SR = 32000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

def T(sec): return np.arange(int(sec * SR)) / SR
def noise(sec): return rng.standard_normal(int(sec * SR))
def fft_filter(x, lo=None, hi=None):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if lo: m *= 1 / (1 + (lo / np.maximum(f, 1e-3)) ** 4)
    if hi: m *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * m, len(x))
def norm(x, peak=0.9): return x / (np.max(np.abs(x)) + 1e-9) * peak
def env_exp(t, k): return np.exp(-t * k)
def reverb(x, sec=2.2, wet=0.35):
    n = int(sec * SR); ir = noise(sec) * np.exp(-np.arange(n) / SR * 3.2 / (sec / 2.2)); ir[0] = 0
    ir = fft_filter(ir, 150, 6000)
    L = len(x) + n; y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(ir, L), L)[:len(x)]
    return x * (1 - wet) + norm(y, np.max(np.abs(x))) * wet
def save(name, x, stereo=False):
    x = np.clip(x, -1, 1)
    if x.ndim == 1: x = np.stack([x, x], 1) if stereo else x[:, None]
    pcm = (x * 32767).astype("<i2")
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(pcm.shape[1]); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print("wrote", name)
def fade(x, a=0.02, b=0.05):
    n = len(x); fa, fb = int(a * SR), int(b * SR); x = x.copy()
    if fa: x[:fa] *= np.linspace(0, 1, fa)
    if fb: x[-fb:] *= np.linspace(1, 0, fb)
    return x
def place(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x));
    if i < len(buf): buf[i:j] += x[: j - i]

# ---------------- WIND (60s, stereo, loopable bed) ----------------
def wind(sec=60):
    t = T(sec); chans = []
    for s in range(2):
        lfo = 0.55 + 0.45 * np.sin(2 * np.pi * 0.06 * t + s) * np.sin(2 * np.pi * 0.11 * t + 2 * s)
        body = fft_filter(noise(sec), 70, 500) * lfo
        howl = fft_filter(noise(sec), 450, 900) * np.clip(np.sin(2 * np.pi * 0.045 * t + s * 2), 0, 1) ** 3 * 0.6
        hiss = fft_filter(noise(sec), 1500, 4000) * (0.15 + 0.25 * lfo ** 2)
        chans.append(norm(body + howl + hiss, 0.6))
    y = np.stack(chans, 1)
    y *= (0.5 + 0.5 * np.minimum(1, t / 3))[:, None]
    y *= np.minimum(1, (sec - t) / 2.5)[:, None]
    save("wind.wav", y)
wind()

# ---------------- MUSIC (60s) ----------------
def tone(f, sec, harm=(1, .3, .1)):
    t = T(sec); return sum(a * np.sin(2 * np.pi * f * (i + 1) * t) for i, a in enumerate(harm))
def music(sec=60):
    N = int(sec * SR); t = T(sec); L = np.zeros(N); R = np.zeros(N)
    # drone pad (A minor / phrygian colour), swells over time
    swell = np.clip(t / 50, 0, 1) ** 1.4 * 0.7 + 0.18
    for f, a in [(55, 1), (82.4, .6), (110.4, .5), (116.5, .25), (130.8, .35), (164.8, .2)]:
        L += a * np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.07 * t)) * swell
        R += a * np.sin(2 * np.pi * f * 1.002 * t + 0.3 * np.sin(2 * np.pi * 0.05 * t)) * swell
    # music-box melody (sparse, minor 2nd tension)
    notes = [440, 523.3, 659.3, 466.2, 440, 392, 415.3, 493.9]
    k = 0; time = 2.0
    while time < 49:
        f = notes[k % len(notes)] * (0.5 if (k // 8) % 2 else 1)
        amp = 0.05 + 0.10 * min(1, time / 45)
        n = tone(f, 3.0, (1, .35, .12, .05)) * env_exp(T(3.0), 1.8) * amp
        place(L, n, time); place(R, n * 0.8, time + 0.012)
        time += [1.5, 1.5, 1.5, 3.0][k % 4] * (0.8 if time > 30 else 1); k += 1
    # heartbeat from 24s, accelerating
    tm = 24.0; bpm = 55
    while tm < 51.8:
        th = np.sin(2 * np.pi * 52 * T(0.35)) * env_exp(T(0.35), 14) * (0.35 + 0.4 * (tm - 24) / 28)
        place(L, th, tm); place(R, th, tm); place(L, th * .6, tm + 0.22); place(R, th * .6, tm + 0.22)
        bpm = 55 + 55 * (tm - 24) / 28; tm += 60 / bpm
    # riser 40 -> 51.8
    rs = 11.8; r = fft_filter(noise(rs), 800, 7000) * (np.linspace(0, 1, int(rs * SR)) ** 3) * 0.35
    place(L, r, 40); place(R, r[::-1] * 0 + r, 40)
    # silence-then-STING at 52.0 (title)
    ts = T(8.0); boom = np.sin(2 * np.pi * (38 + 25 * env_exp(ts, 3)) * ts) * env_exp(ts, 1.1) * 1.2
    chord = sum(np.sin(2 * np.pi * f * ts) + 0.5 * np.sin(2 * np.pi * 2 * f * ts) for f in (55, 82.4, 116.5, 123.5, 220, 233.1)) * env_exp(ts, 0.9) * 0.18
    burst = fft_filter(noise(8.0), 200, 5000) * env_exp(ts, 5) * 0.9
    sting = boom + chord + burst
    # duck everything before the sting for a held breath at 51.7-52.0
    duck = np.ones(N); a, b = int(51.7 * SR), int(52.0 * SR); duck[a:b] = np.linspace(1, 0, b - a) ** 2
    L *= duck; R *= duck
    place(L, sting, 52.0); place(R, sting, 52.0)
    # tail & final low pulse when the eyes appear (~57.4s)
    p = np.sin(2 * np.pi * 45 * T(1.5)) * env_exp(T(1.5), 4) * 0.8; place(L, p, 57.4); place(R, p, 57.4)
    # global fade-in/out
    g = np.minimum(1, t / 4) * np.minimum(1, (sec - t) / 1.2)
    y = np.stack([L * g, R * g], 1)
    y = np.stack([reverb(y[:, 0], 2.6, .3), reverb(y[:, 1], 2.9, .3)], 1)
    save("music.wav", norm(y, 0.85))
music()

# ---------------- SFX ----------------
def bell():
    t = T(5.0); x = np.zeros_like(t)
    for r, a, d in [(1, 1, 1.2), (2.01, .6, 1.7), (2.76, .5, 2.3), (5.4, .3, 3.2), (8.9, .2, 4.5), (1.003, .8, 1.3)]:
        x += a * np.sin(2 * np.pi * 1480 * r * t) * np.exp(-t * d)
    x *= np.minimum(1, t * 600); save("bell.wav", reverb(norm(x, .8), 1.6, .3))
bell()

def static(sec=4.0):
    t = T(sec); n = fft_filter(noise(sec), 250, 6500)
    crack = (rng.random(len(t)) > 0.9993) * rng.standard_normal(len(t)) * 6
    crack = fft_filter(crack, 1000, 9000)
    am = 0.6 + 0.4 * np.sin(2 * np.pi * 7 * t) * np.sin(2 * np.pi * 1.3 * t)
    hum = 0.12 * np.sin(2 * np.pi * 120 * t)
    whine = 0.05 * np.sin(2 * np.pi * (900 + 600 * np.sin(2 * np.pi * 0.4 * t)) * t)
    x = (n * am * 0.5 + crack * 0.3 + hum + whine)
    click = np.zeros_like(t); c = np.sin(2 * np.pi * 90 * T(.12)) * env_exp(T(.12), 40); click[: len(c)] = c * 2
    save("static.wav", fade(norm(x + click, .7), .005, .25))
static()

def whisper(syls, name, dur):
    buf = np.zeros(int(dur * SR)); tm = 0.15
    for d, (f1, f2), gap in syls:
        n = noise(d + .1)
        b = fft_filter(n, f1 * .8, f1 * 1.3) * 1.0 + fft_filter(n, f2 * .85, f2 * 1.2) * 0.7 + fft_filter(n, 2500, 6000) * .35
        e = np.sin(np.pi * np.clip(T(d + .1) / (d + .1), 0, 1)) ** 1.4
        place(buf, b * e, tm); tm += d + gap
    buf = fft_filter(buf, 350, 3800); buf = np.tanh(buf * 4 / (np.max(np.abs(buf)) + 1e-9)) * .5
    bed = fft_filter(noise(dur), 300, 6000) * .12
    save(name, reverb(fade(norm(buf + bed, .75), .02, .3), 1.2, .25))
whisper([(.28, (700, 1200), .02), (.32, (400, 2200), .5), (.5, (600, 900), 0)], "whisper_names.wav", 2.6)
whisper([(.22, (300, 800), .03), (.24, (500, 900), .0), (.16, (400, 1800), .1), (.2, (700, 1300), .12), (.3, (600, 1000), .08), (.45, (750, 1500), 0)], "whisper_return.wav", 3.2)

def footsteps(sec=7.5):
    buf = np.zeros(int(sec * SR)); tm = 0.2; i = 0
    while tm < sec - .4:
        t = T(.3); lowf = 75 if i % 2 else 62
        th = np.sin(2 * np.pi * (lowf - 20 * t / .3) * t) * env_exp(t, 18) * .8
        cr = fft_filter(noise(.3), 250, 1400) * env_exp(t, 22) * 1.2 + fft_filter(noise(.3), 2000, 6000) * env_exp(t, 40) * .4
        place(buf, th + cr * .6, tm); tm += 0.78 + rng.random() * .08; i += 1
    save("footsteps.wav", reverb(fade(norm(buf, .7), .01, .3), 1.0, .15))
footsteps()

def creak(name, sec, f0, f1, vib=18, amp=.7):
    t = T(sec); f = f0 + (f1 - f0) * (t / sec) ** 1.3 + 6 * np.sin(2 * np.pi * 4 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR; saw = (ph / np.pi % 2) - 1
    stick = 0.55 + 0.45 * np.sign(np.sin(2 * np.pi * vib * t * (0.6 + t / sec)))
    x = fft_filter(saw, 250, 2200) * stick * np.sin(np.pi * t / sec) ** .8
    save(name, reverb(norm(x, amp), 1.2, .2))
creak("creak_floor.wav", 1.6, 190, 260, 22, .55)
creak("creak_branch.wav", 2.8, 95, 140, 11, .45)

def door(sec=4.0):
    t = T(sec); f = 85 + 90 * (t / sec) ** 1.2 + 5 * np.sin(2 * np.pi * 5 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR; saw = (ph / np.pi % 2) - 1
    stick = 0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 14 * t * (0.7 + t / sec)))
    x = fft_filter(saw, 200, 1800) * stick * np.sin(np.pi * np.clip((t - .25) / (sec - .5), 0, 1)) ** .7 * .9
    thud = np.sin(2 * np.pi * 55 * t) * env_exp(t, 9) * 1.3 + fft_filter(noise(sec), 100, 600) * env_exp(t, 14)
    wood = np.sin(2 * np.pi * 48 * t) * np.sin(np.pi * np.clip(t / sec, 0, 1)) * .25
    save("door.wav", reverb(norm(x + thud + wood, .9), 1.8, .3))
door()
print("done")
