"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLang, type Lang } from "@/lib/use-lang";
import LangSwitch from "../LangSwitch";

/**
 * Personal home page.
 *
 * Sources, all real: the profile row (plan + minutes, from the server), the
 * user's saved meetings (/api/meetings) merged with meetings still only on this
 * device (localStorage "mr_m"), and their dictionary (/api/glossary +
 * localStorage "fm_glossary_v1").
 */

type Usage = {
  plan: string; unlimited: boolean; bonus: number;
  day: { used: number; limit: number | null; remain: number | null };
  month: { used: number; limit: number | null; remain: number | null };
};
type Row = { id: string; client_id: number; title: string; summary: string; started_at: string; duration_sec: number };
type LocalMeeting = { id: number; title?: string; summary?: string; transcript?: string; start?: number; dur?: number; cloud?: number };
type Item = { key: string; title: string; summary: string; started: number; dur: number; local: boolean };
type Range = 7 | 30 | 90;
type Filter = "all" | "summarized" | "plain" | "local";

const PLAN_LABEL: Record<string, string> = { free: "Free", pro: "Pro", business: "Business", enterprise: "Enterprise" };
const LOCALE: Record<Lang, string> = { en: "en-US", vi: "vi-VN", ko: "ko-KR" };
const BLUE = "#1f6bff";

type Dict = {
  navHome: string; navMeetings: string; navDict: string; navConf: string; navPricing: string; search: string;
  editProfile: string; upgrade: string; memberSince: (d: string) => string;
  creditsTitle: string; minutesLeft: string; ofTotal: (n: string) => string; usedThisMonth: string; usedToday: string;
  unlimited: string; unlimitedNote: string; bonusNote: (n: number) => string;
  quickTitle: string; qHistory: string; qDict: string; qConf: string; qBilling: string; upsellTitle: string; upsellSub: string;
  title: string; sub: string; historyTitle: string;
  fAll: string; fSummarized: string; fPlain: string; fLocal: string; searchMeetings: string;
  range: (d: number) => string; colName: string; colTime: string; colDur: string; colStatus: string;
  stSummarized: string; stPlain: string; stLocal: string; min: string; untitled: string;
  empty: string; emptyHint: string; newMeeting: string; viewAll: string; loading: string; err: string; retry: string;
  actSummary: string; actHide: string; actDownload: string; actOpen: string; noSummary: string;
  statsTitle: string; totalMin: string; vsPrev: (p: string) => string; noPrev: string;
  meterTitle: string; used: string; left: string;
  effTitle: string; eMeetings: string; eHours: string; eSummaries: string; eAvg: string;
  distTitle: string; dShort: string; dMid: string; dLong: string;
  tipsTitle: string; tipBusiest: (d: string) => string; tipAvg: (n: number) => string; tipNoSummary: (n: number) => string;
  tipDict: (n: number) => string; tipDictEmpty: string; tipQuota: (n: number) => string; tipStart: string;
  dictTitle: string; dictSaved: (n: number) => string; dictManage: string;
};

const VI: Dict = {
  navHome: "Trang chủ", navMeetings: "Cuộc họp", navDict: "Từ điển", navConf: "Conference mode", navPricing: "Bảng giá",
  search: "Tìm cuộc họp, nội dung…",
  editProfile: "Chỉnh sửa hồ sơ", upgrade: "Nâng cấp", memberSince: (d) => `Tham gia ${d}`,
  creditsTitle: "Tín dụng của bạn", minutesLeft: "phút còn lại", ofTotal: (n) => `${n} phút`,
  usedThisMonth: "Đã dùng tháng này", usedToday: "Đã dùng hôm nay",
  unlimited: "Không giới hạn", unlimitedNote: "Gói của bạn không giới hạn số phút mỗi tháng.",
  bonusNote: (n) => `🎁 Còn ${n} phút thưởng từ giới thiệu`,
  quickTitle: "Truy cập nhanh", qHistory: "Lịch sử cuộc họp", qDict: "Từ điển chuyên ngành", qConf: "Conference mode", qBilling: "Thanh toán",
  upsellTitle: "Nâng cấp để mở khoá tất cả tính năng cao cấp", upsellSub: "Thêm phút mỗi tháng và tính năng dành cho đội nhóm.",
  title: "Trang cá nhân", sub: "Theo dõi cuộc họp, tín dụng còn lại và hiệu quả sử dụng",
  historyTitle: "Lịch sử cuộc họp",
  fAll: "Tất cả", fSummarized: "Đã tóm tắt", fPlain: "Chưa tóm tắt", fLocal: "Trên máy này", searchMeetings: "Tìm cuộc họp…",
  range: (d) => `${d} ngày qua`, colName: "Tên cuộc họp", colTime: "Thời gian", colDur: "Thời lượng", colStatus: "Trạng thái",
  stSummarized: "Đã tóm tắt", stPlain: "Hoàn tất", stLocal: "Chưa đồng bộ", min: "phút", untitled: "Cuộc họp không tên",
  empty: "Chưa có cuộc họp nào trong khoảng này.", emptyHint: "Kết thúc một cuộc họp là nó sẽ tự xuất hiện ở đây.",
  newMeeting: "+ Cuộc họp mới", viewAll: "Xem lịch đầy đủ →", loading: "Đang tải…", err: "Không tải được lịch sử cuộc họp.", retry: "Thử lại",
  actSummary: "Xem tóm tắt AI", actHide: "Ẩn tóm tắt", actDownload: "Tải xuống", actOpen: "Mở trong lịch", noSummary: "Cuộc họp này chưa có tóm tắt.",
  statsTitle: "Phân tích sử dụng", totalMin: "Tổng thời gian họp", vsPrev: (p) => `${p} so với kỳ trước`, noPrev: "Chưa có dữ liệu kỳ trước",
  meterTitle: "Tín dụng tháng này", used: "Đã dùng", left: "Còn lại",
  effTitle: "Hiệu quả", eMeetings: "Cuộc họp", eHours: "Tổng giờ", eSummaries: "Tóm tắt AI", eAvg: "Trung bình mỗi cuộc",
  distTitle: "Phân bổ thời lượng", dShort: "Dưới 15 phút", dMid: "15 – 45 phút", dLong: "Trên 45 phút",
  tipsTitle: "Gợi ý cho bạn", tipBusiest: (d) => `Bạn họp nhiều nhất vào ${d}.`,
  tipAvg: (n) => `Mỗi cuộc họp trung bình ${n} phút.`, tipNoSummary: (n) => `${n} cuộc họp chưa có tóm tắt — mở và tạo tóm tắt AI.`,
  tipDict: (n) => `Từ điển đang dùng ${n} mục. Thêm tên người dự trước buổi họp để nhận diện đúng hơn.`,
  tipDictEmpty: "Thêm tên riêng và thuật ngữ vào từ điển để Flash Meet nghe đúng hơn.",
  tipQuota: (n) => `Còn ${n} phút trong tháng này.`, tipStart: "Bắt đầu cuộc họp đầu tiên để xem thống kê ở đây.",
  dictTitle: "Từ chuyên ngành", dictSaved: (n) => `${n} từ đã lưu`, dictManage: "Quản lý từ điển",
};

