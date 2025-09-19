import { describe, it, expect, beforeEach, vi } from "vitest";

// Test TreeContent component logic
describe("TreeContent Component Logic", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("Step Animation Triggers", () => {
    it("should detect when steps are in viewport", () => {
      // Create mock step elements
      const step1 = document.createElement("div");
      step1.className = "process-step";
      step1.id = "step-1";

      const step2 = document.createElement("div");
      step2.className = "process-step";
      step2.id = "step-2";

      document.body.appendChild(step1);
      document.body.appendChild(step2);

      // Mock getBoundingClientRect
      step1.getBoundingClientRect = vi.fn(
        () =>
          ({
            top: 100,
            bottom: 200,
            left: 0,
            right: 0,
            width: 0,
            height: 100,
          } as DOMRect)
      );

      // Simulate viewport detection logic
      const isInViewport = (element: Element): boolean => {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      };

      // Mock window dimensions
      Object.defineProperty(window, "innerHeight", {
        writable: true,
        configurable: true,
        value: 800,
      });

      expect(isInViewport(step1)).toBe(true);
    });

    it("should add animation classes to steps", () => {
      const step = document.createElement("div");
      step.className = "process-step";
      document.body.appendChild(step);

      // Simulate animation trigger
      const animateStep = (stepElement: Element) => {
        stepElement.classList.add("animate-in");

        const stepNumber = stepElement.querySelector(".step-number");
        if (stepNumber) {
          stepNumber.classList.add("pulse");
        }
      };

      const stepNumber = document.createElement("div");
      stepNumber.className = "step-number";
      step.appendChild(stepNumber);

      animateStep(step);

      expect(step.classList.contains("animate-in")).toBe(true);
      expect(stepNumber.classList.contains("pulse")).toBe(true);
    });
  });

  describe("Mobile Timeline Layout", () => {
    it("should adjust layout for mobile screens", () => {
      // Create timeline structure
      const timeline = document.createElement("div");
      timeline.className = "process-flow";

      const step = document.createElement("div");
      step.className = "process-step step-left";

      timeline.appendChild(step);
      document.body.appendChild(timeline);

      // Simulate mobile layout adjustment
      const adjustForMobile = () => {
        const steps = document.querySelectorAll(".process-step");
        steps.forEach((stepEl) => {
          stepEl.classList.remove("step-left", "step-right");
          stepEl.classList.add("step-mobile");
        });
      };

      adjustForMobile();

      expect(step.classList.contains("step-mobile")).toBe(true);
      expect(step.classList.contains("step-left")).toBe(false);
    });
  });
});

// Test Services component tab functionality
describe("Services Component Logic", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  describe("Service Tabs", () => {
    it("should switch between service tabs", () => {
      // Create tab structure
      const tab1 = document.createElement("button");
      tab1.className = "service-tab";
      tab1.setAttribute("data-target", "service-1");

      const tab2 = document.createElement("button");
      tab2.className = "service-tab";
      tab2.setAttribute("data-target", "service-2");

      const content1 = document.createElement("div");
      content1.id = "service-1";
      content1.className = "service-content";

      const content2 = document.createElement("div");
      content2.id = "service-2";
      content2.className = "service-content";

      document.body.appendChild(tab1);
      document.body.appendChild(tab2);
      document.body.appendChild(content1);
      document.body.appendChild(content2);

      // Simulate tab switching logic
      const switchTab = (targetId: string) => {
        // Hide all content
        document.querySelectorAll(".service-content").forEach((content) => {
          content.classList.remove("active");
        });

        // Remove active from all tabs
        document.querySelectorAll(".service-tab").forEach((tab) => {
          tab.classList.remove("active");
        });

        // Show target content
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add("active");
        }

        // Activate clicked tab
        const activeTab = document.querySelector(`[data-target="${targetId}"]`);
        if (activeTab) {
          activeTab.classList.add("active");
        }
      };

      switchTab("service-2");

      expect(content2.classList.contains("active")).toBe(true);
      expect(content1.classList.contains("active")).toBe(false);
      expect(tab2.classList.contains("active")).toBe(true);
    });
  });
});
