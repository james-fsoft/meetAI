"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLang, type Lang } from "@/lib/use-lang";
import LangSwitch from "../LangSwitch";

/**
 * Personal dictionary of terms and proper nouns.
 *
 * Entries always live in localStorage (so the live engines can use them even
 * when signed out) and, when the user is signed in and the table exists, in
 * public.glossary_terms through /api/glossary.
 */

type Kind = "person" | "company" | "product" | "term" | "acronym";
type Term = {
  client_id: string;
  term: string;
  kind: Kind;
  display: string;
  aliases: string[];
  langs: string[];
  note: string;
  keep_original: boolean;
  active: boolean;
  updated_at?: string;
};

const KINDS: Kind[] = ["person", "company", "product", "term", "acronym"];
const UI_LANGS = ["vi", "en", "ko"] as const;
const LS_KEY = "fm_glossary_v1";
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
const KIND_ICON: Record<Kind, string> = { person: "👤", company: "🏢", product: "📦", term: "📘", acronym: "🔤" };
const LANG_NAME: Record<string, string> = { vi: "Tiếng Việt", en: "English", ko: "한국어" };

type Dict = {
  navHistory: string; navConference: string; navAccount: string; navNew: string;
  sideTitle: string; sideSub: string; entries: (n: number) => string; inUse: (n: number) => string;
  title: string; sub: string; guide: string; guideHide: string;
  g1t: string; g1d: string; g2t: string; g2d: string; g3t: string; g3d: string;
  all: string; kinds: Record<Kind, string>;
  search: string; add: string; importCsv: string; exportCsv: string;
  colTerm: string; colKind: string; colDisplay: string; colAliases: string; colLangs: string; colStatus: string; colActions: string;
  on: string; off: string; allLangs: string; edit: string; del: string;
  emptyRow: string; empty: string; noMatch: string;
  selected: (n: number) => string; bulkOn: string; bulkOff: string; bulkDel: string; confirmDel: (n: number) => string;
  addTitle: string; editTitle: string; modalSub: string;
  fTerm: string; fTermHint: string; fKind: string; fDisplay: string; fDisplayHint: string;
  fAliases: string; fAliasesHint: string; fAliasAdd: string; fLangs: string; fLangsHint: string;
  fNote: string; fNoteHint: string; fKeep: string; fKeepHint: string; fActive: string; fActiveHint: string;
  cancel: string; save: string; saveEdit: string; required: string;
  previewTitle: string; previewSub: string; previewSrc: string; previewTo: string; previewRun: string;
  previewRunning: string; previewResult: string; previewNeed: string; previewFail: string; previewKept: (n: number, total: number) => string;
  ctxTitle: string; ctxSub: string; ctxTerms: string; ctxPairs: string; ctxEmpty: string;
  useTitle: string; use1: string; use2: string; use3: string; useNote: string;
  tipsTitle: string; tip1: string; tip2: string; tip3: string;
  sugTitle: string; sugSub: string; sugRun: string; sugRunning: string; sugEmpty: string; sugLogin: string; sugNone: string; sugAdd: string;
  localOnly: string; cloudOn: string; signIn: string; tableMissing: string;
  syncUp: (n: number) => string; syncing: string; synced: string;
  csvErr: string; imported: (n: number) => string; savedToast: string; deletedToast: (n: number) => string;
};

const VI: Dict = {
  navHistory: "Lịch sử cuộc họp", navConference: "Conference mode", navAccount: "Tài khoản", navNew: "+ Cuộc họp mới",
  sideTitle: "Từ điển chuyên ngành", sideSub: "Quản lý thuật ngữ, tên riêng và cách viết ưu tiên cho cuộc họp.",
  entries: (n) => `${n} mục trong từ điển`, inUse: (n) => `${n} mục đang dùng`,
  title: "Từ điển chuyên ngành & tên riêng",
  sub: "Giúp Flash Meet nhận diện đúng tên người, công ty, sản phẩm và thuật ngữ chuyên môn.",
  guide: "Hướng dẫn sử dụng", guideHide: "Ẩn hướng dẫn",
  g1t: "Thêm từ hay bị nghe nhầm", g1d: "Tên người, tên công ty, sản phẩm, viết tắt — những từ máy hay nghe sai.",
  g2t: "Ghi các cách viết khác", g2d: "Thêm biến thể (Sota Tech, SOTATEK…) và chọn cách hiển thị ưu tiên.",
  g3t: "Dùng ngay ở cuộc họp sau", g3d: "Flash Meet gửi từ điển kèm mỗi phiên nhận diện, giữ đúng chính tả trong bản dịch và tóm tắt.",
  all: "Tất cả", kinds: { person: "Tên người", company: "Công ty", product: "Sản phẩm", term: "Thuật ngữ", acronym: "Viết tắt" },
  search: "Tìm từ, alias hoặc ghi chú…", add: "Thêm từ", importCsv: "Nhập CSV", exportCsv: "Xuất",
  colTerm: "Từ hoặc cụm từ", colKind: "Loại", colDisplay: "Cách hiển thị ưu tiên", colAliases: "Biến thể / alias",
  colLangs: "Ngôn ngữ áp dụng", colStatus: "Trạng thái", colActions: "Thao tác",
  on: "Đang dùng", off: "Tạm tắt", allLangs: "Mọi ngôn ngữ", edit: "Sửa", del: "Xoá",
  emptyRow: "Thêm mục mới để cải thiện độ chính xác khi nhận diện",
  empty: "Chưa có từ nào. Bấm “Thêm từ” để bắt đầu.", noMatch: "Không tìm thấy mục nào.",
  selected: (n) => `${n} mục đã chọn`, bulkOn: "Bật", bulkOff: "Tắt", bulkDel: "Xoá",
  confirmDel: (n) => `Xoá ${n} mục khỏi từ điển?`,
  addTitle: "Thêm từ chuyên ngành", editTitle: "Sửa từ chuyên ngành",
  modalSub: "Giúp Flash Meet nhận diện chính xác tên riêng và thuật ngữ trong cuộc họp.",
  fTerm: "Từ / cụm từ", fTermHint: "Nhập tên riêng, thuật ngữ hoặc cụm từ cần nhận diện.",
  fKind: "Loại", fDisplay: "Cách hiển thị ưu tiên", fDisplayHint: "Cách viết này sẽ được ưu tiên trong bản ghi và bản dịch.",
  fAliases: "Biến thể / alias", fAliasesHint: "Thêm các cách viết khác, tên viết tắt hoặc alias (nhấn Enter để thêm).",
  fAliasAdd: "Nhập thêm biến thể…", fLangs: "Ngôn ngữ áp dụng", fLangsHint: "Chọn ngôn ngữ mà từ này áp dụng.",
  fNote: "Ghi chú", fNoteHint: "Thêm mô tả ngắn để quản lý (không bắt buộc).",
  fKeep: "Giữ nguyên khi dịch", fKeepHint: "Giữ nguyên từ này khi dịch sang ngôn ngữ khác (không dịch nghĩa).",
  fActive: "Đang dùng", fActiveHint: "Dùng từ này cho các cuộc họp sắp tới.",
  cancel: "Hủy", save: "Thêm vào từ điển", saveEdit: "Lưu thay đổi", required: "Hãy nhập từ hoặc cụm từ.",
  previewTitle: "Xem trước nhận diện", previewSub: "Thử một câu để xem từ điển giữ đúng thuật ngữ trong bản dịch.",
  previewSrc: "Câu thử", previewTo: "Dịch sang", previewRun: "Thử dịch", previewRunning: "Đang dịch…",
  previewResult: "Bản dịch", previewNeed: "Hãy thêm ít nhất một từ để thử.", previewFail: "Không dịch được, thử lại sau.",
  previewKept: (n, total) => `Giữ nguyên ${n}/${total} thuật ngữ trong bản dịch.`,
  ctxTitle: "Dữ liệu gửi cho engine", ctxSub: "Đây là nội dung Flash Meet gửi kèm mỗi phiên nhận diện.",
  ctxTerms: "Từ cần nhận đúng", ctxPairs: "Cặp giữ nguyên khi dịch", ctxEmpty: "Chưa có gì để gửi.",
  useTitle: "Từ điển được dùng ở đâu", use1: "Cuộc họp trực tiếp — nhận diện và dịch", use2: "Conference mode — phụ đề hội nghị",
  use3: "Tóm tắt AI và việc cần làm", useNote: "Chỉ những mục đang bật mới được gửi.",
  tipsTitle: "Mẹo sử dụng", tip1: "Thêm tên người tham dự và tên công ty trước buổi họp.",
  tip2: "Ghi cả cách viết mà máy hay nghe nhầm vào phần biến thể.",
  tip3: "Tắt tạm một mục nếu nó gây nhận diện nhầm, thay vì xoá hẳn.",
  sugTitle: "Gợi ý từ cuộc họp gần đây", sugSub: "Quét các cuộc họp đã lưu để tìm tên riêng và thuật ngữ nên thêm vào từ điển.",
  sugRun: "Quét cuộc họp gần đây", sugRunning: "Đang quét…", sugEmpty: "Không tìm thấy từ mới nào.",
  sugLogin: "Đăng nhập để quét các cuộc họp đã lưu.", sugNone: "Chưa có cuộc họp nào được lưu để quét.", sugAdd: "Thêm",
  localOnly: "Đang lưu trên máy này", cloudOn: "Đã đồng bộ với tài khoản", signIn: "Đăng nhập để đồng bộ",
  tableMissing: "Máy chủ chưa bật lưu trữ từ điển — các mục đang lưu trên máy này.",
  syncUp: (n) => `Đưa ${n} mục lên tài khoản`, syncing: "Đang đồng bộ…", synced: "Đã đồng bộ lên tài khoản.",
  csvErr: "Không đọc được file CSV.", imported: (n) => `Đã nhập ${n} mục.`,
  savedToast: "Đã lưu vào từ điển.", deletedToast: (n) => `Đã xoá ${n} mục.`,
};

