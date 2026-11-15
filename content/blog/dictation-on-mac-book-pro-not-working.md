---
title: Dictation on Mac Book Pro Not Working? Fixes for macOS 27
description: >-
  If dictation on your MacBook Pro is not working, the problem is usually a
  settings conflict or a hung process. Follow these steps to restore your voice
  input.
targetKeyword: dictation on mac book pro not working
category: How-to
cover: code
tldr:
  - Toggle Dictation off and on in System Settings to refresh the engine.
  - Check Microphone permissions in Privacy and Security for the specific app.
  - Disable Voice Control as it can block standard Dictation.
  - >-
    Restart the speech recognition process using the Terminal command killall
    corespeechd.
faq:
  - question: Why does the microphone icon appear but no text shows up?
    answer: >-
      This usually means the background speech recognition process, known as
      corespeechd, has hung. You can fix this by opening Terminal and running
      the command killall corespeechd.
  - question: Does Dictation work in every app on my Mac?
    answer: >-
      Most apps support macOS system dictation, but some applications like
      Microsoft Word use their own proprietary engines. If you face issues in
      one specific app, check that app's internal settings.
  - question: Why is my dictation accuracy so low?
    answer: >-
      Accuracy is often affected by background noise or microphone quality.
      Using a wired or USB microphone usually provides better results than
      Bluetooth headsets, which force a lower audio quality profile.
relatedSlugs:
  - dictation-on-mac-not-working-fixes
  - dictation-on-mac-not-working-troubleshooting-tips
  - dictation-on-mac-not-working-troubleshooting
  - how-to-fix-dictation-not-working-mac
stats:
  - value: 40%
    label: Percentage of issues solved by toggling Dictation off and on
    sourceUrl: 'https://embertype.com/blog/apple-dictation-not-working-mac/'
    sourceTitle: embertype.com
  - value: 30 Seconds
    label: Architectural timeout limit for Apple Dictation
    sourceUrl: 'https://usevoicy.com/blog/mac-dictation-not-working/'
    sourceTitle: usevoicy.com
  - value: 97.4%
    label: Highest transcription accuracy with wired/USB headsets
    sourceUrl: 'https://whisperly.io/mac-dictation-accuracy'
    sourceTitle: whisperly.io
sources:
  - title: bossai.tech
    url: 'https://bossai.tech/blog/dictation-not-working-mac'
  - title: spokenly.app
    url: 'https://spokenly.app/blog/mac-dictation-not-working'
  - title: usevoicy.com
    url: 'https://usevoicy.com/blog/mac-dictation-not-working/'
  - title: apple.com
    url: 'https://support.apple.com/en-ie/guide/mac-help/mchlc480652b/mac'
  - title: whisperly.io
    url: 'https://whisperly.io/mac-dictation-accuracy'
  - title: embertype.com
    url: 'https://embertype.com/blog/apple-dictation-not-working-mac/'
  - title: reddit.com
    url: >-
      https://www.reddit.com/r/AIToolsTipsNews/comments/1tdpa68/mac_dictation_not_working_here_are_the_8_fixes/
howto:
  name: How to Reset the Speech Recognition Daemon
  steps:
    - name: Open Terminal
      text: >-
        Press Command and Space to open Spotlight, type Terminal, and press
        Enter.
    - name: Run the kill command
      text: Type killall corespeechd into the Terminal window and press Enter.
    - name: Restart dictation
      text: >-
        Try using your dictation shortcut again to see if the microphone icon
        responds correctly.
publishedAt: '2026-11-15'
updatedAt: '2026-11-15'
author: Lazur Team
images:
  - url: >-
      https://images.lazur.app/content-images/blog/dictation-on-mac-book-pro-not-working/dictation-on-mac-book-pro-not-working-1-0b00fd.jpg
    width: 1280
    height: 853
    alt: A person using a MacBook Pro in a well-lit office setting.
    caption: >-
      When dictation on mac book pro not working, check your system settings
      first.
    keywords:
      - dictation on mac book pro not working
      - dictation
      - 'on'
      - mac
      - person working on macbook
      - Mac
      - Lazur
    credit:
      name: StockSnap
      url: 'https://pixabay.com/users/StockSnap-894430/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/laptop-apple-macbook-computer-2562361/'
  - url: >-
      https://images.lazur.app/content-images/blog/dictation-on-mac-book-pro-not-working/dictation-on-mac-book-pro-not-working-2-1a47be.jpg
    width: 1280
    height: 914
    alt: A clean desk setup with a keyboard and a MacBook Pro.
    caption: Hardware issues are rare compared to software configuration conflicts.
    keywords:
      - dictation on mac book pro not working
      - dictation
      - 'on'
      - mac
      - modern desk setup
      - Mac
      - Lazur
    credit:
      name: janeb13
      url: 'https://pixabay.com/users/janeb13-725943/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/computer-pc-apple-business-1185567/'
  - url: >-
      https://images.lazur.app/content-images/blog/dictation-on-mac-book-pro-not-working/dictation-on-mac-book-pro-not-working-3-9683a0.jpg
    width: 1280
    height: 853
    alt: A focused professional typing on a laptop in a quiet room.
    caption: Clear audio is key to high transcription accuracy.
    keywords:
      - dictation on mac book pro not working
      - dictation
      - 'on'
      - mac
      - focused professional working
      - Mac
      - Lazur
    credit:
      name: SnapwireSnaps
      url: 'https://pixabay.com/users/SnapwireSnaps-692569/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/man-work-desk-business-person-597178/'
generator:
  by: scripts/content
  model: haiku
  runId: daily-2026-11-15
  version: 1
