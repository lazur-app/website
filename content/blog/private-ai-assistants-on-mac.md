---
title: >-
  Private AI Assistant for Mac in 2026: Local Speech, Screen Context and Cloud
  Processing
description: >-
  Check speech, screen access, and cloud answers separately in any private AI
  assistant for Mac. Here is what macOS 27, Apple and LM Studio actually say.
targetKeyword: private AI assistant for Mac
category: Guide
cover: privacy
tldr:
  - >-
    Privacy is several decisions: speech, screen access, cloud answers, storage,
    and training. Check each one on its own.
  - >-
    On macOS 27, general dictation can stay on the Mac when Keyboard settings
    show on-device processing. The on-device enhancement is English only and
    needs an M3 or later Mac with 12GB or more.
  - >-
    Apple says Private Cloud Compute keeps no user data after the response is
    returned. Those are Apple's own commitments, not independently verified
    claims.
  - >-
    Local model runners keep chats on your disk, but update checks and model
    searches still make network calls.
faq:
  - question: Is there a fully private AI assistant for Mac?
    answer: >-
      Most assistants send some data somewhere. The useful question is which
      data leaves the Mac, and under what rule. Check speech, screen access,
      cloud answers, storage, and training separately, then pick the setup whose
      rules match your work.
  - question: Does dictation on Mac send my audio to Apple?
    answer: >-
      It depends on your settings. Open Apple menu > System Settings > Keyboard
      > Dictation and check whether general text is processed on device. The
      on-device enhancement is English only and needs an M3 or later Mac with at
      least 12GB of unified memory. Dictation in a search box is not covered by
      that setting.
  - question: Does Apple store what Private Cloud Compute processes?
    answer: >-
      Apple says data processed in Private Cloud Compute is not stored or made
      accessible to Apple. Its security blog says no user data is retained in
      any form after the response is returned. These are Apple's own
      commitments, and the sources reviewed for this guide do not independently
      verify them.
  - question: Is a local model like LM Studio fully offline?
    answer: >-
      Not fully. LM Studio's privacy policy says your chats, histories, and
      documents stay on your device when you run models locally. Update checks
      still send app version, operating system, and an IP address, and model
      searches send anonymized queries. Local describes your chat content, not
      every network call.
  - question: Is Lazur private?
    answer: >-
      Lazur listens and looks at the screen only while you hold the shortcut.
      Audio and the screenshot go to AI providers so Lazur can answer, and they
      are not stored. Your content is never used to train AI models. Lazur is
      not a local model, so answers come from AI providers.
relatedSlugs:
  - on-device-speech-to-text-mac
  - ai-screenshot-data-retention-mac
  - screen-recording-permission-mac-ai
  - share-dictation-audio-apple-setting
stats:
  - value: 81%
    label: >-
      of Americans familiar with AI say company AI use will lead to personal
      information used in ways they will not be comfortable with
    sourceUrl: >-
      https://www.pewresearch.org/internet/2023/10/18/how-americans-view-data-privacy/
    sourceTitle: How Americans View Data Privacy (Pew Research Center)
  - value: 59%
    label: >-
      of U.S. adults have not too much or no confidence in companies to develop
      and use AI responsibly (August 2024 survey)
    sourceUrl: >-
      https://www.pewresearch.org/internet/2025/04/03/how-the-us-public-and-ai-experts-view-artificial-intelligence/
    sourceTitle: >-
      How the US Public and AI Experts View Artificial Intelligence (Pew
      Research Center)
  - value: 14 GB
    label: >-
      of storage for the latest Apple Intelligence features on M3 or later Macs
      with 12GB or more of memory
    sourceUrl: 'https://support.apple.com/en-us/121115'
    sourceTitle: Apple Intelligence requirements (Apple Support)
  - value: 90 days
    label: >-
      window Apple commits to for publishing software images of production
      Private Cloud Compute builds
    sourceUrl: 'https://security.apple.com/blog/private-cloud-compute/'
    sourceTitle: >-
      Private Cloud Compute: A new frontier for AI privacy in the cloud (Apple
      Security Research)
