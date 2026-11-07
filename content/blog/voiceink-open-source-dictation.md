---
title: >-
  VoiceInk dictation on Mac: open-source setup, pricing and macOS requirements
  for 2026
description: >-
  VoiceInk dictation on Mac: what the open-source app costs, which macOS
  versions it needs, how to set it up, and how it compares with Apple Dictation.
targetKeyword: VoiceInk dictation
category: Guide
cover: privacy
tldr:
  - >-
    VoiceInk is an open-source dictation app that transcribes speech on your
    Mac. It costs a one-time $25 to $49, or you can build it free from source.
  - >-
    Check the macOS requirement before you buy. The GitHub README says macOS
    15.0 or later, while the official site says 14.4 or later.
  - >-
    Apple Dictation is built in and stops after 30 seconds without speech.
    VoiceInk gives you more control over models and shortcuts, but it does not
    accept outside pull requests.
faq:
  - question: Is VoiceInk free?
    answer: >-
      No, not as a compiled app. The official site lists one-time tiers: Solo at
      $25 for 1 Mac, Personal at $39 for up to 2 Macs, and Extended at $49 for
      up to 3 Macs. You can also build it from source with Xcode at no cost, but
      a third-party review says that route gets no auto-updates or priority
      support.
  - question: Does VoiceInk send my voice recordings to the internet?
    answer: >-
      According to the official site, VoiceInk processes all voice transcription
      locally on your device. The optional Cloud Enhancement sends only the
      transcribed text, not the voice audio. Downloading a speech model needs an
      internet connection, so check the settings page and turn off any cloud
      option you do not want.
  - question: Which Macs can run VoiceInk?
    answer: >-
      The official site says Apple Silicon Macs only, running macOS 14.4 or
      later, with 8GB of RAM recommended. The GitHub README says macOS 15.0 or
      later. Because the two disagree, confirm the minimum with the maker before
      you pay.
  - question: Is VoiceInk better than Apple Dictation?
    answer: >-
      It depends on what you need. Apple Dictation is already on your Mac, has
      no length limit, and stops after 30 seconds without speech. VoiceInk gives
      you control over the speech model, a dictionary, and a hotkey you choose,
      at a one-time cost.
  - question: Can I contribute code to VoiceInk?
    answer: >-
      Not through pull requests right now. The README says the project is not
      accepting pull requests at this time. You can report bugs, suggest
      features, and flag documentation problems through the GitHub issues page.
relatedSlugs:
  - on-device-speech-to-text-mac
  - apple-dictation-vs-ai-dictation
  - mac-dictation-not-working-fixes
  - best-ai-dictation-apps-2026
stats:
  - value: 153 WPM
    label: >-
      English speech entry, against 52 WPM on the keyboard, in a 2016 iPhone
      short-message study
    sourceUrl: 'https://arxiv.org/abs/1608.07323'
    sourceTitle: 'Ruan et al., Comparing Speech and Keyboard Text Entry (arXiv:1608.07323)'
  - value: 30 seconds
    label: of no detected speech before Apple Dictation stops on its own
    sourceUrl: 'https://support.apple.com/guide/mac-help/use-dictation-mh40584/mac'
    sourceTitle: 'Apple Support: Use Dictation on Mac'
  - value: $25
    label: 'one-time price for VoiceInk''s Solo tier, covering 1 Mac'
    sourceUrl: 'https://tryvoiceink.com/'
    sourceTitle: VoiceInk official site
  - value: 52 WPM
    label: >-
      average typing speed across 168,000 volunteers in Cambridge's keystroke
      study
    sourceUrl: 'https://www.cam.ac.uk/research/news/what-makes-a-faster-typist'
    sourceTitle: 'University of Cambridge: What makes a faster typist?'
