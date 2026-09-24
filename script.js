/* =========================================================
   HoKStat.gg
   Frontend prototype
   LOCAL DEMO DATA ONLY
   Official database/API will replace this layer later.
   ========================================================= */

"use strict";

/* =========================================================
   DEMO DATA
   ========================================================= */

const HEROES = [
  {
    id: "demo-hero-1",
    slug: "dun",
    name: "Dun",
    role: "Clash Lane",
    lane: "Clash",
    difficulty: "Medium",
    mark: "D",
    bio: "LOCAL DEMO record. Replace this record with verified official live data through the HoKStat data API.",
    status: "DATA PENDING"
  },
  {
    id: "demo-hero-2",
    slug: "demo-assassin",
    name: "Demo Assassin",
    role: "Jungle",
    lane: "Jungle",
    difficulty: "Hard",
    mark: "A",
    bio: "LOCAL DEMO record used only to demonstrate the visual hero database layout.",
    status: "DATA PENDING"
  },
  {
    id: "demo-hero-3",
    slug: "demo-mage",
    name: "Demo Mage",
    role: "Mid Lane",
    lane: "Mid",
    difficulty: "Medium",
    mark: "M",
    bio: "LOCAL DEMO record used only to demonstrate the visual hero database layout.",
    status: "DATA PENDING"
  },
  {
    id: "demo-hero-4",
    slug: "demo-tank",
    name: "Demo Tank",
    role: "Roamer",
    lane: "Roam",
    difficulty: "Easy",
    mark: "T",
    bio: "LOCAL DEMO record used only to demonstrate the visual hero database layout.",
    status: "DATA PENDING"
  }
];

const ITEMS = [
  {
    id: "demo-item-1",
    slug: "demo-blade",
    name: "Demo Blade",
    type: "Attack",
    price: 1000,
    mark: "ATK",
    stats: ["Attack +80"],
    passive: "LOCAL DEMO passive."
  },
  {
    id: "demo-item-2",
    slug: "demo-armor",
    name: "Demo Armor",
    type: "Defense",
    price: 900,
    mark: "DEF",
    stats: ["Defense +100", "HP +500"],
    passive: "LOCAL DEMO passive."
  },
  {
    id: "demo-item-3",
    slug: "demo-magic",
    name: "Demo Tome",
    type: "Magic",
    price: 1200,
    mark: "MAG",
    stats: ["Magic Attack +90"],
    passive: "LOCAL DEMO passive."
  },
  {
    id: "demo-item-4",
    slug: "demo-boots",
    name: "Demo Boots",
    type: "Movement",
    price: 700,
    mark: "SPD",
    stats: ["Movement +60"],
    passive: "LOCAL DEMO passive."
  },
  {
    id: "demo-item-5",
    slug: "demo-crit",
    name: "Demo Edge",
    type: "Attack",
    price: 1400,
    mark: "CRT",
    stats: ["Attack +45", "Crit +15%"],
    passive: "LOCAL DEMO passive."
  },
  {
    id: "demo-item-6",
    slug: "demo-resist",
    name: "Demo Barrier",
    type: "Defense",
    price: 1300,
    mark: "RES",
    stats: ["Magic Defense +90"],
    passive: "LOCAL DEMO passive."
  }
];

const BUILDS = [
  {
    id: "demo-build-1",
    slug: "demo-balanced-build",
    name: "Balanced Demo Build",
    hero: "Dun",
    type: "Recommended",
    description: "LOCAL DEMO build. Replace with verified build data.",
    items: [
      "demo-item-1",
      "demo-item-2",
      "demo-item-4",
      "demo-item-5",
      "demo-item-6",
      "demo-item-3"
    ]
  },
  {
    id: "demo-build-2",
    slug: "demo-tank-build",
    name: "Tank Demo Build",
    hero: "Demo Tank",
    type: "Recommended",
    description: "LOCAL DEMO build for testing the build UI.",
    items: [
      "demo-item-2",
      "demo-item-6",
      "demo-item-4",
      "demo-item-2",
      "demo-item-6",
      "demo-item-1"
    ]
  },
  {
    id: "demo-build-3",
    slug: "demo-damage-build",
    name: "Damage Demo Build",
    hero: "Demo Assassin",
    type: "Recommended",
    description: "LOCAL DEMO build for testing the build UI.",
    items: [
      "demo-item-1",
      "demo-item-5",
      "demo-item-4",
      "demo-item-1",
      "demo-item-5",
      "demo-item-3"
    ]
  }
];

const SLIDES = [
  {
    type: "HERO",
    title: "Heroes",
    highlight: "Database",
    description:
      "Explore hero profiles, skills, stats, builds, skins and patch history. Official data integration ready.",
    action: "EXPLORE HEROES",
    page: "heroes",
    art: "hero"
  },
  {
    type: "BUILD",
    title: "Build",
    highlight: "Engine",
    description:
      "Build around six equipment slots and inspect the resulting stat structure.",
    action: "VIEW BUILDS",
    page: "builds",
    art: "build"
  },
  {
    type: "EQUIPMENT",
    title: "Equipment",
    highlight: "Database",
    description:
      "Search equipment, inspect stats, passives, build paths and historical changes.",
    action: "EXPLORE EQUIPMENT",
    page: "equipment",
    art: "equipment"
  },
  {
    type: "PATCH",
    title: "Patch",
    highlight: "History",
    description:
      "Track verified changes while preserving historical snapshots instead of overwriting data.",
    action: "VIEW PATCHES",
    page: "patches",
    art: "patch"
  },
  {
    type: "GUIDE",
    title: "Guides",
    highlight: "Library",
    description:
      "Quick hero explanations stay concise. Deeper strategy belongs in the guide system.",
    action: "READ GUIDES",
    page: "guides",
    art: "guide"
  },
  {
    type: "NEWS",
    title: "News",
    highlight: "Updates",
    description:
      "Official announcements, coming-soon content and clearly separated unconfirmed information.",
    action: "VIEW NEWS",
    page: "news",
    art: "news"
  }
];

/* =========================================================
   APP STATE
   ========================================================= */

const state = {
  sliderIndex: 0,
  sliderTimer: null,
  sliderPaused: false,
  calculatorItems: [null, null, null, null, null, null],
  selectedHero: "Dun"
};

/* =========================================================
   DOM HELPERS
   ========================================================= */

const app = document.getElementById("app");
const toastElement = document.getElementById("toast");

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function money(value) {
  return Number(value || 0).toLocaleString("en-US");
}

function getParams() {
  return new URLSearchParams(window.location.search);
}

function getPage() {
  return getParams().get("page") || "home";
}

function go(page, extra = {}) {
  const params = new URLSearchParams();
  params.set("page", page);

  Object.entries(extra).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  });

  window.location.href = `index.html?${params.toString()}`;
}

