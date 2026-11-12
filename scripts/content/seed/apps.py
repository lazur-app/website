# One-off seed: the hand-written app pages that replace the old /use-cases pages.
# Kept in the repo so the source of these fixtures is visible; the daily job writes the rest.
import json, os
ROOT = os.path.join(os.path.dirname(__file__), "../../../content/seo/apps")
D = "2026-11-05"
def faq(q, a): return {"question": q, "answer": a}
def ask(s, r, c): return {"say": s, "result": r, "capability": c}

pages = []

pages.append({
 "slug": "slack", "app": "slack", "appName": "Slack", "appCategory": "Messaging", "appUrl": "https://slack.com",
 "title": "Lazur in Slack: catch up, reply and find things by voice",
 "metaTitle": "AI assistant for Slack on Mac: ask, reply, dictate",
 "description": "Use an AI assistant for Slack on Mac: hold a key to sum up a thread, draft the reply at your cursor, or dictate a standup. Works in the Slack app and in Chrome.",
 "targetKeyword": "ai assistant for slack mac",
 "secondaryKeywords": ["dictate slack messages mac", "slack keyboard shortcuts mac"],
 "intro": "Lazur is an AI assistant for Slack on your Mac: hold ⌥ ⌘ while a thread is open and ask it to sum up, explain or draft the reply. Hold fn to dictate a message straight into the compose box.",
 "tldr": ["Hold ⌥ ⌘ in Slack and ask about the thread on screen. Lazur answers out loud.", "Say “draft a reply, Thursday works” and the draft lands at your cursor for you to check.", "Hold fn to dictate a standup. It comes out as clean lines, not a transcript.", "Works in the Slack Mac app and Slack in the browser."],
 "demos": [
  {"spoken": "sum up this thread, what do they need from me?", "capability": "explain", "result": "Priya needs the launch date confirmed and the pricing copy by Friday. Nothing else is on you.", "context": "A long thread in #launch", "shell": "slack"},
  {"spoken": "standup, shipped the invite flow, two bugs in the share modal, pairing with Priya after lunch", "capability": "dictate", "result": "Typed your update at the cursor as three clean lines.", "output": "Standup:\n• Shipped the invite flow\n• Two bugs in the share modal, pairing with Priya after lunch\n• On track for Thursday", "shell": "slack"}
 ],
 "asks": [ask("sum up this thread", "Reads the thread on screen and tells you the decisions and open questions.", "explain"), ask("draft a reply, Thursday works, keep it short", "Writes the reply at your cursor. You read it and press Enter.", "draft"), ask("where do I schedule a message?", "Circles the arrow next to the Send button.", "point"), ask("remind me to answer Sam at 4", "Adds a reminder to Apple Reminders.", "everyday"), ask("what does this error in the channel mean?", "Explains the pasted log or error message out loud.", "explain"), ask("how do I start a huddle here?", "Walks you to the huddle button, one click at a time.", "guide")],
 "stats": [],
 "blocks": [
  {"type": "heading", "text": "What Lazur does in Slack", "level": 2},
  {"type": "paragraph", "text": "Slack is where questions pile up. Lazur sits in the notch above it. Hold ⌥ ⌘, say what you need, and it looks at the Slack window you have open. You do not copy the thread into a chat window first."},
  {"type": "list", "items": ["**Catch up:** “what did I miss in this channel?”", "**Reply:** “draft a reply, yes to Thursday, ask about the budget”", "**Find your way:** “where's the setting for notifications?”", "**Type by voice:** hold fn and talk. The text appears in the compose box."]},
  {"type": "heading", "text": "Dictating Slack messages on a Mac", "level": 2},
  {"type": "paragraph", "text": "Click the compose box first. Hold fn, say the update the way you would say it in standup, and let go. Lazur types clean, formatted text at your cursor. Filler words drop out, and lists come out as lists."},
  {"type": "lazur"},
  {"type": "heading", "text": "Slack shortcuts worth knowing", "level": 2},
  {"type": "table", "headers": ["To do this", "Press"], "rows": [["Jump to a conversation", "⌘ + K"], ["See all keyboard shortcuts", "⌘ + /"], ["Search", "⌘ + G"]], "caption": "From Slack's keyboard shortcuts help page"}
 ],
 "faq": [faq("Does Lazur work in Slack on Mac?", "Yes. It works on top of the Slack Mac app and Slack in Chrome or Safari. Hold ⌥ ⌘ to ask, hold fn to dictate."), faq("Is Lazur a Slack app or integration?", "No. Nothing is installed in your Slack workspace. Lazur runs on your Mac and only sees the screen while you hold the shortcut."), faq("Can Lazur send messages for me?", "It writes the draft at your cursor. You read it and press Enter yourself."), faq("What does it cost?", "Free for 3 days, then Pro is $18/month with 250 AI actions and unlimited dictation.")],
 "sources": [{"title": "Slack keyboard shortcuts", "url": "https://slack.com/help/articles/201374536-Slack-keyboard-shortcuts", "publisher": "Slack Help Center", "accessedAt": D}]
})

