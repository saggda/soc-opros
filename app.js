const LINKS = {
  tbank: "https://tbank.ru/baf/8GAuHg2xcJq",
  alfa: "https://alfa.me/biU712",
};

const SITE_URL = "https://saggda.github.io/soc-opros/";
const OK_SHARE_TEXT = "Пройдите короткий соцопрос — узнайте, какие возможности вам могут быть доступны";

const REGIONS = [
  "Алтайский край",
  "Амурская область",
  "Архангельская область",
  "Астраханская область",
  "Белгородская область",
  "Брянская область",
  "Владимирская область",
  "Волгоградская область",
  "Вологодская область",
  "Воронежская область",
  "Ивановская область",
  "Иркутская область",
  "Кабардино-Балкарская Республика",
  "Калининградская область",
  "Калужская область",
  "Камчатский край",
  "Карачаево-Черкесская Республика",
  "Кемеровская область",
  "Кировская область",
  "Костромская область",
  "Краснодарский край",
  "Красноярский край",
  "Курганская область",
  "Курская область",
  "Ленинградская область",
  "Липецкая область",
  "Магаданская область",
  "Москва",
  "Московская область",
  "Мурманская область",
  "Ненецкий автономный округ",
  "Нижегородская область",
  "Новгородская область",
  "Новосибирская область",
  "Омская область",
  "Оренбургская область",
  "Орловская область",
  "Пензенская область",
  "Пермский край",
  "Приморский край",
  "Псковская область",
  "Республика Адыгея",
  "Республика Алтай",
  "Республика Башкортостан",
  "Республика Бурятия",
  "Республика Дагестан",
  "Республика Ингушетия",
  "Республика Калмыкия",
  "Республика Карелия",
  "Республика Коми",
  "Республика Крым",
  "Республика Марий Эл",
  "Республика Мордовия",
  "Республика Саха (Якутия)",
  "Республика Северная Осетия — Алания",
  "Республика Татарстан",
  "Республика Тыва",
  "Республика Хакасия",
  "Ростовская область",
  "Рязанская область",
  "Самарская область",
  "Санкт-Петербург",
  "Саратовская область",
  "Сахалинская область",
  "Свердловская область",
  "Севастополь",
  "Смоленская область",
  "Ставропольский край",
  "Тамбовская область",
  "Тверская область",
  "Томская область",
  "Тульская область",
  "Тюменская область",
  "Удмуртская Республика",
  "Ульяновск",
  "Ульяновская область",
  "Хабаровский край",
  "Ханты-Мансийский автономный округ — Югра",
  "Челябинская область",
  "Чеченская Республика",
  "Чувашская Республика",
  "Чукотский автономный округ",
  "Ямало-Ненецкий автономный округ",
  "Ярославская область",
  "Другой регион",
];

const BANKS = [
  { id: "tbank", label: "Т-Банк" },
  { id: "alfa", label: "Альфа-Банк" },
  { id: "sber", label: "Сбер" },
  { id: "vtb", label: "ВТБ" },
  { id: "pochta", label: "Почта Банк" },
  { id: "other", label: "Другой банк" },
  { id: "none", label: "Нигде нет" },
];

const INTERESTS = [
  { id: "utilities", label: "Коммуналка без переплат" },
  { id: "free_service", label: "Бесплатное обслуживание" },
  { id: "pharmacy", label: "Выгода в аптеках" },
  { id: "groceries", label: "Выгода в магазинах" },
  { id: "savings", label: "Накопления под процент" },
];

const STEPS = [
  {
    id: "age",
    title: "Сколько вам полных лет?",
    hint: "Выберите один вариант",
    type: "single",
    options: [
      { value: "under55", label: "До 55" },
      { value: "55-70", label: "55–70" },
      { value: "70plus", label: "70 и старше" },
    ],
  },
  {
    id: "region",
    title: "В каком регионе вы живёте?",
    hint: "Введите название или прокрутите список",
    type: "region",
  },
  {
    id: "banks",
    title: "Где у вас уже есть оформление?",
    hint: "Можно выбрать несколько",
    type: "multi",
    options: BANKS,
  },
  {
    id: "interests",
    title: "Что для вас важно?",
    hint: "Отметьте один или несколько пунктов",
    type: "interests",
    options: INTERESTS,
  },
];

