/* =========================================================
   HoKStat.gg
   Frontend foundation
   GitHub Pages compatible
   No framework / no API key
   ========================================================= */

"use strict";


/* =========================================================
   DEMO DATA
   ---------------------------------------------------------
   IMPORTANT:
   These records are LOCAL DEMO records only.
   They are NOT official live HoK data.
   Replace them with verified API/Supabase data later.
   ========================================================= */

const DEMO_HEROES = [
  {
    id: "demo-hero-1",
    slug: "demo-warrior",
    name: "Demo Warrior",
    role: "Fighter",
    lane: "Clash Lane",
    difficulty: "Medium",
    letter: "W",
    status: "DATA PENDING",
    bio: "Demo placeholder used to test HoKStat's hero database interface. Replace this record with verified official Honor of Kings data."
  },
  {
    id: "demo-hero-2",
    slug: "demo-mage",
    name: "Demo Mage",
    role: "Mage",
    lane: "Mid Lane",
    difficulty: "Hard",
    letter: "M",
    status: "DATA PENDING",
    bio: "Demo placeholder used to test the hero detail system. No live gameplay statistics are represented here."
  },
  {
    id: "demo-hero-3",
    slug: "demo-assassin",
    name: "Demo Assassin",
    role: "Assassin",
    lane: "Jungle",
    difficulty: "Hard",
    letter: "A",
    status: "DATA PENDING",
    bio: "Demo placeholder for the HoKStat hero system. Official verified data can be connected later."
  },
  {
    id: "demo-hero-4",
    slug: "demo-roamer",
    name: "Demo Roamer",
    role: "Tank",
    lane: "Roamer",
    difficulty: "Easy",
    letter: "R",
    status: "DATA PENDING",
    bio: "Demo placeholder for testing cards, filters and detail pages."
  }
];


const DEMO_ITEMS = [
  {
    id: "demo-item-1",
    slug: "demo-sword",
    name: "Demo Sword",
    type: "Attack",
    icon: "⚔",
    price: 1800,
    stats: {
      "Physical Attack": "+80",
      "Attack Speed": "+15%"
    }
  },
  {
    id: "demo-item-2",
    slug: "demo-armor",
    name: "Demo Armor",
    type: "Defense",
    icon: "◇",
    price: 1900,
    stats: {
      "HP": "+900",
      "Physical Defense": "+70"
    }
  },
  {
    id: "demo-item-3",
    slug: "demo-orb",
    name: "Demo Orb",
    type: "Magic",
    icon: "◈",
    price: 2100,
    stats: {
      "Magic Attack": "+120",
      "Cooldown": "+10%"
    }
  },
  {
    id: "demo-item-4",
    slug: "demo-boots",
    name: "Demo Boots",
    type: "Movement",
    icon: "≫",
    price: 900,
    stats: {
      "Movement Speed": "+60"
    }
  },
  {
    id: "demo-item-5",
    slug: "demo-bow",
    name: "Demo Bow",
    type: "Attack",
    icon: "⌁",
    price: 2200,
    stats: {
      "Physical Attack": "+100",
      "Crit Rate": "+15%"
    }
  },
  {
    id: "demo-item-6",
    slug: "demo-mantle",
    name: "Demo Mantle",
    type: "Defense",
    icon: "△",
    price: 2000,
    stats: {
      "Magic Defense": "+80",
      "HP": "+500"
    }
  },
  {
    id: "demo-item-7",
    slug: "demo-staff",
    name: "Demo Staff",
    type: "Magic",
    icon: "✦",
    price: 2300,
    stats: {
      "Magic Attack": "+140",
      "Cooldown": "+8%"
    }
  },
  {
    id: "demo-item-8",
    slug: "demo-blade",
    name: "Demo Blade",
    type: "Attack",
    icon: "╱",
    price: 2400,
    stats: {
      "Physical Attack": "+125",
      "Crit Rate": "+20%"
    }
  }
];


const DEMO_BUILDS = [
  {
    slug: "demo-balanced-build",
    name: "Demo Balanced Build",
    hero: "Demo Warrior",
    type: "Recommended",
    description: "Placeholder build used to test the six-slot build interface.",
    items: [
      "demo-sword",
      "demo-boots",
      "demo-armor",
      "demo-bow",
      "demo-mantle",
      "demo-blade"
    ]
  },
  {
    slug: "demo-magic-build",
    name: "Demo Magic Build",
    hero: "Demo Mage",
    type: "Recommended",
    description: "Placeholder magic build for interface testing only.",
    items: [
      "demo-boots",
      "demo-orb",
      "demo-staff",
      "demo-mantle",
      "demo-orb",
      "demo-staff"
    ]
  },
  {
    slug: "demo-jungle-build",
    name: "Demo Jungle Build",
    hero: "Demo Assassin",
    type: "Recommended",
    description: "Placeholder jungle build. No official gameplay recommendation is implied.",
    items: [
      "demo-sword",
      "demo-boots",
      "demo-bow",
      "demo-blade",
      "demo-sword",
      "demo-mantle"
    ]
  }
];


const DEMO_NEWS = [
  {
    title: "Official data integration ready",
    category: "SYSTEM",
    text: "HoKStat is structured to receive verified official data through its future data pipeline.",
    date: "DATA PENDING"
  },
  {
    title: "Calculator engine foundation",
    category: "FEATURE",
    text: "The six-slot equipment calculator interface is ready for the verified stat engine.",
    date: "DEMO"
  },
  {
    title: "International-first architecture",
    category: "PROJECT",
    text: "The interface is designed for localization and international users from the beginning.",
    date: "DEMO"
  }
];


const DEMO_GUIDES = [
  {
    title: "How to read hero stats",
    category: "BEGINNER",
    text: "A placeholder guide card demonstrating the guide system."
  },
  {
    title: "Understanding equipment",
    category: "EQUIPMENT",
    text: "A placeholder equipment guide card."
  },
  {
    title: "Build calculator basics",
    category: "ADVANCED",
    text: "A placeholder guide for the six-slot calculator."
  }
];


const DEMO_QUESTIONS = [
  {
    title: "How will official data be verified?",
    category: "DATA",
    answers: 3,
    votes: 12,
    text: "Question placeholder demonstrating the Community Q&A layout."
  },
  {
    title: "Can builds be saved?",
    category: "BUILDS",
    answers: 5,
    votes: 8,
    text: "Saved builds will eventually use user accounts."
  },
  {
    title: "Will HoKStat support multiple languages?",
    category: "GENERAL",
    answers: 2,
    votes: 6,
    text: "The architecture is designed for localization."
  }
];


/* =========================================================
   APP STATE
   ========================================================= */

const state = {
  sliderIndex: 0,
  sliderTimer: null,
  sliderPaused: false,

  calculatorHero: DEMO_HEROES[0],
  calculatorSlots: [null, null, null, null, null, null]
};


/* =========================================================
   HELPERS
   ========================================================= */

function qs(selector, parent = document) {
  return parent.querySelector(selector);
}


function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}


function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function formatNumber(number) {
  return new Intl.NumberFormat("en-US").format(number);
}


function money(number) {
  return `${formatNumber(number)} gold`;
}


function getParams() {
  return new URLSearchParams(window.location.search);
}


