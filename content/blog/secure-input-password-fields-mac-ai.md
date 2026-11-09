---
title: 'Secure input mac password field: why your text tools go silent on Mac in 2026'
description: >-
  Secure Input stops text tools in password fields on Mac. Learn why it sticks,
  how to clear it, and how to find the app holding it.
targetKeyword: secure input mac password field
category: Guide
cover: privacy
tldr:
  - >-
    Secure Input is a macOS switch that stops other apps from reading your
    keystrokes. It sticks when the app that turned it on never turns it off.
  - >-
    Click away from the password field, quit the app holding the switch, or turn
    off Terminal > Secure Keyboard Entry. Lock with ⌘⌃Q or restart if that
    fails.
  - >-
    To find the holder, run ioreg and ps in Terminal. Never kill loginwindow to
    clear the switch, because it logs you out.
faq:
  - question: What does Secure Input mean on a Mac?
    answer: >-
      Secure Input is a macOS mode that an app turns on so other software cannot
      read what you type. Apple's developer note says the function arrived with
      Mac OS X 10.3. While the mode is on, text expanders and hotkey apps get no
      keystrokes.
  - question: How do I turn off Secure Input on a Mac?
    answer: >-
      Click away from the password field, close the prompt, or quit the app
      holding the switch. If the holder is Terminal, open the Terminal menu and
      turn off Secure Keyboard Entry. If nothing else works, lock the screen
      with ⌘⌃Q or restart the Mac.
  - question: Is Secure Input the same as Input Monitoring?
    answer: >-
      No. Input Monitoring is a list in System Settings > Privacy & Security
      that controls which apps may read keyboard, mouse or trackpad input.
      Secure Input is a separate switch that an app turns on. Changing the Input
      Monitoring list does not clear it.
  - question: Can I find which app is blocking my text tool?
    answer: >-
      Yes. Run ioreg -a -l -w 0 in Terminal, find kCGSSessionSecureInputPID, and
      read the process number beside it. Then run ps -p with that number to get
      the app name. Test the method with the getpass example first.
  - question: Will a macOS update stop Secure Input from getting stuck?
    answer: >-
      Apple's security notes for macOS Tahoe 26.7 mention improved handling of
      the secure input state in WindowServer. The notes do not say it fixes
      every stuck case, so test your text tool after you update.
relatedSlugs:
  - mac-dictation-not-working-fixes
  - accessibility-vs-screen-recording-ai-permissions
  - private-ai-assistants-on-mac
stats:
  - value: 36%
    label: >-
      of U.S. adults use a password manager, per a Security.org poll of 1,000
      adults in October 2024
    sourceUrl: 'https://www.security.org/digital-safety/password-manager-annual-report/'
    sourceTitle: 2024 Password Manager Industry Report and Statistics
sources:
  - title: 'Apple Technical Note TN2150: Using Secure Event Input Fairly'
    url: 'https://developer.apple.com/library/mac/technotes/tn2150/_index.html'
    publisher: Apple Developer
    accessedAt: '2026-11-08'
  - title: Finding the app/process that's using Secure Input
    url: 'https://alexwlchan.net/2021/secure-input/'
    publisher: alexwlchan.net
    accessedAt: '2026-11-08'
  - title: macOS Secure Input & Shortcut Troubleshooting
    url: 'https://nevertype.pro/docs/secure-input'
    publisher: NeverType
    accessedAt: '2026-11-08'
  - title: Use secure keyboard entry in Terminal on Mac
    url: >-
      https://support.apple.com/guide/terminal/use-secure-keyboard-entry-trml109/mac
    publisher: Apple Support
    accessedAt: '2026-11-08'
  - title: Control access to input monitoring on Mac
    url: >-
      https://support.apple.com/guide/mac-help/control-access-to-input-monitoring-on-mac-mchl4cedafb6/mac
    publisher: Apple Support
    accessedAt: '2026-11-08'
  - title: How to disable secure input
    url: 'https://discussions.apple.com/thread/254163079'
    publisher: Apple Community
    accessedAt: '2026-11-08'
  - title: About the security content of macOS Tahoe 26.7
    url: 'https://support.apple.com/en-us/149042'
    publisher: Apple Support
    accessedAt: '2026-11-08'
  - title: 2024 Password Manager Industry Report and Statistics
    url: 'https://www.security.org/digital-safety/password-manager-annual-report/'
    publisher: Security.org
    accessedAt: '2026-11-08'
