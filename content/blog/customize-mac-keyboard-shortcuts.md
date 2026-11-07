---
title: >-
  Customize Mac Keyboard Shortcuts Without Breaking Your Apps: Built-In Steps,
  2026
description: >-
  Customize Mac keyboard shortcuts with System Settings, App Shortcuts and
  Karabiner-Elements, plus how to avoid the conflicts that break apps.
targetKeyword: customize mac keyboard shortcuts
category: How-to
cover: apps
tldr:
  - >-
    Use System Settings > Keyboard > Keyboard Shortcuts for system commands, and
    App Shortcuts for one app's existing menu commands.
  - >-
    Watch for conflicts. A shortcut that already exists stops the new one from
    working, and Settings marks it with a warning icon.
  - >-
    Use Karabiner-Elements only for key-level changes. Change one thing at a
    time, and quit and reopen apps after each change.
faq:
  - question: Can I change every keyboard shortcut on my Mac?
    answer: >-
      No. System Settings covers the system commands Apple lists, and App
      Shortcuts covers existing menu commands inside a specific app. Some apps
      do not allow custom keyboard shortcuts at all. Figma has said in its
      community forum that its shortcuts cannot be customized, so check the
      app's own settings and help pages before you spend time on a workaround.
  - question: Why does my new Mac keyboard shortcut not work?
    answer: >-
      Most often, another command already uses that combination. Apple says a
      new shortcut won't work if it matches an existing command or app shortcut.
      Open Keyboard Shortcuts, look for the warning icon, and change one of the
      two shortcuts. Then quit and reopen the app you were using.
  - question: Is Karabiner-Elements safe to use for remapping keys?
    answer: >-
      It is a free tool, and its homepage lists support from macOS 13 to macOS
      27. It needs Accessibility permission, and on macOS 15.9.0 and earlier it
      also needs Input Monitoring. Make one change at a time, test it in the
      apps you use, and turn off or delete the rule if something misbehaves.
  - question: How do I reset my Mac keyboard shortcuts to the defaults?
    answer: >-
      Open Keyboard Shortcuts in System Settings and click Restore Defaults in
      the bottom-left corner. This resets every shortcut, including the ones you
      did not mean to change. To remove a single App Shortcut instead, select it
      and click Remove (-). Quit and reopen affected apps afterward.
relatedSlugs:
  - learn-any-mac-app-without-tutorials
  - ai-assistants-that-understand-your-screen
  - mac-notch-apps-what-each-does
stats:
  - value: v16.3.0
    label: 'Latest Karabiner-Elements release, dated Sep 6, 2026'
    sourceUrl: 'https://karabiner-elements.pqrs.org/docs/releasenotes/'
    sourceTitle: Karabiner-Elements release notes
  - value: 13 to 27
    label: >-
      macOS versions Karabiner-Elements lists as supported, Intel and Apple
      silicon
    sourceUrl: 'https://karabiner-elements.pqrs.org/'
    sourceTitle: Karabiner-Elements homepage
  - value: $15
    label: >-
      BetterTouchTool Standard license price on the vendor buy page, varies by
      country and taxes
    sourceUrl: 'https://folivora.ai/buy'
    sourceTitle: BetterTouchTool buy page (folivora.ai)
