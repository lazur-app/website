---
title: 'Dictation on MacBook Pro Not Working: Troubleshooting Steps for macOS 27'
description: >-
  Learn why dictation on your MacBook Pro is not working and how to fix
  microphone, shortcut, and permission issues quickly.
targetKeyword: dictation on macbook pro not working
category: How-to
cover: code
tldr:
  - Toggle Dictation off and on in System Settings to reset the service.
  - Ensure Voice Control is disabled as it conflicts with standard Dictation.
  - Check Microphone permissions for individual apps in Privacy and Security.
  - >-
    Use the Terminal command killall corespeechd to restart the speech daemon if
    it hangs.
faq:
  - question: Why does my Mac stop dictating after a few seconds?
    answer: >-
      Standard Apple Dictation often times out after approximately 30 seconds of
      silence or a pause in speech. If it stops prematurely, ensure your
      microphone is not being muted by background noise or a faulty connection.
  - question: Does Voice Control interfere with Dictation?
    answer: >-
      Yes. Voice Control and standard Dictation cannot run simultaneously. If
      Voice Control is enabled in Accessibility settings, it will take priority
      over the microphone and prevent standard Dictation from functioning.
  - question: How do I know if my microphone is the problem?
    answer: >-
      Open the Sound settings or an app like Voice Memos. If you cannot see the
      input level meter moving when you speak, your hardware or the selected
      input device is likely the issue.
relatedSlugs:
  - ai-dictation-for-developers
  - best-ai-dictation-apps-2026
  - mac-dictation-not-working-fixes
  - how-to-dictate-on-mac
stats:
  - value: 85-90%
    label: Typical accuracy range for Apple Dictation
    sourceUrl: >-
      https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGcyccadHbyuRXhaXOQjZhi9uCt-Qy01_A6r1wVoUl8kKLsKAsZ8aS2scEyRWl8n0w_MVC1P-NC1CqRPDtgekemZDVJwo_tgA59bylR4S6GsrvIIa3PZv7L_MR4u_z6J4ar4bAvsAo=
    sourceTitle: 'Whisperly.io: Microphone Quality & Accuracy Study'
  - value: 2.93x
    label: Speed advantage of speech-to-text over mobile typing
    sourceUrl: >-
      https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQG21bYbco6nTXWOiUtd-BX7PQ6gEyLWcnZOJTXWVKXIhBl6gIOfXhOqDha4bB_9J2zfyGi7o3sOOUBTY6n0d9etfzlHozjTL-039EhQTLAsqU9kNjlQAxtBTMbZllG3AcyH1jkzQzMUvqIYtsTJMK1fkbZ0RqGFNA==
    sourceTitle: 'Lazur.app: Speech vs. Typing Accuracy Study'
  - value: 30 seconds
    label: Standard timeout duration for Apple Dictation
    sourceUrl: >-
      https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQF_7cL54MN-BBa1k_gROvVcu0Bx71YAZf87xrrgSJEJYxp9M5sAG9mpCdgkRDUt8oZHR6d1Btq2j3pcAvsdNhwOj6hm8GXRCv2WTkZ1YkamaNDpiRaxgNaXJbrdjXufqbq_fpMrX1GB9GYL7RjK9PPK
    sourceTitle: 'Quillflow.app: Accuracy & Time Limit Constraints'
sources:
  - title: 'Apple Support: If Dictation on Mac doesn''t work as expected'
    url: >-
      https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEze65trxg6cuACiAgNiJk2AqlqpNXHFJ1wqjrK_0gaXqwIL2zH5KSK7Ju3HKoCFYo5wmXkBKgLJpl70HwoUPBkvHMMGBOgx7GXZ7oKXauhLBwWV1r30dShaJx7ma64OlUgMHcVHFZzgpbpBQxYkE6C0VHwecS_FSVjwg==
  - title: 'Voicedash.ai: 12 Ways to Fix Apple Dictation'
    url: >-
      https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQFfpC9wkvh71YmDYfLGA_nyrCDauMe07-PUhwqatnNlYZ0CttdjlDhvUzkFo5fYvMOFGjKYqsA7U0NY5-JK3R_A7wvqjVgIe19qxD1DQ_rAkz0xfhxlY4HgmkhufLMzbaUadeZ67fFEU-5b
  - title: 'Getvoibe.com: Common Causes for Dictation Issues'
    url: >-
      https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQGsN3t_KLor076qSSkirrPH9OoLV_zaGzOfkczI3J87r0PNw111AAn0MMT0Zt-l8ZvA6flQnMxCm8uUHBmtcdXz1dLnV8Eh7HFRvAO3CTu-LMdrLLghcPotKDtlmROIvQdb3uV7UtpWOVEHgRoAWmmU1d_03OIfj7E=
