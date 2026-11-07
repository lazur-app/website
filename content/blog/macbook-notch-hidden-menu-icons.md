---
title: >-
  MacBook notch hidden menu bar icons: fixes and tradeoffs for macOS 26 and
  macOS 27
description: >-
  Hidden menu bar icons behind the MacBook notch? Compare Command-drag, spacing
  tweaks, scale to fit and menu bar managers, with tradeoffs for macOS 26 and
  27.
targetKeyword: macbook notch hidden menu bar icons
category: Guide
cover: apps
tldr:
  - >-
    The notch takes the middle of the menu bar. Icons that don't fit on either
    side can disappear, and most setups give no warning.
  - >-
    Start with the free fixes: Command-drag unused icons out, turn off Control
    Center modules you don't use, then test tighter spacing.
  - >-
    On one test Mac, tighter spacing fit about 35 icons on a side strip instead
    of about 21, but the spacing keys are undocumented by Apple.
  - >-
    Menu bar managers like Bartender and Ice are the next step. Their macOS 27
    support is mixed across sources, so check release notes first.
faq:
  - question: Why doesn't macOS warn me when menu bar icons are hidden?
    answer: >-
      On most setups there is no overflow button for icons that don't fit beside
      the notch. Jesse Squires argues that macOS hides overflow items with zero
      indication that more items exist. A macOS 27 guide says a native overflow
      button is coming, but that claim is not confirmed on Apple's own pages.
      Until you confirm it on your version, count your icons yourself.
  - question: Is Scale to fit below built-in camera a permanent fix?
    answer: >-
      No. Apple's support article says the option no longer appears if a
      developer updates the app for compatibility with the Mac. It also applies
      one app at a time. While it is on, all open apps or apps sharing the same
      space appear below the camera until the scaled app closes.
  - question: Will tightening menu bar spacing cause problems?
    answer: >-
      It can. The spacing keys do not appear on Apple's menu bar help page, so
      an update may change how they behave. Very low values can make icons
      harder to click. Start at 6, log out and back in, then test. To undo, run
      defaults delete on both keys and log out again.
  - question: Do I need a menu bar manager on macOS 27?
    answer: >-
      Maybe not. Sources disagree on which managers work on macOS 27.
      Bartender's site says Bartender 7 is built for macOS 27, one guide says
      Ice has no macOS 27 release, and Thaw's macOS 27 build is an alpha. Try
      the free fixes first, then check each app's release notes before you
      install one.
  - question: Can Lazur fix hidden menu bar icons for me?
    answer: >-
      No. Lazur does not click buttons, move icons or change system settings for
      you. It can point at things on your screen and guide you one click at a
      time. Hold ⌥ ⌘ and ask where a setting is, or how to change it. You can
      find the download at /download.
relatedSlugs:
  - mac-notch-apps-what-each-does
  - best-personal-ai-assistants-for-mac
stats:
  - value: 220 of 1800
    label: points of menu bar the notch took on one 14-inch MacBook Pro test
    sourceUrl: 'https://hop.tools/blog/menu-bar-icons-behind-the-notch/'
    sourceTitle: 'menu bar icons hidden behind the notch: six fixes'
  - value: 21 to 35
    label: >-
      icons in one 790-point side strip, default spacing versus
      NSStatusItemSpacing set to 2
    sourceUrl: 'https://hop.tools/blog/menu-bar-icons-behind-the-notch/'
    sourceTitle: 'menu bar icons hidden behind the notch: six fixes'
  - value: 32 to 44 pt
    label: 'height given up in below-notch display mode, depending on resolution'
    sourceUrl: 'https://memo.d.foundation/macbook-notch-macos-27'
    sourceTitle: 'Hide the MacBook notch: the 32-point fix for the macOS 27 menu bar'
