(function () {
  const dayLabel = document.getElementById("day-label");
  const slotsEl = document.getElementById("slots");
  const dayNote = document.getElementById("day-note");
  const prevBtn = document.getElementById("prev-day");
  const nextBtn = document.getElementById("next-day");
  const daybook = document.getElementById("times");
  const form = document.getElementById("visit-form");
  const panel = document.getElementById("request-panel");
  const pickedValue = document.getElementById("picked-value");
  const timeField = document.getElementById("time-field");
  const timeError = document.getElementById("time-error");
  const bookError = document.getElementById("book-error");
  const sendError = document.getElementById("send-error");
  const timeValue = document.getElementById("time-value");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const needInput = document.getElementById("need");
  const nameError = document.getElementById("name-error");
  const phoneError = document.getElementById("phone-error");

  const WEEKDAY = [[9, 0], [10, 0], [11, 0], [12, 0], [16, 0], [17, 0], [18, 0]];
  const SATURDAY = [[9, 0], [10, 0], [11, 0], [12, 0]];
  const HORIZON = 21;

  const today = startOfDay(new Date());
  let viewed = firstOpenOnOrAfter(today);
  let selected = null;

  prevBtn.addEventListener("click", function () {
    const previous = addDays(viewed, -1);
    if (previous < today) return;
    goTo(previous);
  });

  nextBtn.addEventListener("click", function () {
    const following = addDays(viewed, 1);
    if (dayDistance(today, following) > HORIZON) return;
    goTo(following);
  });

  form.addEventListener("submit", onSubmit);
  nameInput.addEventListener("input", function () {
    clearField(nameInput, nameError);
  });
  phoneInput.addEventListener("input", function () {
    clearField(phoneInput, phoneError);
  });

  render();

  function goTo(date) {
    viewed = date;
    selected = null;
    pickedValue.textContent = "Choose a time in the daybook.";
    pickedValue.classList.remove("is-set");
    clearTimeError();
    render();
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      daybook.classList.remove("is-turning");
      void daybook.offsetWidth;
      daybook.classList.add("is-turning");
    }
  }

  function render() {
    const slots = slotsFor(viewed);
    dayLabel.textContent = formatDay(viewed);
    prevBtn.disabled = addDays(viewed, -1) < today;
    nextBtn.disabled = dayDistance(today, addDays(viewed, 1)) > HORIZON;

    slotsEl.replaceChildren();
    if (!slots.length) {
      const morning = nextOpen(addDays(viewed, 1));
      dayNote.hidden = false;
      const closedName = formatDay(viewed).split(" ")[0];
      const nextName = morning ? formatDay(morning).split(" ")[0] : "";
      dayNote.textContent = nextName
        ? closedName + " is closed. " + nextName + " is the next open morning."
        : closedName + " is closed. There is no later time on this book.";
      return;
    }

    if (viewed.getDay() === 6) {
      dayNote.hidden = false;
      dayNote.textContent = "The afternoon is closed.";
    } else if (today.getDay() === 0 && sameDay(viewed, firstOpenOnOrAfter(today))) {
      dayNote.hidden = false;
      dayNote.textContent = "The practice is closed today.";
    } else {
      dayNote.hidden = true;
      dayNote.textContent = "";
    }

    slots.forEach(function (slot) {
      const taken = isTaken(viewed, slot[0], slot[1]);
      const key = slotKey(viewed, slot[0], slot[1]);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "slot";
      button.disabled = taken;
      button.setAttribute("aria-pressed", selected && selected.key === key ? "true" : "false");

      const time = document.createElement("span");
      time.className = "slot-time";
      time.textContent = formatClock(slot[0], slot[1]);

      const state = document.createElement("span");
      state.className = "slot-state";
      if (taken) state.textContent = "Taken";
      else if (selected && selected.key === key) state.textContent = "Chosen";
      else state.textContent = "Open";

      button.append(time, state);
      if (!taken) {
        button.addEventListener("click", function () {
          selected = {
            key: key,
            label: formatDay(viewed) + " at " + formatClock(slot[0], slot[1])
          };
          pickedValue.textContent = selected.label;
          pickedValue.classList.add("is-set");
          clearTimeError();
          render();
          const chosen = slotsEl.querySelector('[aria-pressed="true"]');
          if (chosen) chosen.focus();
        });
      }
      slotsEl.append(button);
    });
  }

  function onSubmit(event) {
    event.preventDefault();
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const digits = phone.replace(/\D/g, "");
    let firstFocus = null;

    if (!selected) {
      showTimeError("Choose a time in the daybook.");
      firstFocus = slotsEl.querySelector(".slot:not(:disabled)") || nextBtn;
    } else {
      clearTimeError();
    }

    if (!name) {
      showError(nameInput, nameError, "Enter your name.");
      if (!firstFocus) firstFocus = nameInput;
    } else {
      clearField(nameInput, nameError);
    }

    if (digits.length < 8) {
      showError(phoneInput, phoneError, "Enter a phone number we can call.");
      if (!firstFocus) firstFocus = phoneInput;
    } else {
      clearField(phoneInput, phoneError);
    }

    if (firstFocus) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const target = firstFocus === nameInput || firstFocus === phoneInput ? firstFocus : daybook;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      firstFocus.focus();
      return;
    }

    const need = needInput.value.trim();
    const result = document.createElement("div");
    result.className = "result";
    result.setAttribute("role", "status");

    const heading = document.createElement("h2");
    heading.id = "request-heading";
    heading.tabIndex = -1;
    heading.textContent = "Visit requested";

    const copy = document.createElement("p");
    copy.textContent = "We call you the same day to confirm this time. If we cannot reach you, the time goes back on the book.";

    const list = document.createElement("dl");
    list.className = "fact-list";
    list.append(record("Name", name));
    list.append(record("Phone", phone));
    list.append(record("Time", selected.label));
    if (need) list.append(record("What you need", need));

    result.append(heading, copy, list);
    panel.replaceChildren(result);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    result.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    heading.focus();
  }

  function record(term, value) {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = term;
    dd.textContent = value;
    row.append(dt, dd);
    return row;
  }

  function showTimeError(message) {
    timeField.classList.add("is-invalid");
    timeError.hidden = false;
    timeError.textContent = message;
    bookError.hidden = false;
    bookError.textContent = message;
  }

  function clearTimeError() {
    timeField.classList.remove("is-invalid");
    timeError.hidden = true;
    timeError.textContent = "";
    bookError.hidden = true;
    bookError.textContent = "";
  }

  function showError(field, error, message) {
    field.classList.add("is-invalid");
    if (field === nameInput || field === phoneInput) {
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", error.id);
    }
    error.hidden = false;
    error.textContent = message;
  }

  function clearField(field, error) {
    field.classList.remove("is-invalid");
    if (field === nameInput || field === phoneInput) {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    }
    error.hidden = true;
    error.textContent = "";
  }

  function slotsFor(date) {
    const day = date.getDay();
    if (day === 0) return [];
    if (day === 6) return SATURDAY;
    return WEEKDAY;
  }

  function isTaken(date, hour) {
    if (date.getDay() === 6) return hour === 10;
    return hour === 9 || hour === 12;
  }

  function firstOpenOnOrAfter(date) {
    return nextOpen(startOfDay(date));
  }

  function nextOpen(date) {
    let cursor = startOfDay(date);
    for (let i = 0; i <= HORIZON + 1; i += 1) {
      if (slotsFor(cursor).length) return cursor;
      cursor = addDays(cursor, 1);
    }
    return null;
  }

  function startOfDay(date) {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  function addDays(date, count) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + count);
    return startOfDay(copy);
  }

  function sameDay(a, b) {
    return a && b && a.getTime() === b.getTime();
  }

  function dayDistance(from, to) {
    const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((end - start) / 86400000);
  }

  function slotKey(date, hour, minute) {
    return [date.getFullYear(), date.getMonth(), date.getDate(), hour, minute].join("-");
  }

  function formatDay(date) {
    const weekday = date.toLocaleDateString("en-GB", { weekday: "long" });
    const month = date.toLocaleDateString("en-GB", { month: "long" });
    return weekday + " " + date.getDate() + " " + month;
  }

  function formatClock(hour, minute) {
    const suffix = hour >= 12 ? "pm" : "am";
    const hr = hour % 12 || 12;
    const min = String(minute).padStart(2, "0");
    return hr + ":" + min + " " + suffix;
  }
})();
