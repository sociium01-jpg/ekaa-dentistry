(function () {
  var file = location.pathname.split("/").pop() || "index.html";

  // ==========================================================================
  // 1. 3D ROTATING TOOTH PRELOADER & PAGE TRANSITION
  // ==========================================================================
  var preloader = document.createElement("div");
  preloader.className = "tooth-preloader";
  preloader.setAttribute("aria-hidden", "true");
  preloader.innerHTML =
    '<div class="tooth-3d-spinner">' +
      '<div class="tooth-3d-ring"></div>' +
      '<svg class="tooth-3d-model" viewBox="0 0 64 64" fill="none">' +
        '<defs>' +
          '<linearGradient id="toothPearl" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">' +
            '<stop offset="0%" stop-color="#ffffff"/>' +
            '<stop offset="55%" stop-color="#f4efe4"/>' +
            '<stop offset="100%" stop-color="#f0d48a"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<path d="M32 8c8.5 0 14 6.2 14.8 14.2.8 7.8 2 13.5.6 19.8-1.5 6.4-4.5 8.5-5.6 12.8-1 3.5-3.5 7.4-7.8 5.2-3.5 1.4-5.2-2.5-6-5.6-1-3.5-2.5-6.4-4.6-11.4-2.5-5.6-1-14.2.6-20.6C25.2 14.8 27 8 32 8z" fill="url(#toothPearl)" stroke="#c79843" stroke-width="2.2"/>' +
        '<path d="M24 18c2.8-2.5 6.5-3 10.5-1.5" stroke="#c79843" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>' +
    '</div>' +
    '<span class="tooth-preloader-label">Ekaa Dentistry</span>';
  document.body.prepend(preloader);

  function hidePreloader() {
    preloader.classList.add("is-done");
  }
  if (document.readyState === "complete") {
    setTimeout(hidePreloader, 180);
  } else {
    window.addEventListener("load", function () {
      setTimeout(hidePreloader, 180);
    });
    setTimeout(hidePreloader, 900);
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href");
    if (!href || href.indexOf("#") === 0 || href.indexOf("tel:") === 0 || href.indexOf("mailto:") === 0 || href.indexOf("http") === 0 || link.target === "_blank") return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    document.body.classList.add("page-leaving");
    setTimeout(function () {
      location.href = href;
    }, 200);
  });

  // ==========================================================================
  // 2. STICKY GLASS HEADER & MOBILE MENU TOGGLE
  // ==========================================================================
  var mast = document.querySelector(".mast");
  function onScroll() {
    if (!mast) return;
    mast.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll(".drop > button").forEach(function (button) {
    button.addEventListener("click", function () {
      var drop = button.parentElement;
      var open = drop.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // ==========================================================================
  // 3. LIVE IST CLINIC HOURS & INTERACTIVE WEEK SWITCHER
  // ==========================================================================
  var days = {
    1: { name: "Monday", open: true },
    2: { name: "Tuesday", open: true },
    3: { name: "Wednesday", open: true },
    4: { name: "Thursday", open: false },
    5: { name: "Friday", open: true },
    6: { name: "Saturday", open: true },
    0: { name: "Sunday", open: true }
  };
  var parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23"
  }).formatToParts(new Date());
  var weekday = parts.filter(function (part) { return part.type === "weekday"; })[0].value;
  var hour = Number(parts.filter(function (part) { return part.type === "hour"; })[0].value);
  var todayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  var today = todayMap[weekday];
  var statusText = today === 4
    ? "Thursday is by appointment only."
    : hour >= 10 && hour < 20
      ? "Open now • Until 8:00 pm"
      : hour < 10
        ? "Closed now • Opens at 10:00 am"
        : today === 3
          ? "Closed now • Thursday is by appointment"
          : "Closed now • Opens tomorrow at 10:00 am";

  document.querySelectorAll(".week").forEach(function (week) {
    var root = week.parentElement;
    var status = root.querySelector(".open-now");
    var detail = root.querySelector(".day-detail");
    var buttons = week.querySelectorAll("button");
    if (status) status.textContent = statusText;

    function show(day) {
      var info = days[day];
      buttons.forEach(function (button) {
        var on = Number(button.getAttribute("data-day")) === day;
        button.setAttribute("aria-pressed", on ? "true" : "false");
      });
      if (!detail || !info) return;
      if (info.open) {
        detail.textContent = info.name + ": 10:00 am – 08:00 pm";
      } else {
        detail.innerHTML = info.name + ': By appointment only · <a href="book.html">Book a visit</a>';
      }
    }

    buttons.forEach(function (button) {
      if (Number(button.getAttribute("data-day")) === today) button.classList.add("is-today");
      button.addEventListener("click", function () {
        show(Number(button.getAttribute("data-day")));
      });
    });
    show(today);
  });

  // Top Utility Bar Injection
  var hero = document.querySelector(".hero");
  if (hero && !document.querySelector(".top-bar")) {
    var topBar = document.createElement("div");
    topBar.className = "top-bar";
    topBar.innerHTML =
      '<div class="wrap">' +
        '<div class="top-bar-links">' +
          '<a href="tel:+919030121100"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>+91 9030121100</a>' +
          '<a href="contact.html"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>Kondapur, Near Gachibowli, Hyderabad</a>' +
          '<a href="mailto:drchandni@ekaadentistry.com">drchandni@ekaadentistry.com</a>' +
        '</div>' +
        '<div class="top-status-badge"><span class="status-pulse"></span><span>' + statusText + '</span></div>' +
      '</div>';
    hero.parentNode.insertBefore(topBar, hero);
  }

  // ==========================================================================
  // 4. INNER PAGE SWIPEABLE SERVICES RAIL
  // ==========================================================================
  function svgIcon(body) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
  }

  var glyphs = {
    clipboard: svgIcon('<rect class="draw-path" x="6" y="3.5" width="12" height="17" rx="2"/><path class="draw-path" d="M9 3.5h6V6H9zM9 11h6M9 15h4"/>'),
    tooth: svgIcon('<path class="draw-path" d="M12 3.5c2.2 0 3.4 2 3.6 4.2.3 2.2.6 3.8.2 5.6-.5 1.8-1.3 2.4-1.6 3.6-.3 1-1 2.1-2.2 1.5-1 .4-1.5-.7-1.7-1.6-.3-1-.7-1.8-1.3-3.2-.7-1.6-.3-4 .2-5.8C10 5.4 10.6 3.5 12 3.5z"/>'),
    implant: svgIcon('<path class="draw-path" d="M12 3v3M9.5 6h5L13.5 9h-3L9.5 6zM11 9v9M9 18h6"/>'),
    wave: svgIcon('<path class="draw-path" d="M4 13c2.2-4 3.8-4 6 0s3.8 4 6 0 3.8-4 4 0M7 18h10"/>'),
    spark: svgIcon('<path class="draw-path" d="M12 3.5l1.1 3.6 3.7.6-3.7.7L12 12l-1.1-3.6-3.7-.7 3.7-.6L12 3.5z"/>'),
    arch: svgIcon('<path class="draw-path" d="M5 15c2.2-5.5 11.8-5.5 14 0"/><circle cx="8" cy="13.2" r="1"/><circle cx="12" cy="11.6" r="1"/><circle cx="16" cy="13.2" r="1"/>'),
    child: svgIcon('<circle cx="12" cy="8" r="2.6"/><path class="draw-path" d="M6.5 19c1-2.8 2.8-4.2 5.5-4.2s4.5 1.4 5.5 4.2"/>'),
    crown: svgIcon('<path class="draw-path" d="M4 17l2.2-8 3.3 3.6L12 5l2.5 7.6L17.8 9 20 17H4z"/>'),
    shield: svgIcon('<path class="draw-path" d="M12 3.5 5 6.5v5.2c0 4.2 2.8 7.2 7 8.8 4.2-1.6 7-4.6 7-8.8V6.5L12 3.5z"/>')
  };

  var servicesList = [
    ["general-checkup.html", "General Checkup", "clipboard"],
    ["root-canal-treatment.html", "Root Canal", "tooth"],
    ["dental-implant-dentistry.html", "Dental Implants", "implant"],
    ["periodonticgumdentistry.html", "Gum Care", "wave"],
    ["cosmetic-dentistry.html", "Cosmetic", "spark"],
    ["orthodontics.html", "Orthodontics", "arch"],
    ["pediatric-dentistry.html", "Pediatric", "child"],
    ["dental-crowns-and-bridges.html", "Crowns & Bridges", "crown"],
    ["oral-maxillofacial.html", "Oral Surgery", "shield"]
  ];

  if (!document.querySelector(".hero-home") && !document.querySelector(".icon-grid") && hero) {
    var rail = document.createElement("div");
    rail.className = "wrap page-rail";
    var grid = document.createElement("div");
    grid.className = "icon-grid";
    servicesList.forEach(function (item) {
      var link = document.createElement("a");
      link.className = "icon-tile";
      link.href = item[0];
      if (item[0] === file) link.setAttribute("aria-current", "page");
      link.innerHTML = '<span class="mark">' + glyphs[item[2]] + "</span><span>" + item[1] + "</span>";
      grid.appendChild(link);
    });
    rail.appendChild(grid);
    hero.after(rail);
  }

  // ==========================================================================
  // 5. INTERACTIVE 3D TOOTH ANATOMY EXPLORER (HOMEPAGE)
  // ==========================================================================
  var toothData = {
    crown: {
      title: "01. Crown, Enamel & Aesthetic Veneers",
      desc: "Protect damaged teeth or transform stained, chipped enamel with custom Zirconia crowns, ultra-thin porcelain veneers, and laser whitening.",
      meta: "1–2 Visits • Digital Smile Design",
      href: "cosmetic-dentistry.html",
      cta: "Explore Cosmetic & Crowns",
      rotY: -14,
      rotX: 8
    },
    pulp: {
      title: "02. Pulp Chamber & Painless Root Canal",
      desc: "Precision rotary endodontics removes deep infection inside the tooth pulp in a single comfortable visit, saving your natural tooth.",
      meta: "Single 45-Min Visit • 100% Painless",
      href: "root-canal-treatment.html",
      cta: "Explore Root Canal Care",
      rotY: 12,
      rotX: -4
    },
    gums: {
      title: "03. Periodontal Gums & Laser Therapy",
      desc: "Healthy gums anchor every smile. We treat bleeding gums, deep pockets, and gum recession using scalpel-free laser periodontal therapy.",
      meta: "Specialist Periodontist • Laser Assisted",
      href: "periodonticgumdentistry.html",
      cta: "Explore Gum Care",
      rotY: -8,
      rotX: -10
    },
    implant: {
      title: "04. Titanium Implant Root & Bone Foundation",
      desc: "Replace missing teeth permanently with Swiss & Swedish titanium implants (Straumann®, Nobel Biocare®) that fuse naturally with jawbone.",
      meta: "Lifetime Durability • 3D Guided",
      href: "dental-implant-dentistry.html",
      cta: "Explore Dental Implants",
      rotY: 18,
      rotX: 10
    }
  };

  var toothSvg = document.getElementById("interactive-tooth-svg");
  var zoneBtns = document.querySelectorAll(".zone-btn");
  var zoneParts = document.querySelectorAll(".tooth-zone-Part");

  function activateToothZone(zoneKey) {
    var info = toothData[zoneKey];
    if (!info) return;
    zoneBtns.forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-zone") === zoneKey);
    });
    zoneParts.forEach(function (part) {
      part.classList.toggle("is-highlighted", part.getAttribute("data-zone") === zoneKey);
    });
    if (toothSvg) {
      toothSvg.style.transform = "rotateY(" + info.rotY + "deg) rotateX(" + info.rotX + "deg) scale(1.04)";
    }
    var titleEl = document.getElementById("zone-title");
    var descEl = document.getElementById("zone-desc");
    var metaEl = document.getElementById("zone-meta");
    var linkEl = document.getElementById("zone-link");
    if (titleEl) titleEl.textContent = info.title;
    if (descEl) descEl.textContent = info.desc;
    if (metaEl) metaEl.textContent = info.meta;
    if (linkEl) {
      linkEl.href = info.href;
      linkEl.textContent = info.cta + " →";
    }
  }

  zoneBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      activateToothZone(btn.getAttribute("data-zone"));
    });
  });
  zoneParts.forEach(function (part) {
    part.addEventListener("click", function () {
      activateToothZone(part.getAttribute("data-zone"));
    });
  });

  // Interactive mouse drag rotation on 3D tooth
  if (toothSvg) {
    var stage = toothSvg.parentElement;
    stage.addEventListener("mousemove", function (e) {
      var rect = stage.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width - 0.5) * 34;
      var y = ((e.clientY - rect.top) / rect.height - 0.5) * -26;
      toothSvg.style.transform = "rotateY(" + x.toFixed(1) + "deg) rotateX(" + y.toFixed(1) + "deg) scale(1.04)";
    });
    stage.addEventListener("mouseleave", function () {
      toothSvg.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
    });
  }

  // ==========================================================================
  // 6. 3D PERSPECTIVE TILT ON CARDS & FRAMES
  // ==========================================================================
  if (window.matchMedia("(min-width: 981px) and (prefers-reduced-motion: no-preference)").matches) {
    document.querySelectorAll(".bento-item, .frame, .review-card, .blog-card, .portrait").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width - 0.5;
        var relY = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = "perspective(900px) rotateX(" + (-relY * 7).toFixed(2) + "deg) rotateY(" + (relX * 7).toFixed(2) + "deg) translateY(-4px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  // ==========================================================================
  // 7. INTERACTIVE STEP TIMELINES, TABS, CATEGORY FILTERS & FAQ ACCORDIONS
  // ==========================================================================
  document.querySelectorAll(".timeline-strip").forEach(function (strip) {
    var nodes = strip.querySelectorAll(".step-node");
    nodes.forEach(function (node) {
      node.addEventListener("click", function () {
        nodes.forEach(function (n) { n.classList.remove("is-active"); });
        node.classList.add("is-active");
      });
    });
  });

  // Tab Switchers & Category Filters
  document.querySelectorAll(".tab-bar").forEach(function (bar) {
    var buttons = bar.querySelectorAll(".tab-btn");
    var filterTargetSelector = bar.getAttribute("data-filter-target");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");

        var tabId = btn.getAttribute("data-tab");
        if (tabId) {
          var container = bar.parentElement;
          container.querySelectorAll(".tab-panel").forEach(function (panel) {
            panel.classList.toggle("is-active", panel.id === tabId);
          });
        }

        var cat = btn.getAttribute("data-filter");
        if (cat && filterTargetSelector) {
          var items = document.querySelectorAll(filterTargetSelector + " [data-category]");
          items.forEach(function (item) {
            var show = cat === "all" || item.getAttribute("data-category").indexOf(cat) !== -1;
            item.style.display = show ? "" : "none";
          });
        }
      });
    });
  });

  // Minimalist Left-Aligned FAQ Accordions
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-trigger");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var open = !item.classList.contains("is-open");
      var stack = item.parentElement;
      if (stack) {
        stack.querySelectorAll(".faq-item.is-open").forEach(function (other) {
          if (other !== item) {
            other.classList.remove("is-open");
            var ob = other.querySelector(".faq-trigger");
            if (ob) ob.setAttribute("aria-expanded", "false");
          }
        });
      }
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // Interactive Booking Slot Chips (book.html)
  document.querySelectorAll(".chip-grid").forEach(function (group) {
    var targetInputId = group.getAttribute("data-input");
    var chips = group.querySelectorAll(".slot-chip");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-selected"); });
        chip.classList.add("is-selected");
        var input = document.getElementById(targetInputId);
        if (input) input.value = chip.getAttribute("data-value") || chip.textContent.trim();
      });
    });
  });

  // ==========================================================================
  // 8. INTERACTIVE 0% EMI CALCULATOR
  // ==========================================================================
  var emiSlider = document.getElementById("emi-amount-slider");
  if (emiSlider) {
    var amountDisplay = document.getElementById("emi-amount-val");
    var resultDisplay = document.getElementById("emi-result-val");
    var tenureBtns = document.querySelectorAll(".tenure-btn");
    var activeTenure = 6;

    function calcEMI() {
      var amount = Number(emiSlider.value);
      if (amountDisplay) amountDisplay.textContent = "₹" + amount.toLocaleString("en-IN");
      var monthly = Math.round(amount / activeTenure);
      if (resultDisplay) resultDisplay.textContent = "₹" + monthly.toLocaleString("en-IN") + "/mo";
    }

    emiSlider.addEventListener("input", calcEMI);
    tenureBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tenureBtns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        activeTenure = Number(btn.getAttribute("data-tenure"));
        calcEMI();
      });
    });
    calcEMI();
  }

  // ==========================================================================
  // 9. APPOINTMENT FORMS & WHATSAPP CONFIRMATION HANDLER
  // ==========================================================================
  document.querySelectorAll("#visit-form, #quick-book, #camp-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = form.querySelector('[name="name"]');
      var phone = form.querySelector('[name="phone"]');
      var email = form.querySelector('[name="email"]');
      var date = form.querySelector('[name="date"]');
      var time = form.querySelector('[name="time"]');
      var need = form.querySelector('[name="need"]');
      var error = form.querySelector(".form-error");
      var ok = true;

      [name, phone, email, date].forEach(function (field) {
        if (field) field.removeAttribute("aria-invalid");
      });

      if (!name || !name.value.trim()) {
        if (name) name.setAttribute("aria-invalid", "true");
        ok = false;
      }
      if (!phone || !phone.value.trim() || !/^[0-9+\s()-]{8,}$/.test(phone.value.trim())) {
        if (phone) phone.setAttribute("aria-invalid", "true");
        ok = false;
      }
      if (date && date.required && !date.value) {
        date.setAttribute("aria-invalid", "true");
        ok = false;
      }
      if (!ok) {
        if (error) {
          error.hidden = false;
          error.textContent = "Please enter your name and a valid phone number.";
        }
        return;
      }
      if (error) error.hidden = true;

      var lines = [
        "Book Your Dental Appointment — Ekaa Dentistry",
        "Patient Name: " + name.value.trim(),
        "Phone: " + phone.value.trim(),
        "Preferred Date: " + (date && date.value ? date.value : "Flexible")
      ];
      if (email && email.value.trim()) lines.push("Email: " + email.value.trim());
      if (time && time.value) lines.push("Preferred Time: " + time.value);
      if (need && need.value.trim()) lines.push("Concern / Service: " + need.value.trim());

      var success = form.id === "quick-book"
        ? form.parentElement.querySelector(".book-done")
        : document.getElementById("form-success");
      if (success) {
        var link = success.querySelector("a");
        if (link) link.href = "https://wa.me/919030121100?text=" + encodeURIComponent(lines.join("\n"));
        form.hidden = true;
        success.hidden = false;
      }
    });
  });

  // ==========================================================================
  // 10. NATIVE APP BOTTOM DOCK (MOBILE/TABLET) & FLOATING MODAL
  // ==========================================================================
  var siteNav = document.querySelector(".nav");
  if (siteNav) {
    var drops = siteNav.querySelectorAll(".drop");
    var services = drops[0] ? drops[0].querySelectorAll("a") : [];
    var more = drops[1] ? drops[1].querySelectorAll("a") : [];
    var serviceHrefs = Array.prototype.map.call(services, function (l) { return l.getAttribute("href"); });
    var moreHrefs = Array.prototype.map.call(more, function (l) { return l.getAttribute("href"); });
    var menuHrefs = ["about.html", "blogs.html"].concat(moreHrefs);

    function dockIcon(path) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="' + path + '" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    }

    var bar = document.createElement("nav");
    bar.className = "app-bar";
    bar.setAttribute("aria-label", "App Navigation");
    bar.innerHTML =
      '<a class="app-tab" href="index.html">' + dockIcon("M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z") + "<span>Home</span></a>" +
      '<button class="app-tab" type="button" data-sheet="services" aria-expanded="false">' + dockIcon("M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z") + "<span>Services</span></button>" +
      '<a class="app-book" href="book.html" aria-label="Book Appointment">Book</a>' +
      '<a class="app-tab" href="contact.html">' + dockIcon("M6 4h3l2 4-2 1a12 12 0 0 0 6 6l1-2 4 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-2z") + "<span>Contact</span></a>" +
      '<button class="app-tab" type="button" data-sheet="menu" aria-expanded="false">' + dockIcon("M4 7h16M4 12h16M4 17h16") + "<span>Explore</span></button>";

    var sheet = document.createElement("div");
    sheet.className = "app-sheet";
    sheet.hidden = true;
    sheet.innerHTML = '<div class="app-sheet-card" role="dialog" aria-modal="true"><h2></h2><div class="app-links"></div></div>';
    document.body.appendChild(sheet);
    document.body.appendChild(bar);

    function markActive(selector, hrefs) {
      var el = bar.querySelector(selector);
      if (el && hrefs.indexOf(file) !== -1) {
        if (el.tagName === "BUTTON") el.classList.add("is-on");
        else el.setAttribute("aria-current", "page");
      }
    }
    markActive('a[href="index.html"]', ["index.html", ""]);
    markActive('a[href="contact.html"]', ["contact.html"]);
    markActive('a[href="book.html"]', ["book.html"]);
    markActive('[data-sheet="services"]', serviceHrefs);
    markActive('[data-sheet="menu"]', menuHrefs);

    var sheetTitle = sheet.querySelector("h2");
    var sheetLinks = sheet.querySelector(".app-links");
    var openSheetName = "";

    function fillSheet(name, anchors) {
      sheetTitle.textContent = name;
      sheetLinks.innerHTML = "";
      anchors.forEach(function (anchor) {
        if (!anchor) return;
        var a = document.createElement("a");
        a.href = anchor.getAttribute("href");
        a.textContent = anchor.textContent.trim();
        if (a.getAttribute("href") === file) a.setAttribute("aria-current", "page");
        sheetLinks.appendChild(a);
      });
    }

    function closeSheet() {
      sheet.hidden = true;
      openSheetName = "";
      bar.querySelectorAll("[data-sheet]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    }

    bar.querySelectorAll("[data-sheet]").forEach(function (button) {
      button.addEventListener("click", function () {
        var name = button.getAttribute("data-sheet");
        if (openSheetName === name) {
          closeSheet();
          return;
        }
        if (name === "services") fillSheet("Dental Services", Array.prototype.slice.call(services));
        else {
          var menuLinks = [
            siteNav.querySelector('a[href="about.html"]'),
            siteNav.querySelector('a[href="blogs.html"]')
          ].concat(Array.prototype.slice.call(more));
          fillSheet("Explore Ekaa Dentistry", menuLinks);
        }
        openSheetName = name;
        sheet.hidden = false;
        bar.querySelectorAll("[data-sheet]").forEach(function (item) {
          item.setAttribute("aria-expanded", item === button ? "true" : "false");
        });
      });
    });

    sheet.addEventListener("click", function (e) {
      if (e.target === sheet) closeSheet();
    });
  }

  // Floating Quick Actions & Quick Booking Modal
  if (!document.querySelector(".floating-actions")) {
    var floatDiv = document.createElement("div");
    floatDiv.className = "floating-actions";
    floatDiv.innerHTML =
      '<a class="floating-btn btn-wa-float" href="https://wa.me/919030121100?text=' + encodeURIComponent("Hi Ekaa Dentistry, I would like to book an appointment.") + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">' +
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z"/><path d="M12 2a10 10 0 0 0-8.52 15.22L2 22l4.9-1.29A10 10 0 1 0 12 2zm0 18a7.96 7.96 0 0 1-4.07-1.11l-.29-.17-3.03.8.81-2.95-.19-.3A7.96 7.96 0 1 1 12 20z"/></svg>' +
        '<span>WhatsApp</span>' +
      '</a>' +
      '<button class="floating-btn btn-book-float" type="button" id="open-quick-modal">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' +
        '<span>Quick Book</span>' +
      '</button>';
    document.body.appendChild(floatDiv);
  }

  if (!document.getElementById("booking-modal-overlay")) {
    var modalOverlay = document.createElement("div");
    modalOverlay.id = "booking-modal-overlay";
    modalOverlay.className = "modal-overlay";
    modalOverlay.setAttribute("aria-hidden", "true");
    modalOverlay.innerHTML =
      '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
        '<button class="modal-close-btn" type="button" id="close-booking-modal" aria-label="Close">✕</button>' +
        '<p class="kicker">Instant Request</p>' +
        '<h2 id="modal-title" style="font-size:1.55rem;margin-bottom:0.35rem;">Book Your Dental Visit</h2>' +
        '<p style="color:var(--muted);font-size:0.86rem;margin-top:0;">Select your concern and preferred date—our Kondapur desk confirms shortly.</p>' +
        '<form class="form" id="modal-visit-form" novalidate>' +
          '<label>Patient Name*<input name="name" type="text" required placeholder="Full Name"></label>' +
          '<label>Phone Number*<input name="phone" type="tel" required placeholder="+91 Mobile Number"></label>' +
          '<div class="form-row-2">' +
            '<label>Preferred Date<input name="date" type="date"></label>' +
            '<label>Service<select name="service">' +
              '<option value="General Checkup">General Checkup</option>' +
              '<option value="Root Canal Treatment">Root Canal Treatment</option>' +
              '<option value="Dental Implants">Dental Implants</option>' +
              '<option value="Periodontic Gum Care">Gum Care / Laser</option>' +
              '<option value="Cosmetic Dentistry">Cosmetic / Whitening</option>' +
              '<option value="Orthodontics & Invisalign">Braces & Invisalign</option>' +
              '<option value="Pediatric Dentistry">Pediatric Dentistry</option>' +
              '<option value="Crowns & Bridges">Crowns & Bridges</option>' +
              '<option value="Oral Surgery">Wisdom Tooth / Surgery</option>' +
            '</select></label>' +
          '</div>' +
          '<p class="form-error" id="modal-form-error" role="alert" hidden></p>' +
          '<button class="btn btn-pink" type="submit" style="width:100%;margin-top:0.35rem;">Confirm Slot Request</button>' +
        '</form>' +
        '<div id="modal-form-success" hidden style="text-align:center;padding:1rem 0;">' +
          '<h3 style="font-family:var(--serif);margin:0 0 0.35rem;">Slot Request Ready!</h3>' +
          '<p style="color:var(--muted);font-size:0.88rem;">Tap below to send your booking details directly to our clinic WhatsApp desk.</p>' +
          '<a class="btn btn-pink" id="modal-wa-link" href="#" target="_blank" rel="noopener">Send via WhatsApp</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modalOverlay);

    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("#open-quick-modal, [data-open-modal]");
      if (trigger) {
        e.preventDefault();
        var preset = trigger.getAttribute("data-open-modal");
        if (preset) {
          var sel = modalOverlay.querySelector('select[name="service"]');
          if (sel) {
            for (var i = 0; i < sel.options.length; i++) {
              if (sel.options[i].value.toLowerCase().indexOf(preset.toLowerCase()) !== -1) {
                sel.selectedIndex = i;
                break;
              }
            }
          }
        }
        modalOverlay.classList.add("is-active");
        modalOverlay.setAttribute("aria-hidden", "false");
      }
      if (e.target.closest("#close-booking-modal") || e.target === modalOverlay) {
        modalOverlay.classList.remove("is-active");
        modalOverlay.setAttribute("aria-hidden", "true");
      }
    });

    var mForm = document.getElementById("modal-visit-form");
    if (mForm) {
      mForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var n = mForm.querySelector('[name="name"]');
        var p = mForm.querySelector('[name="phone"]');
        var d = mForm.querySelector('[name="date"]');
        var s = mForm.querySelector('[name="service"]');
        var err = document.getElementById("modal-form-error");
        if (!n.value.trim() || !p.value.trim()) {
          err.hidden = false;
          err.textContent = "Please enter your name and phone number.";
          return;
        }
        err.hidden = true;
        var msg = [
          "Hello Ekaa Dentistry, I would like to book an appointment.",
          "Name: " + n.value.trim(),
          "Phone: " + p.value.trim(),
          "Date: " + (d.value || "Next Available"),
          "Treatment: " + s.value
        ].join("\n");
        document.getElementById("modal-wa-link").href = "https://wa.me/919030121100?text=" + encodeURIComponent(msg);
        mForm.hidden = true;
        document.getElementById("modal-form-success").hidden = false;
      });
    }
  }

  // Scroll Reveal Observer
  var revealTargets = document.querySelectorAll(".band > .wrap, .bento-item, .step-node, .review-card, .blog-card, .faq-item");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealTargets.forEach(function (t) {
      t.classList.add("reveal");
      io.observe(t);
    });
  }
})();