function getPage() {
  return getParams().get("page") || "home";
}


function getSlug() {
  return getParams().get("slug") || "";
}


function navigate(url) {
  window.location.href = url;
}


function showToast(message) {
  const toast = qs("#toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}


/* =========================================================
   APP START
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initHeader();
  initSearch();

  renderPage();

});


/* =========================================================
   HEADER
   ========================================================= */

function initHeader() {

  const menuButton = qs("#menuButton");
  const mobileMenu = qs("#mobileMenu");

  if (menuButton) {
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("open");
    });
  }

}


/* =========================================================
   SEARCH
   ========================================================= */

function initSearch() {

  const openButton = qs("#openSearch");
  const closeButton = qs("#closeSearch");
  const modal = qs("#searchModal");
  const input = qs("#globalSearchInput");

  openButton.addEventListener("click", openSearch);

  closeButton.addEventListener("click", closeSearch);

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeSearch();
    }
  });

  input.addEventListener("input", () => {
    performSearch(input.value);
  });

  document.addEventListener("keydown", event => {

    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "k"
    ) {
      event.preventDefault();
      openSearch();
    }

    if (event.key === "Escape") {
      closeSearch();
    }

  });

}


function openSearch() {

  const modal = qs("#searchModal");
  const input = qs("#globalSearchInput");

  modal.classList.add("open");

  setTimeout(() => input.focus(), 50);
}


function closeSearch() {
  qs("#searchModal").classList.remove("open");
}


function performSearch(query) {

  const results = qs("#searchResults");

  query = query.trim().toLowerCase();

  if (!query) {

    results.innerHTML = `
      <div class="search-empty">
        Start typing to search HoKStat.
      </div>
    `;

    return;
  }


  const found = [];


  DEMO_HEROES.forEach(hero => {

    if (
      hero.name.toLowerCase().includes(query) ||
      hero.role.toLowerCase().includes(query) ||
      hero.lane.toLowerCase().includes(query)
    ) {
      found.push({
        type: "Hero",
        name: hero.name,
        icon: hero.letter,
        url: `./index.html?page=hero&slug=${hero.slug}`
      });
    }

  });


  DEMO_ITEMS.forEach(item => {

    if (
      item.name.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    ) {
      found.push({
        type: "Equipment",
        name: item.name,
        icon: item.icon,
        url: `./index.html?page=item&slug=${item.slug}`
      });
    }

  });


  DEMO_BUILDS.forEach(build => {

    if (
      build.name.toLowerCase().includes(query) ||
      build.hero.toLowerCase().includes(query)
    ) {
      found.push({
        type: "Build",
        name: build.name,
        icon: "B",
        url: `./index.html?page=build&slug=${build.slug}`
      });
    }

  });


  if (!found.length) {

    results.innerHTML = `
      <div class="search-empty">
        No matching result found.
      </div>
    `;

    return;
  }


  results.innerHTML = found
    .slice(0, 15)
    .map(result => `
      <a class="search-result" href="${result.url}">
        <div class="search-result-icon">
          ${escapeHTML(result.icon)}
        </div>

        <div>
          <strong>${escapeHTML(result.name)}</strong>
          <span>${escapeHTML(result.type)}</span>
        </div>
      </a>
    `)
    .join("");
}


/* =========================================================
   PAGE ROUTER
   ========================================================= */

function renderPage() {

  const app = qs("#app");

  const page = getPage();

  switch (page) {

    case "heroes":
      renderHeroesPage();
      break;

    case "hero":
      renderHeroDetail();
      break;

    case "equipment":
      renderEquipmentPage();
      break;

    case "item":
      renderItemDetail();
      break;

    case "builds":
      renderBuildsPage();
      break;

    case "build":
      renderBuildDetail();
      break;

    case "calculator":
      renderCalculatorPage();
      break;

    case "meta":
      renderMetaPage();
      break;

    case "patches":
      renderPatchesPage();
      break;

    case "patch":
      renderPatchDetail();
      break;

    case "guides":
      renderGuidesPage();
      break;

    case "guide":
      renderGuideDetail();
      break;

    case "community":
      renderCommunityPage();
      break;

    case "news":
      renderNewsPage();
      break;

    case "about":
      renderAboutPage();
      break;

    case "data":
      renderDataPage();
      break;

    default:
      renderHomePage();
      break;

  }

}


/* =========================================================
   HOME
   ========================================================= */

const slides = [
  {
    type: "HERO",
    title: "Explore the Heroes",
    subtitle: "VERIFIED DATA ARCHITECTURE",
    description: "Browse hero profiles, skills, stats, builds, counters and patch history in one database.",
    button: "EXPLORE HEROES",
    url: "./index.html?page=heroes"
  },

  {
    type: "BUILD",
    title: "Builds that make sense",
    subtitle: "BUILD DATABASE",
    description: "Six-slot builds, calculated stats and situational setups — connected to the same data system.",
    button: "VIEW BUILDS",
    url: "./index.html?page=builds"
  },

  {
    type: "EQUIPMENT",
    title: "Understand every item",
    subtitle: "EQUIPMENT DATABASE",
    description: "Equipment stats, passives, prices and build paths — with verified data as the source of truth.",
    button: "VIEW EQUIPMENT",
    url: "./index.html?page=equipment"
  },

  {
    type: "PATCH",
    title: "Track every update",
    subtitle: "PATCH HISTORY",
    description: "Historical changes are preserved instead of silently overwriting the previous data.",
    button: "VIEW PATCHES",
    url: "./index.html?page=patches"
  },

  {
    type: "GUIDE",
    title: "Learn the game",
    subtitle: "GUIDES",
    description: "From beginner fundamentals to deeper hero and gameplay guides.",
    button: "VIEW GUIDES",
    url: "./index.html?page=guides"
  },

  {
    type: "NEWS",
    title: "Stay up to date",
    subtitle: "NEWS & UPDATES",
    description: "Official announcements, upcoming content and clearly labelled unconfirmed information.",
    button: "VIEW NEWS",
    url: "./index.html?page=news"
  }
];


