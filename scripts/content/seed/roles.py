# One-off seed: hand-written role and role x app pages, built from src/lib/personas.ts.
import json, os
BASE = os.path.join(os.path.dirname(__file__), "../../../content/seo")
D = "2026-11-05"
def faq(q, a): return {"question": q, "answer": a}
def day(t, s, r, c): return {"time": t, "say": s, "result": r, "capability": c}
def ask(s, r, c): return {"say": s, "result": r, "capability": c}
LZ = [{"title": "Lazur pricing", "url": "https://www.lazur.app/pricing", "publisher": "Lazur", "accessedAt": D}]
COMMON_FAQ = [faq("Does Lazur work in every app?", "Yes. It works on top of any Mac app: Mail, Slack, Chrome, Word, Figma, Cursor and the rest."), faq("Is it always listening?", "No. It listens and looks at your screen only while you hold the shortcut. Audio and the screenshot are not stored.")]

def role(slug, name, singular, apps, title, meta, desc, kw, intro, tldr, pains, days, demo, blocks, extra_faq):
    return {"type": "role", "slug": slug, "role": slug, "roleName": name, "roleSingular": singular, "apps": apps, "title": title, "metaTitle": meta, "description": desc,
     "targetKeyword": kw, "secondaryKeywords": [f"voice assistant for {name.lower()} mac"], "intro": intro, "tldr": tldr, "painPoints": pains, "day": days, "demo": demo,
     "stats": [], "blocks": blocks, "faq": extra_faq + COMMON_FAQ, "sources": LZ, "publishedAt": D, "updatedAt": D, "images": [], "generator": {"by": "hand (fixture, from personas.ts)", "version": 1}}

