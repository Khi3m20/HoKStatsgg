/* =========================================================
   HoKStat.gg
   Main frontend application
   GitHub Pages safe routing:
   index.html?page=heroes
   index.html?page=hero&slug=dun
========================================================= */

"use strict";

/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {
  siteName: "HoKStat.gg",

  /*
   * Keep this false until the backend/API is ready.
   * Frontend must never contain admin/service-role secrets.
   */
  useApi: false,

  apiBase: "",

  sliderInterval: 6500
};


/* =========================================================
   DEMO DATA
   ---------------------------------------------------------
   IMPORTANT:
   These records are UI/demo records only.
   Do NOT treat them as official live statistics.
========================================================= */

const DATA = {

  heroes: [
    {
      id: "dun",
      slug: "dun",
      name: "Dun",
      role: "Tank",
      lane: "Clash Lane",
      difficulty: "Medium",
      image: "",
      bio:
        "A durable frontline hero built around crowd control, disruption and sustained combat.",
      status: "DATA PENDING",
      source: "Official data required",
      skills: [
        ["Passive", "Survival mechanic", "Data pending official verification."],
        ["Skill 1", "Control", "Data pending official verification."],
        ["Skill 2", "Defense", "Data pending official verification."],
        ["Ultimate", "Engage", "Data pending official verification."]
      ],
      stats: {
        HP: 100,
        "Physical Attack": 55,
        "Physical Defense": 72,
        "Magic Defense": 62,
        "Movement Speed": 60
      }
    },

    {
      id: "ying",
      slug: "ying",
      name: "Ying",
      role: "Fighter",
      lane: "Jungle",
      difficulty: "High",
      image: "",
      bio:
        "A mobile fighter designed around aggressive combat and flexible jungle engagements.",
      status: "DATA PENDING",
      source: "Official data required",
      skills: [
        ["Passive", "Combat", "Data pending official verification."],
        ["Skill 1", "Damage", "Data pending official verification."],
        ["Skill 2", "Mobility", "Data pending official verification."],
        ["Ultimate", "Engage", "Data pending official verification."]
      ],
      stats: {
        HP: 72,
        "Physical Attack": 88,
        "Physical Defense": 55,
        "Magic Defense": 48,
        "Movement Speed": 82
      }
    },

    {
      id: "lam",
      slug: "lam",
      name: "Lam",
      role: "Assassin",
      lane: "Jungle",
      difficulty: "High",
      image: "",
      bio:
        "A fast assassin focused on mobility, target access and finishing damaged enemies.",
      status: "DATA PENDING",
      source: "Official data required",
      skills: [
        ["Passive", "Assassination", "Data pending official verification."],
        ["Skill 1", "Mobility", "Data pending official verification."],
        ["Skill 2", "Damage", "Data pending official verification."],
        ["Ultimate", "Execution", "Data pending official verification."]
      ],
      stats: {
        HP: 58,
        "Physical Attack": 92,
        "Physical Defense": 44,
        "Magic Defense": 44,
        "Movement Speed": 91
      }
    },

    {
      id: "milady",
      slug: "milady",
      name: "Milady",
      role: "Mage",
      lane: "Mid Lane",
      difficulty: "Medium",
      image: "",
      bio:
        "A ranged mage focused on pressure, zone control and sustained magical damage.",
      status: "DATA PENDING",
      source: "Official data required",
      skills: [
        ["Passive", "Summon", "Data pending official verification."],
        ["Skill 1", "Magic Damage", "Data pending official verification."],
        ["Skill 2", "Control", "Data pending official verification."],
        ["Ultimate", "Pressure", "Data pending official verification."]
      ],
      stats: {
        HP: 42,
        "Physical Attack": 25,
        "Physical Defense": 35,
        "Magic Defense": 45,
        "Movement Speed": 52
      }
    },

    {
      id: "alessio",
      slug: "alessio",
      name: "Alessio",
      role: "Marksman",
      lane: "Farm Lane",
      difficulty: "Medium",
      image: "",
      bio:
        "A ranged damage dealer whose strength comes from sustained attacks and positioning.",
      status: "DATA PENDING",
      source: "Official data required",
      skills: [
        ["Passive", "Damage", "Data pending official verification."],
        ["Skill 1", "Attack", "Data pending official verification."],
        ["Skill 2", "Mobility", "Data pending official verification."],
        ["Ultimate", "Finisher", "Data pending official verification."]
      ],
      stats: {
        HP: 45,
        "Physical Attack": 89,
        "Physical Defense": 36,
        "Magic Defense": 38,
        "Movement Speed": 66
      }
    },

    {
      id: "dolia",
      slug: "dolia",
      name: "Dolia",
      role: "Support",
      lane: "Roamer",
      difficulty: "High",
      image: "",
      bio:
        "A support hero built around team utility, positioning and ability interaction.",
      status: "DATA PENDING",
      source: "Official data required",
      skills: [
        ["Passive", "Utility", "Data pending official verification."],
        ["Skill 1", "Support", "Data pending official verification."],
        ["Skill 2", "Control", "Data pending official verification."],
        ["Ultimate", "Team Utility", "Data pending official verification."]
      ],
      stats: {
        HP: 65,
        "Physical Attack": 30,
        "Physical Defense": 50,
        "Magic Defense": 57,
        "Movement Speed": 56
      }
    }
  ],

  equipment: [
    {
      id: "blade",
      slug: "blade-of-despair",
      name: "Blade of Despair",
      type: "Attack",
      price: "—",
      icon: "BD",
      description: "Equipment data pending official verification.",
      stats: ["Physical Attack —", "Passive —"]
    },
    {
      id: "boots",
      slug: "boots",
      name: "Boots",
      type: "Movement",
      price: "—",
      icon: "BT",
      description: "Equipment data pending official verification.",
      stats: ["Movement Speed —"]
    },
    {
      id: "armor",
      slug: "defense-armor",
      name: "Defense Armor",
      type: "Defense",
      price: "—",
      icon: "AR",
      description: "Equipment data pending official verification.",
      stats: ["Physical Defense —"]
    },
    {
      id: "magic",
      slug: "magic-core",
      name: "Magic Core",
      type: "Magic",
      price: "—",
      icon: "MC",
      description: "Equipment data pending official verification.",
      stats: ["Magic Attack —"]
    },
    {
      id: "crit",
      slug: "critical-blade",
      name: "Critical Blade",
      type: "Attack",
      price: "—",
      icon: "CB",
      description: "Equipment data pending official verification.",
      stats: ["Crit —"]
    },
    {
      id: "hp",
      slug: "guardian-core",
      name: "Guardian Core",
      type: "Defense",
      price: "—",
      icon: "GC",
      description: "Equipment data pending official verification.",
      stats: ["HP —"]
    },
    {
      id: "pierce",
      slug: "piercing-edge",
      name: "Piercing Edge",
      type: "Attack",
      price: "—",
      icon: "PE",
      description: "Equipment data pending official verification.",
      stats: ["Pierce —"]
    },
    {
      id: "cooldown",
      slug: "arcane-device",
      name: "Arcane Device",
      type: "Utility",
      price: "—",
      icon: "AD",
      description: "Equipment data pending official verification.",
      stats: ["Cooldown —"]
    }
  ],

  builds: [
    {
      id: "dun-frontline",
      slug: "dun-frontline",
      hero: "Dun",
      type: "Recommended",
      name: "Frontline",
      description:
        "A defensive build template. Exact items and calculated stats will come from verified game data.",
      items: [
        "guardian-core",
        "defense-armor",
        "boots",
        "guardian-core",
        "arcane-device",
        "defense-armor"
      ]
    },
    {
      id: "ying-jungle",
      slug: "ying-jungle",
      hero: "Ying",
      type: "Recommended",
      name: "Jungle Damage",
      description:
        "A damage-oriented jungle template awaiting verified item values.",
      items: [
        "blade-of-despair",
        "boots",
        "critical-blade",
        "piercing-edge",
        "blade-of-despair",
        "arcane-device"
      ]
    },
    {
      id: "milady-magic",
      slug: "milady-magic",
      hero: "Milady",
      type: "Recommended",
      name: "Magic Pressure",
      description:
        "A magic damage template awaiting verified equipment calculations.",
      items: [
        "magic-core",
        "boots",
        "magic-core",
        "arcane-device",
        "magic-core",
        "guardian-core"
      ]
    }
  ],

  news: [
    {
      title: "Official data integration",
      category: "SYSTEM",
      date: "Project",
      summary:
        "HoKStat is designed to separate verified Live data from test or unconfirmed information."
    },
    {
      title: "Homepage content engine",
      category: "HOKSTAT",
      date: "Project",
      summary:
        "Featured heroes, builds, equipment, patches, guides and news can be rotated dynamically."
    },
    {
      title: "Calculator architecture",
      category: "TOOLS",
      date: "Project",
      summary:
        "The calculator is structured around six equipment slots and a future verified stat engine."
    }
  ],

  guides: [
    {
      slug: "understanding-builds",
      title: "Understanding Builds",
      category: "Beginner",
      hero: "",
      summary:
        "Learn how HoKStat separates recommended builds from calculator experimentation."
    },
    {
      slug: "equipment-basics",
      title: "Equipment Basics",
      category: "Equipment",
      hero: "",
      summary:
        "Understand equipment categories, build paths and passive effects."
    },
    {
      slug: "reading-patch-data",
      title: "Reading Patch Data",
      category: "Advanced",
      hero: "",
      summary:
        "How to read hero and equipment changes without mixing test data with live data."
    }
  ],

  patches: [
    {
      slug: "current",
      version: "CURRENT",
      title: "Current Live Patch",
      date: "Verified data pending",
      summary:
        "Official live patch data will be inserted through the verification pipeline."
    },
    {
      slug: "previous",
      version: "PREVIOUS",
      title: "Previous Patch",
      date: "Historical",
      summary:
        "Historical patch snapshots are preserved separately from live data."
    }
  ],

  questions: [
    {
      title: "How does the HoKStat calculator handle six items?",
      answers: 0,
      votes: 12,
      category: "Calculator"
    },
    {
      title: "Where does HoKStat get official data?",
      answers: 2,
      votes: 9,
      category: "Data"
    },
    {
      title: "How are patch changes archived?",
      answers: 1,
      votes: 7,
      category: "Patches"
    }
  ]
};