function renderHomePage() {

  const app = qs("#app");

  app.innerHTML = `
    <div class="page">

      <section class="home-hero" id="homeHero">

        <div class="hero-art">
          <div class="art-pattern"></div>
        </div>

        <div class="hero-content">

          <div class="hero-kicker" id="slideType">
            HERO
          </div>

          <h1 class="hero-title" id="slideTitle">
            Explore the <span>Heroes</span>
          </h1>

          <p class="hero-description" id="slideDescription">
            Browse hero profiles, skills, stats, builds, counters and patch history in one database.
          </p>

          <div class="hero-actions">
            <a class="btn btn-primary" id="slideCTA" href="./index.html?page=heroes">
              EXPLORE HEROES →
            </a>

            <a class="btn btn-secondary" href="./index.html?page=about">
              ABOUT HOKSTAT
            </a>
          </div>

          <div class="hero-meta">

            <div class="hero-meta-item">
              <strong>OFFICIAL-FIRST</strong>
              <span>Data philosophy</span>
            </div>

            <div class="hero-meta-item">
              <strong>INTERNATIONAL</strong>
              <span>9-language ready</span>
            </div>

            <div class="hero-meta-item">
              <strong>LIVE / TEST</strong>
              <span>Separated data</span>
            </div>

          </div>

        </div>

        <div class="slider-controls">

          <button class="slider-arrow" id="sliderPrev">
            ←
          </button>

          <div class="slider-dots" id="sliderDots"></div>

          <button class="slider-arrow" id="sliderNext">
            →
          </button>

        </div>

      </section>


      <div class="quick-search">
        <span>⌕</span>

        <input
          id="quickSearch"
          type="text"
          placeholder="Search Heroes, Equipment, Builds, Guides, Patches..."
        >

        <button class="btn btn-primary" id="quickSearchButton">
          SEARCH
        </button>
      </div>


      <section class="section">

        <div class="section-head">

          <div>
            <p class="eyebrow">EXPLORE</p>
            <h2 class="section-title">HoKStat tools & database</h2>
          </div>

        </div>

        <div class="explore-grid">

          ${exploreCard("H", "Heroes", "Hero profiles, skills & stats", "heroes")}
          ${exploreCard("◇", "Equipment", "Items, passives & build paths", "equipment")}
          ${exploreCard("B", "Builds", "Recommended six-slot builds", "builds")}
          ${exploreCard("⌘", "Calculator", "Build your own six-slot setup", "calculator")}
          ${exploreCard("M", "Meta", "Role-based verified statistics", "meta")}
          ${exploreCard("P", "Patches", "Current & historical changes", "patches")}
          ${exploreCard("G", "Guides", "Beginner to advanced guides", "guides")}
          ${exploreCard("Q", "Community", "Questions, answers & discussion", "community")}

        </div>

      </section>


      <section class="section">

        <div class="feature-strip">

          <div class="feature-card">

            <p class="eyebrow">DATA SYSTEM</p>

            <h3>Accuracy before automation.</h3>

            <p>
              HoKStat is designed around official and verified sources.
              Unverified information should never silently become live data.
            </p>

            <a class="btn btn-secondary" href="./index.html?page=data">
              DATA METHODOLOGY
            </a>

          </div>


          <div class="feature-card">

            <p class="eyebrow">CALCULATOR</p>

            <h3>Six slots.</h3>

            <p>
              Select equipment and see the calculated result.
            </p>

            <a class="btn btn-secondary" href="./index.html?page=calculator">
              OPEN CALCULATOR
            </a>

          </div>


          <div class="feature-card">

            <p class="eyebrow">COMMUNITY</p>

            <h3>Ask. Answer. Learn.</h3>

            <p>
              Community Q&A stays separate from live game data.
            </p>

            <a class="btn btn-secondary" href="./index.html?page=community">
              COMMUNITY
            </a>

          </div>

        </div>

      </section>


      <section class="section">

        <div class="section-head">
          <div>
            <p class="eyebrow">FEATURED</p>
            <h2>Latest project areas</h2>
          </div>

          <a class="btn btn-secondary" href="./index.html?page=news">
            ALL NEWS →
          </a>
        </div>


        <div class="news-grid">

          ${DEMO_NEWS.map(news => `
            <article class="card news-card">

              <div class="visual-slot news-thumb">
                <span class="visual-label">${escapeHTML(news.category)}</span>
              </div>

              <div class="news-content">

                <span class="tag green-tag">
                  ${escapeHTML(news.category)}
                </span>

                <h3>${escapeHTML(news.title)}</h3>

                <p>${escapeHTML(news.text)}</p>

              </div>

            </article>
          `).join("")}

        </div>

      </section>


      <section class="section">

        <div class="status-panel">

          <div class="status-left">

            <div class="status-dot"></div>

            <div>
              <strong>HoKStat data status</strong>
              <div class="small">
                Frontend demo · official live database connection pending
              </div>
            </div>

          </div>

          <span class="tag green-tag">
            DEMO MODE
          </span>

        </div>

      </section>

    </div>
  `;


  initSlider();
  initQuickSearch();
}


/* =========================================================
   HOME HELPERS
   ========================================================= */

function exploreCard(icon, title, description, page) {

  return `
    <a class="explore-card" href="./index.html?page=${page}">

      <div class="explore-icon">
        ${icon}
      </div>

      <strong>${title}</strong>

      <p>${description}</p>

    </a>
  `;
}


function initQuickSearch() {

  const input = qs("#quickSearch");
  const button = qs("#quickSearchButton");

  function go() {

    const query = input.value.trim();

    if (!query) {
      openSearch();
      return;
    }

    openSearch();

    qs("#globalSearchInput").value = query;

    performSearch(query);
  }

  button.addEventListener("click", go);

  input.addEventListener("keydown", event => {

    if (event.key === "Enter") {
      go();
    }

  });
}


/* =========================================================
   SLIDER
   ========================================================= */

function initSlider() {

  const dots = qs("#sliderDots");

  dots.innerHTML = slides
    .map((_, index) => `
      <button
        class="slider-dot ${index === 0 ? "active" : ""}"
        data-slide="${index}"
        aria-label="Slide ${index + 1}">
      </button>
    `)
    .join("");


  qsa(".slider-dot").forEach(dot => {

    dot.addEventListener("click", () => {

      goToSlide(Number(dot.dataset.slide));

    });

  });


  qs("#sliderPrev").addEventListener("click", () => {

    goToSlide(
      (state.sliderIndex - 1 + slides.length) % slides.length
    );

  });


  qs("#sliderNext").addEventListener("click", () => {

    goToSlide(
      (state.sliderIndex + 1) % slides.length
    );

  });


  const hero = qs("#homeHero");

  hero.addEventListener("mouseenter", () => {
    state.sliderPaused = true;
  });

  hero.addEventListener("mouseleave", () => {
    state.sliderPaused = false;
  });


  startSlider();
}


function startSlider() {

  clearInterval(state.sliderTimer);

  state.sliderTimer = setInterval(() => {

    if (!state.sliderPaused) {

      goToSlide(
        (state.sliderIndex + 1) % slides.length
      );

    }

  }, 6000);
}


function goToSlide(index) {

  state.sliderIndex = index;

  const slide = slides[index];

  const title = qs("#slideTitle");
  const type = qs("#slideType");
  const description = qs("#slideDescription");
  const cta = qs("#slideCTA");

  type.textContent = slide.subtitle;

  title.innerHTML = makeGreenTitle(slide.title);

  description.textContent = slide.description;

  cta.textContent = `${slide.button} →`;
  cta.href = slide.url;


  qsa(".slider-dot").forEach((dot, dotIndex) => {

    dot.classList.toggle(
      "active",
      dotIndex === index
    );

  });

}


function makeGreenTitle(title) {

  const words = title.split(" ");

  if (words.length < 2) {
    return `<span>${escapeHTML(title)}</span>`;
  }

  const split = Math.ceil(words.length / 2);

  const first = words.slice(0, split).join(" ");
  const second = words.slice(split).join(" ");

  return `${escapeHTML(first)} <span>${escapeHTML(second)}</span>`;
}


/* =========================================================
   HEROES
   ========================================================= */

