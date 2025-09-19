# Astro Unit Testing Setup Guide

## 🧪 Vitest Setup (Recommended)

### Installation

```bash
npm install --save-dev vitest @vitest/ui jsdom
npm install --save-dev @testing-library/dom @testing-library/user-event
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

### Vitest Config (vitest.config.ts)

```typescript
import { defineConfig } from "vitest/config";
import { getViteConfig } from "astro/config";

export default defineConfig(
  getViteConfig({
    test: {
      environment: "jsdom",
      globals: true,
      setupFiles: ["./src/test/setup.ts"],
    },
  })
);
```

## 🎯 What to Test in Astro

### 1. Component Logic (Frontmatter)

```astro
---
// Header.astro
interface Props {
  title: string;
  isHome?: boolean;
}

const { title, isHome = false } = Astro.props;
const navigationClass = isHome ? 'nav-home' : 'nav-default';
---

<header class={navigationClass}>
  <h1>{title}</h1>
</header>
```

### 2. Utility Functions

```typescript
// utils/helpers.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString("sr-RS");
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(" ").length;
  return Math.ceil(words / wordsPerMinute);
}
```

### 3. Client-side JavaScript

```javascript
// scripts/navigation.ts
export function smoothScroll(targetId: string): void {
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}
```

## 📝 Test Examples

### Testing Utility Functions

```typescript
// src/test/utils.test.ts
import { describe, it, expect } from "vitest";
import { formatDate, calculateReadingTime } from "../utils/helpers";

describe("Helper Functions", () => {
  describe("formatDate", () => {
    it("should format date correctly", () => {
      const date = new Date("2024-03-15");
      expect(formatDate(date)).toBe("15.3.2024.");
    });
  });

  describe("calculateReadingTime", () => {
    it("should calculate reading time correctly", () => {
      const content = "This is a test content with exactly ten words here.";
      expect(calculateReadingTime(content)).toBe(1);
    });
  });
});
```

### Testing Component Rendering

```typescript
// src/test/components.test.ts
import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadFixture } from "@astrojs/test-utils";

describe("Component Tests", () => {
  it("should render Header with correct title", async () => {
    const fixture = await loadFixture({
      root: new URL("./fixtures/", import.meta.url),
    });

    const container = await AstroContainer.create();
    const result = await container.renderToString(Header, {
      props: { title: "Test Title" },
    });

    expect(result).toContain("Test Title");
  });
});
```

### Testing Client Scripts

```typescript
// src/test/scripts.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { smoothScroll } from "../scripts/navigation";

// Mock DOM
beforeEach(() => {
  document.body.innerHTML = "";
  global.scrollTo = vi.fn();
});

describe("Navigation Scripts", () => {
  it("should scroll to element when it exists", () => {
    // Setup
    const targetElement = document.createElement("div");
    targetElement.id = "test-section";
    targetElement.scrollIntoView = vi.fn();
    document.body.appendChild(targetElement);

    // Execute
    smoothScroll("test-section");

    // Assert
    expect(targetElement.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
    });
  });
});
```

## 🚀 Alternative: Jest Setup

### Installation

```bash
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @testing-library/dom jsdom
```

### Jest Config (jest.config.js)

```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapping: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
};
```

## 🎪 E2E Testing with Playwright

### Installation

```bash
npm install --save-dev @playwright/test
```

### Playwright Config

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:4321",
  },
  webServer: {
    command: "npm run dev",
    port: 4321,
  },
});
```

### E2E Test Example

```typescript
// e2e/navigation.spec.ts
import { test, expect } from "@playwright/test";

test("navigation works correctly", async ({ page }) => {
  await page.goto("/");

  // Test header navigation
  await page.click('a[href="#services"]');
  await expect(page.locator("#services")).toBeInViewport();

  // Test mobile menu
  await page.setViewportSize({ width: 375, height: 667 });
  await page.click(".mobile-menu-toggle");
  await expect(page.locator(".mobile-menu")).toBeVisible();
});
```

## 🎯 Best Practices

### 1. Test Structure

```
src/
├── components/
├── test/
│   ├── setup.ts
│   ├── utils.test.ts
│   └── components.test.ts
├── utils/
└── scripts/

e2e/
├── navigation.spec.ts
└── forms.spec.ts
```

### 2. What to Focus On

- ✅ Utility functions
- ✅ Component props handling
- ✅ Client-side interactions
- ✅ Critical user journeys (E2E)
- ❌ Static HTML output (less valuable)

### 3. Test Categories

```typescript
// Unit Tests - Fast, isolated
describe("Unit: Helper Functions", () => {});

// Integration Tests - Component behavior
describe("Integration: Header Component", () => {});

// E2E Tests - Full user workflows
describe("E2E: Contact Form Flow", () => {});
```

## 📊 Coverage and CI

### Coverage Setup

```json
{
  "scripts": {
    "test:coverage": "vitest --coverage --reporter=lcov"
  }
}
```

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
```

## 🎉 Summary

**Astro Testing Approach:**

1. **Vitest** for unit/integration tests
2. **Playwright** for E2E tests
3. **Focus** on logic, not static rendering
4. **Test** critical user interactions
5. **Automate** with CI/CD

The key is testing the **dynamic parts** of your Astro app rather than static HTML output!
