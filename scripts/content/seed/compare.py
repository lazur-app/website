# One-off seed: the hand-written compare pages (replacing the old TS ones) plus one alternatives
# page and one x-vs-y page. Competitor facts were read on each company's own site on 2026-11-05.
import json, os
BASE = os.path.join(os.path.dirname(__file__), "../../../content/seo")
D = "2026-11-05"
def faq(q, a): return {"question": q, "answer": a}

LAZUR = {"name": "Lazur", "slug": "lazur", "site": "https://www.lazur.app", "isLazur": True,
 "pricing": "3-day free trial, then Pro $18/month or Power $120/month", "pricingSourceUrl": "https://www.lazur.app/pricing", "pricingCheckedAt": D,
 "platforms": "macOS (Apple silicon and Intel)",
 "summary": "A voice assistant in the Mac notch. Hold ⌥ ⌘ and it sees your screen, answers out loud, points at buttons and walks you through apps. Hold fn to dictate in any app.",
 "bestFor": ["You want help with what is on your screen, not only typing", "You learn new Mac apps often", "You want dictation and an assistant in one app"]}

P = {
 "wispr-flow": {"name": "Wispr Flow", "slug": "wispr-flow", "site": "https://wisprflow.ai", "pricing": "Free plan with limited words per week; Pro $15/month or $12/month billed annually", "pricingSourceUrl": "https://wisprflow.ai/pricing", "pricingCheckedAt": D, "platforms": "Mac, Windows, iOS, Android",
   "summary": "AI dictation that cleans up as you speak: removes filler words, adds punctuation, works in any app, 100+ languages, personal dictionary and snippets.",
   "bestFor": ["Dictation is the main job", "You need it on Windows or your phone too", "You dictate in many languages"]},
 "superwhisper": {"name": "Superwhisper", "slug": "superwhisper", "site": "https://superwhisper.com", "pricing": "Free plan; Pro $8.49/month, $84.99/year or $249.99 lifetime", "pricingSourceUrl": "https://superwhisper.com", "pricingCheckedAt": D, "platforms": "Mac, Windows, iOS, Android",
   "summary": "Dictation with local and cloud models, offline transcription, custom vocabulary and modes like Message and Email. You can bring your own API keys.",
   "bestFor": ["You want offline, on-device transcription", "You like tuning models and modes", "You want a lifetime license"]},
 "aqua-voice": {"name": "Aqua Voice", "slug": "aqua-voice", "site": "https://aquavoice.com", "pricing": "Free for 1,000 words; Pro $12/month ($10 billed annually); Max $24/month ($19 billed annually)", "pricingSourceUrl": "https://aquavoice.com/pricing", "pricingCheckedAt": D, "platforms": "Mac, Windows, iOS, Android",
   "summary": "AI dictation with screen awareness, real-time refinement, a custom dictionary and writing styles. Works in every app.",
   "bestFor": ["You want fast dictation that reads context from your screen", "You need Windows or mobile too", "Your team needs a BAA (Max and Business plans)"]},
 "macwhisper": {"name": "MacWhisper", "slug": "macwhisper", "site": "https://goodsnooze.gumroad.com/l/macwhisper", "pricing": "Free version; Pro €65 one-time license for personal use", "pricingSourceUrl": "https://goodsnooze.gumroad.com/l/macwhisper", "pricingCheckedAt": D, "platforms": "macOS, plus iPhone and iPad",
   "summary": "Transcribes audio and video files on your Mac, records meetings, exports subtitles and documents, and offers system-wide dictation. Transcription runs on device.",
   "bestFor": ["You transcribe recordings and meetings", "You want everything on device", "You prefer a one-time license"]},
 "willow-voice": {"name": "Willow Voice", "slug": "willow-voice", "site": "https://willowvoice.com", "pricing": "Free Basic plan; Pro $15/month or $12/month billed annually", "pricingSourceUrl": "https://willowvoice.com/pricing", "pricingCheckedAt": D, "platforms": "Mac, Windows, iPhone (Android coming soon)",
   "summary": "Dictation with smart formatting, a dictionary that learns, writing-style matching and an offline mode.",
   "bestFor": ["You mostly dictate and want it fast", "You need Windows or iPhone too", "You want an offline mode"]},
 "apple-dictation": {"name": "Apple Dictation", "slug": "apple-dictation", "site": "https://support.apple.com/guide/mac-help/use-dictation-mh40584/mac", "pricing": "Free, built into macOS", "platforms": "macOS (and every Apple device)",
   "summary": "The dictation built into macOS. Turn it on in System Settings > Keyboard > Dictation and start it with the microphone key or your shortcut. Stops after 30 seconds of silence.",
   "bestFor": ["Short notes in Apple apps", "You want nothing extra installed", "Free matters more than cleanup"]},
 "google-voice-typing": {"name": "Google Docs voice typing", "slug": "google-voice-typing", "site": "https://support.google.com/docs/answer/4492226", "pricing": "Included in Google Docs", "platforms": "Google Docs in Chrome, Edge or Safari",
   "summary": "Voice typing inside Google Docs (Tools > Voice typing). Voice commands for editing work in English only.",
   "bestFor": ["You only dictate inside Google Docs", "You want nothing to install", "You already work in Chrome"]},
}