function showToast(message) {
  if (!toastElement) return;

  toastElement.textContent = message;
  toastElement.classList.add("show");

  window.clearTimeout(showToast.timer);

  showToast.timer = window.setTimeout(() => {
    toastElement.classList.remove("show");
  }, 2400);
}

function heroBySlug(slug) {
  return HEROES.find(hero => hero.slug === slug);
}

function itemBySlug(slug) {
  return ITEMS.find(item => item.slug === slug);
}

function itemById(id) {
  return ITEMS.find(item => item.id === id);
}

function buildBySlug(slug) {
  return BUILDS.find(build => build.slug === slug);
}

/* =========================================================
   GENERIC COMPONENTS
   ========================================================= */

function pageHeader(eyebrow, title, subtitle) {
  return `
    <header class="page-header">
      <div class="eyebrow">${esc(eyebrow)}</div>
      <h1 class="page-title">${esc(title)}</h1>
      <p class="page-subtitle">${esc(subtitle)}</p>
    </header>
  `;
}

function pendingPanel(title = "Official data not connected") {
  return `
    <div class="empty-state">
      <div class="empty-icon">✓</div>
      <h3>${esc(title)}</h3>
      <p>
        This interface is ready for the official HoKStat data/API layer.
        No unverified live values are being fabricated here.
      </p>
    </div>
  `;
}

function itemIcon(item) {
  if (!item) {
    return `
      <div class="item-icon">+</div>
    `;
  }

  return `
    <div class="item-icon">${esc(item.mark)}</div>
  `;
}

/* =========================================================
   HOME
   ========================================================= */

function renderHome() {
  return `
    <div class="page">

      <section
        class="home-hero"
        id="homeHero"
        aria-label="HoKStat featured content"
      >

        <div class="home-search">
          <div class="search-box">
            <input
              id="homeSearch"
              type="search"
              autocomplete="off"
              placeholder="Search heroes, equipment, builds..."
              aria-label="Search HoKStat.gg"
            >
            <span class="search-icon">⌕</span>
          </div>
        </div>

        ${SLIDES.map((slide, index) => `
          <article
            class="cinema-slide ${index === 0 ? "active" : ""}"
            data-slide="${index}"
          >

            <div class="cinema-art" data-art="${esc(slide.art)}">
              <div class="art-label">ARTWORK SLOT · ADMIN READY</div>
            </div>

            <div class="cinema-copy">
              <div class="slide-type">
                ${esc(slide.type)}
              </div>

              <h1 class="slide-title">
                ${esc(slide.title)}
                <span>${esc(slide.highlight)}</span>
              </h1>

              <p class="slide-description">
                ${esc(slide.description)}
              </p>

              <div class="slide-actions">
                <button
                  class="btn btn-primary slide-action"
                  type="button"
                  data-page="${esc(slide.page)}"
                >
                  ${esc(slide.action)}
                </button>

                <button
                  class="btn btn-ghost"
                  type="button"
                  id="pauseSlider"
                >
                  Pause
                </button>
              </div>
            </div>

          </article>
        `).join("")}

        <div class="cinema-controls">

          <button
            class="slide-arrow"
            id="slidePrev"
            type="button"
            aria-label="Previous slide"
          >
            ←
          </button>

          <div class="slider-dots" aria-label="Slide selection">
            ${SLIDES.map((_, index) => `
              <button
                class="slider-dot ${index === 0 ? "active" : ""}"
                data-dot="${index}"
                type="button"
                aria-label="Go to slide ${index + 1}"
              ></button>
            `).join("")}
          </div>

          <button
            class="slide-arrow"
            id="slideNext"
            type="button"
            aria-label="Next slide"
          >
            →
          </button>

        </div>

      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">Explore HoKStat</h2>
            <p class="section-desc">
              The main tools and databases in one place.
            </p>
          </div>
        </div>

        <div class="explore-grid">
          ${exploreCard("H", "Heroes", "Hero database, skills and stats", "heroes")}
          ${exploreCard("E", "Equipment", "Items, passives and build paths", "equipment")}
          ${exploreCard("B", "Builds", "Recommended and community builds", "builds")}
          ${exploreCard("C", "Calculator", "Six-slot equipment calculator", "calculator")}
          ${exploreCard("M", "Meta", "Verified regional meta data", "meta")}
          ${exploreCard("P", "Patches", "Patch notes and historical changes", "patches")}
          ${exploreCard("G", "Guides", "Beginner to advanced guides", "guides")}
          ${exploreCard("Q", "Community", "Questions, answers and discussion", "community")}
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">Featured</h2>
            <p class="section-desc">
              Visual content slots ready for the homepage engine.
            </p>
          </div>
          <a class="text-link" href="index.html?page=news">View news →</a>
        </div>

        <div class="card-grid">
          ${featuredCard("NEW HERO", "Hero Spotlight", "Hero artwork and verified profile data will appear here.", "heroes")}
          ${featuredCard("BUILD", "Build Spotlight", "Six equipment slots with calculated stats.", "builds")}
          ${featuredCard("UPDATE", "Official Patch Notes", "Official source, version and verification status.", "patches")}
        </div>
      </section>

      <section class="section">
        <div class="status-panel">
          <div class="status-block">
            <div class="status-label">Database</div>
            <div class="status-value green">Architecture Ready</div>
          </div>

          <div class="status-block">
            <div class="status-label">Live data</div>
            <div class="status-value">Pending API connection</div>
          </div>

          <div class="status-block">
            <div class="status-label">Verification</div>
            <div class="status-value">Official-source workflow</div>
          </div>
        </div>
      </section>

    </div>
  `;
}

function exploreCard(icon, title, description, page) {
  return `
    <a class="explore-card" href="index.html?page=${esc(page)}">
      <div class="explore-icon">${esc(icon)}</div>
      <h3>${esc(title)}</h3>
      <p>${esc(description)}</p>
    </a>
  `;
}

function featuredCard(type, title, description, page) {
  return `
    <a href="index.html?page=${esc(page)}" class="card card-hover">
      <div class="media-art" style="height:130px;">
        <div class="art-label">${esc(type)} · ART SLOT</div>
      </div>
      <div style="padding:16px;">
        <div class="eyebrow">${esc(type)}</div>
        <h3 style="margin-bottom:6px;font-size:15px;">${esc(title)}</h3>
        <p style="margin:0;color:var(--muted);font-size:11px;">
          ${esc(description)}
        </p>
      </div>
    </a>
  `;
}

/* =========================================================
   HEROES
   ========================================================= */