const EN: Dict = {
  navHome: "Home", navMeetings: "Meetings", navDict: "Dictionary", navConf: "Conference mode", navPricing: "Pricing",
  search: "Search meetings, content…",
  editProfile: "Edit profile", upgrade: "Upgrade", memberSince: (d) => `Joined ${d}`,
  creditsTitle: "Your credit", minutesLeft: "minutes left", ofTotal: (n) => `${n} minutes`,
  usedThisMonth: "Used this month", usedToday: "Used today",
  unlimited: "Unlimited", unlimitedNote: "Your plan has no monthly minute limit.",
  bonusNote: (n) => `🎁 ${n} bonus minutes from referrals`,
  quickTitle: "Quick access", qHistory: "Meeting history", qDict: "Dictionary", qConf: "Conference mode", qBilling: "Billing",
  upsellTitle: "Upgrade to unlock every premium feature", upsellSub: "More minutes each month plus team features.",
  title: "My profile", sub: "Your meetings, the credit you have left and what Flash Meet did with it",
  historyTitle: "Meeting history",
  fAll: "All", fSummarized: "Summarized", fPlain: "No summary", fLocal: "On this device", searchMeetings: "Search meetings…",
  range: (d) => `Last ${d} days`, colName: "Meeting", colTime: "When", colDur: "Length", colStatus: "Status",
  stSummarized: "Summarized", stPlain: "Finished", stLocal: "Not synced", min: "min", untitled: "Untitled meeting",
  empty: "No meetings in this period.", emptyHint: "End a meeting and it shows up here automatically.",
  newMeeting: "+ New meeting", viewAll: "Open full calendar →", loading: "Loading…", err: "Couldn't load your meetings.", retry: "Retry",
  actSummary: "View AI summary", actHide: "Hide summary", actDownload: "Download", actOpen: "Open in calendar", noSummary: "This meeting has no summary yet.",
  statsTitle: "Usage", totalMin: "Total meeting time", vsPrev: (p) => `${p} vs previous period`, noPrev: "No data for the previous period",
  meterTitle: "This month's credit", used: "Used", left: "Left",
  effTitle: "What you got", eMeetings: "Meetings", eHours: "Total hours", eSummaries: "AI summaries", eAvg: "Average length",
  distTitle: "Length mix", dShort: "Under 15 min", dMid: "15 – 45 min", dLong: "Over 45 min",
  tipsTitle: "Suggestions", tipBusiest: (d) => `You meet most on ${d}.`,
  tipAvg: (n) => `Your meetings run ${n} minutes on average.`, tipNoSummary: (n) => `${n} meetings have no summary — open one and let AI write it.`,
  tipDict: (n) => `Your dictionary has ${n} entries in use. Add the attendees before a meeting for better recognition.`,
  tipDictEmpty: "Add names and jargon to your dictionary so Flash Meet hears them right.",
  tipQuota: (n) => `${n} minutes left this month.`, tipStart: "Run your first meeting to see statistics here.",
  dictTitle: "Dictionary", dictSaved: (n) => `${n} entries saved`, dictManage: "Manage dictionary",
};

const KO: Dict = {
  navHome: "홈", navMeetings: "회의", navDict: "사전", navConf: "컨퍼런스 모드", navPricing: "요금제",
  search: "회의·내용 검색…",
  editProfile: "프로필 수정", upgrade: "업그레이드", memberSince: (d) => `${d} 가입`,
  creditsTitle: "보유 크레딧", minutesLeft: "분 남음", ofTotal: (n) => `${n}분`,
  usedThisMonth: "이번 달 사용", usedToday: "오늘 사용",
  unlimited: "무제한", unlimitedNote: "현재 요금제는 월 사용 시간 제한이 없습니다.",
  bonusNote: (n) => `🎁 추천 보너스 ${n}분 남음`,
  quickTitle: "빠른 이동", qHistory: "회의 기록", qDict: "전문 용어 사전", qConf: "컨퍼런스 모드", qBilling: "결제",
  upsellTitle: "업그레이드하고 모든 프리미엄 기능 사용하기", upsellSub: "매월 더 많은 시간과 팀 기능을 제공합니다.",
  title: "내 프로필", sub: "회의 기록, 남은 크레딧, 사용 효과를 한눈에",
  historyTitle: "회의 기록",
  fAll: "전체", fSummarized: "요약됨", fPlain: "요약 없음", fLocal: "이 기기", searchMeetings: "회의 검색…",
  range: (d) => `최근 ${d}일`, colName: "회의", colTime: "일시", colDur: "길이", colStatus: "상태",
  stSummarized: "요약됨", stPlain: "완료", stLocal: "미동기화", min: "분", untitled: "제목 없는 회의",
  empty: "이 기간에는 회의가 없습니다.", emptyHint: "회의를 종료하면 자동으로 여기에 표시됩니다.",
  newMeeting: "+ 새 회의", viewAll: "전체 캘린더 열기 →", loading: "불러오는 중…", err: "회의 기록을 불러오지 못했습니다.", retry: "다시 시도",
  actSummary: "AI 요약 보기", actHide: "요약 숨기기", actDownload: "다운로드", actOpen: "캘린더에서 열기", noSummary: "아직 요약이 없습니다.",
  statsTitle: "사용 분석", totalMin: "총 회의 시간", vsPrev: (p) => `이전 기간 대비 ${p}`, noPrev: "이전 기간 데이터 없음",
  meterTitle: "이번 달 크레딧", used: "사용", left: "남음",
  effTitle: "성과", eMeetings: "회의 수", eHours: "총 시간", eSummaries: "AI 요약", eAvg: "평균 길이",
  distTitle: "길이 분포", dShort: "15분 미만", dMid: "15 – 45분", dLong: "45분 초과",
  tipsTitle: "추천", tipBusiest: (d) => `${d}에 회의가 가장 많습니다.`,
  tipAvg: (n) => `회의 평균 길이는 ${n}분입니다.`, tipNoSummary: (n) => `요약이 없는 회의가 ${n}건 있습니다. 열어서 AI 요약을 만들어 보세요.`,
  tipDict: (n) => `사전에 ${n}개 항목을 사용 중입니다. 회의 전에 참석자 이름을 추가하면 인식이 더 정확해집니다.`,
  tipDictEmpty: "이름과 전문 용어를 사전에 추가하면 Flash Meet가 더 정확히 인식합니다.",
  tipQuota: (n) => `이번 달 ${n}분 남았습니다.`, tipStart: "첫 회의를 진행하면 통계가 표시됩니다.",
  dictTitle: "전문 용어", dictSaved: (n) => `${n}개 저장됨`, dictManage: "사전 관리",
};