function renderHeroesPage() {

  const app = qs("#app");

  app.innerHTML = `
    <div class="page">

      <header class="page-header">

        <p class="eyebrow">DATABASE</p>

        <h1>Heroes</h1>

        <p>
          Browse hero profiles, roles, lanes, skills, builds and
          historical information.
        </p>

      </header>


      <div class="filter-bar">

        <input
          class="filter-input"
          id="heroSearch"
          placeholder="Search heroes..."
        >

        <select class="filter-select" id="heroRole">
          <option value="">All roles</option>
          <option>Fighter</option>
          <option>Mage</option>
          <option>Assassin</option>
          <option>Tank</option>
        </select>

        <select class="filter-select" id="heroLane">
          <option value="">All lanes</option>
          <option>Clash Lane</option>
          <option>Jungle</option>
          <option>Mid Lane</option>
          <option>Roamer</option>
          <option>Farm Lane</option>
        </select>

      </div>


      <div id="heroGrid" class="card-grid"></div>

    </div>
  `;


  renderHeroCards(DEMO_HEROES);


  const search = qs("#heroSearch");
  const role = qs("#heroRole");
  const lane = qs("#heroLane");


  function filter() {

    const text = search.value.toLowerCase();
    const selectedRole = role.value;
    const selectedLane = lane.value;

    const filtered = DEMO_HEROES.filter(hero => {

      const textMatch =
        hero.name.toLowerCase().includes(text);

      const roleMatch =
        !selectedRole ||
        hero.role === selectedRole;

      const laneMatch =
        !selectedLane ||
        hero.lane === selectedLane;

      return textMatch && roleMatch && laneMatch;

    });

    renderHeroCards(filtered);
  }


  search.addEventListener("input", filter);
  role.addEventListener("change", filter);
  lane.addEventListener("change", filter);
}


function renderHeroCards(heroes) {

  const grid = qs("#heroGrid");

  if (!heroes.length) {

    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⌕</div>
        <h3>No heroes found</h3>
        <p>Try changing your filters.</p>
      </div>
    `;

    return;
  }


  grid.innerHTML = heroes.map(hero => `

    <a
      class="card hero-card"
      href="./index.html?page=hero&slug=${hero.slug}"
    >

      <div class="visual-slot">

        <div class="hero-placeholder">
          ${escapeHTML(hero.letter)}
        </div>

        <span class="visual-label">
          ARTWORK SLOT
        </span>

      </div>


      <div class="card-body">

        <h3 class="hero-name">
          ${escapeHTML(hero.name)}
        </h3>

        <div class="hero-role">

          <span class="tag green-tag">
            ${escapeHTML(hero.role)}
          </span>

          <span class="tag">
            ${escapeHTML(hero.lane)}
          </span>

          <span class="tag">
            ${escapeHTML(hero.difficulty)}
          </span>

        </div>

        <div style="margin-top:12px">
          <span class="tag">
            ${escapeHTML(hero.status)}
          </span>
        </div>

      </div>

    </a>

  `).join("");
}


/* =========================================================
   HERO DETAIL
   ========================================================= */

function renderHeroDetail() {

  const slug = getSlug();

  const hero =
    DEMO_HEROES.find(item => item.slug === slug)
    || DEMO_HEROES[0];


  const app = qs("#app");

  app.innerHTML = `
    <div class="page">

      <div style="margin-bottom:18px">
        <a class="small" href="./index.html?page=heroes">
          ← Back to Heroes
        </a>
      </div>


      <section class="detail-header">

        <div class="detail-art visual-slot">

          <div class="hero-placeholder"
               style="font-size:150px;right:60px;top:70px">
            ${escapeHTML(hero.letter)}
          </div>

          <span class="visual-label">
            ADMIN ARTWORK SLOT
          </span>

        </div>


        <div class="detail-info">

          <p class="eyebrow">HERO PROFILE</p>

          <h1>${escapeHTML(hero.name)}</h1>

          <div class="detail-badges">

            <span class="tag green-tag">
              ${escapeHTML(hero.role)}
            </span>

            <span class="tag">
              ${escapeHTML(hero.lane)}
            </span>

            <span class="tag">
              ${escapeHTML(hero.difficulty)}
            </span>

          </div>


          <p>
            ${escapeHTML(hero.bio)}
          </p>


          <div class="status-panel" style="margin-top:22px">

            <div class="status-left">

              <div class="status-dot"></div>

              <div>
                <strong>Data status</strong>

                <div class="small">
                  This is a local demo record.
                </div>
              </div>

            </div>

            <span class="tag">
              DATA PENDING
            </span>

          </div>


          <div style="display:flex;gap:8px;margin-top:18px">

            <a
              class="btn btn-primary"
              href="./index.html?page=calculator"
            >
              BUILD CALCULATOR
            </a>

            <a
              class="btn btn-secondary"
              href="./index.html?page=builds"
            >
              BUILDS
            </a>

          </div>

        </div>

      </section>


      <section class="detail-section">

        <p class="eyebrow">SKILLS</p>

        <h2>Abilities</h2>

        <div class="skills-grid">

          ${["Passive", "Skill 1", "Skill 2", "Ultimate"]
            .map((skill, index) => `

              <div class="skill-card">

                <div class="skill-icon">
                  ${index === 0 ? "P" : index}
                </div>

                <strong>${skill}</strong>

                <p>
                  Skill data will be populated from
                  verified official sources.
                </p>

              </div>

            `).join("")}

        </div>

      </section>


      <section class="detail-section">

        <p class="eyebrow">BASE STATS</p>

        <h2>Statistics</h2>

        <div class="stat-bars">

          ${renderStatBar("Health", 82, "DATA PENDING")}
          ${renderStatBar("Physical Attack", 72, "DATA PENDING")}
          ${renderStatBar("Defense", 61, "DATA PENDING")}
          ${renderStatBar("Magic Defense", 55, "DATA PENDING")}
          ${renderStatBar("Attack Speed", 68, "DATA PENDING")}

        </div>

      </section>


      <section class="detail-section">

        <div class="section-head">

          <div>
            <p class="eyebrow">BUILDS</p>
            <h2>Recommended builds</h2>
          </div>

          <a class="btn btn-secondary"
             href="./index.html?page=builds">
            VIEW ALL
          </a>

        </div>

        <div class="build-grid">

          ${DEMO_BUILDS
            .filter(build => build.hero === hero.name)
            .map(renderBuildCard)
            .join("")}

        </div>

      </section>


      <section class="detail-section">

        <p class="eyebrow">MATCHUPS</p>

        <h2>Counters & Synergies</h2>

        <div class="empty-state">

          <div class="empty-icon">◎</div>

          <h3>Verified matchup data pending</h3>

          <p>
            Counter and synergy data will only be displayed
            when reliable source data is available.
          </p>

        </div>

      </section>


      <section class="detail-section">

        <p class="eyebrow">PATCH HISTORY</p>

        <h2>Changes</h2>

        <div class="timeline">

          <div class="timeline-item">

            <div class="timeline-card">

              <strong>Historical data pending</strong>

              <p class="small" style="margin-top:5px">
                Patch history will be populated from verified
                patch records.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  `;
}


function renderStatBar(name, percent, value) {

  return `
    <div class="stat-bar-row">

      <span>${name}</span>

      <div class="bar">
        <i style="width:${percent}%"></i>
      </div>

      <span class="stat-value">${value}</span>

    </div>
  `;
}


/* =========================================================
   EQUIPMENT
   ========================================================= */

function renderEquipmentPage() {

  const app = qs("#app");

  app.innerHTML = `
    <div class="page">

      <header class="page-header">

        <p class="eyebrow">DATABASE</p>

        <h1>Equipment</h1>

        <p>
          Equipment, attributes, passives and build paths.
        </p>

      </header>


      <div class="filter-bar">

        <input
          class="filter-input"
          id="itemSearch"
          placeholder="Search equipment..."
        >

        <select class="filter-select" id="itemType">
          <option value="">All types</option>
          <option>Attack</option>
          <option>Defense</option>
          <option>Magic</option>
          <option>Movement</option>
        </select>

      </div>


      <div id="equipmentGrid" class="equipment-grid"></div>

    </div>
  `;


  renderEquipmentCards(DEMO_ITEMS);


  function filterItems() {

    const text =
      qs("#itemSearch").value.toLowerCase();

    const type =
      qs("#itemType").value;


    const filtered = DEMO_ITEMS.filter(item => {

      return (
        item.name.toLowerCase().includes(text) &&
        (!type || item.type === type)
      );

    });

    renderEquipmentCards(filtered);
  }


  qs("#itemSearch")
    .addEventListener("input", filterItems);

  qs("#itemType")
    .addEventListener("change", filterItems);
}


function renderEquipmentCards(items) {

  const grid = qs("#equipmentGrid");

  if (!items.length) {

    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">◇</div>
        <h3>No equipment found</h3>
        <p>Try another search or filter.</p>
      </div>
    `;

    return;
  }


  grid.innerHTML = items.map(item => `

    <a
      class="card item-card"
      href="./index.html?page=item&slug=${item.slug}"
    >

      <div class="item-top">

        <div class="item-icon">
          ${escapeHTML(item.icon)}
        </div>

        <div>

          <h3 class="item-name">
            ${escapeHTML(item.name)}
          </h3>

          <div class="item-price">
            ${money(item.price)}
          </div>

        </div>

      </div>


      <div class="stat-list">

        ${Object.entries(item.stats)
          .map(([name, value]) => `
            <div class="stat-row">
              <span>${escapeHTML(name)}</span>
              <span>${escapeHTML(value)}</span>
            </div>
          `)
          .join("")}

      </div>


      <div style="margin-top:12px">
        <span class="tag">
          ${escapeHTML(item.type)}
        </span>

        <span class="tag">
          DEMO
        </span>
      </div>

    </a>

  `).join("");
}


