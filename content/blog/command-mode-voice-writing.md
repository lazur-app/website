---
title: >-
  Intent Mode: voice commands that finish the work on Mac, with examples for
  2026
description: >-
  Voice commands that finish the work act on what you mean, not what you say.
  Here is how Intent Mode works on Mac, where it fails, and how to test it.
targetKeyword: voice commands that finish the work
category: Guide
cover: waveform
tldr:
  - >-
    Voice commands that finish the work tell the app what to produce, such as a
    reply or a shorter version, using the text already on your screen.
  - >-
    Dictation types the words you say. Intent Mode acts on what you mean. Most
    dictation apps call the same idea command mode.
  - >-
    Keep each spoken instruction to one outcome. In a research prototype,
    multi-step voice tasks finished in 120 of 140 test cases, so check every
    draft.
faq:
  - question: What are voice commands that finish the work?
    answer: >-
      They are spoken instructions that act on text or context already on your
      screen. You say the outcome, such as “reply and keep it brief,” and the
      app writes the finished text. Dictation only types the words you speak.
  - question: How is Intent Mode different from dictation?
    answer: >-
      Dictation puts your spoken words at the cursor. Intent Mode reads the
      message, email, or selection in front of you and produces the result you
      described. Lazur calls this Intent Mode. Most dictation apps call the same
      idea command mode.
  - question: Can a voice command finish a multi-step task on Mac?
    answer: >-
      Sometimes, but not reliably yet. A research prototype completed 120 of 140
      multi-step test cases. Apple’s Voice Control command mode ignores speech
      that is not a command. Give one outcome at a time and check each result
      before you move on.
  - question: Should I speak passwords or API keys to a voice tool?
    answer: >-
      No. Treat the microphone like a chat window. Say the field name and type
      the secret yourself. Lazur listens and looks at the screen only while you
      hold the shortcut, and it does not use your content to train AI models.
  - question: Does Lazur click buttons or send messages for me?
    answer: >-
      No. Lazur does not click buttons or operate other apps for you. It drafts
      and types text at the cursor, answers out loud, and guides you through
      steps. You still press Send yourself.
relatedSlugs:
  - ai-work-assistant-vs-dictation-app-vs-chatgpt
  - messy-speech-to-finished-writing
  - ai-assistants-that-understand-your-screen
stats:
  - value: 153 WPM
    label: >-
      English speech entry on phones versus 52 WPM on the iOS keyboard, in a
      2017 lab study
    sourceUrl: 'https://arxiv.org/abs/1608.07323'
    sourceTitle: >-
      Speech Is 3x Faster than Typing for English and Mandarin Text Entry on
      Mobile Devices (arXiv 1608.07323)
  - value: 85.7%
    label: >-
      Multi-step mobile test cases completed by the GPTVoiceTasker research
      prototype (120 of 140)
    sourceUrl: 'https://arxiv.org/html/2401.14268v2'
    sourceTitle: >-
      GPTVoiceTasker: Advancing Multi-step Mobile Task Efficiency Through
      Dynamic Interface Exploration and Learning
  - value: 92.5 s
    label: >-
      Average completion time for GPTVoiceTasker in its user study, versus 162.2
      s for Google Voice Access
    sourceUrl: 'https://arxiv.org/html/2401.14268v2'
    sourceTitle: >-
      GPTVoiceTasker: Advancing Multi-step Mobile Task Efficiency Through
      Dynamic Interface Exploration and Learning
  - value: '199'
    label: >-
      Voice assistant failures analyzed in a CHI 2023 mixed-methods study,
      across 12 failure sources
    sourceUrl: 'https://arxiv.org/html/2303.00164v2'
    sourceTitle: >-
      A Mixed-Methods Approach to Understanding User Trust after Voice Assistant
      Failures (CHI 2023)
sources:
  - title: 'Intent Mode: voice commands that finish the work (Lazur blog)'
    url: 'https://www.lazur.app/blog/command-mode-voice-writing'
    publisher: Lazur
    accessedAt: '2026-11-07'
  - title: >-
      Speech Is 3x Faster than Typing for English and Mandarin Text Entry on
      Mobile Devices (arXiv 1608.07323)
    url: 'https://arxiv.org/abs/1608.07323'
    publisher: arXiv / ACM IMWUT
    accessedAt: '2026-11-07'
  - title: >-
      GPTVoiceTasker: Advancing Multi-step Mobile Task Efficiency Through
      Dynamic Interface Exploration and Learning (arXiv 2401.14268v2)
    url: 'https://arxiv.org/html/2401.14268v2'
    publisher: arXiv
    accessedAt: '2026-11-07'
  - title: >-
      A Mixed-Methods Approach to Understanding User Trust after Voice Assistant
      Failures (arXiv 2303.00164v2, CHI 2023)
    url: 'https://arxiv.org/html/2303.00164v2'
    publisher: arXiv / ACM CHI 2023
    accessedAt: '2026-11-07'
  - title: Use Voice Control on Mac
    url: 'https://support.apple.com/guide/mac-help/use-voice-control-mh40719/mac'
    publisher: Apple Support
    accessedAt: '2026-11-07'
  - title: Voice Access - Android Accessibility Help
    url: 'https://support.google.com/accessibility/android/answer/6151848'
    publisher: Google Support
    accessedAt: '2026-11-07'