/* =========================================================
   ROUTING
========================================================= */

const params = new URLSearchParams(window.location.search);

function getPage() {
  return params.get("page") || "home";
}

function getSlug() {
  return params.get("slug") || "";
}


/* =========================================================
   DOM
========================================================= */

const app = document.getElementById("app");
const toast = document.getElementById("toast");


/* =========================================================
   UTILITIES
========================================================= */

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function navigate(page, slug = "") {
  let url = `index.html?page=${encodeURIComponent(page)}`;

  if (slug) {
    url += `&slug=${encodeURIComponent(slug)}`;
  }

  window.location.href = url;
}

function toastMessage(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.__toastTimer);

  window.__toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function iconFor(text) {
  const icons = {
    heroes: "✦",
    equipment: "◆",
    builds: "▦",
    calculator: "⌗",
    meta: "↗",
    patches: "◈",
    guides: "☷",
    community: "◎"
  };

  return icons[text] || "•";
}

function imageStyle(url) {
  if (!url) return "";

  return `
    style="
      background-image:
        linear-gradient(
          90deg,
          rgba(6,9,15,.92),
          rgba(6,9,15,.25)
        ),
        url('${esc(url)}')
    "
  `;
}


/* =========================================================
   COMMON COMPONENTS
========================================================= */

function pageHead(eyebrow, title, description) {
  return `
    <div class="page-head">
      <div class="eyebrow">${esc(eyebrow)}</div>
      <h1>${esc(title)}</h1>
      <p>${esc(description)}</p>
    </div>
  `;
}

function panel(content, cls = "") {
  return `<section class="panel ${cls}">${content}</section>`;
}

function tag(text, green = false) {
  return `
    <span class="tag ${green ? "tag-green" : ""}">
      ${esc(text)}
    </span>
  `;
}

function demoNote(text = "Demo UI · verified live data will replace this record") {
  return `
    <div class="demo-note">
      ${esc(text)}
    </div>
  `;
}


/* =========================================================
   HOME
========================================================= */

let sliderIndex = 0;
let sliderTimer = null;

const sliderData = [
  {
    type: "HERO",
    kicker: "HERO DATABASE",
    title: "Heroes",
    text:
      "Explore heroes, roles, lanes, skills, stats and verified patch history.",
    button: "Explore Heroes",
    page: "heroes"
  },
  {
    type: "BUILD",
    kicker: "BUILD ENGINE",
    title: "Builds",
    text:
      "Six-slot builds connected to the future calculation engine.",
    button: "Explore Builds",
    page: "builds"
  },
  {
    type: "EQUIPMENT",
    kicker: "EQUIPMENT DATABASE",
    title: "Equipment",
    text:
      "Search equipment, stats, passives and build paths.",
    button: "Explore Equipment",
    page: "equipment"
  },
  {
    type: "PATCH",
    kicker: "PATCH CENTER",
    title: "Patch History",
    text:
      "Keep live data separate from historical patch snapshots.",
    button: "View Patches",
    page: "patches"
  },
  {
    type: "GUIDE",
    kicker: "GUIDE HUB",
    title: "Guides",
    text:
      "Quick hero explanations and deeper community guides in one place.",
    button: "Read Guides",
    page: "guides"
  },
  {
    type: "NEWS",
    kicker: "NEWS",
    title: "Official & Community",
    text:
      "A dedicated content system for official news, announcements and community resources.",
    button: "Open News",
    page: "news"
  }
];

