---
title: 'AI dictation for developers on Mac: PRs, Slack, and Cursor prompts in 2026'
description: >-
  AI dictation for developers works for PR descriptions, Slack replies, and
  Cursor prompts on Mac. Here is what to speak, what to type, and how to review.
targetKeyword: AI dictation for developers
category: How-to
cover: code
tldr:
  - >-
    Dictate the prose around your code: PR descriptions, Slack replies, review
    comments, and agent prompts. Type the syntax.
  - >-
    Read every dictated message before you send it. Speech left more uncorrected
    errors than typing in the 2016 study.
  - >-
    Cursor's voice input in version 3.1 uses Ctrl+M in the Agents Window. Check
    your version, because Cursor's main docs do not mention voice.
faq:
  - question: Can developers use AI dictation to write code?
    answer: >-
      You can dictate comments, commit bodies, and prompts. Dictating raw syntax
      is usually slower than typing, and speech models often get casing and
      symbols wrong. The gain is in the writing around the code: PR
      descriptions, reviews, Slack, tickets, and agent prompts.
  - question: Does AI dictation work in Cursor?
    answer: >-
      Cursor's 3.1 changelog, dated April 13, 2026, describes press-and-hold
      Ctrl+M voice input in the Agents Window. Cursor's main docs do not mention
      voice, so check your version. Mac dictation works in most text fields you
      can type into, and Lazur is not a plugin for Cursor.
  - question: Are Slack huddle notes the same as dictation?
    answer: >-
      No. Dictation types your words into a message. Huddle notes are AI notes
      taken during a call, and they start only when someone in the huddle turns
      them on. Slack says transcripts do not show up in search results, so write
      any decision into the thread.
  - question: Is dictation safe for work code and client details?
    answer: >-
      Keep secrets, tokens, and customer records out of voice. Check where your
      dictation runs. Apple says on-device dictation needs an M3 or later Mac
      with at least 12GB of unified memory, and Cursor's docs do not explain its
      voice data path.
relatedSlugs:
  - what-is-voice-writing
  - how-to-dictate-on-mac
  - dictation-errors-vs-typing-errors
stats:
  - value: 153 WPM
    label: >-
      English speech input average in a 2016 phone text study, against 52 WPM
      for a keyboard
    sourceUrl: 'https://arxiv.org/abs/1608.07323'
    sourceTitle: >-
      Comparing Speech and Keyboard Text Entry for Short Messages in Two
      Languages on Touchscreen Phones
  - value: 51%
    label: >-
      Professional developers who use AI tools daily, per the 2025 Stack
      Overflow survey
    sourceUrl: 'https://survey.stackoverflow.co/2025/ai'
    sourceTitle: '2025 Stack Overflow Developer Survey: AI'
  - value: 30 seconds
    label: Silence before Mac dictation stops on its own
    sourceUrl: 'https://support.apple.com/guide/mac-help/use-dictation-mh40584/mac'
    sourceTitle: Dictate messages and documents on Mac
sources:
  - title: Dictate messages and documents on Mac
    url: 'https://support.apple.com/guide/mac-help/use-dictation-mh40584/mac'
    publisher: Apple Support
    accessedAt: '2026-11-07'
  - title: >-
      Comparing Speech and Keyboard Text Entry for Short Messages in Two
      Languages on Touchscreen Phones
    url: 'https://arxiv.org/abs/1608.07323'
    publisher: arXiv
    accessedAt: '2026-11-07'
  - title: Slack Huddles
    url: 'https://slack.com/features/huddles'
    publisher: Slack
    accessedAt: '2026-11-07'
  - title: Guide to AI features in Slack
    url: >-
      https://slack.com/help/articles/25076892548883-Guide-to-AI-features-in-Slack
    publisher: Slack Help Center
    accessedAt: '2026-11-07'
  - title: Tiled Layout and Upgraded Voice Input in the Agents Window
    url: 'https://cursor.com/changelog/3-1'
    publisher: Cursor
    accessedAt: '2026-11-07'
  - title: Cursor Docs
    url: 'https://cursor.com/docs'
    publisher: Cursor
    accessedAt: '2026-11-07'
  - title: '2025 Stack Overflow Developer Survey: AI'
    url: 'https://survey.stackoverflow.co/2025/ai'
    publisher: Stack Overflow
    accessedAt: '2026-11-07'
