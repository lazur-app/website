// @ts-check
/**
 * Roles the content planner discovered on its own (scripts/content/lib/pipeline.mjs planRoles).
 * Written by code, appended to ROLES in sources.mjs. Edit or delete entries freely.
 * @type {{ slug: string, name: string, singular: string, apps: string[], keywords: string[], discoveredAt?: string, why?: string }[]}
 */
export const DISCOVERED_ROLES = [
  {
    "slug": "property-managers",
    "name": "Property managers",
    "singular": "property manager",
    "apps": [
      "excel",
      "google-sheets",
      "gmail",
      "outlook"
    ],
    "keywords": [
      "ai assistant for property managers",
      "rent roll tracking software for landlords"
    ],
    "why": "Weak evidence: no primary survey of hours in software found. Secondhand NAA summary (not opened, unverified): ~60% log into 3+ tools daily; 42% of the week on routine admin. Vendor time-saving claims unverified.",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "paralegals",
    "name": "Paralegals",
    "singular": "paralegal",
    "apps": [
      "word",
      "outlook",
      "excel",
      "gmail"
    ],
    "keywords": [
      "ai tools for paralegals",
      "legal document review software for paralegals"
    ],
    "why": "BLS OOH (opened): 404,900 paralegals and legal assistants in 2025, little or no change (0%) through 2035; ~40,800 openings a year, mostly replacement; May 2025 median $62,890. bls.gov/ooh/legal/paralegals-and-legal-assistants.htm",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "ux-researchers",
    "name": "UX researchers",
    "singular": "UX researcher",
    "apps": [
      "figma",
      "google-sheets",
      "notion",
      "zoom"
    ],
    "keywords": [
      "ai tool for ux research synthesis",
      "user interview recruiting tool for ux researchers"
    ],
    "why": "Weak evidence: no BLS category and no primary tool-use survey found. Secondhand 2023 survey (original not located, not opened): User Interviews used for recruiting by 53%, Dovetail for repositories by 19%. Verify before use.",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "grant-writers",
    "name": "Grant writers",
    "singular": "grant writer",
    "apps": [
      "word",
      "google-docs",
      "excel",
      "gmail"
    ],
    "keywords": [
      "ai assistant for grant writers",
      "grant writing software for nonprofits"
    ],
    "why": "BLS does not track grant writers; its data is anecdotal (bls.gov/careeroutlook/2014/youre-a-what/grant-writer.htm, snippet only). BLS writers and authors, which excludes them (opened): 140,300 jobs in 2025, 0% change, median $76,910.",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "medical-billers",
    "name": "Medical billers",
    "singular": "medical biller",
    "apps": [
      "excel",
      "outlook",
      "word",
      "chrome"
    ],
    "keywords": [
      "ai tools for medical billers and coders",
      "medical billing software for small practices"
    ],
    "why": "BLS does not count billers separately; they sit under medical records specialists. Secondhand: May 2025 median $51,140, May 2024 $50,250 (BLS page returned 403, unverified). One site says $46,660 for 2024; sources conflict.",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "social-media-managers",
    "name": "Social media managers",
    "singular": "social media manager",
    "apps": [
      "canva",
      "chrome",
      "slack",
      "chatgpt"
    ],
    "keywords": [
      "ai tools for social media managers",
      "social media scheduling tool for small teams"
    ],
    "why": "Secondhand Sprout Social survey of 500+ marketers (Dec 2023, not opened): content creation and approvals ~5 hrs/week, reporting 3.8, trend monitoring 2.8. Hootsuite/Censuswide (June 2025): 43% spend 11+ hrs/week with AI tools. Partly overlaps marketers.",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "event-planners",
    "name": "Event planners",
    "singular": "event planner",
    "apps": [
      "google-sheets",
      "gmail",
      "canva",
      "slack"
    ],
    "keywords": [
      "ai assistant for event planners",
      "event planning software for small agencies"
    ],
    "why": "Weak evidence: no independent hours survey found. Only figure is an unsourced vendor claim (Joi): 20+ hours building programs in spreadsheets. Free Excel and Sheets template ecosystem suggests spreadsheets are the default tool. Not opened.",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "executive-assistants",
    "name": "Executive assistants",
    "singular": "executive assistant",
    "apps": [
      "outlook",
      "word",
      "excel",
      "zoom"
    ],
    "keywords": [
      "ai assistant for executive assistants",
      "calendar management tool for executive assistants"
    ],
    "why": "Vimcal 2026 report (opened): 600 EAs surveyed Aug 14-31, 2025; self-selected, 77% US. Top time sink: scheduling and calendar 29.3%, email and communication 21.5%, projects 16.3%. vimcal.com/ea/2026-report",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "customer-success-managers",
    "name": "Customer success managers",
    "singular": "customer success manager",
    "apps": [
      "gmail",
      "slack",
      "chrome",
      "google-sheets"
    ],
    "keywords": [
      "ai tools for customer success managers",
      "customer health score software for csms"
    ],
    "why": "Weak evidence: no survey of email or CRM hours found. Bain CS practitioner survey (235 people, Aug 2025), secondhand via a blog: ~65% of CSM time is lower-value work AI could automate. Rework narrative: 5-6 tools, 45 min/day lost to switching.",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "hr-generalists",
    "name": "HR generalists",
    "singular": "HR generalist",
    "apps": [
      "excel",
      "gmail",
      "word",
      "slack"
    ],
    "keywords": [
      "ai assistant for hr generalists",
      "hr admin automation for small companies"
    ],
    "why": "Weak evidence: no SHRM primary survey opened. Secondhand SHRM Labs (2024): automating admin work saved HR staff 7+ hours a week; 56% of HR leaders say their tech does not fit their needs. Unverified; check shrm.org.",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "data-analysts",
    "name": "Data analysts",
    "singular": "data analyst",
    "apps": [
      "excel",
      "google-sheets",
      "chatgpt",
      "vs-code"
    ],
    "keywords": [
      "ai assistant for data analysts",
      "sql and spreadsheet tools for data analysts"
    ],
    "why": "BLS has no data analyst category; pay figures are proxies from secondhand sites. Operations research analysts $91,290 and data scientists $112,590 (May 2024, unopened). A later source gives $120,230 for data scientists (May 2025). Weak evidence on tool use.",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "journalists",
    "name": "Journalists",
    "singular": "journalist",
    "apps": [
      "google-docs",
      "word",
      "chrome",
      "slack"
    ],
    "keywords": [
      "ai tools for journalists and reporters",
      "transcription software for reporters"
    ],
    "why": "BLS OOH (opened): 47,100 news analysts, reporters and journalists in 2025, projected -6% for 2025-35; May 2025 median $62,200. Payroll-only BLS series differs (secondhand 39,250). bls.gov/ooh/media-and-communication/reporters-correspondents-and-broadcast-news-analysts.htm",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "translators",
    "name": "Translators",
    "singular": "translator",
    "apps": [
      "word",
      "google-docs",
      "chrome",
      "apple-mail"
    ],
    "keywords": [
      "ai tools for freelance translators",
      "translation memory software for translators"
    ],
    "why": "BLS OOH (opened), interpreters and translators combined: 73,900 jobs in 2025, +2% for 2025-35, May 2025 median $60,170. Interpreters often work on-site, so the laptop share is lower. bls.gov/ooh/media-and-communication/interpreters-and-translators.htm",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "insurance-agents",
    "name": "Insurance agents",
    "singular": "insurance agent",
    "apps": [
      "outlook",
      "excel",
      "word",
      "chrome"
    ],
    "keywords": [
      "ai assistant for insurance agents",
      "agency management software for insurance agents"
    ],
    "why": "BLS OOH (opened): 572,600 insurance sales agents in 2025, +3% for 2025-35 (as fast as average), May 2025 median $62,280. Stable rather than growing. bls.gov/ooh/sales/insurance-sales-agents.htm",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "video-editors",
    "name": "Video editors",
    "singular": "video editor",
    "apps": [
      "finder",
      "chrome",
      "slack",
      "google-docs"
    ],
    "keywords": [
      "ai tools for video editors",
      "video editing software for freelance editors"
    ],
    "why": "Weak evidence: no usage-time survey found. Market-share estimates (Premiere ~35%, Final Cut ~25%, DaVinci Resolve ~15%) are secondhand compiled figures, not opened. Sundance Institute 2025: 60% of entrant films used Premiere (secondhand).",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "procurement-specialists",
    "name": "Procurement specialists",
    "singular": "procurement specialist",
    "apps": [
      "excel",
      "outlook",
      "chrome",
      "slack"
    ],
    "keywords": [
      "ai assistant for procurement specialists",
      "supplier management software for buyers"
    ],
    "why": "BLS OOH (opened), buyers and purchasing agents (SOC 13-1020): 516,100 jobs in 2025, +6% for 2025-35 (faster than average), May 2025 median $77,710. bls.gov/ooh/business-and-financial/purchasing-managers-buyers-and-purchasing-agents.htm",
    "discoveredAt": "2026-11-06"
  },
  {
    "slug": "it-support-technicians",
    "name": "IT support technicians",
    "singular": "IT support technician",
    "apps": [
      "chrome",
      "slack",
      "finder",
      "chatgpt"
    ],
    "keywords": [
      "ai assistant for it help desk technicians",
      "ticketing software for it support teams"
    ],
    "why": "BLS OOH (opened), computer support specialists group: 903,100 jobs in 2025, -3% for 2025-35; May 2025 median $62,890. BLS ties the decline to automated tools such as chatbots, a demand risk. bls.gov/ooh/computer-and-information-technology/computer-support-specialists.htm",
    "discoveredAt": "2026-11-06"
  }
];