publishedAt: '2026-08-22'
updatedAt: '2026-11-06'
author: Lazur Team
images:
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/command-mode-voice-writing/voice-commands-that-finish-the-work-1-607def.jpg
    width: 1280
    height: 658
    alt: >-
      Person at a laptop on a desk with a microphone nearby, the setup for voice
      commands that finish the work
    caption: A desk setup for voice work on a laptop
    keywords:
      - voice commands that finish the work
      - voice
      - commands
      - that
      - man laptop desk
      - Mac
      - Lazur
    credit:
      name: Tumisu
      url: 'https://pixabay.com/users/Tumisu-148124/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/silhouette-rope-couple-separation-5726230/'
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/command-mode-voice-writing/voice-commands-that-finish-the-work-2-788058.jpg
    width: 1280
    height: 854
    alt: >-
      Microphone on a work desk beside a computer, the kind of setup used for
      voice commands that finish the work
    caption: A microphone and a computer on a work desk
    keywords:
      - voice commands that finish the work
      - voice
      - commands
      - that
      - microphone desk work
      - Mac
      - Lazur
    credit:
      name: jhenning
      url: 'https://pixabay.com/users/jhenning-8658480/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/laptop-conference-table-mouse-work-7978588/'
  - url: >-
      https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/command-mode-voice-writing/voice-commands-that-finish-the-work-3-2f0a90.jpg
    width: 1280
    height: 853
    alt: >-
      Hands typing on a laptop in an office, the slow manual step that voice
      commands that finish the work can shorten
    caption: Typing a reply by hand on a laptop
    keywords:
      - voice commands that finish the work
      - voice
      - commands
      - that
      - typing laptop office
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
  runId: daily-2026-11-06
  version: 1
heroImage:
  url: >-
    https://lfobmih1tpj3sgpo.public.blob.vercel-storage.com/content-images/blog/command-mode-voice-writing/voice-commands-that-finish-the-work-1-607def.jpg
  width: 1280
  height: 658
  alt: >-
    Person at a laptop on a desk with a microphone nearby, the setup for voice
    commands that finish the work
  caption: A desk setup for voice work on a laptop
  keywords:
    - voice commands that finish the work
    - voice
    - commands
    - that
    - man laptop desk
    - Mac
    - Lazur
  credit:
    name: Tumisu
    url: 'https://pixabay.com/users/Tumisu-148124/'
    source: Pixabay
    sourceUrl: 'https://pixabay.com/photos/silhouette-rope-couple-separation-5726230/'
keywordHits:
  target: voice commands that finish the work
  inTitle: true
  inH1: true
  inDescription: true
  inIntro: true
  bodyCount: 12
  secondary: {}
---

Voice commands that finish the work are spoken instructions that act on what is already on your screen. You say the outcome you want, such as “reply and keep it brief,” and the app produces the finished text.

Dictation does something different. It types the words you speak, so you still write the reply, rewrite the paragraph, and fix the tone yourself. This guide explains the difference, shows where the idea works and where it breaks, and gives you a test you can run on your Mac today.

## What voice commands that finish the work actually mean

Most voice tools do one job. They turn speech into text at the cursor. You talk, the words appear, and you still do all the thinking.

A voice command that finishes the work starts from the content in front of you. You look at a message or select a paragraph. Then you say what should happen to it. The app reads the text, works out what you mean, and writes the result.

Lazur calls this Intent Mode. Most dictation apps call the same idea command mode. The label matters less than the behavior. Ask one question about any voice tool: does it type my sentence, or does it do the job my sentence describes?

Try this now. Open an email you have not answered. Say, “Reply, confirm Thursday, ask for the file by noon, keep it short.” If you get your sentence cleaned up, you have dictation. If you get a finished reply to that email, you have a command.

## Dictation, command mode, and intent side by side

The same spoken line can produce very different output. This table shows four examples. Check each row against the mode you use.

| You say | Dictation output | Command or Intent output |
| --- | --- | --- |
| “Reply, Thursday works, casual tone” | Your words, cleaned up with punctuation | A casual reply that confirms Thursday |
| “Make this shorter and less formal” (text selected) | The instruction, typed at the cursor | The selected paragraph, shorter and less formal |
| “Turn this bug report into a Cursor prompt with error handling” | Spoken text with filler words | A usable prompt built from the report |
| “Ask them to send the file by noon” (thread open) | The sentence as you said it | A line that fits the thread and its tone |

