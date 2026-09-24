/* =========================================================
   HoKStat.gg — Frontend v1
   Database-ready architecture
========================================================= */


/* =========================
   MOCK DATA
   Replace with API later.
========================= */

const HEROES = [
  {
    id: "dun",
    name: "Dun",
    role: "tank",
    lane: "clash",
    difficulty: "Medium",
    description: "A durable Clash Lane hero built around sustained frontline pressure."
  },
  {
    id: "arthur",
    name: "Arthur",
    role: "fighter",
    lane: "clash",
    difficulty: "Easy",
    description: "A straightforward fighter with strong frontline utility."
  },
  {
    id: "diaochan",
    name: "Diao Chan",
    role: "mage",
    lane: "mid",
    difficulty: "Hard",
    description: "A mobile mage focused on ability timing and sustained magic damage."
  }
];


const EQUIPMENT = [
  {
    id: "item-01",
    name: "Defensive Core",
    type: "defense",
    price: 2100,
    description: "Example defensive equipment."
  },
  {
    id: "item-02",
    name: "Warrior Edge",
    type: "attack",
    price: 2300,
    description: "Example physical attack equipment."
  },
  {
    id: "item-03",
    name: "Arcane Guard",
    type: "magic",
    price: 2000,
    description: "Example magical defense equipment."
  },
  {
    id: "item-04",
    name: "Swift Boots",
    type: "movement",
    price: 900,
    description: "Example movement equipment."
  },
  {
    id: "item-05",
    name: "Iron Barrier",
    type: "defense",
    price: 1950,
    description: "Example armor equipment."
  },
  {
    id: "item-06",
    name: "Vital Core",
    type: "defense",
    price: 2200,
    description: "Example HP equipment."
  }
];


/* =========================================================
   HOMEPAGE SLIDER
========================================================= */

const SLIDES = [
  {
    type: "FEATURED HERO",
    title: "Dun",
    subtitle: "Tank · Clash Lane",
    description: "Explore hero stats, skills, builds and everything you need to understand Dun.",
    button: "Explore Hero",
    page: "heroes",
    secondary: "View Database",
    background: "hero"
  },
  {
    type: "FEATURED BUILD",
    title: "Standard Tank",
    subtitle: "Dun · 6 Equipment",
    description: "A balanced defensive setup ready to test in the equipment calculator.",
    button: "Try Build",
    page: "calculator",
    secondary: "View Builds",
    background: "build"
  },
  {
    type: "PATCH UPDATE",
    title: "Patch Center",
    subtitle: "Official · Structured",
    description: "Track official updates, hero changes, equipment changes and historical versions.",
    button: "View Patches",
    page: "patches",
    secondary: "Change History",
    background: "patch"
  },
  {
    type: "EQUIPMENT",
    title: "Equipment",
    subtitle: "Stats · Passives · Build Paths",
    description: "Browse equipment and understand exactly how each item contributes to a build.",
    button: "Explore Equipment",
    page: "equipment",
    secondary: "Open Calculator",
    background: "equipment"
  },
  {
    type: "GUIDE",
    title: "Guides",
    subtitle: "Beginner → Advanced",
    description: "Practical knowledge, hero fundamentals, gameplay concepts and advanced strategies.",
    button: "Read Guides",
    page: "guides",
    secondary: "Explore Heroes",
    background: "guide"
  },
  {
    type: "COMMUNITY",
    title: "Community",
    subtitle: "Questions · Answers · Discussion",
    description: "Ask questions, share knowledge and discover community resources.",
    button: "Join Community",
    page: "community",
    secondary: "Global Search",
    background: "community"
  }
];


let currentSlide = 0;
let slideTimer = null;


const heroBackground = document.getElementById("heroBackground");
const slideType = document.getElementById("slideType");
const slideTitle = document.getElementById("slideTitle");
const slideSubtitle = document.getElementById("slideSubtitle");
const slideDescription = document.getElementById("slideDescription");
const slideCounter = document.getElementById("slideCounter");
const slidePrimaryButton = document.getElementById("slidePrimaryButton");
const slideSecondaryButton = document.getElementById("slideSecondaryButton");
const sliderDots = document.getElementById("sliderDots");


function createSliderDots() {

  sliderDots.innerHTML = "";

  SLIDES.forEach((_, index) => {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "slider-dot";
    button.setAttribute("aria-label", `Go to slide ${index + 1}`);

    button.addEventListener("click", () => {
      currentSlide = index;
      renderSlide();
      restartSlider();
    });

    sliderDots.appendChild(button);

  });
}


