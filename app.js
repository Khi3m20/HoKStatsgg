/* =========================================================
   HoKStat.gg
   MASTER JAVASCRIPT
========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const HOKSTAT_CONFIG = {

  /*
    Empty during GitHub Pages frontend testing.

    Later:

    API_BASE_URL:
      "https://api.hokstat.gg"
  */

  API_BASE_URL: "",

  DEFAULT_LANGUAGE: "en",

  SLIDER_INTERVAL: 6500,

  VERSION: "prototype"

};


/* =========================================================
   SAFE HTML
========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   DOM HELPERS
========================================================= */

function $(selector, parent = document) {

  return parent.querySelector(selector);

}

function $$(selector, parent = document) {

  return [...parent.querySelectorAll(selector)];

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function initMobileNavigation() {

  const button = $("#mobileMenuButton");
  const nav = $("#mobileNav");
  const close = $("#mobileNavClose");

  if (!button || !nav) return;


  function openMenu() {

    nav.classList.add("open");

    button.setAttribute(
      "aria-expanded",
      "true"
    );

    nav.setAttribute(
      "aria-hidden",
      "false"
    );

  }


  function closeMenu() {

    nav.classList.remove("open");

    button.setAttribute(
      "aria-expanded",
      "false"
    );

    nav.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  button.addEventListener(
    "click",
    openMenu
  );


  if (close) {

    close.addEventListener(
      "click",
      closeMenu
    );

  }


  $$("a", nav).forEach(link => {

    link.addEventListener(
      "click",
      closeMenu
    );

  });


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        nav.classList.contains("open")
      ) {

        closeMenu();

      }

    }
  );

}


/* =========================================================
   HOMEPAGE SLIDER
========================================================= */