const EN: Dict = {
  navHistory: "Meeting history", navConference: "Conference mode", navAccount: "Account", navNew: "+ New meeting",
  sideTitle: "Dictionary", sideSub: "Manage terms, proper nouns and the spelling you prefer.",
  entries: (n) => `${n} entries`, inUse: (n) => `${n} in use`,
  title: "Dictionary: terms & proper nouns",
  sub: "Helps Flash Meet get people, companies, products and jargon right.",
  guide: "How it works", guideHide: "Hide",
  g1t: "Add the hard words", g1d: "People, companies, products, acronyms — whatever speech recognition keeps mishearing.",
  g2t: "List the other spellings", g2d: "Add variants (Sota Tech, SOTATEK…) and pick the spelling you want to see.",
  g3t: "Used in your next meeting", g3d: "Flash Meet sends the dictionary with every session and keeps the spelling in translations and summaries.",
  all: "All", kinds: { person: "Person", company: "Company", product: "Product", term: "Term", acronym: "Acronym" },
  search: "Search a word, alias or note…", add: "Add entry", importCsv: "Import CSV", exportCsv: "Export",
  colTerm: "Word or phrase", colKind: "Type", colDisplay: "Preferred spelling", colAliases: "Variants / aliases",
  colLangs: "Languages", colStatus: "Status", colActions: "Actions",
  on: "In use", off: "Paused", allLangs: "All languages", edit: "Edit", del: "Delete",
  emptyRow: "Add an entry to improve recognition accuracy",
  empty: "Nothing here yet. Press “Add entry” to start.", noMatch: "No entry matches.",
  selected: (n) => `${n} selected`, bulkOn: "Enable", bulkOff: "Pause", bulkDel: "Delete",
  confirmDel: (n) => `Delete ${n} entries from the dictionary?`,
  addTitle: "Add a dictionary entry", editTitle: "Edit dictionary entry",
  modalSub: "Helps Flash Meet recognize proper nouns and terms during the meeting.",
  fTerm: "Word / phrase", fTermHint: "The proper noun, term or phrase to recognize.",
  fKind: "Type", fDisplay: "Preferred spelling", fDisplayHint: "This spelling wins in the transcript and the translation.",
  fAliases: "Variants / aliases", fAliasesHint: "Other spellings, short forms or aliases (press Enter to add).",
  fAliasAdd: "Add a variant…", fLangs: "Languages", fLangsHint: "Languages this entry applies to.",
  fNote: "Note", fNoteHint: "A short description for yourself (optional).",
  fKeep: "Keep untranslated", fKeepHint: "Leave this term as it is when translating into another language.",
  fActive: "In use", fActiveHint: "Use this entry in upcoming meetings.",
  cancel: "Cancel", save: "Add to dictionary", saveEdit: "Save changes", required: "Enter a word or phrase.",
  previewTitle: "Recognition preview", previewSub: "Try a sentence and see the dictionary hold the term in the translation.",
  previewSrc: "Test sentence", previewTo: "Translate to", previewRun: "Try it", previewRunning: "Translating…",
  previewResult: "Translation", previewNeed: "Add at least one entry to try this.", previewFail: "Couldn’t translate, try again later.",
  previewKept: (n, total) => `${n}/${total} terms kept exactly in the translation.`,
  ctxTitle: "What the engine receives", ctxSub: "Flash Meet sends this along with every recognition session.",
  ctxTerms: "Words to expect", ctxPairs: "Kept as-is when translating", ctxEmpty: "Nothing to send yet.",
  useTitle: "Where the dictionary is used", use1: "Live meetings — recognition and translation", use2: "Conference mode — event captions",
  use3: "AI summary and action items", useNote: "Only entries that are in use get sent.",
  tipsTitle: "Tips", tip1: "Add the attendees and company names before the meeting.",
  tip2: "Put the wrong spellings you keep seeing into the variants.",
  tip3: "Pause an entry instead of deleting it if it causes confusion.",
  sugTitle: "Suggestions from recent meetings", sugSub: "Scan your saved meetings for names and terms worth adding.",
  sugRun: "Scan recent meetings", sugRunning: "Scanning…", sugEmpty: "No new words found.",
  sugLogin: "Sign in to scan your saved meetings.", sugNone: "No saved meeting to scan yet.", sugAdd: "Add",
  localOnly: "Saved on this device", cloudOn: "Synced with your account", signIn: "Sign in to sync",
  tableMissing: "Dictionary storage isn’t enabled on the server yet — entries stay on this device.",
  syncUp: (n) => `Upload ${n} entries`, syncing: "Syncing…", synced: "Uploaded to your account.",
  csvErr: "Couldn’t read that CSV file.", imported: (n) => `Imported ${n} entries.`,
  savedToast: "Saved to the dictionary.", deletedToast: (n) => `Deleted ${n} entries.`,
};