function renderHeroes() {
  return `
    <div class="page">
      ${pageHeader(
        "Database",
        "Heroes",
        "Browse hero profiles, roles, lanes and verified game data."
      )}

      <div class="filter-bar">
        <input
          class="input"
          id="heroSearch"
          type="search"
          placeholder="Search heroes..."
        >

        <select class="select" id="heroRole">
          <option value="">All roles</option>
          <option value="Clash">Clash</option>
          <option value="Jungle">Jungle</option>
          <option value="Mid">Mid</option>
          <option value="Roam">Roam</option>
        </select>

        <select class="select" id="heroDifficulty">
          <option value="">All difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div class="hero-grid" id="heroGrid">
        ${HEROES.map(renderHeroCard).join("")}
      </div>
    </div>
  `;
}

function renderHeroCard(hero) {
  return `
    <a
      class="hero-card"
      href="index.html?page=hero&slug=${encodeURIComponent(hero.slug)}"
    >

      <div class="hero-card-art media-art">
        <div class="hero-mark">${esc(hero.mark)}</div>
        <div class="art-label">ADMIN ART SLOT</div>
      </div>

      <div class="hero-card-body">
        <h3 class="hero-card-name">${esc(hero.name)}</h3>
        <div class="hero-card-role">${esc(hero.role)}</div>

        <div class="hero-tags">
          <span class="tag">${esc(hero.lane)}</span>
          <span class="tag">${esc(hero.difficulty)}</span>
        </div>

        <div class="data-pending">
          <span>●</span>
          ${esc(hero.status)}
        </div>
      </div>

    </a>
  `;
}

/* =========================================================
   HERO DETAIL
   ========================================================= */

