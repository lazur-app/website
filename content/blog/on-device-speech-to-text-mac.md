---
title: 'On-device speech to text Mac: what private dictation means in 2026'
description: >-
  On-device speech to text Mac keeps the recognition step on your computer.
  Learn what private dictation covers, what it does not, and how to test it.
targetKeyword: on-device speech to text Mac
category: Guide
cover: privacy
tldr:
  - >-
    On-device speech to text on a Mac runs the recognition step on your
    computer, so the audio for that step does not go to a server.
  - >-
    In Apple's dictation, System Settings > Keyboard > Dictation and the Share
    Audio Recordings choice decide where audio can go.
  - >-
    On-device covers recognition only. Text in your apps, screen context, and
    transcript storage each need their own checks.
faq:
  - question: What is on-device speech to text on a Mac?
    answer: >-
      It is speech recognition that runs on the Mac's own chip and memory. The
      audio for that step stays on the computer, so nothing needs to be uploaded
      to transcribe it. Cleanup steps such as punctuation may run somewhere
      else, so check each one.
  - question: Is Apple dictation on a Mac processed on the device?
    answer: >-
      Apple's Mac Help says general dictation is processed on your device and
      not sent to Siri servers when the Keyboard setting applies. Check System
      Settings > Keyboard > Dictation. Apple's pages I read do not give a full
      list of languages with that behavior, so test your own language.
  - question: Does on-device dictation mean nothing is stored?
    answer: >-
      No. On-device describes where recognition runs. It does not cover text you
      paste into apps, sync or backup copies, or screen context from an
      assistant. Ask about transcript storage too, because the Apple pages I
      read do not say how long Mac transcripts are kept.
relatedSlugs:
  - share-dictation-audio-apple-setting
  - apple-dictation-vs-ai-dictation
  - enhanced-dictation-mac-requirements
  - private-ai-assistants-on-mac
stats:
  - value: 12GB
    label: >-
      Minimum unified memory on a Mac for the macOS 27 dictation cleanup model,
      with an M3 or later chip
    sourceUrl: 'https://support.apple.com/guide/mac-help/use-dictation-mh40584/mac'
    sourceTitle: 'Dictate messages and documents on Mac: Apple Support'
  - value: 153 vs 52 WPM
    label: >-
      English speech input versus keyboard entry on touchscreen phones, in a
      2016-era study
    sourceUrl: 'https://arxiv.org/abs/1608.07323'
    sourceTitle: >-
      Comparing Speech and Keyboard Text Entry for Short Messages in Two
      Languages on Touchscreen Phones (arXiv:1608.07323)
  - value: 5.30% vs 11.22%
    label: 'Corrected error rate, speech versus keyboard, in the same phone study'
    sourceUrl: 'https://arxiv.org/abs/1608.07323'
    sourceTitle: >-
      Comparing Speech and Keyboard Text Entry for Short Messages in Two
      Languages on Touchscreen Phones (arXiv:1608.07323)
  - value: '680,000 hours'
    label: >-
      Multilingual and multitask training data behind the Whisper speech
      recognition model
    sourceUrl: 'https://arxiv.org/abs/2212.04356'
    sourceTitle: 'Radford et al., Whisper speech recognition paper (arXiv:2212.04356)'
sources:
  - title: 'Dictate messages and documents on Mac: Apple Support'
    url: 'https://support.apple.com/guide/mac-help/use-dictation-mh40584/mac'
    publisher: Apple
    accessedAt: '2026-11-07'
  - title: 'Our longstanding privacy commitment with Siri: Apple Newsroom'
    url: >-
      https://www.apple.com/newsroom/2025/01/our-longstanding-privacy-commitment-with-siri/
    publisher: Apple Newsroom
    accessedAt: '2026-11-07'
  - title: >-
      Comparing Speech and Keyboard Text Entry for Short Messages in Two
      Languages on Touchscreen Phones (arXiv:1608.07323)
    url: 'https://arxiv.org/abs/1608.07323'
    publisher: arXiv
    accessedAt: '2026-11-07'
  - title: 'Radford et al., Whisper speech recognition paper (arXiv:2212.04356)'
    url: 'https://arxiv.org/abs/2212.04356'
    publisher: arXiv
    accessedAt: '2026-11-07'