pages.append({
 "slug": "gmail", "app": "gmail", "appName": "Gmail", "appCategory": "Email", "appUrl": "https://mail.google.com",
 "title": "Lazur in Gmail: write replies by voice and clear your inbox",
 "metaTitle": "AI assistant for Gmail on Mac: replies by voice",
 "description": "An AI assistant for Gmail on Mac: hold a key to sum up a long email, draft the reply at your cursor, or dictate a new message. No extension to grant inbox access.",
 "targetKeyword": "ai assistant for gmail mac",
 "secondaryKeywords": ["write emails by voice mac", "gmail keyboard shortcuts"],
 "intro": "Lazur is an AI assistant for Gmail on your Mac: open an email, hold ⌥ ⌘ and ask it to sum it up or draft the reply. It reads only what is on your screen, only while you hold the key.",
 "tldr": ["Open the email and hold ⌥ ⌘. Ask “what do they want?” and Lazur answers out loud.", "Say “reply, yes to Tuesday, ask for the invoice” and the draft appears in the reply box.", "Hold fn to dictate a new email. Clean text, no “um”s.", "Nothing gets access to your whole inbox. Lazur sees the screen only while you hold the key."],
 "demos": [
  {"spoken": "reply, Tuesday at 2 works, and ask them to send the invoice before then", "capability": "draft", "result": "Wrote the reply in the Gmail compose box for you to check.", "output": "Hi Dana,\n\nTuesday at 2 works for me. Could you send the invoice before then?\n\nThanks,\nVeer", "context": "An email asking to move a call", "shell": "mail"},
  {"spoken": "what's the actual ask in this email?", "capability": "explain", "result": "They want a signed copy of the contract by Friday and a yes or no on the extra seat.", "shell": "mail"}
 ],
 "asks": [ask("sum up this email", "Tells you the ask, the deadline and who it is from.", "explain"), ask("reply, sounds good, see you Monday", "Writes a short reply at your cursor.", "draft"), ask("where do I set up a signature?", "Circles the gear icon, then walks you to Signature.", "guide"), ask("remind me to follow up on this Friday", "Adds a reminder for Friday.", "everyday"), ask("schedule this to send tomorrow at 8", "Points at the arrow next to Send and the Schedule send option.", "point"), ask("make this shorter and friendlier", "Rewrites your selected draft text at the cursor.", "draft")],
 "stats": [],
 "blocks": [
  {"type": "heading", "text": "Email is where the typing goes", "level": 2},
  {"type": "paragraph", "text": "Most replies are three sentences you already know. Lazur lets you say them. Open the email, hold ⌥ ⌘, and tell Lazur what you want to say. It reads the message on screen and writes a reply that answers it."},
  {"type": "heading", "text": "How to write a Gmail reply by voice on a Mac", "level": 2},
  {"type": "list", "ordered": True, "items": ["Open the email in Gmail and click Reply.", "Hold ⌥ ⌘ and say what the reply should say.", "Read the draft Lazur writes, change anything, and click Send."]},
  {"type": "lazur"},
  {"type": "callout", "tone": "tip", "text": "Turn on Gmail keyboard shortcuts in Settings > See all settings > Keyboard shortcuts. Then r replies and e archives. See [our dictation guide](/blog/how-to-write-emails-by-voice) for more."}
 ],
 "faq": [faq("Does Lazur need access to my Gmail account?", "No. There is no Gmail sign-in or extension with inbox access. Lazur sees the email on your screen only while you hold the shortcut."), faq("Does it work in Apple Mail and Outlook too?", "Yes. It works on top of any Mac app, so the same commands work in Apple Mail and Outlook."), faq("Will it send emails without me?", "No. It writes the draft at your cursor. You send it.")],
 "sources": [{"title": "Keyboard shortcuts for Gmail", "url": "https://support.google.com/mail/answer/6594", "publisher": "Gmail Help", "accessedAt": D}]
})

