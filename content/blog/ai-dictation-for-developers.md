---
title: "AI dictation for developers: PRs, Slack, and Cursor prompts"
description: "AI dictation for developers works for PR descriptions, Slack, comments, and Cursor prompts, not for typing code syntax. How to use voice writing in an engineering workflow."
publishedAt: "2026-08-12"
author: "Lazur Team"
category: "How-to"
cover: "code"
targetKeyword: "AI dictation for developers"
tldr:
  - "Developers should dictate prose (PRs, tickets, prompts, Slack), not source code."
  - "System-wide paste matters: the hotkey has to work in Cursor, Linear, GitHub, and Terminal-adjacent tools."
  - "Voice is often the fastest way to dump context into an AI coding agent."
faq:
  - question: "Can developers use AI dictation to write code?"
    answer: "You can dictate comments, commit messages, and prompts. Dictating raw syntax is usually slower than typing. The win is the written work around the code: PRs, RFCs, Slack, and agent prompts."
  - question: "Does Lazur work in Cursor and VS Code?"
    answer: "Yes. Lazur is system-wide on macOS, so the same hotkey pastes at the cursor in Cursor, VS Code, Xcode, GitHub in the browser, Linear, and Slack."
  - question: "Is dictation useful for ChatGPT or Cursor prompts?"
    answer: "Yes. Talking through the bug, the files involved, and the constraint often produces a better prompt than a short typed sentence. You review once, then run the agent."
relatedSlugs:
  - "what-is-voice-writing"
  - "how-to-dictate-on-mac"
---

AI dictation for developers is for the **writing around the code**: pull requests, tickets, design docs, Slack, and prompts into Cursor or ChatGPT. It is not a replacement for typing syntax. Used that way, voice is one of the highest-leverage habits you can add to a Mac engineering setup.

## What to dictate (and what not to)

**Dictate.** PR summaries, review replies, RFC sections, incident notes, standup updates, and long agent prompts.

**Type.** Brackets, types, refactors, and anything where the keyboard’s precision beats speech.

If [dictation is faster than typing](/blog/is-dictation-faster-than-typing) for your prose, you will feel it on the third PR of the day, not in a hello-world file.

## Cursor, VS Code, and the rest of the IDE

The requirement is **system-wide paste**. If dictation only works well in Notes, it will not survive a real stack. Lazur uses a hold-to-talk hotkey and pastes at the cursor in Cursor, VS Code, Xcode, and browser-based GitHub.

A useful prompt pattern, spoken:

> “In `billing.ts`, the webhook can double-charge if Stripe retries. Write a failing test and a guard that’s idempotent on `event.id`. Don’t change the public API.”

That is [voice writing](/blog/what-is-voice-writing) aimed at an agent, not a transcript of your muttering.

## Comments and commit messages

Speak the *why*: “Retry because the upstream 429s for 2 seconds; sleep with jitter.” Rewrite can turn that into a comment or a conventional commit body. Skip dictating `feat:` prefixes if you already have a template, add those with the keyboard.

## Team norms

- Don’t dictate secrets. Treat the mic like a Slack channel.
- Add internal names (services, customers, acronyms) to a personal dictionary.
- Privacy: STT can be [on-device](/blog/on-device-speech-to-text-mac); know when rewrite leaves the machine.

## Next step

Tomorrow, write one PR description and one Cursor prompt by voice. If you still spend longer editing than speaking, you are using a transcriber. [Download Lazur for Mac](/download) and run both in the apps you actually ship from.