function renderHome() {

  app.innerHTML = `
    <div class="page home">

      <section class="hero-slider" id="homeSlider">

        <div class="hero-art" id="heroArt"></div>

        <div class="hero-content">

          <div class="hero-kicker" id="sliderKicker"></div>

          <h1 id="sliderTitle"></h1>

          <p id="sliderText"></p>

          <div class="hero-actions">
            <button
              class="btn btn-primary"
              id="sliderAction"
            ></button>

            <button
              class="btn btn-ghost"
              onclick="openSearch()"
            >
              Quick Search
            </button>
          </div>

        </div>

        <div class="slider-controls">

          <button
            class="slider-arrow"
            id="sliderPrev"
          >
            ←
          </button>

          <div
            class="slider-dots"
            id="sliderDots"
          ></div>

          <button
            class="slider-arrow"
            id="sliderNext"
          >
            →
          </button>

        </div>

      </section>


      <section class="section">

        <div class="section-head">
          <div>
            <h2>Explore HoKStat</h2>
            <p>Core database and tools.</p>
          </div>
        </div>

        <div class="explore-grid">

          ${[
            ["heroes", "Heroes", "Browse the hero database."],
            ["equipment", "Equipment", "Items, stats and passives."],
            ["builds", "Builds", "Recommended and custom builds."],
            ["calculator", "Calculator", "Six-slot stat calculator."],
            ["meta", "Meta", "Role and hero performance data."],
            ["patches", "Patches", "Live and historical changes."],
            ["guides", "Guides", "Beginner to advanced guides."],
            ["community", "Community", "Questions and discussion."]
          ].map(x => `
            <a
              class="explore-card"
              href="index.html?page=${x[0]}"
            >
              <div class="explore-icon">
                ${iconFor(x[0])}
              </div>

              <strong>${esc(x[1])}</strong>
              <span>${esc(x[2])}</span>
            </a>
          `).join("")}

        </div>

      </section>


      <section class="section home-columns">

        ${panel(`
          <div class="panel-pad">

            <div class="section-head">
              <div>
                <h2>Latest</h2>
                <p>Project content and verified-data pipeline.</p>
              </div>

              <a
                class="section-link"
                href="index.html?page=news"
              >
                View all →
              </a>
            </div>

            <div class="news-list">

              ${DATA.news.map(n => `
                <article class="news-row">

                  <div class="news-thumb"></div>

                  <div>
                    ${tag(n.category, true)}
                    <strong>${esc(n.title)}</strong>
                    <small>${esc(n.summary)}</small>
                  </div>

                  ${tag(n.date)}

                </article>
              `).join("")}

            </div>

          </div>
        `)}

        ${panel(`
          <div class="status-widget">

            <div class="section-head">
              <div>
                <h2>Data Status</h2>
                <p>System overview.</p>
              </div>
            </div>

            <div class="status-line">
              <span>Live database</span>
              <strong class="status-ok">READY</strong>
            </div>

            <div class="status-line">
              <span>Official source</span>
              <strong class="status-ok">SUPPORTED</strong>
            </div>

            <div class="status-line">
              <span>Calculator</span>
              <strong>ENGINE READY</strong>
            </div>

            <div class="status-line">
              <span>Community Q&A</span>
              <strong>ACTIVE</strong>
            </div>

          </div>
        `)}

      </section>

    </div>
  `;

  setupSlider();
}

