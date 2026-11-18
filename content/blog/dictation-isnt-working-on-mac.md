---
title: 'Dictation Isn''t Working on Mac: What to Do in 2026 for macOS 27'
description: >-
  If your Mac dictation isn't working, it is likely a configuration conflict or
  a missing microphone permission. Follow this guide to fix your voice input
  today.
targetKeyword: dictation isn't working on mac
category: How-to
cover: waveform
tldr:
  - Toggle the Dictation setting off and on again in System Settings.
  - Ensure Voice Control is disabled as it conflicts with standard Dictation.
  - >-
    Verify that your chosen app has microphone permissions in Privacy &
    Security.
  - Check the Sound input settings to confirm your Mac detects your voice.
  - Restart the speech daemon via Terminal if the system remains unresponsive.
faq:
  - question: Why does my Mac stop dictating after 30 seconds?
    answer: >-
      This is a standard design feature in macOS. Dictation automatically times
      out after 30 seconds of silence to preserve system resources and prevent
      accidental background recording.
  - question: Can I use Voice Control and Dictation at the same time?
    answer: >-
      No. These two features use the same system resources for speech
      recognition. You must disable Voice Control in Accessibility settings
      before standard Dictation will function.
  - question: What if the Dictation toggle is greyed out?
    answer: >-
      Check your Screen Time settings under Content & Privacy. You may have
      restrictions enabled that prevent changes to system services like speech
      recognition.
relatedSlugs:
  - ai-dictation-for-developers
  - best-ai-dictation-apps-2026
  - apple-dictation-vs-ai-dictation
  - better-dictation-on-mac
stats:
  - value: 33%
    label: US smart speaker owners reporting daily misunderstandings
    sourceUrl: >-
      https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHDTFRR0nvyMQKsosP6fwz-sJLXfcGL1jQshQWCJwdiWr3FoVTggPKGLHrwOA5b1RL1nZ0DEdmGP8mTQmtbOeYll410MomFkrjdO2-h7YNJusr1GjNibXXCi0J47qQxkCpfaBoMJIpoHWxCyySN9gIPsYScNI6GrAo=
    sourceTitle: Vertex AI Search Grounding API
  - value: 41%
    label: Consumers who yell at voice assistants when errors occur
    sourceUrl: >-
      https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE8x5JBKagS9xPK5V7A9rjCvvh49g8uS048sIEQzSpokEt-qMn4lnUCJXR_CQElBpUD4RkYH_MTOfsaRvSroQFARKk5yMMEMZukr_vPYGHc5M3TpB0opv3HNr-dTPgfzy6YJP5OTJ2i_QAzqzW9UsGpq_oMs2K5zzyZh-5yd7UEkXAhzFm4PF0YJcdLCXzqtsoXYRNf_E56ntAP1TZHwlZUOKqGNXQb18QcryUSBkrAX678_tXQ-ycB6-fiI2jDKPPms0h3spv-1Ak=
    sourceTitle: Vertex AI Search Grounding API
  - value: $104.05 billion
    label: Projected global speech recognition market by 2034
    sourceUrl: >-
      https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEKdeWuSIKtVJ-Sln3GIC2lT9XzGGHQmWQJkTLFTyF9igpIRikKn4DSR36RBkAjkG8beavbKg1xkn_2kn6RFe7pqTXTGaxRSoe4Ra3wx-ha_UqHOCF_IY_sLn6-qX6ZQIpnGkjm8dXUcqv12-9IMscp65FlAYEweZOMqdDXRjRI8yqOV-LyVbSAiMfHSTv069rZMDPGspD-IVbx5tObhQ==
    sourceTitle: Vertex AI Search Grounding API