pages.append({
 "slug": "cursor", "app": "cursor", "appName": "Cursor", "appCategory": "Developer tools", "appUrl": "https://cursor.com",
 "title": "Lazur in Cursor: explain errors and write prompts by voice",
 "metaTitle": "Voice assistant for Cursor on Mac: errors, prompts",
 "description": "A voice assistant for Cursor on Mac: hold a key to get the error on screen explained, dictate long prompts into the agent, and draft commit messages.",
 "targetKeyword": "voice assistant for cursor mac",
 "secondaryKeywords": ["voice coding cursor", "dictate prompts cursor"],
 "intro": "Lazur is a voice assistant for Cursor on your Mac. Hold ⌥ ⌘ to ask what the error on screen means, or hold fn to talk a long prompt into the agent box. It works next to Cursor's own AI.",
 "tldr": ["Hold ⌥ ⌘ on a red stack trace and ask “what does this mean?”. Lazur reads it and answers out loud.", "Hold fn in Cursor's chat and say the whole prompt. Long context is easier to say than type.", "Say “write a commit message for this” with the diff open, and it appears at your cursor."],
 "demos": [
  {"spoken": "what does this error mean?", "capability": "explain", "result": "Your useEffect returns a promise. Effects must return nothing or a cleanup function. Move the async call inside.", "context": "A React warning in the terminal", "shell": "code"},
  {"spoken": "refactor the billing hook so the retry logic lives in one place and add a test for the 429 case, keep the public API the same", "capability": "dictate", "result": "Typed the prompt into Cursor's chat box.", "output": "Refactor the billing hook so the retry logic lives in one place. Add a test for the 429 case. Keep the public API the same.", "shell": "code"}
 ],
 "asks": [ask("what does this error mean?", "Reads the error on screen and explains it out loud.", "explain"), ask("write a commit message for this diff", "Writes a commit message at your cursor.", "draft"), ask("where's the setting for rules?", "Points at Cursor Settings and walks you to Rules.", "guide"), ask("search the docs for useEffect cleanup", "Runs the search and opens the result.", "everyday"), ask("timer for 25 minutes, focus", "Starts a timer in the notch.", "everyday"), ask("explain this function", "Explains the selected code out loud.", "explain")],
 "stats": [],
 "blocks": [
  {"type": "heading", "text": "Why talk to your editor", "level": 2},
  {"type": "paragraph", "text": "Prompts for coding agents are getting longer. The useful ones carry context: what you tried, what must not change, which test fails. Saying that takes seconds. Typing it is where people cut corners."},
  {"type": "heading", "text": "Lazur and Cursor's own AI", "level": 2},
  {"type": "paragraph", "text": "Cursor's agent edits code. Lazur does not. Lazur is the voice layer around it: it explains what is on screen, types your prompts, and handles the small stuff like timers and doc searches without leaving the editor."},
  {"type": "lazur"}
 ],
 "faq": [faq("Does Lazur edit my code?", "No. It explains what is on screen, writes text at your cursor when you ask, and types prompts by voice. Cursor's agent does the editing."), faq("Does it work in VS Code and Xcode too?", "Yes. It works on top of any Mac app."), faq("Can it see my whole repo?", "No. It sees one screenshot of your screen, only while you hold the shortcut.")],
 "sources": [{"title": "Cursor documentation", "url": "https://docs.cursor.com", "publisher": "Cursor", "accessedAt": D}]
})