sources:
  - title: >-
      How to adjust an app's settings to appear below the camera area on your
      MacBook Air or MacBook Pro
    url: 'https://support.apple.com/en-us/102125'
    publisher: Apple Support
    accessedAt: '2026-11-07'
  - title: Use the menu bar on Mac
    url: 'https://support.apple.com/guide/mac-help/use-the-menu-bar-mchlp1446/mac'
    publisher: Apple Support
    accessedAt: '2026-11-07'
  - title: 'If the MacBook Pro''s notch is in the way, you can hide it'
    url: >-
      https://www.macworld.com/article/546104/how-to-macbook-pro-macos-monterey-block-notch-menu-bar.html
    publisher: Macworld
    accessedAt: '2026-11-07'
  - title: Bartender - Menu bar management for Mac
    url: 'https://www.macbartender.com/'
    publisher: Bartender (vendor)
    accessedAt: '2026-11-07'
  - title: 'menu bar icons hidden behind the notch: six fixes'
    url: 'https://hop.tools/blog/menu-bar-icons-behind-the-notch/'
    publisher: hop.tools
    accessedAt: '2026-11-07'
  - title: 'Hide the MacBook notch: the 32-point fix for the macOS 27 menu bar'
    url: 'https://memo.d.foundation/macbook-notch-macos-27'
    publisher: memo.d.foundation
    accessedAt: '2026-11-07'
  - title: Menu Bar Icons Hidden Behind the MacBook Notch? Fixes
    url: 'https://trymainspring.com/blog/menu-bar-icons-behind-notch-mac'
    publisher: Mainspring (vendor)
    accessedAt: '2026-11-07'
  - title: How to fix Mac menu bar icons hidden by the MacBook notch
    url: >-
      https://www.jessesquires.com/blog/2023/12/16/macbook-notch-and-menu-bar-fixes/
    publisher: Jesse Squires
    accessedAt: '2026-11-07'
  - title: 'macOS 27 Broke Bartender, Ice and Hidden Bar: What Works Now'
    url: >-
      https://macos-tahoe.com/blog/macos-27-menu-bar-apps-broken-bartender-ice-icons-hidden-behind-notch-fix-2026/
    publisher: macos-tahoe.com
    accessedAt: '2026-11-07'
publishedAt: '2026-11-07'
updatedAt: '2026-11-07'
author: Lazur Team
images:
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/macbook-notch-hidden-menu-icons/macbook-notch-hidden-menu-bar-icons-1-99e814.jpg
    width: 1280
    height: 853
    alt: >-
      Silver MacBook on a desk, the kind of laptop with a notch in the top menu
      bar
    caption: 'A notched MacBook on a desk, the setup this guide covers.'
    keywords:
      - macbook notch hidden menu bar icons
      - macbook
      - notch
      - hidden
      - macbook laptop desk
      - Mac
      - Lazur
    credit:
      name: '1139623'
      url: 'https://pixabay.com/users/1139623-1139623/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/computer-laptop-technology-3184028/'
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/macbook-notch-hidden-menu-icons/macbook-notch-hidden-menu-bar-icons-2-3b5521.jpg
    width: 1280
    height: 853
    alt: Man typing on a laptop while checking which menu bar icons are missing
    caption: Finding missing menu bar icons takes a minute of checking.
    keywords:
      - macbook notch hidden menu bar icons
      - macbook
      - notch
      - hidden
      - man typing laptop
      - Mac
      - Lazur
    credit:
      name: '1139623'
      url: 'https://pixabay.com/users/1139623-1139623/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/adult-computer-laptop-internet-3182384/'
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/macbook-notch-hidden-menu-icons/macbook-notch-hidden-menu-bar-icons-3-b05236.jpg
    width: 1280
    height: 853
    alt: >-
      Office desk with a computer and notebook, a common place to fix menu bar
      clutter
    caption: Small settings changes like spacing are easy to test at your desk.
    keywords:
      - macbook notch hidden menu bar icons
      - macbook
      - notch
      - hidden
      - office desk computer
      - Mac
      - Lazur
    credit:
      name: StartupStockPhotos
      url: 'https://pixabay.com/users/StartupStockPhotos-690514/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/student-typing-keyboard-text-849825/'
generator:
  by: scripts/content
  model: haiku
  runId: daily-2026-11-07
  version: 1
heroImage:
  url: >-
    https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/macbook-notch-hidden-menu-icons/macbook-notch-hidden-menu-bar-icons-1-99e814.jpg
  width: 1280
  height: 853
  alt: >-
    Silver MacBook on a desk, the kind of laptop with a notch in the top menu
    bar
  caption: 'A notched MacBook on a desk, the setup this guide covers.'
  keywords:
    - macbook notch hidden menu bar icons
    - macbook
    - notch
    - hidden
    - macbook laptop desk
    - Mac
    - Lazur
  credit:
    name: '1139623'
    url: 'https://pixabay.com/users/1139623-1139623/'
    source: Pixabay
    sourceUrl: 'https://pixabay.com/photos/computer-laptop-technology-3184028/'