sources:
  - title: Vertex AI Search Grounding API
    url: >-
      https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQHDTFRR0nvyMQKsosP6fwz-sJLXfcGL1jQshQWCJwdiWr3FoVTggPKGLHrwOA5b1RL1nZ0DEdmGP8mTQmtbOeYll410MomFkrjdO2-h7YNJusr1GjNibXXCi0J47qQxkCpfaBoMJIpoHWxCyySN9gIPsYScNI6GrAo=
  - title: Vertex AI Search Grounding API
    url: >-
      https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQE8x5JBKagS9xPK5V7A9rjCvvh49g8uS048sIEQzSpokEt-qMn4lnUCJXR_CQElBpUD4RkYH_MTOfsaRvSroQFARKk5yMMEMZukr_vPYGHc5M3TpB0opv3HNr-dTPgfzy6YJP5OTJ2i_QAzqzW9UsGpq_oMs2K5zzyZh-5yd7UEkXAhzFm4PF0YJcdLCXzqtsoXYRNf_E56ntAP1TZHwlZUOKqGNXQb18QcryUSBkrAX678_tXQ-ycB6-fiI2jDKPPms0h3spv-1Ak=
  - title: Vertex AI Search Grounding API
    url: >-
      https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQEKdeWuSIKtVJ-Sln3GIC2lT9XzGGHQmWQJkTLFTyF9igpIRikKn4DSR36RBkAjkG8beavbKg1xkn_2kn6RFe7pqTXTGaxRSoe4Ra3wx-ha_UqHOCF_IY_sLn6-qX6ZQIpnGkjm8dXUcqv12-9IMscp65FlAYEweZOMqdDXRjRI8yqOV-LyVbSAiMfHSTv069rZMDPGspD-IVbx5tObhQ==
howto:
  name: How to reset Dictation settings on Mac
  steps:
    - name: Open System Settings
      text: Click the Apple menu and select System Settings from the dropdown list.
    - name: Navigate to Keyboard
      text: Scroll down the sidebar and click on the Keyboard tab.
    - name: Toggle Dictation
      text: >-
        Find the Dictation switch, turn it off, wait ten seconds, and turn it
        back on.
    - name: Verify Microphone
      text: Go to Sound > Input and ensure your microphone is selected and active.
publishedAt: '2026-11-18'
updatedAt: '2026-11-18'
author: Lazur Team
images:
  - url: >-
      https://images.lazur.app/content-images/blog/dictation-isnt-working-on-mac/dictation-isn-t-working-on-mac-1-798b26.jpg
    width: 1280
    height: 853
    alt: A person working on a MacBook in a clean office environment.
    caption: Most dictation issues on a Mac are simple software settings.
    keywords:
      - dictation isn't working on mac
      - dictation
      - isn't
      - working
      - person using macbook
      - Mac
      - Lazur
    credit:
      name: StockSnap
      url: 'https://pixabay.com/users/StockSnap-894430/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/laptop-apple-macbook-computer-2562361/'
  - url: >-
      https://images.lazur.app/content-images/blog/dictation-isnt-working-on-mac/dictation-isn-t-working-on-mac-2-ece0a9.jpg
    width: 1280
    height: 850
    alt: A modern desk with a Mac and microphone equipment.
    caption: >-
      Check your microphone input settings if you struggle with voice
      recognition.
    keywords:
      - dictation isn't working on mac
      - dictation
      - isn't
      - working
      - office desk setup
      - Mac
      - Lazur
    credit:
      name: Firmbee
      url: 'https://pixabay.com/users/Firmbee-663163/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/macbook-apple-imac-computer-screen-606763/'
  - url: >-
      https://images.lazur.app/content-images/blog/dictation-isnt-working-on-mac/dictation-isn-t-working-on-mac-3-014e0c.jpg
    width: 1280
    height: 853
    alt: A person focused on their screen while typing.
    caption: Reliable voice input keeps your focus on the task at hand.
    keywords:
      - dictation isn't working on mac
      - dictation
      - isn't
      - working
      - focused person working
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
    https://images.lazur.app/content-images/blog/dictation-isnt-working-on-mac/dictation-isn-t-working-on-mac-1-798b26.jpg
  width: 1280
  height: 853
  alt: A person working on a MacBook in a clean office environment.
  caption: Most dictation issues on a Mac are simple software settings.
  keywords:
    - dictation isn't working on mac
    - dictation
    - isn't
    - working
    - person using macbook
    - Mac
    - Lazur
  credit:
    name: StockSnap
    url: 'https://pixabay.com/users/StockSnap-894430/'
    source: Pixabay
    sourceUrl: 'https://pixabay.com/photos/laptop-apple-macbook-computer-2562361/'
keywordHits:
  target: dictation isn't working on mac
  inTitle: true
  inH1: true
  inDescription: true
  inIntro: true
  bodyCount: 5
  secondary: {}
---

