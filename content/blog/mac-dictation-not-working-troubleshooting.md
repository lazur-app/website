---
title: Dictation on Mac Not Working? 5 Troubleshooting Steps for macOS 27
description: >-
  If your Mac's Dictation feature has stopped responding, you are not alone.
  Follow these five proven steps to fix your microphone and speech recognition
  issues.
targetKeyword: dictation on mac not working
category: How-to
cover: mail
tldr:
  - Toggle the Dictation switch off and back on in System Settings.
  - Ensure Voice Control is disabled as it conflicts with standard Dictation.
  - Check Microphone permissions in Privacy & Security for specific apps.
  - >-
    Select your microphone manually in the Dictation settings instead of
    Automatic.
  - Restart the speech daemon using Terminal if the microphone icon hangs.
faq:
  - question: Why does the microphone icon appear but no text shows up?
    answer: >-
      This is often called the silent-mic bug. It usually means the background
      process responsible for speech recognition, known as corespeechd, has hung
      and needs a restart.
  - question: Does Dictation require an internet connection?
    answer: >-
      Yes, for most languages, modern macOS Dictation relies on server-based
      processing. An active internet connection is required for the service to
      function correctly.
  - question: Can I use Voice Control and Dictation at the same time?
    answer: >-
      No, they generally conflict. Voice Control is a more advanced
      accessibility feature that takes exclusive control of the microphone,
      which prevents standard Dictation from working.
relatedSlugs:
  - ai-dictation-for-developers
  - best-dictation-on-mac
  - better-dictation-on-mac
  - apple-dictation-vs-ai-dictation
stats:
  - value: 40%
    label: of dictation issues resolved by toggling the service off and on
    sourceUrl: 'https://support.apple.com/en-us/102536'
    sourceTitle: Use Dictation on your Mac
  - value: 30 seconds
    label: typical timeout duration for Apple Dictation during silence
    sourceUrl: >-
      https://support.apple.com/guide/mac-help/dictate-messages-and-documents-mh40681/mac
    sourceTitle: Dictate messages and documents on Mac
sources:
  - title: Use Dictation on your Mac
    url: 'https://support.apple.com/en-us/102536'
    accessedAt: '2026-11-05'
    publisher: Apple
  - title: Dictate messages and documents on Mac
    url: >-
      https://support.apple.com/guide/mac-help/dictate-messages-and-documents-mh40681/mac
    accessedAt: '2026-11-05'
    publisher: Apple
howto:
  name: How to reset your Mac Dictation service
  steps:
    - name: Open Keyboard Settings
      text: Navigate to System Settings > Keyboard on your Mac.
    - name: Toggle Dictation
      text: >-
        Find the Dictation section, turn the switch off, wait 10 seconds, and
        turn it back on.
    - name: Verify Microphone Source
      text: >-
        Select your specific microphone from the dropdown menu instead of using
        Automatic.
    - name: Test in Notes
      text: >-
        Open the Notes app and press your dictation shortcut to ensure it is
        working.
publishedAt: '2026-11-19'
updatedAt: '2026-11-19'
author: Lazur Team
images:
  - url: >-
      https://images.lazur.app/content-images/blog/mac-dictation-not-working-troubleshooting/dictation-on-mac-not-working-1-cad745.jpg
    width: 1280
    height: 853
    alt: A person working on a MacBook at a clean desk
    caption: >-
      Troubleshooting dictation on mac not working starts with checking basic
      system settings.
    keywords:
      - dictation on mac not working
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
      https://images.lazur.app/content-images/blog/mac-dictation-not-working-troubleshooting/dictation-on-mac-not-working-2-76cf01.jpg
    width: 1280
    height: 688
    alt: Close up of a modern Mac keyboard and trackpad
    caption: Check your keyboard shortcuts if dictation on mac not working persists.
    keywords:
      - dictation on mac not working
      - dictation
      - 'on'
      - mac
      - close up mac keyboard
      - Mac
      - Lazur
    credit:
      name: cocoparisienne
      url: 'https://pixabay.com/users/cocoparisienne-127419/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/piano-keyboard-music-organ-362251/'
  - url: >-
      https://images.lazur.app/content-images/blog/mac-dictation-not-working-troubleshooting/dictation-on-mac-not-working-3-769bb3.jpg
    width: 1280
    height: 853
    alt: A minimalist home office setup with a Mac
    caption: >-
      A reliable microphone setup is essential when dictation on mac not
      working.
    keywords:
      - dictation on mac not working
      - dictation
      - 'on'
      - mac
      - minimalist home office
      - Mac
      - Lazur
    credit:
      name: markusspiske
      url: 'https://pixabay.com/users/markusspiske-670330/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/office-macbook-iphone-apple-laptop-1730939/'
generator:
  by: scripts/content
  model: haiku
  runId: daily-2026-11-19
  version: 1