keywordHits:
  target: macbook notch hidden menu bar icons
  inTitle: true
  inH1: true
  inDescription: true
  inIntro: false
  bodyCount: 3
  secondary: {}
---

Your MacBook notch hides menu bar icons when the right side of the top bar runs out of room. The notch takes the middle of the bar, and status icons can only use the space on either side of it. Most setups give no warning when an icon gets pushed out, so you have to go looking for it.

The fastest fixes cost nothing. Command-drag icons out of the bar, switch off Control Center modules you never use, and tighten icon spacing with a few Terminal commands. If you want the whole bar back, a menu bar manager or a below-notch display mode is the next step. Each option trades something away, and this guide covers what.

## Why the notch hides your menu bar icons

The menu bar has two halves. On the left you see app menus such as File and Edit. On the right you see status icons such as Wi-Fi, Battery and Control Center. The notch sits in the middle, between them.

Macworld reports that menu bar extras are only allowed to fill the right side of the notch. Any extra that doesn't fit on that side may not be visible at all. The notch doesn't push icons around. It just leaves less room, and the icons that lose the space are the ones at the far left of the right side.

Jesse Squires wrote about this in December 2023. He argues that macOS hides overflow items with zero indication that more items exist. That matches what most people see. The icon is not gone. It has no room.

Here is a real measurement. On one 14-inch MacBook Pro running macOS 26.6.2, the menu bar was 1800 points wide. The notch took 220 points, about 12% of the bar. Each side strip was 790 points. Everything you want to see has to fit inside those two strips.

Mistake to avoid: assuming a missing icon means the app quit or broke. Check the app before you reinstall anything.

## How to find which menu bar icons are hidden

Since most setups show no overflow button, you have to find hidden icons yourself. Work through this list once. It takes about five minutes.

1. Write down the apps that normally show a menu bar icon. Common ones are a VPN client, a sync tool, Bluetooth, a password manager, and any dictation or assistant app.
2. Open each app. Look for its icon. If the app is running and its icon is absent, it is probably sitting behind the notch.
3. Check the app's own settings. Many apps have a "Show in menu bar" option. If that option is on and the icon is still missing, you have a space problem, not a settings problem.
4. Keep a backup route. You can still reach most apps from the Dock or from Spotlight, which opens with ⌘ Space.

Once you have your list, you know which fix to try. Some icons need removing, some need moving, and a few need more room.

## Fix 1: Command-drag icons out of the menu bar

This is the free fix, and it is the one Apple documents. Apple's Mac Help page, "Use the menu bar on Mac," says Command-drag rearranges status icons. Drag an icon out of the bar while holding Command, and it is removed.

Steps:

1. Hold ⌘.
2. Click an icon and drag it left or right to move it.
3. Keep ⌘ held and drag the icon off the bar to remove it.

Decide where each icon goes. Mainspring, a vendor that sells a spacing tool, suggests moving frequently used icons toward Control Center and rarely used ones toward the notch. The logic is simple. Icons nearest the notch get pushed out first, so put the ones you rarely need there. Their guide is marketing, so treat the advice as a starting point rather than a rule.

Worked example: suppose you have six status icons and only four fit on the right side. Remove the two you check once a month, and the remaining four stay visible. You lose two menu shortcuts, but you don't lose anything you use every day.

Tradeoff: removing an icon removes its menu access. A VPN you check once a week can go. An icon you need every hour should stay, and you need a different fix for it.

## Fix 2: Turn off Control Center modules you don't use

Control Center takes space on the right side of the bar. Many of its modules can appear as separate icons. Turn off the ones you never touch.

Open System Settings > Control Center. Look through the modules, and set any you don't need so they don't show in the menu bar. Bluetooth and Sound are common choices to hide. Each one you switch off frees a slot for an icon you actually use.

Tradeoff: you lose one-click access to that module from the bar. You can still open Control Center from its own icon and reach the setting there, so the loss is small.