const KO: Dict = {
  navHistory: "회의 기록", navConference: "컨퍼런스 모드", navAccount: "계정", navNew: "+ 새 회의",
  sideTitle: "전문 용어 사전", sideSub: "용어, 고유명사, 선호 표기를 관리합니다.",
  entries: (n) => `${n}개 항목`, inUse: (n) => `${n}개 사용 중`,
  title: "전문 용어 & 고유명사 사전",
  sub: "Flash Meet가 사람·회사·제품·전문 용어를 정확히 인식하도록 돕습니다.",
  guide: "사용 안내", guideHide: "안내 숨기기",
  g1t: "잘 안 들리는 단어 추가", g1d: "사람, 회사, 제품, 약어 등 음성 인식이 자주 틀리는 단어를 넣으세요.",
  g2t: "다른 표기도 등록", g2d: "변형 표기(Sota Tech, SOTATEK…)를 추가하고 원하는 표기를 지정하세요.",
  g3t: "다음 회의부터 적용", g3d: "Flash Meet가 모든 세션에 사전을 함께 보내고, 번역·요약에서도 표기를 유지합니다.",
  all: "전체", kinds: { person: "사람", company: "회사", product: "제품", term: "용어", acronym: "약어" },
  search: "단어, 별칭, 메모 검색…", add: "항목 추가", importCsv: "CSV 가져오기", exportCsv: "내보내기",
  colTerm: "단어 또는 구", colKind: "종류", colDisplay: "선호 표기", colAliases: "변형 / 별칭",
  colLangs: "적용 언어", colStatus: "상태", colActions: "작업",
  on: "사용 중", off: "일시 중지", allLangs: "모든 언어", edit: "수정", del: "삭제",
  emptyRow: "항목을 추가해 인식 정확도를 높이세요",
  empty: "아직 항목이 없습니다. “항목 추가”를 눌러 시작하세요.", noMatch: "일치하는 항목이 없습니다.",
  selected: (n) => `${n}개 선택됨`, bulkOn: "사용", bulkOff: "중지", bulkDel: "삭제",
  confirmDel: (n) => `${n}개 항목을 사전에서 삭제할까요?`,
  addTitle: "사전 항목 추가", editTitle: "사전 항목 수정",
  modalSub: "회의 중 고유명사와 전문 용어를 정확히 인식하도록 돕습니다.",
  fTerm: "단어 / 구", fTermHint: "인식할 고유명사, 용어 또는 구를 입력하세요.",
  fKind: "종류", fDisplay: "선호 표기", fDisplayHint: "기록과 번역에서 이 표기가 우선 적용됩니다.",
  fAliases: "변형 / 별칭", fAliasesHint: "다른 표기, 약칭, 별칭을 추가하세요(Enter로 추가).",
  fAliasAdd: "변형 추가…", fLangs: "적용 언어", fLangsHint: "이 항목을 적용할 언어를 고르세요.",
  fNote: "메모", fNoteHint: "관리용 짧은 설명(선택).",
  fKeep: "번역하지 않기", fKeepHint: "다른 언어로 번역할 때 이 용어를 그대로 둡니다.",
  fActive: "사용 중", fActiveHint: "다음 회의부터 이 항목을 사용합니다.",
  cancel: "취소", save: "사전에 추가", saveEdit: "변경 저장", required: "단어 또는 구를 입력하세요.",
  previewTitle: "인식 미리보기", previewSub: "문장을 넣어 번역에서 용어가 유지되는지 확인하세요.",
  previewSrc: "테스트 문장", previewTo: "번역 언어", previewRun: "번역 시험", previewRunning: "번역 중…",
  previewResult: "번역 결과", previewNeed: "먼저 항목을 하나 이상 추가하세요.", previewFail: "번역하지 못했습니다. 나중에 다시 시도하세요.",
  previewKept: (n, total) => `번역에서 용어 ${total}개 중 ${n}개가 그대로 유지되었습니다.`,
  ctxTitle: "엔진에 전달되는 데이터", ctxSub: "인식 세션마다 Flash Meet가 함께 보내는 내용입니다.",
  ctxTerms: "정확히 인식할 단어", ctxPairs: "번역 시 유지할 쌍", ctxEmpty: "아직 보낼 내용이 없습니다.",
  useTitle: "사전이 쓰이는 곳", use1: "실시간 회의 — 인식과 번역", use2: "컨퍼런스 모드 — 행사 자막",
  use3: "AI 요약과 할 일", useNote: "사용 중인 항목만 전송됩니다.",
  tipsTitle: "사용 팁", tip1: "회의 전에 참석자와 회사 이름을 등록하세요.",
  tip2: "자주 잘못 나오는 표기를 변형에 넣어 두세요.",
  tip3: "혼동을 주는 항목은 삭제 대신 잠시 중지하세요.",
  sugTitle: "최근 회의 기반 추천", sugSub: "저장된 회의를 훑어 사전에 추가할 고유명사와 용어를 찾습니다.",
  sugRun: "최근 회의 스캔", sugRunning: "스캔 중…", sugEmpty: "새로운 단어를 찾지 못했습니다.",
  sugLogin: "로그인하면 저장된 회의를 스캔합니다.", sugNone: "스캔할 저장된 회의가 아직 없습니다.", sugAdd: "추가",
  localOnly: "이 기기에 저장됨", cloudOn: "계정과 동기화됨", signIn: "로그인하고 동기화",
  tableMissing: "서버에 사전 저장소가 아직 켜져 있지 않아 이 기기에만 저장됩니다.",
  syncUp: (n) => `${n}개 항목 업로드`, syncing: "동기화 중…", synced: "계정에 업로드했습니다.",
  csvErr: "CSV 파일을 읽을 수 없습니다.", imported: (n) => `${n}개 항목을 가져왔습니다.`,
  savedToast: "사전에 저장했습니다.", deletedToast: (n) => `${n}개 항목을 삭제했습니다.`,
};

const T: Record<Lang, Dict> = { vi: VI, en: EN, ko: KO };

const clean = (s: unknown, max: number) => (typeof s === "string" ? s.replace(/\s+/g, " ").trim().slice(0, max) : "");

function normalize(raw: any): Term | null {
  const term = clean(raw?.term, 120);
  if (!term) return null;
  return {
    client_id: clean(raw?.client_id, 64) || uid(),
    term,
    kind: KINDS.includes(raw?.kind) ? raw.kind : "term",
    display: clean(raw?.display, 120) || term,
    aliases: Array.isArray(raw?.aliases) ? raw.aliases.map((a: unknown) => clean(a, 120)).filter(Boolean).slice(0, 20) : [],
    langs: Array.isArray(raw?.langs) ? raw.langs.filter((l: unknown) => typeof l === "string" && l.length <= 5).slice(0, 5) : [],
    note: clean(raw?.note, 500),
    keep_original: raw?.keep_original !== false,
    active: raw?.active !== false,
    updated_at: typeof raw?.updated_at === "string" ? raw.updated_at : undefined,
  };
}

function readLocal(): Term[] {
  try {
    const arr = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    return Array.isArray(arr) ? (arr.map(normalize).filter(Boolean) as Term[]) : [];
  } catch { return []; }
}
function writeLocal(list: Term[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch {}
}

// CSV: term,kind,display,aliases,langs,note,keep_original,active  (aliases/langs separated by |)
function toCsv(list: Term[]) {
  const q = (s: string) => `"${String(s || "").replace(/"/g, '""')}"`;
  const head = "term,kind,display,aliases,langs,note,keep_original,active";
  const rows = list.map((t) =>
    [t.term, t.kind, t.display, t.aliases.join("|"), t.langs.join("|"), t.note, String(t.keep_original), String(t.active)].map(q).join(","));
  return [head, ...rows].join("\r\n");
}
function parseCsv(text: string): Term[] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (c !== "\r") cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (name: string) => head.indexOf(name);
  const hasHeader = idx("term") >= 0;
  const body = hasHeader ? rows.slice(1) : rows;
  const pick = (r: string[], name: string, fallback: number) => {
    const i = hasHeader ? idx(name) : fallback;
    return i >= 0 && i < r.length ? r[i] : "";
  };
  return body.map((r) => normalize({
    term: pick(r, "term", 0),
    kind: pick(r, "kind", 1).trim().toLowerCase(),
    display: pick(r, "display", 2),
    aliases: pick(r, "aliases", 3).split("|").map((s) => s.trim()).filter(Boolean),
    langs: pick(r, "langs", 4).split("|").map((s) => s.trim()).filter(Boolean),
    note: pick(r, "note", 5),
    keep_original: !/^(false|0|no)$/i.test(pick(r, "keep_original", 6).trim()),
    active: !/^(false|0|no)$/i.test(pick(r, "active", 7).trim()),
  })).filter(Boolean) as Term[];
}

/** Mirror of lib/glossary.ts buildContext(), so the panel shows exactly what the engines will send. */
function buildCtx(list: Term[]) {
  const words: string[] = [];
  const pairs: { source: string; target: string }[] = [];
  for (const t of list.filter((x) => x.active && x.term)) {
    const display = t.display || t.term;
    for (const w of [display, t.term, ...t.aliases]) if (w && !words.includes(w)) words.push(w);
    for (const a of t.aliases) if (a !== display) pairs.push({ source: a, target: display });
    if (t.keep_original) pairs.push({ source: t.term, target: display });
  }
  return { words, pairs };
}
function glossaryPromptOf(list: Term[]) {
  const use = list.filter((t) => t.active && t.term);
  if (!use.length) return "";
  const spell = use.map((t) => (t.display || t.term) + (t.aliases.length ? ` (also heard as: ${t.aliases.join(", ")})` : ""));
  const keep = use.filter((t) => t.keep_original).map((t) => t.display || t.term);
  let out = `Names and terms from the user's dictionary — always write them exactly like this:\n${spell.join("\n")}`;
  if (keep.length) out += `\nNever translate or re-spell these: ${keep.join(", ")}.`;
  return out;
}

