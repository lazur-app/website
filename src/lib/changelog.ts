/**
 * The changelog at /changelog, newest first. Written from the Mac app's release history
 * (app-macOS git log). Add a new entry at the top for every release.
 */

export type ChangeItem = { name: string; text: string };
export type ChangeSection = { label: string; items: ChangeItem[] };
export type Release = {
  version: string;
  /** ISO date the version shipped. */
  date: string;
  title: string;
  summary: string;
  sections: ChangeSection[];
  /** One honest aside, shown in a quiet box (e.g. "you'll need to download this one by hand"). */
  note?: string;
};

export const RELEASES: Release[] = [
  {
    version: "0.1.12",
    date: "2026-10-30",
    title: "Lazur remembers, and keeps your files",
    summary:
      "Ask \"what were we doing yesterday?\" and Lazur knows. Drop a file on the notch and it's there whenever you need it, even to upload into a web form. All kept on your Mac.",
    sections: [
      {
        label: "New",
        items: [
          { name: "Memory", text: "Lazur remembers what you asked it and what it did, session by session and day by day. Ask \"what were we debugging yesterday?\", \"what did I do with Priya last week?\" or \"what did I ask about pricing?\". It follows people, projects and topics across days, and understands that \"invoice\" and \"bill\" mean the same thing." },
          { name: "\"Remember this\"", text: "Say it while looking at something and Lazur saves the details, word for word, so you can ask for them later." },
          { name: "A Memory tab", text: "See every day, session and moment Lazur remembers, search it, and delete anything. Pause or turn memory off, keep apps out of it, or erase it all in Settings → Memory. It never includes dictation, audio or screenshots, and it stays on your Mac." },
          { name: "Drop files on the notch", text: "Drag a resume, an ID or a contract up to the notch and let go. Lazur keeps its own copy (your original stays put), reads it, and you can ask \"what does the contract say about notice?\". Find them all in the new Artifacts tab." },
          { name: "Uploads in forms", text: "Background jobs can attach a file you saved to a web form, like your resume on a job application. Lazur asks before submitting anything. Needs Lazur for Chrome 0.4." },
        ],
      },
      {
        label: "Improved",
        items: [
          { name: "Hide finished jobs", text: "An × on finished job cards clears them from the notch. They stay in Jobs." },
          { name: "Ink trail", text: "Lazur's pointer now leaves a soft, tapered coral stroke instead of grey dots." },
          { name: "Add to Chrome", text: "The button now opens Lazur for Chrome in the Chrome Web Store." },
          { name: "Leaner conversations", text: "Lazur keeps less of an old conversation in mind at once and looks things up in memory when it needs them, so long sessions stay quick." },
        ],
      },
      {
        label: "Fixed",
        items: [
          { name: "Clicks under the notch", text: "The invisible edge around the open notch no longer blocks the browser tabs or buttons right under it." },
          { name: "Stray dictation text", text: "Dictating into silence no longer types \"Format with proper punctuation\"." },
          { name: "\"Paste it here\"", text: "Lazur now pastes what you asked for instead of reading it out loud." },
        ],
      },
    ],
  },
  {
    version: "0.1.11",
    date: "2026-10-28",
    title: "Lazur now updates itself",
    summary:
      "The last update you'll ever install by hand. From here on, Lazur keeps itself current quietly in the background. Plus timers in the notch, cute cursors, a proper Settings tab and a tutorial you actually get to try.",
    sections: [
      {
        label: "New",
        items: [
          { name: "Automatic updates", text: "New versions download in the background and install when your Mac has been idle for a while. Never while Lazur is listening, talking, running a job or while the panel is open." },
          { name: "What's new card", text: "After an update, the notch tells you once what changed. Bigger updates leave a small dot on the notch until you're ready." },
          { name: "Timers in the notch", text: "\"Set a timer for 5 minutes\" and it ticks right in the notch. It starts when Lazur finishes speaking, rings until you press Stop (or say \"stop\"), and you can pick the sound in Settings." },
          { name: "Cursor styles", text: "Classic, Bubble, Halo or Sparkle. Pick the little buddy that follows your pointer in Settings → Cursor." },
          { name: "A hands-on tutorial", text: "Dictation practice now opens its own small window with a text box, so there's always somewhere to try it. The tutorial card stays up while you talk, and after it sets your first reminder, Lazur opens Reminders and circles it." },
          { name: "Tips, when they're useful", text: "Said the same email three times? Lazur suggests a snippet, already filled in. Same for clipboard slots, background jobs and Words. One tip a day at most, never the same one twice." },
        ],
      },
      {
        label: "Improved",
        items: [
          { name: "Pointing at menu-bar icons", text: "\"Where's Control Center?\" now lands exactly on it, including on Macs set to British spelling (Control Centre) and for icons like Wi-Fi with no visible text." },
          { name: "Labels stay on screen", text: "A label on something near the top of the screen flips below it instead of getting cut off." },
          { name: "Talks and points in one go", text: "When Lazur draws on your screen, it speaks and draws together instead of drawing first and talking after. Pointing feels quicker." },
          { name: "Settings is a tab", text: "Home · Jobs · Clipboard · Snippets · Words · Settings. No more hunting behind a gear." },
        ],
      },
      {
        label: "Fixed",
        items: [
          { name: "Running from the installer", text: "If you open Lazur straight from the disk image, it now tells you to move it to Applications first, so updates can install." },
          { name: "Unfinished settings", text: "The Voice and Integrations pages weren't ready, so they're hidden for now." },
        ],
      },
    ],
  },
  {
    version: "0.1.10",
    date: "2026-10-26",
    title: "Polish after the relaunch",
    summary: "A quick round of fixes for the AI buddy release, mostly about privacy between accounts and getting out of your way during setup.",
    sections: [
      {
        label: "Fixed",
        items: [
          { name: "Job history per account", text: "Background jobs were saved in one place for every account on a Mac, so the next person to sign in could see them. Each account now has its own history." },
          { name: "Permissions vs. the tutorial", text: "Screen Recording is asked for from its own card instead of at every launch, and the tutorial waits for permissions before it starts talking." },
          { name: "Clearer trial messages", text: "The upgrade card only says your trial ended if you actually had one." },
          { name: "Chrome extension link", text: "While the extension is in review with Google, Lazur says so instead of sending you to a dead store page." },
        ],
      },
    ],
    note: "0.1.9 and 0.1.10 can't update themselves. If you're on one of them, download 0.1.11 once and you'll get every update after that automatically.",
  },
  {
    version: "0.1.9",
    date: "2026-10-04",
    title: "Lazur becomes your AI buddy",
    summary:
      "The big one. Lazur moved into the notch and learned to see, talk and do. Hold a key, ask about anything on your screen, and it answers out loud, points at things and gets them done.",
    sections: [
      {
        label: "New",
        items: [
          { name: "Lives in the notch", text: "Everything happens in a small panel that grows out of your MacBook's notch. Hover it to see your jobs; it opens fully when you need it." },
          { name: "Hold ⌥ ⌘ and talk", text: "Ask about whatever's on your screen. Lazur looks the moment you ask (and only then) and answers out loud." },
          { name: "It points at things", text: "\"Where's the export button?\" Lazur draws a circle around it, right on your screen." },
          { name: "Step-by-step guides", text: "\"How do I turn on dark mode?\" It circles the first click, waits for you, then shows the next one until you're there." },
          { name: "Background jobs", text: "Hand off research, reading and tidying. Lazur works in its own Chrome tabs while you keep going, and brings back a summary and a full report." },
          { name: "Mac actions", text: "Reminders, calendar events, notes, music and volume, opening apps and links, web searches and your Shortcuts, all by voice." },
          { name: "Routines", text: "\"Always move new screenshots to Screenshots\" runs on your Mac, forever, no job needed." },
          { name: "Circle while you talk", text: "Draw around something with your pointer while you're asking, and Lazur knows exactly what you mean by \"this\"." },
        ],
      },
      {
        label: "Still here",
        items: [
          { name: "Dictation", text: "Hold fn and talk in any app. Snippets, Words and clipboard slots all moved into the notch panel." },
        ],
      },
      {
        label: "Gone",
        items: [{ name: "The floating orb and dashboard", text: "Everything lives in the notch now." }],
      },
    ],
  },
  {
    version: "0.1.8",
    date: "2026-08-23",
    title: "Dictation on your Mac",
    summary: "Speech recognition moved onto your Mac: faster, private by default, and it works offline.",
    sections: [
      {
        label: "New",
        items: [
          { name: "On-device speech", text: "A new speech model (NVIDIA Parakeet) runs right on your Mac. It downloads once on first launch." },
          { name: "Screen glance", text: "Command Mode can take a quick look at your screen to understand what you're talking about." },
        ],
      },
      {
        label: "Improved",
        items: [
          { name: "Local history", text: "Your dictation history is kept on your Mac by default." },
          { name: "One clean-up pass", text: "Text is tidied once before it's pasted, so what lands is final." },
        ],
      },
      {
        label: "Removed",
        items: [
          { name: "Speaker ID and feature guides", text: "Neither earned its keep, so they're gone." },
        ],
      },
    ],
  },
  {
    version: "0.1.7",
    date: "2026-07-23",
    title: "Smoother updates and dictation",
    summary: "Small but noticeable. (0.1.6 never shipped, in case you were wondering.)",
    sections: [
      {
        label: "Improved",
        items: [
          { name: "Update progress", text: "The update window shows a proper progress bar and how much is left to download." },
          { name: "Faster sign-in", text: "Your account loads while the app starts instead of after." },
        ],
      },
      {
        label: "Fixed",
        items: [{ name: "Dictation stealing focus", text: "Starting dictation could bring Lazur's window to the front. It stays out of the way now." }],
      },
    ],
  },
  {
    version: "0.1.5",
    date: "2026-07-07",
    title: "Built for Intel Macs too",
    summary: "Lazur now comes in two builds, Apple silicon and Intel, and the download page picks the right one for you.",
    sections: [
      {
        label: "Improved",
        items: [
          { name: "Faster speech on Intel", text: "On-device speech skips the GPU path that slowed Intel Macs down." },
          { name: "Notifications", text: "Cleaner, calmer notification styling." },
        ],
      },
    ],
  },
  {
    version: "0.1.4",
    date: "2026-07-03",
    title: "Hold-to-dictate, fixed for good",
    summary: "Quick taps and cancels used to trip dictation up. Not anymore.",
    sections: [
      {
        label: "Fixed",
        items: [
          { name: "Fast taps", text: "Starting and stopping dictation quickly, or cancelling midway, works reliably." },
          { name: "Accidental reloads", text: "Right-clicking the app no longer offers to reload it." },
        ],
      },
      {
        label: "New",
        items: [{ name: "Account settings", text: "Manage your account and plan from inside the app." }],
      },
    ],
  },
  {
    version: "0.1.3",
    date: "2026-07-02",
    title: "Tidier settings",
    summary: "A small release that made the app simpler to live with.",
    sections: [
      {
        label: "Improved",
        items: [
          { name: "Output style from the menu bar", text: "Switch between raw, clean and professional output from the tray." },
          { name: "Trial ended?", text: "Lazur tells you plainly and shows how to subscribe." },
          { name: "Log out", text: "Moved into Settings, where you'd expect it." },
        ],
      },
    ],
  },
  {
    version: "0.1.2",
    date: "2026-07-01",
    title: "A proper welcome",
    summary: "New onboarding that lets you try things instead of reading about them.",
    sections: [
      {
        label: "New",
        items: [
          { name: "Try-it onboarding", text: "Practice dictation and Command Mode during setup." },
          { name: "Speech on your Mac", text: "A speech model ships with the app, with cloud clean-up on top." },
        ],
      },
      {
        label: "Fixed",
        items: [
          { name: "Microphone permission", text: "Asking for the mic works the first time." },
          { name: "Shortcuts", text: "Lazur warns you if a shortcut you pick is already used by macOS." },
        ],
      },
    ],
  },
  {
    version: "0.1.1",
    date: "2026-06-23",
    title: "Hello, Mac",
    summary: "The first Lazur for Mac. Hold a key, talk, and polished text lands wherever your cursor is.",
    sections: [
      {
        label: "New",
        items: [
          { name: "Dictation anywhere", text: "Hold your shortcut in any app and talk; a small capsule shows Lazur listening." },
          { name: "Output styles", text: "Raw, clean or professional: keep exactly what you said, or tidy it up." },
          { name: "Clipboard slots", text: "Save copies to numbered slots and paste them anywhere (5 slots, 9 on Pro)." },
          { name: "Zen mode", text: "A distraction-free mode for Pro and Power." },
          { name: "Auto-updater", text: "The first version of in-app updates." },
        ],
      },
    ],
  },
];