function getBackground(slide) {

  const backgrounds = {
    hero:
      "radial-gradient(circle at 72% 35%, rgba(32,200,120,.2), transparent 30%), linear-gradient(100deg,#06090f 5%,rgba(6,9,15,.82) 40%,rgba(8,20,29,.12) 85%), linear-gradient(145deg,#19364b,#05090f 70%)",

    build:
      "radial-gradient(circle at 75% 40%,rgba(32,200,120,.18),transparent 25%), linear-gradient(100deg,#06090f 5%,rgba(6,9,15,.86) 42%,rgba(8,20,29,.15) 85%), linear-gradient(145deg,#1a293e,#05090f 70%)",

    patch:
      "radial-gradient(circle at 70% 35%,rgba(120,150,190,.12),transparent 25%), linear-gradient(100deg,#06090f 5%,rgba(6,9,15,.9) 45%,rgba(8,20,29,.2) 85%), linear-gradient(145deg,#182638,#05090f 70%)",

    equipment:
      "radial-gradient(circle at 75% 30%,rgba(32,200,120,.13),transparent 25%), linear-gradient(100deg,#06090f 5%,rgba(6,9,15,.9) 45%,rgba(8,20,29,.2) 85%), linear-gradient(145deg,#263344,#05090f 70%)",

    guide:
      "radial-gradient(circle at 70% 40%,rgba(32,200,120,.12),transparent 25%), linear-gradient(100deg,#06090f 5%,rgba(6,9,15,.9) 45%,rgba(8,20,29,.2) 85%), linear-gradient(145deg,#203548,#05090f 70%)",

    community:
      "radial-gradient(circle at 75% 30%,rgba(32,200,120,.15),transparent 25%), linear-gradient(100deg,#06090f 5%,rgba(6,9,15,.9) 45%,rgba(8,20,29,.2) 85%), linear-gradient(145deg,#172b3d,#05090f 70%)"
  };

  return backgrounds[slide.background] || backgrounds.hero;
}


function renderSlide() {

  const slide = SLIDES[currentSlide];

  slideType.textContent = slide.type;
  slideTitle.textContent = slide.title;
  slideSubtitle.textContent = slide.subtitle;
  slideDescription.textContent = slide.description;

  slideCounter.textContent =
    `${String(currentSlide + 1).padStart(2, "0")} / ${String(SLIDES.length).padStart(2, "0")}`;

  heroBackground.style.background = getBackground(slide);

  slidePrimaryButton.textContent = slide.button;
  slideSecondaryButton.textContent = slide.secondary;

  slidePrimaryButton.dataset.page = slide.page;

  if (slide.page) {
    slideSecondaryButton.dataset.page =
      slide.page === "calculator" ? "builds" :
      slide.page === "heroes" ? "equipment" :
      slide.page;
  }

  [...sliderDots.children].forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}


function nextSlide() {

  currentSlide = (currentSlide + 1) % SLIDES.length;

  renderSlide();
}


function previousSlide() {

  currentSlide =
    (currentSlide - 1 + SLIDES.length) % SLIDES.length;

  renderSlide();
}


function restartSlider() {

  clearInterval(slideTimer);

  slideTimer = setInterval(() => {

    nextSlide();

  }, 6500);

}


document.getElementById("slideNext").addEventListener("click", () => {

  nextSlide();
  restartSlider();

});


document.getElementById("slidePrev").addEventListener("click", () => {

  previousSlide();
  restartSlider();

});


createSliderDots();
renderSlide();
restartSlider();


/* Pause while pointer is over cinematic hero */

const cinematicHero = document.querySelector(".cinematic-hero");

cinematicHero.addEventListener("mouseenter", () => {
  clearInterval(slideTimer);
});

cinematicHero.addEventListener("mouseleave", restartSlider);


/* =========================================================
   PAGE ROUTING
========================================================= */

const pages = document.querySelectorAll(".page");