When your Mac dictation isn't working, it is usually due to a configuration conflict or a missing permission rather than a broken microphone. Most issues resolve by refreshing your system settings or checking for competing accessibility features. ## Check Your System Settings First The first place to look when dictation isn't working on Mac is the main toggle in your settings menu. Open System Settings, navigate to Keyboard, and find the Dictation section. Toggle the switch off. Wait for ten seconds. Then, toggle it back on. This simple action forces the system to reinitialize the speech recognition service. It often clears out temporary glitches that prevent the microphone from activating when you press your shortcut. If you still see no response, verify that your microphone is actually selected. Go to System Settings > Sound > Input. Speak a few words and watch the Input level bar. If the bar moves, your hardware is fine. If the bar stays flat, your Mac does not hear you. You may need to select a different device from the list if you use an external interface or a headset. ## Disable Conflicting Features Like Voice Control A common mistake is leaving Voice Control active while trying to use standard Dictation. These two features cannot run at the same time because they both claim the microphone input for different purposes. Go to System Settings > Accessibility > Voice Control. If the switch is on, turn it off. Once Voice Control is disabled, try your Dictation shortcut again. Many users find that this is the only step they needed to take. If you rely on Voice Control for navigation, you must choose between that and the standard Dictation feature. They are separate tools within macOS. ## Verify Microphone Permissions for Apps If Dictation works in some apps but not others, you are dealing with a permission issue. macOS protects your privacy by requiring explicit approval for apps to use the microphone. Open System Settings > Privacy & Security > Microphone. You will see a list of apps that have requested access. Ensure the toggle is turned on for the specific app you are currently using. If the app is not in the list, try restarting it. Sometimes, an app needs to trigger a fresh request for microphone access before it appears in this menu. Do not forget to check this for browsers like Chrome if you dictate into web-based tools. ## Restart the Speech Recognition Daemon If the basic settings look correct but the system remains unresponsive, you can force a restart of the background process. Open the Terminal app from your Applications > Utilities folder. Type the following command and press Enter: killall corespeechd. This command stops the background process responsible for speech recognition. macOS will automatically restart it immediately. This is a safe operation that does not require a system reboot. It often fixes issues where the speech engine hangs or stops responding to your input. ## Check for Screen Time Restrictions Occasionally, you might find that the Dictation toggle is greyed out. This usually happens when Screen Time restrictions are enabled. Go to System Settings > Screen Time > Content & Privacy. Look for any restrictions that might block system services or changes to settings. If you have a work Mac, your IT department might have disabled this feature via a configuration profile. You can check this by looking for the Profiles section in System Settings. If a profile is present, you cannot change the setting yourself. ## Understanding Dictation Timeouts It is important to remember that Dictation is not a continuous recording tool. The system automatically stops listening after 30 seconds of silence. This is a design choice by Apple to save battery and system resources. If your dictation stops mid-sentence, you might have paused for too long. If you need longer periods of continuous voice input, you may need to look into third-party tools. Always check your cursor position before you start speaking to ensure the text appears where you expect it. ## Faster with Lazur If you want a more reliable way to handle voice and text, try Lazur. It is a voice assistant that lives in your Mac notch. Hold the function key to dictate clean, formatted text into any app on your screen. Lazur handles snippets and your personal dictionary to make sure your voice input is accurate every time. You can download it at [lazur.app/download](/download). ## Troubleshooting Summary Table | Issue | Likely Cause | Fix | | :--- | :--- | :--- | | No response | Dictation service hung | Toggle off and on | | Dictation stops | Timeout | Resume speaking | | No input seen | Wrong mic selected | Check Sound settings | | Apps not hearing | No permissions | Check Privacy settings | | Feature blocked | Voice Control active | Disable Voice Control | ## Common Hardware Mistakes Even with perfect software settings, hardware can cause problems. If you use a Bluetooth headset, verify that it is connected and set as the primary input device. Sometimes, a Mac might switch to a different audio input without you noticing. Check your Control Center by clicking the icon in the top right of your menu bar. Look at the Sound output and input section to ensure your preferred mic is active. If you use a wired microphone, check the physical connection. A loose cable or a bad adapter can cause intermittent signal loss. Try plugging the device into a different port if your Mac has more than one. ## Software Conflicts and Background Apps Some apps can interfere with audio input. If you have apps that handle audio routing, like audio interfaces or virtual sound cards, they might grab the microphone before the system can. Try quitting these apps to see if Dictation starts working again. You can use the Activity Monitor in Applications > Utilities to see which apps are using your microphone. Look for the Microphone column to identify any suspicious background processes. ## When to Contact Apple Support If you have tried all these steps and Dictation still fails, you might have a hardware fault. Run Apple Diagnostics to check your system components. Restart your Mac and hold the D key while it starts up. This will run a scan and report any issues with your internal microphone. If the test reports an error, it is time to contact Apple Support for a repair. Most of the time, however, the problem is just a setting that needs a quick adjustment.
