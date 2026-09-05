---
title: "How to Dictate on a Mac (Voice to Text + Microphone Setup)"
description: "Turn on Mac dictation, allow the microphone, and start voice to text at the cursor. Covers Apple setup, shortcuts, and fixes when voice recognition fails."
publishedAt: "2026-07-15"
updatedAt: "2026-09-05"
author: "Lazur Team"
category: "How-to"
cover: "apps"
targetKeyword: "how to dictate on a Mac"
tldr:
  - "Voice to text on a Mac is live dictation at the cursor, not a website that uploads an audio file."
  - "Turn on System Settings → Keyboard → Dictation, allow the microphone, then start with Control twice or the mic key."
  - "If nothing appears, the input device or Microphone permission is usually wrong. Apple is enough for Notes and Mail; a system-wide app is better in Slack, Chrome, and Cursor."
faq:
  - question: "How do I use dictation on a Mac?"
    answer: "Open System Settings → Keyboard → Dictation and turn Dictation on. Allow the microphone under Privacy & Security → Microphone. Click into the field you will send from, start dictation (Control twice, the mic key, or your app’s hotkey), speak, then stop. An AI app like Lazur pastes speech to text at the cursor in any Mac app."
  - question: "How do I do voice to text on a Mac?"
    answer: "Voice to text on a Mac means live voice typing in the app you already have open. Enable Apple dictation or hold a system-wide hotkey, speak, and the words land at the cursor. It is not a speech-to-text website that asks you to upload a recording."
  - question: "What is the keyboard shortcut for dictation on Mac?"
    answer: "Apple dictation uses the shortcut you set under Keyboard → Dictation, usually a double-press of Control, the microphone key, or Fn. Lazur’s default is hold Control+Space, and you can remap it. Put the cursor in the real field first, then start."
  - question: "Why is Mac dictation or voice recognition not working?"
    answer: "Check three things: Dictation is on, the correct microphone is selected as the input device, and the app has Microphone permission. If it works in Notes but not Slack or Chrome, Apple dictation is failing in that field. A system-wide AI app pastes into those windows instead."
  - question: "Does Mac dictation work in Slack and Chrome?"
    answer: "Apple dictation works in many native fields but is inconsistent in Slack, Gmail in Chrome, Cursor, and other third-party apps. A system-wide AI dictation app pastes at the cursor in those apps and in native Mac apps."
howto:
  name: "How to dictate on a Mac"
  steps:
    - name: "Turn on Apple dictation"
      text: "Open System Settings → Keyboard → Dictation and turn Dictation on. Pick a shortcut such as Control twice or the microphone key."
    - name: "Allow the microphone"
      text: "Open System Settings → Privacy & Security → Microphone and enable the apps that will listen. Confirm the input device under Sound → Input."
    - name: "Place the cursor"
      text: "Click into Slack, Mail, Docs, Cursor, or any text field where the words should land."
    - name: "Start dictation and speak"
      text: "Use Apple’s shortcut or hold your AI app’s hotkey. Speak in full thoughts, then stop and read the paste once before you send."
    - name: "Fix voice recognition if nothing appears"
      text: "If Mac dictation stays silent, switch the input device, re-allow Microphone permission, and retry in Notes. If Notes works but Slack does not, use a system-wide app."
relatedSlugs:
  - "how-to-write-emails-by-voice"
  - "apple-dictation-vs-ai-dictation"
  - "on-device-speech-to-text-mac"
---

How to dictate on a Mac: turn on Apple dictation, allow the microphone, click into a text field, and speak. That is live **voice to text** at the cursor, not a converter website that uploads audio. Apple’s built-in option is enough for Notes and Mail. If you write all day in Slack, Gmail, Notion, and Cursor, a system-wide AI app such as [Lazur](/download) is the more reliable path.

## Voice to text on a Mac

**Voice to text** here means the words appear where you are already typing. You hold a shortcut, speak, and release. You do not export a file, wait on a webpage, or copy from a scratch pad.

Three labels people search all mean this loop:

- **Mac dictation** — Apple’s built-in speech to text.
- **Voice to text Mac** — the same job, often from people who used Google Docs or Windows before.
- **Mac voice recognition** — usually the same feature, or the microphone not being heard.

If you wanted a file transcribed, that is a different product. This page is live voice typing.

## Turn on Apple dictation

