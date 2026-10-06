// Single source of truth for the app version + changelog.
// Bump APP_VERSION and prepend a VERSIONS entry on each release.
export const APP_VERSION = "1.14";

export const APP_DETAILS = {
  name: "Account Cockpit",
  description:
    "Team travel + meeting planning for the MEA field team — replaces the shared Excel calendar.",
  platform: "Databricks App (React + FastAPI)",
  storage: "Unity Catalog Delta — adb_fe_uae_01.mea_travel_planner",
};

// Newest first. `date` is the release date (YYYY-MM-DD).
export const VERSIONS = [
  {
    version: "1.14",
    date: "2026-10-01",
    highlights: [
      "New account “Org” tab: build a reporting org chart of people as a top-down tree.",
      "Add people with a name, role, and who they report to; connectors are drawn automatically.",
      "A traffic-light status (green / amber / red, or clear) colors each person's card.",
      "Optional LinkedIn link and profile image URL — falls back to an initials avatar.",
      "Pan and zoom the chart; edits save per account.",
    ],
  },
  {
    version: "1.13",
    date: "2026-09-29",
    highlights: [
      "Rebranded to “Account Cockpit”.",
      "“My Accounts” is now the default landing tab, moved to the front of the nav; the Trip tab moved to third (now at /trip).",
    ],
  },
  {
    version: "1.12",
    date: "2026-09-05",
    highlights: [
      "New “My Accounts” tab — your book of accounts (where you're the AE or SA), with KPIs.",
      "KPI tiles: account count (AE/SA split), total DBU $ with month-over-month, Strategic count, growing vs declining.",
      "A 5-month DBU $ trend, top accounts (with the counterpart AE/SA), biggest movers, the biggest Genie / Apps / Lakebase account, and a DBX mix.",
    ],
  },
  {
    version: "1.11",
    date: "2026-09-02",
    highlights: [
      "Accounts: a Cloud column showing each account's cloud(s) — AWS, Azure, GCP, SAP — derived from consumption; multi-cloud accounts show all.",
      "New Cloud filter, alongside BU3 / SA / AE / Priority.",
      "Accounts: a DBX classification column (Strategic / Named / Non-DBX) and a Salesforce shortcut per row.",
      "Account detail: Industry and Sub-industry tiles, plus a platform · region consumption split.",
    ],
  },
  {
    version: "1.10",
    date: "2026-09-02",
    highlights: [
      "New account “Target Arch” tab: build a target-architecture diagram on a canvas — drop building blocks, connect them with curved arrows, then drag, pan and zoom.",
      "Source systems (PDF, SAP, Sensor Data) with free-form text.",
      "Databricks service cards: Databricks Apps, Lakehouse, Lakebase, and Genie.",
      "A wide Spark Declarative Pipeline tile with a Bronze / Silver / Gold medallion.",
      "BI & dashboards tiles: AI/BI Dashboard and Power BI.",
      "A wide Unity Catalog governance tile — Access control, Genie Ontology, and Unity Gateway.",
      "A tall Ingest block where you toggle the components in use — Lakeflow Connect, Auto Loader, Zerobus, Federation.",
      "Diagrams save per account.",
    ],
  },
  {
    version: "1.9",
    date: "2026-08-22",
    highlights: [
      "Demand plan Current use cases now support multiple rows — add them with the “+ Add” button.",
      "Each current use case has an editable name and monthly baseline; columns still compound by the plan growth %/mo.",
      "Numbers show standard comma grouping; the $ sign appears only on the total column.",
    ],
  },
  {
    version: "1.8",
    date: "2026-08-21",
    highlights: [
      "Demand plans now have a fixed horizon — pick 1, 3 or 5 years when creating.",
      "Creating a plan takes just three inputs (years, growth %/mo, start month); the name is auto-filled and editable later.",
      "New plans appear as a tile on the Demand plan page without leaving it.",
      "Columns adapt to the horizon: months for 1-year, quarters for 3-year, half-years for 5-year plans.",
    ],
  },
  {
    version: "1.7",
    date: "2026-08-17",
    highlights: [
      "Architecture tab: aligned rows — pair each Current tool with its Intermediate and Future counterpart; add rows with the “+” on the capability.",
      "Pick tools from dropdowns; boxes fill with the tool’s color.",
      "Tool catalog seeded from the org tool-and-Databricks-mapping (Databricks = dark, others = light).",
      "Colors use a fixed 3-shade palette instead of a free RGB picker.",
    ],
  },
  {
    version: "1.6",
    date: "2026-08-15",
    highlights: [
      "Account Architecture tab: a 3-state strategy matrix (Current / Intermediate / Future).",
      "Pick tools per capability from predefined, color-coded options — or add your own.",
      "Every account loads the full capability plan; edits save only when you click Save.",
    ],
  },
  {
    version: "1.5",
    date: "2026-08-15",
    highlights: [
      "New Settings page (from the user-photo menu): City setup and Tool setup.",
      "City setup — the trip “City” dropdown is now an editable master list.",
      "Tool setup — manage the architecture tool catalog and assign a color per tool.",
      "Groundwork for the account Architecture 3-state strategy (Current / Intermediate / Future).",
    ],
  },
  {
    version: "1.4",
    date: "2026-08-11",
    highlights: [
      "Rebranded to “Team MEA” with a new logo and favicon.",
      "PTO grid: collapsible teams, frozen header, and a 1–5 day color scale.",
      "Responsive layout — Accounts columns, nav labels, Links sidebar and trip-card details adapt to screen width.",
      "Trip details on one line; Add member moved above the roster.",
      "Team view — a master checkbox to select / deselect all member columns.",
      "Trip access — members land on Team view, others on Overview; non-members are warned to join before opening Team / My view.",
      "Fixed attendee photos on meeting tiles.",
    ],
  },
  {
    version: "1.3",
    date: "2026-08-08",
    highlights: [
      "Accounts table shows latest-month DBU $ plus per-product Genie and Lakebase, each with a month-over-month arrow.",
      "Account flyout DBU analytics: monthly trend line, per-product multi-line, product-mix donut, platform-split bar.",
      "Meetings moved to a dedicated per-account flyout; account-name flyout is analytics-only.",
      "DBU columns labeled with their real calendar month, rolling forward automatically.",
      "Accounts data joins account details with per-product monthly usage.",
      "Team directory loads solely from the users table.",
    ],
  },
  {
    version: "1.2",
    date: "2026-08-01",
    highlights: [
      "New “Dinner” meeting status (violet).",
      "Per-region trip icons (Africa-Qatar & UAE) on cards and headers.",
      "Account detail flyout: AE, SA, a 3-month DBU $ chart, and all meetings for the account.",
      "Trip Overview “Account meetings” list, grouped by AE and collapsible.",
      "Meeting popup marks titles that match a known account.",
      "Past trips match the upcoming-card layout, three per row.",
      "New favicon; faster loads via reused SQL warehouse connection.",
    ],
  },
  {
    version: "1.1",
    date: "2026-07-16",
    highlights: [
      "Meeting conflict validation — blocks double-booking and names who clashes.",
      "Simplified attendee picker — removable chips plus an “+ Add attendee” dropdown.",
      "Accounts tab — account book with BU3 / SA / AE filters, sortable columns, last-updated date.",
      "About page with version history.",
      "Feedback — anyone can share feedback from the About page.",
    ],
  },
  {
    version: "1.0",
    date: "2026-07-15",
    highlights: [
      "Multi-trip planning — create trips, add members, everyone edits.",
      "Team view — time-proportional daily grid with per-member columns and status colors.",
      "My view — personal weekly calendar with click-to-create.",
      "Overview — trip KPIs plus add / remove / reorder members.",
      "Multi-attendee meetings appear in every attendee's column.",
      "Editable team directory.",
      "Optimistic UI with toasts, light / dark theme, and an append-only audit log.",
    ],
  },
];
