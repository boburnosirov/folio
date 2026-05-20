import type { MetadataRoute } from "next";

const BASE_URL = "https://folio-ten-ashy.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/profile/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