function setupSlider() {

  const kicker = document.getElementById("sliderKicker");
  const title = document.getElementById("sliderTitle");
  const text = document.getElementById("sliderText");
  const action = document.getElementById("sliderAction");
  const art = document.getElementById("heroArt");
  const dots = document.getElementById("sliderDots");

  function renderSlide() {

    const slide = sliderData[sliderIndex];

    kicker.textContent = slide.kicker;
    title.textContent = slide.title;
    text.textContent = slide.text;
    action.textContent = slide.button;

    action.onclick = () => navigate(slide.page);

    /*
      Admin can later insert:
      slide.image = "assets/..."
      without changing the slider architecture.
    */

    art.classList.remove("has-image");
    art.style.backgroundImage = "";

    dots.innerHTML = sliderData.map((_, i) => `
      <button
        class="slider-dot ${i === sliderIndex ? "active" : ""}"
        data-index="${i}"
        aria-label="Slide ${i + 1}"
      ></button>
    `).join("");

    dots.querySelectorAll(".slider-dot").forEach(dot => {
      dot.addEventListener("click", () => {
        sliderIndex = Number(dot.dataset.index);
        renderSlide();
        restartTimer();
      });
    });
  }

  function next() {
    sliderIndex =
      (sliderIndex + 1) % sliderData.length;

    renderSlide();
  }

  function prev() {
    sliderIndex =
      (sliderIndex - 1 + sliderData.length) %
      sliderData.length;

    renderSlide();
  }

  document.getElementById("sliderNext")
    .addEventListener("click", () => {
      next();
      restartTimer();
    });

  document.getElementById("sliderPrev")
    .addEventListener("click", () => {
      prev();
      restartTimer();
    });

  function restartTimer() {
    clearInterval(sliderTimer);

    sliderTimer = setInterval(
      next,
      CONFIG.sliderInterval
    );
  }

  const slider = document.getElementById("homeSlider");

  slider.addEventListener("mouseenter", () => {
    clearInterval(sliderTimer);
  });

  slider.addEventListener("mouseleave", () => {
    restartTimer();
  });

  let touchStartX = 0;

  slider.addEventListener("touchstart", e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener("touchend", e => {

    const touchEndX =
      e.changedTouches[0].screenX;

    const distance =
      touchStartX - touchEndX;

    if (Math.abs(distance) > 45) {

      if (distance > 0) {
        next();
      } else {
        prev();
      }

      restartTimer();
    }

  }, { passive: true });

  renderSlide();
  restartTimer();
}


/* =========================================================
   HERO LIST
========================================================= */

function renderHeroes() {

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        "DATABASE",
        "Heroes",
        "Browse heroes by role, lane and difficulty."
      )}

      ${demoNote()}

      <div class="toolbar">

        <input
          class="input"
          id="heroSearch"
          placeholder="Search heroes..."
        >

        <select class="select" id="heroRole">
          <option value="">All roles</option>
          <option>Tank</option>
          <option>Fighter</option>
          <option>Assassin</option>
          <option>Mage</option>
          <option>Marksman</option>
          <option>Support</option>
        </select>

        <select class="select" id="heroLane">
          <option value="">All lanes</option>
          <option>Clash Lane</option>
          <option>Jungle</option>
          <option>Mid Lane</option>
          <option>Farm Lane</option>
          <option>Roamer</option>
        </select>

        <select class="select" id="heroSort">
          <option value="name">Name</option>
          <option value="role">Role</option>
          <option value="difficulty">Difficulty</option>
        </select>

      </div>

      <div
        class="hero-grid"
        id="heroGrid"
      ></div>

    </div>
  `;

  const search = document.getElementById("heroSearch");
  const role = document.getElementById("heroRole");
  const lane = document.getElementById("heroLane");
  const sort = document.getElementById("heroSort");
  const grid = document.getElementById("heroGrid");

  function draw() {

    let heroes = [...DATA.heroes];

    const q =
      search.value.trim().toLowerCase();

    if (q) {
      heroes = heroes.filter(h =>
        `${h.name} ${h.role} ${h.lane}`
          .toLowerCase()
          .includes(q)
      );
    }

    if (role.value) {
      heroes = heroes.filter(
        h => h.role === role.value
      );
    }

    if (lane.value) {
      heroes = heroes.filter(
        h => h.lane === lane.value
      );
    }

    heroes.sort((a, b) =>
      a[sort.value].localeCompare(
        b[sort.value]
      )
    );

    grid.innerHTML = heroes.length
      ? heroes.map(heroCard).join("")
      : `
        <div class="empty-state">
          <h3>No heroes found</h3>
          <p>Try another search or filter.</p>
        </div>
      `;
  }

  [search, role, lane, sort]
    .forEach(el =>
      el.addEventListener("input", draw)
    );

  draw();
}

function heroCard(h) {

  return `
    <a
      class="hero-card"
      href="index.html?page=hero&slug=${encodeURIComponent(h.slug)}"
    >

      <div
        class="hero-card-art ${h.image ? "has-image" : ""}"
        ${imageStyle(h.image)}
      ></div>

      <div class="hero-card-info">

        <div class="hero-card-name">
          ${esc(h.name)}
        </div>

        <div class="hero-card-role">
          ${esc(h.role)}
        </div>

        <div class="hero-card-meta">
          ${tag(h.lane)}
          ${tag(h.difficulty)}
        </div>

      </div>

    </a>
  `;
}


/* =========================================================
   HERO DETAIL
========================================================= */

function renderHeroDetail(slug) {

  const hero =
    DATA.heroes.find(
      h => h.slug === slug
    );

  if (!hero) {
    renderNotFound("Hero");
    return;
  }

  app.innerHTML = `
    <div class="page">

      <div class="detail-banner">

        <div
          class="detail-banner-art"
          ${imageStyle(hero.image)}
        ></div>

        <div class="detail-banner-content">

          ${tag(hero.status, true)}

          <h1>${esc(hero.name)}</h1>

          <div>
            ${tag(hero.role, true)}
            ${tag(hero.lane)}
            ${tag(hero.difficulty)}
          </div>

          <p>
            ${esc(hero.bio)}
          </p>

        </div>

      </div>


      <section class="section detail-grid">

        <div class="detail-stack">

          ${panel(`
            <div class="panel-pad">

              <div class="section-head">
                <div>
                  <h2>How to Play</h2>
                  <p>Quick practical overview.</p>
                </div>
              </div>

              <p class="muted">
                ${esc(hero.bio)}
              </p>

              <p class="muted">
                Deeper strategy, matchups and advanced play
                belong in the Guides section.
              </p>

            </div>
          `)}

          ${panel(`
            <div class="panel-pad">

              <div class="section-head">
                <div>
                  <h2>Skills</h2>
                  <p>Verified skill descriptions will be connected later.</p>
                </div>
              </div>

              <div class="data-list">

                ${hero.skills.map(s => `
                  <div class="data-row">
                    <span>
                      <strong style="color:var(--white)">
                        ${esc(s[0])}
                      </strong>
                      · ${esc(s[1])}
                    </span>

                    <span>
                      ${esc(s[2])}
                    </span>
                  </div>
                `).join("")}

              </div>

            </div>
          `)}

          ${panel(`
            <div class="panel-pad">

              <div class="section-head">
                <div>
                  <h2>Base Stats</h2>
                  <p>Visualization ready for verified values.</p>
                </div>
              </div>

              ${Object.entries(hero.stats).map(
                ([name, value]) => `
                  <div class="stat">

                    <div class="stat-top">
                      <span>${esc(name)}</span>
                      <span>${value}</span>
                    </div>

                    <div class="stat-track">
                      <div
                        class="stat-fill"
                        style="width:${value}%"
                      ></div>
                    </div>

                  </div>
                `
              ).join("")}

            </div>
          `)}

        </div>


        <aside class="detail-stack">

          ${panel(`
            <div class="panel-pad">

              <h3>Hero Data</h3>

              <div class="data-list">

                <div class="data-row">
                  <span>Role</span>
                  <span>${esc(hero.role)}</span>
                </div>

                <div class="data-row">
                  <span>Lane</span>
                  <span>${esc(hero.lane)}</span>
                </div>

                <div class="data-row">
                  <span>Difficulty</span>
                  <span>${esc(hero.difficulty)}</span>
                </div>

                <div class="data-row">
                  <span>Status</span>
                  <span>${esc(hero.status)}</span>
                </div>

              </div>

            </div>
          `)}

          ${panel(`
            <div class="panel-pad">

              <h3>Tools</h3>

              <button
                class="btn btn-primary"
                style="width:100%;margin-bottom:8px"
                onclick="navigate('calculator')"
              >
                Open Calculator
              </button>

              <button
                class="btn"
                style="width:100%"
                onclick="navigate('builds')"
              >
                View Builds
              </button>

            </div>
          `)}

        </aside>

      </section>

    </div>
  `;
}


/* =========================================================
   EQUIPMENT
========================================================= */

function renderEquipment() {

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        "DATABASE",
        "Equipment",
        "Browse equipment by category and open individual item records."
      )}

      ${demoNote()}

      <div class="toolbar">

        <input
          class="input"
          id="itemSearch"
          placeholder="Search equipment..."
        >

        <select class="select" id="itemType">
          <option value="">All types</option>
          <option>Attack</option>
          <option>Defense</option>
          <option>Magic</option>
          <option>Movement</option>
          <option>Utility</option>
        </select>

      </div>

      <div
        class="item-grid"
        id="itemGrid"
      ></div>

    </div>
  `;

  const search =
    document.getElementById("itemSearch");

  const type =
    document.getElementById("itemType");

  const grid =
    document.getElementById("itemGrid");

  function draw() {

    const q =
      search.value.trim().toLowerCase();

    let items =
      DATA.equipment.filter(item => {

        const matchesText =
          !q ||
          `${item.name} ${item.type}`
            .toLowerCase()
            .includes(q);

        const matchesType =
          !type.value ||
          item.type === type.value;

        return matchesText && matchesType;
      });

    grid.innerHTML = items.length
      ? items.map(itemCard).join("")
      : `
        <div class="empty-state">
          <h3>No equipment found</h3>
          <p>Try another search.</p>
        </div>
      `;
  }

  search.addEventListener("input", draw);
  type.addEventListener("change", draw);

  draw();
}