function renderHeroDetail() {
  const slug = getParams().get("slug");
  const hero = heroBySlug(slug);

  if (!hero) {
    return `
      <div class="page">
        ${pageHeader("Heroes", "Hero not found", "The requested hero record does not exist.")}
        ${pendingPanel("Hero record unavailable")}
      </div>
    `;
  }

  return `
    <div class="page">

      <a
        class="text-link"
        href="index.html?page=heroes"
        style="display:inline-block;margin-bottom:16px;"
      >
        ← Back to heroes
      </a>

      <section class="detail-hero">

        <div class="cinema-art">
          <div class="art-label">HERO ARTWORK · ADMIN READY</div>
        </div>

        <div class="detail-copy">
          <div class="detail-role">${esc(hero.role)} · ${esc(hero.lane)}</div>
          <h1 class="detail-name">${esc(hero.name)}</h1>

          <div class="hero-tags">
            <span class="tag tag-green">${esc(hero.difficulty)}</span>
            <span class="tag">DATA PENDING</span>
          </div>

          <p class="detail-bio">${esc(hero.bio)}</p>
        </div>

      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">How to Play</h2>
            <p class="section-desc">Short practical hero overview.</p>
          </div>
        </div>

        <div class="panel">
          <p class="muted small">
            Official passive and skill information will appear here after
            verified live data is connected. Deeper strategy belongs in Guides.
          </p>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">Skills</h2>
            <p class="section-desc">Skill information is sourced from the verified hero dataset.</p>
          </div>
        </div>

        <div class="skill-grid">
          ${["Passive", "Skill 1", "Skill 2", "Ultimate"].map((name, i) => `
            <div class="card skill-card">
              <div class="skill-icon">${i === 0 ? "P" : i}</div>
              <h3>${name}</h3>
              <p>DATA PENDING — official skill description will be inserted here.</p>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="section">
        <div class="two-column">

          <div class="panel">
            <h2 class="panel-title">Base Stats</h2>

            ${[
              ["Health", 72, "DATA PENDING"],
              ["Physical Attack", 61, "DATA PENDING"],
              ["Physical Defense", 58, "DATA PENDING"],
              ["Magic Defense", 54, "DATA PENDING"],
              ["Attack Speed", 48, "DATA PENDING"],
              ["Movement Speed", 63, "DATA PENDING"]
            ].map(stat => `
              <div class="stat-row">
                <span class="stat-name">${stat[0]}</span>
                <div class="stat-bar">
                  <div class="stat-fill" style="--value:${stat[1]}%"></div>
                </div>
                <span class="stat-number">${stat[2]}</span>
              </div>
            `).join("")}

            <div class="data-pending">
              DEMO VISUAL ONLY — NOT OFFICIAL STAT VALUES
            </div>
          </div>

          <div class="panel">
            <h2 class="panel-title">Data Status</h2>

            <div class="source-list">
              <div class="source-row">
                <span>Live data</span>
                <span class="source-status">PENDING</span>
              </div>

              <div class="source-row">
                <span>Official source</span>
                <span class="source-status">READY</span>
              </div>

              <div class="source-row">
                <span>Patch history</span>
                <span class="source-status">READY</span>
              </div>

              <div class="source-row">
                <span>Calculator</span>
                <span class="source-status">READY</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">Recommended Builds</h2>
          </div>

          <a class="text-link" href="index.html?page=builds">
            View all →
          </a>
        </div>

        <div class="build-grid">
          ${BUILDS.filter(build => build.hero === hero.name).map(renderBuildCard).join("")}
        </div>

        ${BUILDS.filter(build => build.hero === hero.name).length === 0
          ? pendingPanel("Build data pending")
          : ""}
      </section>

      <section class="section">
        <div class="two-column">

          <div class="panel">
            <h2 class="panel-title">Counters</h2>
            ${pendingPanel("Verified counter data pending")}
          </div>

          <div class="panel">
            <h2 class="panel-title">Synergies</h2>
            ${pendingPanel("Verified synergy data pending")}
          </div>

        </div>
      </section>

    </div>
  `;
}

/* =========================================================
   EQUIPMENT
   ========================================================= */

function renderEquipment() {
  return `
    <div class="page">

      ${pageHeader(
        "Database",
        "Equipment",
        "Inspect equipment stats, passives and build paths."
      )}

      <div class="filter-bar">

        <input
          class="input"
          id="itemSearch"
          type="search"
          placeholder="Search equipment..."
        >

        <select class="select" id="itemType">
          <option value="">All types</option>
          <option value="Attack">Attack</option>
          <option value="Defense">Defense</option>
          <option value="Magic">Magic</option>
          <option value="Movement">Movement</option>
        </select>

      </div>

      <div class="item-grid" id="itemGrid">
        ${ITEMS.map(renderItemCard).join("")}
      </div>

    </div>
  `;
}

function renderItemCard(item) {
  return `
    <a
      class="item-card"
      href="index.html?page=item&slug=${encodeURIComponent(item.slug)}"
    >

      <div class="item-top">
        ${itemIcon(item)}

        <div style="min-width:0;">
          <h3 class="item-name">${esc(item.name)}</h3>
          <div class="item-type">${esc(item.type)}</div>
        </div>

        <div class="item-price">${money(item.price)}</div>
      </div>

      <div class="item-stats">
        ${item.stats.map(stat => `
          <span class="stat-chip">${esc(stat)}</span>
        `).join("")}
      </div>

      <div class="item-passive">
        ${esc(item.passive)}
      </div>

    </a>
  `;
}

/* =========================================================
   ITEM DETAIL
   ========================================================= */

function renderItemDetail() {
  const slug = getParams().get("slug");
  const item = itemBySlug(slug);

  if (!item) {
    return `
      <div class="page">
        ${pageHeader("Equipment", "Equipment not found", "The requested equipment record does not exist.")}
        ${pendingPanel()}
      </div>
    `;
  }

  return `
    <div class="page">

      <a
        class="text-link"
        href="index.html?page=equipment"
        style="display:inline-block;margin-bottom:16px;"
      >
        ← Back to equipment
      </a>

      <section class="detail-hero">

        <div class="detail-copy">
          <div class="detail-role">${esc(item.type)}</div>

          <div style="display:flex;align-items:center;gap:16px;margin:12px 0 8px;">
            ${itemIcon(item)}
            <h1 class="detail-name" style="margin:0;">
              ${esc(item.name)}
            </h1>
          </div>

          <div class="hero-tags">
            <span class="tag tag-green">${money(item.price)} Gold</span>
            <span class="tag">DATA PENDING</span>
          </div>

          <p class="detail-bio">
            ${esc(item.passive)}
          </p>
        </div>

      </section>

      <section class="section">
        <div class="two-column">

          <div class="panel">
            <h2 class="panel-title">Stats</h2>

            <div class="item-stats">
              ${item.stats.map(stat => `
                <span class="stat-chip">${esc(stat)}</span>
              `).join("")}
            </div>
          </div>

          <div class="panel">
            <h2 class="panel-title">Build Path</h2>
            ${pendingPanel("Verified component data pending")}
          </div>

        </div>
      </section>

      <section class="section">
        <div class="panel">
          <h2 class="panel-title">Passive</h2>
          <p class="muted small">
            ${esc(item.passive)}
          </p>
        </div>
      </section>

      <section class="section">
        <div class="panel">
          <h2 class="panel-title">Patch History</h2>
          ${pendingPanel("Official patch history pending")}
        </div>
      </section>

    </div>
  `;
}

/* =========================================================
   BUILDS
   ========================================================= */

function renderBuilds() {
  return `
    <div class="page">

      ${pageHeader(
        "Build Engine",
        "Builds",
        "Recommended builds and future community builds, connected to the calculator."
      )}

      <div class="filter-bar">
        <input
          class="input"
          id="buildSearch"
          type="search"
          placeholder="Search builds..."
        >

        <select class="select" id="buildType">
          <option value="">All builds</option>
          <option value="Recommended">Recommended</option>
          <option value="Community">Community</option>
        </select>
      </div>

      <div class="build-grid" id="buildGrid">
        ${BUILDS.map(renderBuildCard).join("")}
      </div>

    </div>
  `;
}

function renderBuildCard(build) {
  return `
    <a
      class="card card-hover build-card"
      href="index.html?page=build&slug=${encodeURIComponent(build.slug)}"
    >

      <div class="build-head">
        <div>
          <h3 class="build-name">${esc(build.name)}</h3>
          <div class="build-hero">${esc(build.hero)}</div>
        </div>

        <span class="tag tag-green">${esc(build.type)}</span>
      </div>

      <div class="build-slots">
        ${build.items.map(id => {
          const item = itemById(id);
          return item
            ? `<div class="build-slot" title="${esc(item.name)}">${esc(item.mark)}</div>`
            : `<div class="build-slot">—</div>`;
        }).join("")}
      </div>

      <p class="build-description">
        ${esc(build.description)}
      </p>

      <div class="build-stats">
        <div class="build-stat">
          <strong>—</strong>
          <span>Attack</span>
        </div>
        <div class="build-stat">
          <strong>—</strong>
          <span>Defense</span>
        </div>
        <div class="build-stat">
          <strong>—</strong>
          <span>Speed</span>
        </div>
      </div>

      <div class="data-pending">
        LOCAL DEMO BUILD
      </div>

    </a>
  `;
}

/* =========================================================
   BUILD DETAIL
   ========================================================= */

function renderBuildDetail() {
  const slug = getParams().get("slug");
  const build = buildBySlug(slug);

  if (!build) {
    return `
      <div class="page">
        ${pageHeader("Builds", "Build not found", "The requested build does not exist.")}
        ${pendingPanel()}
      </div>
    `;
  }

  return `
    <div class="page">

      <a
        class="text-link"
        href="index.html?page=builds"
        style="display:inline-block;margin-bottom:16px;"
      >
        ← Back to builds
      </a>

      <section class="detail-hero">
        <div class="detail-copy">
          <div class="detail-role">${esc(build.type)} · LOCAL DEMO</div>
          <h1 class="detail-name">${esc(build.name)}</h1>

          <div class="hero-tags">
            <span class="tag tag-green">${esc(build.hero)}</span>
            <span class="tag">6 ITEMS</span>
          </div>

          <p class="detail-bio">
            ${esc(build.description)}
          </p>

          <div style="margin-top:20px;">
            <button
              class="btn btn-primary"
              type="button"
              id="tryBuild"
            >
              TRY THIS BUILD
            </button>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="panel">

          <div class="section-head" style="margin-bottom:12px;">
            <div>
              <h2 class="section-title">Equipment</h2>
              <p class="section-desc">Six equipment slots.</p>
            </div>
          </div>

          <div class="build-slots">
            ${build.items.map(id => {
              const item = itemById(id);

              return item
                ? `
                  <a
                    class="build-slot"
                    href="index.html?page=item&slug=${encodeURIComponent(item.slug)}"
                    title="${esc(item.name)}"
                  >
                    ${esc(item.mark)}
                  </a>
                `
                : `<div class="build-slot">—</div>`;
            }).join("")}
          </div>

        </div>
      </section>

      <section class="section">
        <div class="two-column">

          <div class="panel">
            <h2 class="panel-title">Build Stats</h2>
            ${pendingPanel("Verified calculation data pending")}
          </div>

          <div class="panel">
            <h2 class="panel-title">Passive Effects</h2>
            ${pendingPanel("Passive calculation pending")}
          </div>

        </div>
      </section>

    </div>
  `;
}

/* =========================================================
   CALCULATOR
   ========================================================= */

function renderCalculator() {
  return `
    <div class="page">

      ${pageHeader(
        "Tool",
        "Equipment Calculator",
        "Build six equipment slots and calculate the resulting stats."
      )}

      <div class="calculator-layout">

        <div class="panel">

          <div class="status-label">Hero</div>

          <select class="select" id="calcHero" style="width:100%;">
            ${HEROES.map(hero => `
              <option value="${esc(hero.name)}">
                ${esc(hero.name)}
              </option>
            `).join("")}
          </select>

          <div class="section-head" style="margin-top:25px;margin-bottom:0;">
            <div>
              <h2 class="panel-title" style="margin:0;">
                Equipment
              </h2>
              <p class="section-desc">
                Click a slot to cycle demo equipment.
              </p>
            </div>
          </div>

          <div class="slot-picker" id="calcSlots">
            ${renderCalcSlots()}
          </div>

          <div style="display:flex;gap:8px;margin-top:16px;">
            <button class="btn" id="resetCalc" type="button">
              Reset
            </button>

            <button class="btn btn-primary" id="saveCalc" type="button">
              Save Build
            </button>

            <button class="btn" id="shareCalc" type="button">
              Share
            </button>
          </div>

        </div>

        <div class="panel">

          <div class="eyebrow">Calculator Result</div>

          <h2 class="section-title" style="margin-bottom:6px;">
            Final Stats
          </h2>

          <p class="section-desc" style="margin-bottom:18px;">
            LOCAL DEMO CALCULATION — not official live data.
          </p>

          <div class="calc-results" id="calcResults">
            ${renderCalcResults()}
          </div>

          <div style="margin-top:20px;">
            <h3 class="panel-title">Calculation Breakdown</h3>

            <div class="source-list">
              <div class="source-row">
                <span>Base stats</span>
                <span class="source-status">READY</span>
              </div>

              <div class="source-row">
                <span>Equipment stats</span>
                <span class="source-status">DEMO</span>
              </div>

              <div class="source-row">
                <span>Hero effects</span>
                <span class="source-status">PENDING</span>
              </div>

              <div class="source-row">
                <span>Item passives</span>
                <span class="source-status">PENDING</span>
              </div>

              <div class="source-row">
                <span>Percentage modifiers</span>
                <span class="source-status">PENDING</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;
}