SRC = {
 "wispr-flow": [("Wispr Flow pricing", "https://wisprflow.ai/pricing"), ("Wispr Flow", "https://wisprflow.ai")],
 "superwhisper": [("Superwhisper", "https://superwhisper.com")],
 "aqua-voice": [("Aqua Voice pricing", "https://aquavoice.com/pricing"), ("Aqua Voice", "https://aquavoice.com")],
 "macwhisper": [("MacWhisper on Gumroad", "https://goodsnooze.gumroad.com/l/macwhisper")],
 "willow-voice": [("Willow Voice pricing", "https://willowvoice.com/pricing"), ("Willow Voice", "https://willowvoice.com")],
 "apple-dictation": [("Use Dictation on Mac", "https://support.apple.com/guide/mac-help/use-dictation-mh40584/mac")],
 "google-voice-typing": [("Type with your voice in Google Docs", "https://support.google.com/docs/answer/4492226")],
}
LAZUR_SRC = ("Lazur pricing", "https://www.lazur.app/pricing")

ROWS = {
 "Main job": {"lazur": "Voice assistant that sees your screen; dictation included", "wispr-flow": "AI dictation", "superwhisper": "Dictation and transcription", "aqua-voice": "AI dictation with screen context", "macwhisper": "File and meeting transcription, plus dictation", "willow-voice": "AI dictation", "apple-dictation": "Built-in dictation", "google-voice-typing": "Dictation inside Google Docs"},
 "Answers questions about your screen": {"lazur": "Yes, out loud", "wispr-flow": "No", "superwhisper": "No", "aqua-voice": "Uses the screen to improve dictation", "macwhisper": "No", "willow-voice": "No", "apple-dictation": "No", "google-voice-typing": "No"},
 "Points at buttons, guides you through apps": {"lazur": "Yes", "wispr-flow": "No", "superwhisper": "No", "aqua-voice": "No", "macwhisper": "No", "willow-voice": "No", "apple-dictation": "No", "google-voice-typing": "No"},
 "Dictation in any app": {"lazur": "Yes (hold fn)", "wispr-flow": "Yes", "superwhisper": "Yes", "aqua-voice": "Yes", "macwhisper": "Yes", "willow-voice": "Yes", "apple-dictation": "Yes, in most text fields", "google-voice-typing": "No, Google Docs only"},
 "On-device option": {"lazur": "No, cloud while you hold the key; nothing stored", "wispr-flow": "Not stated on their site", "superwhisper": "Yes, offline models", "aqua-voice": "Not stated on their site", "macwhisper": "Yes, transcription on device", "willow-voice": "Offline mode", "apple-dictation": "On supported Macs", "google-voice-typing": "Not stated"},
 "Runs on": {k: (LAZUR["platforms"] if k == "lazur" else P[k]["platforms"]) for k in ["lazur", *P]},
 "Price": {k: (LAZUR["pricing"] if k == "lazur" else P[k]["pricing"]) for k in ["lazur", *P]},
}