The last column is the one to watch. Dictation gives you more typing to do. A command gives you a draft you can check at a glance.

Notice what the command column depends on. It depends on the thread, the selection, and the facts you give. Without those, the output is generic. That is the most common failure, and we come back to it below.

If you want the difference between a dictation app, a chatbot, and an assistant that sees your screen, read [AI work assistant vs dictation app vs ChatGPT](/blog/ai-work-assistant-vs-dictation-app-vs-chatgpt).

## Why speaking beats typing, and where the gain stops

Speed is the reason most people try voice first. A 2017 study in the ACM journal *Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies* compared speech and keyboard entry for short messages on touchscreen phones. English speech reached 153 words per minute. The iOS keyboard reached 52. That is about 2.9 times faster.

Read that number with care. It is a lab study. It used short messages and an older speech engine. Two of the authors worked for Baidu, the speech vendor, so treat the figure as a best case.

The same study also shows a trade. During entry, the speech group’s corrected error rate was 5.30%, against 11.22% for the keyboard. In the final text, uncorrected errors were 1.30% for speech and 0.79% for the keyboard. Speech gets words down faster, but more mistakes can survive into the text you send.

The practical lesson is simple. A spoken instruction is only as good as the draft you check. Read the output before you send, every time. If you want the basics of voice writing first, start with [what voice writing is](/blog/what-is-voice-writing).

## Which tasks suit voice commands and which do not

Not every task fits. Use this table as a starting point, then adjust it to your own work.

| Task | Good fit? | Why |
| --- | --- | --- |
| Short reply to a clear message | Yes | The context is on screen and the output is short |
| Shortening a selected paragraph | Yes | The selection sets a clear boundary |
| Turning rough notes into a prompt or outline | Yes | The output is text you can check quickly |
| Contract clauses, tax figures, medical details | Check every line | A small error can cost real money or harm |
| Long multi-app research with many steps | Split it | Chained tasks fail more often |
| Passwords, API keys, account numbers | No | Keep secrets out of speech entirely |
| Clicking through a settings panel for you | No, but guidance helps | Command tools write text, they do not click |

The rule of thumb is this. Use voice commands for work that ends in text you can read in a few seconds. Be careful with anything where one wrong word creates a real problem.

## Why multi-step voice tasks still fail

“Finishing the work” often means several steps in a row. Research on multi-step voice tasks is thin, and most of it comes from prototypes. Three sources still help.

**A multi-step prototype.** GPTVoiceTasker, a research system, completed 120 of 140 test cases on multi-step mobile tasks, which is 85.7%. In its user study with 18 participants, it averaged 92.5 seconds per task. Google’s Voice Access averaged 162.2 seconds in the same study. The authors built a research tool, not a shipping product, so read these numbers as a direction, not a promise.

**Failures make people stop.** A CHI 2023 study analyzed 199 voice assistant failures across 12 failure sources. It found that users often stopped using their voice assistant for a task that had failed. They returned later, usually for similar tasks, but their trust took a hit. One bad draft can make you distrust the whole flow.

**Commands ignore chatter.** Apple’s Voice Control guide says Command mode responds only to commands and ignores other speech. It also asks you to pause about half a second between successive commands. If you run several clauses together, the tool may hear fragments.

The lesson is consistent across all three. Keep one spoken instruction to one outcome. If the task has several parts, give several instructions and check each one before the next.

## A worked example: answering a thread by voice

Here is a realistic case. A teammate asks in Slack whether you can move Thursday’s review. You can, but only on Friday morning, and the designer is out that day.

1. **Read the thread first.** Your eyes do this part. The tool sees the screen, but it cannot know your calendar or the designer’s leave unless you say so.
2. **Place the cursor in the reply box, or select the message.** Selection is the clearest signal, so use it when you can.
3. **Give one clear instruction.** For example: “Reply, move the review to Friday morning, mention the designer is out, keep it short.”
4. **Read the draft.** Check the day, the names, and the tone. This is where a wrong detail shows up.
5. **Correct with one follow-up.** Say “drop the apology” or “make it warmer.” Do not dictate a new essay.
6. **Send it yourself.** Command tools produce text. They do not press Send for you.

The whole loop should take a little talking and a careful read. If it takes longer than typing, your instruction was too vague or too long. Shorten it and try again.

## How to phrase an instruction that finishes the work

Most weak results come from vague instructions. A good pattern has four parts: the action, the facts the tool cannot see, the tone, and the length.