sources:
  - title: Use macOS keyboard shortcuts - Apple Support
    url: 'https://support.apple.com/guide/mac-help/keyboard-shortcuts-mchlp2262/mac'
    publisher: Apple
    accessedAt: '2026-11-07'
  - title: Change a conflicting keyboard shortcut on Mac - Apple Support
    url: >-
      https://support.apple.com/guide/mac-help/change-a-conflicting-keyboard-shortcut-on-mac-mchlp2864/mac
    publisher: Apple
    accessedAt: '2026-11-07'
  - title: Create keyboard shortcuts for apps - Apple Support
    url: >-
      https://support.apple.com/guide/mac-help/create-keyboard-shortcuts-for-apps-mchlp2271/mac
    publisher: Apple
    accessedAt: '2026-11-07'
  - title: Karabiner-Elements homepage
    url: 'https://karabiner-elements.pqrs.org/'
    publisher: pqrs.org
    accessedAt: '2026-11-07'
  - title: Karabiner-Elements release notes
    url: 'https://karabiner-elements.pqrs.org/docs/releasenotes/'
    publisher: pqrs.org
    accessedAt: '2026-11-07'
  - title: Required macOS settings - Karabiner-Elements
    url: >-
      https://karabiner-elements.pqrs.org/docs/manual/misc/required-macos-settings/
    publisher: pqrs.org
    accessedAt: '2026-11-07'
  - title: Remap Mac keyboard keys using Karabiner Elements for free
    url: 'https://www.cultofmac.com/how-to/remap-mac-keyboard'
    publisher: Cult of Mac
    accessedAt: '2026-11-07'
  - title: How do I change my keyboard shortcuts - Figma Community
    url: >-
      https://forum.figma.com/ask-the-community-7/how-do-i-change-my-keyboard-shortcuts-7916
    publisher: Figma Community
    accessedAt: '2026-11-07'
  - title: Use Figma products with a keyboard - Figma Help Center
    url: >-
      https://help.figma.com/hc/en-us/articles/360040328653-Keyboard-shortcuts-in-Figma
    publisher: Figma
    accessedAt: '2026-11-07'
  - title: BetterTouchTool - Buy
    url: 'https://folivora.ai/buy'
    publisher: Folivora
    accessedAt: '2026-11-07'
  - title: Keyboard Maestro - Stairways Software
    url: 'https://www.stairways.com/keyboardmaestro/'
    publisher: Stairways Software
    accessedAt: '2026-11-07'
howto:
  name: How to change a Mac keyboard shortcut without breaking your apps
  steps:
    - name: Open Keyboard Shortcuts
      text: >-
        Choose Apple menu > System Settings > Keyboard > Keyboard Shortcuts.
        Labels can shift slightly between macOS releases, so read the sidebar on
        your own screen.
    - name: Pick a category and a command
      text: >-
        Choose a category such as Mission Control or Spotlight. Tick the box
        beside the shortcut you want to change.
    - name: Record the new combination
      text: >-
        Double-click the current key combination, then press the new one. Each
        key type can appear only once in a combination.
    - name: Resolve any warning
      text: >-
        If a warning icon appears, another command already uses that
        combination. Double-click the conflicting shortcut and press a new
        combination, or change the new one.
    - name: Test in a text editor and your main app
      text: >-
        Press the new shortcut in a plain text editor, then in the app you use
        most. Confirm the expected command runs once and only once.
    - name: Quit and reopen the app
      text: >-
        Quit the affected app and open it again, as Apple's guide advises after
        a change. Then test the shortcut one more time.
publishedAt: '2026-11-07'
updatedAt: '2026-11-07'
author: Lazur Team
images:
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/customize-mac-keyboard-shortcuts/customize-mac-keyboard-shortcuts-1-cad5b6.jpg
    width: 1280
    height: 853
    alt: >-
      Person typing on a laptop keyboard while they customize Mac keyboard
      shortcuts
    caption: Changing a shortcut takes a few clicks and one careful test.
    keywords:
      - customize mac keyboard shortcuts
      - customize
      - mac
      - keyboard
      - person typing laptop keyboard
      - Mac
      - Lazur
    credit:
      name: Engin_Akyurt
      url: 'https://pixabay.com/users/Engin_Akyurt-3656355/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/office-work-school-note-to-write-4628592/'
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/customize-mac-keyboard-shortcuts/customize-mac-keyboard-shortcuts-2-e64bb1.jpg
    width: 1280
    height: 853
    alt: >-
      Close view of a Mac keyboard showing the Command and Option keys used in
      shortcuts
    caption: Command and Option make up most of the shortcuts you will change.
    keywords:
      - customize mac keyboard shortcuts
      - customize
      - mac
      - keyboard
      - mac keyboard closeup
      - Mac
      - Lazur
    credit:
      name: Ralf1403
      url: 'https://pixabay.com/users/Ralf1403-21380246/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/piano-music-keys-keyboard-9271509/'
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/customize-mac-keyboard-shortcuts/customize-mac-keyboard-shortcuts-3-f80929.jpg
    width: 1280
    height: 848
    alt: >-
      Developer working at a desk with a laptop while setting up keyboard
      shortcuts
    caption: Test each change in the apps you use every day.
    keywords:
      - customize mac keyboard shortcuts
      - customize
      - mac
      - keyboard
      - developer desk laptop
      - Mac
      - Lazur
    credit:
      name: AlfredMuller
      url: 'https://pixabay.com/users/AlfredMuller-1793373/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/computer-notebook-office-code-2788918/'
