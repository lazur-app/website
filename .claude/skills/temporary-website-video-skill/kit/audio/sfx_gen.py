"""Generate the Lazur demo-film UI sound library with ElevenLabs -> public/sfx/*.mp3.

Usage:
  python audio/sfx_gen.py            # generate every clip that is missing (skips existing files)
  python audio/sfx_gen.py name ...   # (re)generate only these clips

The API key is read from company-brain/.env (ELEVENLABS_API_KEY=...). It is never printed or written elsewhere.
Raw output, no loudness normalization.
"""
import os, json, sys, time, urllib.request, urllib.error
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "public" / "sfx"
ENV = Path(os.environ.get("COMPANY_BRAIN_ENV", "company-brain/.env"))  # set COMPANY_BRAIN_ENV to the .env path

NM = ", no music, no voices"
# name: (prompt, seconds, prompt_influence)
SFX = {
    "key_press": ("one satisfying mechanical laptop key press, close, crisp" + NM, 0.5, 0.6),
    "key_hold": ("a key pressed and held down, soft thock" + NM, 0.6, 0.6),
    "notch_open": ("soft airy UI whoosh as a small pill expands, modern, smooth" + NM, 0.7, 0.6),
    "notch_close": ("reverse soft UI whoosh closing" + NM, 0.6, 0.6),
    "mic_on": ("tiny warm digital blip, microphone turning on" + NM, 0.4, 0.6),
    "typing_fast": ("fast light laptop keyboard typing burst" + NM, 3.0, 0.6),
    "typing_short": ("short burst of quick typing" + NM, 1.2, 0.6),
    "text_pop": ("soft bubbly UI pop as text appears" + NM, 0.4, 0.6),
    "text_pop2": ("slightly higher soft pop variant" + NM, 0.4, 0.6),
    "mouse_click": ("clean single trackpad/mouse click" + NM, 0.3, 0.6),
    "ui_click_soft": ("soft muted interface tap" + NM, 0.3, 0.6),
    "pen_scribble": ("felt marker scribbling quickly on glass/whiteboard" + NM, 1.5, 0.6),
    "pen_stroke": ("one quick marker swipe" + NM, 0.6, 0.6),
    "cursor_glide": ("very soft airy swish of a cursor gliding across screen" + NM, 0.8, 0.6),
    "thinking_shimmer": ("gentle sparkly digital shimmer loop, subtle, AI thinking" + NM, 3.0, 0.6),
    "success_chime": ("warm soft two-note success chime, not cheesy" + NM, 1.0, 0.6),
    "send_whoosh": ("quick swoosh of a message sent" + NM, 0.8, 0.6),
    "swoosh_a": ("fast transition whoosh, smooth airy texture" + NM, 0.6, 0.6),
    "swoosh_b": ("fast transition whoosh, gritty textured air with a slight crackle" + NM, 0.6, 0.6),
    "swoosh_c": ("fast transition whoosh, tonal synthetic swish with a bright edge" + NM, 0.6, 0.6),
    "zoom_in": ("short rising whoosh for a camera punch-in" + NM, 0.6, 0.6),
    "zoom_out": ("short falling whoosh for a camera pull-out" + NM, 0.6, 0.6),
    "impact_soft": ("soft deep bass thump for a hard cut, cinematic but subtle" + NM, 0.8, 0.6),
    "riser_short": ("short tension riser" + NM, 1.5, 0.6),
    "page_scroll": ("soft scroll wheel / page slide" + NM, 0.8, 0.6),
    "speak_blip": ("soft chirpy voice-assistant start tone" + NM, 0.5, 0.6),
}

MUSIC_NAME = "music_warm"
MUSIC_PROMPT = ("warm lo-fi chill hop instrumental, soft vinyl crackle, mellow keys, gentle head-nod beat, "
                "90 bpm, cozy, no vocals")


def key():
    for line in ENV.read_text(encoding="utf-8", errors="replace").splitlines():
        if line.startswith("ELEVENLABS_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("ELEVENLABS_API_KEY missing from .env")


def post(k, url, body, timeout=180):
    req = urllib.request.Request(url, data=json.dumps(body).encode(),
                                 headers={"xi-api-key": k, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def attempt(fn, name):
    err = ""
    for i in range(2):  # one retry
        try:
            data = fn()
            (OUT / f"{name}.mp3").write_bytes(data)
            return f"wrote {name}.mp3 ({len(data)} bytes)"
        except urllib.error.HTTPError as e:
            err = f"HTTP {e.code} {e.read()[:400].decode('utf-8', 'replace')}"
        except Exception as e:
            err = f"{type(e).__name__}: {e}"
        if i == 0:
            time.sleep(3)
    return f"FAILED {name}: {err}"


def gen_sfx(k, name):
    text, dur, infl = SFX[name]
    # API minimum duration is 0.5s
    body = {"text": text, "duration_seconds": max(0.5, dur), "prompt_influence": infl}
    return attempt(lambda: post(k, "https://api.elevenlabs.io/v1/sound-generation", body), name)


def gen_music(k):
    def fn():
        body = {"prompt": MUSIC_PROMPT, "music_length_ms": 40000, "force_instrumental": True}
        try:
            return post(k, "https://api.elevenlabs.io/v1/music", body, timeout=400)
        except urllib.error.HTTPError as e:
            if e.code in (400, 422):  # flag not accepted: retry without it
                body.pop("force_instrumental")
                return post(k, "https://api.elevenlabs.io/v1/music", body, timeout=400)
            raise
    return attempt(fn, MUSIC_NAME)


def main():
    allnames = list(SFX) + [MUSIC_NAME]
    names = sys.argv[1:] or [n for n in allnames if not (OUT / f"{n}.mp3").exists()]
    bad = [n for n in names if n not in allnames]
    if bad:
        sys.exit(f"unknown clip(s): {bad}")
    OUT.mkdir(parents=True, exist_ok=True)
    k = key()
    with ThreadPoolExecutor(max_workers=4) as ex:
        futs = [ex.submit(gen_music if n == MUSIC_NAME else gen_sfx, k, *([] if n == MUSIC_NAME else [n]))
                for n in names]
        results = [f.result() for f in futs]
    for r in results:
        print(r)
    if any(r.startswith("FAILED") for r in results):
        sys.exit(1)


if __name__ == "__main__":
    main()