function itemCard(item) {

  return `
    <a
      class="item-card"
      href="index.html?page=item&slug=${encodeURIComponent(item.slug)}"
    >

      <div class="item-icon">
        ${esc(item.icon)}
      </div>

      <strong>${esc(item.name)}</strong>

      <small>${esc(item.type)}</small>

      <div style="margin-top:10px">
        ${tag(item.price)}
      </div>

    </a>
  `;
}


/* =========================================================
   ITEM DETAIL
========================================================= */

function renderItemDetail(slug) {

  const item =
    DATA.equipment.find(
      x => x.slug === slug
    );

  if (!item) {
    renderNotFound("Equipment");
    return;
  }

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        "EQUIPMENT",
        item.name,
        item.description
      )}

      <div class="detail-grid">

        <div class="detail-stack">

          ${panel(`
            <div class="panel-pad">

              <div class="item-icon">
                ${esc(item.icon)}
              </div>

              <h2>${esc(item.name)}</h2>

              <div>
                ${tag(item.type, true)}
                ${tag(item.price)}
              </div>

              <p class="muted">
                ${esc(item.description)}
              </p>

            </div>
          `)}

          ${panel(`
            <div class="panel-pad">

              <h2>Stats</h2>

              <div class="data-list">
                ${item.stats.map(s => `
                  <div class="data-row">
                    <span>${esc(s)}</span>
                    <span>—</span>
                  </div>
                `).join("")}
              </div>

            </div>
          `)}

          ${panel(`
            <div class="panel-pad">

              <h2>Passive</h2>

              <p class="muted">
                Passive effect data will be populated only
                after official data verification.
              </p>

            </div>
          `)}

        </div>


        <aside class="detail-stack">

          ${panel(`
            <div class="panel-pad">

              <h3>Build Path</h3>

              <p class="muted">
                Component relationships will be displayed
                here once verified item data is available.
              </p>

            </div>
          `)}

          ${panel(`
            <div class="panel-pad">

              <h3>Used In Builds</h3>

              <button
                class="btn btn-primary"
                style="width:100%"
                onclick="navigate('builds')"
              >
                View Builds
              </button>

            </div>
          `)}

        </aside>

      </div>

    </div>
  `;
}


/* =========================================================
   BUILDS
========================================================= */

function renderBuilds() {

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        "BUILD DATABASE",
        "Builds",
        "Recommended build templates and future community builds."
      )}

      ${demoNote()}

      <div class="build-grid">

        ${DATA.builds
          .map(buildCard)
          .join("")}

      </div>

    </div>
  `;
}

function buildCard(build) {

  return `
    <a
      class="build-card"
      href="index.html?page=build&slug=${encodeURIComponent(build.slug)}"
    >

      <div class="build-head">

        <div>
          ${tag(build.type, true)}

          <strong>
            ${esc(build.name)}
          </strong>

          <div class="muted" style="font-size:10px;margin-top:4px">
            ${esc(build.hero)}
          </div>
        </div>

        <span style="color:var(--green)">
          →
        </span>

      </div>

      <div class="build-items">

        ${build.items.map(itemSlug => {

          const item =
            DATA.equipment.find(
              i => i.slug === itemSlug
            );

          return `
            <div class="build-slot">
              ${item ? esc(item.icon) : "—"}
            </div>
          `;

        }).join("")}

      </div>

      <div class="build-desc">
        ${esc(build.description)}
      </div>

    </a>
  `;
}


/* =========================================================
   BUILD DETAIL
========================================================= */

function renderBuildDetail(slug) {

  const build =
    DATA.builds.find(
      b => b.slug === slug
    );

  if (!build) {
    renderNotFound("Build");
    return;
  }

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        "BUILD",
        build.name,
        `${build.hero} · ${build.type}`
      )}

      ${demoNote()}

      <div class="detail-grid">

        <div class="detail-stack">

          ${panel(`
            <div class="panel-pad">

              <h2>Six Equipment Slots</h2>

              <div class="slot-grid">

                ${build.items.map(itemSlug => {

                  const item =
                    DATA.equipment.find(
                      x => x.slug === itemSlug
                    );

                  return `
                    <div class="calc-slot selected">
                      ${item ? esc(item.icon) : "—"}
                    </div>
                  `;

                }).join("")}

              </div>

            </div>
          `)}

          ${panel(`
            <div class="panel-pad">

              <h2>Build Explanation</h2>

              <p class="muted">
                ${esc(build.description)}
              </p>

              <p class="muted">
                Exact passive interactions and final stats
                will be calculated from verified game data.
              </p>

            </div>
          `)}

        </div>


        <aside class="detail-stack">

          ${panel(`
            <div class="panel-pad">

              <h3>Build Stats</h3>

              <div class="calc-stats">

                ${[
                  "HP",
                  "Physical Attack",
                  "Magic Attack",
                  "Physical Defense",
                  "Magic Defense",
                  "Attack Speed",
                  "Cooldown"
                ].map(stat => `
                  <div class="calc-stat">
                    <span>${stat}</span>
                    <strong>—</strong>
                  </div>
                `).join("")}

              </div>

            </div>
          `)}

          ${panel(`
            <div class="panel-pad">

              <button
                class="btn btn-primary"
                style="width:100%"
                onclick="navigate('calculator')"
              >
                Try This Build
              </button>

            </div>
          `)}

        </aside>

      </div>

    </div>
  `;
}


/* =========================================================
   CALCULATOR
========================================================= */

const calculatorState = {
  hero: "dun",
  slots: [null, null, null, null, null, null]
};

function renderCalculator() {

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        "TOOL",
        "Equipment Calculator",
        "Build six equipment slots and inspect the calculated stat breakdown."
      )}

      ${demoNote(
        "Calculation engine UI ready · verified game formulas will connect here"
      )}

      <div class="toolbar">

        <select
          class="select"
          id="calcHero"
        >
          ${DATA.heroes.map(h => `
            <option
              value="${h.slug}"
              ${calculatorState.hero === h.slug ? "selected" : ""}
            >
              ${esc(h.name)}
            </option>
          `).join("")}
        </select>

        <button
          class="btn"
          id="resetCalc"
        >
          Reset Build
        </button>

      </div>


      <div class="calculator-layout">

        ${panel(`
          <div class="panel-pad">

            <div class="section-head">
              <div>
                <h2>Equipment Slots</h2>
                <p>Choose, remove or replace equipment.</p>
              </div>
            </div>

            <div
              class="slot-grid"
              id="calcSlots"
            ></div>

            <div
              id="itemPicker"
              style="margin-top:20px"
            ></div>

          </div>
        `)}


        ${panel(`
          <div class="panel-pad">

            <div class="section-head">
              <div>
                <h2>Final Stats</h2>
                <p>Base + equipment + effects.</p>
              </div>
            </div>

            <div
              class="calc-stats"
              id="calcStats"
            ></div>

            <div style="margin-top:20px">

              <div class="data-row">
                <span>Base</span>
                <span id="calcBase">—</span>
              </div>

              <div class="data-row">
                <span>Equipment</span>
                <span id="calcEquipment">—</span>
              </div>

              <div class="data-row">
                <span>Hero Effects</span>
                <span id="calcHeroEffects">—</span>
              </div>

              <div class="data-row">
                <span>Passives</span>
                <span id="calcPassives">—</span>
              </div>

            </div>

          </div>
        `)}

      </div>

    </div>
  `;

  const heroSelect =
    document.getElementById("calcHero");

  heroSelect.addEventListener("change", () => {
    calculatorState.hero =
      heroSelect.value;

    renderCalculatorState();
  });

  document
    .getElementById("resetCalc")
    .addEventListener("click", () => {

      calculatorState.slots =
        [null, null, null, null, null, null];

      renderCalculatorState();

      toastMessage("Build reset.");
    });

  renderCalculatorState();
}