| Vague | Specific |
| --- | --- |
| “Make this better” | “Make this clearer for a client who has not seen the project. Keep the dates.” |
| “Reply” | “Reply yes to the Friday slot, ask for the agenda, sign off as me.” |
| “Shorten it” | “Cut the background paragraph. Keep the decision and the deadline.” |
| “Fix the tone” | “Sound calm and direct, not defensive. No apology in the first line.” |

The specific column works because it gives the tool the facts and the limits. You do the thinking once, out loud, instead of three times on the keyboard.

Two habits help. Say the outcome before the detail. And name the message you mean when more than one is on screen, such as “the second message from Priya.”

## Edge cases that trip up good instructions

Even a clear instruction can go wrong in a few predictable places.

- **Long threads.** The tool may focus on the newest message. Name the one you mean, such as “reply to Priya’s question about the budget, not the last one.”
- **Selections that span two paragraphs.** Select exactly the text you want changed. A loose selection gives a loose rewrite.
- **Names and numbers.** Repeat them in the instruction so the draft carries them correctly. Then check them against the source.
- **Code.** When a snippet is on screen, say “keep the code as it is, change only the comment.” Without that line, the tool may rewrite more than you wanted.
- **Language.** Say which language the reply should use. Do not assume the tool will match the thread.

None of these needs special software. They need a habit of naming the thing you mean.

## Mistakes people make with spoken commands

Most mistakes are easy to spot once you know them.

- **Dictating the answer, then asking for a fix.** You do the work twice. Say the outcome, not the full sentence.
- **Forgetting the window.** If the thread sits in a background window, the tool may read the wrong one. Bring the right window forward first.
- **Chaining too many steps.** Several clauses in one breath make the output hard to predict. Split the task.
- **Trusting the first draft for money, legal, or medical text.** Read those lines twice. Check figures and names against the source.
- **Expecting clicks.** Command tools write text and answer questions. They do not operate other apps for you.

If you still get weak output after fixing these, the problem may be the microphone or the input. The fixes in [Mac dictation not working](/blog/mac-dictation-not-working-fixes) cover that case.

## Built-in Mac options and where they stop

macOS includes Voice Control in the Accessibility settings. It is strong for controlling the Mac by voice. Apple’s guide says text-editing commands work in Dictation and Spelling modes. It also says standard macOS Dictation is unavailable while Voice Control is on.

Apple’s guide has no dedicated section on multi-step workflows. That makes Voice Control a control layer, not a drafting layer. You can move the cursor or open a menu by voice. It will not read a thread and write a reply for you.

Google’s Voice Access works on the same principle on Android. It lets you open apps, navigate, and edit text by voice. Its help page says offline recognition needs downloaded language packs.

Use built-in tools for control. Use an intent layer for drafting. Many people run both, and the two rarely conflict if you keep them to their own jobs.

## Privacy: what to keep out of a spoken command

A tool that reads your screen deserves care. Treat its microphone like a chat window. Do not speak API keys, passwords, customer account numbers, or private medical details unless the task truly needs them. Say “the API key” and paste the value yourself.

Lazur describes its own handling this way. It listens and looks at the screen only while you hold the shortcut. Audio and the screenshot go to AI providers to answer, and they are not stored. Content is not used to train AI models. Read the current privacy page before you rely on any tool for client data.

## Where Lazur fits

Lazur is a voice assistant for the Mac that lives in the notch. Hold a key and talk. Lazur sees your screen, points at things, answers out loud, and helps with the work in any app. It drafts and types text at the cursor. Hold fn to dictate clean, formatted text in any app. Hold ⌥⌘ to ask about anything on screen.

Lazur does not click buttons or operate other apps for you. It is not a plugin or add-in for any app. It runs on macOS, on Apple silicon and Intel. Windows is planned, not available. There is a trial, and no credit card is needed to start it.

If that fits how you work, [download Lazur](/download) and run the thread test from the worked example above.

## How to measure whether it helps

Do not judge a voice command by one good draft. Keep a simple tally for a week. Use three columns: sent as written, edited once, and rewritten from scratch.

Then look at the pattern. If most drafts go out as written, the instructions are working. If most get rewritten, the outcome or the facts are too vague. Adjust the phrasing and run the tally again.

Track the tasks too. Replies to clear messages often work well. Long documents or anything with figures often need a full read. Let the tally tell you which tasks to hand off and which to keep for yourself.

## Next step

Pick one unread message today. Do not dictate the reply. Say the outcome, the facts, and the tone. Compare the draft with what you would have typed. Then try a second message with one more fact, and watch how the output changes.

That is the fastest way to learn where voice commands finish the work for you and where they still need your eyes. If you want the screen side of this, read [AI assistants that understand your screen](/blog/ai-assistants-that-understand-your-screen).
