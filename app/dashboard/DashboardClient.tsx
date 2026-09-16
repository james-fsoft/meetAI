"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLang, type Lang } from "@/lib/use-lang";
import Link from "next/link";
import LangSwitch from "../LangSwitch";

/**
 * Meeting calendar (Google-Calendar style): Month / Week / List views over the
 * signed-in user's saved meetings (/api/meetings), with a side sheet showing
 * the summary + transcript of the meeting you click.
 */

type Row = { id: string; client_id: number; title: string; summary: string; started_at: string; duration_sec: number };
type Turn = { src?: string; tgt?: string; spk?: number | null };
type Full = Row & { transcript: string; live: Turn[] };
type View = "month" | "week" | "list";
type LocalMeeting = { id: number; title?: string; summary?: string; transcript?: string; live?: Turn[]; start?: number; dur?: number; cloud?: number };

const LOCALE: Record<Lang, string> = { en: "en-US", vi: "vi-VN", ko: "ko-KR" };
const WEEK_START: Record<Lang, number> = { en: 0, vi: 1, ko: 0 };
const HOUR_PX = 48;
const COLORS = ["#1f6bff", "#0b8043", "#8e24aa", "#f4511e", "#039be5", "#d81b60", "#33b679", "#e4a400"];

const T: Record<Lang, {
  title: string; sub: string; newM: string; account: string; dict: string; profile: string; today: string;
  month: string; week: string; list: string; stats: (n: number, d: string) => string; more: (n: number) => string;
  empty: string; emptyDay: string; loading: string; err: string; retry: string; missing: string;
  local: (n: number) => string; sync: string; syncing: string;
  summary: string; transcript: string; noSummary: string; noTranscript: string;
  copy: string; copied: string; download: string; del: string; delq: string; close: string;
  min: string; hm: (h: number, m: number) => string; h: (h: number) => string; untitled: string; speaker: string;
}> = {
  en: {
    title: "Meeting calendar", sub: "Every meeting you end is summarized and saved here automatically.",
    newM: "+ New meeting", account: "Account", dict: "Dictionary", profile: "Profile", today: "Today", month: "Month", week: "Week", list: "List",
    stats: (n, d) => `${n} meeting${n === 1 ? "" : "s"} · ${d}`, more: (n) => `+${n} more`,
    empty: "No meetings in this period.", emptyDay: "No meetings on this day.", loading: "Loading…",
    err: "Couldn't load your meetings.", retry: "Retry",
    missing: "Cloud history isn't enabled on the server yet — meetings are still kept on this device.",
    local: (n) => `${n} meeting${n === 1 ? "" : "s"} saved on this device ${n === 1 ? "isn't" : "aren't"} in your account yet.`,
    sync: "Sync to my account", syncing: "Syncing…",
    summary: "Summary", transcript: "Transcript", noSummary: "No summary for this meeting.", noTranscript: "No transcript.",
    copy: "Copy", copied: "Copied", download: "Download", del: "Delete", delq: "Delete this meeting? This can't be undone.", close: "Close",
    min: "min", hm: (h, m) => `${h}h ${m}m`, h: (h) => `${h}h`, untitled: "Meeting", speaker: "Speaker",
  },
  vi: {
    title: "Lịch họp", sub: "Mỗi cuộc họp khi bấm Kết thúc sẽ được tự tóm tắt và lưu vào đây.",
    newM: "+ Cuộc họp mới", account: "Tài khoản", dict: "Từ điển", profile: "Trang cá nhân", today: "Hôm nay", month: "Tháng", week: "Tuần", list: "Danh sách",
    stats: (n, d) => `${n} cuộc họp · ${d}`, more: (n) => `+${n} nữa`,
    empty: "Chưa có cuộc họp nào trong khoảng này.", emptyDay: "Không có cuộc họp nào trong ngày.", loading: "Đang tải…",
    err: "Không tải được danh sách cuộc họp.", retry: "Thử lại",
    missing: "Máy chủ chưa bật lưu lịch sử đám mây — cuộc họp vẫn được lưu trên thiết bị này.",
    local: (n) => `Có ${n} cuộc họp lưu trên thiết bị này chưa có trong tài khoản.`,
    sync: "Đồng bộ lên tài khoản", syncing: "Đang đồng bộ…",
    summary: "Tóm tắt", transcript: "Bản ghi", noSummary: "Cuộc họp này chưa có tóm tắt.", noTranscript: "Không có bản ghi.",
    copy: "Copy", copied: "Đã copy", download: "Tải về", del: "Xoá", delq: "Xoá cuộc họp này? Không thể hoàn tác.", close: "Đóng",
    min: "phút", hm: (h, m) => `${h} giờ ${m} phút`, h: (h) => `${h} giờ`, untitled: "Cuộc họp", speaker: "Speaker",
  },
  ko: {
    title: "회의 캘린더", sub: "종료한 모든 회의가 자동으로 요약되어 여기에 저장됩니다.",
    newM: "+ 새 회의", account: "계정", dict: "사전", profile: "프로필", today: "오늘", month: "월", week: "주", list: "목록",
    stats: (n, d) => `회의 ${n}개 · ${d}`, more: (n) => `+${n}개 더`,
    empty: "이 기간에 회의가 없습니다.", emptyDay: "이 날에는 회의가 없습니다.", loading: "불러오는 중…",
    err: "회의를 불러오지 못했습니다.", retry: "다시 시도",
    missing: "서버에서 클라우드 기록이 아직 활성화되지 않았습니다 — 회의는 이 기기에 저장됩니다.",
    local: (n) => `이 기기에 저장된 회의 ${n}개가 아직 계정에 없습니다.`,
    sync: "계정에 동기화", syncing: "동기화 중…",
    summary: "요약", transcript: "전체 기록", noSummary: "이 회의에는 요약이 없습니다.", noTranscript: "기록이 없습니다.",
    copy: "복사", copied: "복사됨", download: "다운로드", del: "삭제", delq: "이 회의를 삭제할까요? 되돌릴 수 없습니다.", close: "닫기",
    min: "분", hm: (h, m) => `${h}시간 ${m}분`, h: (h) => `${h}시간`, untitled: "회의", speaker: "Speaker",
  },
};
type Dict = (typeof T)["en"];

