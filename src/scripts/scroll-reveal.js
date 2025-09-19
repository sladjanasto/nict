// Scroll Reveal Animation
class ScrollReveal {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-revealed");
            // Optional: Stop observing once revealed
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    this.observeElements();
  }

  observeElements() {
    // Select elements to animate
    const elementsToReveal = document.querySelectorAll(
      ".scroll-reveal, .service-card, .testimonial-card, .project-card, .about-content, .hero-content"
    );

    elementsToReveal.forEach((element, index) => {
      // Add delay based on index for stagger effect
      element.style.transitionDelay = `${index * 0.1}s`;
      this.observer.observe(element);
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ScrollReveal();
});

// Handle page navigation (for SPAs or view transitions)
document.addEventListener("astro:page-load", () => {
  new ScrollReveal();
});