function showPage(pageName) {

  const target = document.getElementById(`page-${pageName}`);

  if (!target) {
    return;
  }

  pages.forEach(page => {
    page.classList.remove("active");
  });

  target.classList.add("active");

  document.querySelectorAll("[data-page]").forEach(link => {

    link.classList.toggle(
      "active",
      link.dataset.page === pageName
    );

  });

  closeMenu();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


function handleRoute() {

  const route =
    window.location.hash.replace("#", "") || "home";

  showPage(route);

}


window.addEventListener("hashchange", handleRoute);


document.addEventListener("click", event => {

  const button = event.target.closest("[data-page]");

  if (!button) {
    return;
  }

  const page = button.dataset.page;

  if (!page) {
    return;
  }

  window.location.hash = page;

});


handleRoute();


/* =========================================================
   MOBILE MENU
========================================================= */

const sideMenu = document.getElementById("sideMenu");
const menuOverlay = document.getElementById("menuOverlay");


function openMenu() {

  sideMenu.classList.add("open");
  menuOverlay.classList.add("open");

  sideMenu.setAttribute("aria-hidden", "false");

}


function closeMenu() {

  sideMenu.classList.remove("open");
  menuOverlay.classList.remove("open");

  sideMenu.setAttribute("aria-hidden", "true");

}


document.getElementById("menuToggle")
  .addEventListener("click", openMenu);


document.getElementById("menuClose")
  .addEventListener("click", closeMenu);


menuOverlay.addEventListener("click", closeMenu);


/* =========================================================
   GLOBAL SEARCH
========================================================= */

const searchOverlay = document.getElementById("searchOverlay");
const globalSearchInput = document.getElementById("globalSearchInput");
const searchResults = document.getElementById("searchResults");


let searchType = "all";


function openSearch(value = "") {

  searchOverlay.classList.add("open");
  searchOverlay.setAttribute("aria-hidden", "false");

  globalSearchInput.value = value;

  setTimeout(() => {
    globalSearchInput.focus();
    performSearch();
  }, 50);

}


function closeSearch() {

  searchOverlay.classList.remove("open");
  searchOverlay.setAttribute("aria-hidden", "true");

}


document.getElementById("globalSearchButton")
  .addEventListener("click", () => openSearch());


document.getElementById("searchClose")
  .addEventListener("click", closeSearch);


searchOverlay.addEventListener("click", event => {

  if (event.target === searchOverlay) {
    closeSearch();
  }

});


document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeSearch();
    closeMenu();
  }

});


document.querySelectorAll("[data-search-type]").forEach(button => {

  button.addEventListener("click", () => {

    searchType = button.dataset.searchType;

    document.querySelectorAll("[data-search-type]").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    performSearch();

  });

});


function getSearchData() {

  return [

    ...HEROES.map(hero => ({
      type: "heroes",
      title: hero.name,
      description: `${hero.role} · ${hero.lane}`,
      page: "heroes"
    })),

    ...EQUIPMENT.map(item => ({
      type: "equipment",
      title: item.name,
      description: `${item.type} · ${item.price} gold`,
      page: "equipment"
    })),

    {
      type: "builds",
      title: "Dun Standard Tank",
      description: "Recommended Build",
      page: "builds"
    },

    {
      type: "guides",
      title: "Dun Fundamentals",
      description: "Hero Guide",
      page: "guides"
    },

    {
      type: "news",
      title: "Latest Official Announcement",
      description: "Official News",
      page: "news"
    }

  ];

}


function performSearch() {

  const query =
    globalSearchInput.value.trim().toLowerCase();

  if (!query) {

    searchResults.innerHTML = `
      <div class="search-empty">
        Start typing to search HoKStat.
      </div>
    `;

    return;
  }


  const data = getSearchData();

  const results = data.filter(item => {

    const matchesText =
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    const matchesType =
      searchType === "all" ||
      item.type === searchType;

    return matchesText && matchesType;

  });


  if (!results.length) {

    searchResults.innerHTML = `
      <div class="search-empty">
        <strong>No results found.</strong>
        <br>
        Try another name or category.
      </div>
    `;

    return;
  }


  searchResults.innerHTML = results
    .slice(0, 12)
    .map(item => `

      <button
        class="search-result"
        type="button"
        data-page="${item.page}"
      >

        <span>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.description)}</small>
        </span>

        <span>→</span>

      </button>

    `)
    .join("");

}


globalSearchInput.addEventListener(
  "input",
  performSearch
);


/* =========================================================
   HOME SEARCH
========================================================= */

const homeSearchInput =
  document.getElementById("homeSearchInput");


function runHomeSearch(value) {

  if (!value.trim()) {
    openSearch();
    return;
  }

  openSearch(value);

}


document.getElementById("homeSearchButton")
  .addEventListener("click", () => {

    runHomeSearch(homeSearchInput.value);

  });


homeSearchInput.addEventListener("keydown", event => {

  if (event.key === "Enter") {
    runHomeSearch(homeSearchInput.value);
  }

});