// ── date helpers (local time) ──
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const startOfWeek = (d: Date, ws: number) => { const s = startOfDay(d); return addDays(s, -((s.getDay() - ws + 7) % 7)); };

function fmtDur(sec: number, t: Dict) {
  const m = Math.round((sec || 0) / 60);
  if (m < 1) return `<1 ${t.min}`;
  const h = Math.floor(m / 60), r = m % 60;
  return h ? (r ? t.hm(h, r) : t.h(h)) : `${m} ${t.min}`;
}
const colorOf = (r: Row) => COLORS[Math.abs(Math.floor(Number(r.client_id) || 0)) % COLORS.length];

function esc(s: string) { return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
// Same small Markdown subset the meeting app renders (input is escaped first).
function md(x: string) {
  if (!x) return "";
  return esc(x)
    .replace(/^### (.*)$/gm, "<h3>$1</h3>").replace(/^#{1,2} (.*)$/gm, "<h2>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .replace(/^- \[x\] (.*)$/gmi, "☑ $1").replace(/^- \[ \] (.*)$/gm, "☐ $1").replace(/^[-*] (.*)$/gm, "• $1")
    .replace(/\n/g, "<br>").replace(/(<\/h[23]>)<br>/g, "$1");
}
// One-line preview: the Overview section of the summary if there is one (up to the
// next heading), else the first body lines.
function snippet(s: string) {
  if (!s) return "";
  const lines = s.split("\n");
  const i = lines.findIndex((l) => /^#{1,3}\s*(overview|tổng quan|개요|summary|tóm tắt|요약)/i.test(l.trim()));
  let body = i >= 0 ? lines.slice(i + 1) : lines;
  if (i >= 0) { const end = body.findIndex((l) => /^#/.test(l.trim())); if (end >= 0) body = body.slice(0, end); }
  return body.filter((l) => l.trim() && !/^#/.test(l.trim())).join(" ")
    .replace(/\[[ xX]\]\s*/g, "").replace(/[*_`>#]/g, "").replace(/(^|\s)[-•]\s+/g, " ")
    .replace(/\s+/g, " ").trim().slice(0, 220);
}
function trText(m: Full, t: Dict) {
  if (m.live && m.live.length) {
    return m.live.map((p) => (p.spk != null ? `${t.speaker} ${p.spk}\n` : "") + (p.src || "") + (p.tgt ? `\n→ ${p.tgt}` : "")).join("\n\n");
  }
  return m.transcript || "";
}
const toPayload = (m: LocalMeeting) => ({
  client_id: m.id, title: m.title || "", summary: m.summary || "", transcript: m.transcript || "",
  live: m.live || [], started_at: m.start || m.id, duration_sec: m.dur || 0,
});

// Lay out one day's meetings on the week grid; overlapping ones share the width.
function layoutDay(items: Row[]) {
  const evs = items.map((r) => {
    const s = new Date(r.started_at);
    const start = s.getHours() * 60 + s.getMinutes();
    return { r, start, end: Math.min(1440, start + Math.max(20, Math.round((r.duration_sec || 0) / 60))) };
  }).sort((a, b) => a.start - b.start);
  const out: { r: Row; start: number; end: number; lane: number; lanes: number }[] = [];
  let cluster: { r: Row; start: number; end: number; lane: number }[] = [];
  let lanesEnd: number[] = [];
  let clusterEnd = -1;
  const flush = () => {
    const n = cluster.reduce((a, c) => Math.max(a, c.lane + 1), 1);
    cluster.forEach((c) => out.push({ ...c, lanes: n }));
    cluster = []; lanesEnd = []; clusterEnd = -1;
  };
  for (const e of evs) {
    if (cluster.length && e.start >= clusterEnd) flush();
    let lane = lanesEnd.findIndex((end) => end <= e.start);
    if (lane < 0) { lane = lanesEnd.length; lanesEnd.push(e.end); } else lanesEnd[lane] = e.end;
    cluster.push({ ...e, lane });
    clusterEnd = Math.max(clusterEnd, e.end);
  }
  if (cluster.length) flush();
  return out;
}

export default function DashboardClient({ email }: { email: string }) {
  const [lang, setLang] = useLang();
  const t = T[lang];
  const loc = LOCALE[lang];
  const ws = WEEK_START[lang];

  const [view, setViewState] = useState<View>("month");
  const [cursor, setCursor] = useState(() => startOfDay(new Date()));
  const [sel, setSel] = useState(() => startOfDay(new Date()));
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<"" | "missing" | "generic">("");
  const [openRow, setOpenRow] = useState<Row | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [localPending, setLocalPending] = useState<LocalMeeting[]>([]);
  const [syncing, setSyncing] = useState(false);
  const reqId = useRef(0);
  const weekBody = useRef<HTMLDivElement | null>(null);
  const aside = useRef<HTMLDivElement | null>(null);
  const today = startOfDay(now);

  useEffect(() => {
    try { const v = localStorage.getItem("fm_db_view"); if (v === "month" || v === "week" || v === "list") setViewState(v); } catch {}
    try {
      const l = JSON.parse(localStorage.getItem("mr_m") || "[]");
      if (Array.isArray(l)) setLocalPending(l.filter((m: LocalMeeting) => m && m.id && !m.cloud && ((m.transcript || "").trim() || (m.summary || "").trim())));
    } catch {}
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  const setView = (v: View) => { setViewState(v); try { localStorage.setItem("fm_db_view", v); } catch {} };

  // Visible range: the whole 6-week month grid (also covers List), or one week.
  const range = useMemo(() => {
    if (view === "week") { const s = startOfWeek(cursor, ws); return { from: s, to: addDays(s, 7) }; }
    const s = startOfWeek(new Date(cursor.getFullYear(), cursor.getMonth(), 1), ws);
    return { from: s, to: addDays(s, 42) };
  }, [view, cursor, ws]);

  const load = useCallback(async () => {
    const my = ++reqId.current;
    setLoading(true);
    try {
      const qs = `from=${encodeURIComponent(range.from.toISOString())}&to=${encodeURIComponent(range.to.toISOString())}`;
      const r = await fetch(`/api/meetings?${qs}`, { cache: "no-store" });
      const d = await r.json().catch(() => ({}));
      if (my !== reqId.current) return;
      if (r.status === 503 && d.error === "meetings_table_missing") { setErr("missing"); setRows([]); }
      else if (!r.ok) setErr("generic");
      else { setErr(""); setRows(d.meetings || []); }
    } catch { if (my === reqId.current) setErr("generic"); }
    finally { if (my === reqId.current) setLoading(false); }
  }, [range]);
  useEffect(() => { load(); }, [load]);

  const byDay = useMemo(() => {
    const m = new Map<string, Row[]>();
    for (const r of rows) {
      const k = dayKey(new Date(r.started_at));
      const arr = m.get(k);
      if (arr) arr.push(r); else m.set(k, [r]);
    }
    return m;
  }, [rows]);
  const itemsOn = (d: Date) => byDay.get(dayKey(d)) || [];

  const periodRows = useMemo(() => view === "week" ? rows : rows.filter((r) => {
    const d = new Date(r.started_at);
    return d.getMonth() === cursor.getMonth() && d.getFullYear() === cursor.getFullYear();
  }), [rows, view, cursor]);
  const totalSec = periodRows.reduce((a, r) => a + (r.duration_sec || 0), 0);

  function shift(n: number) {
    if (view === "week") { setCursor((c) => addDays(c, 7 * n)); return; }
    const nc = new Date(cursor.getFullYear(), cursor.getMonth() + n, 1);
    setCursor(nc);
    setSel(nc.getMonth() === today.getMonth() && nc.getFullYear() === today.getFullYear() ? today : nc);
  }
  function goToday() { setCursor(today); setSel(today); }

  const periodTitle = view === "week"
    ? (() => {
        const a = range.from, b = addDays(range.to, -1);
        const sameM = a.getMonth() === b.getMonth();
        const left = a.toLocaleDateString(loc, sameM ? { day: "numeric" } : { day: "numeric", month: "short" });
        return `${left} – ${b.toLocaleDateString(loc, { day: "numeric", month: "short", year: "numeric" })}`;
      })()
    : cursor.toLocaleDateString(loc, { month: "long", year: "numeric" });

  const wdNames = useMemo(() => {
    const base = startOfWeek(new Date(2026, 0, 7), ws);
    return Array.from({ length: 7 }, (_, i) => addDays(base, i).toLocaleDateString(loc, { weekday: "short" }));
  }, [loc, ws]);

  const fmtTime = (d: Date) => d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" });
  const timeRange = (r: Row) => {
    const s = new Date(r.started_at);
    return r.duration_sec ? `${fmtTime(s)} – ${fmtTime(new Date(s.getTime() + r.duration_sec * 1000))}` : fmtTime(s);
  };

  // Week view: scroll to the earliest meeting (or 7:00) when it opens / changes week.
  useEffect(() => {
    if (view !== "week" || !weekBody.current) return;
    const first = rows.reduce((a, r) => { const d = new Date(r.started_at); return Math.min(a, d.getHours()); }, 7);
    weekBody.current.scrollTop = Math.max(0, first * HOUR_PX - 12);
  }, [view, range, rows]);

  async function syncLocal() {
    setSyncing(true);
    const done = new Set<number>();
    for (const m of localPending) { // one per request — a long meeting's live turns can be large
      try {
        const r = await fetch("/api/meetings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ meeting: toPayload(m) }) });
        if (r.ok) done.add(m.id);
        else if (r.status === 503) break;
      } catch {}
    }
    try {
      const l = JSON.parse(localStorage.getItem("mr_m") || "[]");
      localStorage.setItem("mr_m", JSON.stringify(l.map((m: LocalMeeting) => (done.has(m.id) ? { ...m, cloud: 1 } : m))));
    } catch {}
    setLocalPending((p) => p.filter((m) => !done.has(m.id)));
    setSyncing(false);
    load();
  }

  const renderItem = (r: Row, withSnippet = false) => (
    <button key={r.id} className="db-item" style={{ ["--c" as any]: colorOf(r) }} onClick={() => setOpenRow(r)}>
      <span className="db-item-bar" />
      <span style={{ minWidth: 0, flex: 1 }}>
        <span className="db-item-t">{r.title || t.untitled}</span>
        <span className="db-item-m">{timeRange(r)}{r.duration_sec ? ` · ${fmtDur(r.duration_sec, t)}` : ""}</span>
        {withSnippet && snippet(r.summary) && <span className="db-item-s">{snippet(r.summary)}</span>}
      </span>
    </button>
  );

  // ── Month grid ──
  const monthDays = useMemo(() => {
    if (view !== "month") return [];
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const lead = (first.getDay() - ws + 7) % 7;
    const dim = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const weeks = Math.ceil((lead + dim) / 7);
    return Array.from({ length: weeks * 7 }, (_, i) => addDays(range.from, i));
  }, [view, cursor, ws, range]);

  const selItems = itemsOn(sel);

  const monthView = (
    <div className="db-mgrid">
      <div className="db-cal">
        <div className="db-wd">{wdNames.map((n, i) => <div key={i}>{n}</div>)}</div>
        <div className="db-days">
          {monthDays.map((d) => {
            const items = itemsOn(d);
            const cls = "db-cell" + (d.getMonth() !== cursor.getMonth() ? " out" : "") + (sameDay(d, today) ? " today" : "") + (sameDay(d, sel) ? " sel" : "");
            return (
              <div key={dayKey(d)} className={cls} onClick={() => setSel(d)}>
                <div className="db-dnum">{d.getDate()}</div>
                {items.slice(0, 3).map((r) => (
                  <button key={r.id} className="db-chip" style={{ ["--c" as any]: colorOf(r) }} title={r.title || t.untitled}
                    onClick={(e) => { e.stopPropagation(); setSel(d); setOpenRow(r); }}>
                    <span className="db-dot" />
                    <span className="db-chip-time">{fmtTime(new Date(r.started_at))}</span>
                    <span className="db-chip-tt">{r.title || t.untitled}</span>
                  </button>
                ))}
                {items.length > 3 && (
                  <button className="db-more" onClick={(e) => {
                    e.stopPropagation(); setSel(d);
                    if (window.innerWidth < 1000) aside.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}>{t.more(items.length - 3)}</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="db-aside" ref={aside}>
        <div className="db-aside-h">{sel.toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long" })}</div>
        {selItems.length ? selItems.map((r) => renderItem(r, true)) : <div className="db-empty">{loading ? t.loading : t.emptyDay}</div>}
      </div>
    </div>
  );

  // ── Week grid ──
  const weekDays = view === "week" ? Array.from({ length: 7 }, (_, i) => addDays(range.from, i)) : [];
  const nowTop = (now.getHours() * 60 + now.getMinutes()) / 60 * HOUR_PX;
  const weekView = (
    <div className="db-week">
      {/* head is sticky inside the scroller so both share the scrollbar gutter and columns line up */}
      <div className="db-wk-scroll" ref={weekBody}>
      <div className="db-wk-head">
        <div />
        {weekDays.map((d) => (
          <div key={dayKey(d)} className={"db-wk-dh" + (sameDay(d, today) ? " today" : "")}>
            <small>{d.toLocaleDateString(loc, { weekday: "short" })}</small>
            <b>{d.getDate()}</b>
          </div>
        ))}
      </div>
      <div className="db-wk-body">
        <div className="db-gut">
          {Array.from({ length: 24 }, (_, h) => (
            <div key={h} className="db-hr">{h > 0 && <span>{new Date(2026, 0, 1, h).toLocaleTimeString(loc, { hour: "numeric" })}</span>}</div>
          ))}
        </div>
        {weekDays.map((d) => (
          <div key={dayKey(d)} className={"db-wk-col" + (sameDay(d, today) ? " today" : "")}>
            {layoutDay(itemsOn(d)).map(({ r, start, end, lane, lanes }) => (
              <button key={r.id} className={"db-ev" + (end - start < 40 ? " short" : "")} onClick={() => setOpenRow(r)} title={r.title || t.untitled}
                style={{
                  ["--c" as any]: colorOf(r),
                  top: start / 60 * HOUR_PX, height: Math.max(20, (end - start) / 60 * HOUR_PX - 2),
                  left: `calc(${(lane / lanes) * 100}% + 2px)`, width: `calc(${100 / lanes}% - 4px)`,
                }}>
                <b>{r.title || t.untitled}</b>
                <span>{timeRange(r)}</span>
              </button>
            ))}
            {sameDay(d, today) && <div className="db-now" style={{ top: nowTop }} />}
          </div>
        ))}
      </div>
      </div>
    </div>
  );

  // ── List (agenda), newest first ──
  const groups = useMemo(() => {
    const g: { day: Date; items: Row[] }[] = [];
    [...periodRows].reverse().forEach((r) => {
      const d = startOfDay(new Date(r.started_at));
      const last = g[g.length - 1];
      if (last && sameDay(last.day, d)) last.items.push(r); else g.push({ day: d, items: [r] });
    });
    return g;
  }, [periodRows]);
  const listView = (
    <div className="db-list">
      {groups.length ? groups.map(({ day, items }) => (
        <div key={dayKey(day)} className="db-lg">
          <div className={"db-lg-d" + (sameDay(day, today) ? " today" : "")}>
            <b>{day.getDate()}</b>
            <small>{day.toLocaleDateString(loc, { weekday: "short" })}</small>
          </div>
          <div className="db-lg-items">{items.map((r) => renderItem(r, true))}</div>
        </div>
      )) : <div className="db-empty">{loading ? t.loading : t.empty}</div>}
    </div>
  );

  return (
    <div className="db">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="db-bar">
        <Link href="/" className="db-brand" aria-label="Flash Meet">
          <svg viewBox="0 0 100 100" width="24" height="24" style={{ display: "block", flexShrink: 0 }} aria-hidden="true">
            <path d="M22 8 H78 a16 16 0 0 1 16 16 V60 a16 16 0 0 1 -16 16 H50 l-20 18 v-18 H22 a16 16 0 0 1 -16 -16 V24 A16 16 0 0 1 22 8 Z" fill="#1f6bff" />
            <g fill="#fff"><rect x="26" y="38" width="7.5" height="12" rx="3.75" /><rect x="39" y="29" width="7.5" height="30" rx="3.75" /><rect x="52" y="22" width="7.5" height="44" rx="3.75" /><rect x="65" y="32" width="7.5" height="24" rx="3.75" /></g>
          </svg>
          <span className="db-brand-t">Flash Meet</span>
        </Link>
        <span className="db-sp" />
        <Link href="/profile" className="db-link">🙂 {t.profile}</Link>
        <Link href="/dictionary" className="db-link">📚 {t.dict}</Link>
        <LangSwitch lang={lang} onChange={setLang} />
        <Link href="/account" className="db-link acct" title={email}>👤 {t.account}</Link>
        <Link href="/" className="db-new">{t.newM}</Link>
      </header>

      <main className="db-wrap">
        <div className="db-head">
          <div>
            <h1 className="db-h1">📅 {t.title}</h1>
            <p className="db-sub">{t.sub}</p>
          </div>
          {!err && <div className="db-stats"><span className="db-stat">{t.stats(periodRows.length, fmtDur(totalSec, t))}</span></div>}
        </div>

        {err === "missing" && <div className="db-note warn">⚠ {t.missing}</div>}
        {err === "generic" && (
          <div className="db-note warn">⚠ {t.err}<button className="db-btn" onClick={load}>{t.retry}</button></div>
        )}
        {err !== "missing" && localPending.length > 0 && (
          <div className="db-note info">
            ☁ {t.local(localPending.length)}
            <button className="db-btn" onClick={syncLocal} disabled={syncing} data-fm-busy={syncing ? "" : undefined}>{syncing ? t.syncing : t.sync}</button>
          </div>
        )}

        <div className="db-tools">
          <button className="db-btn" onClick={goToday}>{t.today}</button>
          <button className="db-nav" onClick={() => shift(-1)} aria-label="Previous">‹</button>
          <button className="db-nav" onClick={() => shift(1)} aria-label="Next">›</button>
          <span className="db-title">{periodTitle}</span>
          {loading && <span className="db-loading"><span className="db-spin" />{t.loading}</span>}
          <div className="db-seg" role="tablist">
            {(["month", "week", "list"] as View[]).map((v) => (
              <button key={v} className={view === v ? "on" : ""} onClick={() => setView(v)} role="tab" aria-selected={view === v}>{t[v]}</button>
            ))}
          </div>
        </div>

        <div className={loading && rows.length ? "db-stale" : ""}>
          {view === "month" ? monthView : view === "week" ? weekView : listView}
        </div>
      </main>

      {openRow && (
        <Drawer
          row={openRow} t={t} loc={loc} timeRange={timeRange}
          onClose={() => setOpenRow(null)}
          onDeleted={(id) => { setRows((rs) => rs.filter((r) => r.id !== id)); setOpenRow(null); }}
        />
      )}
    </div>
  );
}

function Drawer({ row, t, loc, timeRange, onClose, onDeleted }: {
  row: Row; t: Dict; loc: string; timeRange: (r: Row) => string;
  onClose: () => void; onDeleted: (id: string) => void;
}) {
  const [full, setFull] = useState<Full | null>(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState<"summary" | "transcript">(row.summary?.trim() ? "summary" : "transcript");
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let alive = true;
    setFull(null); setFailed(false);
    fetch(`/api/meetings/${row.id}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { if (alive) setFull(d.meeting); })
      .catch(() => { if (alive) setFailed(true); });
    return () => { alive = false; };
  }, [row.id]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [onClose]);

  const title = row.title || t.untitled;
  const start = new Date(row.started_at);
  const dateLine = start.toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const summary = (full?.summary ?? row.summary) || "";

  function text() {
    if (tab === "summary") return summary;
    return full ? trText(full, t) : "";
  }
  function copy() {
    navigator.clipboard.writeText(text()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }).catch(() => {});
  }
  function download() {
    const body = `# ${title}\n${dateLine} · ${timeRange(row)}\n\n===== ${t.summary.toUpperCase()} =====\n\n${summary || "—"}\n\n===== ${t.transcript.toUpperCase()} =====\n\n${full ? trText(full, t) : ""}`;
    const p = (n: number) => String(n).padStart(2, "0");
    const ymd = `${start.getFullYear()}-${p(start.getMonth() + 1)}-${p(start.getDate())}`;
    const name = (title.replace(/[\\/:*?"<>|\n\r\t]+/g, " ").trim().slice(0, 60) || "meeting") + " - " + ymd + ".txt";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + body], { type: "text/plain;charset=utf-8" }));
    a.download = name;
    a.click();
  }
  async function del() {
    if (!confirm(t.delq)) return;
    setDeleting(true);
    const r = await fetch(`/api/meetings/${row.id}`, { method: "DELETE" }).catch(() => null);
    if (!r || !r.ok) { setDeleting(false); return; }
    // Drop this device's copy too, so it doesn't reappear in the in-app history.
    try {
      const l = JSON.parse(localStorage.getItem("mr_m") || "[]");
      localStorage.setItem("mr_m", JSON.stringify(l.filter((m: LocalMeeting) => m.id !== row.client_id)));
    } catch {}
    onDeleted(row.id);
  }

  const transcriptBody = !full
    ? <div className="db-empty">{failed ? t.err : <><span className="db-spin" style={{ verticalAlign: "-2px", marginRight: 7 }} />{t.loading}</>}</div>
    : full.live && full.live.length
      ? full.live.map((p, i) => (
          <div key={i} className="db-turn">
            {p.spk != null && <span className="sp">{t.speaker} {p.spk}</span>}
            {p.src}
            {p.tgt && <span className="tl">{p.tgt}</span>}
          </div>
        ))
      : full.transcript?.trim()
        ? full.transcript.split("\n").filter(Boolean).map((line, i) => {
            const m = line.match(/^(.{1,40}?):\s*(.*)$/);
            return <div key={i} className="db-turn">{m ? <><span className="sp">{m[1]}</span>{m[2]}</> : line}</div>;
          })
        : <div className="db-empty">{t.noTranscript}</div>;

  return (
    <div className="db-ov" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside className="db-dr" role="dialog" aria-label={title}>
        <div className="db-dr-h">
          <div className="db-dr-top">
            <span className="db-dot" style={{ ["--c" as any]: colorOf(row), marginTop: 8, width: 12, height: 12 }} />
            <div className="db-dr-t">{title}</div>
            <button className="db-x" onClick={onClose} aria-label={t.close}>×</button>
          </div>
          <div className="db-dr-meta">
            <span style={{ textTransform: "capitalize" }}>{dateLine}</span>·<span>{timeRange(row)}</span>
            {row.duration_sec ? <>·<span>{fmtDur(row.duration_sec, t)}</span></> : null}
          </div>
          <div className="db-dr-tabs">
            <button className={tab === "summary" ? "on" : ""} onClick={() => setTab("summary")}>{t.summary}</button>
            <button className={tab === "transcript" ? "on" : ""} onClick={() => setTab("transcript")}>{t.transcript}</button>
          </div>
        </div>
        <div className="db-dr-b">
          {tab === "summary"
            ? (summary.trim() ? <div className="db-md" dangerouslySetInnerHTML={{ __html: md(summary) }} /> : <div className="db-empty">{t.noSummary}</div>)
            : transcriptBody}
        </div>
        <div className="db-dr-f">
          <button className="db-btn" onClick={copy}>{copied ? `✓ ${t.copied}` : t.copy}</button>
          <button className="db-btn" onClick={download} disabled={!full}>⬇ {t.download}</button>
          <button className="db-btn db-del" onClick={del} disabled={deleting} data-fm-busy={deleting ? "" : undefined}>🗑 {t.del}</button>
        </div>
      </aside>
    </div>
  );
}

const CSS = `
.db{min-height:100vh;background:#f6f8fc;font-family:'Inter',system-ui,-apple-system,sans-serif;color:#0a1124}
.db-bar{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:10px;padding:10px 20px;background:#fff;border-bottom:1px solid #e3e8f2}
.db-brand{display:inline-flex;align-items:center;gap:8px;font-weight:900;font-size:15.5px;letter-spacing:-.03em;color:#0a1124;text-decoration:none;white-space:nowrap}
.db-sp{flex:1}
.db-link{font-size:12.5px;font-weight:700;color:#5b6b8c;text-decoration:none;white-space:nowrap}
.db-new{font-size:12.5px;font-weight:800;color:#fff;background:#1f6bff;border-radius:9px;padding:8px 14px;text-decoration:none;white-space:nowrap}
.db-wrap{max-width:1280px;margin:0 auto;padding:22px 20px 60px}
.db-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:16px}
.db-h1{font-size:26px;font-weight:900;letter-spacing:-.03em}
.db-sub{font-size:13px;color:#7b88a3;font-weight:600;margin-top:3px}
.db-stats{display:flex;gap:8px;flex-wrap:wrap}
.db-stat{font-size:12px;font-weight:800;color:#1f4fff;background:#eef4ff;border:1px solid #d3e0fb;border-radius:20px;padding:5px 12px;white-space:nowrap}
.db-tools{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:14px}
.db-btn{font:inherit;font-size:13px;font-weight:800;color:#0a1124;background:#fff;border:1.5px solid #e3e8f2;border-radius:9px;padding:7px 14px;cursor:pointer;white-space:nowrap}
.db-btn:hover{background:#f7f9fd}
.db-btn:disabled{opacity:.55;cursor:default}
.db-nav{width:34px;height:34px;display:grid;place-items:center;font:inherit;font-size:20px;font-weight:700;color:#5b6b8c;background:none;border:none;border-radius:50%;cursor:pointer}
.db-nav:hover{background:#e9edf5}
.db-title{font-size:19px;font-weight:800;letter-spacing:-.02em;margin-left:4px;text-transform:capitalize}
.db-loading{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:#7b88a3;font-weight:700}
.db-spin{display:inline-block;flex-shrink:0;width:13px;height:13px;border:2px solid #d6e0f3;border-top-color:#1f6bff;border-radius:50%;animation:dbspin .7s linear infinite}
@keyframes dbspin{to{transform:rotate(360deg)}}
.db-stale{opacity:.5;transition:opacity .15s}
.db-seg{display:inline-flex;background:#eef1f7;border:1px solid #e3e8f2;border-radius:10px;padding:3px;margin-left:auto}
.db-seg button{font:inherit;font-size:12.5px;font-weight:800;color:#7b88a3;background:none;border:none;border-radius:7px;padding:6px 14px;cursor:pointer}
.db-seg button.on{background:#fff;color:#0a1124;box-shadow:0 1px 3px rgba(10,17,36,.12)}
.db-note{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:13px;font-weight:600;border-radius:12px;padding:10px 14px;margin-bottom:14px}
.db-note.info{background:#eef4ff;border:1px solid #d3e0fb;color:#1f3a8a}
.db-note.warn{background:#fffbeb;border:1px solid #fde68a;color:#92400e}
.db-note .db-btn{margin-left:auto}
.db-empty{font-size:13px;color:#9aa6bd;text-align:center;padding:26px 10px}

.db-mgrid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:16px;align-items:start}
.db-cal{background:#fff;border:1px solid #e3e8f2;border-radius:14px;overflow:hidden}
.db-wd{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));border-bottom:1px solid #e3e8f2}
.db-wd div{font-size:11px;font-weight:800;color:#7b88a3;text-transform:uppercase;letter-spacing:.04em;text-align:center;padding:9px 0}
.db-days{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}
.db-cell{min-height:112px;min-width:0;border-right:1px solid #eef1f7;border-bottom:1px solid #eef1f7;padding:4px 4px 6px;cursor:pointer;display:flex;flex-direction:column;gap:1px}
.db-cell:nth-child(7n){border-right:none}
.db-cell:hover{background:#fafbfe}
.db-cell.out{background:#fbfcfe}
.db-cell.out .db-dnum{color:#b8c1d4}
.db-cell.sel{background:#f1f6ff}
.db-dnum{align-self:center;font-size:12px;font-weight:700;color:#33405c;width:26px;height:26px;display:grid;place-items:center;border-radius:50%;margin-bottom:2px}
.db-cell.today .db-dnum{background:#1f6bff;color:#fff}
.db-chip{display:flex;align-items:center;gap:5px;width:100%;min-width:0;font:inherit;font-size:11.5px;font-weight:600;color:#33405c;background:none;border:none;border-radius:6px;padding:2px 5px;cursor:pointer;text-align:left;white-space:nowrap;overflow:hidden}
.db-chip:hover{background:#e9eef7}
.db-dot{display:inline-block;width:8px;height:8px;border-radius:50%;flex-shrink:0;background:var(--c)}
.db-chip-time{color:#7b88a3;font-weight:700;flex-shrink:0}
.db-chip-tt{overflow:hidden;text-overflow:ellipsis}
.db-more{font:inherit;font-size:11px;font-weight:800;color:#5b6b8c;background:none;border:none;text-align:left;padding:1px 6px;cursor:pointer;border-radius:6px}
.db-more:hover{background:#e9eef7}

.db-aside{background:#fff;border:1px solid #e3e8f2;border-radius:14px;padding:14px 10px;position:sticky;top:70px;scroll-margin-top:70px}
.db-aside-h{font-size:14px;font-weight:900;letter-spacing:-.01em;margin:0 6px 8px;text-transform:capitalize}
.db-item{display:flex;gap:10px;width:100%;font:inherit;text-align:left;background:none;border:1px solid transparent;border-radius:10px;padding:9px 10px;cursor:pointer;color:#0a1124}
.db-item:hover{background:#f7f9fd;border-color:#e7ebf3}
.db-item-bar{width:4px;border-radius:4px;background:var(--c);flex-shrink:0;align-self:stretch}
.db-item-t{display:block;font-size:13.5px;font-weight:800;line-height:1.35;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.db-item-m{display:block;font-size:11.5px;color:#7b88a3;font-weight:600;margin-top:2px}
.db-item-s{display:-webkit-box;font-size:12px;color:#5b6b8c;margin-top:4px;line-height:1.45;overflow:hidden;-webkit-line-clamp:2;-webkit-box-orient:vertical}

.db-week{background:#fff;border:1px solid #e3e8f2;border-radius:14px;overflow:hidden}
.db-wk-scroll{height:min(680px,calc(100vh - 250px));min-height:380px;overflow-y:auto}
.db-wk-head{display:grid;grid-template-columns:56px repeat(7,minmax(0,1fr));border-bottom:1px solid #e3e8f2;position:sticky;top:0;z-index:5;background:#fff}
.db-wk-dh{text-align:center;padding:8px 0 10px}
.db-wk-dh small{display:block;font-size:11px;font-weight:800;color:#7b88a3;text-transform:uppercase;letter-spacing:.04em}
.db-wk-dh b{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:50%;font-size:18px;font-weight:700;color:#33405c;margin-top:2px}
.db-wk-dh.today small{color:#1f6bff}
.db-wk-dh.today b{background:#1f6bff;color:#fff}
.db-wk-body{display:grid;grid-template-columns:56px repeat(7,minmax(0,1fr))}
.db-gut,.db-wk-col{height:${24 * HOUR_PX}px;position:relative}
.db-hr{height:${HOUR_PX}px;position:relative}
.db-hr span{position:absolute;top:-7px;right:8px;font-size:10.5px;font-weight:700;color:#9aa6bd;white-space:nowrap}
.db-wk-col{border-left:1px solid #eef1f7;background-image:repeating-linear-gradient(to bottom,#eef1f7 0,#eef1f7 1px,transparent 1px,transparent ${HOUR_PX}px)}
.db-wk-col.today{background-color:#fafcff}
.db-ev{position:absolute;font:inherit;text-align:left;border:none;border-radius:6px;padding:3px 6px;background:var(--c);color:#fff;cursor:pointer;overflow:hidden;box-shadow:0 0 0 1px #fff;font-size:11.5px;line-height:1.25}
.db-ev b{display:block;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-ev span{display:block;opacity:.92;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-ev:hover{filter:brightness(1.08);z-index:2}
.db-ev.short{padding-top:1px;padding-bottom:1px}.db-ev.short span{display:none}
.db-now{position:absolute;left:0;right:0;height:2px;background:#ea4335;z-index:3;pointer-events:none}
.db-now:before{content:"";position:absolute;left:-5px;top:-4px;width:10px;height:10px;border-radius:50%;background:#ea4335}

.db-list{background:#fff;border:1px solid #e3e8f2;border-radius:14px;overflow:hidden}
.db-lg{display:grid;grid-template-columns:92px minmax(0,1fr);border-bottom:1px solid #eef1f7}
.db-lg:last-child{border-bottom:none}
.db-lg-d{padding:16px 0 12px 18px}
.db-lg-d b{display:block;font-size:22px;font-weight:800;line-height:1.1}
.db-lg-d small{font-size:11px;font-weight:800;color:#7b88a3;text-transform:uppercase}
.db-lg-d.today b,.db-lg-d.today small{color:#1f6bff}
.db-lg-items{padding:6px 10px 6px 0;min-width:0}

.db-ov{position:fixed;inset:0;background:rgba(10,17,36,.38);z-index:50;display:flex;justify-content:flex-end}
.db-dr{width:580px;max-width:100%;height:100%;background:#fff;display:flex;flex-direction:column;box-shadow:-20px 0 60px -30px rgba(10,17,36,.5);animation:dbin .18s ease-out}
@keyframes dbin{from{transform:translateX(24px);opacity:.6}to{transform:none;opacity:1}}
.db-dr-h{padding:18px 20px 0;border-bottom:1px solid #eef1f7}
.db-dr-top{display:flex;align-items:flex-start;gap:10px}
.db-dr-t{flex:1;min-width:0;font-size:19px;font-weight:900;letter-spacing:-.02em;line-height:1.3;overflow-wrap:anywhere}
.db-x{font:inherit;font-size:22px;line-height:1;color:#9aa6bd;background:none;border:none;cursor:pointer;padding:2px 8px;border-radius:8px}
.db-x:hover{background:#eef1f7;color:#33405c}
.db-dr-meta{font-size:12.5px;color:#7b88a3;font-weight:600;margin:6px 0 0 22px;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.db-dr-tabs{display:flex;gap:4px;margin-top:12px}
.db-dr-tabs button{font:inherit;font-size:13px;font-weight:800;color:#7b88a3;background:none;border:none;border-bottom:2.5px solid transparent;padding:8px 10px;cursor:pointer}
.db-dr-tabs button.on{color:#1f6bff;border-bottom-color:#1f6bff}
.db-dr-b{flex:1;overflow-y:auto;padding:16px 22px 24px;font-size:14px;line-height:1.65;color:#1b2540;overflow-wrap:anywhere}
.db-md h2{font-size:15px;font-weight:900;margin:16px 0 4px;letter-spacing:-.01em;color:#0a1124}
.db-md h2:first-child{margin-top:0}
.db-md h3{font-size:14px;font-weight:800;margin:12px 0 2px}
.db-turn{padding:9px 0;border-bottom:1px solid #f0f3fa}
.db-turn .sp{display:block;font-size:11px;font-weight:800;color:#1f6bff;text-transform:uppercase;letter-spacing:.04em;margin-bottom:2px}
.db-turn .tl{display:block;color:#1f4fff;margin-top:2px}
.db-dr-f{display:flex;gap:8px;padding:12px 20px;border-top:1px solid #eef1f7;flex-wrap:wrap}
.db-del{margin-left:auto;color:#dc2626;border-color:#f1d4d4}
.db-del:hover{background:#fef2f2}

@media(max-width:1000px){.db-mgrid{grid-template-columns:minmax(0,1fr)}.db-aside{position:static}}
@media(max-width:700px){
  .db-bar{padding:9px 13px;gap:8px}.db-link.acct{display:none}
  .db-wrap{padding:16px 12px 50px}
  .db-h1{font-size:22px}
  .db-title{font-size:16px}
  .db-seg{margin-left:0;width:100%}.db-seg button{flex:1}
  .db-cell{min-height:76px;padding:3px 2px}
  .db-chip{padding:1px 3px;font-size:10.5px;gap:3px}.db-chip-time{display:none}
  .db-wk-head,.db-wk-body{grid-template-columns:40px repeat(7,minmax(0,1fr))}
  .db-wk-dh b{width:28px;height:28px;font-size:15px}
  .db-hr span{right:4px;font-size:9.5px}
  .db-ev{padding:2px 3px;font-size:10px}.db-ev span{display:none}
  .db-lg{grid-template-columns:64px minmax(0,1fr)}.db-lg-d{padding-left:12px}
}
@media(max-width:440px){.db-brand-t{display:none}.db-new{padding:8px 11px}}
`;