/* =========================================================
   ITEM DETAIL
   ========================================================= */

function renderItemDetail() {

  const slug = getSlug();

  const item =
    DEMO_ITEMS.find(item => item.slug === slug)
    || DEMO_ITEMS[0];


  qs("#app").innerHTML = `
    <div class="page">

      <div style="margin-bottom:18px">
        <a class="small" href="./index.html?page=equipment">
          ← Back to Equipment
        </a>
      </div>


      <section class="detail-header">

        <div class="detail-art visual-slot">

          <div class="item-icon"
               style="
                 position:absolute;
                 left:50%;
                 top:50%;
                 transform:translate(-50%,-50%);
                 width:130px;
                 height:130px;
                 font-size:60px;
               ">
            ${escapeHTML(item.icon)}
          </div>

          <span class="visual-label">
            ADMIN ITEM ICON SLOT
          </span>

        </div>


        <div class="detail-info">

          <p class="eyebrow">EQUIPMENT</p>

          <h1>${escapeHTML(item.name)}</h1>

          <div class="detail-badges">

            <span class="tag green-tag">
              ${escapeHTML(item.type)}
            </span>

            <span class="tag">
              ${money(item.price)}
            </span>

          </div>


          <p>
            Placeholder equipment record for testing the
            HoKStat item detail architecture.
          </p>


          <div class="stat-list">

            ${Object.entries(item.stats)
              .map(([name, value]) => `
                <div class="stat-row">
                  <span>${escapeHTML(name)}</span>
                  <span>${escapeHTML(value)}</span>
                </div>
              `)
              .join("")}

          </div>


          <div style="margin-top:18px">

            <a
              class="btn btn-primary"
              href="./index.html?page=calculator"
            >
              USE IN CALCULATOR
            </a>

          </div>

        </div>

      </section>


      <section class="detail-section">

        <p class="eyebrow">PASSIVE</p>

        <h2>Passive effect</h2>

        <div class="empty-state">

          <div class="empty-icon">✦</div>

          <h3>Verified passive data pending</h3>

          <p>
            No invented passive values are shown.
            Official verified data will be inserted here.
          </p>

        </div>

      </section>


      <section class="detail-section">

        <p class="eyebrow">BUILD PATH</p>

        <h2>Components</h2>

        <div class="item-strip">

          ${DEMO_ITEMS
            .slice(0, 3)
            .map(component => `
              <div class="item-mini">
                ${escapeHTML(component.icon)}
              </div>
            `)
            .join("")}

        </div>

      </section>

    </div>
  `;
}


/* =========================================================
   BUILDS
   ========================================================= */

function renderBuildsPage() {

  qs("#app").innerHTML = `
    <div class="page">

      <header class="page-header">

        <p class="eyebrow">BUILD DATABASE</p>

        <h1>Builds</h1>

        <p>
          Six-slot recommended builds and future community builds.
        </p>

      </header>


      <section class="section">

        <div class="status-panel">

          <div class="status-left">

            <div class="status-dot"></div>

            <div>
              <strong>Recommended builds</strong>

              <div class="small">
                Current cards are local demo records.
              </div>
            </div>

          </div>

          <span class="tag">
            DEMO
          </span>

        </div>

      </section>


      <section class="section">

        <div class="build-grid">

          ${DEMO_BUILDS.map(renderBuildCard).join("")}

        </div>

      </section>

    </div>
  `;
}


function renderBuildCard(build) {

  return `
    <a
      class="card build-card"
      href="./index.html?page=build&slug=${build.slug}"
    >

      <div class="build-head">

        <div>

          <h3 class="build-title">
            ${escapeHTML(build.name)}
          </h3>

          <div class="small">
            ${escapeHTML(build.hero)}
          </div>

        </div>

        <span class="build-type">
          ${escapeHTML(build.type)}
        </span>

      </div>


      <div class="item-strip">

        ${build.items.map(slug => {

          const item =
            DEMO_ITEMS.find(item => item.slug === slug);

          return `
            <div class="item-mini">
              ${item ? escapeHTML(item.icon) : "?"}
            </div>
          `;

        }).join("")}

      </div>


      <div class="build-stats">

        <div class="mini-stat">
          <span>PHYSICAL ATTACK</span>
          <strong>+205</strong>
        </div>

        <div class="mini-stat">
          <span>HP</span>
          <strong>+1,400</strong>
        </div>

      </div>

    </a>
  `;
}


/* =========================================================
   BUILD DETAIL
   ========================================================= */