howto:
  name: Check where your Mac dictation audio goes
  steps:
    - name: Confirm dictation settings
      text: >-
        Open System Settings > Keyboard > Dictation, confirm dictation is on,
        and note the language it uses.
    - name: Check Share Audio Recordings
      text: >-
        Open System Settings, search for Share Audio Recordings, and decline it
        if it is on. Apple's Mac Help says sharing lets Apple store audio of
        Siri and Dictation interactions.
    - name: Run an offline dictation test
      text: >-
        Turn Wi-Fi off in Control Center, dictate two or three sentences into
        Notes, and check that the text appears. Then turn Wi-Fi back on and
        record the macOS version and the date.
publishedAt: '2026-07-29'
updatedAt: '2026-11-06'
author: Lazur Team
images:
  - url: >-
      https://images.lazur.app/content-images/blog/on-device-speech-to-text-mac/on-device-speech-to-text-mac-1-10ee35.jpg
    width: 1280
    height: 853
    alt: >-
      Person speaking near a laptop while working at a desk, the setting for
      on-device speech to text Mac
    caption: 'Dictating at a desk, where the recognition step can stay on the Mac.'
    keywords:
      - on-device speech to text Mac
      - on-device
      - speech
      - to
      - person dictating laptop
      - Mac
      - Lazur
    credit:
      name: StartupStockPhotos
      url: 'https://pixabay.com/users/StartupStockPhotos-690514/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/student-typing-keyboard-text-849825/'
  - url: >-
      https://images.lazur.app/content-images/blog/on-device-speech-to-text-mac/on-device-speech-to-text-mac-2-348f2f.jpg
    width: 1280
    height: 850
    alt: 'Laptop open on a tidy office desk, showing a Mac used for dictated writing'
    caption: 'A Mac on a desk, the usual place for everyday dictation.'
    keywords:
      - on-device speech to text Mac
      - on-device
      - speech
      - to
      - laptop desk office
      - Mac
      - Lazur
    credit:
      name: Firmbee
      url: 'https://pixabay.com/users/Firmbee-663163/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/office-notes-notepad-entrepreneur-620817/'
  - url: >-
      https://images.lazur.app/content-images/blog/on-device-speech-to-text-mac/on-device-speech-to-text-mac-3-be2d57.jpg
    width: 1280
    height: 854
    alt: Microphone placed beside a notebook and laptop during a work session
    caption: Checking where your voice goes before you dictate client text.
    keywords:
      - on-device speech to text Mac
      - on-device
      - speech
      - to
      - microphone desk work
      - Mac
      - Lazur
    credit:
      name: jhenning
      url: 'https://pixabay.com/users/jhenning-8658480/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/laptop-conference-table-mouse-work-7978588/'
generator:
  by: scripts/content
  model: haiku
  runId: daily-2026-11-06
  version: 1
heroImage:
  url: >-
    https://images.lazur.app/content-images/blog/on-device-speech-to-text-mac/on-device-speech-to-text-mac-1-10ee35.jpg
  width: 1280
  height: 853
  alt: >-
    Person speaking near a laptop while working at a desk, the setting for
    on-device speech to text Mac
  caption: 'Dictating at a desk, where the recognition step can stay on the Mac.'
  keywords:
    - on-device speech to text Mac
    - on-device
    - speech
    - to
    - person dictating laptop
    - Mac
    - Lazur
  credit:
    name: StartupStockPhotos
    url: 'https://pixabay.com/users/StartupStockPhotos-690514/'
    source: Pixabay
    sourceUrl: 'https://pixabay.com/photos/student-typing-keyboard-text-849825/'
keywordHits:
  target: on-device speech to text Mac
  inTitle: true
  inH1: true
  inDescription: true
  inIntro: true
  bodyCount: 5
  secondary: {}
---

On-device speech to text on a Mac means the model that turns your voice into words runs on your computer. The audio for that step does not have to go to a server, and that is the core of what people mean by private dictation.

Apple's Mac Help says general dictation can be "processed on your device and not sent to Siri servers." That sentence applies only under certain settings, and it does not answer every privacy question. Here is how to check it, what it covers, and where it stops.

## What on-device speech to text means on a Mac

Dictation has two steps. A model listens to sound and produces words. Then the words land in a text field, a note, or a message. Privacy questions mostly concern the first step, because that is where your voice is.

With on-device speech to text, the first step runs on the Mac. The microphone audio stays on the machine while the model works on it. Open models such as Whisper are built to run this way. The Whisper paper by Radford and colleagues says the model was trained on 680,000 hours of multilingual and multitask supervision. That number tells you how much data went into training. It says nothing about where your speech goes at dictation time. The place where processing happens decides that.