function renderCalcSlots() {
  return state.calculatorItems.map((itemId, index) => {
    const item = itemById(itemId);

    return `
      <button
        class="calc-slot ${item ? "filled" : ""}"
        data-calc-slot="${index}"
        type="button"
        aria-label="Equipment slot ${index + 1}"
      >
        ${itemIcon(item)}
        <span>${item ? esc(item.name) : `Slot ${index + 1}`}</span>
      </button>
    `;
  }).join("");
}

function calculateDemoStats() {
  let attack = 100;
  let defense = 50;
  let magic = 50;
  let hp = 1000;
  let speed = 0;

  state.calculatorItems.forEach(id => {
    const item = itemById(id);

    if (!item) return;

    item.stats.forEach(stat => {
      const text = stat.toLowerCase();

      if (text.includes("attack +")) {
        const value = parseInt(text.split("+")[1], 10);
        if (!Number.isNaN(value)) attack += value;
      }

      if (text.includes("defense +")) {
        const value = parseInt(text.split("+")[1], 10);
        if (!Number.isNaN(value)) defense += value;
      }

      if (text.includes("magic defense +")) {
        const value = parseInt(text.split("+")[1], 10);
        if (!Number.isNaN(value)) magic += value;
      }

      if (text.includes("hp +")) {
        const value = parseInt(text.split("+")[1], 10);
        if (!Number.isNaN(value)) hp += value;
      }

      if (text.includes("movement +")) {
        const value = parseInt(text.split("+")[1], 10);
        if (!Number.isNaN(value)) speed += value;
      }
    });
  });

  return {
    hp,
    attack,
    defense,
    magic,
    speed,
    crit: state.calculatorItems.includes("demo-item-5") ? 15 : 0
  };
}

function renderCalcResults() {
  const stats = calculateDemoStats();

  return `
    ${calcStat("HP", stats.hp)}
    ${calcStat("Physical Attack", stats.attack)}
    ${calcStat("Physical Defense", stats.defense)}
    ${calcStat("Magic Defense", stats.magic)}
    ${calcStat("Movement", stats.speed)}
    ${calcStat("Crit Rate", `${stats.crit}%`)}
  `;
}

function calcStat(name, value) {
  return `
    <div class="calc-stat">
      <span>${esc(name)}</span>
      <strong>${esc(value)}</strong>
    </div>
  `;
}

function updateCalculatorUI() {
  const slots = document.getElementById("calcSlots");
  const results = document.getElementById("calcResults");

  if (slots) {
    slots.innerHTML = renderCalcSlots();
  }

  if (results) {
    results.innerHTML = renderCalcResults();
  }

  bindCalculatorSlots();
}

function bindCalculatorSlots() {
  document.querySelectorAll("[data-calc-slot]").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.calcSlot);

      const current = state.calculatorItems[index];
      const currentIndex = current
        ? ITEMS.findIndex(item => item.id === current)
        : -1;

      const nextIndex = currentIndex + 1;

      state.calculatorItems[index] =
        nextIndex >= ITEMS.length
          ? null
          : ITEMS[nextIndex].id;

      updateCalculatorUI();
    });
  });
}

/* =========================================================
   META
   ========================================================= */

function renderMeta() {
  return `
    <div class="page">

      ${pageHeader(
        "Meta",
        "Meta",
        "Regional meta statistics are displayed only when verified data is available."
      )}

      <div class="filter-bar">
        <select class="select">
          <option>International</option>
        </select>

        <select class="select">
          <option>All roles</option>
          <option>Clash Lane</option>
          <option>Jungle</option>
          <option>Mid Lane</option>
          <option>Farm Lane</option>
          <option>Roamer</option>
        </select>
      </div>

      ${pendingPanel("Verified meta data unavailable")}

    </div>
  `;
}

/* =========================================================
   PATCHES
   ========================================================= */

function renderPatches() {
  return `
    <div class="page">

      ${pageHeader(
        "History",
        "Patches",
        "Track verified game changes while preserving historical data."
      )}

      <div class="timeline">

        <div class="timeline-item">
          <div class="timeline-version">CURRENT PATCH</div>
          <h3 class="timeline-title">Official patch data pending</h3>
          <p class="timeline-text">
            No current patch number is fabricated in the frontend.
            The official source will populate this automatically.
          </p>
        </div>

        <div class="timeline-item">
          <div class="timeline-version">HISTORY</div>
          <h3 class="timeline-title">Historical snapshots ready</h3>
          <p class="timeline-text">
            Hero and equipment changes will retain old and new values.
          </p>
        </div>

        <div class="timeline-item">
          <div class="timeline-version">SYSTEM</div>
          <h3 class="timeline-title">Change verification pipeline</h3>
          <p class="timeline-text">
            Official source → detection → validation → database → change log.
          </p>
        </div>

      </div>

    </div>
  `;
}

