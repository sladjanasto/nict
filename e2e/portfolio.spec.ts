import { test, expect } from "@playwright/test";

test.describe("Portfolio Navigation", () => {
  test("should navigate to all sections", async ({ page }) => {
    await page.goto("/");

    // Check if page loads
    await expect(page).toHaveTitle(/Portfolio/);

    // Test hero section
    await expect(page.locator("h1")).toBeVisible();

    // Test navigation links
    const navLinks = ["#services", "#about", "#contact"];

    for (const link of navLinks) {
      const navLink = page.locator(`a[href="${link}"]`);
      if (await navLink.isVisible()) {
        await navLink.click();
        await page.waitForTimeout(1000); // Wait for smooth scroll

        // Check if target section is in viewport
        const targetSection = page.locator(link);
        await expect(targetSection).toBeInViewport();
      }
    }
  });

  test("should work on mobile devices", async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check if mobile menu toggle exists
    const mobileMenuToggle = page.locator(".mobile-menu-toggle");
    if (await mobileMenuToggle.isVisible()) {
      await mobileMenuToggle.click();

      // Check if mobile menu opens
      const mobileMenu = page.locator(".mobile-nav");
      await expect(mobileMenu).toBeVisible();
    }
  });
});

test.describe("TreeContent Infographic", () => {
  test("should display process steps", async ({ page }) => {
    await page.goto("/");

    // Navigate to tree content section
    const treeSection = page.locator(".tree-content-container");
    await treeSection.scrollIntoViewIfNeeded();

    // Check if steps are visible
    const steps = page.locator(".process-step");
    const stepCount = await steps.count();
    expect(stepCount).toBeGreaterThan(0);

    // Check step numbers
    const stepNumbers = page.locator(".step-number");
    const firstStepNumber = stepNumbers.first();
    await expect(firstStepNumber).toBeVisible();
    await expect(firstStepNumber).toContainText("1");
  });

  test("should animate steps on scroll", async ({ page }) => {
    await page.goto("/");

    // Scroll to trigger animations
    const treeSection = page.locator(".tree-content-container");
    await treeSection.scrollIntoViewIfNeeded();

    // Wait for animations
    await page.waitForTimeout(2000);

    // Check if animations are applied
    const animatedSteps = page.locator(".process-step.animate-in");
    const animatedCount = await animatedSteps.count();
    expect(animatedCount).toBeGreaterThan(0);
  });
});

test.describe("Services Section", () => {
  test("should display service cards", async ({ page }) => {
    await page.goto("/");

    // Navigate to services section
    const servicesSection = page.locator("#services");
    await servicesSection.scrollIntoViewIfNeeded();

    // Check service cards
    const serviceCards = page.locator(".service-card");
    const cardCount = await serviceCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // Check card content
    const firstCard = serviceCards.first();
    await expect(firstCard.locator("h3")).toBeVisible();
    await expect(firstCard.locator("p")).toBeVisible();
  });

  test("should handle service tabs if present", async ({ page }) => {
    await page.goto("/");

    const serviceTabs = page.locator(".service-tab");
    const tabCount = await serviceTabs.count();

    if (tabCount > 0) {
      // Click on second tab if it exists
      if (tabCount > 1) {
        await serviceTabs.nth(1).click();

        // Check if content changes
        await page.waitForTimeout(500);
        const activeContent = page.locator(".service-content.active");
        await expect(activeContent).toBeVisible();
      }
    }
  });
});

test.describe("Responsive Design", () => {
  const viewports = [
    { name: "Mobile", width: 375, height: 667 },
    { name: "Tablet", width: 768, height: 1024 },
    { name: "Desktop", width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`should work on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      await page.goto("/");

      // Check if page loads properly
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();

      // Check if content is properly positioned
      const hero = page.locator(".hero-section");
      await expect(hero).toBeVisible();

      // Scroll to bottom to test all sections
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(1000);

      // Check footer visibility
      const footer = page.locator("footer");
      await expect(footer).toBeInViewport();
    });
  }
});

test.describe("Performance and Accessibility", () => {
  test("should load quickly", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Check if critical elements are visible
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should have proper heading hierarchy", async ({ page }) => {
    await page.goto("/");

    // Should have exactly one h1
    const h1Elements = page.locator("h1");
    const h1Count = await h1Elements.count();
    expect(h1Count).toBe(1);

    // Should have h2 elements
    const h2Elements = page.locator("h2");
    const h2Count = await h2Elements.count();
    expect(h2Count).toBeGreaterThan(0);
  });

  test("should have alt text for images", async ({ page }) => {
    await page.goto("/");

    const images = page.locator("img");
    const imageCount = await images.count();

    // Check alt attributes if images exist
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const altText = await img.getAttribute("alt");
        expect(altText).not.toBeNull();
      }
    }
  });
});
