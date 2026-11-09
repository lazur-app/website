---
title: 'Screen Recording Permission Mac: What to Allow for an AI Assistant in 2026'
description: >-
  Where the screen recording permission sits on Mac, what to allow for Claude
  and ChatGPT, why macOS re-prompts, and how to fix a switch that does nothing.
targetKeyword: screen recording permission mac
category: Guide
cover: privacy
tldr:
  - >-
    Open System Settings > Privacy & Security > Screen & System Audio Recording,
    switch on the assistant, and leave other apps off.
  - >-
    Seeing your screen needs Screen Recording. Clicking, typing and scrolling
    for you also needs Accessibility.
  - >-
    On macOS Sequoia, third-party capture apps can get a re-approval prompt
    about every 30 days, according to a 2026 third-party guide. Read the dialog
    on your own Mac.
  - >-
    If the switch is on and the assistant still cannot see the screen, quit and
    reopen the app before you reset anything.
faq:
  - question: Does an AI assistant need screen recording permission on Mac?
    answer: >-
      Only if it has to see what is on your screen. Apple lists this under
      Screen & System Audio Recording in System Settings. An assistant that only
      dictates text uses the microphone instead, so check what the app actually
      does before you switch anything on.
  - question: Why does my Mac keep asking me to allow screen recording again?
    answer: >-
      On macOS Sequoia (macOS 15), capture apps get a re-approval prompt about
      every 30 days, according to a 2026 Screenify guide. MacRumors reported the
      change from weekly to monthly in an August 2024 beta. Sources disagree on
      the dialog buttons, so read the prompt on your own Mac.
  - question: What if the switch is on but the assistant still cannot see my screen?
    answer: >-
      Quit the app completely and open it again. Apple's guide does not say a
      restart is needed, but a reboot is a reasonable next step. Use tccutil
      reset ScreenCapture only as a last resort, because it removes every screen
      capture entry and you must grant each app again.
  - question: Should I turn on Accessibility for an AI assistant too?
    answer: >-
      Only if you want it to click, type, or scroll for you. Anthropic's Claude
      docs say Accessibility lets Claude click, type, and scroll. OpenAI says
      ChatGPT needs Accessibility so it can click, type, and navigate. If you
      only want answers and pointers, the screen switch covers the job.
relatedSlugs:
  - ai-assistants-that-understand-your-screen
  - private-ai-assistants-on-mac
  - mac-dictation-not-working-fixes
  - share-dictation-audio-apple-setting
stats:
  - value: 70%
    label: >-
      US consumers worried about data privacy and security in 2025, up from 60%
      a year earlier
    sourceUrl: >-
      https://www.deloitte.com/us/en/insights/industry/telecommunications/connectivity-mobile-trends-survey.html
    sourceTitle: '2025 Connected Consumer: Innovation with trust'
  - value: 82%
    label: 'Gen AI users who say the technology could be misused, up from 74%'
    sourceUrl: >-
      https://www.deloitte.com/us/en/insights/industry/telecommunications/connectivity-mobile-trends-survey.html
    sourceTitle: '2025 Connected Consumer: Innovation with trust'
  - value: About 30 days
    label: >-
      Re-approval prompt cycle for third-party capture apps on macOS Sequoia,
      per a 2026 guide
    sourceUrl: >-
      https://www.screenify.studio/blog/2026-04-23-macos-screen-recording-permissions
    sourceTitle: 'Mac Screen Recording Permission: Fix + tccutil Reset'
sources:
  - title: Control access to screen and system audio recording on Mac
    url: 'https://support.apple.com/guide/mac-help/mchld6aa7d23/mac'
    publisher: Apple Support
    accessedAt: '2026-11-06'
  - title: >-
      macOS Sequoia Will Require Users to Update Screen Recording App
      Permissions Monthly
    url: >-
      https://www.macrumors.com/2024/08/15/macos-sequoia-screen-recording-app-permissions/
    publisher: MacRumors
    accessedAt: '2026-11-06'
  - title: 'Mac Screen Recording Permission: Fix + tccutil Reset'
    url: >-
      https://www.screenify.studio/blog/2026-04-23-macos-screen-recording-permissions
    publisher: Screenify Studio
    accessedAt: '2026-11-06'
  - title: >-
      macOS Sequoia adds weekly permission prompt for screenshot and screen
      recording apps
    url: 'https://developer.apple.com/forums/thread/761443'
    publisher: Apple Developer Forums
    accessedAt: '2026-11-06'
  - title: Desktop application - Claude Code Docs
    url: 'https://code.claude.com/docs/en/desktop'
    publisher: Anthropic
    accessedAt: '2026-11-06'
  - title: Use quick entry with Claude Desktop on Mac
    url: >-
      https://support.claude.com/en/articles/12626668-use-quick-entry-with-claude-desktop-on-mac
    publisher: Anthropic Help Center
    accessedAt: '2026-11-06'
  - title: Computer Use
    url: 'https://learn.chatgpt.com/docs/computer-use'
    publisher: OpenAI
    accessedAt: '2026-11-06'
  - title: '2025 Connected Consumer: Innovation with trust'
    url: >-
      https://www.deloitte.com/us/en/insights/industry/telecommunications/connectivity-mobile-trends-survey.html
    publisher: Deloitte Insights
    accessedAt: '2026-11-06'
