// Selectable cities for a member's day. Now a seed/fallback — the live list
// comes from the master `cities` table (Settings → City setup).
export const CITIES = ["Johannesburg", "Cape Town", "Dubai", "Doha"];

// Readable text color (black/white) for a given hex background, by luminance.
export function textOn(hex) {
  const h = String(hex || "").replace("#", "");
  if (h.length < 6) return "#0b0b0b";
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  // Perceived luminance (sRGB approximation).
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? "#0b0b0b" : "#ffffff";
}

// Time picker options at 30-minute intervals, starting at 6 AM ("06:00" … "23:30").
export const TIME_OPTIONS = (() => {
  const out = [];
  for (let m = 6 * 60; m < 24 * 60; m += 30) {
    const h = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    out.push(`${h}:${mm}`);
  }
  return out;
})();

// ---- 12-hour AM/PM formatting ----
function _ap(h) { return h < 12 ? "AM" : "PM"; }
function _h12(h) { const x = h % 12; return x === 0 ? 12 : x; }

// "09:00" -> "9:00 AM", "13:30" -> "1:30 PM"
export function fmtTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${_h12(h)}:${String(m).padStart(2, "0")} ${_ap(h)}`;
}

// timestamp string/Date -> "9:00 AM"
export function fmtTs(ts) {
  const d = parseTs(ts);
  if (!d) return "";
  return `${_h12(d.getHours())}:${String(d.getMinutes()).padStart(2, "0")} ${_ap(d.getHours())}`;
}

// hour number (0-23) -> "9 AM"
export function fmtHour(h) {
  return `${_h12(h)} ${_ap(h)}`;
}

// Status metadata (matches the legend from the original spreadsheet).
export const STATUSES = {
  CONFIRMED: { label: "Confirmed", cls: "st-confirmed" },
  UNCONFIRMED: { label: "Awaiting", cls: "st-unconfirmed" },
  TRAVEL: { label: "Travel", cls: "st-travel" },
  DINNER: { label: "Dinner", cls: "st-dinner" },
  OFF: { label: "Off Time", cls: "st-off" },
};

// Attendee emails for a meeting (backend sends an array; fall back to owner).
export function attendeesOf(m) {
  if (Array.isArray(m.attendees) && m.attendees.length) return m.attendees;
  return m.member_email ? [m.member_email] : [];
}

// Trim a string to `max` chars, appending "…" when it's longer.
export function truncate(s, max = 18) {
  const str = String(s || "");
  return str.length > max ? str.slice(0, max) + "…" : str;
}

export function initials(name, email) {
  const src = (name || email || "").trim();
  if (!src) return "?";
  const parts = src.split(/[\s._@]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  // First-name initial + last-name initial (e.g. "Richard Wylie" -> "RW").
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Build an array of YYYY-MM-DD strings between two dates inclusive.
export function dateRange(startStr, endStr) {
  const out = [];
  const d = new Date(startStr + "T00:00:00");
  const end = new Date(endStr + "T00:00:00");
  while (d <= end) {
    out.push(fmtDate(d));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function weekday(dateStr) {
  return WEEKDAYS[new Date(dateStr + "T00:00:00").getDay()];
}

export function prettyDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

// Parse a backend timestamp ("2026-07-20 09:00:00" or ISO) into a JS Date.
export function parseTs(ts) {
  if (!ts) return null;
  return new Date(String(ts).replace(" ", "T"));
}

// Return "YYYY-MM-DD" portion of a timestamp string.
export function dayOf(ts) {
  const d = parseTs(ts);
  return d ? fmtDate(d) : null;
}

export function hhmm(ts) {
  const d = parseTs(ts);
  if (!d) return "";
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

// Minutes since midnight for a timestamp.
export function minutesOfDay(ts) {
  const d = parseTs(ts);
  if (!d) return 0;
  return d.getHours() * 60 + d.getMinutes();
}

// Format "minutes since midnight" as HH:MM.
export function minToHHMM(min) {
  const m = Math.max(0, Math.min(24 * 60 - 1, Math.round(min)));
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export function roundToStep(min, step = 30) {
  return Math.round(min / step) * step;
}

// Find existing meetings that clash with a candidate meeting: same day, a
// shared attendee, and overlapping time. Returns [{ meeting, attendees }] where
// `attendees` is the list of shared emails that are double-booked. The candidate
// being edited is skipped by id.
export function meetingConflicts(meetings, candidate) {
  const cAtt = new Set(attendeesOf(candidate));
  const cDay = dayOf(candidate.start_ts);
  const cs = minutesOfDay(candidate.start_ts);
  const ce = minutesOfDay(candidate.end_ts);
  const out = [];
  for (const m of meetings) {
    if (candidate.id && m.id === candidate.id) continue; // don't clash with self
    if (dayOf(m.start_ts) !== cDay) continue;
    const shared = attendeesOf(m).filter((e) => cAtt.has(e));
    if (!shared.length) continue;
    const ms = minutesOfDay(m.start_ts);
    const me = minutesOfDay(m.end_ts);
    if (cs < me && ms < ce) out.push({ meeting: m, attendees: shared }); // half-open overlap
  }
  return out;
}

// ---- profile photo: client-side resize to a tiny square JPEG thumbnail ----
// Reads an image File, center-crops to square, scales to `size`px, re-encodes
// as JPEG (quality ~0.8), and resolves a small base64 data-URL. Rejects
// non-images and files over `maxBytes`. Keeps stored photos lightweight.
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024; // 5 MB original cap

export function fileToThumbnail(file, { size = 128, quality = 0.8, maxBytes = PHOTO_MAX_BYTES } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) return reject(new Error("Please choose an image file."));
    if (file.size > maxBytes)
      return reject(new Error(`Image is too large (max ${Math.round(maxBytes / 1024 / 1024)} MB).`));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const side = Math.min(img.width, img.height);
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that image."));
    };
    img.src = url;
  });
}

// ---- calendar (.ics) export ----
// Meetings use naive local wall-clock times (single trip timezone, no TZ), so
// events are emitted as *floating* local times (no Z / no TZID) — a calendar
// app shows them at the same clock time wherever it's opened, matching the app.

function icsEscape(s) {
  return String(s == null ? "" : s)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// Fold a content line to <=75 octets (RFC 5545); continuations start with a space.
function icsFold(line) {
  const out = [];
  let s = line;
  while (s.length > 75) {
    out.push(s.slice(0, 75));
    s = " " + s.slice(75);
  }
  out.push(s);
  return out.join("\r\n");
}

// "2026-08-20 09:00:00" -> "20260820T090000" (wall-clock, stamped with a TZID).
function icsLocal(ts) {
  const d = parseTs(ts);
  if (!d) return null;
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

// Trip cities → IANA timezone (all no-DST, so a single fixed offset is exact).
const CITY_TZ = {
  "Johannesburg": { tzid: "Africa/Johannesburg", offset: "+0200" },
  "Cape Town": { tzid: "Africa/Johannesburg", offset: "+0200" },
  "Doha": { tzid: "Asia/Qatar", offset: "+0300" },
  "Dubai": { tzid: "Asia/Dubai", offset: "+0400" },
};
const DEFAULT_TZ = { tzid: "Africa/Johannesburg", offset: "+0200" };

// Pick the trip's timezone from its cities (most-common city wins). Falls back
// to UAE→Dubai / else Johannesburg when no cities are set.
export function tripTimezone(cities, trip) {
  const counts = {};
  for (const c of cities || []) {
    if (c?.city && CITY_TZ[c.city]) counts[c.city] = (counts[c.city] || 0) + 1;
  }
  const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  if (top) return CITY_TZ[top];
  if (trip?.bu3 === "UAE") return CITY_TZ["Dubai"];
  return DEFAULT_TZ;
}

// Minimal VTIMEZONE for a fixed-offset (no-DST) zone.
function vtimezone(tz) {
  return [
    "BEGIN:VTIMEZONE",
    `TZID:${tz.tzid}`,
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    `TZOFFSETFROM:${tz.offset}`,
    `TZOFFSETTO:${tz.offset}`,
    "END:STANDARD",
    "END:VTIMEZONE",
  ];
}

function icsStampUTC() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`;
}

