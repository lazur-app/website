---
title: "On-device speech to text on Mac: what private dictation actually means"
description: "On-device speech to text on Mac keeps audio on your computer. Learn how local STT differs from cloud dictation, and what Lazur sends when Smart Rewrite is on."
publishedAt: "2026-07-29"
author: "Lazur Team"
category: "Guide"
cover: "privacy"
targetKeyword: "on-device speech to text Mac"
tldr:
  - "On-device speech to text transcribes audio locally. Your voice does not have to leave the Mac for the words to appear."
  - "Rewrite and polish may still use the cloud as text, not audio, read the vendor’s policy."
  - "Lazur runs NVIDIA Parakeet STT on-device; Smart Rewrite sends text only when that feature is enabled."
faq:
  - question: "What is on-device speech to text on a Mac?"
    answer: "On-device speech to text (STT) converts your voice to words using a model that runs on the Mac itself, for example Whisper. Audio is processed locally, so the recording does not need to be uploaded for transcription."
  - question: "Is Lazur dictation private?"
    answer: "Speech-to-text runs locally on your Mac with NVIDIA Parakeet. Cloud AI is used for Smart Rewrite polish when enabled, and only text is sent, not the audio file. See Lazur’s privacy policy for the current details."
  - question: "Is Super Whisper more private than cloud dictation apps?"
    answer: "Super Whisper is built around local transcription, which is a strong privacy posture for STT. Compare rewrite, system-wide paste, and cloud features before you assume one app never leaves the device. Read Lazur vs Super Whisper for a side-by-side."
relatedSlugs:
  - "best-ai-dictation-apps-2026"
  - "what-is-voice-writing"
---

Speech to text on a Mac can mean a website converter, or live dictation at the cursor. **On-device speech to text** means transcription happens on your computer. The audio from the microphone is processed locally (often with a Whisper model). That is different from cloud dictation, where the recording is uploaded so a remote model can return text.

If you want the setup steps first, use [how to use dictation on a Mac](/blog/how-to-dictate-on-mac).

This is the privacy question security-conscious teams actually ask: *where does the voice go?*

## On-device STT vs cloud dictation

| | On-device STT | Cloud STT |
| --- | --- | --- |
| Audio | Stays on the Mac | Uploaded to a vendor |
| Latency | Depends on your chip | Depends on network |
| Offline | Often works | Usually needs internet |
| Rewrite / polish | May still be a separate cloud step | Often bundled |

Apple’s own dictation has moved more processing on-device on recent macOS versions. Third-party apps vary. Always check whether **rewrite** is local, cloud, or optional.

## What Lazur does

Lazur transcribes with **NVIDIA Parakeet on the Mac**. Smart Rewrite, the step that turns a spoken dump into [voice writing](/blog/what-is-voice-writing), uses cloud AI **when enabled**, and it sends **text**, not the audio clip.

That split is what you can explain in a security review: STT is local; polish is an optional text API.

For the product comparison with a privacy-first competitor, see [Lazur vs Super Whisper](/compare/lazur-vs-super-whisper).

## What to ask any vendor

- Is raw audio stored? For how long?
- Is STT on-device, cloud, or hybrid?
- If rewrite is cloud, is audio uploaded or only text?
- Can rewrite be disabled for sensitive work?
- Where are servers located, and is there a DPA?

If a marketing page only says “AI” or “encrypted,” keep asking.

## When local STT is the right default

- Legal, health, and finance drafts you do not want in an audio pipeline.
- Airplanes and poor networks.
- Companies that already banned consumer cloud recorders.

You may still want cloud rewrite for client email tone. The point is **choice**, not a slogan. Super Whisper is a credible local-first STT tool with lighter rewrite. Lazur is built for people who want local transcription *and* send-ready output in Slack, Mail, and Cursor.

## Next step

Read [our privacy policy](/privacy), then run a real message through [Lazur on Mac](/download). If rewrite is off, you are exercising the local STT path. If it is on, you are sending text for polish, know which mode you are in.
