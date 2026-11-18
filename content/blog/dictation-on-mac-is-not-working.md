---
title: 'Dictation on Mac Is Not Working: Fixes for macOS 27 Troubleshooting'
description: >-
  If dictation on mac is not working, you can fix it by toggling settings,
  checking microphone permissions, or restarting the speech daemon process.
targetKeyword: dictation on mac is not working
category: How-to
cover: mail
tldr:
  - Toggle Dictation off and on in System Settings.
  - Verify Microphone permissions for your specific apps.
  - Disable Voice Control to prevent input conflicts.
  - Check your selected input source in Sound settings.
  - Restart the background speech daemon via Terminal.
faq:
  - question: Why does my Mac stop dictating after a few seconds?
    answer: >-
      Apple Dictation automatically stops after 30 seconds of silence to save
      system resources. If you need longer continuous dictation, you may need to
      restart the session by pressing your shortcut again.
  - question: Does my Mac need an internet connection for dictation?
    answer: >-
      While Apple Silicon Macs process most English dictation on-device, some
      languages or older Intel-based Macs still rely on server-side processing.
      If you are on a restricted network, you might experience lag or total
      failure.
  - question: Can Bluetooth headsets affect dictation quality?
    answer: >-
      Yes. Using Bluetooth headsets like AirPods can force a lower-quality
      narrowband audio codec. This often reduces transcription accuracy compared
      to using the built-in microphone or a wired USB microphone.
relatedSlugs:
  - best-dictation-on-mac
  - apple-dictation-vs-ai-dictation
  - ai-dictation-for-developers
  - best-mic-mac-dictation
stats:
  - value: 30 seconds
    label: Silence timeout limit for Apple Dictation
    sourceUrl: 'https://usevoicy.com/blog/mac-dictation-not-working/'
    sourceTitle: usevoicy.com
  - value: 85-90%
    label: Estimated real-world accuracy rate
    sourceUrl: 'https://quillflow.app/blog/why-apple-dictation-is-bad'
    sourceTitle: quillflow.app
  - value: '63'
    label: Supported language and region combinations
    sourceUrl: 'https://parrotkey.ai/blog/apple-dictation'
    sourceTitle: parrotkey.ai
sources:
  - title: getvoibe.com
    url: 'https://www.getvoibe.com/resources/dictation-not-working-mac/'
    accessedAt: '2026-11-18'
    publisher: getvoibe.com
  - title: usevoicy.com
    url: 'https://usevoicy.com/blog/mac-dictation-not-working/'
    accessedAt: '2026-11-18'
    publisher: usevoicy.com
  - title: bossai.tech
    url: 'https://bossai.tech/blog/dictation-not-working-mac'
    accessedAt: '2026-11-18'
    publisher: bossai.tech
  - title: spokenly.app
    url: 'https://spokenly.app/blog/mac-dictation-not-working'
    accessedAt: '2026-11-18'
    publisher: spokenly.app
  - title: voicedash.ai
    url: 'https://voicedash.ai/mac-dictation-not-working/'
    accessedAt: '2026-11-18'
    publisher: voicedash.ai
  - title: embertype.com
    url: 'https://embertype.com/blog/apple-dictation-not-working-mac/'
    accessedAt: '2026-11-18'
    publisher: embertype.com
  - title: quillflow.app
    url: 'https://quillflow.app/blog/why-apple-dictation-is-bad'
    accessedAt: '2026-11-18'
    publisher: quillflow.app
  - title: parrotkey.ai
    url: 'https://parrotkey.ai/blog/apple-dictation'
    accessedAt: '2026-11-18'
    publisher: parrotkey.ai
  - title: whisperly.io
    url: 'https://whisperly.io/mac-dictation-accuracy'
    accessedAt: '2026-11-18'
    publisher: whisperly.io