Cloud speech to text works differently. The app records audio, uploads it to a server, waits for text to come back, then pastes it. Your speed depends on your network. Your audio lives on a server for as long as the vendor's policy allows, and that policy is the thing to read.

Keep one definition in your notes. On-device means the recognition step runs locally. It does not mean nothing gets stored, copied, or synced anywhere.

## Where your voice goes in Apple's Mac dictation

Apple's dictation on a Mac has two parts in current versions. The first is recognition, which turns sound into words. The second is cleanup, which adjusts spelling, punctuation, and capitalization.

For cleanup, Apple's [Mac Help page on dictation](https://support.apple.com/guide/mac-help/use-dictation-mh40584/mac) describes an on-device model in macOS 27. It improves spelling, punctuation, and capitalization when Apple Intelligence is on. The page says this is available in English on Mac models with an M3 chip or later and at least 12GB of unified memory. If your Mac has an M1 or M2 chip, or less than 12GB of memory, those terms do not cover it. Check your chip and memory with About This Mac from the Apple menu.

For recognition, the same page says that when the Keyboard setting applies, voice inputs and transcripts for general dictation are processed on your device and not sent to Siri servers.

Apple's [January 2025 newsroom statement on Siri](https://www.apple.com/newsroom/2025/01/our-longstanding-privacy-commitment-with-siri/) says Apple does not retain audio recordings of Siri interactions unless users explicitly opt in. It also says that on capable devices, the audio of requests is processed on the Neural Engine. Audio goes to Apple only if you choose to share it. Read the fine print before you quote it. That statement is about iPhone. Its footnote limits the on-device claim to iPhone with A12 Bionic or later, and it says speech models must be downloaded. Treat it as background. For Mac behavior, rely on the Mac Help page.

## Check the two settings that decide where audio goes

Start with the dictation switch. Open System Settings > Keyboard > Dictation. Confirm that dictation is on, and note which language it uses. Apple's pages I could read do not give a full list of languages with on-device support, so test yours instead of assuming.

Next, check Share Audio Recordings. Apple's Mac Help warns that clicking Share Audio Recordings lets Apple store audio of Siri and Dictation interactions from your Mac. If you never clicked it, that route is closed. If you are unsure, open System Settings, search for "Share Audio Recordings," and decline if it is on. The setting name and location can change between macOS versions, so search rather than hunting through menus.

Here is a worked example. Take a MacBook Air with an M3 chip and 16GB of memory, running macOS 27 in English. A paralegal dictates a client update into Mail. Before doing that, she checks three things. Dictation is on. The language is English. Share Audio Recordings is off. Then she runs the offline test described below. If all four checks pass, she can describe the recognition step accurately to her firm. She still proofreads the email before sending it.

Older Apple pages call the offline option Enhanced Dictation. The current Mac Help page uses different labels, so match what you see on your own Mac rather than the names in old screenshots.

## Is on-device dictation as accurate as cloud?