export default function DictionaryClient() {
  const [lang, setLang] = useLang();
  const t = T[lang] || T.en;

  const [terms, setTerms] = useState<Term[]>([]);
  const [cloudIds, setCloudIds] = useState<string[]>([]);
  const [cloud, setCloud] = useState<{ signedIn: boolean; table: boolean }>({ signedIn: false, table: false });
  const [kind, setKind] = useState<Kind | "all">("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const [draft, setDraft] = useState<Term | null>(null);
  const [aliasInput, setAliasInput] = useState("");
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");
  const [guideOpen, setGuideOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [pv, setPv] = useState<{ src: string; to: Lang; out: string; state: "" | "run" | "fail" }>({ src: "", to: "en", out: "", state: "" });
  const [sug, setSug] = useState<{ items: { term: string; kind: Kind }[]; state: "" | "run" | "done"; note: "" | "login" | "none" }>({ items: [], state: "", note: "" });
  const fileRef = useRef<HTMLInputElement>(null);
  const say = useCallback((m: string) => { setToast(m); setTimeout(() => setToast(""), 2600); }, []);

  useEffect(() => {
    const local = readLocal();
    setTerms(local);
    (async () => {
      try {
        const r = await fetch("/api/glossary", { cache: "no-store" });
        const d = await r.json();
        if (d?.signedIn && !d?.tableMissing) {
          const remote = ((d.terms || []).map(normalize).filter(Boolean) as Term[]);
          const ids = remote.map((x) => x.client_id);
          const merged = [...remote, ...local.filter((l) => !ids.includes(l.client_id))];
          setTerms(merged); writeLocal(merged); setCloudIds(ids); setCloud({ signedIn: true, table: true });
        } else {
          setCloud({ signedIn: !!d?.signedIn, table: false });
        }
      } catch {}
    })();
  }, []);

  // Save locally always; push to the account when cloud storage is available.
  const persist = useCallback(async (list: Term[], changed: Term[]) => {
    setTerms(list); writeLocal(list);
    if (!cloud.table || !changed.length) return;
    try {
      const r = await fetch("/api/glossary", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ terms: changed }),
      });
      if (r.ok) setCloudIds((ids) => [...new Set([...ids, ...changed.map((c) => c.client_id)])]);
    } catch {}
  }, [cloud.table]);

  const removeIds = useCallback(async (ids: string[]) => {
    if (!ids.length) return;
    const list = terms.filter((x) => !ids.includes(x.client_id));
    setTerms(list); writeLocal(list); setSel([]);
    say(t.deletedToast(ids.length));
    if (cloud.table) {
      try {
        await fetch("/api/glossary", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }) });
        setCloudIds((c) => c.filter((x) => !ids.includes(x)));
      } catch {}
    }
  }, [terms, cloud.table, say, t]);

  const upsert = useCallback((entry: Term) => {
    const i = terms.findIndex((x) => x.client_id === entry.client_id);
    const list = i >= 0 ? terms.map((x) => (x.client_id === entry.client_id ? entry : x)) : [entry, ...terms];
    persist(list, [entry]);
  }, [terms, persist]);

  const setActive = useCallback((ids: string[], active: boolean) => {
    const changed = terms.filter((x) => ids.includes(x.client_id)).map((x) => ({ ...x, active }));
    const list = terms.map((x) => (ids.includes(x.client_id) ? { ...x, active } : x));
    persist(list, changed);
  }, [terms, persist]);

  const saveDraft = useCallback(() => {
    if (!draft) return;
    const entry = normalize(draft);
    if (!entry) { setErr(t.required); return; }
    upsert(entry); setDraft(null); setErr(""); setAliasInput(""); say(t.savedToast);
  }, [draft, upsert, say, t]);

  const onCsv = useCallback(async (file: File) => {
    try {
      const rows = parseCsv(await file.text());
      if (!rows.length) { say(t.csvErr); return; }
      const byTerm = new Map(terms.map((x) => [x.term.toLowerCase(), x]));
      const changed: Term[] = [];
      for (const r of rows) {
        const old = byTerm.get(r.term.toLowerCase());
        const entry = old ? { ...r, client_id: old.client_id } : r;
        byTerm.set(r.term.toLowerCase(), entry); changed.push(entry);
      }
      persist([...byTerm.values()], changed); say(t.imported(rows.length));
    } catch { say(t.csvErr); }
  }, [terms, persist, say, t]);

  const exportCsv = useCallback(() => {
    const blob = new Blob(["﻿" + toCsv(terms)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "flash-meet-dictionary.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, [terms]);

  const syncUp = useCallback(async () => {
    const pending = terms.filter((x) => !cloudIds.includes(x.client_id));
    if (!pending.length || !cloud.table) return;
    setSyncing(true);
    try {
      const r = await fetch("/api/glossary", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ terms: pending }),
      });
      if (r.ok) { setCloudIds((ids) => [...new Set([...ids, ...pending.map((p) => p.client_id)])]); say(t.synced); }
    } catch {} finally { setSyncing(false); }
  }, [terms, cloudIds, cloud.table, say, t]);

  const runPreview = useCallback(async () => {
    const active = terms.filter((x) => x.active);
    if (!active.length || !pv.src.trim()) return;
    setPv((p) => ({ ...p, state: "run", out: "" }));
    try {
      const r = await fetch("/api/translate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: LANG_NAME[pv.to] || "English", src: pv.src, glossary: glossaryPromptOf(active) }),
      });
      const d = await r.json();
      if (!r.ok || !d?.translation) throw new Error("fail");
      setPv((p) => ({ ...p, out: d.translation, state: "" }));
    } catch { setPv((p) => ({ ...p, state: "fail" })); }
  }, [terms, pv.src, pv.to]);

  // Ask the server to read the caller's recent meetings and propose names/terms.
  const runSuggest = useCallback(async () => {
    setSug({ items: [], state: "run", note: "" });
    try {
      const r = await fetch("/api/glossary/suggest", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ have: terms.map((x) => x.term) }),
      });
      const d = await r.json().catch(() => null);
      if (r.status === 401 || d?.signedIn === false) { setSug({ items: [], state: "done", note: "login" }); return; }
      if (d?.noMeetings) { setSug({ items: [], state: "done", note: "none" }); return; }
      setSug({ items: (d?.suggestions || []).filter((x: any) => x?.term), state: "done", note: "" });
    } catch { setSug({ items: [], state: "done", note: "" }); }
  }, [terms]);

  const SAMPLE: Record<Lang, (w: string) => string> = {
    vi: (w) => `Hôm nay ${w} sẽ trình bày kế hoạch hợp tác trong quý tới.`,
    en: (w) => `Today ${w} will present the cooperation plan for next quarter.`,
    ko: (w) => `오늘 ${w}가 다음 분기 협력 계획을 발표합니다.`,
  };

  // Prefill the test sentence with a real entry the first time there is one.
  useEffect(() => {
    if (pv.src) return;
    const first = terms.find((x) => x.active);
    if (first) setPv((p) => ({ ...p, src: (SAMPLE[lang] || SAMPLE.en)(first.display || first.term), to: lang === "en" ? "vi" : "en" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms, lang]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: terms.length };
    for (const k of KINDS) c[k] = terms.filter((x) => x.kind === k).length;
    return c;
  }, [terms]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return terms
      .filter((x) => (kind === "all" ? true : x.kind === kind))
      .filter((x) => !needle || [x.term, x.display, x.note, ...x.aliases].join(" ").toLowerCase().includes(needle))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [terms, kind, q]);

  const ctx = useMemo(() => buildCtx(terms), [terms]);
  const activeWords = useMemo(() => terms.filter((x) => x.active).map((x) => x.display || x.term), [terms]);
  const pending = cloud.table ? terms.filter((x) => !cloudIds.includes(x.client_id)).length : 0;
  const kept = useMemo(() => {
    if (!pv.out) return null;
    const used = activeWords.filter((w) => pv.src.toLowerCase().includes(w.toLowerCase()));
    if (!used.length) return null;
    return { ok: used.filter((w) => pv.out.toLowerCase().includes(w.toLowerCase())).length, total: used.length };
  }, [pv.out, pv.src, activeWords]);

  // Highlight dictionary terms without a regex (terms can contain any character).
  const mark = (text: string, words: string[]) => {
    if (!text) return null;
    const hits = words.filter((w) => w && text.toLowerCase().includes(w.toLowerCase())).sort((a, b) => b.length - a.length);
    if (!hits.length) return text;
    const low = text.toLowerCase();
    const at = (i: number) => hits.find((w) => low.startsWith(w.toLowerCase(), i));
    const out: React.ReactNode[] = [];
    let i = 0, key = 0;
    while (i < text.length) {
      const hit = at(i);
      if (hit) { out.push(<mark key={key++}>{text.slice(i, i + hit.length)}</mark>); i += hit.length; continue; }
      let j = i + 1;
      while (j < text.length && !at(j)) j++;
      out.push(<span key={key++}>{text.slice(i, j)}</span>);
      i = j;
    }
    return out;
  };

  const newDraft = (): Term => ({
    client_id: uid(), term: "", kind: "company", display: "", aliases: [], langs: [], note: "",
    keep_original: true, active: true,
  });
  const patch = (p: Partial<Term>) => setDraft((d) => (d ? { ...d, ...p } : d));
  const addAlias = () => {
    const v = clean(aliasInput, 120);
    if (!v || !draft) return;
    if (!draft.aliases.includes(v)) patch({ aliases: [...draft.aliases, v] });
    setAliasInput("");
  };
  const allSel = rows.length > 0 && rows.every((r) => sel.includes(r.client_id));

  return (
    <div className="gl">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="gl-bar">
        <Link href="/" className="gl-brand"><img src="/logo.svg" alt="" width={26} height={26} />Flash Meet</Link>
        <div className="gl-sp" />
        <Link href="/dashboard" className="gl-link">{t.navHistory}</Link>
        <Link href="/conference-mode" className="gl-link">{t.navConference}</Link>
        <Link href="/account" className="gl-link gl-hide-sm">{t.navAccount}</Link>
        <LangSwitch lang={lang} onChange={setLang} />
        <Link href="/" className="gl-new">{t.navNew}</Link>
      </header>

      <div className="gl-wrap">
        <aside className="gl-side">
          <div className="gl-side-h">{t.sideTitle}</div>
          <p className="gl-side-s">{t.sideSub}</p>

          <div className="gl-card">
            <div className="gl-stat"><b>{terms.length}</b><span>{t.entries(terms.length)}</span></div>
            <div className="gl-stat gl-stat-ok"><b>{terms.filter((x) => x.active).length}</b><span>{t.inUse(terms.filter((x) => x.active).length)}</span></div>
            <div className={"gl-store " + (cloud.table ? "on" : "")}>
              {cloud.table ? t.cloudOn : cloud.signedIn ? t.tableMissing : t.localOnly}
              {!cloud.signedIn && <Link href="/login" className="gl-store-a">{t.signIn}</Link>}
            </div>
            {pending > 0 && (
              <button className="gl-sync" onClick={syncUp} disabled={syncing}>{syncing ? t.syncing : t.syncUp(pending)}</button>
            )}
          </div>

          <nav className="gl-nav">
            <Link href="/dashboard" className="gl-nav-i"><span>🗓</span>{t.navHistory}</Link>
            <Link href="/conference-mode" className="gl-nav-i"><span>▣</span>{t.navConference}</Link>
            <span className="gl-nav-i on"><span>📚</span>{t.sideTitle}</span>
            <Link href="/account" className="gl-nav-i"><span>⚙</span>{t.navAccount}</Link>
          </nav>

          <div className="gl-tips">
            <div className="gl-tips-h">💡 {t.tipsTitle}</div>
            <ul><li>{t.tip1}</li><li>{t.tip2}</li><li>{t.tip3}</li></ul>
          </div>
        </aside>

        <main className="gl-main">
          <div className="gl-head">
            <div>
              <h1 className="gl-h1">{t.title}</h1>
              <p className="gl-sub">{t.sub}</p>
            </div>
            <button className="gl-btn" onClick={() => setGuideOpen((v) => !v)}>📖 {guideOpen ? t.guideHide : t.guide}</button>
          </div>

          {guideOpen && (
            <ol className="gl-guide">
              <li><b>1</b><div><strong>{t.g1t}</strong><span>{t.g1d}</span></div></li>
              <li><b>2</b><div><strong>{t.g2t}</strong><span>{t.g2d}</span></div></li>
              <li><b>3</b><div><strong>{t.g3t}</strong><span>{t.g3d}</span></div></li>
            </ol>
          )}

          <div className="gl-tabs">
            <button className={kind === "all" ? "on" : ""} onClick={() => setKind("all")}>{t.all} ({counts.all})</button>
            {KINDS.map((k) => (
              <button key={k} className={kind === k ? "on" : ""} onClick={() => setKind(k)}>{t.kinds[k]} ({counts[k] || 0})</button>
            ))}
          </div>

          <div className="gl-tools">
            <div className="gl-search">
              <span>🔍</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search} />
            </div>
            <button className="gl-primary" onClick={() => { setDraft(newDraft()); setErr(""); setAliasInput(""); }}>+ {t.add}</button>
            <button className="gl-btn" onClick={() => fileRef.current?.click()}>⬇ {t.importCsv}</button>
            <button className="gl-btn" onClick={exportCsv} disabled={!terms.length}>⬆ {t.exportCsv}</button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" hidden
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onCsv(f); e.target.value = ""; }} />
          </div>

          {sel.length > 0 && (
            <div className="gl-bulk">
              <b>{t.selected(sel.length)}</b>
              <button onClick={() => { setActive(sel, true); setSel([]); }}>{t.bulkOn}</button>
              <button onClick={() => { setActive(sel, false); setSel([]); }}>{t.bulkOff}</button>
              <button className="gl-danger" onClick={() => { if (confirm(t.confirmDel(sel.length))) removeIds(sel); }}>{t.bulkDel}</button>
            </div>
          )}

          <div className="gl-table">
            <div className="gl-tr gl-th">
              <label className="gl-cb"><input type="checkbox" checked={allSel}
                onChange={(e) => setSel(e.target.checked ? rows.map((r) => r.client_id) : [])} /></label>
              <div>{t.colTerm}</div><div>{t.colKind}</div><div>{t.colDisplay}</div>
              <div>{t.colAliases}</div><div>{t.colLangs}</div><div>{t.colStatus}</div><div className="gl-end">{t.colActions}</div>
            </div>

            {rows.map((r) => (
              <div className={"gl-tr" + (r.active ? "" : " off")} key={r.client_id}>
                <label className="gl-cb"><input type="checkbox" checked={sel.includes(r.client_id)}
                  onChange={(e) => setSel((s) => (e.target.checked ? [...s, r.client_id] : s.filter((x) => x !== r.client_id)))} /></label>
                <div className="gl-term"><b>{r.term}</b>{r.note && <i>{r.note}</i>}</div>
                <div><span className="gl-kind">{KIND_ICON[r.kind]} {t.kinds[r.kind]}</span></div>
                <div className="gl-disp">{r.display}</div>
                <div className="gl-alias">
                  {r.aliases.slice(0, 2).map((a) => <em key={a}>{a}</em>)}
                  {r.aliases.length > 2 && <em className="more">+{r.aliases.length - 2}</em>}
                  {!r.aliases.length && <span className="gl-dash">—</span>}
                </div>
                <div className="gl-langs">{r.langs.length ? r.langs.map((l) => LANG_NAME[l] || l).join(", ") : t.allLangs}</div>
                <div className="gl-statecell">
                  <button className={"gl-toggle" + (r.active ? " on" : "")} aria-label={r.active ? t.on : t.off}
                    onClick={() => setActive([r.client_id], !r.active)}><i /></button>
                  <span>{r.active ? t.on : t.off}</span>
                </div>
                <div className="gl-acts gl-end">
                  <button title={t.edit} onClick={() => { setDraft(r); setErr(""); setAliasInput(""); }}>✏️</button>
                  <button title={t.del} onClick={() => { if (confirm(t.confirmDel(1))) removeIds([r.client_id]); }}>🗑</button>
                </div>
              </div>
            ))}

            {!rows.length && <div className="gl-empty">{terms.length ? t.noMatch : t.empty}</div>}
            <button className="gl-addrow" onClick={() => { setDraft(newDraft()); setErr(""); setAliasInput(""); }}>＋ {t.emptyRow}</button>
          </div>
        </main>

        <aside className="gl-right">
          <div className="gl-panel">
            <div className="gl-panel-h">📊 {t.previewTitle}</div>
            <p className="gl-panel-s">{t.previewSub}</p>
            {!terms.some((x) => x.active) ? (
              <p className="gl-note">{t.previewNeed}</p>
            ) : (
              <>
                <label className="gl-lbl">{t.previewSrc}</label>
                <textarea className="gl-ta" rows={3} value={pv.src} onChange={(e) => setPv((p) => ({ ...p, src: e.target.value }))} />
                <div className="gl-pvrow">
                  <select className="gl-sel" value={pv.to} onChange={(e) => setPv((p) => ({ ...p, to: e.target.value as Lang }))}>
                    {UI_LANGS.map((l) => <option key={l} value={l}>{t.previewTo}: {LANG_NAME[l]}</option>)}
                  </select>
                  <button className="gl-primary" onClick={runPreview} disabled={pv.state === "run"}>
                    {pv.state === "run" ? t.previewRunning : t.previewRun}
                  </button>
                </div>
                {pv.out && (
                  <div className="gl-bubble">
                    <span className="gl-bubble-h">{t.previewResult}</span>
                    <p>{mark(pv.out, activeWords)}</p>
                    {kept && <span className={"gl-kept" + (kept.ok === kept.total ? " ok" : "")}>{t.previewKept(kept.ok, kept.total)}</span>}
                  </div>
                )}
                {pv.state === "fail" && <p className="gl-note">{t.previewFail}</p>}
              </>
            )}
          </div>

          <div className="gl-panel">
            <div className="gl-panel-h">✨ {t.sugTitle}</div>
            <p className="gl-panel-s">{t.sugSub}</p>
            <button className="gl-btn" onClick={runSuggest} disabled={sug.state === "run"}>{sug.state === "run" ? t.sugRunning : t.sugRun}</button>
            {sug.items.length > 0 && (
              <div className="gl-sugs">
                {sug.items.map((sg, i) => (
                  <div className="gl-sug" key={sg.term + i}>
                    <span className="gl-sug-n">{i + 1}</span>
                    <div><b>{sg.term}</b><em>{t.kinds[sg.kind]}</em></div>
                    <button className="gl-btn" onClick={() => {
                      const entry = normalize({ client_id: uid(), term: sg.term, kind: sg.kind, display: sg.term, aliases: [], langs: [], note: "", keep_original: true, active: true });
                      if (entry) { upsert(entry); say(t.savedToast); }
                      setSug((p) => ({ ...p, items: p.items.filter((x) => x.term !== sg.term) }));
                    }}>+ {t.sugAdd}</button>
                  </div>
                ))}
              </div>
            )}
            {sug.state === "done" && !sug.items.length && (
              <p className="gl-note">{sug.note === "login" ? t.sugLogin : sug.note === "none" ? t.sugNone : t.sugEmpty}</p>
            )}
          </div>

          <div className="gl-panel">
            <div className="gl-panel-h">🧠 {t.ctxTitle}</div>
            <p className="gl-panel-s">{t.ctxSub}</p>
            {!ctx.words.length ? <p className="gl-note">{t.ctxEmpty}</p> : (
              <>
                <label className="gl-lbl">{t.ctxTerms} ({ctx.words.length})</label>
                <div className="gl-chips">{ctx.words.slice(0, 18).map((w) => <span key={w}>{w}</span>)}
                  {ctx.words.length > 18 && <span className="more">+{ctx.words.length - 18}</span>}</div>
                {ctx.pairs.length > 0 && (
                  <>
                    <label className="gl-lbl">{t.ctxPairs} ({ctx.pairs.length})</label>
                    <div className="gl-pairs">
                      {ctx.pairs.slice(0, 6).map((p, i) => <div key={i}><em>{p.source}</em> → <b>{p.target}</b></div>)}
                      {ctx.pairs.length > 6 && <div className="gl-dash">+{ctx.pairs.length - 6}</div>}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="gl-panel">
            <div className="gl-panel-h">✅ {t.useTitle}</div>
            <ul className="gl-uses"><li>{t.use1}</li><li>{t.use2}</li><li>{t.use3}</li></ul>
            <p className="gl-note">{t.useNote}</p>
          </div>
        </aside>
      </div>

      {draft && (
        <div className="gl-back" onMouseDown={(e) => { if (e.target === e.currentTarget) setDraft(null); }}>
          <div className="gl-modal" role="dialog" aria-modal="true" aria-label={t.addTitle}>
            <header>
              <span className="gl-mico">🔤</span>
              <div>
                <h2>{terms.some((x) => x.client_id === draft.client_id) ? t.editTitle : t.addTitle}</h2>
                <p>{t.modalSub}</p>
              </div>
              <button className="gl-x" onClick={() => setDraft(null)} aria-label={t.cancel}>✕</button>
            </header>

            <div className="gl-form">
              <label className="gl-frow">
                <span>{t.fTerm} <i>*</i></span>
                <div>
                  <input className="gl-in" value={draft.term} autoFocus
                    onChange={(e) => patch({ term: e.target.value, display: draft.display === draft.term ? e.target.value : draft.display })} />
                  <small>{t.fTermHint}</small>
                </div>
              </label>

              <div className="gl-frow">
                <span>{t.fKind} <i>*</i></span>
                <div className="gl-chipset">
                  {KINDS.map((k) => (
                    <button key={k} className={draft.kind === k ? "on" : ""} onClick={() => patch({ kind: k })}>
                      {KIND_ICON[k]} {t.kinds[k]}
                    </button>
                  ))}
                </div>
              </div>

              <label className="gl-frow">
                <span>{t.fDisplay} <i>*</i></span>
                <div>
                  <input className="gl-in" value={draft.display} onChange={(e) => patch({ display: e.target.value })} />
                  <small>{t.fDisplayHint}</small>
                </div>
              </label>

              <div className="gl-frow">
                <span>{t.fAliases}</span>
                <div>
                  <div className="gl-aliasbox">
                    {draft.aliases.map((a) => (
                      <span key={a} className="gl-atag">{a}
                        <button onClick={() => patch({ aliases: draft.aliases.filter((x) => x !== a) })} aria-label={t.del}>✕</button>
                      </span>
                    ))}
                    <input value={aliasInput} placeholder={t.fAliasAdd}
                      onChange={(e) => setAliasInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addAlias(); } }}
                      onBlur={addAlias} />
                  </div>
                  <small>{t.fAliasesHint}</small>
                </div>
              </div>

              <div className="gl-frow">
                <span>{t.fLangs}</span>
                <div>
                  <div className="gl-chipset">
                    <button className={!draft.langs.length ? "on" : ""} onClick={() => patch({ langs: [] })}>{t.all}</button>
                    {UI_LANGS.map((l) => (
                      <button key={l} className={draft.langs.includes(l) ? "on" : ""}
                        onClick={() => patch({ langs: draft.langs.includes(l) ? draft.langs.filter((x) => x !== l) : [...draft.langs, l] })}>
                        {LANG_NAME[l]}
                      </button>
                    ))}
                  </div>
                  <small>{t.fLangsHint}</small>
                </div>
              </div>

              <label className="gl-frow">
                <span>{t.fNote}</span>
                <div>
                  <textarea className="gl-ta" rows={2} maxLength={500} value={draft.note} onChange={(e) => patch({ note: e.target.value })} />
                  <div className="gl-count">{draft.note.length}/500</div>
                  <small>{t.fNoteHint}</small>
                </div>
              </label>

              <div className="gl-switches">
                <div className="gl-switch">
                  <div><b>{t.fActive}</b><small>{t.fActiveHint}</small></div>
                  <button className={"gl-toggle" + (draft.active ? " on" : "")} onClick={() => patch({ active: !draft.active })}
                    aria-label={t.fActive}><i /></button>
                </div>
                <div className="gl-switch">
                  <div><b>{t.fKeep}</b><small>{t.fKeepHint}</small></div>
                  <button className={"gl-toggle" + (draft.keep_original ? " on" : "")} onClick={() => patch({ keep_original: !draft.keep_original })}
                    aria-label={t.fKeep}><i /></button>
                </div>
              </div>

              {err && <p className="gl-err">{err}</p>}
            </div>

            <footer>
              <button className="gl-btn gl-ghost" onClick={() => { setDraft(null); fileRef.current?.click(); }}>⬇ {t.importCsv}</button>
              <div className="gl-sp" />
              <button className="gl-btn" onClick={() => setDraft(null)}>{t.cancel}</button>
              <button className="gl-primary" onClick={saveDraft}>
                {terms.some((x) => x.client_id === draft.client_id) ? t.saveEdit : t.save}
              </button>
            </footer>
          </div>
        </div>
      )}

      {toast && <div className="gl-toast">{toast}</div>}
    </div>
  );
}