sources:
  - title: 'VoiceInk README (GitHub raw, main branch)'
    url: 'https://raw.githubusercontent.com/Beingpax/VoiceInk/main/README.md'
    publisher: GitHub (Beingpax/VoiceInk)
    accessedAt: '2026-11-07'
  - title: VoiceInk official site
    url: 'https://tryvoiceink.com/'
    publisher: VoiceInk
    accessedAt: '2026-11-07'
  - title: Use Dictation on Mac
    url: 'https://support.apple.com/guide/mac-help/use-dictation-mh40584/mac'
    publisher: Apple Support
    accessedAt: '2026-11-07'
  - title: >-
      Comparing Speech and Keyboard Text Entry for Short Messages in Two
      Languages on Touchscreen Phones
    url: 'https://arxiv.org/abs/1608.07323'
    publisher: arXiv (Ruan et al.)
    accessedAt: '2026-11-07'
  - title: What makes a faster typist?
    url: 'https://www.cam.ac.uk/research/news/what-makes-a-faster-typist'
    publisher: University of Cambridge
    accessedAt: '2026-11-07'
  - title: 'VoiceInk Review: Open-Source Mac Dictation, Free to Build or $25 Once'
    url: 'https://www.getvoibe.com/resources/voiceink-review/'
    publisher: Voibe
    accessedAt: '2026-11-07'
  - title: 'VoiceInk Review: Local macOS AI Dictation'
    url: 'https://www.pragma-code.de/en/blog-voiceink-ai-dictation-mac-local-whisper'
    publisher: Pragma-Code
    accessedAt: '2026-11-07'
  - title: VoiceInk on OpenAlternative
    url: 'https://openalternative.co/voiceink'
    publisher: OpenAlternative
    accessedAt: '2026-11-07'
  - title: Lazur pricing
    url: 'https://lazur.app/pricing'
    publisher: Lazur
    accessedAt: '2026-11-07'
howto:
  name: Set up VoiceInk dictation on Mac
  steps:
    - name: Download or build VoiceInk
      text: >-
        Download VoiceInk from tryvoiceink.com, or build it from source with
        Xcode. Drag the app into your Applications folder.
    - name: Open Preferences
      text: Open VoiceInk and press Command comma to open Preferences.
    - name: Download a speech model
      text: >-
        Go to the Models tab and download one model. Start with a smaller model
        and move up only if accuracy is not good enough.
    - name: Choose a hotkey
      text: >-
        Pick a hotkey such as double Fn, Right Option, or a mouse thumb button.
        Choose a key no other app uses for something important.
    - name: Add dictionary terms
      text: >-
        Add names, brands, and technical terms to the dictionary so they
        transcribe correctly.
    - name: Set the microphone
      text: >-
        If you use a closed laptop with an external display, select a dedicated
        external USB or webcam microphone in the settings before you test.
    - name: Test in TextEdit
      text: >-
        Open TextEdit, hold your hotkey, say two sentences, release the key, and
        check the text for names, numbers, and dates.
publishedAt: '2026-08-22'
updatedAt: '2026-11-06'
author: Lazur Team
images:
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/voiceink-open-source-dictation/voiceink-dictation-1-748436.jpg
    width: 1280
    height: 853
    alt: >-
      Person speaking at a laptop on a desk, the setting for VoiceInk dictation
      on a Mac
    caption: Dictating a draft instead of typing it
    keywords:
      - VoiceInk dictation
      - VoiceInk
      - dictation
      - person dictating laptop
      - Mac
      - Lazur
    credit:
      name: StartupStockPhotos
      url: 'https://pixabay.com/users/StartupStockPhotos-690514/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/student-typing-keyboard-text-849825/'
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/voiceink-open-source-dictation/voiceink-dictation-2-bcb66a.jpg
    width: 1280
    height: 853
    alt: >-
      Man working on a laptop at a desk while VoiceInk dictation turns speech
      into text
    caption: A typical Mac workspace for dictation
    keywords:
      - VoiceInk dictation
      - VoiceInk
      - dictation
      - man laptop desk work
      - Mac
      - Lazur
    credit:
      name: StockSnap
      url: 'https://pixabay.com/users/StockSnap-894430/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/people-man-guy-beard-laptop-2605980/'
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/voiceink-open-source-dictation/voiceink-dictation-3-721233.jpg
    width: 1280
    height: 717
    alt: >-
      Microphone on a desk beside a laptop, a useful setup for clear VoiceInk
      dictation
    caption: Input quality matters for accurate text
    keywords:
      - VoiceInk dictation
      - VoiceInk
      - dictation
      - microphone desk workspace
      - Mac
      - Lazur
    credit:
      name: irfan282
      url: 'https://pixabay.com/users/irfan282-26903260/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/podcast-microphone-audio-radio-8520409/'
generator:
  by: scripts/content
  model: haiku
  runId: daily-2026-11-06
  version: 1
