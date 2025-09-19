// Sitemap utilities for multi-language support
export const languages = ["sr", "en", "de"];

export const routes = [
  {
    path: "",
    priority: 1.0,
    changefreq: "weekly",
  },
  {
    path: "blog",
    priority: 0.8,
    changefreq: "weekly",
  },
];

export const generateSitemapUrls = (baseUrl: string) => {
  const urls = [];

  // Add root pages for each language
  for (const lang of languages) {
    for (const route of routes) {
      const url = route.path
        ? `${baseUrl}/${lang === "sr" ? "" : lang + "/"}${route.path}`
        : `${baseUrl}/${lang === "sr" ? "" : lang + "/"}`;

      urls.push({
        url: url.replace(/\/+/g, "/").replace(/\/$/, "") || baseUrl,
        lastmod: new Date().toISOString().split("T")[0],
        priority: route.priority,
        changefreq: route.changefreq,
      });
    }
  }

  return urls;
};