function initHomeSlider() {

  const slider = $("#homeSlider");

  if (!slider) return;


  const slides = $$(".cinematic-slide", slider);

  const dots = $("#sliderDots");

  const previous = $("#sliderPrev");

  const next = $("#sliderNext");

  const progress = $("#sliderProgressBar");


  if (!slides.length) return;


  let current = 0;

  let timer = null;

  let progressStart = 0;

  let progressFrame = null;

  let paused = false;


  /*
    Build dots.
  */

  if (dots) {

    slides.forEach(
      (_, index) => {

        const dot =
          document.createElement("button");

        dot.type = "button";

        dot.className =
          "slider-dot";

        dot.setAttribute(
          "aria-label",
          `Go to slide ${index + 1}`
        );

        dot.addEventListener(
          "click",
          () => {

            goTo(index);

            restart();

          }
        );

        dots.appendChild(dot);

      }
    );

  }


  function render() {

    slides.forEach(
      (slide, index) => {

        slide.classList.toggle(
          "active",
          index === current
        );

      }
    );


    if (dots) {

      $$(".slider-dot", dots)
        .forEach(
          (dot, index) => {

            dot.classList.toggle(
              "active",
              index === current
            );

          }
        );

    }

  }


  function goTo(index) {

    current =
      (index + slides.length)
      % slides.length;

    render();

  }


  function nextSlide() {

    goTo(current + 1);

  }


  function previousSlide() {

    goTo(current - 1);

  }


  function stopProgress() {

    if (progressFrame) {

      cancelAnimationFrame(
        progressFrame
      );

      progressFrame = null;

    }

  }


  function animateProgress(timestamp) {

    if (paused) return;

    if (!progressStart) {

      progressStart = timestamp;

    }

    const elapsed =
      timestamp - progressStart;

    const percent =
      Math.min(
        100,
        (elapsed /
          HOKSTAT_CONFIG.SLIDER_INTERVAL) *
          100
      );


    if (progress) {

      progress.style.width =
        `${percent}%`;

    }


    if (
      elapsed <
      HOKSTAT_CONFIG.SLIDER_INTERVAL
    ) {

      progressFrame =
        requestAnimationFrame(
          animateProgress
        );

    }

  }


  function startProgress() {

    stopProgress();

    progressStart =
      performance.now();

    if (progress) {

      progress.style.width =
        "0%";

    }

    progressFrame =
      requestAnimationFrame(
        animateProgress
      );

  }


  function clearTimer() {

    if (timer) {

      clearInterval(timer);

      timer = null;

    }

  }


  function startTimer() {

    clearTimer();

    timer =
      setInterval(
        () => {

          if (!paused) {

            nextSlide();

            startProgress();

          }

        },
        HOKSTAT_CONFIG.SLIDER_INTERVAL
      );

  }


  function restart() {

    clearTimer();

    startProgress();

    startTimer();

  }


  if (previous) {

    previous.addEventListener(
      "click",
      () => {

        previousSlide();

        restart();

      }
    );

  }


  if (next) {

    next.addEventListener(
      "click",
      () => {

        nextSlide();

        restart();

      }
    );

  }


  /*
    Pause on desktop hover.
  */

  slider.addEventListener(
    "mouseenter",
    () => {

      paused = true;

      clearTimer();

      stopProgress();

    }
  );


  slider.addEventListener(
    "mouseleave",
    () => {

      paused = false;

      restart();

    }
  );


  /*
    Mobile swipe.
  */

  let touchStartX = 0;

  let touchEndX = 0;


  slider.addEventListener(
    "touchstart",
    event => {

      touchStartX =
        event.changedTouches[0].screenX;

    },
    {
      passive: true
    }
  );


  slider.addEventListener(
    "touchend",
    event => {

      touchEndX =
        event.changedTouches[0].screenX;

      const distance =
        touchStartX - touchEndX;


      if (
        Math.abs(distance) < 50
      ) {

        return;

      }


      if (distance > 0) {

        nextSlide();

      } else {

        previousSlide();

      }


      restart();

    },
    {
      passive: true
    }
  );


  /*
    Start.
  */

  render();

  startProgress();

  startTimer();

}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function initGlobalSearch() {

  const input =
    $("#globalSearch");

  const button =
    $("#globalSearchButton");

  const results =
    $("#searchResults");


  if (!input || !results) return;


  function showSearchMessage(
    query
  ) {

    const clean =
      escapeHTML(query);


    results.style.display =
      "block";


    results.innerHTML = `

      <strong>
        Search:
      </strong>

      "${clean}"

      <br><br>

      <span class="muted">
        Global database search will
        connect to the HoKStat API
        when the backend is enabled.
      </span>

    `;

  }


  function search() {

    const query =
      input.value.trim();


    if (!query) {

      results.style.display =
        "none";

      return;

    }


    showSearchMessage(query);

  }


  if (button) {

    button.addEventListener(
      "click",
      search
    );

  }


  input.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        search();

      }

    }
  );

}


/* =========================================================
   QUERY PARAMETERS
========================================================= */

function getQueryParameter(
  name
) {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get(name);

}


/* =========================================================
   IMAGE SLOT
========================================================= */

function createImageSlot(
  imageURL,
  altText = ""
) {

  if (!imageURL) {

    return `

      <div class="visual-slot">

        ARTWORK
        / IMAGE

      </div>

    `;

  }


  return `

    <img
      src="${escapeHTML(imageURL)}"
      alt="${escapeHTML(altText)}"
      loading="lazy"
      style="
        width:100%;
        height:100%;
        min-height:180px;
        object-fit:cover;
        display:block;
      "
    >

  `;

}


/* =========================================================
   DATA SOURCE MODEL
========================================================= */

function createSourceStatus(
  source
) {

  if (!source) {

    return `

      <span class="badge">
        SOURCE PENDING
      </span>

    `;

  }


  if (
    source.type === "OFFICIAL" &&
    source.status === "VERIFIED"
  ) {

    return `

      <span class="badge">
        OFFICIAL · VERIFIED
      </span>

    `;

  }


  return `

    <span class="badge">
      VERIFICATION PENDING
    </span>

  `;

}


/* =========================================================
   FUTURE OFFICIAL DATA FORMAT
========================================================= */

/*

  IMPORTANT:

  These are empty prototype collections.

  They must NOT be filled with invented
  "official" statistics.

  Future backend records should resemble:

  {
    id: "...",
    slug: "...",
    name: "...",

    source: {
      type: "OFFICIAL",
      url: "...",
      region: "...",
      version: "...",
      lastVerified: "...",
      status: "VERIFIED"
    }
  }

*/