document.querySelectorAll("[data-search-suggestion]")
  .forEach(button => {

    button.addEventListener("click", () => {

      runHomeSearch(button.dataset.searchSuggestion);

    });

  });


/* =========================================================
   HERO DATABASE
========================================================= */

const heroGrid =
  document.getElementById("heroGrid");


function renderHeroes() {

  const search =
    document.getElementById("heroSearch").value
      .trim()
      .toLowerCase();

  const role =
    document.getElementById("heroRoleFilter").value;

  const lane =
    document.getElementById("heroLaneFilter").value;


  const filtered = HEROES.filter(hero => {

    const matchesSearch =
      !search ||
      hero.name.toLowerCase().includes(search);

    const matchesRole =
      role === "all" ||
      hero.role === role;

    const matchesLane =
      lane === "all" ||
      hero.lane === lane;

    return matchesSearch && matchesRole && matchesLane;

  });


  heroGrid.innerHTML = filtered.map(hero => `

    <article class="hero-card">

      <span class="panel-tag">
        ${escapeHtml(hero.role)}
      </span>

      <h3>${escapeHtml(hero.name)}</h3>

      <p>${escapeHtml(hero.description)}</p>

      <div class="hero-card-footer">
        <span>${escapeHtml(hero.lane)}</span>
        <span>${escapeHtml(hero.difficulty)}</span>
      </div>

    </article>

  `).join("");


  if (!filtered.length) {

    heroGrid.innerHTML = `
      <div class="empty-panel">
        No heroes found.
      </div>
    `;

  }

}


document.getElementById("heroSearch")
  .addEventListener("input", renderHeroes);


document.getElementById("heroRoleFilter")
  .addEventListener("change", renderHeroes);


document.getElementById("heroLaneFilter")
  .addEventListener("change", renderHeroes);


renderHeroes();


/* =========================================================
   EQUIPMENT DATABASE
========================================================= */

const equipmentGrid =
  document.getElementById("equipmentGrid");


function renderEquipment() {

  const search =
    document.getElementById("equipmentSearch").value
      .trim()
      .toLowerCase();

  const type =
    document.getElementById("equipmentTypeFilter").value;


  const filtered = EQUIPMENT.filter(item => {

    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(search);

    const matchesType =
      type === "all" ||
      item.type === type;

    return matchesSearch && matchesType;

  });


  equipmentGrid.innerHTML = filtered.map(item => `

    <article class="equipment-card">

      <div class="item-icon">
        ${item.id.slice(-2)}
      </div>

      <span class="panel-tag">${escapeHtml(item.type)}</span>

      <h3>${escapeHtml(item.name)}</h3>

      <p>${escapeHtml(item.description)}</p>

      <span class="item-price">
        ${Number(item.price).toLocaleString()} Gold
      </span>

    </article>

  `).join("");

}


document.getElementById("equipmentSearch")
  .addEventListener("input", renderEquipment);


document.getElementById("equipmentTypeFilter")
  .addEventListener("change", renderEquipment);


renderEquipment();


/* =========================================================
   CALCULATOR
========================================================= */

const calculatorSlots =
  document.getElementById("calculatorSlots");


const calculatorState = {
  hero: "dun",
  level: 15,
  items: [null, null, null, null, null, null]
};


function renderCalculatorSlots() {

  calculatorSlots.innerHTML =
    calculatorState.items.map((item, index) => {

      if (!item) {

        return `
          <button
            class="calc-slot"
            type="button"
            data-slot="${index}"
          >
            + Add Equipment
          </button>
        `;

      }

      return `
        <button
          class="calc-slot"
          type="button"
          data-slot="${index}"
        >
          ${escapeHtml(item.name)}
        </button>
      `;

    }).join("");


  calculatorSlots
    .querySelectorAll("[data-slot]")
    .forEach(slot => {

      slot.addEventListener("click", () => {

        const index =
          Number(slot.dataset.slot);

        openEquipmentPicker(index);

      });

    });

}


function openEquipmentPicker(index) {

  const current =
    calculatorState.items[index];

  const choice =
    window.prompt(
      `Enter equipment name:\n\n${EQUIPMENT.map(item => item.name).join("\n")}\n\nLeave blank to remove.`,
      current ? current.name : ""
    );


  if (choice === null) {
    return;
  }


  const normalized =
    choice.trim().toLowerCase();


  if (!normalized) {

    calculatorState.items[index] = null;

    renderCalculatorSlots();
    calculateStats();

    return;
  }


  const found =
    EQUIPMENT.find(item =>
      item.name.toLowerCase() === normalized
    );


  if (!found) {

    window.alert(
      "Equipment not found. Please enter one of the listed names."
    );

    return;
  }


  calculatorState.items[index] = found;

  renderCalculatorSlots();
  calculateStats();

}