generator:
  by: scripts/content
  model: haiku
  runId: daily-2026-11-07
  version: 1
heroImage:
  url: >-
    https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/customize-mac-keyboard-shortcuts/customize-mac-keyboard-shortcuts-1-cad5b6.jpg
  width: 1280
  height: 853
  alt: >-
    Person typing on a laptop keyboard while they customize Mac keyboard
    shortcuts
  caption: Changing a shortcut takes a few clicks and one careful test.
  keywords:
    - customize mac keyboard shortcuts
    - customize
    - mac
    - keyboard
    - person typing laptop keyboard
    - Mac
    - Lazur
  credit:
    name: Engin_Akyurt
    url: 'https://pixabay.com/users/Engin_Akyurt-3656355/'
    source: Pixabay
    sourceUrl: 'https://pixabay.com/photos/office-work-school-note-to-write-4628592/'
keywordHits:
  target: customize mac keyboard shortcuts
  inTitle: true
  inH1: true
  inDescription: true
  inIntro: true
  bodyCount: 7
  secondary: {}
---

To customize Mac keyboard shortcuts, open Apple menu > System Settings > Keyboard > Keyboard Shortcuts, pick a command, and press the new key combination. For a change that only applies to one app, use App Shortcuts, type the menu title exactly as the app shows it, and fix any conflict before you close the window.

That covers most people. This guide goes through the built-in settings first. Then it covers the rules for app-specific shortcuts, a key remapper for the cases macOS does not handle, and the mistakes that break apps. Read the whole thing once before you change anything.

## Before you change anything, write down what you have

Start with an inventory. Open the app you use most and note the shortcuts you press every day. A screenshot works fine. Save it somewhere you can find it.

Why bother? Because the most common problem is not a bad shortcut. It is a shortcut that quietly stops working after a change you forgot about. A written list tells you what to put back.

Keep the list short. A handful of shortcuts per app is enough for a first pass. You can add more later.

## Change a system shortcut in System Settings

Start with the built-in settings. They handle system commands such as Mission Control and Spotlight. They work on every Mac you use, and you do not need to install anything.

Here is the path, step by step.

1. Open Apple menu > System Settings > Keyboard > Keyboard Shortcuts.
2. Choose a category in the list, such as Mission Control or Spotlight.
3. Tick the box beside the shortcut you want to change.
4. Double-click the current key combination, then press the new one.

Apple's guide says each key type can appear only once in a combination. You cannot give one shortcut the same modifier twice. Plan the combination before you press keys, because a half-finished attempt can leave a confusing state behind.

Here is a worked example. Say you want Spotlight on Control Space, because your left hand already rests on Control. Select Spotlight, double-click the current combination, and press Control Space. If a warning icon appears beside it, another command already owns that combination.

Test before you walk away. Press the new shortcut in a plain text editor first. Then try it in the app you use most. Apple's conflict rule covers app commands as well as system commands, so the app test matters.

## Why your new shortcut does nothing

This is the most common complaint. Apple says that if you assign a shortcut that already exists for another command or app, the new shortcut won't work. Nothing pops up to explain it. The shortcut just does nothing.