sources:
  - title: Apple Intelligence and privacy on Mac (macOS 27) (Apple Support)
    url: >-
      https://support.apple.com/guide/mac-help/apple-intelligence-and-privacy-mchlfc0d4779/mac
    publisher: Apple
    accessedAt: '2026-11-07'
  - title: Apple Intelligence on Mac User Guide (macOS 27) (Apple Support)
    url: >-
      https://support.apple.com/guide/mac-help/apple-intelligence-and-privacy-mchl7e8bc64c/mac
    publisher: Apple
    accessedAt: '2026-11-07'
  - title: >-
      Private Cloud Compute: A new frontier for AI privacy in the cloud (Apple
      Security Research)
    url: 'https://security.apple.com/blog/private-cloud-compute/'
    publisher: Apple
    accessedAt: '2026-11-07'
  - title: Dictate messages and documents on Mac (Apple Support)
    url: 'https://support.apple.com/guide/mac-help/use-dictation-mh40584/mac'
    publisher: Apple
    accessedAt: '2026-11-07'
  - title: Apple Intelligence requirements (Apple Support)
    url: 'https://support.apple.com/en-us/121115'
    publisher: Apple
    accessedAt: '2026-11-07'
  - title: LM Studio Privacy Policy (LM Studio)
    url: 'https://lmstudio.ai/app-privacy'
    publisher: LM Studio
    accessedAt: '2026-11-07'
  - title: >-
      How the US Public and AI Experts View Artificial Intelligence (Pew
      Research Center)
    url: >-
      https://www.pewresearch.org/internet/2025/04/03/how-the-us-public-and-ai-experts-view-artificial-intelligence/
    publisher: Pew Research Center
    accessedAt: '2026-11-07'
  - title: >-
      How Americans View Data Privacy: Tech Companies, AI, Regulation, Passwords
      and Policies (Pew Research Center)
    url: >-
      https://www.pewresearch.org/internet/2023/10/18/how-americans-view-data-privacy/
    publisher: Pew Research Center
    accessedAt: '2026-11-07'
publishedAt: '2026-10-12'
updatedAt: '2026-11-06'
author: Lazur Team
images:
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/private-ai-assistants-on-mac/private-ai-assistant-for-mac-1-e53c5c.jpg
    width: 1280
    height: 853
    alt: >-
      Man working on a laptop at a desk, the setting where a private AI
      assistant for Mac gets used
    caption: Speech and screen access are the first two privacy decisions.
    keywords:
      - private AI assistant for Mac
      - private
      - AI
      - assistant
      - man using laptop
      - Mac
      - Lazur
    credit:
      name: StockSnap
      url: 'https://pixabay.com/users/StockSnap-894430/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/man-writing-laptop-computer-write-2562325/'
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/private-ai-assistants-on-mac/private-ai-assistant-for-mac-1-c093dc.jpg
    width: 1280
    height: 853
    alt: >-
      Apple laptop on a wooden desk with notebook, a typical Mac workspace for
      voice and text work
    caption: Most of your data decisions start on the machine in front of you.
    keywords:
      - private AI assistant for Mac
      - Guide
      - macbook desk workspace
      - Mac
      - Lazur
    credit:
      name: StartupStockPhotos
      url: 'https://pixabay.com/users/StartupStockPhotos-690514/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/laptop-notebook-startup-computer-849799/'
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/private-ai-assistants-on-mac/private-ai-assistant-for-mac-3-cc312a.jpg
    width: 1280
    height: 853
    alt: >-
      Person typing on a laptop keyboard while reviewing privacy settings for a
      private AI assistant on Mac
    caption: Read the policy before you trust the answer.
    keywords:
      - private AI assistant for Mac
      - private
      - AI
      - assistant
      - person typing laptop
      - Mac
      - Lazur
    credit:
      name: Pexels
      url: 'https://pixabay.com/users/Pexels-2286921/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/computer-cup-gadgets-laptop-mug-1867096/'