function renderBuildDetail() {

  const slug = getSlug();

  const build =
    DEMO_BUILDS.find(build => build.slug === slug)
    || DEMO_BUILDS[0];


  qs("#app").innerHTML = `
    <div class="page">

      <div style="margin-bottom:18px">
        <a class="small" href="./index.html?page=builds">
          ← Back to Builds
        </a>
      </div>


      <header class="page-header">

        <p class="eyebrow">BUILD DETAIL</p>

        <h1>${escapeHTML(build.name)}</h1>

        <p>
          ${escapeHTML(build.description)}
        </p>

      </header>


      <section class="detail-section">

        <p class="eyebrow">HERO</p>

        <h2>${escapeHTML(build.hero)}</h2>

        <div style="margin-top:15px">

          <span class="tag green-tag">
            ${escapeHTML(build.type)}
          </span>

          <span class="tag">
            DEMO DATA
          </span>

        </div>

      </section>


      <section class="detail-section">

        <p class="eyebrow">SIX SLOTS</p>

        <h2>Equipment</h2>

        <div class="item-strip"
             style="max-width:620px">

          ${build.items.map(slug => {

            const item =
              DEMO_ITEMS.find(item => item.slug === slug);

            return `
              <a
                class="item-mini"
                href="./index.html?page=item&slug=${slug}"
              >
                ${item ? escapeHTML(item.icon) : "?"}
              </a>
            `;

          }).join("")}

        </div>

      </section>


      <section class="detail-section">

        <p class="eyebrow">CALCULATED</p>

        <h2>Build Stats</h2>

        <div class="calc-stat-grid">

          <div class="calc-stat">
            <span>PHYSICAL ATTACK</span>
            <strong>+205</strong>
          </div>

          <div class="calc-stat">
            <span>MAGIC ATTACK</span>
            <strong>+0</strong>
          </div>

          <div class="calc-stat">
            <span>HP</span>
            <strong>+1,400</strong>
          </div>

          <div class="calc-stat">
            <span>DEFENSE</span>
            <strong>+150</strong>
          </div>

        </div>

      </section>


      <div style="margin-top:18px">

        <a
          class="btn btn-primary"
          href="./index.html?page=calculator"
        >
          TRY THIS BUILD →
        </a>

      </div>

    </div>
  `;
}


/* =========================================================
   CALCULATOR
   ========================================================= */

function renderCalculatorPage() {

  qs("#app").innerHTML = `
    <div class="page">

      <header class="page-header">

        <p class="eyebrow">UTILITY</p>

        <h1>Equipment Calculator</h1>

        <p>
          Build a six-slot setup and preview calculated stats.
          The current frontend uses demo values only.
        </p>

      </header>


      <section class="calculator">

        <div class="calc-panel">

          <h3>Build Setup</h3>

          <label class="small">
            HERO
          </label>

          <select class="filter-select"
                  id="calcHero"
                  style="width:100%;margin:7px 0 20px">

            ${DEMO_HEROES.map(hero => `
              <option value="${hero.slug}">
                ${escapeHTML(hero.name)}
              </option>
            `).join("")}

          </select>


          <h3>Equipment Slots</h3>

          <div class="slot-grid" id="calcSlots">

            ${state.calculatorSlots
              .map((item, index) =>
                calculatorSlotHTML(item, index)
              )
              .join("")}

          </div>


          <div style="
            display:flex;
            gap:8px;
            margin-top:18px;
            flex-wrap:wrap;
          ">

            <button class="btn btn-secondary"
                    id="resetCalc">
              RESET BUILD
            </button>

            <button class="btn btn-secondary"
                    id="saveCalc">
              SAVE BUILD
            </button>

            <button class="btn btn-secondary"
                    id="shareCalc">
              SHARE
            </button>

          </div>

        </div>


        <div class="calc-panel">

          <h3>Calculated Stats</h3>

          <div class="calc-stat-grid"
               id="calcStats">
          </div>


          <div class="breakdown">

            <h3>Breakdown</h3>

            <div id="calcBreakdown"></div>

          </div>

        </div>

      </section>


      <section class="section">

        <div class="empty-state">

          <div class="empty-icon">⌘</div>

          <h3>Calculation engine architecture</h3>

          <p>
            Base stats → equipment → hero effects →
            item passives → percentage modifiers → final stats.
            Verified calculation order will replace these demo values.
          </p>

        </div>

      </section>

    </div>
  `;


  qs("#calcHero").addEventListener("change", event => {

    state.calculatorHero =
      DEMO_HEROES.find(
        hero => hero.slug === event.target.value
      );

  });


  qs("#resetCalc").addEventListener("click", () => {

    state.calculatorSlots =
      [null, null, null, null, null, null];

    renderCalculatorPage();

    showToast("Build reset.");

  });


  qs("#saveCalc").addEventListener("click", () => {

    localStorage.setItem(
      "hokstat-demo-build",
      JSON.stringify(state.calculatorSlots)
    );

    showToast("Demo build saved locally.");

  });


  qs("#shareCalc").addEventListener("click", async () => {

    const url = window.location.href;

    try {

      await navigator.clipboard.writeText(url);

      showToast("Calculator link copied.");

    } catch {

      showToast("Copy is unavailable on this browser.");

    }

  });


  renderCalculatorStats();
}


function calculatorSlotHTML(item, index) {

  if (!item) {

    return `
      <button class="calc-slot"
              data-slot="${index}">

        <div class="slot-icon">+</div>

        <div class="slot-name">
          EMPTY SLOT ${index + 1}
        </div>

      </button>
    `;

  }


  return `
    <button class="calc-slot filled"
            data-slot="${index}">

      <div class="slot-icon">
        ${escapeHTML(item.icon)}
      </div>

      <div class="slot-name">
        ${escapeHTML(item.name)}
      </div>

    </button>
  `;
}


function renderCalculatorStats() {

  const stats = calculateDemoStats();

  const statBox = qs("#calcStats");

  statBox.innerHTML = Object.entries(stats)
    .map(([name, value]) => `
      <div class="calc-stat">

        <span>${escapeHTML(name)}</span>

        <strong>${escapeHTML(value)}</strong>

      </div>
    `)
    .join("");


  const breakdown =
    qs("#calcBreakdown");

  breakdown.innerHTML = `
    <div class="breakdown-row">
      <span>Base</span>
      <strong>100</strong>
    </div>

    <div class="breakdown-row">
      <span>Equipment</span>
      <strong>+${state.calculatorSlots.filter(Boolean).length} items</strong>
    </div>

    <div class="breakdown-row">
      <span>Hero effects</span>
      <strong>DATA PENDING</strong>
    </div>

    <div class="breakdown-row">
      <span>Item passives</span>
      <strong>DATA PENDING</strong>
    </div>

    <div class="breakdown-row">
      <span>Final</span>
      <strong class="green">DEMO</strong>
    </div>
  `;


  qsa(".calc-slot").forEach(slot => {

    slot.addEventListener("click", () => {

      openItemPicker(
        Number(slot.dataset.slot)
      );

    });

  });

}


