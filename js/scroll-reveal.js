// Adds a calm, staggered entrance to content as it comes into view.
(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const items = [
    ...document.querySelectorAll(".section-intro .wrap, .experience-focus, .timeline-item, .project-feature, .project-card, .hobby-item"),
  ];

  items.forEach((item, index) => {
    item.classList.add("reveal-on-scroll");
    item.style.transitionDelay = `${Math.min((index % 3) * 80, 160)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6%" }
  );

  items.forEach((item) => observer.observe(item));
})();
