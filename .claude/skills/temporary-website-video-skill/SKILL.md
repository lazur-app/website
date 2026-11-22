---
name: temporary-website-video-skill
description: Temporary skill for cutting the Lazur website feature films (the empty FilmSlot frames on the homepage) out of the team's raw Mac screen recordings. Covers where the footage lives, the Remotion kit in kit/, the approved look, how to cut one film, blur rules, ElevenLabs sound, render gotchas on Windows, and what is done vs still to do. Use for any "make / recut / finish the website videos" request. Delete this skill when the films are shipped.
---

# Temporary website video skill

Short feature films for lazur.app, cut from real screen recordings of the product. Built in one session on 2026-11-22. **Only one film is finished** ("it does."). Everything needed to make the rest is here.

## Where things are

| Thing | Where |
|---|---|
| Raw recordings | Google Drive folder **"website videos"**: https://drive.google.com/drive/folders/1qV_9W5lW3YT4cZ05QGnIho0GqshL2JIt (folder id `1qV_9W5lW3YT4cZ05QGnIho0GqshL2JIt`). Reachable with the `work-drive` skill in company-brain. The raw footage shows a real inbox and a card ending, so blur before publishing anything cut from it. |
| Finished clips | Same Drive folder. Finals are prefixed `final_` (`final_it-does.mp4`). Work-in-progress uploads are prefixed `clips_`. |
| The kit | `kit/` beside this file: a Remotion project (engine, one finished film spec, tools, sound effects). |
| Working copy used in the session | `Desktop/servicerobotco/output/lazur-films` on Veer's machine (raw clips, renders, logs). Not in git. |
| Keys | `ELEVENLABS_API_KEY` and the Google OAuth keys are in `company-brain/.env`. Read them from there. Never print or commit them. |

## The slots on the site

`src/components/landing/FilmSlot.tsx` is the empty frame. Where it is used:

- **Hero** (`BuddyHero.tsx`): Main film + Film 2 + Film 3. **Skip these**, Veer said so.
- **ThreeJobs** (`BuddySections.tsx`, `JOBS`): three 4:3 slots: `Dictation` (it transcribes), `A background job` (it does), `Step-by-step guiding` (it teaches).
- **YoureInCharge** (same file, `PRIVACY`): three square slots. No footage shows these privacy claims, so the plan is to swap them for what the footage does show: "draw on your screen" (red ink), "writes your replies" (LinkedIn), "explains what you're looking at" (Claude Console).
- **FinalCtaSection**: "Setup in under a minute". No footage.

Output sizes: 1440x1080 for the 4:3 slots, 1080x1080 for the squares, 30 fps.

## The recordings (first 9, logged)

All 2940x1912, 60 fps, 30-60 s, with audio (Vaidik's voice and Lazur's spoken replies).

| # | Recorded at | App | What happens | Fits |
|---|---|---|---|---|
| rec01 | 2.29 PM | Slack | dictates a 3-point update, a numbered list is typed | transcribes |
| rec02 | 2.35 PM | Notion | dictates a "Scene 1-5" storyboard | transcribes |
| rec03 | 2.38 PM | Claude app | a long prompt dictated into the chat box | transcribes |
| rec04 | 2.41 PM | Gmail | draws on the draft, email body appears, Send | does (**used**) |
| rec05 | 2.44 PM | Claude Console | explains the cost chart, cursor points at bars | teaches / explain |
| rec06 | 2.45 PM | Google Docs | finance emails pulled into the doc | does (**used**) |
| rec07 | 2.49 PM | LinkedIn | writes a reply into the message box | does / replies |
| rec08 | 2.54 PM | Gmail | "how do I change the theme": Click Settings, Click Theme, Save | teaches |
| rec09 | 3.03 PM | Claude app | draws an arrow, guided to Plugins | teaches |

`kit/timeline/recNN.json` has, per recording: the notch box, every event with its time and a camera focus box (source pixels), dead-air stretches, the best window, and hero moments. Text labels and blur boxes were stripped because this repo is public; re-log them if needed.

**Not looked at yet:** four more recordings were added to the Drive folder later the same day (4.56 PM, 5.06 PM, 5.10 PM, 5.22 PM; 37-240 MB). They are more of Vaidik using the teaching feature. Watch these before cutting "it teaches".

What Lazur looks like in the footage: a black pill in the top-centre menu bar (the "notch", about x1116 y2 w708 h66 in source pixels) that reads Listening / Dictating (with live words) / Transcribing / Thinking / Speaking; a red cursor arrow with a red badge ("Thinking...", "Click Settings", "Finding the next step..."); red ink the user draws on screen.

## The look Veer approved (v3 of "it does.")

He rejected v1 hard. These are his notes, keep to them:

- **A straight feature demo.** Nothing tilted. No "Instagram edit" tricks, no light leaks, no grain.
- **Not yellow.** Near-neutral grade (`saturate(1.05) contrast(1.02) sepia(0.04)`), screen in a rounded window on a soft off-white backdrop.
- **No music.** Almost no sound effects: only a soft pop when Lazur's text appears.
- **Ask, then the result straight away.** No Thinking shots between the ask and the result.
- **Text appears smoothly**: a top-to-bottom wipe, never a one-frame pop.
- **Zoom in on Lazur**: the notch floats big over the dimmed app (`spot`).
- **Captions**: `User: "…"` in a white pill, `Lazur: …` in a black pill with a red dot.
- **The user's voice is muted** (captions carry it). Lazur's real spoken reply may stay. Both parts of a film must be treated the same way.
- **Blur only card digits, amounts and invoice numbers.** Do not blur emails, recipients or whole lines.
- More, tighter shots. Fun but clean.

Do not clone a teammate's voice. If a line was never said, ask them to record it or keep it as a caption.

## How to cut one film

1. **Get the footage.** Download the recording into `kit/public/raw/recNN.mp4` (video only is fine). Extract audio to `kit/public/voice/recNN.m4a` if you will use Lazur's voice.
2. **Make it constant frame rate.** The raw recordings have an irregular frame rate and Remotion fails on some frames. Always re-encode first:
   `ffmpeg -i raw/recNN.mp4 -vf fps=30 -c:v libx264 -preset veryfast -crf 15 -g 10 -bf 0 -pix_fmt yuv420p -movflags +faststart cfr/recNN.mp4`
3. **Watch it.** The `watch` skill's keyframe picker skips too much on screen recordings. Make contact sheets instead (`ffmpeg -vf "fps=1/2,scale=720:-1,tile=4x4"`), then pull full-res frames at the moments that matter. For speech, WhisperX with `--language en` (auto-detect guessed Hindi) gives word timings; `silencedetect=noise=-30dB:d=0.12` gives phrase gaps.
4. **Write the spec**: one file in `kit/src/films/`, registered in `films/index.ts`. See `does.ts`. A film is a list of shots; each shot is a slice of a recording with a playback rate and camera keys (boxes in source pixels). Captions, voice clips and sound cues are in film seconds.
5. **Check stills, then render** (commands below). Look at a frame every second or so before showing anyone.

Engine features (`kit/src/engine/types.ts`):

- `cam`: camera keys; the camera frames each box and eases between them (log-space zoom).
- `rate`: speed up dead air (x2 to x6).
- `enter`: `cut`, `punch`, `whip`, `zoomThrough`, `flash`.
- `spot`: dim the app and float one source box (the notch) big in the centre.
- `reveal`: wipe text in top to bottom inside a box. Use `fill: "#ffffff"` on white pages; without it a frozen "before" frame is used, which can show a ghost cursor.
- `blurs`: source boxes kept blurred for the shot.
- `voice`: a slice of the recording's real audio placed at a film time.
- Captions: `say` (User), `result` (Lazur), `label`, `title`.

## Render commands (Windows)

Remotion's own Chrome download stalled on this machine. Use the installed Chrome:

```
npx remotion still does out/f.jpg --frame=120 --image-format=jpeg --browser-executable="C:/Program Files/Google/Chrome/Application/chrome.exe" --chrome-mode=chrome-for-testing
npx remotion render does out/does.mp4 --browser-executable="C:/Program Files/Google/Chrome/Application/chrome.exe" --chrome-mode=chrome-for-testing --concurrency=4 --crf=18
```

Each film registers twice: `<id>` (with sound) and `<id>-silent`.

Things that cost time:

- `OffthreadVideo` threw "No frame found at position" on these files even after re-encoding. The engine uses `Video` from `@remotion/media` instead; keep it.
- A 15 s film takes about 3 minutes; shots with several `blurs` are the slow part.
- Long foreground commands died when the app session restarted. Start renders detached (`Start-Process` with output to a log file) and read the log.
- `tools/clean.py` bakes blur and a grade into a clip with ffmpeg. It was the first approach, is slow, and its grade is the rejected yellow one. The engine now blurs and grades live; use `clean.py` only as a reference.

## Sound (ElevenLabs, small)

`kit/audio/sfx_gen.py` generates short UI sounds with the ElevenLabs sound-generation API (one prompt per sound, skips files that exist, minimum length 0.5 s). The 26 generated sounds plus one lo-fi bed are in `kit/public/sfx/`. Veer wants almost none of them: the approved film uses only `text_pop` at 0.3 volume and no music. Set `COMPANY_BRAIN_ENV` to the `.env` path before running the script.

## Status

- **Done:** "it does." v3 (15 s): Gmail draft written, then finance summaries pasted into Google Docs. On the Drive as `final_it-does.mp4`. Not yet placed in the site's `A background job` slot.
- **Not built:** "it transcribes" (rec01-03), "it teaches" (rec08, rec09, plus the four unwatched recordings), and the three squares (rec04/05/07).
- **Open with Veer:** whether Lazur's voice stays or the films go fully silent; in the finance part the voice says "four finance mails" while the caption says "4 email summaries pasted".

## Credits

The kit started from the scaffold in `noamdorr/saas-product-demo-video` (MIT) and uses Remotion (check Remotion's licence terms for company use). `easings.ts` is from that scaffold. The site's own fonts (Clash Display, Open Sauce One) are loaded from `kit/public/fonts/`; copy them from `src/fonts/` in this repo before rendering.
