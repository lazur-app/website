OPTION A — Lazur Tray / Menu-Bar App

(Anti-Gravity Implementation Plan)

0. GOAL (NON-NEGOTIABLE)

Build Lazur as a background tray / menu-bar app
with no permanent window, minimal UI, and instant dictation.

The app:

Starts on login

Lives in menu bar (macOS) / system tray (Windows)

Uses global hotkeys

Shows UI only when needed

Never behaves like a traditional app window

1. HIGH-LEVEL ARCHITECTURE
Native Process (Tauri + Rust)
│
├── Global Hotkeys
├── Microphone Capture
├── Text Injection
├── Backend API Client
│
└── UI Surfaces (on demand only)
    ├── Tray / Menu UI
    ├── Floating Overlay (listening / error)
    └── Onboarding Screens (temporary)

2. PLATFORM BEHAVIOR (CRITICAL)
macOS

Lives in menu bar

No dock icon

Uses:

Accessibility API

Event Tap

Overlay floats above all apps

Windows

Lives in system tray

No taskbar window

Uses:

RegisterHotKey

SendInput

Overlay is top-most window

3. WHAT WE ARE NOT BUILDING

Anti-Gravity must NOT:

Create a main window

Show persistent UI

Handle signup or billing

Store credentials insecurely

4. PHASE-BY-PHASE IMPLEMENTATION
🔹 PHASE 1 — TRAY-ONLY APP BOOTSTRAP
🎯 Goal

App runs invisibly in background.

DELIVERABLES (ANTI-GRAVITY MUST IMPLEMENT)
1️⃣ Disable Main Window

Tauri config

Do NOT show window on launch

App starts hidden

macOS:

Hide dock icon

Show menu-bar icon only

Windows:

No taskbar entry

Tray icon only

2️⃣ Tray / Menu UI
Tray Items

Status (Idle / Listening)

“Open Settings”

“Sign in”

“Quit Lazur”

macOS

Native menu bar dropdown

Windows

System tray right-click menu

3️⃣ App Lifecycle

App launches at OS startup

Background-only mode

No visible window unless explicitly opened

✅ PHASE 1 DONE WHEN

App launches silently

Tray/menu icon is visible

No window appears

App can quit from tray

🔹 PHASE 2 — GLOBAL HOTKEY + DICTATION CORE
🎯 Goal

Hotkey → dictation → typing → done.

DELIVERABLES
1️⃣ Global Hotkeys

macOS

Event Tap

Support:

Push-to-talk

Hold-to-speak

Windows

RegisterHotKey

Same behavior

2️⃣ Microphone Pipeline

Start mic capture on hotkey down

Stop on release

Chunk audio

Stream to backend

Fallback to offline STT if needed

3️⃣ Text Injection

macOS

Accessibility API

Windows

SendInput

✅ PHASE 2 DONE WHEN

User presses hotkey

Speaks

Text appears at cursor

No UI distractions

🔹 PHASE 3 — FLOATING OVERLAY UI (IMPORTANT)
🎯 Goal

Give feedback without a window.

OVERLAY BEHAVIOR

Appears near cursor

Always-on-top

Translucent

Non-interactive

Auto-dismiss

Overlay States

“Listening…”

“Processing…”

“Offline mode”

Error (short)

macOS

Borderless NSPanel

Ignores focus

No dock icon

Windows

Always-on-top window

Click-through if possible

✅ PHASE 3 DONE WHEN

Overlay shows only while dictating

Overlay never steals focus

Overlay disappears instantly

🔹 PHASE 4 — AUTH BRIDGE (WEBSITE ↔ APP)
🎯 Goal

Unlock app after website login.

DELIVERABLES
1️⃣ Deep Link Handler

Handle:

lazur://auth?token=XYZ


Works on:

Cold app start

Already running app

2️⃣ Token Verification

Call /auth/verify-desktop

Receive session token

Store securely

Unlock app

3️⃣ Locked State

Before auth:

Tray menu shows “Sign in”

Dictation disabled

After auth:

Dictation enabled

✅ PHASE 4 DONE WHEN

Website login opens app

App unlocks

No auth UI inside app

🔹 PHASE 5 — ONBOARDING (TEMPORARY UI)
🎯 Goal

Guide user once, then disappear forever.

Screens

Permissions

Mic test

Hotkey setup

Done

Implementation:

Temporary window

Shown only once

Never shown again

macOS

Small centered window

Auto-close

Windows

Modal window

Dismissed permanently

✅ PHASE 5 DONE WHEN

User completes onboarding

App never shows it again

5. FILE / MODULE RESPONSIBILITIES
src-tauri/
├── tray/
│   ├── macos.rs
│   └── windows.rs
├── overlay/
│   ├── macos.rs
│   └── windows.rs
├── hotkeys/
├── audio/
├── injector/
├── auth/
└── state/

6. WHAT ANTI-GRAVITY SHOULD DO NOW
🚨 IMMEDIATE TASKS

Remove main window

Implement tray/menu bar

App lifecycle (background)

Hotkey → mic → inject pipeline

Floating overlay

Deep link auth handler