const HOKSTAT_DATA = {

  heroes: [],

  equipment: [],

  builds: [],

  patches: [],

  guides: [],

  news: [],

  meta: []

};


/* =========================================================
   API LAYER
========================================================= */

async function apiRequest(
  endpoint,
  options = {}
) {

  if (
    !HOKSTAT_CONFIG.API_BASE_URL
  ) {

    throw new Error(
      "HoKStat API is not connected yet."
    );

  }


  const response =
    await fetch(
      `${HOKSTAT_CONFIG.API_BASE_URL}${endpoint}`,
      {
        ...options,

        headers: {
          "Accept":
            "application/json",

          ...(options.headers || {})
        }
      }
    );


  if (!response.ok) {

    throw new Error(
      `API request failed: ${response.status}`
    );

  }


  return response.json();

}


/* =========================================================
   FUTURE API FUNCTIONS
========================================================= */

async function getHeroes() {

  return apiRequest(
    "/api/heroes"
  );

}


async function getHero(slug) {

  return apiRequest(
    `/api/heroes/${encodeURIComponent(slug)}`
  );

}


async function getEquipment() {

  return apiRequest(
    "/api/equipment"
  );

}


async function getEquipmentItem(slug) {

  return apiRequest(
    `/api/equipment/${encodeURIComponent(slug)}`
  );

}


async function getBuilds() {

  return apiRequest(
    "/api/builds"
  );

}


async function getBuild(slug) {

  return apiRequest(
    `/api/builds/${encodeURIComponent(slug)}`
  );

}


async function getMeta() {

  return apiRequest(
    "/api/meta"
  );

}


async function getPatches() {

  return apiRequest(
    "/api/patches"
  );

}


async function getNews() {

  return apiRequest(
    "/api/news"
  );

}


async function getGuides() {

  return apiRequest(
    "/api/guides"
  );

}


async function getCommunityQuestions() {

  return apiRequest(
    "/api/community/questions"
  );

}


/* =========================================================
   CALCULATOR ENGINE FOUNDATION
========================================================= */

/*
  This is intentionally a calculation foundation.

  It does NOT invent game mechanics.

  Once official/verified mechanics are connected,
  the backend calculator can provide:

  Base
  + Equipment
  + Hero effects
  + Item passives
  + Percentage modifiers
  = Final

  Unknown mechanics should return unavailable
  instead of guessed numbers.
*/


function createEmptyCalculatorState() {

  return {

    heroId: null,

    slots: [
      null,
      null,
      null,
      null,
      null,
      null
    ],

    stats: {},

    calculated: false

  };

}


function resetCalculatorState() {

  return createEmptyCalculatorState();

}


/* =========================================================
   LOCAL STORAGE BUILD SAVE
========================================================= */

const LOCAL_BUILD_KEY =
  "hokstat_local_build";


function saveLocalBuild(
  build
) {

  try {

    localStorage.setItem(
      LOCAL_BUILD_KEY,
      JSON.stringify(build)
    );

    return true;

  } catch (error) {

    console.error(
      "Could not save build:",
      error
    );

    return false;

  }

}


function loadLocalBuild() {

  try {

    const raw =
      localStorage.getItem(
        LOCAL_BUILD_KEY
      );


    if (!raw) {

      return null;

    }


    return JSON.parse(raw);

  } catch (error) {

    console.error(
      "Could not load build:",
      error
    );

    return null;

  }

}


function deleteLocalBuild() {

  try {

    localStorage.removeItem(
      LOCAL_BUILD_KEY
    );

    return true;

  } catch (error) {

    console.error(
      "Could not delete build:",
      error
    );

    return false;

  }

}


/* =========================================================
   DATA FRESHNESS
========================================================= */

function isDataFresh(
  lastUpdated,
  maxAgeDays = 7
) {

  if (!lastUpdated) {

    return false;

  }


  const timestamp =
    new Date(lastUpdated)
      .getTime();


  if (
    Number.isNaN(timestamp)
  ) {

    return false;

  }


  const age =
    Date.now() - timestamp;


  const maxAge =
    maxAgeDays *
    24 *
    60 *
    60 *
    1000;


  return age <= maxAge;

}