howto:
  name: Turn on screen recording for an AI assistant on Mac
  steps:
    - name: Open System Settings
      text: 'Click the Apple menu, then choose System Settings.'
    - name: Open Privacy & Security
      text: Click Privacy & Security in the sidebar.
    - name: Open Screen & System Audio Recording
      text: >-
        Click Screen & System Audio Recording. Each app in the list has its own
        switch.
    - name: Turn on the assistant
      text: >-
        Turn on the switch for the assistant. If the app is not listed, use the
        Add button below the list.
    - name: Quit and reopen the app
      text: >-
        Quit the assistant completely, then open it again so it checks the
        permission. Apple's guide does not say a restart is needed.
publishedAt: '2026-11-06'
updatedAt: '2026-11-06'
author: Lazur Team
images:
  - url: >-
      https://images.lazur.app/content-images/blog/screen-recording-permission-mac-ai/screen-recording-permission-mac-1-f918f0.jpg
    width: 1280
    height: 853
    alt: >-
      Person working at a MacBook on a desk, reviewing permissions before
      allowing screen recording
    caption: Check each app before you let it see your screen.
    keywords:
      - screen recording permission mac
      - screen
      - recording
      - permission
      - person using macbook desk
      - Mac
      - Lazur
    credit:
      name: Foundry
      url: 'https://pixabay.com/users/Foundry-923783/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/phone-technology-mobile-internet-869669/'
  - url: >-
      https://images.lazur.app/content-images/blog/screen-recording-permission-mac-ai/screen-recording-permission-mac-2-0c0266.jpg
    width: 1280
    height: 853
    alt: >-
      Laptop screen showing privacy and security options, the kind of Mac screen
      recording permission page you review
    caption: The switch lives under Privacy & Security in System Settings.
    keywords:
      - screen recording permission mac
      - screen
      - recording
      - permission
      - laptop privacy settings
      - Mac
      - Lazur
    credit:
      name: stevepb
      url: 'https://pixabay.com/users/stevepb-282134/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/censorship-limitations-610101/'
  - url: >-
      https://images.lazur.app/content-images/blog/screen-recording-permission-mac-ai/screen-recording-permission-mac-3-5b77ed.jpg
    width: 1280
    height: 853
    alt: >-
      Person at a laptop in an office while an AI assistant helps with a task on
      screen
    caption: Seeing your screen and clicking for you are two different permissions.
    keywords:
      - screen recording permission mac
      - screen
      - recording
      - permission
      - man working laptop office
      - Mac
      - Lazur
    credit:
      name: Pexels
      url: 'https://pixabay.com/users/Pexels-2286921/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/man-chair-computer-desk-sit-1866784/'
generator:
  by: scripts/content
  model: haiku
  runId: daily-2026-11-06
  version: 1
heroImage:
  url: >-
    https://images.lazur.app/content-images/blog/screen-recording-permission-mac-ai/screen-recording-permission-mac-1-f918f0.jpg
  width: 1280
  height: 853
  alt: >-
    Person working at a MacBook on a desk, reviewing permissions before allowing
    screen recording
  caption: Check each app before you let it see your screen.
  keywords:
    - screen recording permission mac
    - screen
    - recording
    - permission
    - person using macbook desk
    - Mac
    - Lazur
  credit:
    name: Foundry
    url: 'https://pixabay.com/users/Foundry-923783/'
    source: Pixabay
    sourceUrl: 'https://pixabay.com/photos/phone-technology-mobile-internet-869669/'
keywordHits:
  target: screen recording permission mac
  inTitle: true
  inH1: true
  inDescription: true
  inIntro: false
  bodyCount: 3
  secondary: {}
---

Open System Settings, click Privacy & Security, then click Screen & System Audio Recording. Switch on the AI assistant that needs to see your screen, and leave every other app off unless you have a clear reason.