function calculateDemoStats() {

  let physicalAttack = 100;
  let hp = 1000;
  let physicalDefense = 50;
  let magicDefense = 50;
  let attackSpeed = 100;
  let movementSpeed = 100;


  state.calculatorSlots
    .filter(Boolean)
    .forEach(item => {

      Object.entries(item.stats)
        .forEach(([stat, value]) => {

          const number =
            parseInt(
              value.replace(/[^\d]/g, ""),
              10
            ) || 0;


          if (stat === "Physical Attack") {
            physicalAttack += number;
          }

          if (stat === "HP") {
            hp += number;
          }

          if (stat === "Physical Defense") {
            physicalDefense += number;
          }

          if (stat === "Magic Defense") {
            magicDefense += number;
          }

          if (stat === "Attack Speed") {
            attackSpeed += number;
          }

          if (stat === "Movement Speed") {
            movementSpeed += number;
          }

        });

    });


  return {
    "Physical Attack": physicalAttack,
    "HP": hp,
    "Physical Defense": physicalDefense,
    "Magic Defense": magicDefense,
    "Attack Speed": `${attackSpeed}%`,
    "Movement Speed": movementSpeed
  };
}


/* =========================================================
   ITEM PICKER
   ========================================================= */

function openItemPicker(slotIndex) {

  const picker = document.createElement("div");

  picker.className = "modal-backdrop open";

  picker.innerHTML = `
    <div class="search-modal">

      <div class="search-modal-head">

        <div>
          <small>EQUIPMENT</small>
          <h2>Select item</h2>
        </div>

        <button class="close-button">
          ×
        </button>

      </div>


      <div class="search-results">

        ${DEMO_ITEMS.map(item => `
          <button
            class="search-result"
            data-item="${item.slug}"
            style="
              width:100%;
              border:0;
              background:transparent;
              text-align:left;
            "
          >

            <div class="search-result-icon">
              ${escapeHTML(item.icon)}
            </div>

            <div>
              <strong>
                ${escapeHTML(item.name)}
              </strong>

              <span>
                ${escapeHTML(item.type)}
              </span>
            </div>

          </button>
        `).join("")}

        <button
          class="search-result"
          data-item="remove"
          style="
            width:100%;
            border:0;
            background:transparent;
            text-align:left;
          "
        >

          <div class="search-result-icon">
            ×
          </div>

          <div>
            <strong>
              Remove item
            </strong>

            <span>
              Leave this slot empty
            </span>
          </div>

        </button>

      </div>

    </div>
  `;


  document.body.appendChild(picker);


  picker
    .querySelector(".close-button")
    .addEventListener("click", () => {
      picker.remove();
    });


  picker.addEventListener("click", event => {

    if (event.target === picker) {
      picker.remove();
    }

  });


  qsa("[data-item]", picker)
    .forEach(button => {

      button.addEventListener("click", () => {

        const slug =
          button.dataset.item;

        if (slug === "remove") {

          state.calculatorSlots[slotIndex] = null;

        } else {

          state.calculatorSlots[slotIndex] =
            DEMO_ITEMS.find(
              item => item.slug === slug
            );

        }

        picker.remove();

        refreshCalculator();

      });

    });
}


function refreshCalculator() {

  const slots = qs("#calcSlots");

  slots.innerHTML =
    state.calculatorSlots
      .map((item, index) =>
        calculatorSlotHTML(item, index)
      )
      .join("");

  renderCalculatorStats();
}


/* =========================================================
   META
   ========================================================= */

function renderMetaPage() {

  qs("#app").innerHTML = `
    <div class="page">

      <header class="page-header">

        <p class="eyebrow">STATISTICS</p>

        <h1>Meta</h1>

        <p>
          Role-based hero statistics will be displayed here
          once reliable verified data is available.
        </p>

      </header>


      <section class="section">

        <div class="status-panel">

          <div class="status-left">

            <div class="status-dot"></div>

            <div>
              <strong>Meta data unavailable</strong>

              <div class="small">
                No fabricated win rate, pick rate or ban rate.
              </div>
            </div>

          </div>

          <span class="tag">
            DATA PENDING
          </span>

        </div>

      </section>


      <section class="section">

        <div class="card">

          <div class="card-body">

            <table class="data-table">

              <thead>
                <tr>
                  <th>Role</th>
                  <th>Hero</th>
                  <th>Win Rate</th>
                  <th>Pick Rate</th>
                  <th>Ban Rate</th>
                  <th>Trend</th>
                </tr>
              </thead>

              <tbody>

                ${[
                  "Clash Lane",
                  "Jungle",
                  "Mid Lane",
                  "Farm Lane",
                  "Roamer"
                ].map(role => `

                  <tr>
                    <td>${role}</td>
                    <td>—</td>
                    <td>—</td>
                    <td>—</td>
                    <td>—</td>
                    <td>
                      <span class="tag">
                        UNAVAILABLE
                      </span>
                    </td>
                  </tr>

                `).join("")}

              </tbody>

            </table>

          </div>

        </div>

      </section>

    </div>
  `;
}


/* =========================================================
   PATCHES
   ========================================================= */

function renderPatchesPage() {

  qs("#app").innerHTML = `
    <div class="page">

      <header class="page-header">

        <p class="eyebrow">VERSION HISTORY</p>

        <h1>Patches</h1>

        <p>
          Current and historical patch records.
          Historical snapshots will remain separate from live data.
        </p>

      </header>


      <section class="section">

        <div class="timeline">

          <div class="timeline-item">

            <div class="timeline-card">

              <div style="
                display:flex;
                justify-content:space-between;
                gap:15px;
              ">

                <div>

                  <p class="eyebrow">
                    CURRENT
                  </p>

                  <h3>
                    Current patch data pending
                  </h3>

                </div>

                <span class="tag green-tag">
                  DATA PENDING
                </span>

              </div>

              <p class="small">
                Official patch notes will populate this section
                after source verification.
              </p>

            </div>

          </div>


          <div class="timeline-item">

            <div class="timeline-card">

              <p class="eyebrow">
                HISTORY
              </p>

              <h3>
                Historical snapshots
              </h3>

              <p class="small">
                Patch history is preserved separately and is
                never treated as current live data.
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  `;
}


/* =========================================================
   PATCH DETAIL
   ========================================================= */

function renderPatchDetail() {

  qs("#app").innerHTML = `
    <div class="page">

      <div style="margin-bottom:18px">
        <a class="small"
           href="./index.html?page=patches">
          ← Back to Patches
        </a>
      </div>


      <header class="page-header">

        <p class="eyebrow">PATCH</p>

        <h1>Patch details</h1>

        <p>
          Official patch content will appear here after verification.
        </p>

      </header>


      <section class="detail-section">

        <div class="empty-state">

          <div class="empty-icon">P</div>

          <h3>Official patch data pending</h3>

          <p>
            No patch values are invented in this frontend.
          </p>

        </div>

      </section>

    </div>
  `;
}


/* =========================================================
   GUIDES
   ========================================================= */

function renderGuidesPage() {

  qs("#app").innerHTML = `
    <div class="page">

      <header class="page-header">

        <p class="eyebrow">KNOWLEDGE</p>

        <h1>Guides</h1>

        <p>
          Beginner, hero, equipment, gameplay and advanced guides.
        </p>

      </header>


      <section class="section">

        <div class="news-grid">

          ${DEMO_GUIDES.map((guide, index) => `

            <a class="card news-card"
               href="./index.html?page=guide&slug=guide-${index}">

              <div class="visual-slot news-thumb">

                <span class="visual-label">
                  ${escapeHTML(guide.category)}
                </span>

              </div>

              <div class="news-content">

                <span class="tag green-tag">
                  ${escapeHTML(guide.category)}
                </span>

                <h3>
                  ${escapeHTML(guide.title)}
                </h3>

                <p>
                  ${escapeHTML(guide.text)}
                </p>

              </div>

            </a>

          `).join("")}

        </div>

      </section>

    </div>
  `;
}


