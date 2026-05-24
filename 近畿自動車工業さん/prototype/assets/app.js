(function () {
  document.documentElement.classList.add("js-enabled");

  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const form = document.querySelector("[data-estimate-form]");
  const result = document.querySelector("[data-form-result]");

  const closeMenu = () => {
    if (!header || !navToggle) {
      return;
    }

    header.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  if (header && navToggle && nav) {
    const updateHeaderState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });

    navToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (event.target instanceof Node && !header.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  const revealTargets = document.querySelectorAll(
    ".quick-strip, .section, .reason-card, .menu-card, .price-card, .service-item, .flow-list li, .faq-list details, .map-panel, .estimate-form, .demo-disclaimer"
  );
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  revealTargets.forEach((element, index) => {
    element.classList.add("reveal-target");
    element.style.setProperty("--reveal-delay", `${Math.min((index % 4) * 70, 210)}ms`);
  });

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -48px", threshold: 0.12 }
    );

    revealTargets.forEach((element) => revealObserver.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  }

  document.querySelectorAll("[data-faq-list] details").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (!details.open) {
        return;
      }

      document.querySelectorAll("[data-faq-list] details").forEach((otherDetails) => {
        if (otherDetails !== details) {
          otherDetails.removeAttribute("open");
        }
      });
    });
  });

  if (form && result) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const type = data.get("type");
      const car = data.get("car");
      const contact = data.get("contact");
      result.textContent = `選択内容: ${type} / ${car} / ${contact}。本番ではこの内容を問い合わせフォームまたはLINE導線に接続します。`;
      result.setAttribute("tabindex", "-1");
      result.focus({ preventScroll: true });
    });
  }
})();
