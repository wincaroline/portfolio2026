document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

  // Header: hide on scroll down, slide in and float on scroll up
  const header = document.querySelector(".site-header");
  if (!header) return;

  const TOP_THRESHOLD = 24;
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    const scrollY = window.scrollY;
    const scrollingDown = scrollY > lastScrollY;
    const atTop = scrollY <= TOP_THRESHOLD;

    if (atTop) {
      header.classList.remove("site-header--hidden", "site-header--floating");
    } else if (scrollingDown) {
      header.classList.add("site-header--hidden");
      header.classList.remove("site-header--floating");
    } else {
      header.classList.remove("site-header--hidden");
      header.classList.add("site-header--floating");
    }
    lastScrollY = scrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateHeader();
});