pages.append({
 "slug": "chatgpt", "app": "chatgpt", "appName": "ChatGPT", "appCategory": "AI chat", "appUrl": "https://chatgpt.com",
 "title": "Lazur and ChatGPT on Mac: when to use which",
 "metaTitle": "Lazur vs using ChatGPT on Mac: which job each does",
 "description": "ChatGPT on Mac and Lazur side by side: ChatGPT for long chats and files, Lazur for quick questions about your screen and typing by voice in any app.",
 "targetKeyword": "chatgpt on mac",
 "secondaryKeywords": ["talk to chatgpt on mac", "dictate prompts chatgpt"],
 "intro": "ChatGPT on Mac is great for long conversations and files. Lazur is for the moment you are in another app: hold ⌥ ⌘, ask about what is on screen, and get an answer out loud without switching windows.",
 "tldr": ["Use ChatGPT for long research chats, file uploads and projects.", "Use Lazur for quick questions about the app you are in. It sees your screen while you hold ⌥ ⌘.", "Hold fn in the ChatGPT box to dictate long prompts with Lazur."],
 "demos": [
  {"spoken": "compare these two plans on screen, which one is cheaper for five people?", "capability": "explain", "result": "The Team plan works out cheaper for five people. The other one charges per seat above three.", "context": "A pricing page in Safari", "shell": "generic"},
  {"spoken": "write a brief for a landing page for a pottery class, friendly, under 200 words, include the price and the Saturday times", "capability": "dictate", "result": "Typed the prompt into the ChatGPT message box.", "output": "Write a brief for a landing page for a pottery class. Friendly tone, under 200 words. Include the price and the Saturday times.", "shell": "chat"}
 ],
 "asks": [ask("what's this chart showing?", "Explains the chart on screen out loud.", "explain"), ask("where's the export button?", "Circles it on your screen.", "point"), ask("research standing desks under $300 in the background", "Runs the research in Chrome tabs and comes back with a report.", "research"), ask("remind me to send the brief at 5", "Adds a reminder.", "everyday"), ask("sum up this page", "Reads the page on screen and gives you the gist.", "explain"), ask("draft a reply to this", "Writes the reply at your cursor.", "draft")],
 "stats": [],
 "blocks": [
  {"type": "heading", "text": "Two different jobs", "level": 2},
  {"type": "table", "headers": ["You want to", "Better fit"], "rows": [["Have a long back and forth, upload files", "ChatGPT"], ["Ask about the app you are in right now", "Lazur"], ["Find a button in an unfamiliar app", "Lazur"], ["Write a long prompt without typing", "Lazur dictation into ChatGPT"]]},
  {"type": "paragraph", "text": "Many people use both. Lazur is often the faster way to talk to the window in front of you, including the ChatGPT window."},
  {"type": "lazur"}
 ],
 "faq": [faq("Is Lazur built on ChatGPT?", "Lazur uses AI models from providers to answer. It is a separate Mac app and is not affiliated with OpenAI."), faq("Can I use Lazur to talk to ChatGPT?", "Yes. Click the ChatGPT message box, hold fn and talk. Lazur types the prompt for you."), faq("Do I need both?", "No. If you mostly want quick help inside other apps, Lazur alone covers it. If you live in long chats, keep ChatGPT too.")],
 "sources": [{"title": "ChatGPT desktop app", "url": "https://openai.com/chatgpt/desktop/", "publisher": "OpenAI", "accessedAt": D}]
})

