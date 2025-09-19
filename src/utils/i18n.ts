// i18n utilities for Astro
import type { APIRoute } from "astro";

export const languages = {
  en: "English",
  de: "Deutsch",
};

export const defaultLang = "en";

export const supportedLanguages = Object.keys(languages) as Array<
  keyof typeof languages
>;

// Get UI translations for a specific language
export async function getUITranslations(lang: string) {
  try {
    const translations = await import(`../content/ui/${lang}.json`);
    return translations.default;
  } catch (error) {
    console.warn(
      `Translation file not found for language: ${lang}, falling back to ${defaultLang}`
    );
    const fallback = await import(`../content/ui/${defaultLang}.json`);
    return fallback.default;
  }
}

// Get page content for a specific language and section
export async function getPageContent(lang: string, section: string) {
  try {
    const { getCollection } = await import("astro:content");
    const pages = await getCollection("pages");

    const content = pages.find(
      (page) => page.data.lang === lang && page.data.section === section
    );

    if (!content) {
      // Fallback to default language
      const fallbackContent = pages.find(
        (page) =>
          page.data.lang === defaultLang && page.data.section === section
      );
      return fallbackContent;
    }

    return content;
  } catch (error) {
    console.error(`Error loading page content for ${lang}/${section}:`, error);
    return null;
  }
}

// Language detection utilities
export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split("/");

  if (supportedLanguages.includes(lang as any)) {
    return lang;
  }

  return defaultLang;
}

export function useTranslations(lang: string) {
  return {
    t: async (key: string) => {
      const translations = await getUITranslations(lang);
      return getNestedTranslation(translations, key) || key;
    },
  };
}

// Helper function to get nested translation keys like "nav.home"
function getNestedTranslation(obj: any, key: string): string {
  return key.split(".").reduce((o, k) => o?.[k], obj);
}

// Generate paths for all languages
export function getStaticPaths() {
  return supportedLanguages.map((lang) => ({ params: { lang } }));
}

// Generate localized URLs
export function getLocalizedUrl(path: string, lang: string): string {
  if (lang === defaultLang) {
    return path;
  }
  return `/${lang}${path}`;
}

// Remove language prefix from path
export function removeLanguagePrefix(path: string): string {
  const [, maybeLang, ...rest] = path.split("/");

  if (supportedLanguages.includes(maybeLang as any)) {
    // If the first segment is a supported language, remove it
    return "/" + rest.join("/");
  }

  // If no language prefix found, return original path
  return path;
}

// Language switcher helper
export function getLanguageSwitchUrls(currentPath: string) {
  // First remove any existing language prefix to get the base path
  const basePath = removeLanguagePrefix(currentPath);

  return supportedLanguages.map((lang) => ({
    lang,
    label: languages[lang],
    url: getLocalizedUrl(basePath, lang),
  }));
}
