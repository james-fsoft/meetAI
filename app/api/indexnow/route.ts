import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";

export const dynamic = "force-dynamic";

// IndexNow lets us push our URLs to Bing, Yandex, Naver and Seznam instantly —
// no account or manual submission needed. Hit GET /api/indexnow after adding
// new pages (e.g. a blog post) to resubmit everything. (Google ignores IndexNow;
// it discovers via robots.txt + Search Console.)
const KEY = "9c1f7a4e6b2d4083a1e5c8b9d6f23a7e";
const HOST = "meet.transflash.app";

export async function GET() {
  const urlList = sitemap().map((e) => e.url);
  try {
    const r = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: `https://${HOST}/${KEY}.txt`,
        urlList,
      }),
    });
    return NextResponse.json({ ok: r.ok, status: r.status, submitted: urlList.length, urls: urlList });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "failed" }, { status: 500 });
  }
}