generator:
  by: scripts/content
  model: haiku
  runId: daily-2026-11-06
  version: 1
heroImage:
  url: >-
    https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/private-ai-assistants-on-mac/private-ai-assistant-for-mac-1-e53c5c.jpg
  width: 1280
  height: 853
  alt: >-
    Man working on a laptop at a desk, the setting where a private AI assistant
    for Mac gets used
  caption: Speech and screen access are the first two privacy decisions.
  keywords:
    - private AI assistant for Mac
    - private
    - AI
    - assistant
    - man using laptop
    - Mac
    - Lazur
  credit:
    name: StockSnap
    url: 'https://pixabay.com/users/StockSnap-894430/'
    source: Pixabay
    sourceUrl: 'https://pixabay.com/photos/man-writing-laptop-computer-write-2562325/'
keywordHits:
  target: private AI assistant for Mac
  inTitle: true
  inH1: true
  inDescription: true
  inIntro: true
  bodyCount: 9
  secondary: {}
---

A private AI assistant for Mac is one that tells you, layer by layer, what stays on your Mac and what goes to a server. Check speech, screen access, and the model that writes the answer separately, because each one can handle your data in a different way.

Most people judge privacy by one line on a product page. That is the wrong unit. One assistant can turn your voice into text on the Mac, send a screenshot to a cloud model, and keep a history file on disk. Each of those is its own decision. This guide walks through them in order, with the menu paths and the caveats you need.

## What a private AI assistant for Mac actually processes

Privacy questions split into four parts.

- **Speech:** where your voice becomes text.
- **Screen:** whether the assistant can see your windows, and when.
- **Answers:** whether your text goes to a cloud model to get a response.
- **Storage and training:** how long history is kept, and whether your content trains AI models.

Apple describes its own design in two tiers. Apple Intelligence models run entirely on device, so a task can finish without data leaving the Mac. For heavier requests, the system first checks whether the device can handle the job. Only then does a request move to Private Cloud Compute, Apple's server design for AI work.

Third-party tools follow their own rules. A local model runner can keep your chats on disk and still make network calls for updates. Do not assume a tool is private because it says AI on Mac. Read what each layer does.

| Layer | Question to ask | Where to look |
| --- | --- | --- |
| Speech | Does audio go to Apple servers? | Apple menu > System Settings > Keyboard > Dictation |
| Screen | Is the screen captured all the time, or only on request? | The assistant's settings, plus Privacy & Security |
| Answers | Does your text go to a cloud model? | The vendor's privacy policy |
| Storage | How long are history and screenshots kept? | Settings and the retention section of the policy |
| Training | Is your content used to train AI models? | An explicit statement in the policy |

## Local speech: what stays on the Mac during dictation

Dictation is the layer most people use every day, so start here. On macOS 27, general text Dictation can run on the Mac, or it can send audio to Siri servers. To check which one you have, open Apple menu > System Settings > Keyboard > Dictation. Look for the setting that shows general text is processed on device and not sent to Siri servers.

Three limits matter.

First, the on-device enhancement is English only. This is the part that handles spelling, punctuation, and capitalization with Apple Intelligence. It needs a Mac with an M3 chip or later and at least 12GB of unified memory.

Second, your device language and Siri language must match a supported language. Apple's requirements page lists English, French, German, Japanese, Korean, and several others.

Third, dictation in a search box is not covered by the on-device setting for general text. If you dictate into a search field, assume the rules are different. Test it before you dictate anything sensitive there.

Here is a worked example. Suppose you have an older Apple silicon Mac with an M2 chip and plenty of memory. The memory may pass the test, but the chip does not meet the M3 requirement. The enhancement will not run on device on that machine, even with a lot of RAM. Check the chip first, then the memory.