howto:
  name: Clear a stuck Secure Input switch on Mac
  steps:
    - name: Test the Notes field
      text: >-
        Click into a plain text field in Notes and type a few letters. If your
        text tool works there, the stuck holder is probably the app where the
        tool failed.
    - name: Close the password prompt
      text: >-
        Close the password prompt or click away from the password field. If a
        password manager is waiting, press Esc.
    - name: Quit the suspect app
      text: >-
        Press ⌘Q in the app you suspect, wait briefly, then reopen it and test
        your text tool again.
    - name: Turn off Terminal's Secure Keyboard Entry
      text: >-
        If Terminal is the holder, open the Terminal menu and click Secure
        Keyboard Entry to remove its checkmark.
    - name: Lock and sign back in
      text: >-
        Lock the screen with ⌘⌃Q, sign back in, and test again. If the switch is
        still stuck, restart the Mac.
publishedAt: '2026-11-08'
updatedAt: '2026-11-08'
author: Lazur Team
images:
  - url: >-
      https://images.lazur.app/content-images/blog/secure-input-password-fields-mac-ai/secure-input-mac-password-field-1-9815ad.jpg
    width: 1280
    height: 853
    alt: >-
      Man typing a password on a laptop keyboard, the kind of login field where
      Secure Input can switch on on a Mac
    caption: A login prompt is where Secure Input usually starts.
    keywords:
      - secure input mac password field
      - secure
      - input
      - mac
      - man typing on laptop
      - Mac
      - Lazur
    credit:
      name: StartupStockPhotos
      url: 'https://pixabay.com/users/StartupStockPhotos-690514/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/student-typing-keyboard-text-849825/'
  - url: >-
      https://images.lazur.app/content-images/blog/secure-input-password-fields-mac-ai/secure-input-mac-password-field-2-0cd849.jpg
    width: 1280
    height: 853
    alt: >-
      Person working on a MacBook at a desk, typing text into a Mac app that
      depends on keystrokes
    caption: Text tools depend on keystrokes reaching them.
    keywords:
      - secure input mac password field
      - secure
      - input
      - mac
      - person using macbook office
      - Mac
      - Lazur
    credit:
      name: StockSnap
      url: 'https://pixabay.com/users/StockSnap-894430/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/laptop-apple-macbook-computer-2562361/'
  - url: >-
      https://images.lazur.app/content-images/blog/secure-input-password-fields-mac-ai/secure-input-mac-password-field-3-f09699.jpg
    width: 1280
    height: 854
    alt: >-
      Close-up of a laptop screen showing a login form, a common spot for a
      secure input mac password field prompt
    caption: Login forms are a common place for the switch to turn on.
    keywords:
      - secure input mac password field
      - secure
      - input
      - mac
      - laptop login screen
      - Mac
      - Lazur
    credit:
      name: AS_Photography
      url: 'https://pixabay.com/users/AS_Photography-1546875/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/twitter-screen-social-telephone-1795652/'
generator:
  by: scripts/content
  model: haiku
  runId: daily-2026-11-08
  version: 1
heroImage:
  url: >-
    https://images.lazur.app/content-images/blog/secure-input-password-fields-mac-ai/secure-input-mac-password-field-1-9815ad.jpg
  width: 1280
  height: 853
  alt: >-
    Man typing a password on a laptop keyboard, the kind of login field where
    Secure Input can switch on on a Mac
  caption: A login prompt is where Secure Input usually starts.
  keywords:
    - secure input mac password field
    - secure
    - input
    - mac
    - man typing on laptop
    - Mac
    - Lazur
  credit:
    name: StartupStockPhotos
    url: 'https://pixabay.com/users/StartupStockPhotos-690514/'
    source: Pixabay
    sourceUrl: 'https://pixabay.com/photos/student-typing-keyboard-text-849825/'
keywordHits:
  target: secure input mac password field
  inTitle: true
  inH1: true
  inDescription: true
  inIntro: true
  bodyCount: 4
  secondary: {}
---

Secure Input is a macOS mode that an app turns on so other software cannot read what you type. When the app that turned it on never turns it off, text expanders, hotkey apps and dictation tools go quiet in every app, not just the password field.

You usually notice it at a login prompt. You type, nothing happens, and your shortcuts stop working everywhere. This guide explains what Secure Input does, why it sticks, how to clear it, and how to find the app holding it.

## What Secure Input does on a Mac

Secure Input is a switch inside macOS. An app turns it on by calling a system function. Apple's developer documentation calls that function EnableSecureEventInput. Apple's Technical Note TN2150 says the function arrived with Mac OS X 10.3 to protect keyboard entry in custom data-entry fields.