howto:
  name: How to Reset Dictation on macOS
  steps:
    - name: Access System Settings
      text: Open the Apple menu and select System Settings.
    - name: Navigate to Keyboard
      text: Select the Keyboard tab in the left-hand sidebar.
    - name: Toggle Dictation
      text: >-
        Find the Dictation section and toggle the switch to off. Wait ten
        seconds, then toggle it back on.
    - name: Check Shortcut
      text: Confirm the shortcut key matches your preference in the same menu.
publishedAt: '2026-11-13'
updatedAt: '2026-11-13'
author: Lazur Team
images:
  - url: >-
      https://images.lazur.app/content-images/blog/dictation-not-working-on-macbook-pro/dictation-on-macbook-pro-not-working-1-e1bcfb.jpg
    width: 1280
    height: 853
    alt: A person working on a MacBook Pro at a clean desk setup.
    caption: >-
      When dictation on your MacBook Pro is not working, start by checking your
      system settings.
    keywords:
      - dictation on macbook pro not working
      - dictation
      - 'on'
      - macbook
      - person using macbook pro
      - Mac
      - Lazur
    credit:
      name: Alexas_Fotos
      url: 'https://pixabay.com/users/Alexas_Fotos-686414/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/per-contra-on-the-other-hand-2783713/'
  - url: >-
      https://images.lazur.app/content-images/blog/dictation-not-working-on-macbook-pro/dictation-on-macbook-pro-not-working-2-190c0b.jpg
    width: 1280
    height: 853
    alt: Close up of a modern MacBook Pro showing the sleek aluminum chassis.
    caption: >-
      Hardware issues are rare, but microphone obstructions can cause input
      failure.
    keywords:
      - dictation on macbook pro not working
      - dictation
      - 'on'
      - macbook
      - macbook microphone close up
      - Mac
      - Lazur
    credit:
      name: Pexels
      url: 'https://pixabay.com/users/Pexels-2286921/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/audio-microphone-bokeh-lights-1851517/'
  - url: >-
      https://images.lazur.app/content-images/blog/dictation-not-working-on-macbook-pro/dictation-on-macbook-pro-not-working-3-59cf83.jpg
    width: 1280
    height: 853
    alt: A professional focused on their screen while using a keyboard.
    caption: Troubleshooting your audio settings can restore your workflow quickly.
    keywords:
      - dictation on macbook pro not working
      - dictation
      - 'on'
      - macbook
      - person focused at computer
      - Mac
      - Lazur
    credit:
      name: cp17
      url: 'https://pixabay.com/users/cp17-1035078/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/fox-wildlife-animal-grass-greenery-10273268/'
generator:
  by: scripts/content
  model: haiku
  runId: daily-2026-11-13
  version: 1
heroImage:
  url: >-
    https://images.lazur.app/content-images/blog/dictation-not-working-on-macbook-pro/dictation-on-macbook-pro-not-working-1-e1bcfb.jpg
  width: 1280
  height: 853
  alt: A person working on a MacBook Pro at a clean desk setup.
  caption: >-
    When dictation on your MacBook Pro is not working, start by checking your
    system settings.
  keywords:
    - dictation on macbook pro not working
    - dictation
    - 'on'
    - macbook
    - person using macbook pro
    - Mac
    - Lazur
  credit:
    name: Alexas_Fotos
    url: 'https://pixabay.com/users/Alexas_Fotos-686414/'
    source: Pixabay
    sourceUrl: 'https://pixabay.com/photos/per-contra-on-the-other-hand-2783713/'
keywordHits:
  target: dictation on macbook pro not working
  inTitle: true
  inH1: true
  inDescription: true
  inIntro: true
  bodyCount: 3
  secondary: {}
---

When dictation on your MacBook Pro is not working, the problem usually stems from a software setting conflict or a microphone permission error rather than hardware failure. You can resolve most issues by toggling your dictation settings or resetting the speech recognition daemon in the terminal.

## Resetting Your Dictation Settings

If you find that your Mac is ignoring your voice, the first step is to reset the service. Go to the Apple menu and select System Settings. Navigate to Keyboard and find the Dictation section. Toggle the switch to off. Wait at least ten seconds before turning it back on. This simple action forces the system to reinitialize the speech recognition engine. It often clears out temporary glitches that prevent the microphone from activating when you press your shortcut.

