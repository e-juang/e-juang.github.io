// The page now stays on one light water-toned palette throughout, so this
// no longer inverts colors on scroll. It just gives the header a touch
// more depth once the reader has scrolled past the hero.
(function () {
  const hero = document.querySelector('.hero');
  const header = document.querySelector('.site-header');
  if (!hero || !header) return;

  function updateHeaderElevation() {
    const scrolledPastHero = window.scrollY > hero.offsetHeight * 0.6;
    header.style.boxShadow = scrolledPastHero
      ? '0 6px 18px rgba(22, 48, 56, 0.08)'
      : '0 3px 10px rgba(22, 48, 56, 0.035)';
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateHeaderElevation();
        ticking = false;
      });
      ticking = true;
    }
  });

  updateHeaderElevation();
})();
