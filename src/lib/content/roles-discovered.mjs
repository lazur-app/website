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
  },
  {
    "slug": "technical-writers",
    "name": "Technical writers",
    "singular": "technical writer",
    "apps": [
      "word",
      "google-docs",
      "notion",
      "chatgpt"
    ],
    "keywords": [
      "ai assistant for technical writers",
      "best tools for technical writers on mac"
    ],
    "why": "46,400 technical writers in 2025, median $90,390, +1% 2025-35; usually work in offices (bls.gov/ooh/media-and-communication/technical-writers.htm). Docs tool picks are my judgment, not sourced.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "freight-brokers",
    "name": "Freight brokers",
    "singular": "freight broker",
    "apps": [
      "excel",
      "google-sheets",
      "gmail",
      "chrome"
    ],
    "keywords": [
      "ai assistant for freight brokers",
      "freight broker load board software"
    ],
    "why": "BLS has no freight broker count. Proxy: 255,100 logisticians in 2025, median $82,320, +18% (bls.gov/ooh/business-and-financial/logisticians.htm). Email and spreadsheet use is my judgment, not sourced.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "insurance-claims-adjusters",
    "name": "Insurance claims adjusters",
    "singular": "insurance claims adjuster",
    "apps": [
      "outlook",
      "excel",
      "word",
      "chrome"
    ],
    "keywords": [
      "ai assistant for insurance claims adjusters",
      "claims adjuster report writing tool"
    ],
    "why": "389,700 jobs in 2025, median $78,020, -6% 2025-35 (bls.gov/ooh/business-and-financial/claims-adjusters-appraisers-examiners-and-investigators.htm). Glassdoor 2026: 98% of adjuster reviews mentioning AI put it in cons (progressiverobot.com/2026/08/31/insurance-claims-adjusters-really-hate-ai/).",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "financial-analysts",
    "name": "Financial analysts",
    "singular": "financial analyst",
    "apps": [
      "excel",
      "google-sheets",
      "powerpoint",
      "chatgpt"
    ],
    "keywords": [
      "ai assistant for financial analysts",
      "excel ai tool for financial analysts"
    ],
    "why": "443,100 jobs in 2025, median $103,570, +7% 2025-35 (bls.gov/ooh/business-and-financial/financial-analysts.htm). Excel and deck use is my judgment, not sourced.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "computer-systems-analysts",
    "name": "Computer systems analysts",
    "singular": "computer systems analyst",
    "apps": [
      "linear",
      "excel",
      "slack",
      "notion"
    ],
    "keywords": [
      "ai assistant for systems analysts",
      "requirements documentation tool for business analysts"
    ],
    "why": "544,400 jobs in 2025, median $105,850, +8% 2025-35 (bls.gov/ooh/computer-and-information-technology/computer-systems-analysts.htm). The page does not say where they work; app picks are my judgment.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "public-relations-specialists",
    "name": "Public relations specialists",
    "singular": "public relations specialist",
    "apps": [
      "gmail",
      "powerpoint",
      "google-docs",
      "slack"
    ],
    "keywords": [
      "ai assistant for pr specialists",
      "press release writing tool for pr teams"
    ],
    "why": "314,500 jobs in 2025, median $74,750, +2% 2025-35 (bls.gov/ooh/media-and-communication/public-relations-specialists.htm). Pitching by email and Slack is my judgment, not sourced.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "instructional-designers",
    "name": "Instructional designers",
    "singular": "instructional designer",
    "apps": [
      "powerpoint",
      "google-docs",
      "canva",
      "zoom"
    ],
    "keywords": [
      "ai assistant for instructional designers",
      "course authoring tool for instructional designers"
    ],
    "why": "BLS has no instructional designer line. Closest: 248,700 instructional coordinators in 2025, median $77,440, +2% (bls.gov/ooh/education-training-and-library/instructional-coordinators.htm). Tool picks are my judgment.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "podcast-producers",
    "name": "Podcast producers",
    "singular": "podcast producer",
    "apps": [
      "zoom",
      "chatgpt",
      "gmail",
      "google-docs"
    ],
    "keywords": [
      "ai assistant for podcast producers",
      "podcast editing tool for producers on mac"
    ],
    "why": "No BLS count. Castos 2026 survey (99 creators): Audacity top editing tool 'by a significant margin'; ~half 'maybe', just over 40% 'no' to built-in tools (castos.com/podcast-production-in-2026-what-99-creators-told-us-about-recording-editing-and-video/). Small sample.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "photographers",
    "name": "Photographers",
    "singular": "photographer",
    "apps": [
      "photoshop",
      "canva",
      "finder",
      "gmail"
    ],
    "keywords": [
      "ai assistant for photographers",
      "photo editing tool for photographers on mac"
    ],
    "why": "145,000 jobs in 2025, median $44,660, -1% 2025-35; 67% self-employed (bls.gov/ooh/media-and-communication/photographers.htm). Lightroom, a common editor, is not in the app list.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "software-qa-testers",
    "name": "Software QA testers",
    "singular": "software QA tester",
    "apps": [
      "vs-code",
      "linear",
      "chrome",
      "slack"
    ],
    "keywords": [
      "ai assistant for qa testers",
      "test case writing tool for qa engineers"
    ],
    "why": "187,600 software QA analysts and testers in 2025, median $104,300, +6% 2025-35 (bls.gov/ooh/computer-and-information-technology/software-developers.htm). Tool picks are my judgment.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "architects",
    "name": "Architects",
    "singular": "architect",
    "apps": [
      "photoshop",
      "powerpoint",
      "excel",
      "gmail"
    ],
    "keywords": [
      "ai assistant for architects",
      "presentation tool for architecture firms"
    ],
    "why": "124,600 jobs in 2025, median $99,280, +4% 2025-35 (bls.gov/ooh/architecture-and-engineering/architects.htm). Revit and AutoCAD, their core tools, are not in the app list, so picks cover admin and presentations only.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "mortgage-loan-officers",
    "name": "Mortgage loan officers",
    "singular": "mortgage loan officer",
    "apps": [
      "excel",
      "gmail",
      "outlook",
      "chrome"
    ],
    "keywords": [
      "ai assistant for loan officers",
      "crm for mortgage loan officers"
    ],
    "why": "283,000 jobs in 2025, median $76,690, +1% 2025-35 (bls.gov/ooh/business-and-financial/loan-officers.htm). Search results named Encompass, Velocify and Jungo; I did not open those pages or confirm Mac support.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "nonprofit-fundraisers",
    "name": "Nonprofit fundraisers",
    "singular": "nonprofit fundraiser",
    "apps": [
      "gmail",
      "excel",
      "google-docs",
      "zoom"
    ],
    "keywords": [
      "ai assistant for nonprofit fundraisers",
      "donor research tool for fundraisers"
    ],
    "why": "140,900 fundraisers in 2025, median $72,550, +6%; they 'work primarily for nonprofit organizations' (bls.gov/ooh/business-and-financial/fundraisers.htm). Fundraising managers: 48,800 (bls.gov/ooh/management/public-relations-managers.htm).",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "account-executives",
    "name": "Account executives",
    "singular": "account executive",
    "apps": [
      "gmail",
      "slack",
      "zoom",
      "google-sheets"
    ],
    "keywords": [
      "ai assistant for account executives",
      "meeting prep tool for account executives"
    ],
    "why": "No BLS account executive line. Proxy: 1,571,400 wholesale and manufacturing sales reps in 2025, median $76,460, 0% growth (bls.gov/ooh/sales/wholesale-and-manufacturing-sales-representatives.htm). Proxy is imperfect.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "facilities-managers",
    "name": "Facilities managers",
    "singular": "facilities manager",
    "apps": [
      "excel",
      "outlook",
      "word",
      "gmail"
    ],
    "keywords": [
      "ai assistant for facilities managers",
      "work order tracking for facilities managers"
    ],
    "why": "165,900 facilities managers in 2025, median $106,660; combined admin services and facilities group +5% (bls.gov/ooh/management/administrative-services-managers.htm). Other sources give lower counts; I did not verify them.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "hotel-revenue-managers",
    "name": "Hotel revenue managers",
    "singular": "hotel revenue manager",
    "apps": [
      "excel",
      "google-sheets",
      "gmail",
      "chrome"
    ],
    "keywords": [
      "ai assistant for hotel revenue managers",
      "forecasting tool for hotel revenue managers"
    ],
    "why": "No BLS revenue manager line. Proxy: 54,800 lodging managers in 2025, median $69,250, +4% (bls.gov/ooh/management/lodging-managers.htm). Forecasting and Excel use come from unopened search results, so unverified.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "supply-chain-planners",
    "name": "Supply chain planners",
    "singular": "supply chain planner",
    "apps": [
      "excel",
      "google-sheets",
      "outlook",
      "slack"
    ],
    "keywords": [
      "ai assistant for supply chain planners",
      "demand planning spreadsheet for supply chain planners"
    ],
    "why": "255,100 logisticians in 2025, median $82,320, +18% 2025-35, the fastest growth in this list (bls.gov/ooh/business-and-financial/logisticians.htm). Planning tool picks are my judgment, not sourced.",
    "discoveredAt": "2026-11-07"
  },
  {
    "slug": "project-managers",
    "name": "Project managers",
    "singular": "project manager",
    "apps": [
      "excel",
      "google-sheets",
      "slack",
      "powerpoint"
    ],
    "keywords": [
      "ai assistant for project managers",
      "project status report template",
      "project plan spreadsheet tool"
    ],
    "why": "BLS: about 1.1 million project management specialists in 2025, median pay $102,320 (https://www.bls.gov/ooh/business-and-financial/project-management-specialists.htm, opened). Tool roundups disagree on leaders; no survey of PM tool use found.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "business-analysts",
    "name": "Business analysts",
    "singular": "business analyst",
    "apps": [
      "excel",
      "word",
      "powerpoint",
      "slack"
    ],
    "keywords": [
      "ai assistant for business analysts",
      "requirements document ai tool",
      "business analysis tools mac"
    ],
    "why": "Visio is Windows-only, so Mac users lean on web tools like Lucidchart and Confluence (https://www.aitooldiscovery.com/guides/best-ai-tools-for-business-analyst-reddit, third-party summary). No usage survey found.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "bookkeepers",
    "name": "Bookkeepers",
    "singular": "bookkeeper",
    "apps": [
      "excel",
      "google-sheets",
      "gmail",
      "chrome"
    ],
    "keywords": [
      "ai assistant for bookkeepers",
      "bookkeeping software for mac",
      "receipt capture tool for bookkeepers"
    ],
    "why": "BLS: 1.5 million bookkeeping clerks (2025), median pay $50,670 (https://www.bls.gov/ooh/office-and-administrative-support/bookkeeping-accounting-and-auditing-clerks.htm). Forums favor browser tools like Xero (https://chieftalk.chiefarchitect.com/topic/16669-accountingbookkeeping-software-for-mac/).",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "urban-planners",
    "name": "Urban planners",
    "singular": "urban planner",
    "apps": [
      "powerpoint",
      "word",
      "excel",
      "chrome"
    ],
    "keywords": [
      "ai assistant for urban planners",
      "ai planning staff report drafting",
      "urban planning tools ai"
    ],
    "why": "APA survey (396 responses): 47% rated their AI experience at the lowest level, yet over 70% expect AI to affect the profession (https://www.planning.org/publications/report/9270237/, snippet). Report-drafting tools are mostly vendor claims; a Finnish Delphi of 34 planners is small.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "interior-designers",
    "name": "Interior designers",
    "singular": "interior designer",
    "apps": [
      "figma",
      "photoshop",
      "powerpoint",
      "gmail"
    ],
    "keywords": [
      "ai assistant for interior designers",
      "interior design software mac",
      "room layout ai tool"
    ],
    "why": "No survey found. Roundups name SketchUp, Sweet Home 3D, AutoCAD and Revit as main tools (https://www.careers360.com/question-what-are-the-best-interior-design-tools-and-software, snippet). Weakest evidence in this set; verify before use.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "illustrators",
    "name": "Illustrators",
    "singular": "illustrator",
    "apps": [
      "photoshop",
      "figma",
      "canva",
      "chrome"
    ],
    "keywords": [
      "ai assistant for illustrators",
      "illustration software for mac",
      "client file export tool for illustrators"
    ],
    "why": "Procreate is iPad-only, so Mac-based illustrators use Photoshop or Affinity; many sketch in Procreate then finish in Photoshop (https://outterapps.com/posts/is-procreate-on-ipad-actually-replacing-desktop-photoshop-for-freelanc/, snippet). No survey of illustrators found.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "animators",
    "name": "Animators",
    "singular": "animator",
    "apps": [
      "photoshop",
      "chrome",
      "zoom",
      "slack"
    ],
    "keywords": [
      "ai assistant for animators",
      "animation software for mac",
      "animation storyboard tool"
    ],
    "why": "GummySearch analysed 219 Reddit reviews across 24 subreddits and ranked Blender first at 4.7/5. This is a review count, not a poll (https://gummysearch.com/tools/best-products/animation-software/, snippet). Mac-laptop data for animators is thin.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "music-producers",
    "name": "Music producers",
    "singular": "music producer",
    "apps": [
      "chrome",
      "slack",
      "gmail",
      "finder"
    ],
    "keywords": [
      "ai assistant for music producers",
      "mac music production software",
      "mixing and mastering ai tool"
    ],
    "why": "Sleepfreaks 2025 survey (3,222 producers): Logic Pro, Mac-only, had 18.1%, third behind Cubase and Studio One (https://sleepfreaks-dtm.com/en/dtm-materials/daw-ranking-2025/, snippet). Shares vary between surveys.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "game-designers",
    "name": "Game designers",
    "singular": "game designer",
    "apps": [
      "figma",
      "notion",
      "google-sheets",
      "slack"
    ],
    "keywords": [
      "ai assistant for game designers",
      "game design documentation tool",
      "game balance spreadsheet tool"
    ],
    "why": "Indie guides pair Notion, Figma and Google Sheets (https://dev.to/hiroshi_takamura_c851fe71/best-game-design-tools-for-indie-and-mobile-game-designers-4kpj, vendor-influenced). ADPList 2025: 93% use Figma (https://adplist.substack.com/p/the-state-of-design-tools-2025).",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "data-scientists",
    "name": "Data scientists",
    "singular": "data scientist",
    "apps": [
      "vs-code",
      "cursor",
      "chatgpt",
      "excel"
    ],
    "keywords": [
      "ai assistant for data scientists",
      "jupyter notebook ai tool",
      "python data analysis mac"
    ],
    "why": "Kaggle 2020 survey: about three-quarters used Jupyter-based IDEs; VS Code was second at about 33% (https://visualstudiomagazine.com/articles/2021/02/09/kaggle-survey.aspx, snippet). About five years old; no 2025-26 share found.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "speechwriters",
    "name": "Speechwriters",
    "singular": "speechwriter",
    "apps": [
      "word",
      "google-docs",
      "chatgpt",
      "apple-mail"
    ],
    "keywords": [
      "ai assistant for speechwriters",
      "speech drafting ai tool",
      "speechwriting ai do and don't"
    ],
    "why": "Toastmasters (Apr 2026): ChatGPT, Claude, Copilot and Gemini are standard speech-prep aids, but can agree too readily and make things up (https://www.toastmasters.org/magazine/magazine-issues/2026/april/dos-and-donts-of-using-ai-in-speechwriting). No speechwriter survey found.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "literary-agents",
    "name": "Literary agents",
    "singular": "literary agent",
    "apps": [
      "gmail",
      "word",
      "google-sheets",
      "chrome"
    ],
    "keywords": [
      "ai assistant for literary agents",
      "query letter management tool",
      "manuscript submission tracker"
    ],
    "why": "Weak evidence: the sources cover writers researching agents in QueryTracker, not agents' own work (https://granger.substack.com/p/querying-literary-agents-is-not-fun, snippet). No survey of agents' tool use found.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "book-editors",
    "name": "Book editors",
    "singular": "book editor",
    "apps": [
      "word",
      "google-docs",
      "pages",
      "apple-mail"
    ],
    "keywords": [
      "ai assistant for book editors",
      "manuscript editing software mac",
      "track changes workflow for editors"
    ],
    "why": "Several author guides say editors expect Word with Track Changes, and writers often draft in Scrivener then export to Word (https://thewritepractice.com/best-book-writing-software/, snippet). Guides list Scrivener at $59.99 but one listing differs. No freelance-editor survey found.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "operations-managers",
    "name": "Operations managers",
    "singular": "operations manager",
    "apps": [
      "excel",
      "slack",
      "google-sheets",
      "powerpoint"
    ],
    "keywords": [
      "ai assistant for operations managers",
      "operations reporting tool",
      "operations management software mac"
    ],
    "why": "Weak evidence: the only survey hit is a 2017 project-manager study (https://www.slideshare.net/MicheleTaverna1/best-tools-for-project-management, snippet). Excel and Slack appear in vendor lists, which are marketing-influenced.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "sales-development-representatives",
    "name": "Sales development representatives",
    "singular": "sales development representative",
    "apps": [
      "gmail",
      "chrome",
      "slack",
      "google-sheets"
    ],
    "keywords": [
      "ai assistant for sdrs",
      "gmail prospecting extension",
      "sales outreach tool for sdrs"
    ],
    "why": "SDR tooling is Gmail- and Chrome-first: Mixmax, Streak, YAMM, HubSpot Sales and Apollo are the most listed options (https://addtocrm.com/tools/best-gmail-extensions-for-sales, snippet). Vendor roundups; no survey found.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "medical-writers",
    "name": "Medical writers",
    "singular": "medical writer",
    "apps": [
      "word",
      "excel",
      "google-docs",
      "pages"
    ],
    "keywords": [
      "ai assistant for medical writers",
      "medical writing software mac",
      "clinical document ai tool"
    ],
    "why": "AMWA blog on a 2024 survey of 291 freelance medical communicators (https://blog.amwa.org/the-home-office-toolkit-software-for-freelance-medical-communicators). A 2016 compilation names Word most common (https://6weekcourse.com/wp-content/uploads/2016/04/2016-UsefulSoftwareandEquipment.pdf). Dated.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "economists",
    "name": "Economists",
    "singular": "economist",
    "apps": [
      "excel",
      "word",
      "chatgpt",
      "chrome"
    ],
    "keywords": [
      "ai assistant for economists",
      "economic research ai tool",
      "econometrics ai assistant"
    ],
    "why": "AEA's Aug 2025 update says agentic AI is production-ready for daily economic research (https://www.aeaweb.org/content/file?id=23290, snippet). A think-aloud study finds researchers keep judgement on identification and interpretation (https://arxiv.org/pdf/2604.23136, snippet). No usage share found.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "policy-analysts",
    "name": "Policy analysts",
    "singular": "policy analyst",
    "apps": [
      "word",
      "powerpoint",
      "chatgpt",
      "chrome"
    ],
    "keywords": [
      "ai assistant for policy analysts",
      "policy memo ai tool",
      "think tank research ai"
    ],
    "why": "UK study: 554 people at 94 think tanks were invited to a 2024 survey. GenAI plays a small role, mainly summarising publications (https://link.springer.com/article/10.1007/s00146-026-03084-9, snippet). Response count not confirmed; a SkillSeek 42% claim could not be verified.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "investor-relations-officers",
    "name": "Investor relations officers",
    "singular": "investor relations officer",
    "apps": [
      "powerpoint",
      "excel",
      "outlook",
      "zoom"
    ],
    "keywords": [
      "ai assistant for investor relations",
      "earnings prep ai tool",
      "investor relations software mac"
    ],
    "why": "NIRI/Korn Ferry 2022 survey drew 397 IR professionals; NIRI and UF also ran an AI-in-IR survey. Most reports are member-only (https://www.niri.org/publications/research/, snippet).",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "internal-auditors",
    "name": "Internal auditors",
    "singular": "internal auditor",
    "apps": [
      "excel",
      "word",
      "outlook",
      "chatgpt"
    ],
    "keywords": [
      "ai assistant for internal auditors",
      "audit workpaper ai tool",
      "internal audit software mac"
    ],
    "why": "Under 40% of 370+ audit leaders feel ready for AI-enabled fraud; 57% cite lack of tools (https://www.theiia.org/en/content/communications/press-releases/2026/new-survey-from-the-iia-and-auditboard-report-reveals-growing-awareness-of-ai-enabled-fraud-varying-perception-of-audit-preparedness/).",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "agile-coaches",
    "name": "Agile coaches",
    "singular": "agile coach",
    "apps": [
      "notion",
      "slack",
      "zoom",
      "linear"
    ],
    "keywords": [
      "ai assistant for agile coaches",
      "retrospective facilitation tool",
      "agile coaching tools mac"
    ],
    "why": "Agile coaches on AWS Marketplace say Miro runs retros and workshops; Miro's two-way tracker sync needs a paid Business plan (https://clickup.com/blog/agile-tools/, snippet). Miro is not on the app list. No survey found.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "ediscovery-specialists",
    "name": "eDiscovery specialists",
    "singular": "eDiscovery specialist",
    "apps": [
      "excel",
      "outlook",
      "word",
      "chrome"
    ],
    "keywords": [
      "ai assistant for ediscovery specialists",
      "ediscovery review tool",
      "legal document review ai"
    ],
    "why": "G2's 2026 roundup calls Relativity the closest thing to an eDiscovery default (https://learn.g2.com/best-ediscovery-software, snippet). Relativity's guide says search results export to Excel (Relativity Searching Guide, p.31, not opened). No usage survey found.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "compliance-officers",
    "name": "Compliance officers",
    "singular": "compliance officer",
    "apps": [
      "excel",
      "word",
      "outlook",
      "slack"
    ],
    "keywords": [
      "ai assistant for compliance officers",
      "regulatory compliance ai tool",
      "compliance workload software"
    ],
    "why": "Regology 2025 survey: 92% say their roles got harder; 77% still run manual processes; median team size is four (https://www.regology.com/blog/state-of-regulatory-compliance-in-2025-survey-results, snippet). EY: 47% cite lack of time as the main barrier to tech adoption.",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "documentary-filmmakers",
    "name": "Documentary filmmakers",
    "singular": "documentary filmmaker",
    "apps": [
      "chrome",
      "slack",
      "gmail",
      "finder"
    ],
    "keywords": [
      "ai assistant for documentary filmmakers",
      "documentary editing software mac",
      "documentary production tools"
    ],
    "why": "IDA gear survey (2019, 286 Part II respondents): about 75% edited their latest film on a Mac; Premiere Pro led editing (https://www.documentary.org/feature/tools-trade-documentary-makers-talk-gear, snippet, dated; source mapping unverified).",
    "discoveredAt": "2026-11-08"
  },
  {
    "slug": "travel-agents",
    "name": "Travel agents",
    "singular": "travel agent",
    "apps": [
      "excel",
      "outlook",
      "chrome",
      "zoom"
    ],
    "keywords": [
      "travel agency itinerary software",
      "automation tools for travel agents"
    ],
    "why": "Travel agents manage complex bookings and client communications, frequently searching for ways to optimize reservation workflows.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "real-estate-appraisers",
    "name": "Real estate appraisers",
    "singular": "real estate appraiser",
    "apps": [
      "excel",
      "word",
      "chrome"
    ],
    "keywords": [
      "real estate appraisal report software",
      "property valuation tools"
    ],
    "why": "Appraisers spend their day creating detailed valuation reports that require specific document formatting and data manipulation.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "clinical-research-coordinators",
    "name": "Clinical research coordinators",
    "singular": "clinical research coordinator",
    "apps": [
      "excel",
      "google-sheets",
      "outlook",
      "word"
    ],
    "keywords": [
      "clinical trial data management software",
      "research documentation tools"
    ],
    "why": "They must maintain rigorous compliance and data accuracy, often seeking software solutions for patient tracking and reporting.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "medical-transcriptionists",
    "name": "Medical transcriptionists",
    "singular": "medical transcriptionist",
    "apps": [
      "word",
      "gmail",
      "chrome"
    ],
    "keywords": [
      "medical transcription software tools",
      "audio to text workflow optimization"
    ],
    "why": "Transcriptionists rely heavily on text editors and audio playback software, frequently looking for AI-assisted typing tools.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "payroll-specialists",
    "name": "Payroll specialists",
    "singular": "payroll specialist",
    "apps": [
      "excel",
      "google-sheets",
      "outlook"
    ],
    "keywords": [
      "payroll processing software help",
      "automated payroll reporting tools"
    ],
    "why": "Payroll processing is highly repetitive and error-sensitive, leading to high search volume for spreadsheet automation.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "logistics-coordinators",
    "name": "Logistics coordinators",
    "singular": "logistics coordinator",
    "apps": [
      "excel",
      "slack",
      "chrome",
      "gmail"
    ],
    "keywords": [
      "logistics tracking software help",
      "supply chain management tools"
    ],
    "why": "They constantly monitor shipments and communicate with carriers, requiring efficient software to handle high volumes of tracking data.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "curriculum-developers",
    "name": "Curriculum developers",
    "singular": "curriculum developer",
    "apps": [
      "google-docs",
      "canva",
      "notion",
      "zoom"
    ],
    "keywords": [
      "curriculum design software tools",
      "educational content creation help"
    ],
    "why": "They create extensive educational materials and frequently look for layout and project management software to organize course content.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "tax-preparers",
    "name": "Tax preparers",
    "singular": "tax preparer",
    "apps": [
      "excel",
      "outlook",
      "chrome"
    ],
    "keywords": [
      "tax return software help",
      "data entry automation for tax prep"
    ],
    "why": "Tax preparers handle high-stakes financial documentation and often search for ways to streamline data input into tax forms.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "content-strategists",
    "name": "Content strategists",
    "singular": "content strategist",
    "apps": [
      "notion",
      "google-docs",
      "slack",
      "chrome"
    ],
    "keywords": [
      "content calendar management tools",
      "content strategy workflow software"
    ],
    "why": "They manage elaborate editorial calendars and require organizational software to track content production cycles.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "customer-support-leads",
    "name": "Customer support leads",
    "singular": "customer support lead",
    "apps": [
      "slack",
      "gmail",
      "chrome",
      "zoom"
    ],
    "keywords": [
      "customer support ticket management",
      "help desk software optimization"
    ],
    "why": "They manage large volumes of customer queries and search for tools to improve response times and ticket organization.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "digital-media-buyers",
    "name": "Digital media buyers",
    "singular": "digital media buyer",
    "apps": [
      "excel",
      "google-sheets",
      "chrome"
    ],
    "keywords": [
      "ad campaign tracking software",
      "media buying data analysis tools"
    ],
    "why": "They deal with complex spreadsheet data to track ad spend and performance, searching for automation to handle reporting.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "legal-assistants",
    "name": "Legal assistants",
    "singular": "legal assistant",
    "apps": [
      "word",
      "outlook",
      "google-docs",
      "slack"
    ],
    "keywords": [
      "legal document management software",
      "case file organization tools"
    ],
    "why": "Legal assistants manage high volumes of documentation and often look for ways to index and search files more efficiently.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "nonprofit-program-coordinators",
    "name": "Nonprofit program coordinators",
    "singular": "nonprofit program coordinator",
    "apps": [
      "google-docs",
      "gmail",
      "notion"
    ],
    "keywords": [
      "nonprofit program management software",
      "volunteer coordination tools"
    ],
    "why": "They juggle multiple administrative tasks and require organizational tools to manage program outcomes and donor communications.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "technical-recruiters",
    "name": "Technical recruiters",
    "singular": "technical recruiter",
    "apps": [
      "slack",
      "gmail",
      "chrome",
      "notion"
    ],
    "keywords": [
      "candidate tracking system help",
      "automated sourcing tools for recruiters"
    ],
    "why": "They spend their day searching for talent and managing pipelines, often seeking software to automate candidate outreach.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "social-media-analysts",
    "name": "Social media analysts",
    "singular": "social media analyst",
    "apps": [
      "google-sheets",
      "chrome",
      "canva"
    ],
    "keywords": [
      "social media reporting tools",
      "analytics dashboard software help"
    ],
    "why": "They spend hours aggregating data from various platforms and look for tools to simplify report generation.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "estate-planners",
    "name": "Estate planners",
    "singular": "estate planner",
    "apps": [
      "word",
      "excel",
      "outlook"
    ],
    "keywords": [
      "estate planning documentation software",
      "client data management for lawyers"
    ],
    "why": "They manage sensitive legal and financial documents, requiring specialized software for document generation and tracking.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "community-managers",
    "name": "Community managers",
    "singular": "community manager",
    "apps": [
      "slack",
      "notion",
      "gmail",
      "chrome"
    ],
    "keywords": [
      "community engagement platform tools",
      "online community management software"
    ],
    "why": "They manage interactions across multiple platforms and search for tools to streamline communication and moderation.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "seo-specialists",
    "name": "SEO specialists",
    "singular": "seo specialist",
    "apps": [
      "google-sheets",
      "chrome",
      "notion"
    ],
    "keywords": [
      "seo reporting software help",
      "keyword research automation tools"
    ],
    "why": "They depend heavily on data analysis and search for software that can automate keyword tracking and site auditing.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "virtual-assistants",
    "name": "Virtual assistants",
    "singular": "virtual assistant",
    "apps": [
      "gmail",
      "google-docs",
      "slack",
      "zoom"
    ],
    "keywords": [
      "virtual assistant task management tools",
      "remote office automation software"
    ],
    "why": "They handle diverse tasks for multiple clients and constantly look for software to improve efficiency and organization.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "copy-editors",
    "name": "Copy editors",
    "singular": "copy editor",
    "apps": [
      "word",
      "google-docs",
      "chrome"
    ],
    "keywords": [
      "copy editing software tools",
      "automated proofreading help"
    ],
    "why": "They spend the entire day in text processors and often search for advanced grammar and consistency-checking tools.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "b2b-sales-reps",
    "name": "B2B sales reps",
    "singular": "b2b sales rep",
    "apps": [
      "gmail",
      "slack",
      "chrome",
      "excel"
    ],
    "keywords": [
      "sales pipeline management software",
      "email automation tools for sales"
    ],
    "why": "They manage long sales cycles and search for software to automate follow-ups and track prospect engagement.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "research-librarians",
    "name": "Research librarians",
    "singular": "research librarian",
    "apps": [
      "chrome",
      "word",
      "google-sheets"
    ],
    "keywords": [
      "academic database management tools",
      "research organization software"
    ],
    "why": "They manage vast amounts of information and search for tools to better index and retrieve research materials.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "hr-compliance-specialists",
    "name": "HR compliance specialists",
    "singular": "hr compliance specialist",
    "apps": [
      "excel",
      "word",
      "outlook"
    ],
    "keywords": [
      "hr compliance tracking software",
      "employee record management tools"
    ],
    "why": "They handle highly regulated documentation and seek software to ensure compliance and audit readiness.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "grant-administrators",
    "name": "Grant administrators",
    "singular": "grant administrator",
    "apps": [
      "excel",
      "word",
      "google-docs"
    ],
    "keywords": [
      "grant management software help",
      "compliance reporting tools"
    ],
    "why": "They must track grant funding and reporting requirements, often searching for specialized project management software.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "media-planners",
    "name": "Media planners",
    "singular": "media planner",
    "apps": [
      "excel",
      "google-sheets",
      "chrome"
    ],
    "keywords": [
      "media planning software tools",
      "advertising budget management help"
    ],
    "why": "They manage complex advertising schedules and budgets, requiring robust spreadsheet and planning software.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "it-project-coordinators",
    "name": "IT project coordinators",
    "singular": "it project coordinator",
    "apps": [
      "linear",
      "slack",
      "notion",
      "vs-code"
    ],
    "keywords": [
      "it project management software",
      "agile workflow tools for it"
    ],
    "why": "They coordinate technical teams and search for software that integrates well with development environments.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "medical-coders",
    "name": "Medical coders",
    "singular": "medical coder",
    "apps": [
      "excel",
      "word",
      "chrome"
    ],
    "keywords": [
      "medical coding software help",
      "billing code lookup tools"
    ],
    "why": "They translate medical services into codes and frequently look for software to improve lookup speed and accuracy.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "academic-advisors",
    "name": "Academic advisors",
    "singular": "academic advisor",
    "apps": [
      "outlook",
      "google-sheets",
      "zoom"
    ],
    "keywords": [
      "student advising software tools",
      "scheduling automation for advisors"
    ],
    "why": "They manage large student caseloads and search for tools to organize appointments and track student progress.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "public-policy-advocates",
    "name": "Public policy advocates",
    "singular": "public policy advocate",
    "apps": [
      "word",
      "google-docs",
      "gmail"
    ],
    "keywords": [
      "policy tracking software tools",
      "advocacy campaign management"
    ],
    "why": "They track legislative changes and manage communication efforts, often looking for software to organize research and outreach.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "procurement-analysts",
    "name": "Procurement analysts",
    "singular": "procurement analyst",
    "apps": [
      "excel",
      "google-sheets",
      "outlook"
    ],
    "keywords": [
      "procurement data analysis software",
      "vendor management tools"
    ],
    "why": "They analyze supply chains and vendor costs, searching for software to automate data visualization and reporting.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "technical-support-specialists",
    "name": "Technical support specialists",
    "singular": "technical support specialist",
    "apps": [
      "slack",
      "chrome",
      "zoom"
    ],
    "keywords": [
      "remote support software help",
      "troubleshooting documentation tools"
    ],
    "why": "They resolve technical issues and require efficient tools for ticket management and remote desktop access.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "data-entry-clerks",
    "name": "Data entry clerks",
    "singular": "data entry clerk",
    "apps": [
      "excel",
      "google-sheets",
      "word"
    ],
    "keywords": [
      "data entry automation software",
      "spreadsheet efficiency tools"
    ],
    "why": "Their work is entirely focused on data input, leading to a constant search for software that speeds up typing and validation.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "financial-planners",
    "name": "Financial planners",
    "singular": "financial planner",
    "apps": [
      "excel",
      "outlook",
      "chrome"
    ],
    "keywords": [
      "financial planning software help",
      "client portfolio management tools"
    ],
    "why": "They manage client wealth and search for software that simplifies complex financial modeling and reporting.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "museum-curators",
    "name": "Museum curators",
    "singular": "museum curator",
    "apps": [
      "notion",
      "word",
      "chrome"
    ],
    "keywords": [
      "collection management software",
      "curatorial research tools"
    ],
    "why": "They manage large databases of artifacts and research, often searching for better ways to catalog and display information.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "compliance-analysts",
    "name": "Compliance analysts",
    "singular": "compliance analyst",
    "apps": [
      "excel",
      "word",
      "outlook"
    ],
    "keywords": [
      "compliance monitoring software",
      "audit trail management tools"
    ],
    "why": "They monitor organizational processes for regulatory adherence and need software to track and report on compliance metrics.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "marketing-operations-managers",
    "name": "Marketing operations managers",
    "singular": "marketing operations manager",
    "apps": [
      "notion",
      "slack",
      "google-sheets",
      "chrome"
    ],
    "keywords": [
      "marketing automation platform help",
      "marketing workflow software"
    ],
    "why": "They build and maintain the tech stack for marketing teams, frequently searching for software integrations and workflow tools.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "clinical-data-managers",
    "name": "Clinical data managers",
    "singular": "clinical data manager",
    "apps": [
      "excel",
      "google-sheets",
      "word"
    ],
    "keywords": [
      "clinical data management software",
      "data validation tools"
    ],
    "why": "They ensure the integrity of clinical trial data and often search for software to automate data cleaning and verification.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "corporate-trainers",
    "name": "Corporate trainers",
    "singular": "corporate trainer",
    "apps": [
      "powerpoint",
      "keynote",
      "zoom",
      "canva"
    ],
    "keywords": [
      "training material creation software",
      "e-learning development tools"
    ],
    "why": "They create and deliver training programs, often looking for software to improve presentation design and engagement.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "logistics-analysts",
    "name": "Logistics analysts",
    "singular": "logistics analyst",
    "apps": [
      "excel",
      "google-sheets",
      "chrome"
    ],
    "keywords": [
      "logistics optimization software",
      "supply chain data analysis tools"
    ],
    "why": "They analyze shipping and inventory data to improve efficiency, frequently searching for advanced spreadsheet and modeling tools.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "risk-management-specialists",
    "name": "Risk management specialists",
    "singular": "risk management specialist",
    "apps": [
      "excel",
      "word",
      "outlook"
    ],
    "keywords": [
      "risk assessment software tools",
      "enterprise risk management help"
    ],
    "why": "They model and mitigate organizational risks, requiring specialized software for data tracking and reporting.",
    "discoveredAt": "2026-11-13"
  },
  {
    "slug": "inventory-planners",
    "name": "Inventory planners",
    "singular": "inventory planner",
    "apps": [
      "excel",
      "google-sheets",
      "slack",
      "gmail"
    ],
    "keywords": [
      "inventory spreadsheet automation",
      "demand forecasting tools"
    ],
    "why": "Inventory planners spend their entire day managing stock levels in complex spreadsheets and require constant communication with suppliers via email and chat.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "real-estate-analysts",
    "name": "Real estate analysts",
    "singular": "real estate analyst",
    "apps": [
      "excel",
      "google-sheets",
      "powerpoint",
      "outlook"
    ],
    "keywords": [
      "real estate financial modeling",
      "property valuation template"
    ],
    "why": "They rely heavily on advanced Excel modeling to value properties and create investment decks for stakeholders.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "customer-onboarding-specialists",
    "name": "Customer onboarding specialists",
    "singular": "customer onboarding specialist",
    "apps": [
      "notion",
      "zoom",
      "slack",
      "gmail"
    ],
    "keywords": [
      "onboarding workflow automation",
      "client training documentation"
    ],
    "why": "They manage high volumes of new client setups, needing to document processes in Notion and conduct live training sessions over Zoom.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "media-buyers",
    "name": "Media buyers",
    "singular": "media buyer",
    "apps": [
      "excel",
      "google-sheets",
      "slack",
      "chrome"
    ],
    "keywords": [
      "ad spend tracking",
      "media buying spreadsheet template"
    ],
    "why": "Media buyers spend their day analyzing ad performance data in spreadsheets and adjusting live campaigns in browser-based ad platforms.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "technical-account-managers",
    "name": "Technical account managers",
    "singular": "technical account manager",
    "apps": [
      "slack",
      "zoom",
      "notion",
      "gmail"
    ],
    "keywords": [
      "technical account management workflows",
      "client issue tracking"
    ],
    "why": "They bridge the gap between technical teams and clients, requiring heavy use of documentation tools and communication platforms.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "compensation-analysts",
    "name": "Compensation analysts",
    "singular": "compensation analyst",
    "apps": [
      "excel",
      "google-sheets",
      "word",
      "outlook"
    ],
    "keywords": [
      "salary benchmarking tools",
      "compensation data analysis"
    ],
    "why": "They work with highly sensitive salary data, requiring advanced spreadsheet skills to perform market benchmarking and internal equity analysis.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "patient-care-coordinators",
    "name": "Patient care coordinators",
    "singular": "patient care coordinator",
    "apps": [
      "gmail",
      "outlook",
      "excel",
      "zoom"
    ],
    "keywords": [
      "patient scheduling software",
      "medical appointment tracking"
    ],
    "why": "They coordinate complex patient schedules and communicate with insurance providers, spending the day moving between email and scheduling software.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "e-commerce-merchandisers",
    "name": "E-commerce merchandisers",
    "singular": "e-commerce merchandiser",
    "apps": [
      "excel",
      "google-sheets",
      "slack",
      "chrome"
    ],
    "keywords": [
      "product catalog management",
      "e-commerce inventory tracking"
    ],
    "why": "They spend their time updating product details and inventory levels across web platforms using spreadsheets for bulk management.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "billing-specialists",
    "name": "Billing specialists",
    "singular": "billing specialist",
    "apps": [
      "excel",
      "google-sheets",
      "outlook",
      "word"
    ],
    "keywords": [
      "automated invoice generation",
      "billing reconciliation spreadsheet"
    ],
    "why": "Billing specialists manage high volumes of invoices, requiring constant reconciliation between accounting documents and email communication.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "corporate-recruiters",
    "name": "Corporate recruiters",
    "singular": "corporate recruiter",
    "apps": [
      "gmail",
      "zoom",
      "notion",
      "slack"
    ],
    "keywords": [
      "candidate pipeline tracking",
      "interview scheduling automation"
    ],
    "why": "They spend their day sourcing talent, scheduling interviews via email, and managing candidate pipelines in internal databases.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "business-development-representatives",
    "name": "Business development representatives",
    "singular": "business development representative",
    "apps": [
      "gmail",
      "slack",
      "excel",
      "notion"
    ],
    "keywords": [
      "lead generation tracking",
      "outreach email templates"
    ],
    "why": "They spend their day conducting high-volume outreach and logging interactions in spreadsheets and CRM-like documentation tools.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "legal-secretaries",
    "name": "Legal secretaries",
    "singular": "legal secretary",
    "apps": [
      "word",
      "outlook",
      "gmail",
      "pages"
    ],
    "keywords": [
      "legal document formatting",
      "court filing document templates"
    ],
    "why": "They spend their days drafting and formatting complex legal documents, requiring mastery of word processors and email management.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "social-media-content-creators",
    "name": "Social media content creators",
    "singular": "social media content creator",
    "apps": [
      "canva",
      "photoshop",
      "notion",
      "slack"
    ],
    "keywords": [
      "content calendar template",
      "social media design workflow"
    ],
    "why": "They create visual assets and manage content schedules, relying on design software and project management tools.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "customer-support-agents",
    "name": "Customer support agents",
    "singular": "customer support agent",
    "apps": [
      "gmail",
      "slack",
      "chrome",
      "notion"
    ],
    "keywords": [
      "customer ticket response templates",
      "support documentation management"
    ],
    "why": "They handle hundreds of tickets daily, using keyboard shortcuts and saved replies to manage communication efficiency.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "office-managers",
    "name": "Office managers",
    "singular": "office manager",
    "apps": [
      "excel",
      "gmail",
      "slack",
      "notion"
    ],
    "keywords": [
      "office supply inventory tracking",
      "employee scheduling spreadsheet"
    ],
    "why": "They manage day-to-day operations, vendor communication, and staff scheduling, relying on office software suites.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "digital-marketing-analysts",
    "name": "Digital marketing analysts",
    "singular": "digital marketing analyst",
    "apps": [
      "excel",
      "google-sheets",
      "powerpoint",
      "chrome"
    ],
    "keywords": [
      "marketing performance dashboard",
      "campaign data analysis"
    ],
    "why": "They aggregate data from various marketing channels into spreadsheets to build reports and presentations for stakeholders.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "project-coordinators",
    "name": "Project coordinators",
    "singular": "project coordinator",
    "apps": [
      "notion",
      "slack",
      "excel",
      "zoom"
    ],
    "keywords": [
      "project milestone tracker",
      "team task management"
    ],
    "why": "They keep teams aligned on deadlines, using project management software and spreadsheets to track progress.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "sales-operations-analysts",
    "name": "Sales operations analysts",
    "singular": "sales operations analyst",
    "apps": [
      "excel",
      "google-sheets",
      "slack",
      "notion"
    ],
    "keywords": [
      "sales pipeline forecasting",
      "sales data cleanup"
    ],
    "why": "They manage the infrastructure for sales teams, spending time cleaning data and building reports for leadership.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "academic-researchers",
    "name": "Academic researchers",
    "singular": "academic researcher",
    "apps": [
      "word",
      "google-docs",
      "excel"
    ],
    "keywords": [
      "research paper formatting",
      "bibliography management"
    ],
    "why": "They spend the majority of their time writing papers and managing citations in word processors.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "public-relations-managers",
    "name": "Public relations managers",
    "singular": "public relations manager",
    "apps": [
      "gmail",
      "word",
      "slack",
      "notion"
    ],
    "keywords": [
      "press release distribution",
      "media contact list management"
    ],
    "why": "They manage media outreach and draft press releases, requiring constant coordination and document creation.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "financial-controllers",
    "name": "Financial controllers",
    "singular": "financial controller",
    "apps": [
      "excel",
      "google-sheets",
      "outlook",
      "word"
    ],
    "keywords": [
      "financial report automation",
      "budget reconciliation"
    ],
    "why": "They oversee all accounting functions, spending their day verifying data in spreadsheets and drafting financial reports.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "training-coordinators",
    "name": "Training coordinators",
    "singular": "training coordinator",
    "apps": [
      "powerpoint",
      "zoom",
      "notion",
      "gmail"
    ],
    "keywords": [
      "training session scheduling",
      "employee development tracking"
    ],
    "why": "They organize and facilitate staff training, requiring proficiency in presentation software and communication tools.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "logistics-planners",
    "name": "Logistics planners",
    "singular": "logistics planner",
    "apps": [
      "excel",
      "google-sheets",
      "slack",
      "gmail"
    ],
    "keywords": [
      "shipping route optimization",
      "freight cost analysis"
    ],
    "why": "They manage complex supply chains, using spreadsheets for route planning and email for coordination.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "compliance-coordinators",
    "name": "Compliance coordinators",
    "singular": "compliance coordinator",
    "apps": [
      "notion",
      "excel",
      "word",
      "gmail"
    ],
    "keywords": [
      "compliance audit checklist",
      "regulatory documentation"
    ],
    "why": "They maintain records of adherence to regulations, requiring organized file management and constant document updates.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "recruitment-coordinators",
    "name": "Recruitment coordinators",
    "singular": "recruitment coordinator",
    "apps": [
      "gmail",
      "slack",
      "notion",
      "zoom"
    ],
    "keywords": [
      "interview scheduling workflow",
      "candidate email templates"
    ],
    "why": "They handle the administrative heavy lifting of hiring, including scheduling and candidate communications.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "data-governance-analysts",
    "name": "Data governance analysts",
    "singular": "data governance analyst",
    "apps": [
      "excel",
      "google-sheets",
      "notion",
      "slack"
    ],
    "keywords": [
      "data dictionary template",
      "data quality tracking"
    ],
    "why": "They define and enforce data standards, spending their day documenting policies and auditing databases.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "customer-success-associates",
    "name": "Customer success associates",
    "singular": "customer success associate",
    "apps": [
      "slack",
      "gmail",
      "notion",
      "zoom"
    ],
    "keywords": [
      "client health check template",
      "customer success playbooks"
    ],
    "why": "They manage ongoing client relationships, documenting client progress and addressing issues through email and video calls.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "marketing-copywriters",
    "name": "Marketing copywriters",
    "singular": "marketing copywriter",
    "apps": [
      "google-docs",
      "word",
      "slack",
      "notion"
    ],
    "keywords": [
      "copywriting brief template",
      "content editing workflow"
    ],
    "why": "They spend their entire day writing and editing marketing copy, requiring efficient word processing and collaboration.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "procurement-officers",
    "name": "Procurement officers",
    "singular": "procurement officer",
    "apps": [
      "excel",
      "google-sheets",
      "outlook",
      "word"
    ],
    "keywords": [
      "vendor contract management",
      "purchase order tracker"
    ],
    "why": "They manage purchasing and vendor relations, using spreadsheets to track orders and contracts.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "it-asset-managers",
    "name": "IT asset managers",
    "singular": "it asset manager",
    "apps": [
      "excel",
      "notion",
      "slack",
      "gmail"
    ],
    "keywords": [
      "hardware inventory tracker",
      "software license management"
    ],
    "why": "They track all hardware and software within an organization, relying on spreadsheets to keep inventory accurate.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "market-researchers",
    "name": "Market researchers",
    "singular": "market researcher",
    "apps": [
      "excel",
      "powerpoint",
      "google-sheets",
      "word"
    ],
    "keywords": [
      "market analysis report template",
      "survey data analysis"
    ],
    "why": "They synthesize large datasets into actionable insights for clients, using spreadsheets for analysis and presentations for delivery.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "event-coordinators",
    "name": "Event coordinators",
    "singular": "event coordinator",
    "apps": [
      "excel",
      "notion",
      "gmail",
      "slack"
    ],
    "keywords": [
      "event planning checklist",
      "vendor budget tracker"
    ],
    "why": "They manage multiple moving parts for events, using spreadsheets for budgets and project tools for logistics.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "seo-analysts",
    "name": "SEO analysts",
    "singular": "seo analyst",
    "apps": [
      "excel",
      "google-sheets",
      "chrome",
      "notion"
    ],
    "keywords": [
      "keyword ranking tracker",
      "seo audit checklist"
    ],
    "why": "They monitor search rankings and website performance, requiring constant data manipulation in spreadsheets.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "b2b-sales-representatives",
    "name": "B2B sales representatives",
    "singular": "b2b sales representative",
    "apps": [
      "gmail",
      "excel",
      "zoom",
      "slack"
    ],
    "keywords": [
      "sales outreach tracking",
      "lead qualification spreadsheet"
    ],
    "why": "They manage long sales cycles requiring constant email follow-ups and data tracking in spreadsheets.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "hr-compliance-officers",
    "name": "HR compliance officers",
    "singular": "hr compliance officer",
    "apps": [
      "word",
      "excel",
      "notion",
      "gmail"
    ],
    "keywords": [
      "hr policy documentation",
      "compliance audit tracker"
    ],
    "why": "They ensure legal adherence in HR processes, requiring careful documentation and spreadsheet-based reporting.",
    "discoveredAt": "2026-11-14"
  },
  {
    "slug": "digital-media-planners",
    "name": "Digital media planners",
    "singular": "digital media planner",
    "apps": [
      "excel",
      "google-sheets",
      "slack",
      "chrome"
    ],
    "keywords": [
      "media plan template excel",
      "ad budget allocation spreadsheet"
    ],
    "why": "They plan where ad spend goes, requiring complex spreadsheet models to forecast performance.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "claims-adjusters",
    "name": "Claims adjusters",
    "singular": "claims adjuster",
    "apps": [
      "excel",
      "outlook",
      "word",
      "chrome"
    ],
    "keywords": [
      "claims adjuster software tutorial",
      "how to organize claims in excel"
    ],
    "why": "They manage large volumes of documentation and correspondence, often needing help with spreadsheet formulas and email management.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "logistics-managers",
    "name": "Logistics managers",
    "singular": "logistics manager",
    "apps": [
      "excel",
      "google-sheets",
      "slack",
      "zoom"
    ],
    "keywords": [
      "logistics inventory tracking excel",
      "supply chain data automation"
    ],
    "why": "They rely heavily on complex spreadsheets to track shipments and communicate with partners via digital collaboration tools.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "payroll-administrators",
    "name": "Payroll administrators",
    "singular": "payroll administrator",
    "apps": [
      "excel",
      "google-sheets",
      "outlook"
    ],
    "keywords": [
      "payroll automation excel",
      "calculate payroll taxes in sheets"
    ],
    "why": "They perform repetitive data calculations and need to ensure accuracy in reporting, frequently searching for formula help.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "medical-transcribers",
    "name": "Medical transcribers",
    "singular": "medical transcriber",
    "apps": [
      "word",
      "gmail",
      "chrome"
    ],
    "keywords": [
      "medical transcription formatting tips",
      "word shortcuts for medical typing"
    ],
    "why": "They spend their entire day typing and formatting documents, often looking for efficiency hacks in word processors.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "curriculum-designers",
    "name": "Curriculum designers",
    "singular": "curriculum designer",
    "apps": [
      "google-docs",
      "canva",
      "powerpoint"
    ],
    "keywords": [
      "curriculum design templates",
      "how to organize learning materials"
    ],
    "why": "They create educational content and frequently search for ways to streamline document creation and visual layout.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "tax-advisors",
    "name": "Tax advisors",
    "singular": "tax advisor",
    "apps": [
      "excel",
      "outlook",
      "word"
    ],
    "keywords": [
      "tax return automation excel",
      "organizing client documents"
    ],
    "why": "They deal with heavy documentation and data analysis during tax seasons, requiring software automation tips.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "content-planners",
    "name": "Content planners",
    "singular": "content planner",
    "apps": [
      "notion",
      "google-sheets",
      "slack"
    ],
    "keywords": [
      "content calendar template notion",
      "organizing social media content"
    ],
    "why": "They manage editorial calendars and need help structuring workflows in project management software.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "customer-support-specialists",
    "name": "Customer support specialists",
    "singular": "customer support specialist",
    "apps": [
      "slack",
      "gmail",
      "chrome"
    ],
    "keywords": [
      "email management for support",
      "faster support ticket responses"
    ],
    "why": "They handle high volumes of communication and constantly look for ways to speed up their response times.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "legal-clerks",
    "name": "Legal clerks",
    "singular": "legal clerk",
    "apps": [
      "word",
      "outlook",
      "google-docs"
    ],
    "keywords": [
      "legal document formatting tips",
      "organizing legal case files"
    ],
    "why": "They prepare legal documents and require precise formatting and document management skills.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "program-coordinators",
    "name": "Program coordinators",
    "singular": "program coordinator",
    "apps": [
      "notion",
      "google-sheets",
      "zoom"
    ],
    "keywords": [
      "coordinating programs with notion",
      "tracking program metrics"
    ],
    "why": "They juggle multiple stakeholders and timelines, often needing help with organizational software.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "estate-administrators",
    "name": "Estate administrators",
    "singular": "estate administrator",
    "apps": [
      "excel",
      "word",
      "outlook"
    ],
    "keywords": [
      "estate inventory list template",
      "organizing legal assets"
    ],
    "why": "They manage sensitive asset lists and documentation, requiring structured templates and organization.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "community-builders",
    "name": "Community builders",
    "singular": "community builder",
    "apps": [
      "slack",
      "notion",
      "zoom"
    ],
    "keywords": [
      "managing community engagement",
      "notion for community management"
    ],
    "why": "They facilitate digital spaces and look for ways to manage member information and event schedules.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "seo-consultants",
    "name": "SEO consultants",
    "singular": "seo consultant",
    "apps": [
      "google-sheets",
      "chrome",
      "notion"
    ],
    "keywords": [
      "seo keyword tracking in sheets",
      "automated seo reporting"
    ],
    "why": "They analyze search data and need to build custom reports to show performance to clients.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "it-coordinators",
    "name": "IT coordinators",
    "singular": "it coordinator",
    "apps": [
      "slack",
      "notion",
      "vs-code"
    ],
    "keywords": [
      "it ticket tracking system",
      "organizing it assets"
    ],
    "why": "They bridge the gap between technical teams and management, often needing help with documentation.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "technical-support-staff",
    "name": "Technical support staff",
    "singular": "technical support staff",
    "apps": [
      "slack",
      "chrome"
    ],
    "keywords": [
      "troubleshooting workflow tips",
      "organizing support tickets"
    ],
    "why": "They document issues and provide solutions, often searching for ways to optimize their ticket handling.",
    "discoveredAt": "2026-11-15"
  },
  {
    "slug": "payroll-clerks",
    "name": "Payroll clerks",
    "singular": "payroll clerk",
    "apps": [
      "excel",
      "google-sheets",
      "outlook",
      "slack"
    ],
    "keywords": [
      "payroll automation excel",
      "payroll clerk software tips"
    ],
    "why": "They spend their day calculating wages and taxes, relying heavily on spreadsheets and email communication to resolve discrepancies.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "claims-processors",
    "name": "Claims processors",
    "singular": "claims processor",
    "apps": [
      "word",
      "excel",
      "outlook",
      "gmail"
    ],
    "keywords": [
      "claims processing workflow",
      "efficient data entry for insurance"
    ],
    "why": "They constantly process large volumes of forms and documents, needing help with data organization and template management.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "technical-support-agents",
    "name": "Technical support agents",
    "singular": "technical support agent",
    "apps": [
      "slack",
      "zoom",
      "chrome"
    ],
    "keywords": [
      "tech support ticket automation",
      "customer communication templates"
    ],
    "why": "They handle high volumes of user queries and need help organizing documentation and streamlining repetitive responses.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "credit-analysts",
    "name": "Credit analysts",
    "singular": "credit analyst",
    "apps": [
      "excel",
      "word",
      "outlook",
      "notion"
    ],
    "keywords": [
      "credit analysis report template",
      "financial modeling in excel"
    ],
    "why": "They perform deep financial statement analysis and write detailed risk reports, requiring significant help with data modeling.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "search-engine-evaluators",
    "name": "Search engine evaluators",
    "singular": "search engine evaluator",
    "apps": [
      "chrome",
      "google-sheets",
      "slack"
    ],
    "keywords": [
      "search quality rating tools",
      "evaluator productivity tips"
    ],
    "why": "They spend their entire workday in browsers assessing search results, often looking for ways to speed up their rating workflow.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "medical-receptionists",
    "name": "Medical receptionists",
    "singular": "medical receptionist",
    "apps": [
      "outlook",
      "word",
      "excel",
      "slack"
    ],
    "keywords": [
      "medical scheduling software help",
      "patient communication templates"
    ],
    "why": "They juggle patient scheduling and administrative tasks, often seeking better ways to manage appointments and office documentation.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "supply-chain-analysts",
    "name": "Supply chain analysts",
    "singular": "supply chain analyst",
    "apps": [
      "excel",
      "google-sheets",
      "slack",
      "outlook"
    ],
    "keywords": [
      "supply chain forecasting excel",
      "logistics data visualization"
    ],
    "why": "They manage inventory levels and vendor relationships, relying on complex spreadsheets for predictive modeling.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "nonprofit-administrators",
    "name": "Nonprofit administrators",
    "singular": "nonprofit administrator",
    "apps": [
      "google-docs",
      "google-sheets",
      "gmail",
      "slack"
    ],
    "keywords": [
      "nonprofit donor management tips",
      "admin task automation"
    ],
    "why": "They wear many hats and often seek low-cost software solutions to manage volunteers, donors, and administrative tasks.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "real-estate-transaction-coordinators",
    "name": "Real estate transaction coordinators",
    "singular": "real estate transaction coordinator",
    "apps": [
      "google-docs",
      "gmail",
      "outlook"
    ],
    "keywords": [
      "transaction management workflow",
      "closing checklist template"
    ],
    "why": "They manage time-sensitive document flows and communication between buyers, sellers, and agents.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "legal-transcriptionists",
    "name": "Legal transcriptionists",
    "singular": "legal transcriptionist",
    "apps": [
      "word",
      "pages",
      "apple-mail",
      "finder"
    ],
    "keywords": [
      "legal transcription speed tips",
      "audio to text workflow"
    ],
    "why": "They spend their entire day typing from audio, constantly looking for tools to improve accuracy and speed.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "virtual-event-hosts",
    "name": "Virtual event hosts",
    "singular": "virtual event host",
    "apps": [
      "zoom",
      "slack",
      "canva",
      "notion"
    ],
    "keywords": [
      "virtual event engagement ideas",
      "zoom production workflow"
    ],
    "why": "They manage the technical and social aspects of webinars, requiring help with platform settings and participant management.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "customer-onboarding-managers",
    "name": "Customer onboarding managers",
    "singular": "customer onboarding manager",
    "apps": [
      "notion",
      "slack",
      "zoom",
      "google-sheets"
    ],
    "keywords": [
      "onboarding process automation",
      "client training templates"
    ],
    "why": "They manage the transition phase for new clients, needing help with tracking progress and delivering consistent documentation.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "market-research-analysts",
    "name": "Market research analysts",
    "singular": "market research analyst",
    "apps": [
      "excel",
      "powerpoint",
      "chrome",
      "google-sheets"
    ],
    "keywords": [
      "market data analysis techniques",
      "survey data cleaning excel"
    ],
    "why": "They synthesize large datasets into actionable insights, heavily using spreadsheet and presentation software.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "book-publicists",
    "name": "Book publicists",
    "singular": "book publicist",
    "apps": [
      "gmail",
      "slack",
      "notion",
      "excel"
    ],
    "keywords": [
      "media outreach tracking",
      "pitch email templates"
    ],
    "why": "They manage high-volume outreach campaigns to journalists and influencers, requiring help with CRM and email organization.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "inventory-managers",
    "name": "Inventory managers",
    "singular": "inventory manager",
    "apps": [
      "excel",
      "google-sheets",
      "outlook",
      "slack"
    ],
    "keywords": [
      "inventory tracking spreadsheet",
      "stock level forecasting tools"
    ],
    "why": "They maintain accurate stock records and need help automating reorder points and data entry.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "content-moderators",
    "name": "Content moderators",
    "singular": "content moderator",
    "apps": [
      "chrome",
      "slack",
      "notion"
    ],
    "keywords": [
      "content moderation workflow",
      "speeding up review process"
    ],
    "why": "They review high volumes of content, constantly looking for shortcuts and browser-based productivity tools.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "digital-product-testers",
    "name": "Digital product testers",
    "singular": "digital product tester",
    "apps": [
      "chrome",
      "slack",
      "notion"
    ],
    "keywords": [
      "bug reporting documentation",
      "testing workflow optimization"
    ],
    "why": "They document issues in software, needing help with screenshot management and consistent reporting formats.",
    "discoveredAt": "2026-11-16"
  },
  {
    "slug": "shipping-coordinators",
    "name": "Shipping coordinators",
    "singular": "shipping coordinator",
    "apps": [
      "excel",
      "google-sheets",
      "slack",
      "gmail",
      "chrome"
    ],
    "keywords": [
      "logistics software for shipping coordinators",
      "shipping spreadsheet automation"
    ],
    "why": "They manage complex global logistics and tracking data, constantly switching between email and spreadsheets to resolve shipping delays.",
    "discoveredAt": "2026-11-16"
  }
];