## Fix 3: Tighten icon spacing with defaults commands

This fix gives you the most room, and it has the most tradeoffs. Two keys control how far apart status icons sit: NSStatusItemSpacing and NSStatusItemSelectionPadding. Neither key is in Apple's menu bar help page, so treat them as unofficial.

The numbers from people who have tested them:

| Setting | Source | What was reported |
|---|---|---|
| Default (not set) | hop.tools test | About 36 pt per icon, roughly 21 icons in a 790 pt side strip |
| NSStatusItemSpacing 2 | hop.tools test | 22 pt per icon, 35 icons in the same strip |
| 6 for both keys | Mainspring guide | Spacing values from 4 to 8 described as comfortable |
| 12 and 8 | Jesse Squires, 2023 and updated 2024 | His settled values for spacing and padding |

Mainspring also says changes need a log out and back in. That matches the commands below.

Open Terminal and run these two lines:

```
defaults write -g NSStatusItemSpacing -int 6
defaults write -g NSStatusItemSelectionPadding -int 6
```

Then choose Apple menu > Log Out, and log back in. Nothing changes until you do.

To undo the change, run these two lines and log out again:

```
defaults delete -g NSStatusItemSpacing
defaults delete -g NSStatusItemSelectionPadding
```

Tradeoffs to know before you start:

- Undocumented keys can change with a macOS update. Apple's page on the menu bar doesn't mention them.
- Very low values can make icons harder to click. Change one value at a time and test your most-used icons.
- If you'd rather not use Terminal, Mainspring sells a tool that tightens spacing. Its site lists a $29 one-time price and a one-day free trial. Check their pricing page for the current terms.

## Fix 4: Scale an app below the camera

Apple's support article describes a setting for each app. It moves that app's windows below the camera area. Use it when one app is cramped near the notch and the others are fine.

Apple's steps:

1. Quit the app.
2. In Finder, open Applications and select the app.
3. Press ⌘ I to open the Info window.
4. Select "Scale to fit below built-in camera."

Apple says the setting came in with the 2021 notch MacBook Pro models. Macworld lists early apps with the option, including Final Cut Pro, Logic Pro, Xcode and iMovie.

The tradeoff is real. Apple says that while the setting is on, all open apps, or apps sharing the same space, appear below the camera until the scaled app closes. The whole display effectively shrinks while that app is in front. Apple also says the option disappears if a developer updates the app for compatibility with the Mac.

Be careful with expectations. Apple's article is about the app's windows, not about menu bar icon overflow. Test it on your own setup before you rely on it for icon space.

Mistake to avoid: setting it once and assuming it sticks forever. Check the Get Info window again after each app update.

## Fix 5: Below-notch display mode on macOS 27

A third-party guide published September 18, 2026 describes a below-notch mode for macOS 27. In that mode, the top 32 points of the screen turn black, and the menu bar gets its full width back. The cost is height, and the height changes with resolution.

| Resolution (from the guide) | Height given up |
|---|---|
| 1280 x 832 | 32 pt |
| 1470 x 956 | 38 pt |
| 1710 x 1112 | 44 pt |

That black band takes space from every app, not just the menu bar. If you work with tall documents or spreadsheets, check how much height you can spare before you turn it on.

The same guide says Apple showed macOS 27, called Golden Gate, at WWDC on June 8, 2026. It also says macOS 27 adds a native overflow button for icons that don't fit beside the notch. Apple's own pages do not confirm that overflow button. Check Apple's macOS 27 release notes once you upgrade, and don't count on the button until you see it on your own Mac.

## Menu bar managers: what works on macOS 27 right now

A menu bar manager hides icons behind one toggle and shows them when you need them. The Bartender website says the app can automatically hide items that the notch would hide. Hidden items can be shown again with a click or a hotkey.

The sources on macOS 27 support do not agree, so read them side by side:

| App | What the sources say | Status for macOS 27 |
|---|---|---|
| Bartender | Vendor site says Bartender 7 is built for macOS 27, with Tahoe support for Bartender 7 coming shortly after launch. Bartender 6 is the Tahoe build until then. | Sources disagree. A macOS 27 guide says Bartender broke on macOS 27 and lists Bartender 7 as the macOS 27 build. |
| Ice | A macOS 27 guide says its last release was 0.11.13-dev.2 on September 16, 2025, and bug reports had no visible maintainer reply. | The guide reports no macOS 27 release. We could not open Ice's GitHub page to check this. |
| Hidden Bar | The same guide says Hidden Bar works from version 1.11.1 when installed outside the App Store, and needs Accessibility permission. | Another guide says the wide-separator trick it uses no longer pushes icons on macOS 27. |
| Thaw | The same guide says stable 2.0.1 targets macOS 26, with a 3.0 alpha for macOS 27. | Only an alpha exists for macOS 27. Expect rough edges. |

Practical rules for managers:

- Read the release notes for the exact macOS version you run.
- Grant Accessibility permission only to apps you trust, and only after you've read what they need it for.
- Keep one known way to reveal hidden icons, such as a hotkey you remember.

If you want a wider list of notch tools, read [Mac Notch Apps in 2026: What Each One Is Actually For](/blog/mac-notch-apps-what-each-does). It sorts the apps by what they are for.

## How much room the numbers really give you

The test numbers help you think about your own bar. Here is the arithmetic. On the test Mac, the notch left 1580 points across the two side strips. Each strip was 790 points. At default spacing, about 36 points went to each icon, so one side held roughly 21 icons. With spacing set to 2, the pitch fell to 22 points, and the same side held 35.

Try it with a number you can check. Say you want 25 icons visible on one side. At default spacing, the test strip shows about 21, so roughly four slip behind the notch. At spacing 2, the same strip holds 35, and all 25 fit with room to spare. That is the difference between hiding four icons and hiding none.

Your Mac will differ. Your display resolution, your app count and your scaling all change the width. The test ran at default scaling, so treat the numbers as a guide, not a promise.

To test your own setup, follow these steps:

1. Count the icons you want to keep visible.
2. Note how many fit on each side right now.
3. Apply one spacing value, log out and back in, then count again.
4. Keep the value that shows everything you need, without making icons hard to click.

If the count still falls short after spacing, you have a choice. Remove icons, move some of them, or move to a manager. The spacing step tells you how much room you need, which makes the next choice easier.

## Mistakes people make with hidden menu bar icons

- Reading a missing icon as a broken app. Confirm the app runs first.
- Setting spacing to a very low value and then struggling to click icons. Go one step at a time.
- Forgetting to log out after a defaults change. The new value does nothing until you do.
- Installing a manager on macOS 27 without checking its release notes for that version.
- Trusting one guide. The sources in this guide disagree on several points, and you should check each one.
- Believing Scale to fit below built-in camera is permanent. Apple says developer updates can remove the option.

## Should you upgrade to macOS 27 for this?

Don't upgrade only to fix hidden icons. The native overflow button is described in a third-party guide and is not confirmed on Apple's pages. The below-notch mode costs 32 to 44 points of height, based on that same guide. Use the free fixes now. Upgrade when the rest of your workflow is ready for macOS 27, then check whether the overflow button exists on your Mac.

## Which fix should you try first?

Use this table to pick a starting point. Most people need two fixes at most.

| Your situation | Try first | Main tradeoff |
|---|---|---|
| Only a few icons are missing | Command-drag the unused ones out | You lose menu access to those icons |
| Many icons are missing and you want them all | Tighten spacing with defaults | Undocumented keys, and very low values are hard to click |
| One app's windows are cramped near the notch | Scale to fit below built-in camera | The display shrinks while that app is in front |
| You're on macOS 27 and want the full bar | Below-notch mode, per a third-party guide | 32 to 44 pt of height is given up |
| You want auto-hide with one-click reveal | A menu bar manager | Version support differs, and it needs Accessibility permission |

## Where Lazur helps, and where it doesn't

Lazur is a voice assistant that lives in the notch on your Mac. It does not click buttons, move menu bar icons or change system settings for you. It helps you find things and learn the steps.

Two ways it can help with this problem:

- Hold ⌥ ⌘ and ask where Control Center is. Lazur draws a circle and a label around it on your screen, so you know where to look.
- Ask how to turn off a Control Center module. Lazur guides you one click at a time and waits for each click before it moves on.

If you want that help on your Mac, [download Lazur here](/download).
