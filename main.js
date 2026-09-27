(function () {
  var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (file && file.indexOf(".html") === -1) file += ".html";

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
    var activeTile = grid.querySelector('[aria-current="page"]');
    if (activeTile && typeof activeTile.scrollIntoView === "function") {
      setTimeout(function () {
        try { activeTile.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); } catch (e) {}
      }, 250);
    }
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
  // 10. NATIVE APP TOP HEADER, BOTTOM DOCK & SLIDE-UP SHEET (MOBILE/TABLET)
  // ==========================================================================
  var siteNav = document.querySelector(".nav");
  if (siteNav) {
    var normFile = (file || "index.html").toLowerCase();
    if (normFile && normFile.indexOf(".html") === -1) normFile += ".html";

    var drops = siteNav.querySelectorAll(".drop");
    var services = drops[0] ? drops[0].querySelectorAll("a") : [];
    var more = drops[1] ? drops[1].querySelectorAll("a") : [];
    var serviceHrefs = Array.prototype.map.call(services, function (l) { return l.getAttribute("href"); });
    var moreHrefs = Array.prototype.map.call(more, function (l) { return l.getAttribute("href"); });
    var menuHrefs = ["about.html", "blogs.html", "contact.html"].concat(moreHrefs);

    function dockIcon(path) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" aria-hidden="true"><path d="' + path + '" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    }

    // Inject Top-Right App Action Pills inside .mast-inner on Mobile/Tablet
    var mastInner = document.querySelector(".mast-inner");
    if (mastInner && !mastInner.querySelector(".app-top-actions")) {
      var topAct = document.createElement("div");
      topAct.className = "app-top-actions";
      topAct.innerHTML =
        '<a class="app-top-btn" href="tel:+919030121100" aria-label="Call Clinic">' +
          dockIcon("M6 4h3l2 4-2 1a12 12 0 0 0 6 6l1-2 4 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-2z") +
          '<span>Call</span>' +
        '</a>' +
        '<button class="app-top-btn app-top-btn-gold" type="button" data-sheet="menu" aria-expanded="false">' +
          dockIcon("M4 7h16M4 12h16M4 17h16") +
          '<span>Menu</span>' +
        '</button>';
      mastInner.appendChild(topAct);
    }

    // Floating 5-Tab Bottom App Dock
    var bar = document.createElement("nav");
    bar.className = "app-bar";
    bar.setAttribute("aria-label", "App Navigation");
    bar.innerHTML =
      '<a class="app-tab" href="index.html">' + dockIcon("M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z") + "<span>Home</span></a>" +
      '<button class="app-tab" type="button" data-sheet="services" aria-expanded="false">' + dockIcon("M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z") + "<span>Services</span></button>" +
      '<a class="app-book" href="book.html" aria-label="Book Appointment">' +
        dockIcon("M8 2v3M16 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z") +
        "<span>Book</span>" +
      "</a>" +
      '<a class="app-tab" href="https://wa.me/919030121100?text=' + encodeURIComponent("Hello Ekaa Dentistry, I would like to book a consultation.") + '" target="_blank" rel="noopener">' +
        dockIcon("M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z") +
        "<span>WhatsApp</span>" +
      "</a>" +
      '<button class="app-tab" type="button" data-sheet="menu" aria-expanded="false">' + dockIcon("M4 7h16M4 12h16M4 17h16") + "<span>Explore</span></button>";

    // Slide-Up App Sheet with Drag Handle, Close Button & Quick Actions Footer
    var sheet = document.createElement("div");
    sheet.className = "app-sheet";
    sheet.hidden = true;
    sheet.innerHTML =
      '<div class="app-sheet-card" role="dialog" aria-modal="true">' +
        '<div class="app-sheet-handle"></div>' +
        '<div class="app-sheet-head">' +
          '<h2></h2>' +
          '<button type="button" class="app-sheet-close" aria-label="Close menu">✕</button>' +
        '</div>' +
        '<div class="app-links"></div>' +
        '<div class="app-sheet-footer">' +
          '<a class="btn btn-outline" href="tel:+919030121100" style="text-align:center;">Call +91 9030121100</a>' +
          '<a class="btn btn-pink" href="book.html" style="text-align:center;">Book Slot Now</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(sheet);
    document.body.appendChild(bar);

    function markActive(selector, hrefs) {
      var el = bar.querySelector(selector);
      if (el && hrefs.indexOf(normFile) !== -1) {
        if (el.tagName === "BUTTON") el.classList.add("is-on");
        else el.setAttribute("aria-current", "page");
      }
    }
    markActive('a[href="index.html"]', ["index.html"]);
    markActive('a[href="book.html"]', ["book.html"]);
    markActive('[data-sheet="services"]', serviceHrefs);
    markActive('[data-sheet="menu"]', menuHrefs);

    var sheetTitle = sheet.querySelector("h2");
    var sheetLinks = sheet.querySelector(".app-links");
    var openSheetName = "";

    function fillSheet(name, anchors) {
      sheetTitle.textContent = name;
      sheetLinks.innerHTML = "";
      var seen = {};
      anchors.forEach(function (anchor) {
        if (!anchor) return;
        var href = anchor.getAttribute("href");
        if (!href || seen[href]) return;
        seen[href] = true;
        var a = document.createElement("a");
        a.href = href;
        a.textContent = anchor.textContent.trim();
        if (href === normFile) a.setAttribute("aria-current", "page");
        sheetLinks.appendChild(a);
      });
    }

    function closeSheet() {
      sheet.hidden = true;
      openSheetName = "";
      document.querySelectorAll("[data-sheet]").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    }

    document.querySelectorAll("[data-sheet]").forEach(function (button) {
      button.addEventListener("click", function () {
        var name = button.getAttribute("data-sheet");
        if (openSheetName === name && !sheet.hidden) {
          closeSheet();
          return;
        }
        if (name === "services") {
          fillSheet("9 Dental Specialties", Array.prototype.slice.call(services));
        } else {
          var menuLinks = [
            siteNav.querySelector('a[href="about.html"]'),
            siteNav.querySelector('a[href="emi-insurance.html"]'),
            siteNav.querySelector('a[href="international-patients.html"]'),
            siteNav.querySelector('a[href="patient-testimonials.html"]'),
            siteNav.querySelector('a[href="community-outreach.html"]'),
            siteNav.querySelector('a[href="blogs.html"]'),
            siteNav.querySelector('a[href="contact.html"]')
          ].concat(Array.prototype.slice.call(more));
          fillSheet("Explore Ekaa Dentistry", menuLinks);
        }
        openSheetName = name;
        sheet.hidden = false;
        document.querySelectorAll("[data-sheet]").forEach(function (item) {
          item.setAttribute("aria-expanded", item.getAttribute("data-sheet") === name ? "true" : "false");
        });
      });
    });

    sheet.querySelector(".app-sheet-close").addEventListener("click", closeSheet);
    sheet.addEventListener("click", function (e) {
      if (e.target === sheet) closeSheet();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !sheet.hidden) closeSheet();
    });

    // Touch Swipe-Down to Close Bottom Sheet
    var sheetCard = sheet.querySelector(".app-sheet-card");
    var touchStartY = 0;
    sheetCard.addEventListener("touchstart", function (e) {
      if (e.touches && e.touches.length) touchStartY = e.touches[0].clientY;
    }, { passive: true });
    sheetCard.addEventListener("touchend", function (e) {
      if (e.changedTouches && e.changedTouches.length) {
        var dy = e.changedTouches[0].clientY - touchStartY;
        if (dy > 65 && sheetCard.scrollTop <= 5) closeSheet();
      }
    }, { passive: true });
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

  // ==========================================================================
  // 11. PLUGIN-POWERED ANIMATION ENGINE (GSAP + ScrollTrigger + SplitType + Lenis)
  // ==========================================================================

  // A. Subtle Cursor Radial Spotlight on Interactive Surfaces
  if (window.matchMedia("(min-width: 981px) and (prefers-reduced-motion: no-preference)").matches) {
    document.querySelectorAll(".bento-item, .icon-tile, .review-card, .why-grid article").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", (e.clientX - r.left) + "px");
        card.style.setProperty("--spot-y", (e.clientY - r.top) + "px");
      });
    });
  }

  // B. Page-Specific User-Triggered Clinical Visualizers
  // 1. Dental Implants 3-Part Exploded Toggle
  var explodeBtn = document.getElementById("implant-explode-btn");
  var implantStack = document.getElementById("implant-3d-stack");
  if (explodeBtn && implantStack) {
    explodeBtn.addEventListener("click", function () {
      var exp = implantStack.classList.toggle("is-exploded");
      explodeBtn.textContent = exp ? "Lock 3-part implant together" : "Separate 3-part implant layers";
      if (window.gsap) {
        window.gsap.fromTo(
          implantStack.querySelectorAll(".implant-part"),
          { scale: 0.96 },
          { scale: 1, duration: 0.45, stagger: 0.06, ease: "back.out(2)" }
        );
      }
    });
  }

  // 2. Orthodontics Interactive Alignment Scrubber
  var orthoSlider = document.getElementById("ortho-month-slider");
  if (orthoSlider) {
    var orthoLabel = document.getElementById("ortho-month-label");
    var teeth = document.querySelectorAll(".ortho-tooth-unit");
    var offsets = [-14, 12, -9, 15, -11, 8];
    function updateOrtho() {
      var m = Number(orthoSlider.value);
      var factor = (12 - m) / 11;
      if (orthoLabel) orthoLabel.textContent = "Month " + m + (m === 12 ? " — Aligned arch" : " — Active tray progression");
      teeth.forEach(function (t, i) {
        var rot = (offsets[i % offsets.length] * factor).toFixed(1);
        var ty = (Math.abs(offsets[i % offsets.length]) * 0.45 * factor).toFixed(1);
        t.style.transform = " translateY(" + ty + "px) rotate(" + rot + "deg)";
      });
    }
    orthoSlider.addEventListener("input", updateOrtho);
    updateOrtho();
  }

  // 3. Cosmetic Dentistry Shade & Veneer Slider
  var shadeSlider = document.getElementById("smile-shade-slider");
  if (shadeSlider) {
    var shadeLabel = document.getElementById("smile-shade-label");
    var shadeTeeth = document.querySelectorAll(".cosmetic-tooth-unit");
    function updateShade() {
      var v = Number(shadeSlider.value);
      if (shadeLabel) shadeLabel.textContent = "Shade improvement: +" + v + " VITA shades brighter";
      var light = 84 + v * 2;
      shadeTeeth.forEach(function (t) {
        t.style.background = "linear-gradient(180deg, #ffffff 0%, hsl(42, 45%, " + light + "%) 100%)";
      });
    }
    shadeSlider.addEventListener("input", updateShade);
    updateShade();
  }

  // 4. Live Appointment Ticket Preview + Interactive Step Gauge on book.html
  var ticketEl = document.querySelector(".ticket-preview");
  if (ticketEl && !document.querySelector(".booking-step-gauge")) {
    var gauge = document.createElement("div");
    gauge.className = "booking-step-gauge";
    gauge.innerHTML =
      '<div class="booking-gauge-meta"><span>Slot Configuration Progress</span><strong id="booking-gauge-pct">66% Ready</strong></div>' +
      '<div class="booking-gauge-track"><div class="booking-gauge-fill" id="booking-gauge-bar" style="width:66%"></div></div>';
    ticketEl.insertBefore(gauge, ticketEl.firstChild);
  }

  document.querySelectorAll(".chip-grid").forEach(function (group) {
    var inputId = group.getAttribute("data-input");
    group.querySelectorAll(".slot-chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var val = chip.getAttribute("data-value") || chip.textContent.trim();
        if (inputId === "need") {
          var ts = document.getElementById("ticket-service");
          if (ts) ts.textContent = val;
        }
        if (inputId === "time") {
          var tt = document.getElementById("ticket-slot");
          if (tt) tt.textContent = val;
        }
        if (ticketEl) {
          ticketEl.classList.add("is-pulsing");
          setTimeout(function () { ticketEl.classList.remove("is-pulsing"); }, 500);
        }
      });
    });
  });

  // Update booking gauge to 100% when patient types name/phone on book.html
  if (ticketEl) {
    var bForm = document.getElementById("visit-form");
    if (bForm) {
      bForm.addEventListener("input", function () {
        var n = bForm.querySelector('[name="name"]');
        var p = bForm.querySelector('[name="phone"]');
        var bar = document.getElementById("booking-gauge-bar");
        var pct = document.getElementById("booking-gauge-pct");
        var ready = (n && n.value.trim().length > 1) && (p && p.value.trim().length > 5);
        if (bar && pct) {
          bar.style.width = ready ? "100%" : "82%";
          pct.textContent = ready ? "100% Ready to Confirm" : "82% Almost Ready";
        }
      });
    }
  }

  // C. Inject Page-Specific Infographics & Metric Strips Across All 18 Pages
  var pageName = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (pageName && pageName.indexOf(".html") === -1) pageName += ".html";

  // 1. Homepage Trust Counter Ribbon (index.html)
  if (pageName === "index.html") {
    var aboutSplit = document.querySelector(".band .split");
    if (aboutSplit && !document.querySelector(".home-stats-ribbon")) {
      var ribbon = document.createElement("div");
      ribbon.className = "home-stats-ribbon";
      ribbon.innerHTML =
        '<div class="stat-box" data-ring-pct="95"><span class="stat-num" data-count="10" data-suffix="+ Yrs">10+ Yrs</span><span class="stat-label">Specialist Implant &amp; Gum Care</span></div>' +
        '<div class="stat-box" data-ring-pct="98"><span class="stat-num" data-count="5000" data-suffix="+">5,000+</span><span class="stat-label">Smiles Restored in Hyderabad</span></div>' +
        '<div class="stat-box" data-ring-pct="99"><span class="stat-num" data-count="99" data-suffix="%">99%</span><span class="stat-label">Pain-Free Patient Feedback</span></div>' +
        '<div class="stat-box" data-ring-pct="100"><span class="stat-num" data-count="100" data-suffix="%">100%</span><span class="stat-label">Class-B Autoclave Sterilization</span></div>';
      aboutSplit.parentNode.appendChild(ribbon);
    }
  }

  // 2. Service Page Tailored 3-Metric Radial Counter Strips (if page doesn't already have .stat-strip)
  var serviceMetricsMap = {
    "general-checkup.html": [
      { count: 6, suffix: " Mo", pct: 85, label: "Recommended Preventive Interval" },
      { count: 80, suffix: "%", pct: 80, label: "Cavity Risk Reduction" },
      { count: 30, suffix: " Min", pct: 90, label: "Gentle Ultrasonic Session" }
    ],
    "root-canal-treatment.html": [
      { count: 1, suffix: " Visit", pct: 95, label: "Single-Sitting Rotary RCT" },
      { count: 45, suffix: " Min", pct: 88, label: "Typical Chairside Duration" },
      { count: 99, suffix: "%", pct: 99, label: "Painless Anesthesia Comfort" }
    ],
    "dental-implant-dentistry.html": [
      { count: 98, suffix: "%", pct: 98, label: "Osseointegration Success Rate" },
      { count: 30, suffix: " Min", pct: 90, label: "Keyhole Fixture Placement" },
      { count: 25, suffix: "+ Yrs", pct: 96, label: "Clinical Structural Longevity" }
    ],
    "periodonticgumdentistry.html": [
      { count: 2, suffix: " mm", pct: 92, label: "Healthy Gum Sulcus Target" },
      { count: 99, suffix: "%", pct: 99, label: "Laser Bacterial Reduction" },
      { count: 1, suffix: " Visit", pct: 95, label: "Suture-Free Laser Protocol" }
    ],
    "cosmetic-dentistry.html": [
      { count: 8, suffix: " Shades", pct: 92, label: "VITA Brightening Potential" },
      { count: 3, suffix: " Days", pct: 88, label: "Digital Smile Design Preview" },
      { count: 15, suffix: "+ Yrs", pct: 95, label: "E-Max Veneer Colour Stability" }
    ],
    "orthodontics.html": [
      { count: 22, suffix: " Hrs", pct: 92, label: "Daily Clear Aligner Wear" },
      { count: 12, suffix: " Mo", pct: 88, label: "Average Arch Alignment" },
      { count: 100, suffix: "%", pct: 100, label: "3D Digital Scan Accuracy" }
    ],
    "pediatric-dentistry.html": [
      { count: 80, suffix: "%", pct: 80, label: "Molar Sealant Cavity Protection" },
      { count: 10, suffix: " Min", pct: 94, label: "Quick Fluoride Varnish Application" },
      { count: 100, suffix: "%", pct: 100, label: "Child-Friendly Tell-Show-Do Care" }
    ],
    "oral-maxillofacial.html": [
      { count: 100, suffix: "%", pct: 100, label: "Digital OPG Nerve Mapping" },
      { count: 35, suffix: " Min", pct: 90, label: "Atraumatic Molar Removal" },
      { count: 99, suffix: "%", pct: 99, label: "Socket Preservation Comfort" }
    ],
    "emi-insurance.html": [
      { count: 0, suffix: "%", pct: 100, label: "Interest on Treatment EMIs" },
      { count: 12, suffix: " Mo", pct: 92, label: "Flexible Monthly Tenures" },
      { count: 5, suffix: " Min", pct: 96, label: "Instant Chairside Approval" }
    ],
    "international-patients.html": [
      { count: 75, suffix: "%", pct: 75, label: "Average Global Cost Savings" },
      { count: 35, suffix: " Min", pct: 88, label: "Drive from HYD Airport via ORR" },
      { count: 6, suffix: " Days", pct: 94, label: "Express Crown &amp; Veneer Turnaround" }
    ]
  };

  if (serviceMetricsMap[pageName] && !document.querySelector(".stat-strip")) {
    var firstProse = document.querySelector(".band .prose");
    if (firstProse) {
      var strip = document.createElement("div");
      strip.className = "stat-strip";
      strip.innerHTML = serviceMetricsMap[pageName].map(function (m) {
        return (
          '<div class="stat-box" data-ring-pct="' + m.pct + '">' +
            '<span class="stat-num" data-count="' + m.count + '" data-suffix="' + m.suffix + '">' + m.count + m.suffix + '</span>' +
            '<span class="stat-label">' + m.label + '</span>' +
          '</div>'
        );
      }).join("");
      var actions = firstProse.querySelector(".hero-actions");
      if (actions) {
        firstProse.insertBefore(strip, actions);
      } else {
        firstProse.appendChild(strip);
      }
    }
  }

  // 3. Upgrade Every .stat-box with a Circular SVG Radial Gauge Ring
  document.querySelectorAll(".stat-box").forEach(function (box) {
    if (box.querySelector(".stat-ring-wrap")) return;
    var pct = Number(box.getAttribute("data-ring-pct")) || 92;
    var numEl = box.querySelector(".stat-num");
    var lblEl = box.querySelector(".stat-label");
    if (!numEl || !lblEl) return;
    var copyWrap = document.createElement("div");
    copyWrap.className = "stat-box-copy";
    copyWrap.appendChild(numEl);
    copyWrap.appendChild(lblEl);
    box.innerHTML = "";
    box.appendChild(copyWrap);

    var ringWrap = document.createElement("div");
    ringWrap.className = "stat-ring-wrap";
    ringWrap.setAttribute("data-target-pct", String(pct));
    ringWrap.innerHTML =
      '<svg class="stat-ring-svg" viewBox="0 0 48 48" aria-hidden="true">' +
        '<circle class="stat-ring-bg" cx="24" cy="24" r="20"></circle>' +
        '<circle class="stat-ring-progress" cx="24" cy="24" r="20"></circle>' +
      '</svg>' +
      '<span class="stat-ring-icon">✓</span>';
    box.appendChild(ringWrap);
  });

  // 4. Anatomical Callout Pills inside .clinical-viz-card
  var vizCalloutsMap = {
    "general-checkup.html": ["28 kHz Piezo Tip", "Zero Enamel Abrasion", "Warm Water Irrigation"],
    "root-canal-treatment.html": ["Electronic Apex Locator", "Flexible NiTi Rotary File", "3D Bioceramic Seal"],
    "dental-implant-dentistry.html": ["CAD/CAM Zirconia Crown", "Anti-Rotational Hex Abutment", "SLA Active Titanium Root"],
    "periodonticgumdentistry.html": ["980nm Diode Laser", "Bloodless Pocket Sterilization", "Collagen Re-Attachment"],
    "cosmetic-dentistry.html": ["0.3mm Lithium Disilicate", "Natural Incisal Translucency", "Stain-Resistant Glaze"],
    "orthodontics.html": ["0.25mm Smart Force Step", "BPA-Free Medical Polymer", "3D Digital Arch Preview"],
    "pediatric-dentistry.html": ["BPA-Free Molar Sealant", "Fluoride Ion Mineralization", "Acid-Deflecting Barrier"],
    "dental-crowns-and-bridges.html": ["1200 MPa Monolithic Block", "5-Axis CAD/CAM Milling", "Biocompatible Gum Margin"],
    "oral-maxillofacial.html": ["Digital OPG Nerve Trace", "Piezosurgical Bone Preservation", "PRF Accelerated Healing"],
    "international-patients.html": ["35 Min ORR Airport Link", "FDA/CE Implant Passports", "Pre-Booked Priority Slots"]
  };

  var vizStage = document.querySelector(".clinical-viz-card .viz-stage");
  if (vizStage && vizCalloutsMap[pageName] && !vizStage.querySelector(".viz-callout-row")) {
    var calloutRow = document.createElement("div");
    calloutRow.className = "viz-callout-row";
    calloutRow.innerHTML = vizCalloutsMap[pageName].map(function (txt) {
      return '<span class="viz-callout-pill"><span class="viz-callout-dot"></span>' + txt + '</span>';
    }).join("");
    vizStage.appendChild(calloutRow);
  }

  // 5. Interactive EMI Segmented Split Bar on emi-insurance.html
  var emiResultCard = document.querySelector(".emi-result-card");
  if (emiResultCard && !emiResultCard.querySelector(".emi-segment-wrap")) {
    var segWrap = document.createElement("div");
    segWrap.className = "emi-segment-wrap";
    segWrap.innerHTML =
      '<span class="emi-segment-label" id="emi-seg-caption">Visual Split: 6 Equal 0%-Interest Monthly Slices</span>' +
      '<div class="emi-segment-bar" id="emi-segment-bar"></div>';
    emiResultCard.appendChild(segWrap);

    function renderEmiSegments(months) {
      var bar = document.getElementById("emi-segment-bar");
      var cap = document.getElementById("emi-seg-caption");
      if (!bar) return;
      if (cap) cap.textContent = "Visual Split: " + months + " Equal 0%-Interest Monthly Slices";
      bar.innerHTML = "";
      for (var i = 0; i < months; i++) {
        var u = document.createElement("span");
        u.className = "emi-seg-unit";
        bar.appendChild(u);
      }
      if (window.gsap) {
        window.gsap.fromTo(
          bar.querySelectorAll(".emi-seg-unit"),
          { scaleX: 0, opacity: 0.2 },
          { scaleX: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: "power2.out" }
        );
      }
    }
    var activeTen = document.querySelector(".tenure-btn.is-active");
    renderEmiSegments(activeTen ? Number(activeTen.getAttribute("data-tenure")) || 6 : 6);
    document.querySelectorAll(".tenure-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        renderEmiSegments(Number(btn.getAttribute("data-tenure")) || 6);
      });
    });
  }

  // 6. 5-Star Rating Breakdown Infographic on patient-testimonials.html
  if (pageName === "patient-testimonials.html") {
    var testProse = document.querySelector(".band .prose");
    if (testProse && !document.querySelector(".rating-breakdown-card")) {
      var rb = document.createElement("div");
      rb.className = "rating-breakdown-card";
      rb.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.45rem;">' +
          '<strong style="font-size:0.86rem;">Verified Google Rating Distribution</strong>' +
          '<span style="font-size:0.78rem;color:var(--pink-deep);font-weight:700;">4.9 / 5.0 ★</span>' +
        '</div>' +
        '<div class="rating-bar-row"><span>5 ★</span><div class="bar-track"><div class="bar-fill" style="width:96%"></div></div><span>96%</span></div>' +
        '<div class="rating-bar-row"><span>4 ★</span><div class="bar-track"><div class="bar-fill" style="width:4%"></div></div><span>4%</span></div>' +
        '<div class="rating-bar-row"><span>3 ★</span><div class="bar-track"><div class="bar-fill" style="width:0%"></div></div><span>0%</span></div>';
      testProse.appendChild(rb);
    }
  }

  // 7. Live IST Clinic Day-Progress Timeline Bar inside Hours Card (index.html & contact.html)
  document.querySelectorAll(".card .day-detail").forEach(function (detailEl) {
    if (detailEl.parentNode.querySelector(".clinic-day-timeline")) return;
    var now = new Date();
    var utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    var ist = new Date(utcMs + 5.5 * 3600000);
    var hrs = ist.getHours() + ist.getMinutes() / 60;
    var pct = Math.max(8, Math.min(100, Math.round(((hrs - 9.5) / (21 - 9.5)) * 100)));
    var statusText = (hrs >= 9.5 && hrs <= 21) ? "Clinic Active Now (IST)" : "Next Session Opens 9:30 AM IST";
    var tl = document.createElement("div");
    tl.className = "clinic-day-timeline";
    tl.innerHTML =
      '<div class="clinic-day-meta"><span>09:30 AM</span><span style="color:var(--pink-deep)">' + statusText + '</span><span>09:00 PM</span></div>' +
      '<div class="clinic-day-track"><div class="clinic-day-fill" data-target-width="' + pct + '%" style="width:0%"></div></div>';
    detailEl.parentNode.insertBefore(tl, detailEl.nextSibling);
  });

  // 8. Inject Liquid-Gold Scroll Progress Track into Every .timeline-strip
  document.querySelectorAll(".timeline-strip").forEach(function (strip) {
    if (strip.querySelector(".timeline-Progress-track")) return;
    var track = document.createElement("div");
    track.className = "timeline-Progress-track";
    track.innerHTML = '<div class="timeline-progress-fill"></div>';
    strip.insertBefore(track, strip.firstChild);
  });

  // 9. Inject Rotating Specialty Pill in Hero on Service/Utility Pages
  var heroInner = document.querySelector(".hero-inner");
  if (heroInner && !heroInner.querySelector(".specialty-rotator-pill")) {
    var rotPill = document.createElement("div");
    rotPill.className = "specialty-rotator-pill";
    rotPill.innerHTML =
      '<span class="viz-callout-dot"></span>' +
      '<span>Clinical Focus:</span>' +
      '<span class="specialty-rotator-word" id="specialty-rotator-word">3D Guided Dental Implants</span>';
    heroInner.appendChild(rotPill);
  }

  // D. Load Local Vendor Plugins (GSAP + ScrollTrigger + SplitType + Lenis) & Run Choreographed Animations
  function loadScript(src) {
    return new Promise(function (resolve) {
      var s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = function () { resolve(true); };
      s.onerror = function () { resolve(false); };
      document.head.appendChild(s);
    });
  }

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    Promise.all([
      loadScript("assets/vendor/gsap.min.js"),
      loadScript("assets/vendor/ScrollTrigger.min.js"),
      loadScript("assets/vendor/split-type.min.js"),
      loadScript("assets/vendor/lenis.min.js")
    ]).then(function () {
      var gsap = window.gsap;
      var ScrollTrigger = window.ScrollTrigger;
      var SplitType = window.SplitType;
      var Lenis = window.Lenis;
      if (!gsap) return;

      if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

      // 1. Lenis Smooth Inertial Scrolling synced with GSAP Ticker
      if (Lenis) {
        try {
          var lenis = new Lenis({ duration: 1.05, smoothWheel: true });
          if (ScrollTrigger) lenis.on("scroll", ScrollTrigger.update);
          gsap.ticker.add(function (time) {
            lenis.raf(time * 1000);
          });
          gsap.ticker.lagSmoothing(0);
        } catch (e) {}
      }

      // 2. SYSTEM 1 — TEXT ANIMATIONS (SplitType Masked Line Curtain Reveal + Scroll-Lit Clinical Phrases + Specialty Rotator)
      if (SplitType) {
        document.querySelectorAll(".hero h1, .page-title, .band h2").forEach(function (heading) {
          if (heading.getAttribute("data-split-done")) return;
          heading.setAttribute("data-split-done", "1");
          try {
            var split = new SplitType(heading, { types: "lines", lineClass: "split-line-inner" });
            if (!split.lines || !split.lines.length) return;
            split.lines.forEach(function (line) {
              var mask = document.createElement("span");
              mask.className = "split-line-mask";
              line.parentNode.insertBefore(mask, line);
              mask.appendChild(line);
            });
            gsap.fromTo(
              split.lines,
              { yPercent: 105, opacity: 0 },
              {
                yPercent: 0,
                opacity: 1,
                duration: 0.78,
                stagger: 0.09,
                ease: "power3.out",
                scrollTrigger: ScrollTrigger ? { trigger: heading, start: "top 88%", once: true } : undefined
              }
            );
          } catch (err) {}
        });
      }

      // Scroll-Lit Clinical Phrases inside .prose p strong and .review-card blockquote
      document.querySelectorAll(".prose p strong, .prose li strong").forEach(function (strongEl) {
        strongEl.classList.add("scroll-lit-phrase");
        if (ScrollTrigger) {
          ScrollTrigger.create({
            trigger: strongEl,
            start: "top 86%",
            once: true,
            onEnter: function () { strongEl.classList.add("is-lit"); }
          });
        } else {
          strongEl.classList.add("is-lit");
        }
      });

      // Rotating Specialty Word Pill Animation
      var rotWordEl = document.getElementById("specialty-rotator-word");
      if (rotWordEl) {
        var specialties = [
          "3D Guided Dental Implants",
          "Laser Periodontal Gum Care",
          "Single-Sitting Rotary RCT",
          "Invisible Clear Aligners",
          "Monolithic Zirconia Crowns",
          "Pediatric Preventive Care"
        ];
        var sIdx = 0;
        setInterval(function () {
          sIdx = (sIdx + 1) % specialties.length;
          gsap.to(rotWordEl, {
            y: -8,
            opacity: 0,
            duration: 0.24,
            ease: "power2.in",
            onComplete: function () {
              rotWordEl.textContent = specialties[sIdx];
              gsap.fromTo(rotWordEl, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32, ease: "power2.out" });
            }
          });
        }, 3000);
      }

      // 3. SYSTEM 2 — NUMBER & CIRCULAR SVG GAUGE ANIMATIONS (Odometer Roll + Radial Ring Draw)
      document.querySelectorAll("[data-count]").forEach(function (el) {
        var target = Number(el.getAttribute("data-count")) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var prefix = el.getAttribute("data-prefix") || "";
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.45,
          ease: "power3.out",
          scrollTrigger: ScrollTrigger ? { trigger: el, start: "top 88%", once: true } : undefined,
          onUpdate: function () {
            el.textContent = prefix + Math.round(obj.val).toLocaleString("en-IN") + suffix;
          }
        });
      });

      document.querySelectorAll(".stat-ring-wrap").forEach(function (wrap) {
        var pct = Number(wrap.getAttribute("data-target-pct")) || 92;
        var circle = wrap.querySelector(".stat-ring-progress");
        if (!circle) return;
        var circumference = 125.6;
        var targetOffset = circumference * (1 - pct / 100);
        gsap.to(circle, {
          strokeDashoffset: targetOffset,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: ScrollTrigger ? { trigger: wrap, start: "top 88%", once: true } : undefined
        });
      });

      // 4. SYSTEM 3 — INFOGRAPHIC & CLINICAL DIAGRAM ANIMATIONS
      // a) Scroll-Drawing Liquid-Gold Timeline Progress Line & Sequential Step Illumination
      document.querySelectorAll(".timeline-strip").forEach(function (strip) {
        var fill = strip.querySelector(".timeline-progress-fill");
        var nodes = strip.querySelectorAll(".step-node");
        if (fill) {
          gsap.fromTo(
            fill,
            { width: "0%" },
            {
              width: "100%",
              duration: 1.6,
              ease: "power2.inOut",
              scrollTrigger: ScrollTrigger ? { trigger: strip, start: "top 82%", once: true } : undefined
            }
          );
        }
        if (nodes.length) {
          gsap.fromTo(
            nodes,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.16,
              ease: "power3.out",
              scrollTrigger: ScrollTrigger ? { trigger: strip, start: "top 84%", once: true } : undefined
            }
          );
        }
      });

      // b) Comparison Bars & Rating Breakdown Bars Scrubbing from 0%
      document.querySelectorAll(".bar-fill").forEach(function (bar) {
        var targetW = bar.style.width || getComputedStyle(bar).getPropertyValue("--fill") || "80%";
        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: targetW.trim(),
            duration: 1.35,
            ease: "power3.out",
            scrollTrigger: ScrollTrigger ? { trigger: bar, start: "top 90%", once: true } : undefined
          }
        );
      });

      // c) Clinic Live Day-Progress Bar Fill
      document.querySelectorAll(".clinic-day-fill").forEach(function (df) {
        var tw = df.getAttribute("data-target-width") || "65%";
        gsap.to(df, {
          width: tw,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: ScrollTrigger ? { trigger: df, start: "top 92%", once: true } : undefined
        });
      });

      // d) Anatomical Callout Pills Stagger Entrance
      document.querySelectorAll(".viz-callout-row").forEach(function (row) {
        var pills = row.querySelectorAll(".viz-callout-pill");
        gsap.fromTo(
          pills,
          { y: 12, opacity: 0, scale: 0.92 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.12,
            ease: "back.out(1.7)",
            scrollTrigger: ScrollTrigger ? { trigger: row, start: "top 90%", once: true } : undefined
          }
        );
      });

      // 5. SYSTEM 4 — ICON ANIMATIONS (Self-Drawing SVG Strokes on Scroll + Hover Micro-Physics)
      document.querySelectorAll(".mark svg, .icon-tile svg, .why-grid svg, .bento-item svg").forEach(function (svg) {
        var shapes = svg.querySelectorAll("path, line, polyline, circle, rect");
        shapes.forEach(function (shape) {
          if (typeof shape.getTotalLength === "function") {
            try {
              var len = shape.getTotalLength();
              if (len > 0) {
                shape.style.strokeDasharray = String(len);
                shape.style.strokeDashoffset = String(len);
                gsap.to(shape, {
                  strokeDashoffset: 0,
                  duration: 1.1,
                  ease: "power2.out",
                  scrollTrigger: ScrollTrigger ? { trigger: svg, start: "top 90%", once: true } : undefined
                });
              }
            } catch (e) {}
          }
        });
      });

      // Hover Micro-Physics on Cards & Icon Tiles
      document.querySelectorAll(".icon-tile, .bento-item, .why-grid article, .stat-box").forEach(function (item) {
        var icon = item.querySelector(".mark svg, .stat-ring-svg");
        if (!icon) return;
        item.addEventListener("mouseenter", function () {
          gsap.fromTo(
            icon,
            { scale: 0.9, rotate: -6 },
            { scale: 1.12, rotate: 0, duration: 0.42, ease: "elastic.out(1.2, 0.5)" }
          );
        });
        item.addEventListener("mouseleave", function () {
          gsap.to(icon, { scale: 1, rotate: 0, duration: 0.25, ease: "power2.out" });
        });
      });
    });
  }
})();