While the switch is on, your keystrokes go only to the app you are typing in. Tools that watch keys from outside that app get nothing. Apple's note lists event taps, HID seizing and GetKeys callers as the tools that get blocked. Text expanders and hotkey apps sit in that group.

The block is system-wide. It also holds when the app that turned it on is in the background. Apple's note says a process that leaves secure event input enabled can block keyboard intercept processes even while it is in the background. So a password prompt in a window you forgot about can still silence your tools.

The app you are typing into still receives your keys. Secure Input only stops other software from seeing them.

Apple's rule is short. Turn the switch on only when focus moves into a private data-entry field. Turn it off when focus moves to a normal field, or when the app loses focus. The note says it must never be used for general text input or left on for the life of the app.

I found no current Apple support article that explains Secure Input to end users. The 2007 developer note is still the clearest explanation I found. Treat it as the design rule, not a user guide.

## Why your text tool goes silent in a password field

The failure follows a short sequence. Here it is in order.

1. You click into a password field, such as a login form, a password manager prompt or a sudo prompt in Terminal.
2. The app turns Secure Input on, as designed.
3. You click away, close the prompt, or the app loses focus.
4. The app never turns Secure Input off, so the switch stays on.
5. Your text expander, hotkey app or dictation tool gets no keystrokes until the switch clears.

Step 4 is the fault. It sits with the app holding the switch, not with the tool that went quiet. Your text expander did nothing wrong. It just cannot see your keys.

A quick test tells you which side you are on. Click into Notes and type a few letters. If your text tool works there but not in Chrome, the holder is probably Chrome or the page you logged into. If it fails in every app, look for a background app or a prompt that never closed.

Voice tools can fail the same way if they depend on keyboard intercept. If you are not sure whether your voice tool is dictation or a chat window, read [Claude desktop voice input on Mac](/blog/claude-desktop-voice-mac) first. Then run the same Notes test.

## Which apps usually hold Secure Input

NeverType, a Mac keyboard tool, lists the most common holders in its troubleshooting docs. The 2021 example output in alexwlchan's post also names loginwindow, Safari and iTerm2. Use the table below as a starting point.

| Usual holder | First fix to try |
|---|---|
| Password managers such as 1Password, Bitwarden and KeePassXC | Press Esc, or quit and reopen the manager |
| Terminal and iTerm2 | Turn off Secure Keyboard Entry |
| Browsers such as Chrome, Arc, Brave and Safari | Click away from the password field, or quit the browser |
| macOS LoginWindow and Touch ID prompts | Lock the screen with ⌘⌃Q, or restart the Mac |

NeverType's page also says that in 99% of cases one of these four categories holds Secure Input. It gives no method, sample or data source for that figure. Don't quote it as a headline number. Use the table to decide what to try first.

Terminal needs its own note. Secure Keyboard Entry is a setting you switch on yourself. It stays on until you switch it off. That makes Terminal an easy suspect when a tool goes quiet.

One number helps set expectations. A Security.org poll from October 2024 found that 36% of U.S. adults use a password manager. That shows how many people meet these prompts. It does not measure how often Secure Input gets stuck.

## How to tell Secure Input from a broken tool

Not every silent tool has a stuck switch. Some tools are simply closed, paused or missing a permission. Run through these checks before you go hunting for a holder.

- Is the tool running? Look for its icon in the menu bar or the Dock. A quit tool cannot type anything.
- Does it work in one app and not another? That points at the app where it fails, not at the tool.
- Does it work after you lock the screen and sign back in? A clean result there suggests a stuck switch.
- Does it fail only after a password prompt? That is the classic pattern for Secure Input.

If the tool is running and the failure follows a prompt, you are almost certainly looking at Secure Input. If the tool is not running, open it first. Then test again. Only move to the quick fixes after that.

## Quick fixes, in the order to try them

Work from the lightest fix to the heaviest. Stop as soon as your tool wakes up.

1. Click into a plain text field in another app, such as Notes, and type. Then test your text tool again.
2. Close the password prompt. If a password manager is waiting, press Esc.
3. Quit the app you suspect. Press ⌘Q, wait briefly, then reopen the app.
4. If the holder is Terminal, open the Terminal menu and find Secure Keyboard Entry. A checkmark means it is on. Click the item to turn it off.
5. Lock the screen with ⌘⌃Q, sign back in, and test again. If that fails, restart the Mac.

Here is a worked example. Say your text expander stops working in Chrome right after you log into a site. You click into Notes, and the expander works. That points at Chrome or the login page. Press ⌘Q in Chrome, reopen it, and test. If the expander still fails in Chrome, the holder survives a quit. Move on to the search steps below.

