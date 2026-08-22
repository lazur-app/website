---
title: "Command Mode: voice commands that finish the work"
description: "Command Mode in dictation apps lets you tell the computer what to do, reply, shorten, change tone, instead of only transcribing speech. How Lazur uses it."
publishedAt: "2026-08-22"
author: "Lazur Team"
category: "Product"
cover: "waveform"
targetKeyword: "Command Mode dictation"
tldr:
  - "Command Mode is voice as instructions: ‘reply to this, keep it brief and professional,’ not ‘type the words I am saying.’"
  - "Wispr and Aqua are adding command-like features. Lazur treats Command Mode as the product, sitting on local STT plus Smart Rewrite."
  - "If you still translate thoughts into prompts after you dictate, you are using transcription, not a voice interface."
faq:
  - question: "What is Command Mode in dictation?"
    answer: "Command Mode lets you speak an instruction about the current context, reply, rewrite, change tone, shorten, instead of dictating the final sentence word for word. Lazur uses it as a voice layer on top of system-wide paste on macOS."
  - question: "Does Wispr Flow have Command Mode?"
    answer: "Wispr Flow has been moving from reliable voice input toward voice-to-action, including command and context features. Treat vendor docs as the source of truth for what shipped this month. Lazur’s Command Mode is built around intent plus the app you are in."
  - question: "How is Command Mode different from dictation?"
    answer: "Dictation captures speech as text. Command Mode treats speech as a task. You look at a Slack thread and say what should happen. The output is the reply, not a transcript of your instruction."
relatedSlugs:
  - "messy-speech-to-finished-writing"
  - "what-is-ambient-writing"
---

**Command Mode** is the difference between a dictation app and a [voice interface for work](/blog/what-is-ambient-writing). Dictation types what you said. Command Mode does what you meant: reply, reformat, change tone, keep it brief, using the message, email, or selection in front of you.

Lazur’s example is literal. You are looking at a thread and you say: “Reply to this, keep it brief and professional.” You do not have to compose the reply as prose first.

## Why this is the real race

Wispr can say dictate 4× faster than typing. Aqua can say let your voice do the writing. Both are entering **commands and context** because polished STT is table stakes.

If Lazur competes as “Wispr with nicer rewrite,” that gap closes. Command Mode is the brand-level promise: *thought → result*, not *thought → prompt → type → edit → send*.

Pro includes 50 Command Mode uses per month; Power is built for heavier command use. [Pricing](/pricing).

## Dictation vs command (same hotkey)

| You say | Dictation-style output | Command-style output |
| --- | --- | --- |
| “Reply and say Thursday works, time TBD, casual” | That sentence, cleaned up | A casual reply with those facts |
| “Make this shorter and less legal” | The instruction, on the page | The selection, rewritten |
| “Turn this into a Cursor prompt with error handling” | Spoken mush | A usable prompt |

More examples in [messy speech to finished writing](/blog/messy-speech-to-finished-writing). Developers: [AI dictation for developers](/blog/ai-dictation-for-developers).

## What Command Mode is not

It is not a chatbot window you context-switch into. Lazur stays [ambient](/blog/what-is-ambient-writing): one hotkey, cursor stays in Slack or Gmail. No “open Lazur and paste the thread.”

It is also not magic against secrets. Do not speak API keys. Treat the mic like Slack.

## Next step

Pick a real message sitting unread. Do not dictate the reply. Command it. If the tool types your instruction instead of the reply, you are still in transcription-land. [Download Lazur](/download) and run that test.