const state = {
  step: 0,
  answers: {
    age: null,
    region: null,
    banks: [],
    interests: [],
  },
};

const screens = {
  landing: document.getElementById("screen-landing"),
  quiz: document.getElementById("screen-quiz"),
  results: document.getElementById("screen-results"),
};

const quizBody = document.getElementById("quiz-body");
const progressCurrent = document.getElementById("progress-current");
const progressTotal = document.getElementById("progress-total");
const progressPct = document.getElementById("progress-pct");
const progressFill = document.getElementById("progress-fill");
const progressBar = document.getElementById("progress-bar");
const resultsTitle = document.getElementById("results-title");
const resultsSubtitle = document.getElementById("results-subtitle");
const resultsCards = document.getElementById("results-cards");
const okShareBtn = document.getElementById("ok-share-btn");

progressTotal.textContent = String(STEPS.length);

function track(event) {
  if (typeof window.ym === "function") {
    window.ym(window.METRIKA_ID, "reachGoal", event);
  }
  if (window.location.search.includes("debug=1")) {
    console.log("[track]", event);
  }
}

function showScreen(name) {
  Object.values(screens).forEach((el) => el.classList.remove("screen--active"));
  screens[name].classList.add("screen--active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetQuiz() {
  state.step = 0;
  state.answers = {
    age: null,
    region: null,
    banks: [],
    interests: [],
  };
}

function updateProgress() {
  const current = state.step + 1;
  const pct = Math.round((current / STEPS.length) * 100);
  progressCurrent.textContent = String(current);
  progressPct.textContent = `${pct}%`;
  progressFill.style.width = `${pct}%`;
  progressBar.setAttribute("aria-valuenow", String(pct));
}

function canProceed(step) {
  const id = step.id;
  const answers = state.answers;

  if (id === "age") return Boolean(answers.age);
  if (id === "region") return Boolean(answers.region);
  if (id === "banks") return answers.banks.length > 0;
  if (id === "interests") return answers.interests.length > 0;
  return false;
}

function renderQuestion() {
  const step = STEPS[state.step];
  updateProgress();

  let body = `
    <div class="question">
      <h2 class="question__title">${step.title}</h2>
      <p class="question__hint">${step.hint}</p>
  `;

  if (step.type === "single") {
    body += `<div class="options">${step.options
      .map(
        (opt) => `
        <button
          type="button"
          class="option-btn ${state.answers[step.id] === opt.value ? "option-btn--selected" : ""}"
          data-action="pick-single"
          data-step="${step.id}"
          data-value="${opt.value}"
        >${opt.label}</button>
      `
      )
      .join("")}</div>`;
  }

  if (step.type === "multi") {
    body += `<div class="options">${step.options
      .map((opt) => {
        const selected = state.answers.banks.includes(opt.id);
        return `
          <button
            type="button"
            class="option-btn option-btn--multi ${selected ? "option-btn--selected" : ""}"
            data-action="pick-bank"
            data-value="${opt.id}"
          >${opt.label}</button>
        `;
      })
      .join("")}</div>`;
  }

  if (step.type === "region") {
    body += `
      <input
        class="region-search"
        type="search"
        placeholder="Начните вводить регион..."
        value="${state.answers.region || ""}"
        id="region-search"
        autocomplete="off"
      />
      <div class="region-list" id="region-list"></div>
    `;
  }

  if (step.type === "interests") {
    const allSelected = INTERESTS.every((item) => state.answers.interests.includes(item.id));
    body += `
      <button
        type="button"
        class="option-btn ${allSelected ? "option-btn--selected" : ""}"
        data-action="pick-all-interests"
        style="margin-bottom: 12px;"
      >Всё перечисленное</button>
      <div class="options">${step.options
        .map((item) => {
          const selected = state.answers.interests.includes(item.id);
          return `
            <button
              type="button"
              class="option-btn option-btn--multi ${selected ? "option-btn--selected" : ""}"
              data-action="pick-interest"
              data-value="${item.id}"
            >${item.label}</button>
          `;
        })
        .join("")}</div>
    `;
  }

  const isLast = state.step === STEPS.length - 1;
  body += `
    <div class="quiz__footer">
      <button
        class="btn btn--primary btn--lg"
        type="button"
        data-action="next"
        ${canProceed(step) ? "" : "disabled style='opacity:0.45;pointer-events:none'"}
      >
        ${isLast ? "Узнать результат" : "Далее"}
      </button>
    </div>
  </div>`;

  quizBody.innerHTML = body;

  if (step.type === "region") {
    const search = document.getElementById("region-search");
    const list = document.getElementById("region-list");
    const renderRegions = (query = "") => {
      const q = query.trim().toLowerCase();
      const filtered = REGIONS.filter((r) => r.toLowerCase().includes(q)).slice(0, 80);
      list.innerHTML = filtered
        .map(
          (region) => `
          <button
            type="button"
            class="region-item ${state.answers.region === region ? "region-item--selected" : ""}"
            data-action="pick-region"
            data-value="${region}"
          >${region}</button>
        `
        )
        .join("");
    };
    renderRegions(search.value);
    search.addEventListener("input", (e) => renderRegions(e.target.value));
    search.focus();
  }
}

function nextStep() {
  const step = STEPS[state.step];
  if (!canProceed(step)) return;

  track(`quiz_step_${state.step + 1}_done`);

  if (state.step < STEPS.length - 1) {
    state.step += 1;
    renderQuestion();
    return;
  }

  track("quiz_complete");
  renderResults();
  showScreen("results");
}

function prevStep() {
  if (state.step > 0) {
    state.step -= 1;
    renderQuestion();
    return;
  }
  showScreen("landing");
}

function hasBank(id) {
  const banks = state.answers.banks;
  if (banks.includes("none")) return false;
  return banks.includes(id);
}

const INTEREST_LINES = {
  utilities: "Оплата коммуналки без лишних переплат",
  free_service: "Бесплатное обслуживание при регулярных начислениях",
  pharmacy: "Возврат за покупки в аптеках",
  groceries: "Возврат за покупки в магазинах",
  savings: "Накопления под повышенный процент",
};

function buildPersonalLines() {
  const lines = [];
  const { interests, age } = state.answers;

  interests.forEach((id) => {
    if (INTEREST_LINES[id]) lines.push(INTEREST_LINES[id]);
  });

  if (age === "55-70" || age === "70plus") {
    lines.push("Удобно для регулярных социальных начислений");
  }

  return [...new Set(lines)];
}

function renderOfferCard({ variant, badge, title, items, link, linkLabel, offerId }) {
  return `
    <article class="offer-card offer-card--${variant}">
      <div class="offer-card__header">
        <h3 class="offer-card__name">${title}</h3>
        <span class="offer-card__badge">${badge}</span>
      </div>
      <ul class="offer-card__list">
        ${items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <a
        class="btn ${variant === "primary" ? "btn--primary" : "btn--secondary"} btn--lg"
        href="${link}"
        target="_blank"
        rel="noopener noreferrer"
        data-action="offer-click"
        data-offer="${offerId}"
      >${linkLabel}</a>
    </article>
  `;
}

function renderResults() {
  const showTbank = !hasBank("tbank");
  const showAlfa = !hasBank("alfa");
  const personal = buildPersonalLines();

  if (!showTbank && !showAlfa) {
    resultsTitle.textContent = "Похоже, основные варианты у вас уже есть";
    resultsSubtitle.textContent =
      "Вы отметили, что оформление уже есть в обоих банках. Можете пройти опрос заново или поделиться ссылкой с близкими.";
    resultsCards.innerHTML = `
      <div class="card empty-state">
        <div class="empty-state__icon" aria-hidden="true">✓</div>
        <h3 class="empty-state__title">Проверка завершена</h3>
        <p class="empty-state__text">Если хотите уточнить условия — загляните в приложение вашего банка или пройдите опрос ещё раз.</p>
      </div>
    `;
    track("result_both_have");
    return;
  }

  resultsTitle.textContent = "По вашим ответам вам может подойти";
  resultsSubtitle.textContent =
    "Ниже — варианты с доставкой на дом. Нажмите кнопку — откроется официальный сайт, где вы заполните заявку сами.";

  const cards = [];

  if (showTbank) {
    const tbankItems = [
      "Оформление с доставкой на дом",
      "Оплата коммуналки без переплат",
      "Бесплатное обслуживание при регулярных начислениях",
      "Возврат за покупки в аптеках и магазинах",
      "Накопления под повышенный процент",
      "Приветственный бонус после активации",
      ...personal.slice(0, 2),
    ];

    cards.push(
      renderOfferCard({
        variant: "primary",
        badge: "Рекомендуем",
        title: "Оформление с доставкой — вариант 1",
        items: [...new Set(tbankItems)],
        link: LINKS.tbank,
        linkLabel: "Перейти к оформлению",
        offerId: "tbank",
      })
    );
  }

  if (showAlfa) {
    const alfaItems = [
      "Оформление с доставкой на дом",
      "Суперкешбэк на покупки",
      "Выбор категорий каждый месяц",
      "Приветственный бонус после первой покупки",
      ...personal.slice(0, 2),
    ];

    cards.push(
      renderOfferCard({
        variant: "secondary",
        badge: showTbank ? "Также доступно" : "Рекомендуем",
        title: "Оформление с доставкой — вариант 2",
        items: [...new Set(alfaItems)],
        link: LINKS.alfa,
        linkLabel: "Перейти к оформлению",
        offerId: "alfa",
      })
    );
  }

  resultsCards.innerHTML = cards.join("");
  track(showTbank && showAlfa ? "result_both_offers" : showTbank ? "result_tbank_only" : "result_alfa_only");
}

function shareToOk() {
  const url = encodeURIComponent(SITE_URL);
  const title = encodeURIComponent(OK_SHARE_TEXT);
  const shareUrl = `https://connect.ok.ru/offer?url=${url}&title=${title}`;
  track("ok_share_click");
  window.open(shareUrl, "_blank", "noopener,noreferrer,width=620,height=480");
}

function startQuiz() {
  resetQuiz();
  track("quiz_start");
  renderQuestion();
  showScreen("quiz");
}

document.addEventListener("click", (e) => {
  const target = e.target.closest("[data-action]");
  if (!target) return;

  const action = target.dataset.action;

  if (action === "home") {
    e.preventDefault();
    showScreen("landing");
    return;
  }

  if (action === "start-quiz") {
    startQuiz();
    return;
  }

  if (action === "restart") {
    track("quiz_restart");
    startQuiz();
    return;
  }

  if (action === "back") {
    prevStep();
    return;
  }

  if (action === "next") {
    nextStep();
    return;
  }

  if (action === "pick-single") {
    state.answers[target.dataset.step] = target.dataset.value;
    if (STEPS[state.step].id === target.dataset.step) {
      setTimeout(() => nextStep(), 240);
    }
    return;
  }

  if (action === "pick-bank") {
    const value = target.dataset.value;
    let banks = [...state.answers.banks];

    if (value === "none") {
      banks = ["none"];
    } else {
      banks = banks.filter((b) => b !== "none");
      if (banks.includes(value)) {
        banks = banks.filter((b) => b !== value);
      } else {
        banks.push(value);
      }
    }

    state.answers.banks = banks;
    renderQuestion();
    return;
  }

  if (action === "pick-interest") {
    const value = target.dataset.value;
    const list = [...state.answers.interests];
    if (list.includes(value)) {
      state.answers.interests = list.filter((id) => id !== value);
    } else {
      state.answers.interests = [...list, value];
    }
    renderQuestion();
    return;
  }

  if (action === "pick-all-interests") {
    state.answers.interests = INTERESTS.map((item) => item.id);
    renderQuestion();
    return;
  }

  if (action === "pick-region") {
    state.answers.region = target.dataset.value;
    setTimeout(() => nextStep(), 280);
    return;
  }

  if (action === "offer-click") {
    track(`click_${target.dataset.offer}`);
  }
});

okShareBtn.addEventListener("click", shareToOk);

// Yandex Metrika: set real counter ID to enable (e.g. 12345678)
window.METRIKA_ID = 0;
(function (m, e, t, r, i, k, a) {
  if (!window.METRIKA_ID) return;
  m[i] =
    m[i] ||
    function () {
      (m[i].a = m[i].a || []).push(arguments);
    };
  m[i].l = 1 * new Date();
  for (var j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j].src === r) return;
  }
  k = e.createElement(t);
  a = e.getElementsByTagName(t)[0];
  k.async = 1;
  k.src = r;
  a.parentNode.insertBefore(k, a);
})(window, document, "script", `https://mc.yandex.ru/metrika/tag.js?id=${window.METRIKA_ID}`, "ym");

if (window.METRIKA_ID) {
  window.ym(window.METRIKA_ID, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
}