heroImage:
  url: >-
    https://images.lazur.app/content-images/blog/dictation-on-mac-book-pro-not-working/dictation-on-mac-book-pro-not-working-1-0b00fd.jpg
  width: 1280
  height: 853
  alt: A person using a MacBook Pro in a well-lit office setting.
  caption: >-
    When dictation on mac book pro not working, check your system settings
    first.
  keywords:
    - dictation on mac book pro not working
    - dictation
    - 'on'
    - mac
    - person working on macbook
    - Mac
    - Lazur
  credit:
    name: StockSnap
    url: 'https://pixabay.com/users/StockSnap-894430/'
    source: Pixabay
    sourceUrl: 'https://pixabay.com/photos/laptop-apple-macbook-computer-2562361/'
keywordHits:
  target: dictation on mac book pro not working
  inTitle: true
  inH1: true
  inDescription: false
  inIntro: false
  bodyCount: 4
  secondary: {}
---

If dictation on your MacBook Pro is not working, the issue is rarely a hardware failure. In most cases, it is a configuration conflict, a permission setting, or a software glitch following a macOS update. Troubleshooting requires a systematic approach to isolate whether the problem lies with the system, the application, or your input source. 

## Quick Diagnosis for Dictation Issues

Identifying the specific symptom is the first step toward a fix. If you see no response when you trigger the shortcut, the feature is likely toggled off or the shortcut has been remapped. If the microphone icon appears but no text is transcribed, the speech recognition process, known as corespeechd, is likely hung. If it works in some apps but not others, this is almost always a per-app microphone permission issue. Poor accuracy is typically related to microphone quality, background noise, or a language and region mismatch.

## Toggle Dictation Off and On

This is the most effective first step. Go to System Settings, then select Keyboard. Scroll down to the Dictation section. Toggle the switch to Off. Wait for about 10 seconds to allow the system to clear its cache. Toggle it back to On. This simple action reinitializes the speech engine and resolves approximately 40% of issues. It forces the system to re-verify your language settings and microphone availability.

## Disable Voice Control

Many users enable Voice Control to assist with accessibility, but it can interfere with standard Dictation. If Voice Control is active, it takes exclusive control of the microphone, which silently blocks standard Dictation requests. Check System Settings, then go to Accessibility, and select Voice Control. Ensure it is turned Off. If you need both features, remember that they often compete for the same system resources and hardware access.

## Check Microphone Permissions

macOS requires explicit permission for every application to use the microphone. If dictation fails in a specific app, that app may have been denied access. Go to System Settings, then Privacy and Security, and select Microphone. Look for the application you are using, such as Slack, Chrome, or Microsoft Word. Ensure the toggle is switched to On. You must restart the app after changing this setting for it to take effect.

## Verify Your Microphone Source

macOS may be trying to use a disconnected or low-quality microphone. This often happens if you have a monitor with a built-in mic or a Bluetooth headset connected. In System Settings, go to Keyboard and check the Microphone source dropdown. For testing purposes, always select your Internal Microphone to rule out peripheral issues. If the internal mic works, you know the problem is with your external device or its connection.

## Reset the Speech Daemon

If the microphone icon appears but nothing happens, the background process may have crashed. You can force the system to restart the recognition process. Open Terminal, which you can find via Spotlight. Type the command killall corespeechd and press Enter. This stops the hung process and forces macOS to restart it. This is a common solution for users who experience intermittent freezing during long dictation sessions.

## Understanding Dictation Limitations

Apple Dictation has an architectural timeout limit of 30 seconds. It will stop automatically if no speech is detected for this duration. This can be frustrating if you are pausing to think about your next sentence. If you need longer, continuous dictation, you may need to adjust your workflow or use a third-party tool. 

## The Bluetooth Codec Tax

When using Bluetooth headsets like AirPods for dictation, macOS forces a hands-free profile. This restricts audio quality to 8 to 24 kHz, which is significantly lower than the standard 44 kHz used for music. This reduction in quality can degrade recognition accuracy. If your dictation is consistently inaccurate, switch to a wired or USB microphone to see if the quality improves. In testing, wired headsets provide the highest transcription accuracy, reaching up to 97.4%.

## App Specific Dictation Engines

Some applications, such as Microsoft Word, use their own proprietary dictation engines rather than the macOS system engine. If dictation fails only in these apps, check the app's internal settings rather than system-wide settings. These apps often have their own microphone selection and language preferences that override your system defaults.

## Shortcut Conflicts

If you use tools like Karabiner-Elements, BetterTouchTool, or Raycast, they may be intercepting the Fn key or your chosen shortcut before it reaches the system. Check the settings of these third-party utilities to ensure they are not hijacking your dictation trigger. Try disabling them temporarily to see if dictation starts working again.

## Language Model Issues

If you recently updated macOS, the language model files may be corrupted or partially downloaded. Adding a second language in System Settings, Keyboard, Dictation, and Languages can sometimes force a fresh download of the necessary speech files. This refreshes the underlying data that the system uses to interpret your voice.

## Faster with Lazur

If you find yourself needing more power than basic system dictation, you can [download](/download) Lazur. Lazur helps you get work done in any app by acting as a voice assistant that lives in the notch. You can ask it to draft text or explain complex tasks. It listens only while you hold the shortcut, keeping your data private. Ask Lazur to walk you through troubleshooting steps if you are stuck or need help navigating your settings.

## Final Checks

If you have tried all these steps and dictation on your MacBook Pro is still not working, consider a restart of your entire machine. A full reboot clears temporary system files and resets peripheral drivers that might be causing a conflict. If the issue persists after a reboot, check if a recent macOS update introduced a bug that requires a patch. Keep your software updated to the latest version to ensure you have the most recent fixes for system-wide features.