function renderCalculatorState() {

  const slotBox =
    document.getElementById("calcSlots");

  const picker =
    document.getElementById("itemPicker");

  const stats =
    document.getElementById("calcStats");

  const hero =
    DATA.heroes.find(
      h => h.slug === calculatorState.hero
    );

  slotBox.innerHTML =
    calculatorState.slots.map(
      (itemSlug, index) => {

        const item =
          DATA.equipment.find(
            i => i.slug === itemSlug
          );

        return `
          <button
            class="calc-slot ${item ? "selected" : ""}"
            onclick="selectCalcSlot(${index})"
          >

            ${
              item
                ? esc(item.icon)
                : "+"
            }

            ${
              item
                ? `
                  <button
                    class="slot-remove"
                    onclick="event.stopPropagation();removeCalcSlot(${index})"
                  >
                    ×
                  </button>
                `
                : ""
            }

          </button>
        `;
      }
    ).join("");

  picker.innerHTML = `
    <div class="section-head">
      <div>
        <h3>Select Equipment</h3>
        <p>Tap an item to put it in the selected slot.</p>
      </div>
    </div>

    <div
      style="
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:8px;
      "
    >

      ${DATA.equipment.map(item => `
        <button
          class="item-card"
          onclick="chooseCalculatorItem('${item.slug}')"
        >

          <div
            class="item-icon"
            style="width:46px;height:46px;font-size:12px"
          >
            ${esc(item.icon)}
          </div>

          <strong style="font-size:11px">
            ${esc(item.name)}
          </strong>

        </button>
      `).join("")}

    </div>
  `;

  const statNames = [
    "HP",
    "Physical Attack",
    "Magic Attack",
    "Physical Defense",
    "Magic Defense",
    "Attack Speed",
    "Movement Speed",
    "Cooldown",
    "Crit",
    "Physical Pierce",
    "Magic Pierce"
  ];

  stats.innerHTML =
    statNames.map(name => {

      let value = "—";

      if (
        hero &&
        hero.stats[name] !== undefined
      ) {
        value = hero.stats[name];
      }

      return `
        <div class="calc-stat">
          <span>${esc(name)}</span>
          <strong>${esc(value)}</strong>
        </div>
      `;

    }).join("");

  document.getElementById("calcBase")
    .textContent = hero ? "Available" : "—";

  document.getElementById("calcEquipment")
    .textContent =
      calculatorState.slots.filter(Boolean).length
      ? "Pending"
      : "None";

  document.getElementById("calcHeroEffects")
    .textContent = "Pending";

  document.getElementById("calcPassives")
    .textContent = "Pending";
}

let selectedCalcSlot = 0;

function selectCalcSlot(index) {
  selectedCalcSlot = index;
  toastMessage(`Slot ${index + 1} selected.`);
}

function chooseCalculatorItem(slug) {

  calculatorState.slots[selectedCalcSlot] =
    slug;

  renderCalculatorState();

  toastMessage(
    `Added to slot ${selectedCalcSlot + 1}.`
  );
}

function removeCalcSlot(index) {

  calculatorState.slots[index] = null;

  renderCalculatorState();
}


/* =========================================================
   META
========================================================= */

function renderMeta() {

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        "META",
        "Meta",
        "Regional and patch-specific performance data will come from verified sources."
      )}

      ${demoNote(
        "No live win-rate data is being fabricated."
      )}

      ${panel(`
        <div class="panel-pad">

          <div class="section-head">
            <div>
              <h2>Meta Overview</h2>
              <p>Role-based structure.</p>
            </div>

            <select class="select">
              <option>International</option>
              <option>Vietnam</option>
              <option>Malaysia</option>
              <option>Indonesia</option>
              <option>Philippines</option>
            </select>
          </div>

          <div class="table-scroll" style="overflow-x:auto">

            <table class="meta-table">

              <thead>
                <tr>
                  <th>Hero</th>
                  <th>Role</th>
                  <th>Win Rate</th>
                  <th>Pick Rate</th>
                  <th>Ban Rate</th>
                  <th>Trend</th>
                </tr>
              </thead>

              <tbody>

                ${DATA.heroes.map(h => `
                  <tr>

                    <td>
                      <strong>${esc(h.name)}</strong>
                    </td>

                    <td>${esc(h.role)}</td>

                    <td>—</td>
                    <td>—</td>
                    <td>—</td>

                    <td>
                      ${tag("PENDING")}
                    </td>

                  </tr>
                `).join("")}

              </tbody>

            </table>

          </div>

        </div>
      `)}

    </div>
  `;
}


/* =========================================================
   PATCHES
========================================================= */

function renderPatches() {

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        "PATCH CENTER",
        "Patches",
        "Live updates and historical changes are kept separately."
      )}

      <div class="content-grid">

        ${DATA.patches.map(p => `
          <a
            class="content-card"
            href="index.html?page=patch&slug=${encodeURIComponent(p.slug)}"
          >

            <div class="visual"></div>

            <div class="content-card-body">

              ${tag(p.version, true)}

              <h3>${esc(p.title)}</h3>

              <p>
                ${esc(p.summary)}
              </p>

              <div class="content-card-meta">
                ${tag(p.date)}
                <span style="color:var(--green)">→</span>
              </div>

            </div>

          </a>
        `).join("")}

      </div>

    </div>
  `;
}

