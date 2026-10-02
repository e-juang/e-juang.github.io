// ---------------------------------------------------------------
// SHARED COMPONENTS
// <site-header> and <site-footer> render themselves from the
// SITE config (site.config.js). This is the ONLY place the
// header/footer markup lives — pages just drop in the tags below.
//
// Usage in HTML:
//   <site-header></site-header>
//   ...
//   <site-footer></site-footer>
//
// No build step required — these are native custom elements,
// supported by every modern browser, and work equally well opened
// directly as a file or served via Live Server.
// ---------------------------------------------------------------
(function () {
  const SITE = window.SITE;

  function brandSVG() {
    return `<svg class="brand-mark" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" stroke="#1B2A4A" stroke-width="1.5"/>
      <circle cx="16" cy="16" r="2" fill="#E8532B"/>
      <line x1="16" y1="2" x2="16" y2="8" stroke="#1B2A4A" stroke-width="1.5"/>
      <line x1="16" y1="24" x2="16" y2="30" stroke="#1B2A4A" stroke-width="1.5"/>
      <line x1="2" y1="16" x2="8" y2="16" stroke="#1B2A4A" stroke-width="1.5"/>
      <line x1="24" y1="16" x2="30" y2="16" stroke="#1B2A4A" stroke-width="1.5"/>
    </svg>`;
  }

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      const currentFile = window.location.pathname.split("/").pop() || "index.html";
      const isHomePage = currentFile === "index.html" || currentFile === "";

      // Standalone page (e.g. hobbies.html): stripped-down header —
      // just a back arrow + name, no nav links at all.
      if (!isHomePage) {
        this.innerHTML = `
          <div class="header-inner">
            <a class="brand brand-back" href="index.html" aria-label="Back to ${SITE.name}">
              <span class="back-arrow" aria-hidden="true">&larr;</span>
              <span class="brand-text"><strong>${SITE.name}</strong></span>
            </a>
          </div>`;
        this.classList.add("site-header");
        return;
      }

      // Home page: full nav.
      const navLinks = SITE.pages
        .map((p) => {
          const isAnchor = p.href.startsWith("#");
          const sectionId = isAnchor
            ? p.href.slice(1)
            : p.href.replace(/\.html$/, "").replace(/^.*\//, "");
          const externalAttrs = p.external ? ' target="_blank" rel="noopener" aria-label="Open resume PDF in a new tab"' : "";
          const icon = p.external ? ' <span class="nav-download" aria-hidden="true">↓</span>' : "";
          return `<a href="${p.href}" data-section="${sectionId}"${externalAttrs}>${p.label}${icon}</a>`;
        })
        .join("\n");

      this.innerHTML = `
        <div class="header-inner">
          <a class="brand" href="#home">
            <span class="brand-text"><strong>${SITE.name}</strong></span>
          </a>
          <button class="nav-toggle" aria-label="Toggle navigation">MENU</button>
          <nav class="primary-nav">
            ${navLinks}
          </nav>
        </div>`;

      this.classList.add("site-header");

      const toggle = this.querySelector(".nav-toggle");
      const nav = this.querySelector(".primary-nav");
      toggle.addEventListener("click", () => nav.classList.toggle("open"));

      const links = [...this.querySelectorAll(".primary-nav a")];
      const setActiveSection = (activeId) => {
        links.forEach((link) => link.classList.toggle("active", link.dataset.section === activeId));
      };

      links.forEach((link) => link.addEventListener("click", () => nav.classList.remove("open")));

      // One-page scrollspy — only anchor links participate. Nothing is
      // active while the hero/home is in view; a section only takes
      // over once it's scrolled up to cover the middle of the viewport.
      const setActiveFromHash = () => {
        setActiveSection(window.location.hash.slice(1) || undefined);
      };
      setActiveFromHash();
      window.addEventListener("hashchange", setActiveFromHash);

      const sections = SITE.pages
        .filter((page) => page.href.startsWith("#"))
        .map((page) => document.getElementById(page.href.slice(1)))
        .filter(Boolean);

      const updateActiveFromScroll = () => {
        const marker = window.scrollY + window.innerHeight * 0.5;
        let activeSection;

        sections.forEach((section) => {
          if (section.offsetTop <= marker) activeSection = section;
        });

        setActiveSection(activeSection?.id);
      };

      updateActiveFromScroll();
      window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div class="footer-content">
          <span class="footer-copyright">&copy; ${new Date().getFullYear()} ${SITE.name}</span>
          <div class="footer-links" aria-label="Contact links">
            <a class="footer-icon-link" href="mailto:${SITE.email}" aria-label="Email ${SITE.name}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5h17v13h-17zM4 6l8 6 8-6"/></svg>
            </a>
            <a class="footer-icon-link" href="${SITE.linkedin}" target="_blank" rel="noopener" aria-label="${SITE.name} on LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5A1.5 1.5 0 1 0 5 6.5 1.5 1.5 0 0 0 5 3.5ZM3.75 8.25h2.5v12h-2.5zM9 8.25h2.4v1.64h.04c.49-.93 1.68-1.92 3.46-1.92 2.53 0 4.35 1.5 4.35 4.96v7.32h-2.5v-6.88c0-1.77-.66-2.84-2.17-2.84-1.66 0-2.58 1.12-2.58 2.84v6.88H9z"/></svg>
            </a>
          </div>
        </div>`;

      this.classList.add("site-footer");
    }
  }

  customElements.define("site-header", SiteHeader);
  customElements.define("site-footer", SiteFooter);
})();