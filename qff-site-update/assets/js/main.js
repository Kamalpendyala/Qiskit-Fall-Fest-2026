(function () {
  "use strict";

  // Replace with the official registration URL when it is available.
  const registrationUrl = "https://forms.gle/qY1mLWjjPstbERMT8";
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

  /* ============================================================
     Interactive Countdown Widget
     ============================================================ */
  const countdownWidget = document.getElementById("countdown-widget");
  if (countdownWidget) {
    // Configurable target event timestamp
    const targetDateStr = countdownWidget.dataset.targetDate || "2026-10-24T09:30:00+05:30";
    const targetDate = new Date(targetDateStr).getTime();
    // Benchmark start date for visual campaign progress bar (Sept 1, 2026)
    const startDate = new Date("2026-09-01T00:00:00+05:30").getTime();

    const daysEl = document.getElementById("count-days");
    const hoursEl = document.getElementById("count-hours");
    const minutesEl = document.getElementById("count-minutes");
    const secondsEl = document.getElementById("count-seconds");

    const subDays = document.getElementById("sub-days");
    const subHours = document.getElementById("sub-hours");
    const subMinutes = document.getElementById("sub-minutes");
    const subSeconds = document.getElementById("sub-seconds");

    const tipDays = document.getElementById("tip-days");
    const tipHours = document.getElementById("tip-hours");
    const tipMinutes = document.getElementById("tip-minutes");
    const tipSeconds = document.getElementById("tip-seconds");

    const progressBar = document.getElementById("countdown-progress-bar");
    const progressPercent = document.getElementById("countdown-progress-percent");
    const statusText = document.getElementById("countdown-status-text");
    const liveMessage = document.getElementById("countdown-live-message");
    const grid = document.getElementById("countdown-grid");

    const btnToggleUnits = document.getElementById("btn-toggle-units");
    const unitModeLabel = document.getElementById("unit-mode-label");
    const btnCopyReminder = document.getElementById("btn-copy-reminder");
    const copyBtnText = document.getElementById("copy-btn-text");

    let isTotalMode = false;
    let customUnitState = {
      days: false,
      hours: false,
      minutes: false,
      seconds: false
    };

    function padZero(num) {
      return num < 10 ? "0" + num : String(num);
    }

    function formatNumber(num) {
      return num.toLocaleString();
    }

    function updateCountdown() {
      const now = Date.now();
      const diff = targetDate - now;

      if (diff <= 0) {
        if (daysEl) daysEl.textContent = "00";
        if (hoursEl) hoursEl.textContent = "00";
        if (minutesEl) minutesEl.textContent = "00";
        if (secondsEl) secondsEl.textContent = "00";
        if (progressBar) progressBar.style.width = "100%";
        if (progressPercent) progressPercent.textContent = "100%";
        if (statusText) statusText.textContent = "HAPPENING NOW";
        if (liveMessage) liveMessage.style.display = "block";
        if (grid) grid.style.display = "none";
        return;
      }

      // Time calculations
      const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const totalMinutes = Math.floor(diff / (1000 * 60));
      const totalSeconds = Math.floor(diff / 1000);

      const days = totalDays;
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      // Render Days
      const showTotalDays = isTotalMode || customUnitState.days;
      if (daysEl) daysEl.textContent = padZero(days);
      if (subDays) subDays.textContent = showTotalDays ? `${Math.floor(days / 7)}w ${days % 7}d` : "until fest";
      if (tipDays) tipDays.textContent = `~${(days / 7).toFixed(1)} weeks remaining`;

      // Render Hours
      const showTotalHours = isTotalMode || customUnitState.hours;
      if (hoursEl) hoursEl.textContent = showTotalHours ? formatNumber(totalHours) : padZero(hours);
      if (subHours) subHours.textContent = showTotalHours ? "total hrs" : "in cycle";
      if (tipHours) tipHours.textContent = showTotalHours ? "Click for 24h cycle" : `Total: ${formatNumber(totalHours)} hrs`;

      // Render Minutes
      const showTotalMins = isTotalMode || customUnitState.minutes;
      if (minutesEl) minutesEl.textContent = showTotalMins ? formatNumber(totalMinutes) : padZero(minutes);
      if (subMinutes) subMinutes.textContent = showTotalMins ? "total mins" : "to mark";
      if (tipMinutes) tipMinutes.textContent = showTotalMins ? "Click for 60m cycle" : `Total: ${formatNumber(totalMinutes)} mins`;

      // Render Seconds
      const showTotalSecs = isTotalMode || customUnitState.seconds;
      if (secondsEl) secondsEl.textContent = showTotalSecs ? formatNumber(totalSeconds) : padZero(seconds);
      if (subSeconds) subSeconds.textContent = showTotalSecs ? "total secs" : "live pulse";
      if (tipSeconds) tipSeconds.textContent = showTotalSecs ? "Click for 60s cycle" : `Total: ${formatNumber(totalSeconds)} secs`;

      // Progress bar calculation
      const totalSpan = targetDate - startDate;
      const elapsed = Math.max(0, now - startDate);
      const pct = Math.min(100, Math.max(0, (elapsed / totalSpan) * 100));
      if (progressBar) progressBar.style.width = pct.toFixed(1) + "%";
      if (progressPercent) progressPercent.textContent = pct.toFixed(0) + "% to Launch";
    }

    // Toggle all units mode
    if (btnToggleUnits && unitModeLabel) {
      btnToggleUnits.addEventListener("click", () => {
        isTotalMode = !isTotalMode;
        unitModeLabel.textContent = isTotalMode ? "Standard View" : "Total Units";
        // Reset individual overrides
        customUnitState = { days: false, hours: false, minutes: false, seconds: false };
        document.querySelectorAll(".countdown-unit-box").forEach(box => box.classList.remove("is-active"));
        updateCountdown();
      });
    }

    // Individual tile click interaction
    const boxes = [
      { id: "box-days", key: "days" },
      { id: "box-hours", key: "hours" },
      { id: "box-minutes", key: "minutes" },
      { id: "box-seconds", key: "seconds" }
    ];

    boxes.forEach(({ id, key }) => {
      const box = document.getElementById(id);
      if (box) {
        const toggleBox = () => {
          customUnitState[key] = !customUnitState[key];
          box.classList.toggle("is-active", customUnitState[key]);
          updateCountdown();
        };
        box.addEventListener("click", toggleBox);
        box.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleBox();
          }
        });
      }
    });

    // Copy reminder button interaction
    if (btnCopyReminder && copyBtnText) {
      btnCopyReminder.addEventListener("click", async () => {
        const reminderText = `Save the Date! ⚛ Qiskit Fall Fest 2026 — MGIT Hyderabad on October 24, 2026. Explore quantum computing with talks, workshops & hackathons: ${window.location.href}`;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(reminderText);
          } else {
            const temp = document.createElement("textarea");
            temp.value = reminderText;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand("copy");
            document.body.removeChild(temp);
          }
          const original = copyBtnText.textContent;
          copyBtnText.textContent = "Copied! ✓";
          btnCopyReminder.style.borderColor = "var(--lime)";
          btnCopyReminder.style.color = "var(--lime)";
          setTimeout(() => {
            copyBtnText.textContent = original;
            btnCopyReminder.style.borderColor = "";
            btnCopyReminder.style.color = "";
          }, 2400);
        } catch (err) {
          copyBtnText.textContent = "Copied! ✓";
          setTimeout(() => { copyBtnText.textContent = "Remind Me"; }, 2000);
        }
      });
    }

    // Run immediately and then tick every 1000ms
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
}());