const CSS = `
.gl{min-height:100vh;background:#f5f8fc;font-family:'Inter',system-ui,-apple-system,sans-serif;color:#0a1124}
.gl *{box-sizing:border-box}
.gl-bar{position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:12px;padding:10px 20px;background:#fff;border-bottom:1px solid #e3e8f2}
.gl-brand{display:inline-flex;align-items:center;gap:8px;font-weight:900;font-size:15.5px;letter-spacing:-.03em;color:#0a1124;text-decoration:none}
.gl-sp{flex:1}
.gl-link{font-size:12.5px;font-weight:700;color:#5b6b8c;text-decoration:none;white-space:nowrap}
.gl-link:hover{color:#1f6bff}
.gl-new{font-size:12.5px;font-weight:800;color:#fff;background:#1f6bff;border-radius:9px;padding:8px 13px;text-decoration:none;white-space:nowrap}
.gl-wrap{max-width:1560px;margin:0 auto;padding:18px 20px 60px;display:grid;grid-template-columns:262px minmax(0,1fr) 340px;gap:18px;align-items:start}
.gl-side-h{font-size:19px;font-weight:900;letter-spacing:-.03em}
.gl-side-s{margin:5px 0 12px;font-size:12.5px;line-height:1.55;color:#7b88a3;font-weight:500}
.gl-card,.gl-panel,.gl-tips{background:#fff;border:1px solid #e3e8f2;border-radius:15px;padding:14px}
.gl-card{display:grid;gap:9px;margin-bottom:12px}
.gl-stat{display:flex;align-items:baseline;gap:8px}
.gl-stat b{font-size:22px;font-weight:900;letter-spacing:-.03em}
.gl-stat span{font-size:12px;color:#7b88a3;font-weight:600}
.gl-stat-ok b{color:#0b8043}
.gl-store{font-size:11.5px;line-height:1.5;color:#7b88a3;background:#f5f8fc;border-radius:10px;padding:8px 10px;font-weight:600}
.gl-store.on{color:#0b8043;background:#eaf7ef}
.gl-store-a{display:block;margin-top:4px;color:#1f6bff;font-weight:800;text-decoration:none}
.gl-sync{font:inherit;font-size:12px;font-weight:800;color:#fff;background:#1f6bff;border:0;border-radius:9px;padding:9px;cursor:pointer}
.gl-sync:disabled{opacity:.6}
.gl-nav{display:grid;gap:2px;margin-bottom:12px}
.gl-nav-i{display:flex;align-items:center;gap:10px;padding:9px 11px;border-radius:11px;font-size:13px;font-weight:700;color:#41506e;text-decoration:none}
.gl-nav-i span{width:18px;text-align:center}
.gl-nav-i:hover{background:#eef3fb}
.gl-nav-i.on{background:#eaf1ff;color:#1f4fff}
.gl-tips-h{font-size:13px;font-weight:800;margin-bottom:6px}
.gl-tips ul{margin:0;padding-left:16px;display:grid;gap:5px}
.gl-tips li{font-size:11.5px;line-height:1.55;color:#5b6b8c;font-weight:500}
.gl-main{background:#fff;border:1px solid #e3e8f2;border-radius:18px;padding:18px 18px 16px;min-width:0}
.gl-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;flex-wrap:wrap}
.gl-h1{margin:0;font-size:25px;font-weight:900;letter-spacing:-.035em}
.gl-sub{margin:5px 0 0;font-size:13px;color:#7b88a3;font-weight:500}
.gl-btn{font:inherit;font-size:12.5px;font-weight:800;color:#0a1124;background:#fff;border:1.5px solid #e3e8f2;border-radius:10px;padding:8px 13px;cursor:pointer;white-space:nowrap}
.gl-btn:hover{background:#f7f9fd}
.gl-btn:disabled{opacity:.5;cursor:default}
.gl-primary{font:inherit;font-size:12.5px;font-weight:800;color:#fff;background:#1f6bff;border:0;border-radius:10px;padding:9px 15px;cursor:pointer;white-space:nowrap}
.gl-primary:disabled{opacity:.6;cursor:default}
.gl-guide{list-style:none;margin:14px 0 0;display:grid;gap:8px;background:#f5f8fc;border-radius:13px;padding:12px}
.gl-guide li{display:flex;gap:11px;align-items:flex-start}
.gl-guide b{flex:none;width:24px;height:24px;border-radius:50%;background:#1f6bff;color:#fff;display:grid;place-items:center;font-size:12px}
.gl-guide strong{display:block;font-size:13px}
.gl-guide span{display:block;margin-top:2px;font-size:12px;line-height:1.55;color:#5b6b8c}
.gl-tabs{display:flex;gap:4px;flex-wrap:wrap;margin:16px 0 0;border-bottom:1.5px solid #eef2f8;padding-bottom:2px}
.gl-tabs button{font:inherit;font-size:12.5px;font-weight:700;color:#7b88a3;background:none;border:0;border-bottom:2.5px solid transparent;padding:8px 11px;cursor:pointer}
.gl-tabs button.on{color:#1f4fff;border-bottom-color:#1f6bff}
.gl-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:14px 0}
.gl-search{flex:1;min-width:190px;display:flex;align-items:center;gap:8px;background:#f5f8fc;border:1.5px solid #e7ecf5;border-radius:11px;padding:0 12px}
.gl-search span{font-size:12px;color:#9aa6bd}
.gl-search input{flex:1;min-width:0;border:0;background:none;outline:none;font:inherit;font-size:13px;padding:10px 0;color:#0a1124}
.gl-bulk{display:flex;align-items:center;gap:8px;background:#eaf1ff;border:1px solid #d3e0fb;border-radius:11px;padding:8px 12px;margin-bottom:10px}
.gl-bulk b{font-size:12.5px;color:#1f4fff}
.gl-bulk button{font:inherit;font-size:12px;font-weight:800;color:#1f4fff;background:#fff;border:1px solid #cfe0ff;border-radius:8px;padding:6px 11px;cursor:pointer}
.gl-bulk .gl-danger{color:#c62828;border-color:#f3cfcf}
.gl-table{border:1px solid #eef2f8;border-radius:14px;overflow:hidden}
.gl-tr{display:grid;grid-template-columns:38px minmax(130px,1.15fr) 118px minmax(110px,.95fr) minmax(120px,1fr) 118px 118px 84px;gap:10px;align-items:center;padding:12px;border-bottom:1px solid #f1f4fa;font-size:13px}
.gl-tr:last-of-type{border-bottom:0}
.gl-th{background:#fafbfe;font-size:11px;font-weight:800;color:#8b97ae}
.gl-tr.off{opacity:.55}
.gl-cb{display:grid;place-items:center}
.gl-cb input{width:15px;height:15px;accent-color:#1f6bff;cursor:pointer}
.gl-term b{font-weight:800;font-size:13.5px}
.gl-term i{display:block;font-style:normal;font-size:11px;color:#9aa6bd;margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gl-kind{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:700;color:#41506e;background:#f1f5fd;border:1px solid #e6edf9;border-radius:8px;padding:4px 8px;white-space:nowrap}
.gl-disp{font-weight:700;color:#16224a;overflow:hidden;text-overflow:ellipsis}
.gl-alias{display:flex;gap:4px;flex-wrap:wrap}
.gl-alias em{font-style:normal;font-size:11px;font-weight:700;color:#5b6b8c;background:#f2f5fb;border-radius:7px;padding:3px 7px;white-space:nowrap}
.gl-alias em.more{background:#eaf1ff;color:#1f4fff}
.gl-dash{color:#b9c2d4}
.gl-langs{font-size:11.5px;color:#5b6b8c;font-weight:600}
.gl-statecell{display:flex;align-items:center;gap:7px;font-size:11.5px;font-weight:700;color:#5b6b8c}
.gl-toggle{width:38px;height:22px;border:0;border-radius:99px;background:#d7deea;position:relative;cursor:pointer;flex:none;transition:.15s}
.gl-toggle i{position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:.15s}
.gl-toggle.on{background:#1f6bff}
.gl-toggle.on i{left:19px}
.gl-acts{display:flex;gap:4px}
.gl-acts button{width:30px;height:30px;border:1px solid #eef2f8;background:#fff;border-radius:9px;cursor:pointer;font-size:13px}
.gl-acts button:hover{background:#f5f8fc}
.gl-end{justify-self:end}
.gl-empty{padding:28px 14px;text-align:center;font-size:13px;color:#8b97ae;font-weight:600}
.gl-addrow{display:block;width:100%;font:inherit;font-size:12.5px;font-weight:700;color:#7b88a3;background:#fbfcfe;border:0;border-top:1px dashed #dde4f0;padding:14px;cursor:pointer}
.gl-addrow:hover{color:#1f4fff;background:#f5f9ff}
.gl-right{display:grid;gap:12px;min-width:0}
.gl-panel-h{font-size:13.5px;font-weight:800}
.gl-panel-s{margin:4px 0 10px;font-size:11.5px;line-height:1.55;color:#7b88a3;font-weight:500}
.gl-lbl{display:block;font-size:11px;font-weight:800;color:#8b97ae;margin:10px 0 5px}
.gl-ta,.gl-in,.gl-sel{width:100%;font:inherit;font-size:13px;color:#0a1124;background:#fff;border:1.5px solid #e3e8f2;border-radius:10px;padding:9px 11px;outline:none}
.gl-ta{resize:vertical}
.gl-ta:focus,.gl-in:focus,.gl-sel:focus{border-color:#9dc0ff}
.gl-pvrow{display:flex;gap:7px;margin-top:8px}
.gl-pvrow .gl-sel{flex:1;font-size:12px;padding:8px 9px}
.gl-bubble{margin-top:10px;background:#f5f8fc;border-radius:12px;padding:10px 12px}
.gl-bubble-h{font-size:10.5px;font-weight:800;color:#8b97ae}
.gl-bubble p{margin:4px 0 0;font-size:13px;line-height:1.6}
.gl-bubble mark{background:#dbe9ff;color:#14336f;border-radius:4px;padding:0 3px;font-weight:700}
.gl-kept{display:block;margin-top:7px;font-size:11.5px;font-weight:700;color:#a8720b}
.gl-kept.ok{color:#0b8043}
.gl-note{margin:8px 0 0;font-size:11.5px;line-height:1.55;color:#8b97ae;font-weight:500}
.gl-chips{display:flex;gap:5px;flex-wrap:wrap}
.gl-chips span{font-size:11.5px;font-weight:700;color:#41506e;background:#f1f5fd;border:1px solid #e6edf9;border-radius:8px;padding:4px 8px}
.gl-chips span.more{background:#eaf1ff;color:#1f4fff}
.gl-pairs{display:grid;gap:5px;font-size:11.5px;color:#5b6b8c}
.gl-pairs em{font-style:normal;font-weight:700}
.gl-pairs b{color:#1f4fff}
.gl-uses{margin:0;padding-left:18px;display:grid;gap:6px}
.gl-uses li{font-size:12px;line-height:1.5;color:#41506e;font-weight:600}
.gl-back{position:fixed;inset:0;z-index:60;background:rgba(10,20,40,.42);backdrop-filter:blur(3px);display:grid;place-items:center;padding:18px}
.gl-modal{width:min(720px,100%);max-height:94vh;overflow:auto;background:#fff;border-radius:18px;box-shadow:0 30px 90px rgba(10,25,60,.28)}
.gl-modal header{display:flex;gap:12px;align-items:flex-start;padding:18px 18px 12px}
.gl-mico{flex:none;width:38px;height:38px;border-radius:11px;background:#eaf1ff;display:grid;place-items:center;font-size:18px}
.gl-modal header h2{margin:0;font-size:18px;font-weight:900;letter-spacing:-.03em}
.gl-modal header p{margin:3px 0 0;font-size:12px;color:#7b88a3;font-weight:500}
.gl-modal header>div{flex:1}
.gl-x{flex:none;width:32px;height:32px;border:0;background:#f2f5fb;border-radius:9px;cursor:pointer;font-size:13px}
.gl-form{padding:4px 18px 8px;display:grid;gap:13px}
.gl-frow{display:grid;grid-template-columns:150px minmax(0,1fr);gap:12px;align-items:start}
.gl-frow>span{font-size:12.5px;font-weight:700;color:#41506e;padding-top:9px}
.gl-frow>span i{color:#e5484d;font-style:normal}
.gl-frow small{display:block;margin-top:5px;font-size:11px;line-height:1.5;color:#9aa6bd}
.gl-chipset{display:flex;gap:6px;flex-wrap:wrap}
.gl-chipset button{font:inherit;font-size:12px;font-weight:700;color:#41506e;background:#fff;border:1.5px solid #e3e8f2;border-radius:10px;padding:8px 11px;cursor:pointer}
.gl-chipset button.on{border-color:#1f6bff;background:#eaf1ff;color:#1f4fff}
.gl-aliasbox{display:flex;gap:6px;flex-wrap:wrap;align-items:center;background:#fff;border:1.5px solid #e3e8f2;border-radius:10px;padding:6px 8px}
.gl-aliasbox input{flex:1;min-width:120px;border:0;outline:none;font:inherit;font-size:13px;padding:5px 2px}
.gl-atag{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;color:#1f4fff;background:#eaf1ff;border-radius:8px;padding:5px 7px}
.gl-atag button{border:0;background:none;color:#7ea3f0;cursor:pointer;font-size:11px;padding:0}
.gl-count{text-align:right;font-size:10.5px;color:#9aa6bd;margin-top:3px}
.gl-switches{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.gl-switch{display:flex;align-items:center;gap:10px;justify-content:space-between;background:#f7f9fd;border-radius:12px;padding:11px 12px}
.gl-switch b{display:block;font-size:12.5px}
.gl-switch small{display:block;margin-top:2px;font-size:10.5px;line-height:1.45;color:#8b97ae}
.gl-err{margin:0;font-size:12px;font-weight:700;color:#c62828}
.gl-modal footer{position:sticky;bottom:0;display:flex;align-items:center;gap:8px;padding:12px 18px 16px;background:#fff;border-top:1px solid #eef2f8}
.gl-ghost{color:#5b6b8c;border-color:transparent;background:none}
.gl-toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:70;background:#0a1124;color:#fff;font-size:12.5px;font-weight:700;padding:10px 16px;border-radius:99px;box-shadow:0 12px 30px rgba(10,20,45,.3)}
.gl-sugs{display:grid;gap:7px;margin-top:10px}
.gl-sug{display:flex;align-items:center;gap:9px;background:#f7f9fd;border-radius:11px;padding:8px 10px}
.gl-sug-n{width:20px;height:20px;flex:none;border-radius:50%;background:#eaf1ff;color:#1f4fff;font-size:11px;font-weight:800;display:grid;place-items:center}
.gl-sug>div{flex:1;min-width:0}
.gl-sug b{display:block;font-size:12.5px;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gl-sug em{font-style:normal;font-size:10.5px;color:#8b97ae;font-weight:700}
.gl-sug button{padding:6px 10px;font-size:11.5px}
@media(max-width:1280px){.gl-wrap{grid-template-columns:230px minmax(0,1fr)}.gl-right{grid-column:1/-1;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}}
@media(max-width:900px){.gl-wrap{grid-template-columns:minmax(0,1fr);padding:14px 12px 50px}.gl-side{order:2}.gl-right{order:3}
.gl-bar .gl-link{display:none}.gl-bar{padding:10px 12px;gap:8px}.gl-main{padding:14px 12px}.gl-h1{font-size:21px}
.gl-tr{grid-template-columns:30px minmax(0,1fr) 110px;row-gap:6px}
.gl-th{display:none}
.gl-tr>div:nth-child(4),.gl-tr>div:nth-child(5),.gl-tr>div:nth-child(6){grid-column:2/4}
.gl-statecell{grid-column:2/3}.gl-acts{grid-column:3/4;justify-self:end}
.gl-frow{grid-template-columns:minmax(0,1fr)}.gl-frow>span{padding-top:0}
.gl-switches{grid-template-columns:1fr}}
`;
