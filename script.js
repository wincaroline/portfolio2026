document.addEventListener("DOMContentLoaded", () => {
  // Media lightbox: click .case-block__media to open; close via button, backdrop, or Escape
  const mediaBlocks = document.querySelectorAll(".case-block__media");
  if (mediaBlocks.length > 0) {
    const backdrop = document.createElement("div");
    backdrop.className = "media-lightbox__backdrop";
    backdrop.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    content.className = "media-lightbox__content";
    content.setAttribute("role", "presentation");

    const img = document.createElement("img");
    img.className = "media-lightbox__image";
    img.alt = "";

    const toolbar = document.createElement("div");
    toolbar.className = "media-lightbox__toolbar";

    const downloadLink = document.createElement("a");
    downloadLink.className = "media-lightbox__download";
    downloadLink.setAttribute("aria-label", "Download image");
    downloadLink.textContent = "Download";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "media-lightbox__close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.innerHTML = "×";

    toolbar.appendChild(downloadLink);
    toolbar.appendChild(closeBtn);

    const lightbox = document.createElement("div");
    lightbox.className = "media-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Enlarged image");
    lightbox.appendChild(backdrop);
    lightbox.appendChild(toolbar);
    lightbox.appendChild(content);
    content.appendChild(img);

    document.body.appendChild(lightbox);

    let lastTrigger = null;

    function updateContentAlignment() {
      const contentW = content.clientWidth;
      const imgW = img.offsetWidth;
      if (contentW > 0 && imgW > 0 && imgW <= contentW) {
        content.classList.add("media-lightbox__content--narrow");
      } else {
        content.classList.remove("media-lightbox__content--narrow");
      }
    }

    function scheduleAlignmentCheck() {
      requestAnimationFrame(() => requestAnimationFrame(updateContentAlignment));
    }

    img.addEventListener("load", scheduleAlignmentCheck);

    function openLightbox(src, alt, trigger) {
      lastTrigger = trigger;
      content.classList.remove("media-lightbox__content--narrow");
      img.src = src;
      img.alt = alt || "";
      try {
        const filename = new URL(src, window.location.href).pathname.split("/").pop() || "image.png";
        downloadLink.href = src;
        downloadLink.download = filename;
      } catch {
        downloadLink.href = src;
        downloadLink.download = "image.png";
      }
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      content.scrollLeft = 0;
      content.scrollTop = 0;
      scheduleAlignmentCheck();
      closeBtn.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      content.classList.remove("media-lightbox__content--narrow");
      if (lastTrigger && typeof lastTrigger.focus === "function") {
        lastTrigger.focus();
      }
      lastTrigger = null;
    }

    function onBackdropClick(e) {
      if (e.target === backdrop) closeLightbox();
    }

    function onKeydown(e) {
      if (e.key !== "Escape" || !lightbox.classList.contains("is-open")) return;
      e.preventDefault();
      closeLightbox();
    }

    // Focus trap: keep Tab/Shift+Tab inside the dialog (close button and download link)
    const focusables = [closeBtn, downloadLink];
    function onLightboxKeydown(e) {
      if (!lightbox.classList.contains("is-open") || e.key !== "Tab") return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    lightbox.addEventListener("keydown", onLightboxKeydown);

    backdrop.addEventListener("click", onBackdropClick);
    closeBtn.addEventListener("click", closeLightbox);
    document.addEventListener("keydown", onKeydown);

    mediaBlocks.forEach((block) => {
      block.setAttribute("tabindex", "-1");
      block.addEventListener("click", (e) => {
        if (e.target.closest("figcaption")) return;
        const firstImg = block.querySelector("img");
        if (!firstImg || !firstImg.src) return;
        e.preventDefault();
        openLightbox(firstImg.src, firstImg.alt || "", block);
      });
    });
  }

  const header = document.querySelector(".site-header");

  // Mobile nav: hamburger toggle (≤768px), aria-expanded, close on Escape or link click
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.getElementById("main-nav");
  if (header && navToggle && mainNav) {
    function isNavOpen() {
      return header.classList.contains("nav-is-open");
    }
    function openNav() {
      header.classList.add("nav-is-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close menu");
      if (window.matchMedia("(max-width: 768px)").matches) {
        document.body.style.overflow = "hidden";
      }
    }
    function closeNav() {
      header.classList.remove("nav-is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      document.body.style.overflow = "";
    }
    function toggleNav() {
      if (isNavOpen()) closeNav();
      else openNav();
    }
    navToggle.addEventListener("click", toggleNav);
    mainNav.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => closeNav());
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isNavOpen()) {
        closeNav();
        navToggle.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 769px)").matches && isNavOpen()) {
        closeNav();
      }
    });
  }

  // Header: hide on scroll down, slide in and float on scroll up
  if (header) {
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
  }

  // Scroll reveal: add .is-visible when elements enter viewport (index page)
  const revealElements = document.querySelectorAll(".reveal-on-scroll");
  if (revealElements.length > 0) {
    const viewportHeight = window.innerHeight;
    const reveal = (el) => el.classList.add("is-visible");

    // Immediately reveal elements already in view so they fade in on load
    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportHeight - 40) {
        reveal(el);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.1 }
    );
    revealElements.forEach((el) => {
      if (!el.classList.contains("is-visible")) observer.observe(el);
    });
  }
});

