(function () {
  "use strict";

  // Replace with the official registration URL when it is available.
  const registrationUrl = "";
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");

  document.querySelectorAll("[data-register-link]").forEach((link) => {
    if (registrationUrl) {
      link.href = registrationUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.classList.remove("is-pending");
      link.removeAttribute("aria-disabled");
      link.innerHTML = "Register now <span>↗</span>";
    }
  });

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  document.querySelectorAll(".is-pending[aria-disabled='true']").forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });

  window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 20), { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}());