heroImage:
  url: >-
    https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/voiceink-open-source-dictation/voiceink-dictation-1-748436.jpg
  width: 1280
  height: 853
  alt: >-
    Person speaking at a laptop on a desk, the setting for VoiceInk dictation on
    a Mac
  caption: Dictating a draft instead of typing it
  keywords:
    - VoiceInk dictation
    - VoiceInk
    - dictation
    - person dictating laptop
    - Mac
    - Lazur
  credit:
    name: StartupStockPhotos
    url: 'https://pixabay.com/users/StartupStockPhotos-690514/'
    source: Pixabay
    sourceUrl: 'https://pixabay.com/photos/student-typing-keyboard-text-849825/'
keywordHits:
  target: VoiceInk dictation
  inTitle: true
  inH1: true
  inDescription: true
  inIntro: true
  bodyCount: 8
  secondary: {}
---

VoiceInk is an open-source dictation app for Mac that transcribes your speech on the Mac itself, using Whisper and Parakeet speech models. You can buy a compiled copy for a one-time $25 to $49, or build it from source with Xcode at no cost.

This guide covers what VoiceInk is, what it costs, which Macs it runs on, how to set it up, and how it compares with Apple's built-in Dictation. Some facts that matter most, like the minimum macOS version and the latest release, conflict across sources. Where they do, this page says so and tells you how to check.

## What VoiceInk is and who it is for

VoiceInk is a native macOS app. Its code sits on GitHub under the GNU General Public License v3.0. That means you can read it, change it, and build it yourself. The project's README describes it as an app that \"transcribes what you say to text almost instantly.\"

VoiceInk suits a few kinds of people:

- People who handle sensitive text, such as lawyers, clinicians, or writers with unpublished drafts, and want to know exactly where audio goes.
- People who would rather pay once than add another monthly subscription.
- People who like to read settings, tweak models, and keep their own tools.

It suits people less well if you want to install an app and never think about it again. You will spend a little time on models, microphones, and updates. That is the trade.

One detail matters before you buy. The README says the project \"is not accepting pull requests at this time.\" Bug reports, feature suggestions, and documentation fixes go through the GitHub issues page. Build instructions live in a file called BUILDING.md. So you can report problems, but outside contributors cannot merge code changes right now.

## What VoiceInk costs in 2026

The official site at tryvoiceink.com lists three one-time tiers. Each paid tier includes lifetime updates and a 14-day money-back guarantee.

| Option | Price | Macs covered | Notes |
| --- | --- | --- | --- |
| Solo | $25 | 1 | Lowest price for one machine |
| Personal | $39 | Up to 2 | Marked "Most picked" and "Best value" on the site |
| Extended | $49 | Up to 3 | For three machines |
| Build from source | $0 | Your own | Needs Xcode. No auto-updates or priority support, per a third-party review |

The tiers reward you if you own more than one Mac. Two Solo licenses cost $50 in total. The Personal tier covers two machines for $39, so it is the cheaper option. Three Macs on the Extended tier cost $49, while three Solo licenses would cost $75.

The site also has a "Download Free Trial" button. It does not say how long the trial runs or what it limits. Check that before you plan around it.

Prices change. Check the pricing page before you buy, because the figures above reflect the site as of this update.

## Which Macs can run VoiceInk

This is where the sources disagree, so read this part carefully.

- The official site says VoiceInk needs an Apple silicon Mac. Intel Macs are not on the list.
- The official site says macOS 14.4 or later, and recommends 8GB of RAM.
- The GitHub README says macOS 15.0 or later.
- Most third-party pages repeat the 14.4 figure.

If you run macOS 14.4 to 14.x, the README and the site give you different answers. Ask the maker before you pay, so you do not buy a license for a version you cannot run. To check your own setup, open the Apple menu > About This Mac. That window shows your chip and your macOS version.

Memory is the second question. A competing app's review says a 16GB Mac handles the large Whisper model comfortably, while an 8GB machine may see noticeable delays. That is a competitor's claim, and the review does not benchmark it. Start with a smaller model, time a few dictations, and decide later whether a bigger model is worth the wait.

The sources also disagree on the latest release. A Pragma-Code review dated 26 September 2026 names v2.20, released on 19 September 2026, as the current version. OpenAlternative lists v2.25 but shows no release date. Check the releases page on GitHub before you buy, and compare it with the version you download.

## How VoiceInk handles your voice

The official site says: \"VoiceInk processes all voice transcription locally on your device.\" The site also says the local models use the Neural Engine on Apple silicon.