publishedAt: '2026-08-12'
updatedAt: '2026-11-06'
author: Lazur Team
images:
  - url: >-
      https://images.lazur.app/content-images/blog/ai-dictation-for-developers/ai-dictation-for-developers-1-3f7b0a.jpg
    width: 1280
    height: 852
    alt: >-
      Developer typing on a laptop at a desk while writing a pull request
      description
    caption: >-
      Pull request descriptions are prose, and prose is where AI dictation for
      developers saves time.
    keywords:
      - AI dictation for developers
      - AI
      - dictation
      - for
      - developer laptop desk
      - Mac
      - Lazur
    credit:
      name: StockSnap
      url: 'https://pixabay.com/users/StockSnap-894430/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/laptop-apple-keyboard-technology-2589420/'
  - url: >-
      https://images.lazur.app/content-images/blog/ai-dictation-for-developers/ai-dictation-for-developers-2-dafc1e.jpg
    width: 1280
    height: 852
    alt: >-
      Person speaking into a microphone beside a laptop, the setup for AI
      dictation for developers
    caption: 'Hold a key, speak the context, then read the text before you send it.'
    keywords:
      - AI dictation for developers
      - AI
      - dictation
      - for
      - man microphone laptop
      - Mac
      - Lazur
    credit:
      name: Werner_LB
      url: 'https://pixabay.com/users/Werner_LB-5300/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/to-learn-explain-family-show-50009/'
  - url: >-
      https://images.lazur.app/content-images/blog/ai-dictation-for-developers/ai-dictation-for-developers-3-bb82b8.jpg
    width: 1280
    height: 1280
    alt: Programmer working at a desk with a coffee cup and a monitor showing code
    caption: Type the code. Speak the reasoning around it.
    keywords:
      - AI dictation for developers
      - AI
      - dictation
      - for
      - programmer desk coffee
      - Mac
      - Lazur
    credit:
      name: zs18384022951
      url: 'https://pixabay.com/users/zs18384022951-40809725/'
      source: Pixabay
      sourceUrl: 'https://pixabay.com/photos/ai-generated-man-desk-computer-8403411/'
generator:
  by: scripts/content
  model: haiku
  runId: daily-2026-11-06
  version: 1
heroImage:
  url: >-
    https://images.lazur.app/content-images/blog/ai-dictation-for-developers/ai-dictation-for-developers-1-3f7b0a.jpg
  width: 1280
  height: 852
  alt: >-
    Developer typing on a laptop at a desk while writing a pull request
    description
  caption: >-
    Pull request descriptions are prose, and prose is where AI dictation for
    developers saves time.
  keywords:
    - AI dictation for developers
    - AI
    - dictation
    - for
    - developer laptop desk
    - Mac
    - Lazur
  credit:
    name: StockSnap
    url: 'https://pixabay.com/users/StockSnap-894430/'
    source: Pixabay
    sourceUrl: 'https://pixabay.com/photos/laptop-apple-keyboard-technology-2589420/'
keywordHits:
  target: AI dictation for developers
  inTitle: true
  inH1: true
  inDescription: true
  inIntro: true
  bodyCount: 8
  secondary: {}
---

AI dictation for developers means speaking the writing around your code, then letting an app type it where your cursor sits. Use it for pull request descriptions, Slack replies, review comments, tickets, and long prompts for Cursor or another coding agent. Keep typing for brackets, type annotations, and anything where one wrong character breaks the build.

## What AI dictation means for a developer

Dictation turns your speech into text. AI dictation adds a cleanup step on top. It fixes punctuation, capital letters, and most filler words. Some tools also learn names you teach them, which matters when your internal service names look like nonsense to a speech model.

Most of your writing is not code. It is the text that explains code. You write a PR summary, answer a review, post a status update, file a bug, and brief an agent. Each one takes longer than it should, because typing slows down the thinking. Speaking keeps the thought moving.

Developers already lean on AI tools. In the 2025 Stack Overflow survey, 51% of professional developers said they use AI tools daily. Most of those tools still take text in. Faster text input matters when you feed them context all day.

Speech is faster for this kind of text, with a caveat. In a 2016 study, Ruan and colleagues tested English text messages on an iPhone 6 Plus. Speech averaged 153 words per minute. The QWERTY keyboard averaged 52, which made speech 2.93 times faster. Those were short phone messages, not desktop prompts, so treat the number as a direction, not a forecast for your week.

The same study has a warning. Speech left more errors in the final text, 1.30% against 0.79% for the keyboard. It reported a corrected error rate of 5.30% for speech and 11.22% for the keyboard, but uncorrected errors were higher for speech. Read every dictated message before you send it.

## What to dictate and what to type

Use this table as a rule of thumb. It covers the tasks most developers do in a normal week.

| Writing task | Dictate it | Type it | Why |
|---|---|---|---|
| PR description | The summary, the why, the risk | Checkboxes, links, file paths | Speech carries context well. Paths get mangled. |
| Slack reply | The whole message | Emoji, mentions, code spans | Fast and conversational |
| Review comment | The reasoning behind the request | Suggestion blocks | The reasoning is prose |
| Bug report | Repro steps in plain words | Exact error text and IDs | Copy errors, do not speak them |
| Agent or Cursor prompt | Goal, files, constraints | Symbol names you are unsure about | Context is the hard part |
| Commit subject | Rarely | Conventional prefix and scope | Short and precise |
| Code, brackets, types | Never | Always | Syntax needs exact characters |
| Secrets and customer data | Never | Never by voice | Treat the mic like a public channel |

