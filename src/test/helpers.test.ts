import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  formatDate,
  calculateReadingTime,
  smoothScrollTo,
  isValidEmail,
  generateId,
  debounce,
} from "../utils/helpers";

describe("Helper Functions", () => {
  describe("formatDate", () => {
    it("should format date to Serbian locale", () => {
      const date = new Date("2024-03-15");
      const formatted = formatDate(date);
      expect(formatted).toContain("2024");
      expect(formatted).toContain("15");
    });

    it("should handle different dates correctly", () => {
      const date1 = new Date("2023-12-25");
      const date2 = new Date("2024-01-01");

      expect(formatDate(date1)).toContain("2023");
      expect(formatDate(date2)).toContain("2024");
    });
  });

  describe("calculateReadingTime", () => {
    it("should calculate reading time correctly", () => {
      const shortText = "This is a short text with ten words exactly here.";
      expect(calculateReadingTime(shortText)).toBe(1);
    });

    it("should round up reading time", () => {
      const mediumText = Array(250).fill("word").join(" ");
      expect(calculateReadingTime(mediumText)).toBe(2);
    });

    it("should handle empty content", () => {
      expect(calculateReadingTime("")).toBe(0);
      expect(calculateReadingTime("   ")).toBe(0);
    });
  });

  describe("smoothScrollTo", () => {
    beforeEach(() => {
      // Reset DOM
      document.body.innerHTML = "";
    });

    it("should scroll to element when it exists", () => {
      // Create test element
      const testElement = document.createElement("div");
      testElement.id = "test-section";
      testElement.scrollIntoView = vi.fn();
      document.body.appendChild(testElement);

      // Call function
      smoothScrollTo("test-section");

      // Verify scrollIntoView was called
      expect(testElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "start",
      });
    });

    it("should not throw error when element does not exist", () => {
      expect(() => smoothScrollTo("non-existent")).not.toThrow();
    });
  });

  describe("isValidEmail", () => {
    it("should validate correct email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.rs")).toBe(true);
      expect(isValidEmail("test123@test-domain.com")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(isValidEmail("invalid")).toBe(false);
      expect(isValidEmail("test@")).toBe(false);
      expect(isValidEmail("@domain.com")).toBe(false);
      expect(isValidEmail("test..email@domain.com")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("generateId", () => {
    it("should generate unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^id-[a-z0-9]{9}$/);
    });

    it("should use custom prefix", () => {
      const id = generateId("custom");
      expect(id).toMatch(/^custom-[a-z0-9]{9}$/);
    });
  });

  describe("debounce", () => {
    it("should debounce function calls", async () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      // Call multiple times quickly
      debouncedFn("arg1");
      debouncedFn("arg2");
      debouncedFn("arg3");

      // Should not be called yet
      expect(mockFn).not.toHaveBeenCalled();

      // Wait for debounce delay
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should be called once with last arguments
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith("arg3");
    });
  });
});
