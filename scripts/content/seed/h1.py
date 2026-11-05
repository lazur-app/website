# Long-tail, keyword-rich H1s for the seed pages (title = H1, targetKeyword = exact phrase inside it).
import json, os
B = os.path.join(os.path.dirname(__file__), "../../../content/seo")
T = {
 "howto/make-a-pivot-table-in-excel": ("how to make a pivot table in excel on mac", "How to make a pivot table in Excel on Mac: step by step for Microsoft 365"),
 "apps/slack": ("ai assistant for slack on mac", "AI assistant for Slack on Mac: catch up on threads, draft replies and dictate updates"),
 "apps/gmail": ("ai assistant for gmail on mac", "AI assistant for Gmail on Mac: write replies by voice and clear your inbox faster"),
 "apps/cursor": ("voice assistant for cursor on mac", "Voice assistant for Cursor on Mac: explain errors, dictate prompts, write commit messages"),
 "apps/chatgpt": ("chatgpt on mac", "ChatGPT on Mac vs Lazur: which one to use for which job in 2026"),
 "apps/excel": ("ai assistant for excel on mac", "AI assistant for Excel on Mac: find any button, explain formulas, learn pivot tables"),
 "roles/founders": ("ai assistant for founders", "AI assistant for founders on Mac: replies, research and scheduling by voice"),
 "roles/lawyers": ("ai assistant for lawyers on mac", "AI assistant for lawyers on Mac: find clauses, sum up documents, draft emails"),
 "roles/developers": ("voice assistant for developers on mac", "Voice assistant for developers on Mac: explain errors and talk prompts into Cursor"),
 "roles/students": ("ai study buddy for mac", "AI study buddy for Mac: explain readings, take notes by voice, never miss deadlines"),
 "role-apps/lawyers--word": ("microsoft word for lawyers on mac", "Microsoft Word for lawyers on Mac: Track Changes, Compare and faster clause review"),
 "role-apps/founders--gmail": ("gmail for founders", "Gmail for founders on Mac: answer investors and customers faster by voice"),
 "compare/google-voice-typing-alternative": ("google docs voice typing alternative for mac", "Google Docs voice typing alternative for Mac that works in every app"),
 "compare/lazur-vs-apple-dictation": ("lazur vs apple dictation", "Lazur vs Apple Dictation on Mac: when free built-in dictation is enough"),
 "compare/lazur-vs-aqua-voice": ("lazur vs aqua voice", "Lazur vs Aqua Voice on Mac: screen-aware dictation or a voice assistant"),
 "compare/lazur-vs-macwhisper": ("lazur vs macwhisper", "Lazur vs MacWhisper on Mac: live voice help or on-device file transcription"),
 "compare/lazur-vs-super-whisper": ("lazur vs superwhisper", "Lazur vs Superwhisper on Mac: offline dictation or an assistant that sees your screen"),
 "compare/lazur-vs-willow-voice": ("lazur vs willow voice", "Lazur vs Willow Voice on Mac: fast AI dictation or a screen-aware assistant"),
 "compare/lazur-vs-wispr-flow": ("lazur vs wispr flow", "Lazur vs Wispr Flow on Mac: AI dictation or a voice assistant that sees your screen"),
 "compare/superwhisper-vs-wispr-flow": ("superwhisper vs wispr flow", "Superwhisper vs Wispr Flow in 2026: price, offline dictation and platforms compared"),
 "alternatives/wispr-flow": ("wispr flow alternatives for mac", "Wispr Flow alternatives for Mac in 2026, compared with real prices"),
}
for k, (kw, title) in T.items():
    p = os.path.join(B, k + ".json")
    d = json.load(open(p))
    d["targetKeyword"], d["title"] = kw, title
    json.dump(d, open(p, "w"), indent=2, ensure_ascii=False); open(p, "a").write("\n")
print(len(T))