Settings shows the clash with a warning icon. You have two ways to fix it. You can double-click the conflicting shortcut and press a new combination. Or you can change the new one. Pick whichever shortcut you use less often, and leave the busier one on the combination it already has.

Here is the mistake people make. They press the new shortcut, see nothing happen, assume macOS is broken, and click Restore Defaults. That button resets every shortcut you changed, including the ones that worked. Fix one conflict at a time instead.

Also quit and reopen the app. Apple's guide tells you to do this after you change a shortcut. An app that was open during the change may keep the old binding until you restart it. Restarting costs you a few seconds. A confusing afternoon costs more.

## Add a shortcut to one app with App Shortcuts

App Shortcuts lets you add a shortcut for a specific app, or for All Applications. It only targets menu commands that already exist. The app has to show that command under the exact title you type.

Apple's own example is Format->Font->Ligatures->Use Default for TextEdit. Three rules come from that example:

- Type the arrow between menu levels as ->, not as >.
- Type an ellipsis as three periods with no spaces.
- Match capital letters and punctuation exactly. A missing period or an extra space can stop the match.

Here is a worked example. Suppose you want a shortcut for a command called Show Sidebar in one app. Open that app's menu first. Find the command, read its title letter by letter, and copy the text. Then enter the same text in App Shortcuts, along with the app's name and the shortcut you want. Test it inside that app, not in Finder.

If the shortcut does nothing, the title is the usual cause. Check for a capital letter that does not match, or a menu that has moved the command under a different submenu. Fix the title, then quit and reopen the app.

There are real limits. App Shortcuts can target existing menu commands only. You cannot use it to open an app or run a multi-step task. Some apps do not allow custom keyboard shortcuts at all. To remove a custom shortcut, select it and click Remove (-).

Figma shows where this gets tricky. In July 2024, a Figma community staff reply said shortcuts cannot be customized in Figma, and it pointed to a feature request. A community member later suggested adding a Figma-specific shortcut through System Settings. That is a workaround from a user, not an official Figma feature, and it may be out of date. Check it before you rely on it.

Figma's Help Center says the keyboard shortcuts panel opens with Control Shift ? on Mac. Open that panel first. It shows what Figma already uses, so you can avoid a clash before you add anything.

## Remap keys with Karabiner-Elements when macOS is not enough

App Shortcuts works on menu commands. A key remapper works one level lower, on the keys themselves. That lets you swap a key or build a rule that runs before any app sees the keypress.

Karabiner-Elements is a free tool for this job, according to the Cult of Mac guide titled "Remap Mac keyboard keys using Karabiner Elements for free." Its latest release is v16.3.0, dated Sep 6, 2026. Its homepage lists support for macOS 13 Ventura through macOS 27 Golden Gate, on both Intel and Apple silicon Macs.

Setup asks for a few permissions. Expect to do these three things.

- Accessibility: System Settings > Privacy & Security > Accessibility.
- Input Monitoring: required for version 15.9.0 and earlier. The project says it is usually unnecessary from 16.0.0 on, because Accessibility covers it. Check which version you installed.
- Driver approval: System Settings > Login Items & Extensions > Driver Extensions. Confirm that org.pqrs.Karabiner-DriverKit-VirtualHIDDevice shows [activated enabled].

A rule does nothing until these permissions are in place. That is the most common reason a new Karabiner rule looks broken. Check the permissions first, then check the rule.

Once it runs, use the right tab for the job. The Simple Modifications tab handles single-key swaps. For multi-key shortcuts, use Complex Modifications > Add your own rule. The Cult of Mac guide says that if you use a third-party keyboard, EventViewer can show the correct key name to use in a rule.

Here is a worked example. Suppose you want Caps Lock to act as Escape. Open Simple Modifications, choose Caps Lock as the source key, and choose Escape as the target. Then test it in a text field, in a browser, and in a terminal window. Each app reads keys a little differently, so one good test is not enough.