howto:
  name: How to Reset Dictation Permissions on Mac
  steps:
    - name: Open Terminal
      text: 'Press Command + Space to open Spotlight, type Terminal, and press Enter.'
    - name: Run the Reset Command
      text: >-
        Type 'tccutil reset Microphone' into the Terminal window and press
        Enter.
    - name: Restart Your Mac
      text: >-
        Restart your computer to ensure all background permission caches are
        cleared.
    - name: Re-grant Permissions
      text: >-
        Open the app you want to use for dictation and try to record. You will
        be prompted to grant microphone access again.
publishedAt: '2026-11-18'
updatedAt: '2026-11-18'
author: Lazur Team
images:
  - url: >-
      https://images.lazur.app/content-images/blog/dictation-on-mac-is-not-working/dictation-on-mac-is-not-working-1-abd3c6.jpg
    width: 1280
    height: 853
    alt: A person working on a macbook in a bright office environment
    caption: Check your hardware connections if dictation on mac is not working.
    keywords:
      - dictation on mac is not working
      - dictation
      - 'on'
      - mac
      - person using macbook
      - Mac
      - Lazur
    credit:
      name: StockSnap
      url: 'https://pixabay.com/users/StockSnap-894430/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/laptop-apple-macbook-computer-2562361/'
  - url: >-
      https://images.lazur.app/content-images/blog/dictation-on-mac-is-not-working/dictation-on-mac-is-not-working-2-b0f35f.jpg
    width: 1280
    height: 853
    alt: A clean desk with a macbook and microphone
    caption: Proper microphone setup is vital for clear voice input.
    keywords:
      - dictation on mac is not working
      - dictation
      - 'on'
      - mac
      - clean modern workspace
      - Mac
      - Lazur
    credit:
      name: Pexels
      url: 'https://pixabay.com/users/Pexels-2286921/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/apple-computer-desk-workspace-1868496/'
  - url: >-
      https://images.lazur.app/content-images/blog/dictation-on-mac-is-not-working/dictation-on-mac-is-not-working-3-950ff3.jpg
    width: 1280
    height: 853
    alt: Professional working on their computer
    caption: Troubleshooting system settings helps restore your workflow.
    keywords:
      - dictation on mac is not working
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
  runId: daily-2026-11-18
  version: 1
heroImage:
  url: >-
    https://images.lazur.app/content-images/blog/dictation-on-mac-is-not-working/dictation-on-mac-is-not-working-1-abd3c6.jpg
  width: 1280
  height: 853
  alt: A person working on a macbook in a bright office environment
  caption: Check your hardware connections if dictation on mac is not working.
  keywords:
    - dictation on mac is not working
    - dictation
    - 'on'
    - mac
    - person using macbook
    - Mac
    - Lazur
  credit:
    name: StockSnap
    url: 'https://pixabay.com/users/StockSnap-894430/'
    source: Pixabay
    sourceUrl: 'https://pixabay.com/photos/laptop-apple-macbook-computer-2562361/'
keywordHits:
  target: dictation on mac is not working
  inTitle: true
  inH1: true
  inDescription: true
  inIntro: true
  bodyCount: 7
  secondary: {}
---

If dictation on mac is not working, you should first toggle the feature off and on in your system settings to reset the connection. If that fails, verify that your specific application has microphone permissions and ensure your input device is correctly selected in your sound preferences. 

## Why Dictation Fails on macOS

Apple Dictation is a standard feature, but it relies on several background processes. When these processes conflict, the feature stops responding. You might hear the activation chime, but no text appears on the screen. Or, the microphone icon might simply remain grayed out. 

Common causes include system updates that reset permissions, background apps hogging the microphone, or simple configuration errors where the system listens to the wrong input device. Understanding the chain of events helps you fix it faster. When you trigger dictation, the system wakes the speech daemon, checks your microphone access, and then begins listening. If any link in this chain breaks, the entire process halts.

## Quick Fixes for Immediate Results

Most users resolve these issues in under two minutes by following these steps. 

### Toggle Dictation Off and On

This is the most effective fix for temporary glitches. Go to **System Settings > Keyboard**. Scroll down until you see the **Dictation** section. Turn the toggle **Off**, wait about ten seconds, and then turn it back **On**. This action forces the system to re-initialize the speech engine and clear its internal cache.