/* =========================================================
   NEWS
   ========================================================= */

function renderNews() {
  const news = [
    {
      type: "OFFICIAL",
      title: "Official news feed ready",
      text: "Verified announcements will appear here.",
      art: "OFFICIAL"
    },
    {
      type: "COMING SOON",
      title: "Coming-soon content",
      text: "Only officially announced future content belongs here.",
      art: "FUTURE"
    },
    {
      type: "UNCONFIRMED",
      title: "Leaks & rumors stay separated",
      text: "Unconfirmed information will never enter the live database.",
      art: "UNCONFIRMED"
    }
  ];

  return `
    <div class="page">

      ${pageHeader(
        "Updates",
        "News",
        "Official news, coming-soon announcements and clearly marked unconfirmed information."
      )}

      <div class="news-grid">

        ${news.map(article => `
          <article class="card card-hover news-card">

            <div class="news-art media-art">
              <div class="art-label">${esc(article.art)} · ART SLOT</div>
            </div>

            <div class="news-body">

              <div class="news-meta">
                <span class="tag ${article.type === "OFFICIAL" ? "tag-green" : ""}">
                  ${esc(article.type)}
                </span>

                <span class="muted tiny">
                  DATA PENDING
                </span>
              </div>

              <h3 class="news-title">
                ${esc(article.title)}
              </h3>

              <p class="news-summary">
                ${esc(article.text)}
              </p>

            </div>

          </article>
        `).join("")}

      </div>

    </div>
  `;
}

/* =========================================================
   GUIDES
   ========================================================= */

function renderGuides() {
  return `
    <div class="page">

      ${pageHeader(
        "Library",
        "Guides",
        "From beginner explanations to deeper gameplay strategy."
      )}

      <div class="card-grid">

        ${guideCard("Hero Guides", "Quick hero identity, skills and practical usage.", "heroes")}
        ${guideCard("Beginner Guides", "Core systems and fundamentals.", "guides")}
        ${guideCard("Equipment Guides", "Understand item stats and passives.", "equipment")}
        ${guideCard("Gameplay", "Laning, rotations and teamfights.", "guides")}
        ${guideCard("Advanced", "Deeper strategic concepts.", "guides")}
        ${guideCard("Build Guides", "Strategy around specific equipment setups.", "builds")}

      </div>

    </div>
  `;
}

function guideCard(title, text, page) {
  return `
    <a class="card card-hover" href="index.html?page=${esc(page)}">

      <div class="media-art" style="height:140px;">
        <div class="art-label">GUIDE ART · ADMIN READY</div>
      </div>

      <div style="padding:17px;">
        <h3 style="font-size:15px;margin-bottom:6px;">
          ${esc(title)}
        </h3>

        <p style="font-size:11px;color:var(--muted);margin:0;">
          ${esc(text)}
        </p>

        <div class="data-pending">
          CONTENT SYSTEM READY
        </div>
      </div>

    </a>
  `;
}

/* =========================================================
   COMMUNITY
   ========================================================= */

function renderCommunity() {
  return `
    <div class="page">

      ${pageHeader(
        "Community",
        "Q&A",
        "Questions, answers, discussion and moderation."
      )}

      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px;">
        <div class="muted small">
          Community data is persistent and is never removed by raw-snapshot cleanup.
        </div>

        <button class="btn btn-primary" id="askQuestion" type="button">
          Ask Question
        </button>
      </div>

      <div class="question-list">

        ${questionCard(
          "What is the best way to learn a new hero?",
          "Community question placeholder. Real user-generated content will come from the database.",
          12,
          4
        )}

        ${questionCard(
          "How does the equipment calculator handle passives?",
          "Calculator mechanics will be explained using verified game data.",
          8,
          3
        )}

        ${questionCard(
          "Where can I find official patch information?",
          "HoKStat will link patch entries back to their official source.",
          6,
          2
        )}

      </div>

    </div>
  `;
}

function questionCard(title, body, votes, answers) {
  return `
    <article class="question card-hover">

      <div class="question-top">

        <div>
          <h3 class="question-title">${esc(title)}</h3>
          <p class="question-body">${esc(body)}</p>
        </div>

        <span class="tag">Q&amp;A</span>

      </div>

      <div class="question-stats">
        <span>▲ ${votes} votes</span>
        <span>${answers} answers</span>
        <span>Community</span>
      </div>

    </article>
  `;
}

/* =========================================================
   SEARCH
   ========================================================= */

function renderSearch() {
  return `
    <div class="page">

      ${pageHeader(
        "Global Search",
        "Search HoKStat",
        "Search across heroes, equipment, builds, guides, patches, news and community."
      )}

      <div class="search-page-box">
        <input
          id="globalSearch"
          type="search"
          autofocus
          placeholder="Try: Dun, equipment, build..."
        >
      </div>

      <div id="searchResults" class="search-results">
        ${renderSearchResults("")}
      </div>

    </div>
  `;
}

function renderSearchResults(query) {
  const q = query.trim().toLowerCase();

  const results = [];

  HEROES.forEach(hero => {
    if (!q || hero.name.toLowerCase().includes(q)) {
      results.push({
        type: "Hero",
        name: hero.name,
        url: `index.html?page=hero&slug=${encodeURIComponent(hero.slug)}`
      });
    }
  });

  ITEMS.forEach(item => {
    if (!q || item.name.toLowerCase().includes(q)) {
      results.push({
        type: "Equipment",
        name: item.name,
        url: `index.html?page=item&slug=${encodeURIComponent(item.slug)}`
      });
    }
  });

  BUILDS.forEach(build => {
    if (!q || build.name.toLowerCase().includes(q)) {
      results.push({
        type: "Build",
        name: build.name,
        url: `index.html?page=build&slug=${encodeURIComponent(build.slug)}`
      });
    }
  });

  if (results.length === 0) {
    return pendingPanel("No matching results");
  }

  return results.map(result => `
    <a class="search-result" href="${result.url}">
      <div>
        <div class="result-type">${esc(result.type)}</div>
        <div class="result-name">${esc(result.name)}</div>
      </div>
      <span class="text-link">Open →</span>
    </a>
  `).join("");
}

/* =========================================================
   ABOUT
   ========================================================= */