// Build an iCalendar document (VCALENDAR) from a list of meetings. Times are
// stamped with the trip's timezone (TZID) so they open at the correct local
// hour in Google Calendar; titles are prefixed with [Placeholder] and each
// attendee email is added as a calendar guest. One file holds all events.
export function buildICS(meetings, { trip, tz = DEFAULT_TZ } = {}) {
  const stamp = icsStampUTC();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Travel & Meetings Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...vtimezone(tz),
  ];
  for (const m of meetings) {
    const start = icsLocal(m.start_ts);
    const end = icsLocal(m.end_ts);
    if (!start || !end) continue;
    const desc = [];
    if (trip?.name) desc.push(`Trip: ${trip.name}`);
    desc.push(`Status: ${STATUSES[m.status]?.label || m.status}`);
    const atts = attendeesOf(m);
    if (atts.length) desc.push(`Attendees: ${atts.join(", ")}`);
    // Title prefix: [Placeholder]
    const title = `[Placeholder] ${m.title || "Meeting"}`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${m.id || Math.random().toString(36).slice(2)}@travel-planner`,
      `DTSTAMP:${stamp}`,
      `DTSTART;TZID=${tz.tzid}:${start}`,
      `DTEND;TZID=${tz.tzid}:${end}`,
      `SUMMARY:${icsEscape(title)}`,
      m.location ? `LOCATION:${icsEscape(m.location)}` : null,
      `DESCRIPTION:${icsEscape(desc.join("\n"))}`,
      // Each attendee as a real calendar guest (email).
      ...atts.map((em) => `ATTENDEE;CN=${icsEscape(em)}:mailto:${em}`),
      `STATUS:${m.status === "CONFIRMED" ? "CONFIRMED" : "TENTATIVE"}`,
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.filter((l) => l != null).map(icsFold).join("\r\n") + "\r\n";
}

// Trigger a browser download of an .ics file for the given meetings.
export function downloadICS(meetings, trip, cities) {
  const tz = tripTimezone(cities, trip);
  const ics = buildICS(meetings, { trip, tz });
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${String(trip?.name || "trip").replace(/[^\w-]+/g, "_")}_my_meetings.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Greedy side-by-side packing of overlapping events into columns.
// Returns { placed: [{ e, col, s, end }], nCols }.
export function packEvents(events) {
  const sorted = [...events].sort(
    (a, b) => minutesOfDay(a.start_ts) - minutesOfDay(b.start_ts)
  );
  const colEnds = [];
  const placed = sorted.map((e) => {
    const s = minutesOfDay(e.start_ts);
    const end = minutesOfDay(e.end_ts);
    let col = colEnds.findIndex((c) => c <= s);
    if (col === -1) {
      col = colEnds.length;
      colEnds.push(end);
    } else {
      colEnds[col] = end;
    }
    return { e, col, s, end };
  });
  return { placed, nCols: Math.max(1, colEnds.length) };
}