The rule is simple. Dictate anything a teammate would read as a sentence. Type anything a compiler, a grep, or a link checker would test.

## How to write a PR description by voice

Here is a realistic change. You fixed webhook retries so they stop on client errors. When you type the description, you stop after every line to recall why you made the change. When you speak it, you say the reason while it is still fresh.

Your spoken draft might sound like this:

> This changes webhook retries so we stop retrying on 400 responses. Before, we retried everything, which hid bad payloads. Now a 400 goes to the dead letter queue on the first attempt. Reviewers should check the status code mapping in the handler and the new test for malformed signatures.

Cleaned up, that becomes two short sections:

## Summary
- Stop retrying webhook deliveries on 400 responses.
- Send 400s to the dead letter queue on the first attempt.

## Review focus
- Status code mapping in the handler.
- New test for malformed signatures.

The dictation gave you the summary and the review focus. You still add the ticket link, the screenshots, and the checklist. Type those. They are structure, not prose.

Read it once before you post. Dictation drops a word now and then. Check negatives first. A dropped "not" changes the meaning of a sentence about a status code, and reviewers will trust the wrong version.

## Slack replies and huddle notes

Two different things get mixed up here. One is dictating a Slack message. The other is Slack's AI notes for huddles. They work differently, so treat them separately.

Dictating a reply is simple. Click into the thread or DM, hold your dictation key, speak, and release. This works well for quick answers, status updates, and "looks good, merging after the test run" type messages. Keep them short. Slack threads read better in short bursts.

Huddle notes are another matter. Slack says AI will never take notes in a huddle unless someone in the huddle turns them on, and participants are notified when AI notes are on. Anyone in the channel or DM where the huddle happened can view the AI notes canvas. Slack also says transcripts won't show up in search results.

So a huddle is not a searchable record. If a decision matters, post it in the thread after the call. One line is enough: what you decided, who owns it, and the date.

Plans matter too. Slack's AI features guide lists huddle notes on Pro, Business+, and Enterprise+. The table has no Free column for them. The guide also says availability depends on your plan, your role as a member or guest, and whether an admin restricted access. Free huddles are capped at two people and 30 minutes, while paid plans allow unlimited group huddles. Check your workspace before you plan around notes.

## Cursor prompts by voice

Cursor's voice input changed in version 3.1. Cursor's changelog, dated April 13, 2026, says you press and hold Ctrl+M to speak in the Agents Window. It records the full clip and transcribes it with batch speech-to-text. The upgrade sits under the Agents Window heading, so it may not cover every part of Cursor.

Cursor's main docs do not mention voice input, voice mode, or dictation for chat or agents. Check your version before you build a habit around it. If Ctrl+M does nothing, your version may not have the feature yet.

A good agent prompt names the file, the bug, the constraint, and the order of work. Here is one spoken prompt:

> In billing.ts, the webhook handler can charge a customer twice when Stripe retries. Write a failing test first. Then add a guard that is idempotent on the event ID. Don't change the public API, and keep the log line the same.

Speech is good at this kind of prompt. You naturally say the constraint out loud, and typed prompts often skip it. The agent does not need your whole story. It needs the boundaries.

Speech can also produce a prompt that runs too long. Long prompts bury the one constraint that matters. Put the goal in the first sentence and the constraints in the last. Read the transcript before you send it, because a dropped "don't" can send an agent into code you wanted left alone.

## Comments and commit messages

Dictate the why, not the what. The code already shows the what. A comment about retry logic might say:

> Jitter the retry delay. Without it, every worker wakes at once and hits the upstream together.

For commit messages, type the subject line and speak the body. The subject needs a prefix and a scope, and those are easier to type. The body explains the reason:

feat(webhooks): stop retrying on 400 responses

Bad payloads never succeed on retry, so retrying them only hides the error. Send them to the dead letter queue on the first attempt.

Some dictation tools rewrite fragments into clean sentences. That is useful, but check the rewrite keeps the meaning. A rewrite that turns "we retry on 400" into "we retry on errors" changes what the code does, at least on paper. Your reviewers will read the paper.

## Mistakes developers make with dictation