Check before you turn off Terminal's setting. Apple says the setting can stop other apps from detecting and recording what you type in Terminal. Turning it off lets them see those keys again. Apple advises checking that other apps don't need keystrokes from Terminal first. If you type secrets into Terminal and no other tool needs those keys, keep it on. Then use a different app for your text tool while Terminal is open.

## How to find the app holding Secure Input

When the quick fixes fail, identify the holder. The method comes from alexwlchan's 2021 post. It reads a value from macOS session data, then maps a process number to an app name.

1. Open Terminal from Applications > Utilities.
2. Run ioreg -a -l -w 0 | grep -A1 kCGSSessionSecureInputPID. Read the number next to the key name. That number is a process ID.
3. Run ps -p 1234 -o comm=, with 1234 replaced by your number. The process name prints.
4. Match the name to an app you used recently. If it is a password manager, a browser or Terminal, you have your holder.

If nothing prints in step 2, Secure Input is off at that moment. Reproduce the problem first, then run the command while the tool is silent.

Test the method before you trust it. In Terminal, run python3 -c 'import getpass; getpass.getpass()' and leave the password prompt open. Switch to another window, then run the steps above. Terminal should appear in the list. Press ⌃C to end the test.

Your list will differ from the 2021 example. Look for the app you touched last. That is the one most likely to have left the switch on.

## Mistakes that make it worse

- Killing loginwindow. alexwlchan warns against it because it logs you out. You can lose unsaved work. Don't use it to clear the switch.
- Reinstalling your text tool. The tool is usually not the problem. The switch belongs to another app, so a reinstall leaves it on.
- Forgetting Terminal's setting. Secure Keyboard Entry stays on until you turn it off. Check the Terminal menu before you blame your expander.
- Mixing up Input Monitoring with Secure Input. Input Monitoring lives at Apple menu > System Settings > Privacy & Security > Input Monitoring. It controls which apps may monitor keyboard, mouse or trackpad input. A 2022 Apple Community thread shows a specialist pointing there for a blocked text tool. Check it when a trusted app lacks permission. Don't expect it to clear the switch.
- Waiting for the problem to fix itself. A stuck holder keeps the switch on until something releases it. Quit the app or restart.

## Does a macOS update fix it?

Apple's security notes for macOS Tahoe 26.7 list CVE-2026-65379 in WindowServer. Apple says it was addressed with improved handling of the secure input state. The listed impact is that an app may access sensitive user data. macOS Tahoe 26.7 came out on September 14, 2026.

The notes do not say the update clears the stuck switch you see every day. Install it anyway if you run Tahoe, because it fixes a listed security issue. Then test your tool. If the problem stays, the holder still needs quitting.

To check your version, choose Apple menu > About This Mac. To update, choose Apple menu > System Settings > General > Software Update.

## What developers should do about custom password fields

Apple's note gives the reason for the design. Keyboard entry in a password field is sensitive, so macOS blocks other software from reading it. The note also says an app can ask whether Secure Input is on with IsSecureEventInputEnabled.

For Cocoa apps, the note recommends NSSecureTextField, which handles secure input correctly. A well-built app then does not have to manage the switch itself.

If you maintain a Mac app with custom password fields, follow Apple's rule. Turn the switch on only inside the field. Turn it off when focus leaves. If a user reports a silent tool after your app, that is the first code path to check.

## Where Lazur fits

Lazur is a voice assistant for the Mac. You hold a key and talk. Hold fn to dictate clean text at the cursor in any app. Lazur listens and looks at the screen only while you hold the shortcut. Audio and the screenshot go to AI providers to answer you, and they are not stored.

Lazur does not click buttons or work inside other apps for you. For a stuck switch, it helps with the guidance part. Ask Lazur where the Input Monitoring list is, and it draws a circle around it. Ask it to walk you through the Terminal menu, and it guides you one click at a time.

Dictation can go quiet in the same way if it depends on keyboard intercept. Run the Notes test first. If it works in Notes but fails in the password field, the holder is probably the app where it failed. If you want a voice assistant that talks you through these steps, [download Lazur](/download) for the Mac.

## When the field stays stuck

If none of the steps works, restart the Mac. A restart clears the switch. Then write down the holder's name, your macOS version, and the steps that failed. Send that to the app's developer. A clear report helps them find the code path that never turned the switch off.

Locking a document is a separate job. If you need a password on a file, see [How to password protect a document in Word on Mac](/how-to/password-protect-a-document-in-word).
