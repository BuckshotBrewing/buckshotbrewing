document.documentElement.classList.add("js");

const yearNode = document.querySelector("[data-year]");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const navToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

function closeMenu() {
  if (!navToggle || !nav) return;
  nav.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) closeMenu();
  });
}

const ageGate = document.querySelector("[data-age-gate]");
const ageYes = document.querySelector("[data-age-yes]");
const ageNo = document.querySelector("[data-age-no]");
const AGE_KEY = "buckshot_age_verified_v4";
let focusBeforeAgeGate = null;

function ageIsVerified() {
  try {
    return localStorage.getItem(AGE_KEY) === "yes";
  } catch (error) {
    return false;
  }
}

function openAgeGate() {
  if (!ageGate || !ageYes) return;
  focusBeforeAgeGate = document.activeElement;
  ageGate.classList.add("open");
  document.body.classList.add("no-scroll");
  window.setTimeout(() => ageYes.focus(), 0);
}

function closeAgeGate() {
  if (!ageGate) return;
  ageGate.classList.remove("open");
  document.body.classList.remove("no-scroll");
  if (focusBeforeAgeGate && typeof focusBeforeAgeGate.focus === "function") {
    focusBeforeAgeGate.focus();
  }
}

if (ageGate && ageYes && ageNo) {
  if (!ageIsVerified()) openAgeGate();

  ageGate.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    if (event.shiftKey && document.activeElement === ageYes) {
      event.preventDefault();
      ageNo.focus();
    } else if (!event.shiftKey && document.activeElement === ageNo) {
      event.preventDefault();
      ageYes.focus();
    }
  });

  ageYes.addEventListener("click", () => {
    try {
      localStorage.setItem(AGE_KEY, "yes");
    } catch (error) {
      // Continuing without storage still lets the visitor confirm for this page view.
    }
    closeAgeGate();
  });

  ageNo.addEventListener("click", () => {
    window.location.href = "https://www.responsibility.org/";
  });
}

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -28px" });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
}