1. **Dictating syntax.** Saying "open paren, close paren, arrow function" is slower than typing it. Speech tools also guess at casing and symbols. Type the code.
2. **Skipping the read-through.** Speech left more uncorrected errors in the 2016 study. Read every PR, comment, and prompt before it leaves your hands.
3. **Letting names drift.** A speech model handles common words well and misses your internal service names. Add them to a personal dictionary once, then stop correcting the same word every day.
4. **Talking for too long.** Mac dictation stops on its own after 30 seconds without speech. Dictate in chunks. Restart with your shortcut and keep going.
5. **Dictating secrets.** Do not say API keys, tokens, passwords, or customer records out loud. Do not paste them into a dictated prompt either.
6. **Picking a shortcut another app uses.** If two apps want the same key, you get unpredictable results. Pick a shortcut that no other app uses in the same window.

## Privacy: where your voice goes

Where dictation runs changes what leaves your Mac. Apple says on-device dictation improves spelling, punctuation, and capitalization. It is available in English on Mac models with M3 or later and at least 12GB of unified memory. Check your Mac before you assume it applies.

Slack huddle transcripts stay out of search, and everyone in the channel can view the notes canvas. That is a sharing decision, not a privacy setting. Cursor's docs do not explain where its voice audio goes, so ask your team before you dictate sensitive code context into it.

Use one rule for everything. Keep sensitive content out of voice until you know the path. That covers secrets, customer names, security fixes that are not public yet, and anything your employer classifies as confidential.

## Set up dictation on your Mac for developer writing

Mac dictation works in most text fields you can type into. Test each app you use, because some fields behave differently. Here is the setup I would use.

1. Open System Settings > Keyboard > Dictation.
2. Pick a shortcut from the Shortcut pop-up menu. Choose Customize to record a shortcut that is not listed. Apple's guide does not state a default, so check what your Mac shows.
3. Turn on on-device dictation if your Mac supports it. Apple's requirements are M3 or later and at least 12GB of unified memory.
4. Open Notes and say a test sentence with one of your service names. See what comes out.
5. Start dictation with the Microphone key, your shortcut, or Edit > Start Dictation in any app.
6. Stop with Escape, the Microphone key, or the shortcut. If you go quiet for 30 seconds, dictation stops by itself.

Practice the stop and start. It feels odd at first. After a day, it becomes the normal way you clear a thought before a PR.

## Edge cases that trip people up

Jargon is the first problem. Acronyms, library names, and internal tools get mangled. Spell them the first time you dictate them, read the output, then correct them once. Keep a list of the twenty words you say most.

Noise is the second problem. An open-plan office or a busy café hurts accuracy. Use a headset mic if your Mac's built-in mic picks up keyboards and voices. You will see the difference in the first few sentences.

Thinking out loud is the third problem. Dictation captures your false starts. Pause, then say the sentence you meant. A long ramble is fine for a first pass, but it is bad for a PR description. Cut the ramble before you post.

Editing is the fourth problem. Most people try to dictate and edit in the same pass. Dictate first, then edit with the keyboard. Your hands are already on the keys, and the cleanup is faster there.

## Where Lazur fits in a developer's day

Lazur is a voice assistant for the Mac. Hold fn to dictate clean, formatted text at the cursor in any app. It also has snippets, a personal dictionary, and clipboard slots. For developer writing, the dictionary and snippets matter most. Add your service names once. Save your PR template as a snippet, then speak the summary into it.

Lazur also works as a question tool. Hold ⌥ ⌘ to ask about anything on your screen, and Lazur answers out loud. That helps when you are writing a prompt and need to know what an error means. Lazur does not click buttons, edit files, or operate other apps for you. It is not a plugin or add-in for Cursor or any other app, and it has no partnership with any app maker.

Lazur listens and looks at the screen only while you hold the shortcut. Audio and the screenshot go to AI providers to answer, and they are not stored. Content is never used to train AI models. Those are the product facts as stated on the site. Still, keep secrets out of any voice tool.

Lazur for Mac starts with a 3-day Pro trial that needs no credit card. The trial starts when you first open the app. Pro costs $18 a month, or $15 a month billed annually, with 150 AI actions. Dictation is unlimited on Pro and on Power. Check the [pricing page](/pricing), then [download Lazur for Mac](/download) if it fits your workflow. For more on coding tasks, read the [AI assistant for developers guide](/blog/ai-assistant-for-developers-and-coding-tasks). You can also see [Lazur for Cursor](/apps/cursor) or the [developer page](/for/developers).

## A one-week test before you decide

Run a short test before you change your habits. Each day, dictate one piece of writing you would normally type.

- Day 1: one PR description.
- Day 2: one Slack reply and one thread summary.
- Day 3: one Cursor or agent prompt.
- Day 4: one code review comment and one commit body.
- Day 5: read everything you dictated and count the fixes you made.

That count tells you more than any benchmark. If you fixed one word in each message, dictation works for you. If you fixed half the sentences, keep dictation for rough drafts and type the final text.
