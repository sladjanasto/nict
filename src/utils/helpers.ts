// Utility functions for the portfolio

/**
 * Format date to Serbian locale
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("sr-RS", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Calculate reading time for content
 */
export function calculateReadingTime(content: string): number {
  if (!content || content.trim().length === 0) {
    return 0;
  }

  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Smooth scroll to element
 */
export function smoothScrollTo(targetId: string): void {
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length === 0) {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Additional checks for edge cases
  if (email.includes("..") || email.startsWith(".") || email.endsWith(".")) {
    return false;
  }

  return emailRegex.test(email);
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = "id"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