def table(slugs):
    return [{"feature": f, "values": [v[s] for s in slugs]} for f, v in ROWS.items()]

def sources(slugs):
    out = []
    for s in slugs:
        for t, u in (SRC.get(s) or [LAZUR_SRC]):
            out.append({"title": t, "url": u, "publisher": "Lazur" if s == "lazur" else P[s]["name"], "accessedAt": D})
    return out

def lazur_vs(slug, comp, title, kw, intro, verdict, extra_faq, blocks, desc):
    c = P[comp]
    return {"type": "compare", "kind": "lazur-vs", "slug": slug, "title": title, "metaTitle": title + ": which one fits your Mac",
     "description": desc, "targetKeyword": kw, "secondaryKeywords": [f"{c['name'].lower()} alternative", f"{c['name'].lower()} vs lazur"],
     "intro": intro,
     "tldr": [f"{c['name']} is a dictation tool. Lazur is a voice assistant that also dictates.", f"Pick {c['name']} if typing by voice is all you need{', on more devices' if 'Windows' in c['platforms'] else ''}.", "Pick Lazur if you also want help with what is on your screen: answers, pointing at buttons, step-by-step guidance.", "Lazur is free for 3 days, then $18/month."],
     "products": [LAZUR, c], "table": table(["lazur", comp]), "verdict": verdict,
     "stats": [], "blocks": blocks,
     "faq": [faq(f"Is Lazur a good {c['name']} alternative?", f"If you want more than dictation, yes. Lazur dictates in any Mac app and also answers questions about your screen, points at buttons and guides you. If you only dictate, {c['name']} is a fine choice."), faq(f"Can I use Lazur and {c['name']} together?", "Yes, as long as their shortcuts do not clash. Lazur uses hold fn to dictate and hold ⌥ ⌘ to ask."), *extra_faq],
     "sources": sources(["lazur", comp]), "publishedAt": "2026-07-01", "updatedAt": D, "images": [], "generator": {"by": "hand (fixture, rewritten from the old compare page)", "version": 2}}

def std_blocks(comp, para):
    c = P[comp]
    return [
     {"type": "heading", "text": f"The difference in one sentence", "level": 2},
     {"type": "paragraph", "text": para},
     {"type": "heading", "text": f"Where {c['name']} is the better pick", "level": 2},
     {"type": "list", "items": c["bestFor"]},
     {"type": "heading", "text": "Where Lazur is the better pick", "level": 2},
     {"type": "list", "items": ["You get stuck in apps and want someone to point at the button.", "You want to ask “what does this mean?” about anything on screen.", "You want timers, reminders and background research by voice too."]},
     {"type": "lazur"},
     {"type": "paragraph", "text": "Want numbers for your own typing? Try the [speaking vs typing test](/tools/speaking-vs-typing-test)."}]

