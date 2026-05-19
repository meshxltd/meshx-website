(function () {

  /* ── Mobile nav ────────────────────────────────────────────── */
  var toggle = document.querySelector(".menu-toggle");
  var mobile = document.querySelector(".nav-mobile");

  if (toggle && mobile) {
    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      mobile.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    mobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ── Scroll animations (IntersectionObserver) ──────────────── */
  var animItems = document.querySelectorAll("[data-animate]");

  if (animItems.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    animItems.forEach(function (el) { observer.observe(el); });
  } else {
    /* Fallback: show everything immediately if no Observer support */
    animItems.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ── FAQ accordion ─────────────────────────────────────────── */
  document.querySelectorAll(".faq-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var isOpen = item.classList.contains("is-open");

      /* Close all items */
      document.querySelectorAll(".faq-item.is-open").forEach(function (open) {
        open.classList.remove("is-open");
        open.querySelector(".faq-btn").setAttribute("aria-expanded", "false");
      });

      /* Open clicked item if it was closed */
      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ── Marketplace tabs ──────────────────────────────────────── */
  var tabs = document.querySelectorAll(".mp-tab");
  var panels = document.querySelectorAll(".marketplace-block");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("data-target");

      /* Update tab states */
      tabs.forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
      });

      /* Show/hide panels */
      panels.forEach(function (panel) {
        if (panel.id === target) {
          panel.classList.remove("is-hidden");
        } else {
          panel.classList.add("is-hidden");
        }
      });
    });
  });

  /* Year in footer */
  var yr = document.getElementById("y");
  if (yr) yr.textContent = new Date().getFullYear();

})();