You usually meet this permission in one of two ways. An app asks for it the first time you open it, or an assistant stops seeing your screen after an update. The fix is in the same place either way. This guide shows you where the switch lives, what each permission does, what Claude and ChatGPT ask for, why macOS prompts again on some versions, and what to do when the switch is on but nothing works.

## Where the screen recording permission lives on Mac

On current macOS, the path is Apple menu > System Settings > Privacy & Security > Screen & System Audio Recording. Apple's support guide gives these steps:

1. Click the Apple menu, then choose System Settings.
2. Click Privacy & Security in the sidebar.
3. Click Screen & System Audio Recording.
4. Turn on the switch for each app that should record. To add an app that is not listed, use the Add button below the list.

Each app gets its own switch. Apple's guide says an app can be allowed to record both your screen and audio, or just your audio. The guide does not describe a screen-only choice. Read a screen switch as permission for the screen and the audio together.

On older macOS versions, the same control is called Screen Recording and sits under Security & Privacy. The name changed, but the setup did not. You still get one list, and one switch per app.

Before you change anything, look at the whole list. A switch you turn off removes that app's permission. Turn it back on to restore it. Check the list again after a major macOS upgrade, because the entries you expect may need a fresh yes.

## What each switch lets an assistant do

Two permissions come up again and again. Screen Recording lets an app see what is on your screen. Accessibility lets an app act on what it sees. Anthropic describes the pair in its Claude docs. Accessibility “lets Claude click, type, and scroll.” Screen Recording “lets Claude see what's on your screen.”

Seeing and acting are different jobs. Say you want ChatGPT to tell you where the export option sits in a spreadsheet. The screen switch covers that. If you then ask it to press the button for you, it needs Accessibility too. Most of the confusion on this topic comes from treating those two as one switch.

Here is how the main assistants describe their requirements.

| Assistant and feature | Screen Recording | Accessibility | Source |
|---|---|---|---|
| Claude Desktop quick entry | Required to capture screenshots and share windows | Required for quick entry | Claude Help Center |
| Claude computer use (research preview) | Lets Claude see what is on screen | Lets Claude click, type, and scroll | Claude Code Docs |
| ChatGPT computer use | So ChatGPT can see the target app | So ChatGPT can click, type, and navigate | OpenAI Computer Use page |

Dictation is a different job. It runs on the microphone, not on the screen. If dictation stops working, the screen switch is probably not the cause. Check the microphone permission and the dictation settings first. Dictation also has its own audio sharing setting, which is separate from this one. [Read about that setting here](/blog/share-dictation-audio-apple-setting).

## What to allow for Claude and ChatGPT

### Claude

Claude has two features that touch the screen, and they follow different rules. Quick entry needs Screen Recording and Accessibility. Anthropic's Help Center says it needs macOS 12 or later and is available on all plans, from Free through Enterprise.

Computer use is the stricter case. Anthropic calls it a research preview on macOS and Windows. It needs a Pro, Max, or Ultra plan, and it is not available on Team or Enterprise plans. On macOS it needs macOS 14 or later, and it is off by default. It also needs both Accessibility and Screen Recording.

Don't mix the two sets of rules. Quick entry works on every plan, while computer use has plan and macOS limits. The Settings page in Claude shows the status of each permission. A denied permission has a badge you can open to jump to the right System Settings pane. The docs give no restart step after you grant access.

### ChatGPT

OpenAI's computer use page says ChatGPT on macOS needs Screen Recording “so ChatGPT can see the target app.” It needs Accessibility “so ChatGPT can click, type, and navigate.” OpenAI also says system permissions are separate from app approvals inside ChatGPT. A yes inside the app does not replace the macOS switch.

The page has a naming problem you should know about. Its troubleshooting tells you to check Screen Recording and Accessibility for “Codex Computer Use on macOS.” If you look for ChatGPT in the list and it is missing, look for the Codex Computer Use entry too. For a side by side look at the two tools, see [ChatGPT on Mac: which one to use for which job](/apps/chatgpt).

## Why macOS asks you again

Some versions of macOS ask you to approve screen capture again on a schedule. Sequoia (macOS 15) is the one that matters most here. MacRumors reported in August 2024 that Apple changed the prompt in a Sequoia beta from weekly to monthly. Its dialog offered “Allow For One Month” or a way to open System Settings to the screen recording controls.

A 2026 guide from Screenify says the prompt returns about every 30 days for each third-party capture app. It says users and developers cannot turn the prompt off. It also says an MDM profile can bypass the prompt, which matters only on managed Macs. Screenify says “Don't Allow” removes the app's access right away.