## Checking Voice Control Conflicts

Many users enable Voice Control to manage their Mac hands-free. However, Voice Control and standard Dictation cannot operate at the same time. If Voice Control is active, it takes exclusive control of the microphone. Go to System Settings, select Accessibility, and then click on Voice Control. Ensure this is turned off if you want to use standard Dictation. If you need both, you will have to toggle them manually depending on your current task.

## Verifying Microphone Permissions

Sometimes the issue is not with the system, but with the specific app you are using. If you can dictate in Notes but not in Chrome or Slack, check your privacy settings. Go to System Settings, select Privacy and Security, and then click on Microphone. You will see a list of applications that have requested access to your audio input. Make sure the toggle for the app you are currently using is turned on. If it is already on, toggle it off and back on again to refresh the permission.

## Restarting the Speech Daemon

If the dictation icon appears on your screen but no text appears, the background process responsible for speech recognition might be frozen. This process is called corespeechd. To fix this, open the Terminal app from your Applications folder or via Spotlight. Type the following command and press Enter: killall corespeechd. This command stops the process, and macOS will automatically restart it in a healthy state. You do not need to restart your entire computer for this to take effect.

## Managing Bluetooth Microphone Issues

Using AirPods or other Bluetooth headsets often introduces problems with dictation accuracy. When your Mac connects to a headset, it switches to the Hands-Free Profile. This profile is designed for low-bandwidth voice calls, not high-quality speech recognition. If you notice a drop in accuracy or total failure, try disconnecting your Bluetooth device and using the built-in MacBook microphone array. You can verify your current input source in System Settings > Sound > Input.

## Understanding Dictation Time Limits

Standard Apple Dictation is not designed for continuous, hour-long transcription. Most implementations stop listening after about 30 seconds of silence or a pause. If you are dictating long documents, you must restart the session frequently. This is a deliberate design choice to prevent the microphone from recording background noise indefinitely. If you need to dictate longer thoughts, consider breaking your work into smaller, manageable chunks.

## Faster with Lazur

Sometimes you need more than just basic dictation. If you want to dictate text while also having an assistant that understands your screen, consider Lazur. Hold the fn key to dictate clean, formatted text into any app on your Mac. Because Lazur lives in the notch, it is always ready to assist without cluttering your desktop. You can also hold Option and Command to ask questions about your screen. Lazur will answer out loud or point to the specific element you are looking for. Visit [our download page](/download) to get started with a trial.

## Dealing with Language Model Corruption

If you recently updated to a new version of macOS, your local language models might be corrupted. If dictation is behaving erratically, try adding a secondary language. Go to System Settings > Keyboard > Dictation and select a new language from the list. This forces the Mac to download a fresh set of speech recognition files. Once the download completes, you can remove the secondary language if you do not need it. This process often clears out residual data from previous OS versions.

## Why Hardware Failure is Rare

It is easy to assume your microphone is broken when dictation fails. However, the microphone arrays in modern MacBooks are remarkably reliable. If you can record audio in the Voice Memos app, your hardware is functioning correctly. Focus your troubleshooting efforts on software settings, permissions, and background processes. Using a tool like [our typing speed test](/tools/typing-speed-test) can help you gauge if you are relying too heavily on manual entry because of these intermittent glitches.

## Common User Mistakes

One common mistake is holding the shortcut key for too long or too short a time. If your shortcut is set to press the Fn key twice, tapping it once will do nothing. If it is set to hold the key, tapping it will also fail. Check your specific configuration in System Settings > Keyboard > Dictation. Another mistake is assuming dictation works in every text box. Some secure fields or specific web forms may block input from accessibility tools. If you are struggling with specific apps, try testing in a standard text editor like TextEdit first.

## Improving Accuracy in Noisy Environments

Background noise is the enemy of accurate dictation. If you work in a busy office or a coffee shop, your Mac will struggle to separate your voice from the ambient sound. Try to position yourself away from direct air conditioning vents or open windows. If you must work in a noisy space, consider using a high-quality external microphone. While the built-in mics are good, they are omnidirectional and pick up everything in the room. A directional microphone will focus on your voice and significantly improve your transcription results.

## The Role of Network Connectivity

While Apple Silicon Macs handle most dictation on-device, some features still rely on a network connection. If you are in an area with poor internet, you might experience lag or total failure. Ensure you have a stable connection, especially if you are using a language that requires server-side processing. If you are frequently offline, check your settings to ensure your Mac has downloaded the necessary offline speech models for your primary language.