const T: Record<Lang, Dict> = { vi: VI, en: EN, ko: KO };

const DAY = 86400000;
const minutes = (sec: number) => Math.max(0, Math.round(sec / 60));
const dayKey = (ms: number) => { const d = new Date(ms); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };

export default function ProfileClient({ email, name, avatar, since, usage }:
  { email: string; name: string; avatar: string; since: string; usage: Usage }) {
  const [lang, setLang] = useLang();
  const t = T[lang] || T.en;
  const loc = LOCALE[lang] || "en-US";

  const [rows, setRows] = useState<Row[]>([]);
  const [local, setLocal] = useState<LocalMeeting[]>([]);
  const [state, setState] = useState<"load" | "ok" | "err">("load");
  const [range, setRange] = useState<Range>(30);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [openKey, setOpenKey] = useState("");
  const [dictCount, setDictCount] = useState(0);
  const [hover, setHover] = useState<{ i: number; label: string; value: number } | null>(null);

  // Cloud history for twice the window, so the chart can compare with the previous period.
  const load = useCallback(async () => {
    setState("load");
    try {
      const from = new Date(Date.now() - range * 2 * DAY).toISOString();
      const r = await fetch(`/api/meetings?from=${encodeURIComponent(from)}`, { cache: "no-store" });
      if (r.status === 503) { setRows([]); setState("ok"); return; }   // cloud history not enabled
      if (!r.ok) throw new Error("load");
      const d = await r.json();
      setRows(Array.isArray(d.meetings) ? d.meetings : []);
      setState("ok");
    } catch { setState("err"); }
  }, [range]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    try {
      const l = JSON.parse(localStorage.getItem("mr_m") || "[]");
      if (Array.isArray(l)) setLocal(l.filter((m: LocalMeeting) => m && m.id && !m.cloud && ((m.transcript || "").trim() || (m.summary || "").trim())));
    } catch {}
    const countLocalDict = () => {
      try {
        const g = JSON.parse(localStorage.getItem("fm_glossary_v1") || "[]");
        return Array.isArray(g) ? g.filter((x: any) => x && x.term && x.active !== false).length : 0;
      } catch { return 0; }
    };
    setDictCount(countLocalDict());
    fetch("/api/glossary", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const cloud = Array.isArray(d?.terms) ? d.terms.filter((x: any) => x?.active !== false) : [];
        if (cloud.length) {
          const ids = new Set(cloud.map((c: any) => c.client_id));
          let extra = 0;
          try {
            const g = JSON.parse(localStorage.getItem("fm_glossary_v1") || "[]");
            extra = (Array.isArray(g) ? g : []).filter((x: any) => x?.term && x.active !== false && !ids.has(x.client_id)).length;
          } catch {}
          setDictCount(cloud.length + extra);
        }
      })
      .catch(() => {});
  }, []);

  // One list: cloud meetings plus the ones still only on this device.
  const all = useMemo<Item[]>(() => {
    const cloud = rows.map((r) => ({
      key: "c" + r.client_id, title: r.title || "", summary: r.summary || "",
      started: new Date(r.started_at).getTime(), dur: r.duration_sec || 0, local: false,
    }));
    const seen = new Set(rows.map((r) => r.client_id));
    const mine = local.filter((m) => !seen.has(m.id)).map((m) => ({
      key: "l" + m.id, title: m.title || "", summary: m.summary || "",
      started: m.start || m.id, dur: m.dur || 0, local: true,
    }));
    return [...cloud, ...mine].filter((x) => x.started > 0).sort((a, b) => b.started - a.started);
  }, [rows, local]);

  const now = Date.now();
  const current = useMemo(() => all.filter((x) => x.started >= now - range * DAY), [all, range, now]);
  const previous = useMemo(() => all.filter((x) => x.started < now - range * DAY && x.started >= now - range * 2 * DAY), [all, range, now]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return current
      .filter((x) => filter === "all" || (filter === "summarized" ? !!x.summary.trim() : filter === "plain" ? !x.summary.trim() : x.local))
      .filter((x) => !needle || (x.title + " " + x.summary).toLowerCase().includes(needle));
  }, [current, filter, q]);

  const stats = useMemo(() => {
    const totalMin = current.reduce((a, x) => a + minutes(x.dur), 0);
    const prevMin = previous.reduce((a, x) => a + minutes(x.dur), 0);
    const summaries = current.filter((x) => x.summary.trim()).length;
    const byDay = new Map<string, number>();
    const byWeekday = new Map<number, number>();
    for (const x of current) {
      byDay.set(dayKey(x.started), (byDay.get(dayKey(x.started)) || 0) + minutes(x.dur));
      const w = new Date(x.started).getDay();
      byWeekday.set(w, (byWeekday.get(w) || 0) + 1);
    }
    const series = Array.from({ length: range }, (_, i) => {
      const ms = now - (range - 1 - i) * DAY;
      return { ms, value: byDay.get(dayKey(ms)) || 0 };
    });
    let busiest: number | null = null;
    byWeekday.forEach((n, w) => { if (busiest === null || n > (byWeekday.get(busiest) || 0)) busiest = w; });
    const dist = [
      { label: t.dShort, n: current.filter((x) => minutes(x.dur) < 15).length },
      { label: t.dMid, n: current.filter((x) => minutes(x.dur) >= 15 && minutes(x.dur) <= 45).length },
      { label: t.dLong, n: current.filter((x) => minutes(x.dur) > 45).length },
    ];
    const change = prevMin > 0 ? Math.round(((totalMin - prevMin) / prevMin) * 100) : null;
    return {
      totalMin, prevMin, change, summaries, series, busiest, dist,
      count: current.length, avg: current.length ? Math.round(totalMin / current.length) : 0,
      noSummary: current.length - summaries,
    };
  }, [current, previous, range, now, t]);

  const fmtDay = (ms: number) => new Date(ms).toLocaleDateString(loc, { day: "2-digit", month: "2-digit" });
  const fmtWhen = (ms: number) => new Date(ms).toLocaleString(loc, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const weekday = (w: number) => new Date(Date.UTC(2024, 0, 7 + w)).toLocaleDateString(loc, { weekday: "long", timeZone: "UTC" });
  const display = name || email.split("@")[0] || "";
  const planName = PLAN_LABEL[usage.plan] || "Free";

  const tips = useMemo(() => {
    const out: string[] = [];
    if (!current.length) out.push(t.tipStart);
    if (stats.busiest !== null) out.push(t.tipBusiest(weekday(stats.busiest)));
    if (stats.avg) out.push(t.tipAvg(stats.avg));
    if (stats.noSummary > 0) out.push(t.tipNoSummary(stats.noSummary));
    out.push(dictCount ? t.tipDict(dictCount) : t.tipDictEmpty);
    if (!usage.unlimited && usage.month.remain != null) out.push(t.tipQuota(usage.month.remain));
    return out.slice(0, 4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.length, stats, dictCount, usage, t, lang]);

  const download = (x: Item) => {
    const body = [x.title || t.untitled, fmtWhen(x.started), "", x.summary || t.noSummary].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + body], { type: "text/plain;charset=utf-8" }));
    a.download = (x.title || "meeting").replace(/[^\p{L}\p{N} _-]/gu, "").slice(0, 60) + ".txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };

  const featured = list[0];
  const peak = Math.max(1, ...stats.series.map((s) => s.value));
  const quotaPct = usage.month.limit ? Math.min(100, Math.round((usage.month.used / usage.month.limit) * 100)) : 0;
  const ring = 2 * Math.PI * 52;

  return (
    <div className="pf">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="pf-bar">
        <Link href="/" className="pf-brand" aria-label="Flash Meet">
          <svg viewBox="0 0 100 100" width="26" height="26" aria-hidden="true">
            <path d="M22 8 H78 a16 16 0 0 1 16 16 V60 a16 16 0 0 1 -16 16 H50 l-20 18 v-18 H22 a16 16 0 0 1 -16 -16 V24 A16 16 0 0 1 22 8 Z" fill={BLUE} />
            <g fill="#fff"><rect x="26" y="38" width="7.5" height="12" rx="3.75" /><rect x="39" y="29" width="7.5" height="30" rx="3.75" /><rect x="52" y="22" width="7.5" height="44" rx="3.75" /><rect x="65" y="32" width="7.5" height="24" rx="3.75" /></g>
          </svg>
          <span>Flash Meet</span>
        </Link>
        <nav className="pf-nav">
          <Link href="/">{t.navHome}</Link>
          <Link href="/dashboard">{t.navMeetings}</Link>
          <Link href="/dictionary">{t.navDict}</Link>
          <Link href="/conference-mode">{t.navConf}</Link>
          <Link href="/pricing">{t.navPricing}</Link>
        </nav>
        <div className="pf-find">
          <span aria-hidden="true">🔍</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} aria-label={t.search} />
        </div>
        <LangSwitch lang={lang} onChange={setLang} />
        <div className="pf-me">
          {avatar ? <img src={avatar} alt="" /> : <i>{(display[0] || "?").toUpperCase()}</i>}
          <div><b>{display}</b><span>{planName}</span></div>
        </div>
      </header>

      <div className="pf-wrap">
        <aside className="pf-side">
          <div className="pf-card pf-profile">
            {avatar ? <img className="pf-av" src={avatar} alt="" /> : <div className="pf-av pf-av-x">{(display[0] || "?").toUpperCase()}</div>}
            <b className="pf-name">{display}</b>
            <span className="pf-mail">{email}</span>
            <span className="pf-plan">👑 {planName}</span>
            {since && <span className="pf-since">{t.memberSince(new Date(since).toLocaleDateString(loc, { month: "short", year: "numeric" }))}</span>}
            <div className="pf-prow">
              <Link href="/account" className="pf-btn">{t.editProfile}</Link>
              <Link href="/pricing" className="pf-btn pf-pri">{t.upgrade}</Link>
            </div>
          </div>

          <div className="pf-card">
            <div className="pf-ctitle">💳 {t.creditsTitle}</div>
            {usage.unlimited ? (
              <>
                <div className="pf-big">{t.unlimited}</div>
                <p className="pf-note">{t.unlimitedNote}</p>
              </>
            ) : (
              <>
                <div className="pf-big">{(usage.month.remain ?? 0).toLocaleString(loc)} <em>{t.minutesLeft}</em></div>
                <div className="pf-track"><i style={{ width: `${quotaPct}%` }} /></div>
                <div className="pf-krow"><span>{t.usedThisMonth}</span><b>{usage.month.used.toLocaleString(loc)} {t.min}</b></div>
                <div className="pf-krow"><span>{t.ofTotal((usage.month.limit || 0).toLocaleString(loc))}</span><b>{quotaPct}%</b></div>
              </>
            )}
            {usage.day.limit != null && (
              <div className="pf-krow"><span>{t.usedToday}</span><b>{usage.day.used} / {usage.day.limit} {t.min}</b></div>
            )}
            {usage.bonus > 0 && <div className="pf-bonus">{t.bonusNote(usage.bonus)}</div>}
          </div>

          <div className="pf-quick">
            <div className="pf-qh">{t.quickTitle}</div>
            <Link href="/dashboard" className="pf-qi"><span>🗓</span>{t.qHistory}</Link>
            <Link href="/dictionary" className="pf-qi"><span>📚</span>{t.qDict}</Link>
            <Link href="/conference-mode" className="pf-qi"><span>▣</span>{t.qConf}</Link>
            <Link href="/account" className="pf-qi"><span>💳</span>{t.qBilling}</Link>
          </div>

          {!usage.unlimited && (
            <Link href="/pricing" className="pf-upsell">
              <b>👑 {t.upsellTitle}</b>
              <span>{t.upsellSub}</span>
            </Link>
          )}
        </aside>

        <main className="pf-main">
          <div className="pf-head">
            <div>
              <h1 className="pf-h1">{t.title}</h1>
              <p className="pf-sub">{t.sub}</p>
            </div>
            <Link href="/" className="pf-btn pf-pri pf-new">{t.newMeeting}</Link>
          </div>

          <section className="pf-block">
            <div className="pf-bh">
              <b>🕘 {t.historyTitle}</b>
              <Link href="/dashboard" className="pf-link">{t.viewAll}</Link>
            </div>

            <div className="pf-filters">
              {(["all", "summarized", "plain", "local"] as Filter[]).map((f) => (
                <button key={f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
                  {f === "all" ? t.fAll : f === "summarized" ? t.fSummarized : f === "plain" ? t.fPlain : t.fLocal}
                </button>
              ))}
              <div className="pf-sp" />
              <div className="pf-find pf-find-sm">
                <span aria-hidden="true">🔍</span>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.searchMeetings} aria-label={t.searchMeetings} />
              </div>
              <select className="pf-sel" value={range} onChange={(e) => setRange(Number(e.target.value) as Range)} aria-label={t.range(range)}>
                {[7, 30, 90].map((d) => <option key={d} value={d}>{t.range(d)}</option>)}
              </select>
            </div>

            {/* Cloud history can fail (offline, or storage not enabled) — meetings kept on this device still show. */}
            {state === "err" && (
              <div className="pf-warn"><span>{t.err}</span><button className="pf-btn" onClick={load}>{t.retry}</button></div>
            )}
            {state === "load" && !list.length && <div className="pf-empty">{t.loading}</div>}
            {state !== "load" && !list.length && (
              <div className="pf-empty"><b>{t.empty}</b><span>{t.emptyHint}</span></div>
            )}

            {list.length > 0 && (
              <div className="pf-table">
                <div className="pf-tr pf-th"><span>#</span><span>{t.colName}</span><span>{t.colTime}</span><span>{t.colDur}</span><span>{t.colStatus}</span></div>
                {list.slice(0, 8).map((x, i) => (
                  <div className={"pf-tr" + (featured && x.key === featured.key ? " on" : "")} key={x.key}>
                    <span className="pf-n">{i + 1}</span>
                    <span className="pf-mt"><b>{x.title || t.untitled}</b>{x.summary ? <i>{x.summary.replace(/[#*_`>-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 70)}</i> : null}</span>
                    <span className="pf-when">{fmtWhen(x.started)}</span>
                    <span>{minutes(x.dur)} {t.min}</span>
                    <span className={"pf-badge " + (x.local ? "local" : x.summary ? "ok" : "plain")}>
                      {x.local ? t.stLocal : x.summary ? t.stSummarized : t.stPlain}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {featured && (
            <section className="pf-block pf-feat">
              <div className="pf-feat-l">
                <div className="pf-thumb"><span>Flash Meet</span><b>{minutes(featured.dur)} {t.min}</b></div>
              </div>
              <div className="pf-feat-r">
                <div className="pf-feat-h">
                  <b>{featured.title || t.untitled}</b>
                  <span className={"pf-badge " + (featured.local ? "local" : featured.summary ? "ok" : "plain")}>
                    {featured.local ? t.stLocal : featured.summary ? t.stSummarized : t.stPlain}
                  </span>
                </div>
                <div className="pf-feat-meta">{fmtWhen(featured.started)} · {minutes(featured.dur)} {t.min}</div>
                <p className="pf-feat-sum">
                  {featured.summary
                    ? featured.summary.replace(/[#*_`>]/g, "").replace(/\s+/g, " ").trim().slice(0, openKey === featured.key ? 4000 : 210)
                    : t.noSummary}
                </p>
                <div className="pf-acts">
                  {featured.summary && (
                    <button className="pf-btn pf-pri" onClick={() => setOpenKey(openKey === featured.key ? "" : featured.key)}>
                      {openKey === featured.key ? t.actHide : t.actSummary}
                    </button>
                  )}
                  <button className="pf-btn" onClick={() => download(featured)}>⬇ {t.actDownload}</button>
                  <Link href="/dashboard" className="pf-btn">{t.actOpen}</Link>
                </div>
              </div>
            </section>
          )}
        </main>

        <aside className="pf-right">
          <div className="pf-card">
            <div className="pf-ctitle">📊 {t.statsTitle}</div>
            <div className="pf-hero">{stats.totalMin.toLocaleString(loc)} <em>{t.min}</em></div>
            <div className="pf-heronote">
              {t.totalMin} ·{" "}
              {stats.change === null
                ? t.noPrev
                : <b className={stats.change >= 0 ? "up" : "down"}>{t.vsPrev((stats.change > 0 ? "+" : "") + stats.change + "%")}</b>}
            </div>
            <div className="pf-chart">
              <svg viewBox="0 0 320 96" preserveAspectRatio="none" role="img"
                aria-label={`${t.totalMin}: ${stats.totalMin} ${t.min}`}>
                <line x1="0" y1="95" x2="320" y2="95" stroke="#e6ebf4" strokeWidth="1" />
                {stats.series.map((s, i) => {
                  const w = 320 / stats.series.length;
                  const bw = Math.max(2, Math.min(26, w - (w > 8 ? 4 : 1.5)));
                  const h = s.value ? Math.max(3, Math.round((s.value / peak) * 82)) : 0;
                  const x = i * w + (w - bw) / 2;
                  return (
                    <g key={i}>
                      {h > 0 && <rect x={x} y={95 - h} width={bw} height={h} rx={Math.min(4, bw / 2)} fill={BLUE} opacity={hover && hover.i !== i ? 0.45 : 1} />}
                      <rect x={i * w} y="0" width={w} height="95" fill="transparent"
                        onMouseEnter={() => setHover({ i, label: fmtDay(s.ms), value: s.value })}
                        onMouseLeave={() => setHover(null)}>
                        <title>{`${fmtDay(s.ms)}: ${s.value} ${t.min}`}</title>
                      </rect>
                    </g>
                  );
                })}
              </svg>
              {hover && (
                <div className="pf-tip" style={{ left: `${((hover.i + 0.5) / stats.series.length) * 100}%` }}>
                  <b>{hover.value} {t.min}</b><span>{hover.label}</span>
                </div>
              )}
            </div>
            <div className="pf-axis"><span>{fmtDay(stats.series[0]?.ms || now)}</span><span>{fmtDay(now)}</span></div>
          </div>

          <div className="pf-card">
            <div className="pf-ctitle">⏱ {t.meterTitle}</div>
            {usage.unlimited || usage.month.limit == null ? (
              <><div className="pf-big">{t.unlimited}</div><p className="pf-note">{t.unlimitedNote}</p></>
            ) : (
              <div className="pf-meter">
                <svg viewBox="0 0 120 120" width="118" height="118" role="img"
                  aria-label={`${t.used} ${usage.month.used} / ${usage.month.limit} ${t.min}`}>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e6edf9" strokeWidth="12" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke={BLUE} strokeWidth="12" strokeLinecap="round"
                    strokeDasharray={`${(quotaPct / 100) * ring} ${ring}`} transform="rotate(-90 60 60)" />
                  <text x="60" y="56" textAnchor="middle" className="pf-mv">{usage.month.used.toLocaleString(loc)}</text>
                  <text x="60" y="74" textAnchor="middle" className="pf-ml">{t.min}</text>
                </svg>
                <div className="pf-mrows">
                  <div><i style={{ background: BLUE }} /><span>{t.used}</span><b>{usage.month.used.toLocaleString(loc)}</b></div>
                  <div><i style={{ background: "#e6edf9" }} /><span>{t.left}</span><b>{(usage.month.remain ?? 0).toLocaleString(loc)}</b></div>
                  <div className="pf-mtot">{t.ofTotal((usage.month.limit || 0).toLocaleString(loc))}</div>
                </div>
              </div>
            )}
          </div>

          <div className="pf-card">
            <div className="pf-ctitle">✅ {t.effTitle}</div>
            <div className="pf-tiles">
              <div><b>{stats.count}</b><span>{t.eMeetings}</span></div>
              <div><b>{(stats.totalMin / 60).toFixed(1)}</b><span>{t.eHours}</span></div>
              <div><b>{stats.summaries}</b><span>{t.eSummaries}</span></div>
              <div><b>{stats.avg} {t.min}</b><span>{t.eAvg}</span></div>
            </div>
            {stats.count > 0 && (
              <>
                <div className="pf-lbl">{t.distTitle}</div>
                <div className="pf-dist">
                  {stats.dist.map((d) => (
                    <div key={d.label}>
                      <span>{d.label}</span>
                      <i><em style={{ width: `${Math.round((d.n / Math.max(1, stats.count)) * 100)}%` }} /></i>
                      <b>{d.n}</b>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="pf-card">
            <div className="pf-ctitle">💡 {t.tipsTitle}</div>
            <ul className="pf-tips">{tips.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>

          <div className="pf-card">
            <div className="pf-ctitle">📚 {t.dictTitle}</div>
            <div className="pf-big pf-big-sm">{dictCount.toLocaleString(loc)} <em>{t.dictSaved(dictCount).replace(String(dictCount), "").trim()}</em></div>
            <p className="pf-note">{dictCount ? t.tipDict(dictCount) : t.tipDictEmpty}</p>
            <Link href="/dictionary" className="pf-btn pf-full">{t.dictManage} →</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

const CSS = `
.pf{min-height:100vh;background:#f5f8fc;font-family:'Inter',system-ui,-apple-system,sans-serif;color:#0a1124}
.pf *{box-sizing:border-box}
.pf-bar{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;padding:10px 20px;background:#fff;border-bottom:1px solid #e3e8f2}
.pf-brand{display:inline-flex;align-items:center;gap:8px;font-weight:900;font-size:15.5px;letter-spacing:-.03em;color:#0a1124;text-decoration:none}
.pf-nav{display:flex;gap:4px}
.pf-nav a{font-size:12.5px;font-weight:700;color:#5b6b8c;text-decoration:none;padding:7px 10px;border-radius:9px;white-space:nowrap}
.pf-nav a:hover{background:#eef3fb;color:#1f4fff}
.pf-find{flex:1;min-width:120px;display:flex;align-items:center;gap:8px;background:#f5f8fc;border:1.5px solid #e7ecf5;border-radius:11px;padding:0 12px}
.pf-find span{font-size:12px;color:#9aa6bd}
.pf-find input{flex:1;min-width:0;border:0;background:none;outline:none;font:inherit;font-size:13px;padding:9px 0;color:#0a1124}
.pf-me{display:flex;align-items:center;gap:9px}
.pf-me img,.pf-me i{width:34px;height:34px;border-radius:50%;object-fit:cover;flex:none}
.pf-me i{display:grid;place-items:center;background:#eaf1ff;color:#1f4fff;font-style:normal;font-weight:800;font-size:14px}
.pf-me b{display:block;font-size:12.5px;line-height:1.2;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pf-me span{display:block;font-size:11px;color:#7b88a3;font-weight:600}
.pf-wrap{max-width:1560px;margin:0 auto;padding:18px 20px 60px;display:grid;grid-template-columns:272px minmax(0,1fr) 340px;gap:18px;align-items:start}
.pf-side,.pf-right{display:grid;gap:12px;min-width:0}
.pf-card{background:#fff;border:1px solid #e3e8f2;border-radius:16px;padding:15px}
.pf-profile{text-align:center;display:grid;justify-items:center;gap:4px;padding-top:20px}
.pf-av{width:78px;height:78px;border-radius:50%;object-fit:cover;border:3px solid #eaf1ff}
.pf-av-x{display:grid;place-items:center;background:#eaf1ff;color:#1f4fff;font-size:30px;font-weight:900}
.pf-name{font-size:17px;font-weight:900;letter-spacing:-.02em;margin-top:6px}
.pf-mail{font-size:11.5px;color:#7b88a3;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pf-plan{margin-top:6px;font-size:11.5px;font-weight:800;color:#fff;background:#1f6bff;border-radius:99px;padding:5px 12px}
.pf-since{font-size:11px;color:#9aa6bd;font-weight:600}
.pf-prow{display:grid;grid-template-columns:1fr 1fr;gap:7px;width:100%;margin-top:12px}
.pf-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font:inherit;font-size:12.5px;font-weight:800;color:#0a1124;background:#fff;border:1.5px solid #e3e8f2;border-radius:10px;padding:9px 12px;cursor:pointer;text-decoration:none;white-space:nowrap}
.pf-btn:hover{background:#f7f9fd}
.pf-pri{color:#fff;background:#1f6bff;border-color:#1f6bff}
.pf-pri:hover{background:#1a5ee0}
.pf-full{width:100%;margin-top:10px}
.pf-ctitle{font-size:13px;font-weight:800;margin-bottom:9px}
.pf-big{font-size:27px;font-weight:900;letter-spacing:-.04em}
.pf-big em{font-style:normal;font-size:12.5px;font-weight:700;color:#7b88a3;letter-spacing:0}
.pf-big-sm{font-size:23px}
.pf-track{height:8px;border-radius:99px;background:#eef2f8;margin:9px 0 10px;overflow:hidden}
.pf-track i{display:block;height:100%;border-radius:99px;background:#1f6bff}
.pf-krow{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11.5px;color:#7b88a3;font-weight:600;padding:3px 0}
.pf-krow b{color:#0a1124;font-size:12px}
.pf-bonus{margin-top:8px;font-size:11.5px;font-weight:700;color:#0b8043;background:#eaf7ef;border-radius:9px;padding:7px 9px}
.pf-note{margin:7px 0 0;font-size:11.5px;line-height:1.55;color:#8b97ae;font-weight:500}
.pf-quick{background:#fff;border:1px solid #e3e8f2;border-radius:16px;padding:10px}
.pf-qh{font-size:12.5px;font-weight:800;padding:6px 8px 8px}
.pf-qi{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:11px;font-size:13px;font-weight:700;color:#41506e;text-decoration:none}
.pf-qi span{width:18px;text-align:center}
.pf-qi:hover{background:#eef3fb;color:#1f4fff}
.pf-upsell{display:grid;gap:3px;background:linear-gradient(135deg,#eaf1ff,#f4f8ff);border:1px solid #d9e6ff;border-radius:16px;padding:14px;text-decoration:none}
.pf-upsell b{font-size:12.5px;color:#14336f;line-height:1.45}
.pf-upsell span{font-size:11px;color:#5b6b8c;font-weight:600;line-height:1.5}
.pf-main{display:grid;gap:14px;min-width:0}
.pf-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap}
.pf-h1{margin:0;font-size:27px;font-weight:900;letter-spacing:-.04em}
.pf-sub{margin:5px 0 0;font-size:13px;color:#7b88a3;font-weight:500}
.pf-block{background:#fff;border:1px solid #e3e8f2;border-radius:18px;padding:16px}
.pf-bh{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}
.pf-bh b{font-size:15px;font-weight:900;letter-spacing:-.02em}
.pf-link{font-size:12px;font-weight:700;color:#1f4fff;text-decoration:none}
.pf-filters{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.pf-filters button{font:inherit;font-size:12px;font-weight:700;color:#5b6b8c;background:#f5f8fc;border:1.5px solid #eef2f8;border-radius:99px;padding:7px 13px;cursor:pointer}
.pf-filters button.on{background:#1f6bff;border-color:#1f6bff;color:#fff}
.pf-sp{flex:1}
.pf-find-sm{flex:0 1 190px;min-width:140px}
.pf-find-sm input{font-size:12px;padding:7px 0}
.pf-sel{font:inherit;font-size:12px;font-weight:700;color:#41506e;background:#f5f8fc;border:1.5px solid #e7ecf5;border-radius:10px;padding:8px 10px;cursor:pointer}
.pf-table{border:1px solid #eef2f8;border-radius:14px;overflow:hidden}
.pf-tr{display:grid;grid-template-columns:34px minmax(0,1.6fr) 150px 82px 108px;gap:10px;align-items:center;padding:11px 12px;border-bottom:1px solid #f1f4fa;font-size:12.5px}
.pf-tr:last-child{border-bottom:0}
.pf-th{background:#fafbfe;font-size:11px;font-weight:800;color:#8b97ae}
.pf-tr.on{background:#f7faff}
.pf-n{color:#9aa6bd;font-weight:700}
.pf-mt b{display:block;font-size:13px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pf-mt i{display:block;font-style:normal;font-size:11px;color:#9aa6bd;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pf-when{color:#5b6b8c;font-weight:600}
.pf-badge{justify-self:start;font-size:11px;font-weight:800;border-radius:99px;padding:5px 10px;white-space:nowrap}
.pf-badge.ok{color:#0b8043;background:#eaf7ef}
.pf-badge.plain{color:#41506e;background:#eef2f8}
.pf-badge.local{color:#a8720b;background:#fdf3e2}
.pf-warn{display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#fdf3e2;border:1px solid #f3e0bd;border-radius:11px;padding:9px 12px;margin-bottom:10px;font-size:11.5px;font-weight:700;color:#8a5b06}
.pf-warn span{flex:1}
.pf-empty{display:grid;gap:6px;justify-items:center;text-align:center;padding:30px 14px;font-size:13px;color:#8b97ae;font-weight:600}
.pf-empty b{color:#41506e;font-size:13.5px}
.pf-empty span{font-size:12px;font-weight:500}
.pf-feat{display:grid;grid-template-columns:230px minmax(0,1fr);gap:16px}
.pf-thumb{position:relative;height:100%;min-height:132px;border-radius:14px;background:linear-gradient(135deg,#1f6bff,#5b8def);display:grid;place-items:center;color:#fff}
.pf-thumb span{font-size:15px;font-weight:900;letter-spacing:-.02em;opacity:.95}
.pf-thumb b{position:absolute;right:9px;bottom:9px;font-size:11px;font-weight:800;background:rgba(6,16,38,.45);border-radius:8px;padding:4px 8px}
.pf-feat-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.pf-feat-h b{font-size:16px;font-weight:900;letter-spacing:-.025em}
.pf-feat-meta{margin-top:4px;font-size:11.5px;color:#7b88a3;font-weight:600}
.pf-feat-sum{margin:9px 0 0;font-size:12.5px;line-height:1.65;color:#41506e;white-space:pre-wrap}
.pf-acts{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}
.pf-hero{font-size:30px;font-weight:900;letter-spacing:-.04em}
.pf-hero em{font-style:normal;font-size:13px;font-weight:700;color:#7b88a3;letter-spacing:0}
.pf-heronote{margin-top:2px;font-size:11.5px;color:#8b97ae;font-weight:600}
.pf-heronote b{font-weight:800}
.pf-heronote .up{color:#0b8043}
.pf-heronote .down{color:#c62828}
.pf-chart{position:relative;margin-top:12px}
.pf-chart svg{display:block;width:100%;height:96px;overflow:visible}
.pf-chart rect[fill="transparent"]{cursor:pointer}
.pf-tip{position:absolute;top:-6px;transform:translate(-50%,-100%);background:#0a1124;color:#fff;border-radius:9px;padding:6px 9px;font-size:11px;font-weight:700;white-space:nowrap;pointer-events:none;box-shadow:0 8px 20px rgba(10,20,45,.25)}
.pf-tip span{display:block;font-weight:600;opacity:.75;font-size:10px;margin-top:1px}
.pf-axis{display:flex;justify-content:space-between;margin-top:5px;font-size:10.5px;color:#9aa6bd;font-weight:600}
.pf-meter{display:flex;align-items:center;gap:14px}
.pf-mv{font-size:24px;font-weight:900;fill:#0a1124}
.pf-ml{font-size:11px;font-weight:700;fill:#8b97ae}
.pf-mrows{flex:1;min-width:0;display:grid;gap:7px}
.pf-mrows>div{display:flex;align-items:center;gap:7px;font-size:11.5px;color:#7b88a3;font-weight:600}
.pf-mrows i{width:9px;height:9px;border-radius:3px;flex:none}
.pf-mrows span{flex:1}
.pf-mrows b{color:#0a1124;font-size:12.5px}
.pf-mtot{font-size:11px;color:#9aa6bd;padding-top:2px;border-top:1px solid #eef2f8}
.pf-tiles{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.pf-tiles>div{background:#f7f9fd;border-radius:12px;padding:10px 11px}
.pf-tiles b{display:block;font-size:19px;font-weight:900;letter-spacing:-.03em}
.pf-tiles span{display:block;margin-top:1px;font-size:10.5px;color:#7b88a3;font-weight:700}
.pf-lbl{margin:12px 0 7px;font-size:11px;font-weight:800;color:#8b97ae}
.pf-dist{display:grid;gap:7px}
.pf-dist>div{display:grid;grid-template-columns:92px minmax(0,1fr) 22px;gap:8px;align-items:center;font-size:11px;color:#5b6b8c;font-weight:600}
.pf-dist i{display:block;height:8px;border-radius:99px;background:#eef2f8;overflow:hidden}
.pf-dist em{display:block;height:100%;border-radius:99px;background:#1f6bff}
.pf-dist b{text-align:right;color:#0a1124;font-size:11.5px}
.pf-tips{margin:0;padding-left:16px;display:grid;gap:7px}
.pf-tips li{font-size:11.5px;line-height:1.55;color:#41506e;font-weight:600}
@media(max-width:1280px){.pf-wrap{grid-template-columns:240px minmax(0,1fr)}.pf-right{grid-column:1/-1;grid-template-columns:repeat(auto-fit,minmax(270px,1fr))}.pf-nav a:nth-child(n+4){display:none}}
@media(max-width:900px){.pf-wrap{grid-template-columns:minmax(0,1fr);padding:14px 12px 50px}.pf-side{order:2}.pf-right{order:3}
.pf-bar{padding:10px 12px;gap:10px}.pf-nav,.pf-bar .pf-find,.pf-me div{display:none}
.pf-h1{font-size:22px}.pf-block{padding:13px}
.pf-tr{grid-template-columns:24px minmax(0,1fr) 92px;row-gap:5px}
.pf-th,.pf-when{display:none}
.pf-tr>span:nth-child(4){grid-column:2/3;font-size:11.5px;color:#7b88a3}
.pf-badge{grid-column:3/4;justify-self:end}
.pf-feat{grid-template-columns:minmax(0,1fr)}.pf-thumb{min-height:110px}
.pf-prow{grid-template-columns:1fr}}
`;