Sources disagree on details, so read the dialog on your own Mac. The MacRumors and Screenify accounts also differ on what the buttons say. Screenify's FAQ contradicts its own main text on MDM. If your Mac is managed, ask your IT team before you assume anything. I could not confirm whether the monthly prompt applies on macOS Tahoe or macOS 27. Test it on your version.

MacRumors also reported that a Sequoia rule requiring re-approval after each restart was removed. It found no way to give an app permanent access. An Apple Developer Forums thread from August 2024 shows a developer asking Apple for an “always allow” option. I found no Apple statement on whether that is coming.

The practical effect is simple. An assistant that worked last week can go blind after a prompt you dismissed. Here is a worked example. You allow a new assistant on Monday and use it all week. The next Monday a prompt appears, and you click the wrong button. The assistant then says it cannot see your screen. Open the pane, check the switch, quit the app, and reopen it. That sequence handles the common cases before you need a reset.

## When the switch is on but the assistant still cannot see the screen

Work through these steps in order. Most of them take less than a minute.

1. Confirm the switch is on for the app you are actually running. If you have two copies of an app, the one in the list may not be the one you opened.
2. Quit the app completely, then open it again. Apple's guide does not say whether you need a restart, so start with the quit.
3. If a monthly prompt came up and you dismissed it, open the same pane and turn the switch on again.
4. Restart the Mac. Screenify's reset steps include a reboot, so a restart is a reasonable next move, though Apple does not require one.
5. Use a reset only as a last resort. Screenify suggests running `tccutil reset ScreenCapture` in Terminal. That removes every screen capture entry, so you must grant each app again. The command is not in Apple's guide, so treat it as a third-party fix.

Do not run `tccutil reset All` as a first step. Screenify calls it a last resort, because it resets every privacy permission on the Mac, not only this one. Before you run any reset, write down the apps you need. Then turn each one back on afterward.

## Mistakes that waste time

- **Allowing everything at once.** Apps ask in bursts, and it is tempting to click yes. Allow the one you need now and leave the others off.
- **Treating Accessibility as a harmless extra.** It lets an app click, type, and scroll. If you only want answers, don't grant it.
- **Mistaking the monthly prompt for a bug.** On some macOS versions it is a system rule, not a fault in your assistant.
- **Reading one name as the whole story.** ChatGPT's computer use may appear as Codex Computer Use in the list.
- **Skipping the privacy policy.** Apple's guide says that once an app can record, the information it collects falls under that app's own terms and privacy policies.
- **Mixing up microphone and screen access.** An assistant that hears you but cannot see the window can only answer from what you describe.

## What you are allowing for privacy

Allowing screen recording is a trust decision. Apple's guide says the data an allowed app collects falls under that app's own terms and privacy policies. It recommends you learn about those practices. That is the step most people skip.

Public attitudes point the same way. Deloitte's 2025 Connected Consumer survey covered 3,524 US consumers. It found 70% worried about data privacy and security, up from 60% a year earlier. In the same survey, 82% of gen AI users and experimenters said the technology could be misused, up from 74%. These figures measure general attitudes, not screen recording specifically. I found no study that measures how often people deny this permission.

Before you allow an app, check three things. Find out whether it stores what it sees, which company receives the data, and whether it needs audio, the screen, or both. The app's privacy page is the fastest place to find those answers.

Screen capture also reaches whatever sits on the display. That includes messages, bank pages, and client files. If you share a Mac, think about who else uses it. Close sensitive windows before you ask an assistant for help with the screen.

## Three questions before you switch it on

1. Do you want the app to look at your screen, or to act on it? Looking needs Screen Recording. Acting also needs Accessibility.
2. Will you use it every day, or only for one task? If it is one task, turn the switch off when you finish.
3. Do you trust the company that runs it, and have you read what it does with your data?

## Where a voice assistant fits

Lazur is a voice assistant for Mac that lives in the notch. You hold ⌥ ⌘ to ask about anything on screen, and it answers out loud. It listens and looks at the screen only while you hold the shortcut. Audio and the screenshot go to AI providers so they can answer you, and they are not stored.

It does not click buttons or operate other apps for you. When you ask how to do something, it guides you one click at a time and waits for each click. Read the permission prompt during setup, and allow only what it asks for.

It runs on macOS, on both Apple silicon and Intel. Windows is planned but not available yet. The Pro trial is 3 days and needs no credit card. The trial starts when you first open the app. [Download Lazur for Mac](/download) and check the prompts during setup.