There is one optional exception. Cloud Enhancement can send transcribed text to a service. The site says it does not send the voice audio. So the setting controls what leaves your Mac. With Cloud Enhancement off, transcription stays on the device. With it on, the text leaves the device.

Two practical notes follow from that:

- Downloading a speech model needs an internet connection. After the model is on disk, the transcription itself runs on your Mac.
- "Local" describes transcription. It does not automatically describe every feature. Open the settings and look for anything labeled cloud. Turn off what you do not need.

For legal or medical text, this difference matters a lot. For a quick note to a colleague, it may matter less. Decide based on what you dictate, not on the word "local" alone.

## Setting up VoiceInk on Mac, step by step

These steps follow the official site and the install path in the Pragma-Code review.

1. Download VoiceInk from tryvoiceink.com, or build it from source with Xcode. Drag the app into your Applications folder.
2. Open VoiceInk and press ⌘, to open Preferences.
3. Go to the Models tab and download one model. Start with a smaller one, since it downloads faster and runs quicker on modest hardware.
4. Choose your hotkey. The reviews name double Fn, Right Option, and a mouse thumb button, which was added in v2.20.
5. Add names, brands, and technical terms to the dictionary. Examples include your company name, a client's name, or a product term your spell checker always flags.
6. Review Context Awareness and decide whether you want it on.
7. Test it. Open TextEdit, hold your hotkey, say two sentences, release the key, and read the result.

If the text does not appear, check the microphone input in the settings first. That single setting causes more problems than anything else, especially on laptops with the lid closed.

## Push-to-talk, hotkeys and clamshell mode

The Pragma-Code review recommends push-to-talk. Its phrase is "hold to speak, release to insert." You speak while the key is down, and the text lands when you let go. This model suits dictation well. You do not leave the mic running in a mode you forgot about.

Pick a key that no other app uses for something important. Double Fn is a common choice in the reviews. Right Option is a second option. If another app already uses the key you want, change it in VoiceInk's settings instead of fighting over it.

Clamshell mode needs its own step. If you close the lid and run an external display, the built-in microphone may not be the one you want. Pragma-Code advises selecting a dedicated external USB or webcam microphone in the VoiceInk settings. Set the input before you judge the accuracy. Otherwise you will blame the model for a mic problem.

Here is a rough time comparison. At the 153 words per minute from the 2016 study, a 300-word draft takes about 2 minutes. At the 52 words per minute typing average, the same draft takes about 5.8 minutes. Those numbers come from a phone study. They give you a rough guide, not a promise for your Mac.

## VoiceInk compared with Apple Dictation

Apple Dictation is already on your Mac. Turn it on in System Settings > Keyboard > Dictation. Start it with the Microphone key, the Dictation shortcut, or Edit > Start Dictation. You can change the shortcut in the same settings pane.

| Question | VoiceInk | Apple Dictation |
| --- | --- | --- |
| Cost | $25 to $49 one-time, or free to build | Built into macOS |
| Source code | Public on GitHub, GPL-3.0 | Apple's code is not public |
| Chip and macOS | Apple silicon only. macOS 14.4 or 15.0, depending on source | Apple Intelligence enhancements need M3 or later, 12GB RAM, English only |
| Pauses and length | Not covered in the sources | Stops after 30 seconds without speech. No timeout for length |
| Shortcut | Set inside the app | Set in System Settings > Keyboard > Dictation |
| Where transcription runs | On the device, per the official site | Apple's help page does not say whether standard Dictation needs internet |

Read the table with three points in mind.

First, the 30-second rule. If you dictate in short bursts, you will rarely notice it. If you pause to think while reading a long note aloud, the session can end on its own. Apple's help page confirms that you can dictate text of any length, but silence ends the session.

Second, the chip rule. Apple Intelligence enhancements need an M3 or later Mac with at least 12GB of unified memory. They are English only. On an older Apple silicon Mac, you get standard Dictation without those enhancements. That is one reason some people look at third-party options.

Third, Voice Control. Apple's help says Voice Control replaces standard Dictation while it is on. If dictation suddenly stops working, check whether Voice Control is running.

Here is the simple verdict. If you need text in a box, and you want nothing else to install, Apple Dictation may be enough. If you want to pick the speech model, keep a custom dictionary, and own the code, VoiceInk gives you more control. You can compare the wider set of options on the [Apple Dictation alternatives page](/alternatives/apple-dictation).