function renderAbout() {
  return `
    <div class="page">

      ${pageHeader(
        "Project",
        "About HoKStat.gg",
        "An independent Honor of Kings database and tools project."
      )}

      <div class="info-grid">

        <div class="card info-card">
          <h3>What is HoKStat.gg?</h3>
          <p>
            A living database and utility hub for heroes, equipment,
            builds, calculators, patches, guides, news and community.
          </p>
        </div>

        <div class="card info-card">
          <h3>Official data first</h3>
          <p>
            Live data should come from official sources wherever possible.
            Unverified values are not presented as facts.
          </p>
        </div>

        <div class="card info-card">
          <h3>Independent project</h3>
          <p>
            HoKStat.gg is independent and is not presented as an official
            Honor of Kings website.
          </p>
        </div>

      </div>

      <section class="section">
        <div class="panel">

          <h2 class="panel-title">Data Methodology</h2>

          <div class="timeline">

            <div class="timeline-item">
              <div class="timeline-version">01</div>
              <h3 class="timeline-title">Official source</h3>
              <p class="timeline-text">
                Collect official live information.
              </p>
            </div>

            <div class="timeline-item">
              <div class="timeline-version">02</div>
              <h3 class="timeline-title">Validation</h3>
              <p class="timeline-text">
                Check structure, values, references and consistency.
              </p>
            </div>

            <div class="timeline-item">
              <div class="timeline-version">03</div>
              <h3 class="timeline-title">Database</h3>
              <p class="timeline-text">
                Update verified live data and preserve required history.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  `;
}

/* =========================================================
   DATA PAGE
   ========================================================= */

function renderData() {
  return `
    <div class="page">

      ${pageHeader(
        "Transparency",
        "Data",
        "Information about source status, versions and verification."
      )}

      <div class="status-panel">

        <div class="status-block">
          <div class="status-label">Live Data</div>
          <div class="status-value">Not connected</div>
        </div>

        <div class="status-block">
          <div class="status-label">Data Version</div>
          <div class="status-value">Pending</div>
        </div>

        <div class="status-block">
          <div class="status-label">Last Updated</div>
          <div class="status-value">Pending</div>
        </div>

      </div>

      <section class="section">

        <div class="panel">

          <h2 class="panel-title">Source Pipeline</h2>

          <div class="source-list">

            <div class="source-row">
              <span>Official Live Data</span>
              <span class="source-status">PRIMARY</span>
            </div>

            <div class="source-row">
              <span>Official Announcements</span>
              <span class="source-status">PRIMARY</span>
            </div>

            <div class="source-row">
              <span>Verified Historical Data</span>
              <span class="source-status">SECONDARY</span>
            </div>

            <div class="source-row">
              <span>Leaks / Rumors</span>
              <span class="source-status">NEVER LIVE DATA</span>
            </div>

          </div>

        </div>

      </section>

      <section class="section">
        ${pendingPanel("Automated verification service pending")}
      </section>

    </div>
  `;
}

/* =========================================================
   ROUTER
   ========================================================= */

function renderPage() {
  const page = getPage();

  switch (page) {
    case "home":
      app.innerHTML = renderHome();
      bindHome();
      break;

    case "heroes":
      app.innerHTML = renderHeroes();
      bindHeroFilters();
      break;

    case "hero":
      app.innerHTML = renderHeroDetail();
      bindHeroDetail();
      break;

    case "equipment":
      app.innerHTML = renderEquipment();
      bindItemFilters();
      break;

    case "item":
      app.innerHTML = renderItemDetail();
      break;

    case "builds":
      app.innerHTML = renderBuilds();
      bindBuildFilters();
      break;

    case "build":
      app.innerHTML = renderBuildDetail();
      bindBuildDetail();
      break;

    case "calculator":
      app.innerHTML = renderCalculator();
      bindCalculator();
      break;

    case "meta":
      app.innerHTML = renderMeta();
      break;

    case "patches":
      app.innerHTML = renderPatches();
      break;

    case "news":
      app.innerHTML = renderNews();
      break;

    case "guides":
      app.innerHTML = renderGuides();
      break;

    case "community":
      app.innerHTML = renderCommunity();
      bindCommunity();
      break;

    case "search":
      app.innerHTML = renderSearch();
      bindSearch();
      break;

    case "about":
      app.innerHTML = renderAbout();
      break;

    case "data":
      app.innerHTML = renderData();
      break;

    default:
      app.innerHTML = renderHome();
      bindHome();
      break;
  }
}

/* =========================================================
   HOME EVENTS
   ========================================================= */

function bindHome() {
  const hero = document.getElementById("homeHero");

  if (!hero) return;

  const slides = [...hero.querySelectorAll(".cinema-slide")];
  const dots = [...hero.querySelectorAll(".slider-dot")];

  function showSlide(index) {
    state.sliderIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === state.sliderIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === state.sliderIndex);
    });
  }

  function nextSlide() {
    if (!state.sliderPaused) {
      showSlide(state.sliderIndex + 1);
    }
  }

  function startSlider() {
    window.clearInterval(state.sliderTimer);

    state.sliderTimer = window.setInterval(() => {
      nextSlide();
    }, 6000);
  }

  document.getElementById("slideNext")?.addEventListener("click", () => {
    showSlide(state.sliderIndex + 1);
    startSlider();
  });

  document.getElementById("slidePrev")?.addEventListener("click", () => {
    showSlide(state.sliderIndex - 1);
    startSlider();
  });

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.dot));
      startSlider();
    });
  });

  document.querySelectorAll(".slide-action").forEach(button => {
    button.addEventListener("click", () => {
      go(button.dataset.page);
    });
  });

  const pauseButton = document.getElementById("pauseSlider");

  pauseButton?.addEventListener("click", () => {
    state.sliderPaused = !state.sliderPaused;
    pauseButton.textContent = state.sliderPaused ? "Play" : "Pause";
  });

  hero.addEventListener("mouseenter", () => {
    state.sliderPaused = true;
  });

  hero.addEventListener("mouseleave", () => {
    state.sliderPaused = false;
  });

  hero.addEventListener("focusin", () => {
    state.sliderPaused = true;
  });

  hero.addEventListener("focusout", () => {
    state.sliderPaused = false;
  });

  /* Touch swipe */
  let touchStartX = 0;

  hero.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  hero.addEventListener("touchend", event => {
    const touchEndX = event.changedTouches[0].screenX;
    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) < 45) return;

    if (difference > 0) {
      showSlide(state.sliderIndex + 1);
    } else {
      showSlide(state.sliderIndex - 1);
    }

    startSlider();
  }, { passive: true });

  /* Keyboard */
  hero.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
      showSlide(state.sliderIndex + 1);
      startSlider();
    }

    if (event.key === "ArrowLeft") {
      showSlide(state.sliderIndex - 1);
      startSlider();
    }
  });

  const homeSearch = document.getElementById("homeSearch");

  homeSearch?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      const query = homeSearch.value.trim();

      if (query) {
        window.location.href =
          `index.html?page=search&q=${encodeURIComponent(query)}`;
      } else {
        go("search");
      }
    }
  });

  startSlider();
}