roles = [
 role("founders", "Founders", "founder", ["gmail", "slack", "notion", "google-sheets", "linear", "chrome"],
  "An AI assistant for founders that lives on your Mac", "AI assistant for founders on Mac: replies, research",
  "An AI assistant for founders on Mac: hold a key to draft the investor reply, research competitors in the background and book the meeting, without leaving the app you are in.",
  "ai assistant for founders",
  "Lazur is an AI assistant for founders that sits in your Mac's notch. Hold ⌥ ⌘ and it drafts the reply on screen, books the call, or runs competitor research in the background while you keep working.",
  ["Draft replies from the email on screen: “reply, yes to Tuesday, send the deck after”.", "Hand off research: “research our top 5 competitors' pricing” runs in the background.", "Calendar, reminders and timers by voice, without opening another app.", "Free for 3 days, then $18/month."],
  [{"title": "Inbox and Slack eat the morning", "text": "Most replies are three sentences you already know. Saying them is faster than typing them."}, {"title": "Research gets pushed to tonight", "text": "Competitor pricing, a market size, a list of investors. Small jobs that take an hour of tabs."}, {"title": "Context switching", "text": "Every switch to a chat window means copying, pasting and explaining what you are looking at."}],
  [day("8:30", "sum up my unread Slack in #sales", "Reads the channel on screen and tells you what needs you.", "explain"), day("9:00", "draft a reply to this investor, happy to meet Thursday", "Writes the reply in Gmail for you to check.", "draft"), day("11:00", "research our top 5 competitors' pricing", "Runs it in Chrome tabs and comes back with a summary and a report.", "research"), day("14:00", "call with Priya on Friday at 3", "Adds it to your calendar.", "everyday"), day("17:00", "remind me to send the deck at 9 tomorrow", "Adds a reminder.", "everyday")],
  {"spoken": "draft a reply to this investor, happy to meet Thursday, send the deck after", "capability": "draft", "result": "Wrote the reply in the compose box for you to check.", "output": "Hi Maya,\n\nThanks for reaching out. Thursday works. I'll send the deck right after we talk.\n\nBest,\nVeer", "shell": "mail"},
  [{"type": "heading", "text": "What a founder's day with Lazur looks like", "level": 2}, {"type": "paragraph", "text": "You stay in the app you are in. Lazur sees it, so you never explain what you are looking at. Short things happen right away. Long things, like research, run in the background and come back as a report."}, {"type": "lazur"}],
  [faq("Can Lazur send emails for me?", "It writes the draft at your cursor. You read it and send it.")]),
 role("lawyers", "Lawyers", "lawyer", ["word", "outlook", "chrome", "pages", "apple-mail"],
  "An AI assistant for lawyers on the Mac", "AI assistant for lawyers on Mac: documents, email",
  "An AI assistant for lawyers on Mac: hold a key to get a long document summed up, find the clause you need on screen and draft the email, in Word, Outlook or any app.",
  "ai assistant for lawyers mac",
  "Lazur is an AI assistant for lawyers on the Mac: hold ⌥ ⌘ in Word or Outlook and ask it to sum up the page on screen, find a clause or draft the reply. Follow your firm's rules on client data before you use any AI tool.",
  ["Ask “where's the termination clause?” and Lazur points at it on screen.", "Get the page on screen summed up out loud.", "Dictate emails and notes with fn in any app.", "Check your firm's policy on AI tools and client data first."],
  [{"title": "Long documents", "text": "Finding the one clause that matters in a 40-page agreement takes scrolling and searching."}, {"title": "Email volume", "text": "Status updates to clients and opposing counsel, all day, mostly the same shape."}, {"title": "Deadlines", "text": "Filing dates and calls that live in your head until they are in a calendar."}],
  [day("9:00", "sum up this page", "Reads the page on screen and gives you the gist out loud.", "explain"), day("10:30", "where's the termination clause?", "Points at it on the page you have open.", "point"), day("12:00", "draft a reply to opposing counsel, we need two more weeks", "Writes the draft in Outlook for you to edit.", "draft"), day("15:00", "remind me of the filing deadline Monday at 9", "Adds a reminder.", "everyday"), day("16:30", "timer for 6 minutes, billing", "Starts a timer in the notch.", "everyday")],
  {"spoken": "where's the termination clause?", "capability": "point", "result": "Section 12, on this page. Circled it.", "pointsAt": "Section 12", "shell": "doc"},
  [{"type": "heading", "text": "Using AI with client documents", "level": 2}, {"type": "paragraph", "text": "Lazur sees your screen only while you hold the shortcut. The audio and that one screenshot are sent to AI providers to answer you and are not stored, and are never used to train models. That may or may not fit your firm's rules. Check them, and do not use it on matters where it would not."}, {"type": "lazur"}],
  [faq("Is Lazur approved for legal work?", "Lazur makes no compliance claims for legal practice. Read the [privacy policy](/privacy) and check your firm's rules before using it with client material.")]),
 role("developers", "Developers", "developer", ["cursor", "vs-code", "xcode", "slack", "chrome", "linear"],
  "A voice assistant for developers on the Mac", "Voice assistant for developers on Mac",
  "A voice assistant for developers on Mac: hold a key to get the error on screen explained, dictate long prompts into Cursor, write commit messages and find settings fast.",
  "voice assistant for developers mac",
  "Lazur is a voice assistant for developers on the Mac. Hold ⌥ ⌘ and ask what the error on screen means, where a setting lives, or for a commit message. Hold fn to talk long prompts into your coding agent.",
  ["“What does this error mean?” with the stack trace on screen, answered out loud.", "Talk long prompts into Cursor or Claude Code with fn.", "“Write a commit message for this” with the diff open.", "Works in any editor and terminal."],
  [{"title": "Errors and unfamiliar code", "text": "Copying a stack trace into a chat window, then explaining what you were doing."}, {"title": "Prompts got long", "text": "Good agent prompts carry context. Typing all of it is where people cut corners."}, {"title": "Settings you use twice a year", "text": "Signing certificates, build settings, cloud consoles."}],
  [day("9:30", "what does this error mean?", "Reads the trace on screen and explains it.", "explain"), day("11:00", "where's the signing setting?", "Points at Signing & Capabilities in Xcode.", "point"), day("14:00", "write a commit message for this", "Writes it at your cursor.", "draft"), day("15:00", "search the docs for useEffect cleanup", "Runs the search.", "everyday"), day("16:00", "timer for 25 minutes, focus", "Starts a timer.", "everyday")],
  {"spoken": "what does this error mean?", "capability": "explain", "result": "The port is already in use. Another dev server is running on 3000. Stop it or start this one on 3001.", "context": "A terminal with EADDRINUSE", "shell": "code"},
  [{"type": "heading", "text": "Next to your coding agent, not instead of it", "level": 2}, {"type": "paragraph", "text": "Lazur does not edit your code. Your agent does that. Lazur explains what is on screen, types your prompts by voice and handles the small stuff. See [Lazur in Cursor](/apps/cursor)."}, {"type": "lazur"}],
  []),
 role("students", "Students", "student", ["google-docs", "notion", "word", "chrome", "pages", "keynote"],
  "An AI study buddy for students on the Mac", "AI study buddy for students on Mac",
  "An AI study buddy for students on Mac: hold a key to get the diagram on screen explained, turn notes into lists, and keep deadlines as reminders, in any app.",
  "ai study buddy mac",
  "Lazur is an AI study buddy for students on the Mac. Hold ⌥ ⌘ and ask it to explain the diagram or paragraph on your screen in plain words, or to set the reminder for your essay. It works in any app.",
  ["“Explain this diagram simply” with your lecture slides open.", "“Remind me the essay is due Friday” goes straight into Reminders.", "Dictate notes with fn in Google Docs, Notion or Word.", "Use it to understand the work, and follow your school's rules on AI."],
  [{"title": "Dense readings", "text": "A paragraph that takes three reads, or a diagram nobody explained."}, {"title": "Deadlines everywhere", "text": "Due dates across five courses and three apps."}, {"title": "New software every term", "text": "Each class has its own tools, and each one hides its settings somewhere new."}],
  [day("9:00", "explain this diagram simply", "Explains the slide on screen out loud.", "explain"), day("11:00", "what does this paragraph mean?", "Puts it in plain words.", "explain"), day("13:00", "remind me the essay is due Friday", "Adds a reminder.", "everyday"), day("15:00", "timer for 50 minutes, study", "Starts a timer.", "everyday"), day("20:00", "where's the citation tool in Docs?", "Points at Tools > Citations.", "point")],
  {"spoken": "explain this diagram simply", "capability": "explain", "result": "It shows how a signal moves through the neuron. Left to right: dendrites take it in, the axon carries it, synapses pass it on.", "context": "Biology lecture slides", "shell": "generic"},
  [{"type": "heading", "text": "Learn it, do not outsource it", "level": 2}, {"type": "paragraph", "text": "Lazur is good at explaining what is in front of you. Use it to understand your readings and get unstuck in apps. Your school sets the rules for AI in assignments, so check them."}, {"type": "lazur"}],
  [faq("Is there a student discount?", "Check the [pricing page](/pricing) for current offers.")]),
]
for p in roles:
    json.dump(p, open(os.path.join(BASE, "roles", p["slug"] + ".json"), "w"), indent=2, ensure_ascii=False)