pages.append({
 "slug": "excel", "app": "excel", "appName": "Excel", "appCategory": "Spreadsheets", "appUrl": "https://www.microsoft.com/microsoft-365/excel",
 "title": "Lazur in Excel: find any button and understand any formula",
 "metaTitle": "AI assistant for Excel on Mac: find, explain, guide",
 "description": "An AI assistant for Excel on Mac: hold a key and ask where a feature is, what a formula does, or how to build a pivot table. Lazur circles the button on your screen.",
 "targetKeyword": "ai assistant for excel mac",
 "secondaryKeywords": ["excel help mac", "excel on mac shortcuts"],
 "intro": "Lazur is an AI assistant for Excel on your Mac: hold ⌥ ⌘ and ask where a feature is or what a formula does. It sees your sheet, circles the right button and walks you through the steps.",
 "tldr": ["Ask “where's conditional formatting?” and Lazur circles it on the ribbon.", "Select a formula and ask “what does this do?”. Lazur explains it out loud.", "Ask “walk me through a pivot table” and it guides you one click at a time.", "Lazur does not change your workbook. You stay in control of every click."],
 "demos": [
  {"spoken": "where's the pivot table button?", "capability": "point", "result": "Insert tab, second from the left. Circled it.", "pointsAt": "PivotTable", "shell": "sheet"},
  {"spoken": "walk me through freezing the top row", "capability": "guide", "result": "Click View first. I'll show you the next click after that.", "pointsAt": "View", "shell": "sheet"}
 ],
 "asks": [ask("what does this formula do?", "Explains the selected formula out loud, piece by piece.", "explain"), ask("where's remove duplicates?", "Circles it on the Data tab.", "point"), ask("walk me through a drop-down list", "Guides you through Data Validation one click at a time.", "guide"), ask("why is this showing #N/A?", "Looks at the cell and explains the likely cause.", "explain"), ask("timer for 30 minutes, month-end close", "Starts a timer in the notch.", "everyday"), ask("draft an email to Sam with these totals", "Reads the totals on screen and drafts the email in Mail.", "draft")],
 "stats": [{"value": "1,048,576", "label": "rows in one Excel worksheet", "sourceUrl": "https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3", "sourceTitle": "Microsoft: Excel specifications and limits"}, {"value": "16,384", "label": "columns in one worksheet", "sourceUrl": "https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3", "sourceTitle": "Microsoft: Excel specifications and limits"}],
 "blocks": [
  {"type": "heading", "text": "Excel on a Mac is not Excel on Windows", "level": 2},
  {"type": "paragraph", "text": "Most Excel tutorials are recorded on Windows. The ribbon looks similar, but shortcuts use ⌘ instead of Ctrl, and some dialogs sit in different places. Lazur sees the Mac version you actually have open, so the answer matches your screen."},
  {"type": "heading", "text": "Guides for Excel on Mac", "level": 2},
  {"type": "paragraph", "text": "Start with [how to make a pivot table in Excel on Mac](/how-to/make-a-pivot-table-in-excel). Every guide lists the menu path, the shortcut and what to do when it does not work."},
  {"type": "lazur"}
 ],
 "faq": [faq("Is Lazur an Excel add-in?", "No. Nothing is installed in Excel. Lazur runs on your Mac and looks at the screen only while you hold ⌥ ⌘."), faq("Can Lazur do the Excel work for me?", "It does not click inside Excel or edit your file. It explains, points at buttons and walks you through each step."), faq("Does it work with Numbers and Google Sheets?", "Yes. It works on top of any Mac app, including Numbers and Google Sheets in the browser.")],
 "sources": [{"title": "Excel specifications and limits", "url": "https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3", "publisher": "Microsoft Support", "accessedAt": D}]
})

for p in pages:
    p.update({"type": "app", "publishedAt": D, "updatedAt": D, "images": [], "generator": {"by": "hand (fixture, migrated from /use-cases)", "version": 1}})
    if p["slug"] == "excel": p["generator"]["by"] = "hand (fixture)"
    with open(os.path.join(ROOT, p["slug"] + ".json"), "w") as f:
        json.dump(p, f, indent=2, ensure_ascii=False); f.write("\n")
print(len(pages))