/* =========================================================
   HERO FILTERS
   ========================================================= */

function bindHeroFilters() {
  const search = document.getElementById("heroSearch");
  const role = document.getElementById("heroRole");
  const difficulty = document.getElementById("heroDifficulty");
  const grid = document.getElementById("heroGrid");

  function update() {
    const q = search.value.toLowerCase().trim();
    const roleValue = role.value;
    const difficultyValue = difficulty.value;

    const filtered = HEROES.filter(hero => {
      const matchSearch =
        !q ||
        hero.name.toLowerCase().includes(q) ||
        hero.role.toLowerCase().includes(q);

      const matchRole =
        !roleValue || hero.lane === roleValue;

      const matchDifficulty =
        !difficultyValue || hero.difficulty === difficultyValue;

      return matchSearch && matchRole && matchDifficulty;
    });

    grid.innerHTML =
      filtered.length
        ? filtered.map(renderHeroCard).join("")
        : pendingPanel("No heroes found");
  }

  search?.addEventListener("input", update);
  role?.addEventListener("change", update);
  difficulty?.addEventListener("change", update);
}

/* =========================================================
   ITEM FILTERS
   ========================================================= */

function bindItemFilters() {
  const search = document.getElementById("itemSearch");
  const type = document.getElementById("itemType");
  const grid = document.getElementById("itemGrid");

  function update() {
    const q = search.value.toLowerCase().trim();
    const typeValue = type.value;

    const filtered = ITEMS.filter(item => {
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q);

      const matchType =
        !typeValue || item.type === typeValue;

      return matchSearch && matchType;
    });

    grid.innerHTML =
      filtered.length
        ? filtered.map(renderItemCard).join("")
        : pendingPanel("No equipment found");
  }

  search?.addEventListener("input", update);
  type?.addEventListener("change", update);
}

/* =========================================================
   BUILD FILTERS
   ========================================================= */

function bindBuildFilters() {
  const search = document.getElementById("buildSearch");
  const type = document.getElementById("buildType");
  const grid = document.getElementById("buildGrid");

  function update() {
    const q = search.value.toLowerCase().trim();
    const typeValue = type.value;

    const filtered = BUILDS.filter(build => {
      const matchSearch =
        !q ||
        build.name.toLowerCase().includes(q) ||
        build.hero.toLowerCase().includes(q);

      const matchType =
        !typeValue || build.type === typeValue;

      return matchSearch && matchType;
    });

    grid.innerHTML =
      filtered.length
        ? filtered.map(renderBuildCard).join("")
        : pendingPanel("No builds found");
  }

  search?.addEventListener("input", update);
  type?.addEventListener("change", update);
}

/* =========================================================
   BUILD DETAIL
   ========================================================= */

function bindBuildDetail() {
  const button = document.getElementById("tryBuild");

  button?.addEventListener("click", () => {
    const slug = getParams().get("slug");
    const build = buildBySlug(slug);

    if (!build) return;

    localStorage.setItem(
      "hokstat_saved_build",
      JSON.stringify(build)
    );

    window.location.href =
      `index.html?page=calculator&build=${encodeURIComponent(build.slug)}`;
  });
}

/* =========================================================
   CALCULATOR
   ========================================================= */

function bindCalculator() {
  const saved = localStorage.getItem("hokstat_saved_build");
  const params = getParams();
  const buildSlug = params.get("build");

  if (buildSlug) {
    const build = buildBySlug(buildSlug);

    if (build) {
      state.calculatorItems = [...build.items];
    }
  } else if (saved) {
    /* Saved build remains available but isn't automatically loaded. */
  }

  const heroSelect = document.getElementById("calcHero");

  heroSelect?.addEventListener("change", () => {
    state.selectedHero = heroSelect.value;
    showToast(`Hero selected: ${state.selectedHero}`);
  });

  document.getElementById("resetCalc")?.addEventListener("click", () => {
    state.calculatorItems = [null, null, null, null, null, null];
    updateCalculatorUI();
    showToast("Calculator reset.");
  });

  document.getElementById("saveCalc")?.addEventListener("click", () => {
    const build = {
      hero: state.selectedHero,
      items: [...state.calculatorItems],
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(
      "hokstat_calculator_build",
      JSON.stringify(build)
    );

    showToast("Build saved locally.");
  });

  document.getElementById("shareCalc")?.addEventListener("click", () => {
    const encoded = btoa(
      JSON.stringify({
        hero: state.selectedHero,
        items: state.calculatorItems
      })
    );

    const url =
      `${window.location.origin}${window.location.pathname}?page=calculator&builddata=${encodeURIComponent(encoded)}`;

    if (navigator.share) {
      navigator.share({
        title: "HoKStat.gg Build",
        text: "HoKStat.gg calculator build",
        url
      }).catch(() => {});
    } else {
      showToast("Share link generated in the browser URL.");
      window.history.replaceState({}, "", url);
    }
  });

  const buildData = params.get("builddata");

  if (buildData) {
    try {
      const decoded = JSON.parse(atob(buildData));

      if (Array.isArray(decoded.items)) {
        state.calculatorItems =
          decoded.items.slice(0, 6).map(id =>
            ITEMS.some(item => item.id === id) ? id : null
          );
      }

      if (decoded.hero) {
        state.selectedHero = decoded.hero;

        if (heroSelect) {
          heroSelect.value = decoded.hero;
        }
      }
    } catch {
      showToast("Could not read shared build.");
    }
  }

  bindCalculatorSlots();
  updateCalculatorUI();
}

/* =========================================================
   COMMUNITY
   ========================================================= */

function bindCommunity() {
  document.getElementById("askQuestion")?.addEventListener("click", () => {
    showToast("Community posting will be enabled with user authentication.");
  });
}

/* =========================================================
   SEARCH
   ========================================================= */

function bindSearch() {
  const input = document.getElementById("globalSearch");
  const results = document.getElementById("searchResults");

  const initialQuery = getParams().get("q") || "";

  if (input) {
    input.value = initialQuery;
  }

  if (results) {
    results.innerHTML = renderSearchResults(initialQuery);
  }

  input?.addEventListener("input", () => {
    results.innerHTML = renderSearchResults(input.value);
  });
}

/* =========================================================
   MOBILE MENU
   ========================================================= */

function bindMenu() {
  const button = document.getElementById("menuButton");
  const menu = document.getElementById("mobileMenu");

  if (!button || !menu) return;

  button.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
}

/* =========================================================
   INIT
   ========================================================= */

function init() {
  bindMenu();
  renderPage();
}

document.addEventListener("DOMContentLoaded", init);
