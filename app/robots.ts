import type { MetadataRoute } from "next";

// Tell crawlers what to index. Private/app routes are kept out of search.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/account", "/api/", "/auth/", "/login"],
      },
    ],
    sitemap: "https://meet.transflash.app/sitemap.xml",
    host: "https://meet.transflash.app",
  };
}