Apple also asks about sharing audio. When prompted, you can choose Share Audio Recordings, which lets Apple review a sample of stored audio, or Not Now. You can change this later under Privacy & Security > Analytics & Improvements. If you never saw the prompt, check that page anyway.

## Screen context: when the assistant can see what you see

Screen-aware assistants are useful because they see what you see. That is also why they need the strictest rules.

Ask three questions. Does it look at the screen all the time, or only when you ask? Does it capture the full display or one window? Does it keep the image after it answers?

The strongest setup is hold-to-talk. The assistant looks only while you hold a shortcut. That keeps the capture window short and easy to predict.

The most common mistake is granting screen access once and forgetting it. Open Apple menu > System Settings > Privacy & Security, find the screen recording list, and remove apps you no longer use. Revisit that list after a major macOS update, because settings can change.

A concrete case: you have a client's name open in another window while you ask an assistant to draft a reply in Mail. If the assistant captures the whole display on each request, that name may travel with the request. Close or move sensitive windows before you ask. Narrow the capture when the product lets you.

## Cloud processing: what Apple's Private Cloud Compute promises

Private Cloud Compute, or PCC, is the most detailed server design a major vendor has published for AI work. Apple says data processed in PCC is not stored or made accessible to Apple. Its security blog, dated June 10, 2024, says user data stays on PCC nodes only until the response is returned. It says no user data is retained in any form after that.

A few other promises matter here:

- Data is processed only as far as the request needs, then removed.
- The Secure Enclave randomizes the encryption keys for the data volume on every reboot.
- Apple commits to publishing software images of every production PCC build for security research. The window is within 90 days of inclusion in the transparency log, or after relevant updates are available, whichever comes first.
- Devices send data only to nodes whose attested software matches a public log entry.

These are Apple's commitments. The sources reviewed for this guide do not independently verify them. Treat them as strong vendor claims, and keep reading the policy yourself.

Cloud features also have limits you will notice. Apple's Mac User Guide says some server-side features are subject to daily usage limits. The list includes Siri AI, Intelligent Photo Editing Tools, Image Playground, and AFM 3 Cloud models in Shortcuts. Siri AI is in beta. At launch it works in English, French, Japanese, Korean, Portuguese, and Spanish.

If a Shortcut calls one of those cloud models, that step follows the server path, not the on-device path. Treat each step in a Shortcut as its own privacy decision.

Apple's requirements page sets the hardware bar for these features:

| Requirement | Apple's stated value |
| --- | --- |
| Chip for Apple Intelligence | M1 or later |
| Storage, latest features, M3 or later with 12GB or more | Up to 14 GB |
| Storage, other supported Macs | Up to 8 GB |
| Device and Siri language | Must match a supported language |
| Dictation enhancement | English only, M3 or later, 12GB or more |

## Local models: what LM Studio keeps on your Mac

Running a model on your own Mac is the other route to privacy. LM Studio is a common example. Its privacy policy says that when you run models locally, none of your messages, chat histories, or documents are transmitted from your system. Everything is saved on your device.

The same policy lists network calls you should know about.

- **Update checks** send app version and build, operating system details, and an IP address added by the CDN.
- **Model searches** send anonymized search queries.

The lesson is that local describes your chat content, not every packet your Mac sends. A local model can keep your chats on the Mac and still check for updates. If you need strict offline work, look at the app's settings for update behavior before you rely on it for sensitive text.

A local model also has to fit in memory. If it does not, you move to a smaller model, and its answers may be weaker. Test the answers on work you already know before you trust them with new work.

## Sorting your work into local and cloud tasks

Most people do not need one rule for everything. They need a rule for each kind of task. Decide before you start, not after the answer appears on screen.