function calculateStats() {

  const hero =
    HEROES.find(item =>
      item.id === calculatorState.hero
    ) || HEROES[0];


  const baseStats = {
    hp: hero.id === "dun" ? 8400 : 7000,
    attack: hero.id === "diaochan" ? 210 : 240,
    defense: hero.id === "dun" ? 180 : 140,
    magicDefense: hero.id === "dun" ? 120 : 110,
    move: 380,
    speed: 100
  };


  const equipmentStats = {
    hp: 0,
    attack: 0,
    defense: 0,
    magicDefense: 0,
    move: 0,
    speed: 0
  };


  calculatorState.items.forEach(item => {

    if (!item) {
      return;
    }

    if (item.type === "defense") {
      equipmentStats.hp += 450;
      equipmentStats.defense += 25;
    }

    if (item.type === "attack") {
      equipmentStats.attack += 55;
    }

    if (item.type === "magic") {
      equipmentStats.magicDefense += 35;
    }

    if (item.type === "movement") {
      equipmentStats.move += 40;
    }

  });


  const passive = {
    hp: 0,
    attack: 0,
    defense: 0,
    magicDefense: 0,
    move: 0,
    speed: 0
  };


  const finalStats = {

    hp:
      baseStats.hp +
      equipmentStats.hp +
      passive.hp,

    attack:
      baseStats.attack +
      equipmentStats.attack +
      passive.attack,

    defense:
      baseStats.defense +
      equipmentStats.defense +
      passive.defense,

    magicDefense:
      baseStats.magicDefense +
      equipmentStats.magicDefense +
      passive.magicDefense,

    move:
      baseStats.move +
      equipmentStats.move +
      passive.move,

    speed:
      baseStats.speed +
      equipmentStats.speed +
      passive.speed

  };


  document.getElementById("statHp").textContent =
    finalStats.hp.toLocaleString();

  document.getElementById("statAttack").textContent =
    finalStats.attack.toLocaleString();

  document.getElementById("statDefense").textContent =
    finalStats.defense.toLocaleString();

  document.getElementById("statMagicDefense").textContent =
    finalStats.magicDefense.toLocaleString();

  document.getElementById("statMove").textContent =
    finalStats.move.toLocaleString();

  document.getElementById("statSpeed").textContent =
    `${finalStats.speed}%`;


  document.getElementById("breakdownBase").textContent =
    "Base Hero";

  document.getElementById("breakdownEquipment").textContent =
    `+${equipmentStats.hp.toLocaleString()} HP`;

  document.getElementById("breakdownPassive").textContent =
    "+0";

  document.getElementById("breakdownFinal").textContent =
    finalStats.hp.toLocaleString();

}


document.getElementById("calculatorHero")
  .addEventListener("change", event => {

    calculatorState.hero = event.target.value;

    calculateStats();

  });


document.getElementById("calculatorLevel")
  .addEventListener("input", event => {

    let value =
      Number.parseInt(event.target.value, 10);

    if (!Number.isFinite(value)) {
      value = 1;
    }

    value = Math.max(1, Math.min(15, value));

    calculatorState.level = value;

    event.target.value = value;

    calculateStats();

  });


document.getElementById("calculateButton")
  .addEventListener("click", calculateStats);


document.getElementById("resetCalculator")
  .addEventListener("click", () => {

    calculatorState.items =
      [null, null, null, null, null, null];

    renderCalculatorSlots();
    calculateStats();

  });


document.getElementById("saveBuildButton")
  .addEventListener("click", () => {

    window.alert(
      "Save Build will connect to the user account system after Supabase integration."
    );

  });


renderCalculatorSlots();
calculateStats();


/* =========================================================
   AUTH DEMO
========================================================= */

document.getElementById("loginForm")
  .addEventListener("submit", event => {

    event.preventDefault();

    window.alert(
      "Frontend login demo complete. Authentication will be connected to Supabase later."
    );

  });


/* =========================================================
   LANGUAGE
========================================================= */

document.getElementById("languageSelect")
  .addEventListener("change", event => {

    const language = event.target.value;

    window.alert(
      `${language} selected. Full localization will be connected to the translation database later.`
    );

  });


/* =========================================================
   UTILITY
========================================================= */

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  }
