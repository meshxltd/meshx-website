/*
 * consent.js — cookie consent + Google Analytics for meshx.uk
 *
 * WHY ANALYTICS IS GATED AND NOT JUST PASTED IN
 * ---------------------------------------------
 * cookies.html told visitors: "We do not use advertising or analytics cookies
 * on this marketing site unless we notify you and update this policy." GA4
 * sets analytics cookies, so dropping the tag in would have made the site's
 * own published policy untrue — on the site that also publishes an
 * information security policy and sells to businesses.
 *
 * Under UK PECR, analytics cookies need consent regardless of what a policy
 * says. The three MeshX storefronts already work this way, so this is the
 * same behaviour rather than a second approach:
 *
 *   localStorage["cookie_consent_v1"]  "accepted" | "declined"
 *   window event "cookie:consent"      detail: the same string
 *
 * A near-miss on either name fails silently — consent is given, nothing
 * loads, and nobody sees an error. They are deliberately identical to
 * storefront/components/CookieBanner.tsx and Analytics.tsx.
 *
 * SELF-CONTAINED ON PURPOSE. The five legal pages load no JavaScript and only
 * legal.css, so a banner needing extra CSS or markup would have to be pasted
 * into six files and would drift. Everything here — styles, markup, GA loader
 * — is injected by this one script.
 *
 * 🔴 EVERY localStorage CALL IS WRAPPED. Private windows and blocked site data
 * make both reads and writes throw, and an exception here would take the
 * banner (and anything after it) down with it.
 */
(function () {
  "use strict";

  var KEY = "cookie_consent_v1";
  var EVENT = "cookie:consent";
  var GA_ID = "G-E8FZQN6DPG";

  function read() {
    try {
      return window.localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function write(value) {
    try {
      window.localStorage.setItem(KEY, value);
    } catch (e) {
      /* private window — the banner simply asks again next visit */
    }
  }

  /* ── Google Analytics, only ever called after consent ────────────────── */
  var gaLoaded = false;
  function loadAnalytics() {
    if (gaLoaded) return;
    gaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID);
  }

  /* ── The banner ──────────────────────────────────────────────────────── */
  function showBanner() {
    var css = document.createElement("style");
    css.textContent = [
      "#mx-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;",
      "background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;",
      "box-shadow:0 10px 30px rgba(8,26,55,.14);padding:16px 18px;",
      "font-family:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;",
      "display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;",
      "max-width:760px;margin:0 auto;color:#0f172a;font-size:14px;line-height:1.5}",
      "#mx-consent p{margin:0;flex:1 1 320px;min-width:260px}",
      "#mx-consent a{color:#2b63f1}",
      "#mx-consent .mx-actions{display:flex;gap:8px;flex:0 0 auto}",
      "#mx-consent button{font:inherit;font-weight:600;border-radius:8px;padding:9px 16px;",
      "cursor:pointer;border:1px solid #e2e8f0;background:#ffffff;color:#0f172a}",
      "#mx-consent button.mx-accept{background:#2b63f1;border-color:#2b63f1;color:#ffffff}",
      "#mx-consent button.mx-accept:hover{background:#1d4ed8;border-color:#1d4ed8}",
      "#mx-consent button:focus-visible{outline:2px solid #2b63f1;outline-offset:2px}",
      "@media (max-width:520px){#mx-consent .mx-actions{flex:1 1 100%}",
      "#mx-consent button{flex:1}}",
    ].join("");
    document.head.appendChild(css);

    var bar = document.createElement("div");
    bar.id = "mx-consent";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Cookies");
    bar.innerHTML =
      '<p>We use analytics cookies to see how many people visit and where they come from. ' +
      'Nothing else. <a href="/cookies.html">Cookie policy</a>.</p>' +
      '<div class="mx-actions">' +
      '<button type="button" id="mx-decline">Decline</button>' +
      '<button type="button" class="mx-accept" id="mx-accept">Accept</button>' +
      "</div>";
    document.body.appendChild(bar);

    function choose(value) {
      write(value);
      try {
        window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
      } catch (e) { /* older browsers */ }
      if (value === "accepted") loadAnalytics();
      if (bar.parentNode) bar.parentNode.removeChild(bar);
    }

    document.getElementById("mx-accept").addEventListener("click", function () { choose("accepted"); });
    document.getElementById("mx-decline").addEventListener("click", function () { choose("declined"); });
  }

  function start() {
    var choice = read();
    if (choice === "accepted") { loadAnalytics(); return; }
    if (choice === "declined") return;
    showBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