function renderPatchDetail(slug) {

  const patch =
    DATA.patches.find(
      p => p.slug === slug
    );

  if (!patch) {
    renderNotFound("Patch");
    return;
  }

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        "PATCH",
        patch.title,
        patch.summary
      )}

      ${panel(`
        <div class="panel-pad">

          ${demoNote(
            "Official patch content will be populated from verified sources."
          )}

          <div class="data-list">

            <div class="data-row">
              <span>Version</span>
              <span>${esc(patch.version)}</span>
            </div>

            <div class="data-row">
              <span>Date</span>
              <span>${esc(patch.date)}</span>
            </div>

            <div class="data-row">
              <span>Hero changes</span>
              <span>Pending</span>
            </div>

            <div class="data-row">
              <span>Equipment changes</span>
              <span>Pending</span>
            </div>

            <div class="data-row">
              <span>System changes</span>
              <span>Pending</span>
            </div>

          </div>

        </div>
      `)}

    </div>
  `;
}


/* =========================================================
   GUIDES
========================================================= */

function renderGuides() {

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        "GUIDE HUB",
        "Guides",
        "From quick explanations to deeper strategy."
      )}

      <div class="content-grid">

        ${DATA.guides.map(g => `
          <a
            class="content-card"
            href="index.html?page=guide&slug=${encodeURIComponent(g.slug)}"
          >

            <div class="visual"></div>

            <div class="content-card-body">

              ${tag(g.category, true)}

              <h3>${esc(g.title)}</h3>

              <p>${esc(g.summary)}</p>

              <div class="content-card-meta">
                ${tag("Guide")}
                <span style="color:var(--green)">→</span>
              </div>

            </div>

          </a>
        `).join("")}

      </div>

    </div>
  `;
}

function renderGuideDetail(slug) {

  const guide =
    DATA.guides.find(
      g => g.slug === slug
    );

  if (!guide) {
    renderNotFound("Guide");
    return;
  }

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        guide.category,
        guide.title,
        guide.summary
      )}

      <div class="detail-grid">

        <article class="panel">
          <div class="panel-pad">

            ${demoNote()}

            <h2>Overview</h2>

            <p class="muted">
              ${esc(guide.summary)}
            </p>

            <p class="muted">
              This content area is ready for full guide
              articles, images, tables, item builds,
              skill explanations and patch-specific notes.
            </p>

            <h3>Structure</h3>

            <ul class="muted">
              <li>Context</li>
              <li>Core concepts</li>
              <li>Practical examples</li>
              <li>Patch relevance</li>
              <li>Related builds</li>
            </ul>

          </div>
        </article>

        <aside class="detail-stack">

          ${panel(`
            <div class="panel-pad">

              <h3>Guide Info</h3>

              <div class="data-list">

                <div class="data-row">
                  <span>Category</span>
                  <span>${esc(guide.category)}</span>
                </div>

                <div class="data-row">
                  <span>Patch</span>
                  <span>Pending</span>
                </div>

                <div class="data-row">
                  <span>Author</span>
                  <span>HoKStat</span>
                </div>

              </div>

            </div>
          `)}

        </aside>

      </div>

    </div>
  `;
}


/* =========================================================
   NEWS
========================================================= */

function renderNews() {

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        "NEWS",
        "News",
        "Official announcements, coming-soon content and clearly labelled unconfirmed information."
      )}

      <div class="content-grid">

        ${DATA.news.map(n => `
          <article class="content-card">

            <div class="visual"></div>

            <div class="content-card-body">

              ${tag(n.category, true)}

              <h3>${esc(n.title)}</h3>

              <p>${esc(n.summary)}</p>

              <div class="content-card-meta">
                ${tag(n.date)}
              </div>

            </div>

          </article>
        `).join("")}

      </div>

    </div>
  `;
}


/* =========================================================
   COMMUNITY
========================================================= */