The honest answer is that I could not find a current test of Mac dictation that compares on-device and cloud recognition on the same audio. The best study I opened is older, and it uses phones. Ruan and colleagues compared speech and keyboard entry for short messages on touchscreen phones, in English and Mandarin Chinese ([arXiv 1608.07323](https://arxiv.org/abs/1608.07323)). It is a useful baseline for speed and error types. It is not a verdict on Mac dictation or on current models.

For English, speech input ran at 153 words per minute. The keyboard ran at 52. The paper reports speech as 2.93 times faster. At that speed, a 300-word draft takes about two minutes to say, while the same draft takes nearly six minutes to type at the keyboard rate in the study.

The error numbers need a closer read. Corrected errors were 5.30% for speech and 11.22% for the keyboard. Uncorrected errors were 1.30% for speech and 0.79% for the keyboard.

In plain terms, speech produced fewer mistakes you had to fix. It also left slightly more mistakes that got through without a fix. For a contract, a clinical note, or a grant report, the uncorrected rate matters most. Proofread dictated text before you send it, whatever your privacy setting says. Secondary sources sometimes quote different error figures for this study, so check the paper before you put these numbers in a policy.

## On-device and cloud dictation side by side

Use this table as a checklist. It describes the typical split, not a promise about any one app. Ask each vendor to confirm every row.

| Question | On-device recognition | Cloud recognition |
| --- | --- | --- |
| Where the model runs | On your Mac | On a vendor server |
| Audio leaves the Mac for recognition | No | Yes, for each request |
| Works with Wi-Fi off | Often, if the speech model is already downloaded | No |
| Who can access the audio | You, plus anyone with access to the Mac | You, plus the vendor and anyone its policy allows |
| Cleanup or rewrite | May run locally, so check the feature | Usually runs in the cloud |
| Speed | Depends on chip and memory | Depends on network and server load |

The Wi-Fi row is the easiest to test yourself. The cleanup row is the one people skip. A dictation app can keep recognition local and still send your draft to a cloud model for polish. That is a second data path, and it deserves its own answer.

## What on-device dictation does not protect

On-device recognition is a narrow promise. It covers one step. Several other places can still hold your words or your screen.

**The text after it appears.** Once words land in Mail, Slack, or a document, the text lives in that app. Its sync and backup settings decide where copies go. Recognition privacy ends at the cursor.

**Screen context.** An assistant that reads your screen creates a second data path. Ask what it captures, when it captures, and where the screenshot goes.

**Cloud cleanup.** Pasting dictated text into a cloud chat to tidy it up sends that text out. The dictation was local, but the cleanup was not.

**Transcript storage.** The Apple pages I read do not clearly say how long Mac dictation transcripts are kept. Some third-party guides give specific retention periods. I could not verify them, so do not build a policy on them. Ask the vendor or Apple directly.

**Language coverage.** The macOS 27 cleanup model is described for English. Other languages may follow a different path, or none. Test the language you actually use.

**The first download.** Apple's newsroom footnote says speech models must be downloaded. Download them while you are online, then test offline before you travel.

## Mistakes people make with private dictation

- **Trusting one test.** Settings and macOS versions change. Repeat the check after major updates.
- **Mixing up iPhone and Mac claims.** Apple's January 2025 statement is about iPhone. Quote the Mac Help page for Mac behavior.
- **Turning on polish features without knowing where text goes.** Read what each cleanup or rewrite option sends.
- **Skipping proofreading because the voice step is local.** Uncorrected errors still happen, and the study shows they can slip through.
- **Assuming "AI" means cloud, or local.** Neither word tells you where the audio goes. Ask.
- **Using a single answer for every use case.** A personal note and a client filing do not need the same rules. Write a rule for each.

## A five-minute test you can run on your Mac

1. Open System Settings > Keyboard > Dictation and confirm dictation is on. Note the language.
2. Open Control Center from the menu bar and turn Wi-Fi off.
3. Open Notes and dictate two or three sentences with a name and a number in them, such as "Send the Q3 report to Dana Park by 14 March."
4. Check the output. If the text appears, recognition ran without the network. If it does not, the speech model may not be downloaded yet, so go back online and download it.
5. Turn Wi-Fi back on, repeat the sentence once, and write down the macOS version and the date.

This test proves one thing. The recognition step worked without a network connection. It does not prove that the transcript, the cleanup, or any copy of the text stays on the Mac. Say that clearly when someone asks you what the test showed.

## Questions to ask before you trust any dictation app

Send these to the vendor before you use the app on sensitive work. Write the answers down with the date.

- Where does the speech step run, on the Mac or on a server?
- Is audio stored, and if so, for how long?
- Are transcripts stored, and where?
- Does cleanup or rewrite send text, audio, or both to a cloud model?
- Can you turn off the cloud step for sensitive work?

If a vendor answers with a marketing phrase instead of a yes or no, treat that as an answer too. Keep the question in writing until you get a clear reply.

## Where Lazur fits

Lazur is a voice assistant for the Mac that lives in the notch. Hold fn to dictate clean, formatted text at the cursor in any app. Snippets, a personal dictionary, and clipboard slots are included, and dictation is unlimited on both plans. Pro is $18 a month, or $15 a month billed annually. Power is $120 a month, or $96 a month billed annually. See [pricing](/pricing) for the current details.

Lazur listens and looks at your screen only while you hold the shortcut. When you hold ⌥ ⌘ to ask about something on screen, Lazur sends the audio and a screenshot to AI providers so it can answer. Lazur states that these are not stored, and that content is never used to train AI models. Lazur guides, points, answers out loud, and types text. It does not click buttons or operate other apps for you.

For dictation, read Lazur's privacy policy on lazur.app before you use it on client or patient text. Then run the five-minute test above and check the answers against the questions in this guide. You can start with the [Lazur download](/download).

## Next steps

If you are setting up dictation for the first time, read [how to dictate on a Mac](/blog/how-to-dictate-on-mac) for the menu steps. If you also use an assistant that reads your screen, read [private AI assistants on Mac](/blog/private-ai-assistants-on-mac) for the screen side of the privacy question.