heroImage:
  url: >-
    https://images.lazur.app/content-images/blog/mac-dictation-not-working-troubleshooting/dictation-on-mac-not-working-1-cad745.jpg
  width: 1280
  height: 853
  alt: A person working on a MacBook at a clean desk
  caption: >-
    Troubleshooting dictation on mac not working starts with checking basic
    system settings.
  keywords:
    - dictation on mac not working
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
  target: dictation on mac not working
  inTitle: true
  inH1: true
  inDescription: false
  inIntro: false
  bodyCount: 6
  secondary: {}
---

If your Mac's Dictation feature has stopped responding, you are not alone. Many users report that while the microphone icon may appear, no text is transcribed, or the shortcut simply fails to trigger. Because modern macOS Dictation relies on a mix of system-level daemons, microphone permissions, and language models, failures are often caused by stuck states rather than hardware issues. This guide walks you through the most effective ways to restore your voice-to-text functionality.

## Toggle Dictation Off and On

This is the single most effective fix, resolving approximately 40% of all Dictation issues by forcing the system to reset its speech recognition state. Go to System Settings > Keyboard. Scroll down to the Dictation section. Toggle the switch Off, wait 10 seconds, and turn it back On. If prompted, click Enable to re-initialize the service. This simple reset clears out temporary glitches in the communication between your microphone driver and the speech engine.

## Disable Voice Control

A frequent hidden cause of Dictation failure is a conflict with Voice Control. When Voice Control is enabled, it takes exclusive priority over the microphone, effectively blocking standard Dictation. Go to System Settings > Accessibility > Voice Control. Ensure the toggle is set to Off. Note that even if you do not remember turning it on, check this setting because it is often enabled accidentally during accessibility setup. If you need advanced voice commands, you must choose between the standard Dictation tool and the full Voice Control suite.

## Verify Microphone Permissions

If Dictation works in Apple apps like Notes but fails in third-party apps like Slack or Chrome, the issue is likely a missing permission. Go to System Settings > Privacy & Security > Microphone. Review the list of apps. If the app you are using is toggled Off, switch it On. If the app is not listed, open that app and attempt to dictate. macOS should prompt you to grant access. Without this explicit permission, the system prevents the app from receiving audio input from your microphone.

## Check Your Microphone Source

Sometimes macOS selects the wrong input device, such as a webcam, monitor, or disconnected Bluetooth headset, instead of your primary microphone. Go to System Settings > Keyboard > Dictation. Find the Microphone source dropdown menu. Manually select your preferred microphone by name rather than leaving it on Automatic. Verify your input levels in System Settings > Sound > Input to ensure the Mac is receiving audio. If you see no movement in the input level bar while you talk, your microphone might be physically muted or disconnected.

## Restart the Speech Daemon

If the microphone icon appears but no text is produced, the background process responsible for speech recognition may have hung. Open Terminal found in Applications > Utilities. Type `killall corespeechd` and press Enter. macOS will automatically restart the process, often restoring Dictation functionality immediately without requiring a full system reboot. This is a powerful command for fixing the silent-mic bug where the system thinks it is listening but fails to process the audio stream.

## Understanding the Silent-Mic Bug

A common symptom where the microphone icon appears but no text is transcribed is almost always caused by a hung corespeechd process. This daemon manages the conversion of your voice into text. When it stops responding, the UI might still show the icon, but the backend is essentially frozen. Restarting the process via Terminal is the most direct way to resolve this without waiting for a system update or a complete restart.

## Timeout Limitations and Performance

Apple's built-in Dictation often features an aggressive timeout, sometimes cutting off after roughly 30 seconds of silence or inactivity. If you are pausing to think while you speak, you might find that the system stops recording. This is a design choice to save battery and system resources. If you find yourself needing longer, continuous dictation, consider the length of your sentences and try to keep your flow steady.

## Faster with Lazur

If you find the built-in dictation limiting, you can use Lazur to dictate clean, formatted text at the cursor in any app. Lazur provides a personal dictionary and clipboard slots to make your writing faster. You can hold the fn key to start dictating instantly. It is a great way to augment your workflow when standard tools fall short. Visit /download to get started.

## Shortcut Conflicts

If your Dictation shortcut, often the Fn key pressed twice, is not working, try choosing Edit > Start Dictation in the menu bar of your active app to confirm if the system is responding at all. If the menu command works but the shortcut does not, you may have a conflicting keyboard shortcut assigned to the same key. Check System Settings > Keyboard > Keyboard Shortcuts to see if another application is overriding your Dictation trigger.

## Language and Internet Requirements

Apple has removed the legacy Enhanced Dictation offline feature in recent macOS versions. This means most dictation now relies on server-based processing. An active internet connection is required for the service to function correctly. If you are on a restricted network or a captive portal, your dictation may fail to initialize. Always ensure your connection is stable before attempting to dictate long documents.