### Check Microphone Permissions

If dictation works in Apple Notes but fails in Chrome or Slack, the issue is almost certainly a permission conflict. Go to **System Settings > Privacy & Security > Microphone**. You will see a list of apps that have requested access to your microphone. Ensure the toggle for the app you are currently using is turned **On**. If it is already on, toggle it off and back on to refresh the permission state.

### Disable Voice Control

Many users enable Voice Control for navigation and forget about it. If Voice Control is enabled in **System Settings > Accessibility > Voice Control**, it may block standard Dictation from accessing the microphone. These two features often compete for the same audio stream. Try turning off Voice Control entirely to see if standard Dictation resumes its normal function.

### Verify Your Microphone Source

Your Mac might be trying to listen to a monitor with a poor microphone or a muted webcam. Go to **System Settings > Sound > Input**. Look at the list of devices and ensure your preferred microphone is selected. Speak aloud and watch the input level meter. If the bar does not move, your Mac is not receiving audio from that device.

## Advanced Troubleshooting for Persistent Issues

If you have tried the basic steps and still face problems, you need to look at the underlying system processes.

### Restart the Speech Daemon

If you hear the activation tone but no text appears, the background process may be hung. You can force it to restart using the Terminal. Open **Terminal** from your Applications folder and type this command: `sudo killall -9 corespeechd`. You will need to enter your Mac password to execute this. This command kills the speech processing daemon and forces the system to start a fresh instance.

### Check Shortcut Conflicts

If the keyboard shortcut (often `Fn` or `Command` twice) does nothing, verify it in **System Settings > Keyboard > Dictation**. Sometimes a new app install will hijack these shortcuts. You can also test if the system can dictate at all by selecting **Edit > Start Dictation** in the menu bar of any text-based application. If this works, your shortcut is the problem.

### Reset Microphone Permissions

If permissions seem stuck, you can reset them globally. Open **Terminal** and run `tccutil reset Microphone`. This command wipes the permission database for microphone access. After running it, restart your Mac. The next time you open an app and try to use dictation, the system will ask you for permission again. This often clears out "ghost" permission issues that prevent the mic from working.

## Hardware and Environment Considerations

Your physical setup matters as much as your software settings. Using Bluetooth headsets can often force a lower-quality narrowband audio codec. This decrease in audio quality makes it harder for the speech engine to interpret your words, leading to lower accuracy. If you are struggling with poor results, switch to your built-in microphone or a wired USB device to rule out Bluetooth interference.

Also, consider your network. While modern Apple Silicon Macs handle most English dictation on-device, some languages and older Intel-based Macs rely on server-side processing. If you are on a restricted network or have a weak connection, dictation may fail or lag significantly. Try moving to a different network or using a mobile hotspot to see if the behavior changes.

## Faster with Lazur

If you find yourself needing to dictate clean text often, consider adding a voice assistant to your workflow. Lazur lives in your Mac notch and helps you get work done in any app. You can hold `fn` to dictate clean, formatted text at the cursor in any app. It also handles snippets and has a personal dictionary to make your writing faster. If you are ever stuck on a setting, you can ask Lazur to guide you one click at a time. [Download Lazur here](/download) to see how it integrates with your daily tasks.

## Summary of Limitations

It helps to know what to expect from the built-in system. Apple Dictation is a free, convenient tool, but it has specific limits you should keep in mind.

| Feature/Limit | Detail |
| :--- | :--- |
| Silence Timeout | Dictation automatically stops after 30 seconds of silence. |
| Accuracy Rate | Real-world accuracy is estimated at 85 to 90 percent. |
| Language Support | Apple supports 63 language and region combinations. |
| Hardware Impact | Bluetooth headsets may force lower quality audio codecs. |

By keeping these limits in mind, you can adjust your workflow. If you need longer dictation sessions, simply trigger the shortcut again when it times out. If you are in a noisy environment, use a wired microphone to ensure the highest possible accuracy.
