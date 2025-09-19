// Client-side i18n utility for dynamic language switching without page reload
export interface TranslationData {
  [key: string]: any;
}

class ClientI18n {
  private translations: { [lang: string]: TranslationData } = {};
  private currentLang: string = "en";
  private fallbackLang: string = "en";

  constructor() {
    // Detect initial language from URL or localStorage
    this.currentLang = this.detectLanguage();
  }

  private detectLanguage(): string {
    // Check URL first
    const pathSegments = window.location.pathname.split("/");
    if (pathSegments[1] === "de") {
      return "de";
    }

    // Check localStorage
    const savedLang = localStorage.getItem("language");
    if (savedLang && ["en", "de"].includes(savedLang)) {
      return savedLang;
    }

    return "en";
  }

  async loadTranslations(lang: string): Promise<void> {
    if (this.translations[lang]) {
      return; // Already loaded
    }

    try {
      const response = await fetch(`/_translations/${lang}.json`);
      if (response.ok) {
        this.translations[lang] = await response.json();
      }
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error);
    }
  }

  async setLanguage(lang: string): Promise<void> {
    await this.loadTranslations(lang);
    this.currentLang = lang;
    localStorage.setItem("language", lang);
    this.updateDOM();
    this.updateURL(lang);
  }

  private updateURL(lang: string): void {
    const currentPath = window.location.pathname;
    let newPath: string;

    if (lang === "en") {
      // English is default, remove language prefix
      newPath = currentPath.replace(/^\/de/, "") || "/";
    } else {
      // Add language prefix
      newPath = currentPath.replace(/^\/de/, "");
      newPath = `/${lang}${newPath}`;
    }

    // Update URL without reload
    window.history.pushState(null, "", newPath);
  }

  private updateDOM(): void {
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach((element) => {
      const key = element.getAttribute("data-i18n");
      if (key) {
        const translation = this.getTranslation(key);
        if (translation) {
          element.textContent = translation;
        }
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = this.currentLang;
  }

  private getTranslation(key: string): string | null {
    const keys = key.split(".");
    let value = this.translations[this.currentLang];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to default language
        value = this.translations[this.fallbackLang];
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return null;
          }
        }
        break;
      }
    }

    return typeof value === "string" ? value : null;
  }

  getCurrentLanguage(): string {
    return this.currentLang;
  }

  async initialize(): Promise<void> {
    // Load translations for current language and fallback
    await Promise.all([
      this.loadTranslations(this.currentLang),
      this.loadTranslations(this.fallbackLang),
    ]);
  }
}

export const clientI18n = new ClientI18n();

// Auto-initialize when the module is imported
if (typeof window !== "undefined") {
  clientI18n.initialize();
}