| Task | Where it runs | What to check first |
| --- | --- | --- |
| Dictate a note about a client call into a document | General dictation, on device if the Keyboard setting shows it | The on-device line, and whether your language is English for the enhancement |
| Dictate a search term into a search box | Outside the general text setting | Test with harmless words first |
| Ask what a button does in an open spreadsheet | Screen capture during the request, then a cloud answer | Close windows that show client names or account numbers |
| Draft a reply to a sensitive email | Cloud text model | Remove names and figures the reply does not need |
| Polish a private draft with a local model | Local runner, chats stored on disk | Update and search settings, and your memory limits |

The table is a starting point. Your own mix of tasks will differ. The habit that matters is the first column. Name the task, then pick the path. Most privacy problems happen when people skip that step and let whatever is open decide for them.

## Why trust is a real question, not a feeling

People are cautious about AI and personal data, and the surveys show it. These figures come from Pew Research Center.

Pew's October 2023 data privacy report surveyed 5,101 U.S. adults, fielded May 15 to 21, 2023. Of those familiar with AI, 81% said company AI use will lead to personal information being used in ways people will not be comfortable with.

In Pew's August 2024 survey of 5,410 U.S. adults, 59% said they have not too much or no confidence in companies to develop and use AI responsibly. Pew's 2025 report found 66% of U.S. adults are highly concerned about AI producing inaccurate information.

What this means for you is simple. The trust question is about the company and its rules, not only the chip in your Mac. Read the policy, then test the product on work that does not matter before you use it on work that does.

## Mistakes people make when they pick a private assistant

- **Reading “not stored” as “not used for training.”** These are different promises. Ask about both. A policy can say one without the other.
- **Trusting one toggle to cover everything.** Dictation, search fields, screen capture, and cloud answers each have their own path. A setting that protects one may not protect another.
- **Ignoring hardware limits.** The on-device enhancement needs an M3 or later Mac with 12GB or more, and English. If your Mac misses one of those, the feature may not run on device.
- **Assuming “on device” means no network at all.** Update checks and search calls can still leave the Mac, as the LM Studio policy shows.

## How to check your own Mac in a few minutes

1. Open Apple menu > About This Mac and note your chip and memory. The on-device dictation enhancement needs M3 or later and 12GB or more.
2. Open Apple menu > System Settings > Keyboard > Dictation and read the on-device line for general text.
3. Open System Settings > Privacy & Security > Analytics & Improvements and check your audio sharing choice.
4. Open System Settings > Privacy & Security and review the screen recording list. Remove anything you do not use.
5. Open your assistant's settings and find its screen capture rule. Confirm whether it looks only while you hold a key.
6. Read the privacy policy for four items: cloud text, retention period, screen images, and training.
7. Write down which tasks go to the cloud. Keep sensitive content on tasks that stay local.

## Where Lazur fits if you want voice help on Mac

Lazur is a voice assistant for Mac that lives in the notch. Here is what it does, and what it does not do.

For dictation, hold fn to dictate clean, formatted text at the cursor in any app. Snippets, a personal dictionary, and clipboard slots help with names and phrases you repeat.

For questions about your screen, hold ⌥ ⌘ and ask about anything on screen. Lazur answers out loud. Ask where something is and it draws a circle and a label around it. Ask how to do something and it guides you one click at a time, waiting for each click. Lazur does not click buttons or operate apps for you. You do the clicks.

On privacy, the plain version is this. Lazur listens and looks at the screen only while you hold the shortcut. Audio and the screenshot go to AI providers so Lazur can answer, and they are not stored. Your content is never used to train AI models. Lazur keeps a memory of what you asked and did on your Mac.

Lazur is not a local model. Answers come from AI providers. If your rule is that nothing leaves the Mac, the LM Studio route fits your work better. Lazur runs on macOS, on Apple silicon and Intel Macs. Windows is planned, not available.

If you want help inside a specific app, see [Lazur for Apple Mail](/apps/apple-mail) or [Lazur for Cursor](/apps/cursor). For current plans, check the [pricing page](/pricing). To try it on your Mac, go to the [download page](/download).

Start with the speech check. It takes a few minutes and tells you more than any headline about AI privacy.
