// Test setup file
import { expect, afterEach } from "vitest";

// Simple cleanup without DOM testing library
afterEach(() => {
  // Clean up DOM after each test
  document.body.innerHTML = "";
  document.head.innerHTML = "";
});