/* =========================================================
   FORMATTERS
========================================================= */

function formatNumber(
  value
) {

  const number =
    Number(value);


  if (
    Number.isNaN(number)
  ) {

    return "—";

  }


  return new Intl.NumberFormat(
    "en-US"
  ).format(number);

}


function formatPercent(
  value
) {

  const number =
    Number(value);


  if (
    Number.isNaN(number)
  ) {

    return "—";

  }


  return `${number.toFixed(2)}%`;

}


/* =========================================================
   PAGE TYPE DETECTION
========================================================= */

function getPageType() {

  const path =
    window.location.pathname
      .toLowerCase();


  if (
    path.endsWith("/") ||
    path.endsWith("/index.html")
  ) {

    if (
      path.includes("/heroes/")
    ) {

      return "heroes";

    }

    if (
      path.includes("/equipment/")
    ) {

      return "equipment";

    }

    if (
      path.includes("/builds/")
    ) {

      return "builds";

    }

    if (
      path.includes("/calculator/")
    ) {

      return "calculator";

    }

    if (
      path.includes("/meta/")
    ) {

      return "meta";

    }

    if (
      path.includes("/patches/")
    ) {

      return "patches";

    }

    if (
      path.includes("/guides/")
    ) {

      return "guides";

    }

    if (
      path.includes("/community/")
    ) {

      return "community";

    }

    if (
      path.includes("/news/")
    ) {

      return "news";

    }

    return "home";

  }


  if (
    path.includes("/hero.html")
  ) {

    return "hero-detail";

  }


  if (
    path.includes("/item.html")
  ) {

    return "equipment-detail";

  }


  if (
    path.includes("/build.html")
  ) {

    return "build-detail";

  }


  if (
    path.includes("/patch.html")
  ) {

    return "patch-detail";

  }


  if (
    path.includes("/guide.html")
  ) {

    return "guide-detail";

  }


  return "unknown";

}


/* =========================================================
   IMAGE PRELOADING
========================================================= */

function preloadImage(
  url
) {

  if (!url) return;

  const image =
    new Image();

  image.src = url;

}


/* =========================================================
   ADMIN-READY SLIDE MODEL
========================================================= */

/*

  Future homepage slider content:

  {
    id: "...",
    type: "HERO",

    title: "...",
    subtitle: "...",
    description: "...",

    image_url: "...",

    target_url: "...",

    featured: true,

    popularity: 85,

    relevance: 90,

    recency: 100,

    diversity: 80
  }

  The backend can calculate:

  Score =
    Recency
    + Featured
    + Popularity
    + Relevance
    + Diversity
    - RecentRepeat

*/


function calculateContentScore(
  content
) {

  if (!content) {

    return 0;

  }


  return (
    Number(content.recency || 0) +
    Number(content.featured ? 20 : 0) +
    Number(content.popularity || 0) +
    Number(content.relevance || 0) +
    Number(content.diversity || 0) -
    Number(content.recentRepeat || 0)
  );

}


/* =========================================================
   PUBLIC HELPER
========================================================= */

window.HoKStat = {

  config:
    HOKSTAT_CONFIG,

  data:
    HOKSTAT_DATA,

  getQueryParameter,

  escapeHTML,

  formatNumber,

  formatPercent,

  getPageType,

  apiRequest,

  getHeroes,

  getHero,

  getEquipment,

  getEquipmentItem,

  getBuilds,

  getBuild,

  getMeta,

  getPatches,

  getNews,

  getGuides,

  getCommunityQuestions,

  createEmptyCalculatorState,

  resetCalculatorState,

  saveLocalBuild,

  loadLocalBuild,

  deleteLocalBuild,

  isDataFresh,

  calculateContentScore

};


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initMobileNavigation();

    initHomeSlider();

    initGlobalSearch();

    console.log(
      "HoKStat.gg initialized:",
      HOKSTAT_CONFIG.VERSION
    );

  }
);