pages = [
 lazur_vs("lazur-vs-wispr-flow", "wispr-flow", "Lazur vs Wispr Flow", "lazur vs wispr flow",
   "Wispr Flow is AI dictation: you talk, it types clean text in any app. Lazur dictates too, but its main job is different: hold ⌥ ⌘ and it sees your screen, answers out loud and points at what you need.",
   "If you want the best pure dictation on every device, Wispr Flow is the safer pick. If you are on a Mac and want an assistant that understands your screen as well as dictation, pick Lazur.",
   [faq("Is Wispr Flow cheaper than Lazur?", "Yes. Wispr Flow Pro is $15/month, or $12/month billed annually, on its pricing page. Lazur Pro is $18/month. Lazur includes the screen-aware assistant, not only dictation.")],
   std_blocks("wispr-flow", "Wispr Flow turns speech into polished text; Lazur turns a question about your screen into an answer, and also types when you want it to."),
   "Lazur vs Wispr Flow on Mac: Wispr Flow is AI dictation on every device. Lazur is a voice assistant that sees your screen and dictates. Prices from each site."),
 lazur_vs("lazur-vs-super-whisper", "superwhisper", "Lazur vs Superwhisper", "lazur vs superwhisper",
   "Superwhisper is dictation with local and cloud models, including offline transcription. Lazur is a voice assistant for the Mac: it dictates, and it also sees your screen, answers out loud and points at buttons.",
   "Choose Superwhisper for offline, tunable dictation at a low price. Choose Lazur if you want help with what is on your screen as well as typing by voice.",
   [faq("Does Lazur work offline like Superwhisper?", "No. Lazur sends audio and one screenshot to AI providers while you hold the shortcut, and nothing is stored. Superwhisper offers offline models.")],
   std_blocks("superwhisper", "Superwhisper is about getting your words onto the page, on your terms; Lazur is about getting help with the app you are in."),
   "Lazur vs Superwhisper for Mac: offline, tunable dictation or a voice assistant that sees your screen and dictates. Real prices from each company's site."),
 lazur_vs("lazur-vs-aqua-voice", "aqua-voice", "Lazur vs Aqua Voice", "lazur vs aqua voice",
   "Aqua Voice is AI dictation that uses your screen to type more accurately. Lazur uses your screen for more than typing: hold ⌥ ⌘ and it answers questions, points at buttons and walks you through apps.",
   "Both read the screen. Aqua uses it to type better, on Mac, Windows and phones. Lazur uses it to help you, on Mac. If you want dictation everywhere, pick Aqua. If you want an assistant, pick Lazur.",
   [faq("Does Aqua Voice see my screen too?", "Aqua lists screen awareness as a feature, used to improve dictation. Lazur uses the screen to answer questions and point at things.")],
   std_blocks("aqua-voice", "Aqua Voice reads your screen to type what you mean; Lazur reads your screen to answer what you ask."),
   "Lazur vs Aqua Voice on Mac: both read your screen. Aqua uses it for dictation on every device; Lazur answers, points and guides. Prices from each site."),
 lazur_vs("lazur-vs-macwhisper", "macwhisper", "Lazur vs MacWhisper", "lazur vs macwhisper",
   "MacWhisper transcribes audio and video files on your Mac and also offers dictation, all on device. Lazur is a live voice assistant: it answers questions about your screen and types as you talk.",
   "For transcribing recordings and meetings privately, MacWhisper is the right tool. For live help and dictation while you work, Lazur. Many people could use both.",
   [faq("Can Lazur transcribe audio files?", "No. Lazur works live while you hold a key. For recordings, MacWhisper is built for the job.")],
   std_blocks("macwhisper", "MacWhisper is for recordings you already have; Lazur is for the work in front of you right now."),
   "Lazur vs MacWhisper: on-device file and meeting transcription, or a live voice assistant that sees your Mac screen and dictates. Prices from each site."),
 lazur_vs("lazur-vs-willow-voice", "willow-voice", "Lazur vs Willow Voice", "lazur vs willow voice",
   "Willow Voice is AI dictation with smart formatting and an offline mode. Lazur is a voice assistant for the Mac that also dictates: hold ⌥ ⌘ and it sees your screen and answers out loud.",
   "Pick Willow if dictation is the whole job and you want it on Windows or iPhone too. Pick Lazur if you want screen-aware help on your Mac as well.",
   [],
   std_blocks("willow-voice", "Willow makes typing by voice fast; Lazur makes getting help with your screen fast, and types too."),
   "Lazur vs Willow Voice for Mac: fast AI dictation with an offline mode, or a voice assistant that sees your screen and dictates. Prices from each site."),
 lazur_vs("lazur-vs-apple-dictation", "apple-dictation", "Lazur vs Apple Dictation", "lazur vs apple dictation",
   "Apple Dictation is free and built into macOS: turn it on in System Settings > Keyboard > Dictation. Lazur adds clean-up and an assistant that sees your screen, for $18/month after a 3-day trial.",
   "Start with Apple Dictation. It costs nothing. Move to Lazur when you want cleaner text in every app, or help with what is on your screen.",
   [faq("How do I turn on Apple Dictation?", "Choose Apple menu > System Settings > Keyboard, turn on Dictation, then click Enable. Start it with the microphone key, your shortcut, or Edit > Start Dictation.")],
   std_blocks("apple-dictation", "Apple Dictation types what you say; Lazur types it cleanly and can also answer what you ask about your screen."),
   "Lazur vs Apple Dictation on Mac: when free built-in dictation is enough, and when a voice assistant that sees your screen and cleans up text is worth it."),
]
g = lazur_vs("google-voice-typing-alternative", "google-voice-typing", "Google Docs voice typing alternative for Mac", "google docs voice typing alternative mac",
   "Google Docs voice typing only works inside Google Docs in the browser (Tools > Voice typing). If you want to talk in any Mac app, Lazur dictates everywhere and also answers questions about your screen.",
   "Inside Google Docs, voice typing is free and fine. Outside Docs it does nothing. Lazur covers every app on your Mac.",
   [faq("Does Google voice typing work outside Google Docs?", "No. It is a Google Docs feature (and speaker notes in Slides). It works in Chrome, Edge and Safari.")],
   std_blocks("google-voice-typing", "Google voice typing lives in one document editor; Lazur lives in the notch and works in every app."),
   "A Google Docs voice typing alternative for Mac: dictate in any app, not only Docs, and ask about your screen. What voice typing can and cannot do.")
