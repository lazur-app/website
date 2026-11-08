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
  }
];