function renderCommunity() {

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        "COMMUNITY",
        "Community",
        "Questions, answers and discussions."
      )}

      <div class="toolbar">

        <input
          class="input"
          id="questionSearch"
          placeholder="Search questions..."
        >

        <button
          class="btn btn-primary"
          onclick="toastMessage('Login system will be connected later.')"
        >
          Ask Question
        </button>

      </div>

      <div
        class="question-list"
        id="questionList"
      ></div>

    </div>
  `;

  const input =
    document.getElementById("questionSearch");

  const list =
    document.getElementById("questionList");

  function draw() {

    const q =
      input.value.trim().toLowerCase();

    const rows =
      DATA.questions.filter(x =>
        `${x.title} ${x.category}`
          .toLowerCase()
          .includes(q)
      );

    list.innerHTML = rows.map(x => `
      <article class="question-row">

        <div class="vote-box">
          <strong>${x.votes}</strong>
          <small>votes</small>
        </div>

        <div>

          ${tag(x.category, true)}

          <h3>${esc(x.title)}</h3>

          <p>
            ${x.answers} answers
          </p>

        </div>

        <button
          class="btn btn-small"
          onclick="toastMessage('Question detail system ready for backend.')"
        >
          Open
        </button>

      </article>
    `).join("");

  }

  input.addEventListener("input", draw);

  draw();
}


/* =========================================================
   ABOUT / DATA
========================================================= */

function renderAbout() {

  app.innerHTML = `
    <div class="page">

      ${pageHead(
        "ABOUT",
        "HoKStat.gg",
        "An independent Honor of Kings database, tools and community project."
      )}

      <div class="info-grid">

        ${panel(`
          <div class="panel-pad info-card">

            <h3>What is HoKStat?</h3>

            <p>
              HoKStat.gg is designed as a living database
              and utility platform for Heroes, Equipment,
              Builds, Calculator, Meta, Patches, Guides,
              News and Community.
            </p>

          </div>
        `)}

        ${panel(`
          <div class="panel-pad info-card">

            <h3>Data Method</h3>

            <p>
              Live data should come from official or
              verified sources.
            </p>

            <p>
              Test-server information is kept separate
              from Live data.
            </p>

          </div>
        `)}

        ${panel(`
          <div class="panel-pad info-card">

            <h3>Independent Project</h3>

            <p>
              HoKStat.gg is an independent community
              project and is not an official Honor of Kings
              website.
            </p>

          </div>
        `)}

      </div>


      <section class="section">

        ${panel(`
          <div class="panel-pad">

            <div class="section-head">
              <div>
                <h2>Data Verification Pipeline</h2>
                <p>Designed to reduce manual checking.</p>
              </div>
            </div>

            <div class="info-grid">

              <div class="info-card">
                <h3>01 · Collect</h3>
                <p>
                  Official source → collector.
                </p>
              </div>

              <div class="info-card">
                <h3>02 · Compare</h3>
                <p>
                  Current database → detected changes.
                </p>
              </div>

              <div class="info-card">
                <h3>03 · Validate</h3>
                <p>
                  Structure, consistency and anomaly checks.
                </p>
              </div>

              <div class="info-card">
                <h3>04 · Approve</h3>
                <p>
                  High-confidence live data can be updated automatically.
                </p>
              </div>

              <div class="info-card">
                <h3>05 · Log</h3>
                <p>
                  Every accepted change receives a change record.
                </p>
              </div>

              <div class="info-card">
                <h3>06 · Rollback</h3>
                <p>
                  Raw snapshots support recovery.
                </p>
              </div>

            </div>

          </div>
        `)}

      </section>

    </div>
  `;
}


/* =========================================================
   GLOBAL SEARCH
========================================================= */

function openSearch() {

  const overlay =
    document.getElementById("searchOverlay");

  const input =
    document.getElementById("globalSearchInput");

  overlay.classList.add("open");

  document.body.classList.add("modal-open");

  setTimeout(() => input.focus(), 50);
}

function closeSearch() {

  document
    .getElementById("searchOverlay")
    .classList.remove("open");

  document.body.classList.remove("modal-open");
}

function performGlobalSearch(query) {

  const results =
    document.getElementById("searchResults");

  const q =
    query.trim().toLowerCase();

  if (!q) {
    results.innerHTML = "";
    return;
  }

  const found = [];

  DATA.heroes.forEach(h => {

    if (
      `${h.name} ${h.role} ${h.lane}`
        .toLowerCase()
        .includes(q)
    ) {

      found.push({
        type: "Hero",
        title: h.name,
        url:
          `index.html?page=hero&slug=${h.slug}`
      });

    }

  });

  DATA.equipment.forEach(i => {

    if (
      `${i.name} ${i.type}`
        .toLowerCase()
        .includes(q)
    ) {

      found.push({
        type: "Equipment",
        title: i.name,
        url:
          `index.html?page=item&slug=${i.slug}`
      });

    }

  });

  DATA.builds.forEach(b => {

    if (
      `${b.name} ${b.hero}`
        .toLowerCase()
        .includes(q)
    ) {

      found.push({
        type: "Build",
        title: b.name,
        url:
          `index.html?page=build&slug=${b.slug}`
      });

    }

  });

  DATA.guides.forEach(g => {

    if (
      `${g.title} ${g.category}`
        .toLowerCase()
        .includes(q)
    ) {

      found.push({
        type: "Guide",
        title: g.title,
        url:
          `index.html?page=guide&slug=${g.slug}`
      });

    }

  });

  results.innerHTML = found.length
    ? found.slice(0, 12).map(r => `
        <a
          href="${r.url}"
          class="news-row"
        >

          <div class="news-thumb"></div>

          <div>
            ${tag(r.type, true)}
            <strong>${esc(r.title)}</strong>
          </div>

          <span style="color:var(--green)">
            →
          </span>

        </a>
      `).join("")
    : `
      <div class="empty-state">
        <h3>No results</h3>
        <p>
          Try a hero, item, build or guide name.
        </p>
      </div>
    `;
}


/* =========================================================
   NOT FOUND
========================================================= */

function renderNotFound(type = "Page") {

  app.innerHTML = `
    <div class="page">

      <div class="empty-state">

        <div class="eyebrow">
          404
        </div>

        <h3>${esc(type)} not found</h3>

        <p>
          The requested record does not exist in the current dataset.
        </p>

        <div style="margin-top:20px">

          <a
            class="btn btn-primary"
            href="index.html"
          >
            Return Home
          </a>

        </div>

      </div>

    </div>
  `;
}


/* =========================================================
   MOBILE MENU
========================================================= */

function setupMobileMenu() {

  const menu =
    document.getElementById("mobileMenu");

  const overlay =
    document.getElementById("mobileOverlay");

  const open =
    () => {
      menu.classList.add("open");
      overlay.classList.add("open");
    };

  const close =
    () => {
      menu.classList.remove("open");
      overlay.classList.remove("open");
    };

  document
    .getElementById("mobileMenuBtn")
    .addEventListener("click", open);

  document
    .getElementById("closeMobileMenu")
    .addEventListener("click", close);

  overlay.addEventListener("click", close);

  menu.querySelectorAll("a")
    .forEach(a =>
      a.addEventListener("click", close)
    );
}


/* =========================================================
   SEARCH SETUP
========================================================= */

function setupSearch() {

  document
    .getElementById("globalSearchBtn")
    .addEventListener(
      "click",
      openSearch
    );

  document
    .getElementById("closeSearch")
    .addEventListener(
      "click",
      closeSearch
    );

  document
    .getElementById("searchOverlay")
    .addEventListener("click", e => {

      if (
        e.target.id === "searchOverlay"
      ) {
        closeSearch();
      }

    });

  document
    .getElementById("globalSearchInput")
    .addEventListener(
      "input",
      e => performGlobalSearch(e.target.value)
    );

  document.addEventListener("keydown", e => {

    if (e.key === "Escape") {
      closeSearch();
    }

    if (
      (e.ctrlKey || e.metaKey) &&
      e.key.toLowerCase() === "k"
    ) {

      e.preventDefault();

      openSearch();
    }

  });
}


/* =========================================================
   PAGE ROUTER
========================================================= */

function renderPage() {

  const page = getPage();
  const slug = getSlug();

  switch (page) {

    case "home":
      renderHome();
      break;

    case "heroes":
      renderHeroes();
      break;

    case "hero":
      renderHeroDetail(slug);
      break;

    case "equipment":
      renderEquipment();
      break;

    case "item":
      renderItemDetail(slug);
      break;

    case "builds":
      renderBuilds();
      break;

    case "build":
      renderBuildDetail(slug);
      break;

    case "calculator":
      renderCalculator();
      break;

    case "meta":
      renderMeta();
      break;

    case "patches":
      renderPatches();
      break;

    case "patch":
      renderPatchDetail(slug);
      break;

    case "guides":
      renderGuides();
      break;

    case "guide":
      renderGuideDetail(slug);
      break;

    case "news":
      renderNews();
      break;

    case "community":
      renderCommunity();
      break;

    case "about":
      renderAbout();
      break;

    default:
      renderNotFound();
  }

  window.scrollTo(0, 0);
}


/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  setupMobileMenu();
  setupSearch();
  renderPage();

});