g["metaTitle"] = "Google Docs voice typing alternative for Mac"
pages.append(g)

alt_slugs = ["lazur", "wispr-flow", "superwhisper", "aqua-voice", "willow-voice"]
alt = {"type": "alternatives", "kind": "alternatives", "slug": "wispr-flow", "title": "Wispr Flow alternatives for Mac",
 "metaTitle": "Wispr Flow alternatives for Mac (with real prices)",
 "description": "The best Wispr Flow alternatives for Mac compared: Superwhisper, Aqua Voice, Willow Voice and Lazur. Prices from each company's own pricing page.",
 "targetKeyword": "wispr flow alternatives mac", "secondaryKeywords": ["apps like wispr flow", "wispr flow alternative"],
 "intro": "The main Wispr Flow alternatives on Mac are Superwhisper, Aqua Voice, Willow Voice and Lazur. The first three are dictation apps like Wispr Flow; Lazur is a voice assistant that sees your screen and dictates too.",
 "tldr": ["Cheapest paid plan: Superwhisper Pro at $8.49/month, or a $249.99 lifetime license.", "Offline dictation: Superwhisper and Willow Voice.", "Dictation that reads your screen: Aqua Voice.", "Help with your screen as well as dictation: Lazur."],
 "products": [P["wispr-flow"], P["superwhisper"], P["aqua-voice"], P["willow-voice"], LAZUR],
 "table": [{"feature": f, "values": [v[s] for s in ["wispr-flow", "superwhisper", "aqua-voice", "willow-voice", "lazur"]]} for f, v in ROWS.items()],
 "verdict": "If you like Wispr Flow and only want it cheaper, try Superwhisper. If you want offline, Superwhisper or Willow. If you want dictation that understands context, Aqua Voice. If what you really want is help with the apps on your Mac, try Lazur.",
 "stats": [], "blocks": [
   {"type": "heading", "text": "How to choose", "level": 2},
   {"type": "list", "items": ["Need Windows or a phone too? Wispr Flow, Superwhisper, Aqua Voice and Willow all have more than Mac.", "Need it offline? Superwhisper has offline models; Willow has an offline mode.", "Want answers and pointing, not only typing? That is Lazur."]},
   {"type": "lazur"},
   {"type": "paragraph", "text": "Measure your own speed first with the [typing speed test](/tools/typing-speed-test), and check any app's accuracy with the [dictation accuracy checker](/tools/dictation-accuracy-checker)."}],
 "faq": [faq("What is the best free Wispr Flow alternative?", "Apple Dictation is free and built into macOS. Superwhisper, Aqua Voice and Willow Voice also have free plans with limits."), faq("Is there a Wispr Flow alternative with a lifetime license?", "Superwhisper lists a $249.99 lifetime Pro license on its site."), faq("Which alternative works offline?", "Superwhisper offers offline models and Willow Voice has an offline mode, according to their sites.")],
 "sources": sources(["wispr-flow", "superwhisper", "aqua-voice", "willow-voice", "lazur"]), "publishedAt": D, "updatedAt": D, "images": [], "generator": {"by": "hand (fixture)", "version": 1}}

