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

  if (!document.querySelector(".hero-home")) {
    var file = location.pathname.split("/").pop() || "index.html";

    function svg(body) {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
    }

    var glyphs = {
      clipboard: svg('<rect x="6" y="3.5" width="12" height="17" rx="2"/><path d="M9 3.5h6V6H9zM9 11h6M9 15h4"/>'),
      tooth: svg('<path d="M12 3.5c2.2 0 3.4 2 3.6 4.2.3 2.2.6 3.8.2 5.6-.5 1.8-1.3 2.4-1.6 3.6-.3 1-1 2.1-2.2 1.5-1 .4-1.5-.7-1.7-1.6-.3-1-.7-1.8-1.3-3.2-.7-1.6-.3-4 .2-5.8C10 5.4 10.6 3.5 12 3.5z"/>'),
      implant: svg('<path d="M12 3v3M9.5 6h5L13.5 9h-3L9.5 6zM11 9v9M9 18h6"/>'),
      wave: svg('<path d="M4 13c2.2-4 3.8-4 6 0s3.8 4 6 0 3.8-4 4 0M7 18h10"/>'),
      spark: svg('<path d="M12 3.5l1.1 3.6 3.7.6-3.7.7L12 12l-1.1-3.6-3.7-.7 3.7-.6L12 3.5z"/>'),
      arch: svg('<path d="M5 15c2.2-5.5 11.8-5.5 14 0"/><circle cx="8" cy="13.2" r="1"/><circle cx="12" cy="11.6" r="1"/><circle cx="16" cy="13.2" r="1"/>'),
      child: svg('<circle cx="12" cy="8" r="2.6"/><path d="M6.5 19c1-2.8 2.8-4.2 5.5-4.2s4.5 1.4 5.5 4.2"/>'),
      crown: svg('<path d="M4 17l2.2-8 3.3 3.6L12 5l2.5 7.6L17.8 9 20 17H4z"/>'),
      shield: svg('<path d="M12 3.5 5 6.5v5.2c0 4.2 2.8 7.2 7 8.8 4.2-1.6 7-4.6 7-8.8V6.5L12 3.5z"/>'),
      pin: svg('<path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"/><circle cx="12" cy="11" r="1.6"/>'),
      card: svg('<rect x="3.5" y="6" width="17" height="12" rx="2"/><path d="M3.5 10h17"/>'),
      people: svg('<circle cx="9" cy="9" r="2.2"/><circle cx="16" cy="10" r="1.8"/><path d="M4.5 18c.7-2.3 2.1-3.4 4.5-3.4s3.6 1.1 4.3 3.4M14 14.8c1.6 0 2.8.8 3.5 2.4"/>'),
      globe: svg('<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.2 2.4 2.2 13.6 0 16M12 4c-2.2 2.4-2.2 13.6 0 16"/>'),
      chat: svg('<path d="M6 16.5 4 19V7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v7A1.5 1.5 0 0 1 18.5 16H8z"/>'),
      clock: svg('<circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 1.5"/>'),
      note: svg('<path d="M7 4h8l4 4v12H7z"/><path d="M15 4v4h4M9 13h6M9 17h4"/>')
    };

    var services = [
      ["general-checkup.html", "General Checkup", "clipboard"],
      ["root-canal-treatment.html", "Root Canal Treatment", "tooth"],
      ["dental-implant-dentistry.html", "Dental Implant Dentistry", "implant"],
      ["periodonticgumdentistry.html", "Periodontic(Gum)Dentistry", "wave"],
      ["cosmetic-dentistry.html", "Cosmetic Dentistry", "spark"],
      ["orthodontics.html", "Orthodontics", "arch"],
      ["pediatric-dentistry.html", "Pediatric Dentistry", "child"],
      ["dental-crowns-and-bridges.html", "Dental Crowns and Bridges", "crown"],
      ["oral-maxillofacial.html", "Oral Maxillofacial", "shield"]
    ];

    if (!document.querySelector(".icon-grid")) {
      var rail = document.createElement("div");
      rail.className = "wrap page-rail";
      var grid = document.createElement("div");
      grid.className = "icon-grid";
      services.forEach(function (item) {
        var link = document.createElement("a");
        link.className = "icon-tile";
        link.href = item[0];
        if (item[0] === file) link.setAttribute("aria-current", "page");
        link.innerHTML = '<span class="mark">' + glyphs[item[2]] + "</span>" + item[1];
        grid.appendChild(link);
      });
      rail.appendChild(grid);
      var hero = document.querySelector(".hero");
      if (hero) hero.after(rail);
    }

    document.querySelectorAll(".blog-list a").forEach(function (link) {
      var mark = document.createElement("span");
      mark.className = "mark";
      mark.innerHTML = glyphs.note;
      link.prepend(mark);
    });

    document.querySelectorAll(".band .card > h2").forEach(function (heading, index) {
      var mark = document.createElement("span");
      mark.className = "mark";
      mark.innerHTML = index === 0 ? glyphs.pin : glyphs.clock;
      heading.prepend(mark);
    });

    var prose = document.querySelector("#content-body, article.card.prose");
    if (prose) {
      var kids = Array.prototype.filter.call(prose.children, function () { return true; });
      var intro = [];
      var sections = [];
      var current = null;
      var cta = null;
      var kicker = prose.querySelector(".kicker");

      function junk(text) {
        return /Best Dental Clinic in Kondapur|Powered by|This content is reviewed|reCAPTCHA|Appointments: Call or book|Specialist Consultations Available|Get directions/.test(text)
          || /^(Name|Phone|Email\*|Submit)$/.test(text);
      }

      function question(text) {
        return /^(Q\d+\.\s*)?(How|What|Why|When|Where|Are|Does|Do|Can|Is|Will)\b/.test(text) && text.indexOf("?") !== -1;
      }

      kids.forEach(function (node) {
        if (node.matches(".kicker")) return;
        if (node.matches("p") && node.querySelector(".btn")) {
          cta = node;
          return;
        }
        var text = node.textContent.trim();
        if (!text || junk(text)) return;
        if (node.matches("h3")) {
          current = { title: text, nodes: [] };
          sections.push(current);
          return;
        }
        if (!current) intro.push(node);
        else current.nodes.push(node);
      });

      var board = document.createElement("div");
      board.className = "fact-grid";
      var count = 0;
      var cycle = ["spark", "shield", "people", "clipboard", "chat", "pin"];

      function pick(title, index) {
        var t = title.toLowerCase();
        if (/check|clean|exam|diagnos|x-ray|monitor/.test(t)) return "clipboard";
        if (/implant|bone|graft/.test(t)) return "implant";
        if (/gum|perio|bleed/.test(t)) return "wave";
        if (/cosmetic|smile|whiten|aesthetic/.test(t)) return "spark";
        if (/ortho|brace|align|bite|invisalign/.test(t)) return "arch";
        if (/child|pediatric|school|kid/.test(t)) return "child";
        if (/crown|bridge/.test(t)) return "crown";
        if (/surg|maxillo|wisdom|oral/.test(t)) return "shield";
        if (/hour|time|book|appoint/.test(t)) return "clock";
        if (/visit|location|address|where/.test(t)) return "pin";
        if (/emi|insur|cost|afford|price|payment/.test(t)) return "card";
        if (/community|outreach|camp|pro bono|partner/.test(t)) return "people";
        if (/international|travel|tourism|world|business/.test(t)) return "globe";
        if (/\?|faq|question/.test(t)) return "chat";
        if (/safe|hygiene|steril|standard/.test(t)) return "shield";
        return cycle[index % cycle.length];
      }

      function sentence(text) {
        text = text.replace(/\s+/g, " ").trim();
        var parts = text.split(". ");
        var line = "";
        for (var i = 0; i < parts.length; i++) {
          line += (line ? ". " : "") + parts[i];
          if (/Dr|Mr|Ms|St$/.test(parts[i].slice(-3))) continue;
          if (line.length > 40) break;
        }
        if (line.length < text.length && line.slice(-1) !== ".") line += ".";
        if (line.length > 150) line = line.slice(0, 147) + "…";
        return line;
      }

      function shortTitle(title) {
        var cut = title.split("|")[0].replace(/^Q\d+\.\s*/, "").trim();
        if (cut.length > 68) cut = cut.slice(0, 65) + "…";
        return cut;
      }

      function brief(nodes) {
        var kept = [];
        var used = false;
        nodes.forEach(function (node) {
          if (used && node.tagName !== "UL" && node.tagName !== "OL") return;
          if (node.tagName === "UL" || node.tagName === "OL") {
            var list = document.createElement("ul");
            var items = node.querySelectorAll("li");
            for (var i = 0; i < Math.min(items.length, 3); i++) list.appendChild(items[i]);
            if (list.children.length) kept.push(list);
            return;
          }
          if (!used) {
            var p = document.createElement("p");
            p.textContent = sentence(node.textContent);
            kept.push(p);
            used = true;
          }
        });
        return kept;
      }

      function setOpen(fact, on) {
        fact.classList.toggle("is-open", on);
        fact.querySelector("button").setAttribute("aria-expanded", on ? "true" : "false");
      }

      function addFact(title, nodes, isQuestion) {
        var bits = brief(nodes);
        if (!title || !bits.length) return;
        var fact = document.createElement("article");
        fact.className = "fact";
        if (isQuestion) fact.setAttribute("data-kind", "question");
        fact.style.animationDelay = Math.min(count, 12) * 0.05 + "s";
        var button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-expanded", "false");
        button.innerHTML = '<span class="mark">' + glyphs[pick(title, count)] + "</span><strong></strong>";
        button.querySelector("strong").textContent = shortTitle(title);
        var body = document.createElement("div");
        body.className = "fact-body";
        var inner = document.createElement("div");
        inner.className = "fact-inner";
        bits.forEach(function (node) { inner.appendChild(node); });
        body.appendChild(inner);
        button.addEventListener("click", function () {
          var on = !fact.classList.contains("is-open");
          var group = fact.parentElement;
          group.querySelectorAll(".fact.is-open").forEach(function (other) {
            if (other !== fact) setOpen(other, false);
          });
          setOpen(fact, on);
        });
        fact.appendChild(button);
        fact.appendChild(body);
        board.appendChild(fact);
        count += 1;
      }

      function take(title, nodes) {
        var bucket = [];
        var used = false;
        nodes.forEach(function (node) {
          var text = node.textContent.trim();
          if (node.tagName === "P" && question(text)) {
            if (bucket.length) {
              addFact(title, bucket);
              used = true;
              bucket = [];
            }
            var at = text.indexOf("?");
            var q = text.slice(0, at + 1).replace(/^Q\d+\.\s*/, "");
            var rest = text.slice(at + 1).trim();
            if (!rest) {
              bucket.push(node);
              return;
            }
            var answer = document.createElement("p");
            answer.textContent = rest;
            addFact(q, [answer], true);
            used = true;
          } else bucket.push(node);
        });
        if (!bucket.length) return;
        if (!used) addFact(title, bucket);
        else {
          var last = board.lastElementChild && board.lastElementChild.querySelector(".fact-inner");
          if (last) bucket.forEach(function (node) { last.appendChild(node); });
          else addFact(title, bucket);
        }
      }

      if (intro.length) take(kicker ? kicker.textContent.trim() : "Overview", intro);
      sections.forEach(function (section) { take(section.title, section.nodes); });
      if (board.children.length) {
        var facts = Array.prototype.slice.call(board.children);
        var questions = facts.filter(function (fact) {
          return fact.getAttribute("data-kind") === "question";
        });
        var topics = facts.filter(function (fact) { return questions.indexOf(fact) === -1; });
        var placed = board;
        if (questions.length && topics.length) {
          var sectionsWrap = document.createElement("div");
          sectionsWrap.className = "page-sections";
          [["Highlights", topics], ["Questions", questions]].forEach(function (pair) {
            var block = document.createElement("section");
            block.className = "page-section";
            var heading = document.createElement("h2");
            heading.textContent = pair[0];
            var grid = document.createElement("div");
            grid.className = "fact-grid";
            pair[1].forEach(function (fact) { grid.appendChild(fact); });
            block.appendChild(heading);
            block.appendChild(grid);
            sectionsWrap.appendChild(block);
          });
          placed = sectionsWrap;
        }
        prose.replaceWith(placed);
        if (cta) placed.appendChild(cta);
      }
    }
  }
})();
