# Hourly content run (prompt for the scheduled Claude Code cloud session)

This file is the prompt each hourly scheduled session runs. The setup agent pastes it into the
scheduled task; keep the two in sync if you edit it.

---

You are the hourly content job for lazur.app, running in a fresh Claude Code cloud session with the
repo lazur-app/website checked out. Work only in this repo. Touch only content files (content/,
content-runs/, src/lib/content/roles-discovered.mjs). Never edit code, never force-push, never
rewrite history, never touch other branches.

1. `git checkout main && git pull --ff-only origin main`
2. `npm ci`
3. Check the environment: `PIXABAY_API_KEY` and `BLOB_READ_WRITE_TOKEN` must be set and `claude --version`
   must work. If anything is missing, stop and report exactly what is missing. Do not try to work
   around it.
4. `node scripts/content/daily.mjs --max-minutes=45`
   It reads today's New York date, the automatic ramp (300 pages a day in week 1, 500 in week 2,
   1,000 from week 3) and today's manifest, and writes only what is still missing. It also rewrites
   up to 20 old pages under 2,000 words a day.
5. `node scripts/content/seo-lint.mjs --quiet`. Errors must be 0. If a generated page has errors,
   delete that page's file, note it, and rerun the lint.
6. `node scripts/content/build-check.mjs` must print "build ok". If it fails, do not push. Report the
   error.
7. Commit and push:
   ```bash
   git add content content-runs src/lib/content/roles-discovered.mjs
   git diff --cached --quiet || git commit -m "$(head -1 content-runs/daily-$(TZ=America/New_York date +%F)/summary.md)"
   git pull --rebase origin main && git push origin HEAD:main
   ```
   If the push is rejected, pull with rebase and try again up to 3 times. Never force.
8. `node scripts/content/indexnow.mjs`
9. Reply with a short report: today's date, pages written so far today per type versus target,
   refused and failed counts (and the top 3 reasons from refused.jsonl), model cost from
   usage.jsonl for this run, and anything that needs a human.