1. Open **System Settings**.
2. Go to **Keyboard → Dictation**.
3. Turn **Dictation** on.
4. Set a shortcut: double-press **Control**, press the **microphone** key, or use **Fn** if that is what your keyboard shows.
5. Leave **Languages** on the language you actually speak.

That is the free “speech to text” switch. For the privacy split between local and cloud, see [on-device speech to text on Mac](/blog/on-device-speech-to-text-mac).

## Microphone and voice recognition

Dictation cannot start if macOS is listening to the wrong input, or if the app is blocked.

1. Open **System Settings → Sound → Input**.
2. Select the mic you will use (MacBook built-in, AirPods, or a desk mic). Watch the input level while you talk. If the bar does not move, the Mac is not hearing you.
3. Open **System Settings → Privacy & Security → Microphone**.
4. Enable **Dictation** (and any third-party dictation app). If you use an app that pastes system-wide, also allow **Accessibility**.

AirPods work. A desk mic is steadier in a noisy office. Whispering drops accuracy on every engine, Apple included.

## Dictation shortcuts

| Shortcut | What it does |
| --- | --- |
| Control twice | Default Apple dictation start/stop on many Macs |
| Microphone key | Starts Apple dictation on keyboards that have a mic key |
| Fn (if set) | Alternate Apple shortcut under Keyboard → Dictation |
| Control+Space (hold) | Lazur’s default hold-to-talk hotkey, remappable |

Put the cursor in the real field first, then start. Starting in an empty desktop or the wrong window is the usual “it did nothing” report.

## Step-by-step: dictate on macOS

1. **Microphone.** Confirm input device and Microphone permission.
2. **Cursor.** Click into the field you will send from, not Notes you will copy later.
3. **Hotkey.** Start Apple dictation, or hold your AI app’s shortcut.
4. **Speak in thoughts.** “Follow up with Priya tomorrow about the invoice” beats “follow… up… with…”
5. **Stop and scan.** Read the paste once. Fix names. Send.

That loop is how you [write emails by voice](/blog/how-to-write-emails-by-voice) without sounding like a transcript.

## Mac dictation not working

Work through these in order. Most “voice recognition” searches are one of these.

**Dictation is on, nothing appears.** Sound → Input is on the wrong device, or the input meter is flat. Switch to built-in, speak, then retry AirPods.

**Microphone permission is off.** Privacy & Security → Microphone. Toggle the app off and on. Quit and reopen the app after you change it.

**Dictation is grayed out.** A Screen Time or managed-device restriction can lock the pane. Check **System Settings → Screen Time → Content & Privacy**. On a work Mac, ask IT.

**Wrong language.** Keyboard → Dictation → Languages. A Spanish or Hindi profile will mangle English names, and the reverse.

**Works in Notes, fails in Slack or Chrome.** Apple dictation is inconsistent in third-party fields. That is the usual reason people install a system-wide app.

**iMac or older Mac, “OSX dictation.”** The pane is still Keyboard → Dictation. On very old macOS the labels differ, but microphone permission and the shortcut are the same idea.

## When Apple is enough, and when it is not

**Apple dictation** is free, on-device on recent macOS versions, and fine for short notes in Mail, Notes, and Messages.

**AI dictation apps** add rewrite, a personal dictionary, and one hotkey that works in every window. That is [voice writing](/blog/what-is-voice-writing), not just a transcript.

If you are choosing between the two, read [Apple dictation vs AI dictation](/blog/apple-dictation-vs-ai-dictation) or the product split in [Lazur vs Apple Dictation](/compare/lazur-vs-apple-dictation).

## Tips that actually improve accuracy

- Pause between ideas so punctuation can land.
- Add product names and teammates to a personal dictionary when the app supports it.
- Dictate the *intent* (“polite decline, offer next Tuesday”) and let rewrite handle the prose. That is where Lazur’s Smart Rewrite earns the setup.
- Score **time to send**, including edits, not the first raw dump. That is the metric in our [2026 dictation app guide](/blog/best-ai-dictation-apps-2026).

## Common mistakes

**Dictating into Notes, then copying.** You add friction. Paste at the cursor in the real app.

**Starting dictation before the field is focused.** The shortcut fires, the Mac hears you, and the words have nowhere to go.

**Judging the tool in the wrong app.** If Apple fails in Slack, that is a field problem, not proof that voice typing does not work on a Mac.

## Next step

If Apple dictation already covers Mail and Notes, keep it. If you live in Slack, Linear, and Cursor, install a system-wide app. [Download Lazur for Mac](/download), 7-day Pro trial, no credit card.