Make one change at a time. The pqrs project advises this, and Cult of Mac's May 22, 2026 guide says the same thing. A global key swap changes what every app receives. That is the main way a remap breaks other apps. If one change misbehaves, you know exactly which rule to disable.

The Cult of Mac guide does not say which macOS version it tested. Treat its steps as a starting point, and check each label on your own screen.

## Compare your options

Each method suits a different job. Use the simplest one that does what you need.

| Method | Best for | Cost | What to watch |
|---|---|---|---|
| System Settings > Keyboard Shortcuts | System commands and existing app commands | Included with macOS | Conflicts stop the new shortcut from working |
| App Shortcuts | One app's existing menu commands | Included with macOS | Menu titles must match exactly, and it cannot run tasks |
| Karabiner-Elements | Swapping keys and building multi-key rules | Free, per the Cult of Mac guide | Needs Accessibility and driver approval |
| BetterTouchTool | Custom triggers and gestures | $15 Standard, $25 Lifetime | Price depends on country and taxes |
| Keyboard Maestro | Multi-step automations | $36 listed, currency not labeled | A bigger tool with more to learn |

Prices come from each vendor's own page. The BetterTouchTool figures come from its buy page at folivora.ai. The Keyboard Maestro figure comes from the Stairways Software page, which does not label its currency or say what license type it covers. Check the vendor page before you buy, because prices change.

If you only need a shortcut or two, stay with System Settings and App Shortcuts. Reach for Karabiner-Elements only when the change has to happen at the key level. Reach for a paid tool only when a free one cannot do the job.

## Mistakes that break your apps

Most broken setups come from a few habits. Watch for these.

1. **Changing many shortcuts at once.** When an app misbehaves, you cannot tell which change caused it. Change one, test it, then move on.
2. **Reassigning a common editing shortcut.** If you move Command C or Command V to a new combination, copy and paste changes in every app that uses them. Keep editing shortcuts where your fingers expect them.
3. **Using All Applications for a shortcut only one app needs.** A rule set to All Applications reaches every app. It can collide with shortcuts that other apps already rely on. Use the app-specific option whenever you can.
4. **Skipping the restart.** An open app may keep the old binding. Quit it and open it again after each change.
5. **Forgetting the permissions.** A Karabiner rule can look broken when the real problem is a missing Accessibility or driver approval.
6. **Clicking Restore Defaults by accident.** It resets everything. Keep your inventory list from the first step, so you can rebuild any change you lose.

Each of these has a simple fix. Test one change, restart the app, and keep your list up to date.

## Where Lazur can help

Lazur is a voice assistant for the Mac, and it works on what is on your screen. Hold ⌥ ⌘ to ask about anything you see, and Lazur answers out loud. Ask where a setting lives, and Lazur draws a circle and a label around it. Ask how to do something, and it guides you one click at a time, waiting for each click.

Lazur does not click for you, and it does not change your settings. You still make each change. That matters here, because you stay in control of every conflict and every reset.

A practical way to use it: ask Lazur to walk you through the Keyboard Shortcuts screen the first time you open it. Then make the changes yourself, one at a time. Lazur runs on macOS, on both Apple silicon and Intel Macs. [Download Lazur for macOS](/download) when you want it on your Mac.

## A short checklist before you start

- Save your inventory of current shortcuts. A screenshot is enough.
- Change one shortcut, then check for a warning icon.
- Quit and reopen the affected app.
- Test the new shortcut in the apps you use every day.
- If something breaks, undo that one change. Use Remove (-) for an App Shortcut. Save Restore Defaults as the last resort.

For app-specific shortcut lists, read [how to show the keyboard shortcuts list in Slack on Mac](/how-to/show-the-keyboard-shortcuts-list-in-slack) or [how to use keyboard shortcuts in Numbers on Mac](/how-to/use-keyboard-shortcuts-in-numbers). If you keep forgetting the shortcuts you already have, [these free fixes for Mac keyboard shortcuts you keep forgetting](/for/developers/problems/mac-keyboard-shortcuts-keep-forgetting) may help.