/* =========================================================
   GUIDE DETAIL
   ========================================================= */

function renderGuideDetail() {

  qs("#app").innerHTML = `
    <div class="page">

      <div style="margin-bottom:18px">
        <a class="small"
           href="./index.html?page=guides">
          ← Back to Guides
        </a>
      </div>


      <header class="page-header">

        <p class="eyebrow">GUIDE</p>

        <h1>Guide content</h1>

        <p>
          This is the detail template for HoKStat guides.
        </p>

      </header>


      <section class="detail-section">

        <div class="visual-slot"
             style="height:250px">

          <span class="visual-label">
            ADMIN GUIDE THUMBNAIL SLOT
          </span>

        </div>

      </section>


      <section class="detail-section">

        <p class="eyebrow">
          CONTENT
        </p>

        <h2>Guide body</h2>

        <p class="muted">
          Real guide content will be managed through the
          content system. This frontend intentionally does not
          invent game-specific instructions.
        </p>

      </section>

    </div>
  `;
}


/* =========================================================
   COMMUNITY
   ========================================================= */

function renderCommunityPage() {

  qs("#app").innerHTML = `
    <div class="page">

      <header class="page-header">

        <p class="eyebrow">COMMUNITY</p>

        <h1>Community Q&A</h1>

        <p>
          Questions, answers, discussions, reports and moderation.
        </p>

      </header>


      <section class="section">

        <div class="filter-bar">

          <input
            class="filter-input"
            id="questionSearch"
            placeholder="Search questions..."
          >

          <button class="btn btn-primary"
                  id="askQuestion">
            ASK QUESTION
          </button>

        </div>


        <div class="question-list"
             id="questionList">

          ${DEMO_QUESTIONS
            .map(renderQuestion)
            .join("")}

        </div>

      </section>

    </div>
  `;


  qs("#askQuestion")
    .addEventListener("click", () => {

      showToast(
        "Login + community backend will be connected later."
      );

    });


  qs("#questionSearch")
    .addEventListener("input", event => {

      const query =
        event.target.value.toLowerCase();

      const filtered =
        DEMO_QUESTIONS.filter(question =>
          question.title
            .toLowerCase()
            .includes(query)
        );

      qs("#questionList").innerHTML =
        filtered.map(renderQuestion).join("");

    });
}


function renderQuestion(question) {

  return `
    <article class="question">

      <div class="vote-box">

        <strong>
          ${question.votes}
        </strong>

        <span>
          votes
        </span>

      </div>


      <div>

        <div style="margin-bottom:6px">

          <span class="tag green-tag">
            ${escapeHTML(question.category)}
          </span>

        </div>

        <h3>
          ${escapeHTML(question.title)}
        </h3>

        <p>
          ${escapeHTML(question.text)}
        </p>

      </div>


      <span class="tag">
        ${question.answers} answers
      </span>

    </article>
  `;
}


/* =========================================================
   NEWS
   ========================================================= */

function renderNewsPage() {

  qs("#app").innerHTML = `
    <div class="page">

      <header class="page-header">

        <p class="eyebrow">UPDATES</p>

        <h1>News</h1>

        <p>
          Official announcements, coming soon content and
          clearly labelled unconfirmed information.
        </p>

      </header>


      <section class="section">

        <div class="news-grid">

          ${DEMO_NEWS.map(news => `

            <article class="card news-card">

              <div class="visual-slot news-thumb">

                <span class="visual-label">
                  ${escapeHTML(news.category)}
                </span>

              </div>

              <div class="news-content">

                <span class="tag green-tag">
                  ${escapeHTML(news.category)}
                </span>

                <h3>
                  ${escapeHTML(news.title)}
                </h3>

                <p>
                  ${escapeHTML(news.text)}
                </p>

                <div class="small"
                     style="margin-top:10px">
                  ${escapeHTML(news.date)}
                </div>

              </div>

            </article>

          `).join("")}

        </div>

      </section>

    </div>
  `;
}


/* =========================================================
   ABOUT
   ========================================================= */

function renderAboutPage() {

  qs("#app").innerHTML = `
    <div class="page">

      <header class="page-header">

        <p class="eyebrow">ABOUT</p>

        <h1>HoKStat.gg</h1>

        <p>
          An independent Honor of Kings database, utility and
          community hub.
        </p>

      </header>


      <section class="detail-section">

        <p class="eyebrow">
          PURPOSE
        </p>

        <h2>Built around accurate information.</h2>

        <p class="muted">
          HoKStat.gg is designed to bring heroes, equipment,
          builds, calculator tools, patches, guides, news and
          community features into one system.
        </p>

      </section>


      <section class="detail-section">

        <p class="eyebrow">
          DATA POLICY
        </p>

        <h2>Official-first.</h2>

        <p class="muted">
          Official live data is preferred. Official announcements
          and verified historical information are used when
          appropriate. Unconfirmed information is kept separate.
          If a value cannot be verified, HoKStat should display
          unavailable rather than inventing a number.
        </p>

      </section>


      <section class="detail-section">

        <p class="eyebrow">
          CREDIT
        </p>

        <h2>Honor of Kings</h2>

        <p class="muted">
          Honor of Kings and related intellectual property belong
          to their respective owners. HoKStat.gg is an independent
          project and is not presented as an official Tencent site.
        </p>

      </section>

    </div>
  `;
}


/* =========================================================
   DATA
   ========================================================= */

function renderDataPage() {

  qs("#app").innerHTML = `
    <div class="page">

      <header class="page-header">

        <p class="eyebrow">TRANSPARENCY</p>

        <h1>Data</h1>

        <p>
          Data sources, versions, verification status and update
          methodology.
        </p>

      </header>


      <section class="section">

        <div class="card">

          <div class="card-body">

            <table class="data-table">

              <tbody>

                <tr>
                  <td>Live Data</td>
                  <td>
                    <span class="tag">
                      PENDING
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>Official Source</td>
                  <td>
                    <span class="tag">
                      PENDING
                    </span>
                  </td>
                </tr>

                <tr>
                  <td>Data Version</td>
                  <td>—</td>
                </tr>

                <tr>
                  <td>Last Updated</td>
                  <td>—</td>
                </tr>

                <tr>
                  <td>Verification</td>
                  <td>
                    <span class="tag green-tag">
                      OFFICIAL-FIRST
                    </span>
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </section>


      <section class="section">

        <div class="feature-strip">

          <div class="feature-card">

            <p class="eyebrow">
              SOURCE
            </p>

            <h3>
              Official Live Data
            </h3>

            <p>
              Highest priority for current game data.
            </p>

          </div>


          <div class="feature-card">

            <p class="eyebrow">
              VALIDATION
            </p>

            <h3>
              Automated checks
            </h3>

            <p>
              Structure, sanity, references and anomalies.
            </p>

          </div>


          <div class="feature-card">

            <p class="eyebrow">
              HISTORY
            </p>

            <h3>
              Change logs
            </h3>

            <p>
              Changes are recorded rather than silently overwritten.
            </p>

          </div>

        </div>

      </section>

    </div>
  `;
     }
