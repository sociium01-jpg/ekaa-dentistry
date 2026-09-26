(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

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
      ? "Open now, until 8:00 pm."
      : hour < 10
        ? "Closed now. Opens at 10:00 am."
        : today === 3
          ? "Closed now. Thursday is by appointment only."
          : "Closed now. Opens tomorrow at 10:00 am.";

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
      if (!detail) return;
      if (info.open) {
        detail.textContent = info.name + ", 10:00 am – 08:00 pm";
      } else {
        detail.innerHTML = info.name + ' is by appointment only. <a href="book.html">Book a visit</a>';
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

  var siteNav = document.querySelector(".nav");
  if (siteNav) {
    var file = location.pathname.split("/").pop() || "index.html";
    var services = siteNav.querySelectorAll(".drop")[0].querySelectorAll("a");
    var more = siteNav.querySelectorAll(".drop")[1].querySelectorAll("a");
    var serviceHrefs = Array.prototype.map.call(services, function (link) { return link.getAttribute("href"); });
    var moreHrefs = Array.prototype.map.call(more, function (link) { return link.getAttribute("href"); });
    var menuHrefs = ["about.html", "blogs.html"].concat(moreHrefs);

    function icon(path) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="' + path + '" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    }

    var bar = document.createElement("nav");
    bar.className = "app-bar";
    bar.setAttribute("aria-label", "Menu");
    bar.innerHTML =
      '<a class="app-tab" href="index.html">' + icon("M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z") + "<span>Home</span></a>" +
      '<button class="app-tab" type="button" data-sheet="services" aria-expanded="false">' + icon("M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z") + "<span>Services</span></button>" +
      '<a class="app-book" href="book.html" aria-label="Book Your Appointment Now!">Book</a>' +
      '<a class="app-tab" href="contact.html">' + icon("M6 4h3l2 4-2 1a12 12 0 0 0 6 6l1-2 4 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-2z") + "<span>Contact</span></a>" +
      '<button class="app-tab" type="button" data-sheet="menu" aria-expanded="false">' + icon("M4 7h16M4 12h16M4 17h16") + "<span>Menu</span></button>";

    var sheet = document.createElement("div");
    sheet.className = "app-sheet";
    sheet.hidden = true;
    sheet.innerHTML = '<div class="app-sheet-card" role="dialog" aria-modal="true"><h2></h2><div class="app-links"></div></div>';
    document.body.appendChild(sheet);
    document.body.appendChild(bar);

    function mark(selector, hrefs) {
      var el = bar.querySelector(selector);
      if (hrefs.indexOf(file) !== -1) {
        if (el.tagName === "BUTTON") el.classList.add("is-on");
        else el.setAttribute("aria-current", "page");
      }
    }
    mark('a[href="index.html"]', ["index.html", ""]);
    mark('a[href="contact.html"]', ["contact.html"]);
    mark('a[href="book.html"]', ["book.html"]);
    mark('[data-sheet="services"]', serviceHrefs);
    mark('[data-sheet="menu"]', menuHrefs);

    var title = sheet.querySelector("h2");
    var links = sheet.querySelector(".app-links");
    var openName = "";

    function fill(name, anchors) {
      title.textContent = name;
      links.innerHTML = "";
      anchors.forEach(function (anchor) {
        var link = document.createElement("a");
        link.href = anchor.getAttribute("href");
        link.textContent = anchor.textContent.trim();
        if (link.getAttribute("href") === file) link.setAttribute("aria-current", "page");
        links.appendChild(link);
      });
    }

    function closeSheet() {
      sheet.hidden = true;
      openName = "";
      bar.querySelectorAll("[data-sheet]").forEach(function (button) {
        button.setAttribute("aria-expanded", "false");
      });
    }

    bar.querySelectorAll("[data-sheet]").forEach(function (button) {
      button.addEventListener("click", function () {
        var name = button.getAttribute("data-sheet");
        if (openName === name) {
          closeSheet();
          return;
        }
        if (name === "services") fill("Services", services);
        else {
          var menuLinks = [
            siteNav.querySelector('a[href="about.html"]'),
            siteNav.querySelector('a[href="blogs.html"]')
          ].concat(Array.prototype.slice.call(more));
          fill("Menu", menuLinks);
        }
        openName = name;
        sheet.hidden = false;
        bar.querySelectorAll("[data-sheet]").forEach(function (item) {
          item.setAttribute("aria-expanded", item === button ? "true" : "false");
        });
      });
    });

    sheet.addEventListener("click", function (event) {
      if (event.target === sheet) closeSheet();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeSheet();
    });
  }

  document.querySelectorAll(".drop > button").forEach(function (button) {
    button.addEventListener("click", function () {
      var drop = button.parentElement;
      var open = drop.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.querySelectorAll("#visit-form, #quick-book").forEach(function (form) {
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

      if (!name.value.trim()) {
        name.setAttribute("aria-invalid", "true");
        ok = false;
      }
      if (!phone.value.trim() || !/^[0-9+\s()-]{8,}$/.test(phone.value.trim())) {
        phone.setAttribute("aria-invalid", "true");
        ok = false;
      }
      if (date && date.required && !date.value) {
        date.setAttribute("aria-invalid", "true");
        ok = false;
      }
      if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        email.setAttribute("aria-invalid", "true");
        ok = false;
      }
      if (!ok) {
        error.hidden = false;
        error.textContent = date && date.required
          ? "Add your name, a date, and a phone number we can reach."
          : "Add your name and a phone number we can reach. Check the email if you included one.";
        return;
      }
      error.hidden = true;

      var lines = [
        "Book Your Dental Appointment",
        "Name of the Patient: " + name.value.trim(),
        "Phone no for future Correspondence: " + phone.value.trim(),
        "Date of Booking needed: " + (date && date.value ? date.value : "-")
      ];
      if (email) lines.push("Email: " + (email.value.trim() || "-"));
      if (time) lines.push("Time: " + (time.value || "-"));
      if (need) lines.push("Dental complaint currently facing: " + (need.value.trim() || "-"));

      var success = form.id === "quick-book"
        ? form.parentElement.querySelector(".book-done")
        : document.getElementById("form-success");
      var link = success.querySelector("a");
      link.href = "https://wa.me/919030121100?text=" + encodeURIComponent(lines.join("\n"));
      if (form.id === "visit-form" && form.previousElementSibling) {
        form.previousElementSibling.hidden = true;
      }
      form.hidden = true;
      success.hidden = false;
    });
  });
})();