## How fast is dictation compared with typing?

The most cited speed number comes from a 2016 study by Ruan, Wobbrock, Liou, Ng, and Landay. Participants entered English messages by speech at 153 words per minute. On the keyboard they managed 52 words per minute. That is about 2.93 times faster. The test used an iPhone 6 Plus and a speech engine called Baidu Deep Speech 2. It did not test a Mac, and it used short messages.

Errors cut both ways. During entry, speech made fewer errors that the writer had to fix. The corrected error rate was 5.30% for speech and 11.22% for the keyboard. But the final text kept slightly more mistakes that nobody fixed. The uncorrected rate was 1.30% for speech and 0.79% for the keyboard.

In other words, dictation drafts faster, and you still need to read the result. Names, numbers, and dates are where the slips tend to hide. Build a habit of checking those three things before you send.

Cambridge's larger study measured typing, not dictation. It looked at 136 million keystrokes from 168,000 volunteers in more than 200 countries. The average was 52 words per minute, and the fastest participants reached 120 words per minute. Use it as a baseline for typing, not as a head-to-head test.

Your own rate depends on how fast you speak, how clean your microphone is, and how often you correct the text. Time yourself for one working day. Count the words you dictate and the fixes you make. That number will tell you more than any study.

## Mistakes people make with open-source dictation

1. Choosing the biggest model on an 8GB Mac. Start small, time a few real dictations, and move up only if the accuracy is not good enough.
2. Assuming "local" means no network at all. Model downloads need internet, and Cloud Enhancement is optional. Read the settings page once.
3. Skipping the version check. Compare the latest GitHub release with the version you download, because the sources disagree.
4. Building from source and expecting automatic updates. A third-party review says the source route gets no auto-updates. You will rebuild by hand when a new release comes out.
5. Reading dictated text once and sending it. The 2016 study found more uncorrected errors in speech output, so proofread names, numbers, and dates before anything leaves your desk.
6. Leaving the built-in microphone in charge with the lid closed. Set the external microphone first, or the accuracy will look worse than the model really is.
7. Expecting to add features through pull requests. The README says the project is not accepting pull requests right now. If you need a change, file an issue or fork the project and keep your own build.

## Who should choose VoiceInk, and who should not

Choose VoiceInk if you want to read and build the code, pay once, and keep transcription on your Mac. You should also be comfortable with models, microphone settings, and updates. You can read more about the alternatives on the [VoiceInk alternatives page](/alternatives/voiceink).

Choose Apple Dictation if you mostly send short messages, you already have the Mac you need, and you want nothing extra installed. It works well for quick replies. It stops after 30 seconds of silence, so it is less suited to long, thoughtful dictation with pauses.

Choose a different kind of tool if you want a voice assistant that can answer questions about what is on your screen. That is a different job from dictation, and VoiceInk is built for dictation. The next section covers the one product on this site that does both.

Before you commit to any option, run a short test. Dictate five real messages in the apps you use every day. Note which words come out wrong. Then check whether a dictionary entry fixes them. If the same mistakes keep coming back, the problem is probably the model, the microphone, or the hotkey setup, not your speaking.

## Where Lazur fits if you want more than dictation

Lazur is a voice assistant for Mac that lives in the notch. It also dictates. Hold fn to dictate clean, formatted text at the cursor in any app. Dictation includes snippets, a personal dictionary, and clipboard slots. It is unlimited on both the Pro and Power plans.

Pro costs $18 a month, or $15 a month billed annually, and includes 150 AI actions. Power costs $120 a month, or $96 a month billed annually, and includes 1,000 AI actions. There is a 3-day Pro trial with no credit card. The trial starts when you first open the app. Lazur's [pricing page](/pricing) has the current terms.

On privacy, Lazur listens and looks at the screen only while you hold the shortcut. Audio and the screenshot go to AI providers to answer your question, and they are not stored. Content is never used to train AI models.

If you try both apps, plan your keys. Lazur uses fn for dictation, and VoiceInk's suggested hotkeys include double Fn. Give each app its own key. Lazur also does not click buttons or operate other apps for you. It answers out loud and points at things on screen, so you still do the clicking. You can compare the two in more detail on the [Lazur vs VoiceInk page](/compare/lazur-vs-voiceink), or [download Lazur](/download) and try it on the same five messages.