def ra(rslug, rname, aslug, aname, title, meta, desc, kw, intro, tldr, demo, tasks, blocks, faqs, sources):
    return {"type": "role-app", "slug": f"{rslug}-{aslug}", "role": rslug, "app": aslug, "roleName": rname, "appName": aname, "title": title, "metaTitle": meta,
     "description": desc, "targetKeyword": kw, "secondaryKeywords": [f"{aname.lower()} tips for {rname.lower()}"], "intro": intro, "tldr": tldr, "demo": demo, "tasks": tasks,
     "stats": [], "blocks": blocks, "faq": faqs, "sources": sources, "publishedAt": D, "updatedAt": D, "images": [], "generator": {"by": "hand (fixture)", "version": 1}}

ras = [
 ra("lawyers", "Lawyers", "word", "Word", "Word for lawyers on Mac: faster review with Lazur", "Word for lawyers on Mac: review, redlines, clauses",
  "Word for lawyers on Mac: Track Changes, comments and Compare, plus how Lazur points at the clause you need and explains a redline while you work.",
  "word for lawyers mac",
  "Word for lawyers on a Mac comes down to three tools: Track Changes, comments and Compare. Lazur sits on top: hold ⌥ ⌘ and ask where a clause is, or what a redline changed, and it answers on your screen.",
  ["Turn on Track Changes in Review > Track Changes before you edit.", "Use Review > Compare to see what changed between two versions.", "Ask Lazur “where's the indemnity clause?” and it points at it."],
  {"spoken": "where's the indemnity clause?", "capability": "point", "result": "Section 9, top of this page. Circled it.", "pointsAt": "Section 9", "shell": "doc"},
  [ask("where's the indemnity clause?", "Points at it on the page you have open.", "point"), ask("what did this redline change?", "Explains the tracked change on screen in plain words.", "explain"), ask("where do I compare two versions?", "Walks you to Review > Compare.", "guide"), ask("draft a cover email for this redline", "Writes it in Outlook or Mail for you to edit.", "draft"), ask("remind me to send this by 5", "Adds a reminder.", "everyday")],
  [{"type": "heading", "text": "Word features lawyers use most on Mac", "level": 2}, {"type": "table", "headers": ["Task", "Where in Word for Mac"], "rows": [["Track edits", "Review > Track Changes"], ["Compare two versions", "Review > Compare"], ["Leave a comment", "Review > New Comment"]]}, {"type": "lazur"}],
  [faq("Does Lazur edit the document?", "No. It points, explains and drafts text at your cursor. You make every change."), faq("Should I use it with client documents?", "Check your firm's rules on AI tools first. Lazur sees your screen only while you hold the shortcut and does not store it.")],
  [{"title": "Track changes in Word", "url": "https://support.microsoft.com/en-us/office/track-changes-in-word-197ba630-0f5f-4a8e-9a77-3712475e806a", "publisher": "Microsoft Support", "accessedAt": D}]),
 ra("founders", "Founders", "gmail", "Gmail", "Gmail for founders: clear the inbox by voice on Mac", "Gmail for founders on Mac: reply faster by voice",
  "Gmail for founders on Mac: the settings that save time, plus how Lazur drafts replies from the email on screen so investor and customer threads move faster.",
  "gmail for founders",
  "Gmail for founders is mostly replies: investors, customers, hires. Turn on keyboard shortcuts and templates, then let Lazur draft the reply from the email on your screen while you say what it should say.",
  ["Turn on keyboard shortcuts: Settings > See all settings > Keyboard shortcuts.", "Use Schedule send so replies land at a sensible hour.", "Hold ⌥ ⌘ and say the reply. Lazur writes it in the compose box."],
  {"spoken": "reply, thanks for the intro, happy to talk next week, suggest Tuesday or Wednesday", "capability": "draft", "result": "Wrote the reply for you to check.", "output": "Thanks for the intro, Sam.\n\nHappy to talk next week. Does Tuesday or Wednesday work for you?\n\nBest,\nVeer", "shell": "mail"},
  [ask("reply, yes to the pilot, send the contract", "Drafts the reply at your cursor.", "draft"), ask("what's the ask in this email?", "Sums it up out loud.", "explain"), ask("where's schedule send?", "Points at the arrow next to Send.", "point"), ask("remind me to follow up Friday", "Adds a reminder.", "everyday"), ask("research this company before the call", "Runs it in the background and comes back with a report.", "research")],
  [{"type": "heading", "text": "Gmail settings worth two minutes", "level": 2}, {"type": "list", "items": ["Keyboard shortcuts on: e archives, r replies.", "Undo send set to 30 seconds.", "Schedule send for late-night replies."]}, {"type": "lazur"}],
  [faq("Does Lazur read my whole inbox?", "No. It sees the screen only while you hold the shortcut."), faq("Can it send for me?", "No. It drafts; you send.")],
  [{"title": "Keyboard shortcuts for Gmail", "url": "https://support.google.com/mail/answer/6594", "publisher": "Gmail Help", "accessedAt": D}]),
]
for p in ras:
    json.dump(p, open(os.path.join(BASE, "role-apps", f"{p['role']}--{p['app']}.json"), "w"), indent=2, ensure_ascii=False)
print(len(roles), len(ras))