xy_slugs = ["wispr-flow", "superwhisper", "lazur"]
xy = {"type": "compare", "kind": "x-vs-y", "slug": "superwhisper-vs-wispr-flow", "title": "Superwhisper vs Wispr Flow",
 "metaTitle": "Superwhisper vs Wispr Flow: price, offline, platforms",
 "description": "Superwhisper vs Wispr Flow compared: price, offline dictation, platforms and features, with prices from each company's own site. Plus a third option for Mac.",
 "targetKeyword": "superwhisper vs wispr flow", "secondaryKeywords": ["wispr flow vs superwhisper"],
 "intro": "Superwhisper vs Wispr Flow comes down to offline and price versus polish. Superwhisper offers offline models and a lower price; Wispr Flow focuses on clean, edited dictation across Mac, Windows and phones.",
 "tldr": ["Superwhisper Pro is $8.49/month; Wispr Flow Pro is $15/month ($12 billed annually).", "Superwhisper has offline models. Wispr Flow's site does not say it runs on device.", "Both run on Mac, Windows, iOS and Android.", "Want screen-aware help, not only dictation? Lazur is a third option on Mac."],
 "products": [P["superwhisper"], P["wispr-flow"], LAZUR],
 "table": [{"feature": f, "values": [v[s] for s in ["superwhisper", "wispr-flow", "lazur"]]} for f, v in ROWS.items()],
 "verdict": "Pick Superwhisper for offline dictation and a lower price. Pick Wispr Flow for polished dictation with less setup. If you want a Mac assistant that also dictates, look at Lazur.",
 "stats": [], "blocks": [{"type": "heading", "text": "Price", "level": 2}, {"type": "paragraph", "text": "On their own pricing pages, Superwhisper Pro is $8.49/month, $84.99/year or $249.99 lifetime. Wispr Flow Pro is $15/month or $12/month billed annually. Both have free plans with limits."}, {"type": "heading", "text": "Privacy and offline", "level": 2}, {"type": "paragraph", "text": "Superwhisper lets you choose local or cloud models and bring your own API keys. Wispr Flow lists SOC 2 Type II, ISO 27001 and HIPAA with a signed BAA, and lets you opt out of model training."}, {"type": "lazur"}],
 "faq": [faq("Is Superwhisper cheaper than Wispr Flow?", "Yes. Superwhisper Pro is $8.49/month against $15/month for Wispr Flow Pro, on each company's site."), faq("Which one works offline?", "Superwhisper offers offline models. Wispr Flow's site does not say dictation runs on device.")],
 "sources": sources(["superwhisper", "wispr-flow", "lazur"]), "publishedAt": D, "updatedAt": D, "images": [], "generator": {"by": "hand (fixture)", "version": 1}}

for p in pages + [xy]:
    json.dump(p, open(os.path.join(BASE, "compare", p["slug"] + ".json"), "w"), indent=2, ensure_ascii=False)
json.dump(alt, open(os.path.join(BASE, "alternatives", "wispr-flow.json"), "w"), indent=2, ensure_ascii=False)
print(len(pages) + 2)
