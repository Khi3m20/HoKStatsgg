/* =========================================================
   HoKStats.gg
   Main Frontend Application
   File: script.js

   Purpose:
   - SPA-style page navigation
   - Homepage cinematic slider
   - Global search
   - Hero / Equipment / Build rendering
   - Equipment calculator
   - Meta / Patch / News / Guide / Community pages
   - Local bookmarks
   - Mobile navigation
   - Modal / toast / tabs / filters
   - URL state
   - API-ready architecture

   IMPORTANT:
   This frontend intentionally contains no secret keys.
   Real official data should be connected through the API layer.
   ========================================================= */

"use strict";

/* =========================================================
   1. GLOBAL CONFIGURATION
   ========================================================= */

const HOKSTATS_CONFIG = {
    siteName: "HoKStats.gg",
    version: "0.1.0",
    defaultPage: "home",

    storageKeys: {
        bookmarks: "hokstats_bookmarks_v1",
        calculator: "hokstats_calculator_v1",
        language: "hokstats_language_v1",
        recentSearches: "hokstats_recent_searches_v1",
        sliderIndex: "hokstats_slider_index_v1"
    },

    slider: {
        interval: 6500,
        transition: 500
    },

    search: {
        maxSuggestions: 8,
        minCharacters: 1
    },

    calculator: {
        slots: 6
    },

    supportedLanguages: [
        "en",
        "vi",
        "zh",
        "fr",
        "ms",
        "id",
        "fil",
        "ja",
        "es"
    ]
};


/* =========================================================
   2. SAFE STORAGE HELPERS
   ========================================================= */

const Storage = {
    get(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);

            if (value === null) {
                return fallback;
            }

            return JSON.parse(value);
        } catch (error) {
            console.warn(`[HoKStats] Storage read failed: ${key}`, error);
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.warn(`[HoKStats] Storage write failed: ${key}`, error);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn(`[HoKStats] Storage remove failed: ${key}`, error);
        }
    }
};


/* =========================================================
   3. APPLICATION STATE
   ========================================================= */

const AppState = {
    page: HOKSTATS_CONFIG.defaultPage,

    currentHero: null,
    currentEquipment: null,
    currentBuild: null,

    language: Storage.get(
        HOKSTATS_CONFIG.storageKeys.language,
        "en"
    ),

    searchQuery: "",

    heroFilter: {
        role: "all",
        lane: "all",
        difficulty: "all",
        sort: "name"
    },

    equipmentFilter: {
        type: "all",
        sort: "name",
        query: ""
    },

    metaRole: "overview",

    communityFilter: "recent",

    calculator: {
        heroId: null,
        slots: Array(HOKSTATS_CONFIG.calculator.slots).fill(null)
    },

    bookmarks: Storage.get(
        HOKSTATS_CONFIG.storageKeys.bookmarks,
        []
    ),

    slider: {
        index: 0,
        timer: null,
        paused: false,
        initialized: false
    },

    mobileMenuOpen: false,

    searchOpen: false,

    modalOpen: false
};


/* =========================================================
   4. UTILITY FUNCTIONS
   ========================================================= */

const Utils = {

    escapeHTML(value) {
        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    slugify(value) {
        return String(value || "")
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    },

    formatNumber(value) {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "—";
        }

        return new Intl.NumberFormat("en-US").format(number);
    },

    formatPercent(value, decimals = 1) {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "—";
        }

        return `${number.toFixed(decimals)}%`;
    },

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    capitalize(value) {
        if (!value) {
            return "";
        }

        return value.charAt(0).toUpperCase() + value.slice(1);
    },

    debounce(callback, delay = 200) {
        let timeout;

        return (...args) => {
            clearTimeout(timeout);

            timeout = setTimeout(() => {
                callback(...args);
            }, delay);
        };
    },

    throttle(callback, delay = 100) {
        let waiting = false;

        return (...args) => {
            if (waiting) {
                return;
            }

            waiting = true;

            callback(...args);

            setTimeout(() => {
                waiting = false;
            }, delay);
        };
    },

    safeImage(url, fallback = "") {
        if (!url || typeof url !== "string") {
            return fallback;
        }

        return url;
    },

    getInitials(name) {
        return String(name || "")
            .split(" ")
            .map(part => part.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();
    },

    isMobile() {
        return window.matchMedia("(max-width: 768px)").matches;
    },

    prefersReducedMotion() {
        return window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
    },

    getQueryParams() {
        const params = new URLSearchParams(window.location.search);

        return {
            page: params.get("page"),
            slug: params.get("slug"),
            id: params.get("id"),
            query: params.get("q")
        };
    },

    updateURL(params = {}, replace = false) {
        const url = new URL(window.location.href);

        Object.entries(params).forEach(([key, value]) => {
            if (
                value === null ||
                value === undefined ||
                value === ""
            ) {
                url.searchParams.delete(key);
            } else {
                url.searchParams.set(key, value);
            }
        });

        if (replace) {
            history.replaceState({}, "", url);
        } else {
            history.pushState({}, "", url);
        }
    },

    scrollTop() {
        window.scrollTo({
            top: 0,
            behavior: Utils.prefersReducedMotion()
                ? "auto"
                : "smooth"
        });
    },

    wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }
};


/* =========================================================
   5. DEMO DATA LAYER
   =========================================================

   This is intentionally isolated.

   Later:
   API.getHeroes()
   API.getEquipment()
   API.getBuilds()
   etc.

   can replace these datasets without rewriting UI logic.
   ========================================================= */

const DATA = {

    heroes: [
        {
            id: "dun",
            slug: "dun",
            name: "Dun",
            role: "fighter",
            lane: "clash",
            difficulty: "medium",
            releaseDate: "2024-01-01",

            bio:
                "Dun is a durable fighter built around sustained combat, control and frontline pressure. His kit lets him stay involved in extended fights while creating opportunities for his team.",

            imageUrl: "",
            artUrl: "",

            stats: {
                hp: 3500,
                physicalAttack: 170,
                magicAttack: 0,
                physicalDefense: 145,
                magicDefense: 95,
                attackSpeed: 0.85,
                movementSpeed: 380,
                critRate: 0,
                cooldownReduction: 0
            },

            skills: [
                {
                    name: "Passive",
                    type: "passive",
                    description:
                        "A defensive combat effect that improves Dun's ability to survive prolonged engagements.",
                    iconUrl: ""
                },
                {
                    name: "Skill 1",
                    type: "active",
                    description:
                        "Dun attacks in a controlled area and applies pressure to nearby enemies.",
                    iconUrl: ""
                },
                {
                    name: "Skill 2",
                    type: "active",
                    description:
                        "Dun gains additional combat utility while continuing his frontline pressure.",
                    iconUrl: ""
                },
                {
                    name: "Ultimate",
                    type: "ultimate",
                    description:
                        "Dun engages from range and creates a strong opportunity for follow-up.",
                    iconUrl: ""
                }
            ],

            skins: [],

            patchHistory: [
                {
                    version: "1.0.0",
                    date: "2026-01-01",
                    description: "Initial database entry."
                }
            ]
        },

        {
            id: "loong",
            slug: "loong",
            name: "Loong",
            role: "marksman",
            lane: "farm",
            difficulty: "hard",
            releaseDate: "2024-02-01",

            bio:
                "Loong is a ranged damage dealer who relies on positioning, sustained attacks and careful ability usage to maintain pressure throughout a fight.",

            imageUrl: "",
            artUrl: "",

            stats: {
                hp: 2850,
                physicalAttack: 205,
                magicAttack: 0,
                physicalDefense: 85,
                magicDefense: 70,
                attackSpeed: 1.0,
                movementSpeed: 360,
                critRate: 0,
                cooldownReduction: 0
            },

            skills: [
                {
                    name: "Passive",
                    type: "passive",
                    description:
                        "Provides additional combat value through Loong's ranged attack pattern.",
                    iconUrl: ""
                },
                {
                    name: "Skill 1",
                    type: "active",
                    description:
                        "A ranged ability used for damage and lane pressure.",
                    iconUrl: ""
                },
                {
                    name: "Skill 2",
                    type: "active",
                    description:
                        "Adds another layer of ranged combat utility.",
                    iconUrl: ""
                },
                {
                    name: "Ultimate",
                    type: "ultimate",
                    description:
                        "A high-impact ranged ability that rewards good positioning.",
                    iconUrl: ""
                }
            ],

            skins: [],

            patchHistory: []
        },

        {
            id: "feyd",
            slug: "feyd",
            name: "Feyd",
            role: "assassin",
            lane: "jungle",
            difficulty: "hard",
            releaseDate: "2024-03-01",

            bio:
                "Feyd is an aggressive assassin focused on mobility, burst damage and finding isolated targets. He rewards precise timing and strong map awareness.",

            imageUrl: "",
            artUrl: "",

            stats: {
                hp: 3000,
                physicalAttack: 220,
                magicAttack: 0,
                physicalDefense: 90,
                magicDefense: 75,
                attackSpeed: 1.05,
                movementSpeed: 390,
                critRate: 0,
                cooldownReduction: 0
            },

            skills: [
                {
                    name: "Passive",
                    type: "passive",
                    description:
                        "Enhances Feyd's ability to create burst windows during combat.",
                    iconUrl: ""
                },
                {
                    name: "Skill 1",
                    type: "active",
                    description:
                        "A mobility-focused attack for engaging or repositioning.",
                    iconUrl: ""
                },
                {
                    name: "Skill 2",
                    type: "active",
                    description:
                        "Provides additional burst and target pressure.",
                    iconUrl: ""
                },
                {
                    name: "Ultimate",
                    type: "ultimate",
                    description:
                        "A high-impact assassination tool that rewards precise execution.",
                    iconUrl: ""
                }
            ],

            skins: [],

            patchHistory: []
        },

        {
            id: "ming",
            slug: "ming",
            name: "Ming",
            role: "support",
            lane: "roam",
            difficulty: "medium",
            releaseDate: "2024-04-01",

            bio:
                "Ming is a support hero centered around empowering allies, controlling fights and maintaining useful utility throughout team engagements.",

            imageUrl: "",
            artUrl: "",

            stats: {
                hp: 3150,
                physicalAttack: 120,
                magicAttack: 100,
                physicalDefense: 115,
                magicDefense: 110,
                attackSpeed: 0.85,
                movementSpeed: 370,
                critRate: 0,
                cooldownReduction: 0
            },

            skills: [
                {
                    name: "Passive",
                    type: "passive",
                    description:
                        "Provides supportive value during repeated engagements.",
                    iconUrl: ""
                },
                {
                    name: "Skill 1",
                    type: "active",
                    description:
                        "Provides utility for allies and pressure against enemies.",
                    iconUrl: ""
                },
                {
                    name: "Skill 2",
                    type: "active",
                    description:
                        "Adds additional teamfight utility.",
                    iconUrl: ""
                },
                {
                    name: "Ultimate",
                    type: "ultimate",
                    description:
                        "A major supportive ability used during important teamfights.",
                    iconUrl: ""
                }
            ],

            skins: [],

            patchHistory: []
        }
    ],


    equipment: [
        {
            id: "boots-of-deftness",
            slug: "boots-of-deftness",
            name: "Boots of Deftness",
            type: "boots",
            price: 710,
            iconUrl: "",
            description:
                "A movement-focused equipment option.",
            stats: {
                movementSpeed: 60
            },
            passives: [
                {
                    name: "Mobility",
                    description:
                        "Provides additional movement utility."
                }
            ]
        },

        {
            id: "storm-sword",
            slug: "storm-sword",
            name: "Storm Sword",
            type: "attack",
            price: 1950,
            iconUrl: "",
            description:
                "An offensive equipment item designed to increase physical pressure.",
            stats: {
                physicalAttack: 100,
                attackSpeed: 15
            },
            passives: [
                {
                    name: "Storm Edge",
                    description:
                        "Improves offensive pressure."
                }
            ]
        },

        {
            id: "guard-armor",
            slug: "guard-armor",
            name: "Guardian Armor",
            type: "defense",
            price: 2100,
            iconUrl: "",
            description:
                "A defensive item designed for frontline durability.",
            stats: {
                hp: 1000,
                physicalDefense: 120
            },
            passives: [
                {
                    name: "Guardian",
                    description:
                        "Improves survivability against physical pressure."
                }
            ]
        },

        {
            id: "arcane-mantle",
            slug: "arcane-mantle",
            name: "Arcane Mantle",
            type: "magic-defense",
            price: 2050,
            iconUrl: "",
            description:
                "A defensive option focused on magical resistance.",
            stats: {
                hp: 600,
                magicDefense: 120
            },
            passives: [
                {
                    name: "Arcane Ward",
                    description:
                        "Improves protection against magical damage."
                }
            ]
        },

        {
            id: "piercing-blade",
            slug: "piercing-blade",
            name: "Piercing Blade",
            type: "attack",
            price: 2200,
            iconUrl: "",
            description:
                "An offensive equipment item that provides physical penetration.",
            stats: {
                physicalAttack: 85,
                physicalPenetration: 45
            },
            passives: [
                {
                    name: "Pierce",
                    description:
                        "Improves physical penetration."
                }
            ]
        },

        {
            id: "critical-edge",
            slug: "critical-edge",
            name: "Critical Edge",
            type: "crit",
            price: 2300,
            iconUrl: "",
            description:
                "An offensive item focused on critical strike performance.",
            stats: {
                physicalAttack: 80,
                critRate: 25
            },
            passives: [
                {
                    name: "Critical Force",
                    description:
                        "Improves critical strike performance."
                }
            ]
        },

        {
            id: "mana-core",
            slug: "mana-core",
            name: "Mana Core",
            type: "magic",
            price: 1800,
            iconUrl: "",
            description:
                "A magic-focused equipment option.",
            stats: {
                magicAttack: 120,
                cooldownReduction: 10
            },
            passives: [
                {
                    name: "Arcane Power",
                    description:
                        "Improves magical ability output."
                }
            ]
        },

        {
            id: "swift-greaves",
            slug: "swift-greaves",
            name: "Swift Greaves",
            type: "boots",
            price: 710,
            iconUrl: "",
            description:
                "Lightweight boots focused on attack speed.",
            stats: {
                movementSpeed: 50,
                attackSpeed: 20
            },
            passives: []
        }
    ],


    builds: [
        {
            id: "dun-frontline",
            slug: "dun-frontline",
            name: "Frontline Dun",
            heroId: "dun",
            type: "recommended",
            description:
                "A durable setup designed for extended frontline engagements.",
            author: "HoKStats.gg",
            source: "HoKStats.gg",
            items: [
                "boots-of-deftness",
                "guard-armor",
                "arcane-mantle",
                "storm-sword",
                "piercing-blade",
                "critical-edge"
            ]
        },

        {
            id: "feyd-burst",
            slug: "feyd-burst",
            name: "Burst Feyd",
            heroId: "feyd",
            type: "recommended",
            description:
                "An aggressive physical-damage setup focused on burst pressure.",
            author: "HoKStats.gg",
            source: "HoKStats.gg",
            items: [
                "swift-greaves",
                "storm-sword",
                "piercing-blade",
                "critical-edge",
                "critical-edge",
                "storm-sword"
            ]
        }
    ],


    patches: [
        {
            id: "patch-1-0-0",
            version: "1.0.0",
            title: "Season Update",
            date: "2026-09-01",
            season: "Current Season",
            status: "current",
            summary:
                "Current game version information will be populated from verified official data.",
            source: "",
            heroChanges: [],
            equipmentChanges: [],
            systemChanges: [],
            newContent: []
        },

        {
            id: "patch-0-9-5",
            version: "0.9.5",
            title: "Previous Update",
            date: "2026-08-01",
            season: "Previous Season",
            status: "historical",
            summary:
                "Historical patch entry retained for comparison and reference.",
            source: "",
            heroChanges: [],
            equipmentChanges: [],
            systemChanges: [],
            newContent: []
        }
    ],


    news: [
        {
            id: "news-1",
            slug: "official-update",
            title: "Official Game Update",
            category: "OFFICIAL",
            status: "CONFIRMED",
            date: "2026-09-01",
            summary:
                "Official announcements and verified game updates will appear here.",
            content:
                "This content area is ready for verified official news.",
            imageUrl: "",
            source: ""
        },

        {
            id: "news-2",
            slug: "upcoming-content",
            title: "Upcoming Content",
            category: "COMING_SOON",
            status: "CONFIRMED",
            date: "2026-09-10",
            summary:
                "Officially announced future content can be tracked separately from live data.",
            content:
                "Future official content will be displayed here.",
            imageUrl: "",
            source: ""
        },

        {
            id: "news-3",
            slug: "community-rumor",
            title: "Community Rumor",
            category: "RUMOR",
            status: "UNCONFIRMED",
            date: "2026-09-12",
            summary:
                "Unconfirmed information is clearly separated from verified game data.",
            content:
                "This is an unconfirmed community report and does not affect the Live Database.",
            imageUrl: "",
            source: ""
        }
    ],


    guides: [
        {
            id: "guide-1",
            slug: "how-to-read-hero-stats",
            title: "How to Read Hero Stats",
            category: "BEGINNER",
            heroId: null,
            patchVersion: "1.0.0",
            author: "HoKStats.gg",
            summary:
                "Understand the most important hero statistics before comparing builds.",
            content:
                "Hero statistics provide the foundation for understanding how a hero scales and how equipment changes the final result.",
            imageUrl: ""
        },

        {
            id: "guide-2",
            slug: "dun-basics",
            title: "Dun Basics",
            category: "HERO",
            heroId: "dun",
            patchVersion: "1.0.0",
            author: "HoKStats.gg",
            summary:
                "A concise introduction to Dun's role, abilities and basic combat identity.",
            content:
                "Use the Hero page for the quick explanation. Deeper strategy belongs in Guides.",
            imageUrl: ""
        }
    ],


    meta: {
        overview: [
            {
                heroId: "dun",
                role: "fighter",
                winRate: null,
                pickRate: null,
                banRate: null,
                trend: "—"
            },
            {
                heroId: "loong",
                role: "marksman",
                winRate: null,
                pickRate: null,
                banRate: null,
                trend: "—"
            },
            {
                heroId: "feyd",
                role: "assassin",
                winRate: null,
                pickRate: null,
                banRate: null,
                trend: "—"
            },
            {
                heroId: "ming",
                role: "support",
                winRate: null,
                pickRate: null,
                banRate: null,
                trend: "—"
            }
        ],

        clash: [],
        jungle: [],
        mid: [],
        farm: [],
        roam: []
    },


    community: {
        questions: [
            {
                id: "q1",
                title: "How does the calculator handle equipment stats?",
                content:
                    "I want to understand how base stats and equipment stats are combined.",
                category: "CALCULATOR",
                author: "Community",
                answers: 2,
                votes: 5,
                date: "2026-09-20"
            },

            {
                id: "q2",
                title: "What is the difference between live and test data?",
                content:
                    "Does the database separate test-server values from live values?",
                category: "DATA",
                author: "Community",
                answers: 4,
                votes: 8,
                date: "2026-09-19"
            },

            {
                id: "q3",
                title: "Which equipment should I compare first?",
                content:
                    "Looking for a simple way to compare item stats.",
                category: "EQUIPMENT",
                author: "Community",
                answers: 1,
                votes: 3,
                date: "2026-09-18"
            }
        ]
    }
};


/* =========================================================
   6. API ABSTRACTION
   =========================================================

   Real backend can replace these functions later.

   No frontend secret/API key should ever be placed here.
   ========================================================= */

const API = {

    async getHeroes() {
        return DATA.heroes;
    },

    async getHero(slug) {
        return DATA.heroes.find(
            hero => hero.slug === slug
        ) || null;
    },

    async getEquipment() {
        return DATA.equipment;
    },

    async getEquipmentItem(slug) {
        return DATA.equipment.find(
            item => item.slug === slug
        ) || null;
    },

    async getBuilds() {
        return DATA.builds;
    },

    async getBuild(slug) {
        return DATA.builds.find(
            build => build.slug === slug
        ) || null;
    },

    async getPatches() {
        return DATA.patches;
    },

    async getNews() {
        return DATA.news;
    },

    async getGuides() {
        return DATA.guides;
    },

    async getMeta(role = "overview") {
        return DATA.meta[role] || [];
    },

    async getQuestions() {
        return DATA.community.questions;
    }
};


/* =========================================================
   7. DOM HELPERS
   ========================================================= */

const DOM = {

    app() {
        return document.querySelector("#app");
    },

    query(selector, root = document) {
        return root.querySelector(selector);
    },

    queryAll(selector, root = document) {
        return Array.from(root.querySelectorAll(selector));
    },

    create(tag, className = "", html = "") {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (html) {
            element.innerHTML = html;
        }

        return element;
    }
};


/* =========================================================
   8. TOAST SYSTEM
   ========================================================= */

const Toast = {

    show(message, type = "info", duration = 2800) {

        let root = document.querySelector("#toast-root");

        if (!root) {
            root = DOM.create("div", "toast-root");
            root.id = "toast-root";
            document.body.appendChild(root);
        }

        const toast = DOM.create(
            "div",
            `toast toast-${type}`
        );

        toast.setAttribute("role", "status");

        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-dot"></span>
                <span>${Utils.escapeHTML(message)}</span>
            </div>
            <button
                type="button"
                class="toast-close"
                aria-label="Close notification"
            >×</button>
        `;

        root.appendChild(toast);

        const close = () => {
            toast.classList.add("is-leaving");

            setTimeout(() => {
                toast.remove();
            }, 180);
        };

        toast
            .querySelector(".toast-close")
            ?.addEventListener("click", close);

        setTimeout(close, duration);
    }
};


/* =========================================================
   9. MODAL SYSTEM
   ========================================================= */

const Modal = {

    open(content, options = {}) {

        this.close();

        const overlay = DOM.create(
            "div",
            "modal-overlay"
        );

        overlay.id = "global-modal";

        overlay.innerHTML = `
            <div
                class="modal"
                role="dialog"
                aria-modal="true"
                aria-label="${Utils.escapeHTML(
                    options.title || "HoKStats"
                )}"
            >
                <div class="modal-header">
                    <div>
                        ${
                            options.eyebrow
                                ? `<div class="eyebrow">${Utils.escapeHTML(options.eyebrow)}</div>`
                                : ""
                        }

                        ${
                            options.title
                                ? `<h2>${Utils.escapeHTML(options.title)}</h2>`
                                : ""
                        }
                    </div>

                    <button
                        type="button"
                        class="modal-close"
                        data-modal-close
                        aria-label="Close"
                    >×</button>
                </div>

                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        AppState.modalOpen = true;

        overlay
            .querySelector("[data-modal-close]")
            ?.addEventListener("click", () => this.close());

        overlay.addEventListener("click", event => {
            if (event.target === overlay) {
                this.close();
            }
        });

        document.addEventListener(
            "keydown",
            this.keyHandler
        );
    },

    keyHandler(event) {
        if (event.key === "Escape") {
            Modal.close();
        }
    },

    close() {
        const modal = document.querySelector("#global-modal");

        if (modal) {
            modal.remove();
        }

        AppState.modalOpen = false;

        document.removeEventListener(
            "keydown",
            this.keyHandler
        );
    }
};


/* =========================================================
   10. BOOKMARK SYSTEM
   ========================================================= */

const Bookmarks = {

    makeKey(type, id) {
        return `${type}:${id}`;
    },

    isSaved(type, id) {
        const key = this.makeKey(type, id);

        return AppState.bookmarks.includes(key);
    },

    toggle(type, id) {

        const key = this.makeKey(type, id);

        const index = AppState.bookmarks.indexOf(key);

        if (index >= 0) {
            AppState.bookmarks.splice(index, 1);

            Toast.show(
                "Removed from bookmarks.",
                "info"
            );
        } else {
            AppState.bookmarks.push(key);

            Toast.show(
                "Saved to bookmarks.",
                "success"
            );
        }

        Storage.set(
            HOKSTATS_CONFIG.storageKeys.bookmarks,
            AppState.bookmarks
        );

        this.refreshButtons(type, id);
    },

    refreshButtons(type, id) {

        const saved = this.isSaved(type, id);

        DOM.queryAll(
            `[data-bookmark-type="${type}"][data-bookmark-id="${id}"]`
        ).forEach(button => {

            button.classList.toggle(
                "is-saved",
                saved
            );

            button.setAttribute(
                "aria-pressed",
                saved ? "true" : "false"
            );

            const label = button.querySelector(
                ".bookmark-label"
            );

            if (label) {
                label.textContent = saved
                    ? "Saved"
                    : "Save";
            }
        });
    }
};


/* =========================================================
   11. IMAGE / ARTWORK HELPERS
   ========================================================= */

const Media = {

    image(url, alt, className = "") {

        if (url) {
            return `
                <img
                    src="${Utils.escapeHTML(url)}"
                    alt="${Utils.escapeHTML(alt)}"
                    class="${Utils.escapeHTML(className)}"
                    loading="lazy"
                >
            `;
        }

        return `
            <div
                class="media-placeholder ${Utils.escapeHTML(className)}"
                role="img"
                aria-label="${Utils.escapeHTML(alt)}"
            >
                <div class="media-placeholder-grid"></div>
                <div class="media-placeholder-mark">
                    <span>HoK</span>
                    <small>ARTWORK</small>
                </div>
            </div>
        `;
    },

    icon(url, name, className = "") {

        if (url) {
            return `
                <img
                    src="${Utils.escapeHTML(url)}"
                    alt="${Utils.escapeHTML(name)}"
                    class="${Utils.escapeHTML(className)}"
                    loading="lazy"
                >
            `;
        }

        return `
            <div
                class="item-icon-placeholder ${Utils.escapeHTML(className)}"
                aria-label="${Utils.escapeHTML(name)}"
            >
                <span>${Utils.escapeHTML(
                    Utils.getInitials(name)
                )}</span>
            </div>
        `;
    }
};


/* =========================================================
   12. NAVIGATION
   ========================================================= */

const Navigation = {

    init() {

        document.addEventListener(
            "click",
            event => {

                const link = event.target.closest(
                    "[data-page]"
                );

                if (!link) {
                    return;
                }

                event.preventDefault();

                const page = link.dataset.page;

                const slug = link.dataset.slug || null;

                const id = link.dataset.id || null;

                this.go(page, {
                    slug,
                    id
                });
            }
        );

        window.addEventListener(
            "popstate",
            () => {
                this.loadFromURL();
            }
        );
    },

    async go(page, options = {}) {

        if (!page) {
            page = "home";
        }

        AppState.page = page;

        if (options.slug) {
            Utils.updateURL({
                page,
                slug: options.slug,
                id: options.id || null
            });
        } else {
            Utils.updateURL({
                page,
                slug: null,
                id: options.id || null
            });
        }

        this.closeMobileMenu();

        await Router.render();

        Utils.scrollTop();
    },

    loadFromURL() {

        const params = Utils.getQueryParams();

        if (!params.page) {
            AppState.page = "home";
        } else {
            AppState.page = params.page;
        }

        if (params.slug) {
            AppState.currentHero =
                DATA.heroes.find(
                    hero => hero.slug === params.slug
                ) || null;

            AppState.currentEquipment =
                DATA.equipment.find(
                    item => item.slug === params.slug
                ) || null;

            AppState.currentBuild =
                DATA.builds.find(
                    build => build.slug === params.slug
                ) || null;
        }

        Router.render();
    },

    closeMobileMenu() {

        AppState.mobileMenuOpen = false;

        document.body.classList.remove(
            "mobile-menu-open"
        );

        DOM.queryAll(
            ".mobile-menu-toggle, [data-mobile-menu-toggle]"
        ).forEach(button => {
            button.setAttribute(
                "aria-expanded",
                "false"
            );
        });

        const menu = DOM.query(
            "#mobile-menu"
        );

        if (menu) {
            menu.classList.remove("is-open");
        }
    },

    toggleMobileMenu() {

        AppState.mobileMenuOpen =
            !AppState.mobileMenuOpen;

        document.body.classList.toggle(
            "mobile-menu-open",
            AppState.mobileMenuOpen
        );

        const menu = DOM.query(
            "#mobile-menu"
        );

        if (menu) {
            menu.classList.toggle(
                "is-open",
                AppState.mobileMenuOpen
            );
        }

        DOM.queryAll(
            ".mobile-menu-toggle, [data-mobile-menu-toggle]"
        ).forEach(button => {
            button.setAttribute(
                "aria-expanded",
                AppState.mobileMenuOpen
                    ? "true"
                    : "false"
            );
        });
    }
};


/* =========================================================
   13. ROUTER
   ========================================================= */

const Router = {

    async render() {

        const app = DOM.app();

        if (!app) {
            console.error(
                "[HoKStats] #app was not found."
            );
            return;
        }

        app.classList.remove("page-enter");

        void app.offsetWidth;

        app.classList.add("page-enter");

        try {

            switch (AppState.page) {

                case "home":
                    await Pages.home(app);
                    break;

                case "heroes":
                    await Pages.heroes(app);
                    break;

                case "hero":
                    await Pages.heroDetail(app);
                    break;

                case "equipment":
                    await Pages.equipment(app);
                    break;

                case "item":
                    await Pages.equipmentDetail(app);
                    break;

                case "calculator":
                    await Pages.calculator(app);
                    break;

                case "builds":
                    await Pages.builds(app);
                    break;

                case "build":
                    await Pages.buildDetail(app);
                    break;

                case "meta":
                    await Pages.meta(app);
                    break;

                case "patches":
                    await Pages.patches(app);
                    break;

                case "patch":
                    await Pages.patchDetail(app);
                    break;

                case "news":
                    await Pages.news(app);
                    break;

                case "guides":
                    await Pages.guides(app);
                    break;

                case "guide":
                    await Pages.guideDetail(app);
                    break;

                case "community":
                    await Pages.community(app);
                    break;

                case "search":
                    await Pages.search(app);
                    break;

                case "about":
                    await Pages.about(app);
                    break;

                case "data":
                    await Pages.data(app);
                    break;

                case "admin":
                    await Pages.admin(app);
                    break;

                default:
                    await Pages.notFound(app);
                    break;
            }

        } catch (error) {

            console.error(
                "[HoKStats] Page render error:",
                error
            );

            app.innerHTML = Render.errorState(
                "Something went wrong while loading this page."
            );
        }

        AppUI.refreshActiveNavigation();

        Search.bindDynamicSearch();

        Calculator.bindDynamic();

        AppUI.bindDynamicActions();
    }
};


/* =========================================================
   14. RENDER HELPERS
   ========================================================= */

const Render = {

    pageHeader({
        eyebrow = "",
        title = "",
        description = "",
        actions = ""
    } = {}) {

        return `
            <section class="page-header">
                <div class="page-header-copy">

                    ${
                        eyebrow
                            ? `<div class="eyebrow">${Utils.escapeHTML(eyebrow)}</div>`
                            : ""
                    }

                    <h1>${Utils.escapeHTML(title)}</h1>

                    ${
                        description
                            ? `<p>${Utils.escapeHTML(description)}</p>`
                            : ""
                    }

                </div>

                ${
                    actions
                        ? `<div class="page-header-actions">${actions}</div>`
                        : ""
                }
            </section>
        `;
    },

    sectionHeader(title, description = "", action = "") {

        return `
            <div class="section-heading">

                <div>
                    <h2>${Utils.escapeHTML(title)}</h2>

                    ${
                        description
                            ? `<p>${Utils.escapeHTML(description)}</p>`
                            : ""
                    }
                </div>

                ${
                    action
                        ? `<div class="section-heading-action">${action}</div>`
                        : ""
                }

            </div>
        `;
    },

    badge(text, type = "neutral") {

        return `
            <span class="badge badge-${Utils.escapeHTML(type)}">
                ${Utils.escapeHTML(text)}
            </span>
        `;
    },

    bookmark(type, id) {

        const saved = Bookmarks.isSaved(
            type,
            id
        );

        return `
            <button
                type="button"
                class="bookmark-button ${saved ? "is-saved" : ""}"
                data-bookmark-type="${Utils.escapeHTML(type)}"
                data-bookmark-id="${Utils.escapeHTML(id)}"
                aria-pressed="${saved ? "true" : "false"}"
                title="${saved ? "Remove bookmark" : "Save bookmark"}"
            >
                <span class="bookmark-icon">
                    ${saved ? "★" : "☆"}
                </span>
                <span class="bookmark-label">
                    ${saved ? "Saved" : "Save"}
                </span>
            </button>
        `;
    },

    stat(label, value, suffix = "") {

        return `
            <div class="stat-block">

                <div class="stat-label">
                    ${Utils.escapeHTML(label)}
                </div>

                <div class="stat-value">
                    ${Utils.escapeHTML(value)}
                    ${
                        suffix
                            ? `<span>${Utils.escapeHTML(suffix)}</span>`
                            : ""
                    }
                </div>

            </div>
        `;
    },

    statBar(label, value, max = 100, display = null) {

        const numeric = Number(value);

        const percentage =
            Number.isFinite(numeric)
                ? Utils.clamp(
                    (numeric / max) * 100,
                    0,
                    100
                )
                : 0;

        return `
            <div class="stat-bar-row">

                <div class="stat-bar-top">
                    <span>${Utils.escapeHTML(label)}</span>

                    <strong>
                        ${Utils.escapeHTML(
                            display ?? Utils.formatNumber(value)
                        )}
                    </strong>
                </div>

                <div class="stat-bar">
                    <span
                        class="stat-bar-fill"
                        data-stat-width="${percentage}"
                        style="width:${percentage}%"
                    ></span>
                </div>

            </div>
        `;
    },

    emptyState(
        title = "Nothing here yet",
        description = "Verified data will appear here when available."
    ) {

        return `
            <div class="empty-state">

                <div class="empty-state-mark">
                    —
                </div>

                <h3>${Utils.escapeHTML(title)}</h3>

                <p>${Utils.escapeHTML(description)}</p>

            </div>
        `;
    },

    errorState(message) {

        return `
            <section class="error-state">

                <div class="error-state-code">
                    HKS
                </div>

                <h1>Unable to load</h1>

                <p>${Utils.escapeHTML(message)}</p>

                <button
                    type="button"
                    class="button button-primary"
                    onclick="location.reload()"
                >
                    Retry
                </button>

            </section>
        `;
    },

    loading() {

        return `
            <div class="loading-state">

                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-text short"></div>

                <div class="skeleton-grid">
                    <div class="skeleton skeleton-card"></div>
                    <div class="skeleton skeleton-card"></div>
                    <div class="skeleton skeleton-card"></div>
                </div>

            </div>
        `;
    }
};


/* =========================================================
   15. HERO RENDERING
   ========================================================= */

const HeroRenderer = {

    card(hero) {

        return `
            <article
                class="hero-card"
                data-hero-card="${Utils.escapeHTML(hero.id)}"
            >

                <a
                    href="?page=hero&slug=${encodeURIComponent(hero.slug)}"
                    data-page="hero"
                    data-slug="${Utils.escapeHTML(hero.slug)}"
                    class="hero-card-media"
                    aria-label="View ${Utils.escapeHTML(hero.name)}"
                >

                    ${Media.image(
                        hero.imageUrl,
                        `${hero.name} artwork`,
                        "hero-card-image"
                    )}

                    <div class="hero-card-overlay"></div>

                    <div class="hero-card-role">
                        ${Render.badge(
                            Utils.capitalize(hero.role),
                            "green"
                        )}

                        ${Render.badge(
                            Utils.capitalize(hero.lane),
                            "neutral"
                        )}
                    </div>

                    <div class="hero-card-name">
                        ${Utils.escapeHTML(hero.name)}
                    </div>

                </a>

                <div class="hero-card-body">

                    <div class="hero-card-meta">

                        <span>
                            Difficulty
                        </span>

                        <strong>
                            ${Utils.escapeHTML(
                                Utils.capitalize(hero.difficulty)
                            )}
                        </strong>

                    </div>

                    <div class="hero-card-actions">

                        <a
                            href="?page=hero&slug=${encodeURIComponent(hero.slug)}"
                            data-page="hero"
                            data-slug="${Utils.escapeHTML(hero.slug)}"
                            class="text-link"
                        >
                            View hero →
                        </a>

                        ${Render.bookmark(
                            "hero",
                            hero.id
                        )}

                    </div>

                </div>

            </article>
        `;
    },

    detail(hero) {

        if (!hero) {
            return Render.emptyState(
                "Hero not found",
                "The requested hero does not exist in the current dataset."
            );
        }

        const stats = hero.stats || {};

        const heroBuilds = DATA.builds.filter(
            build => build.heroId === hero.id
        );

        return `
            <div class="hero-detail">

                <section class="hero-detail-header">

                    <div class="hero-detail-art">

                        ${Media.image(
                            hero.artUrl || hero.imageUrl,
                            `${hero.name} artwork`,
                            "hero-detail-image"
                        )}

                        <div class="hero-detail-art-overlay"></div>

                    </div>

                    <div class="hero-detail-info">

                        <div class="eyebrow">
                            ${Utils.capitalize(hero.role)}
                            ·
                            ${Utils.capitalize(hero.lane)}
                        </div>

                        <h1>
                            ${Utils.escapeHTML(hero.name)}
                        </h1>

                        <p class="hero-bio">
                            ${Utils.escapeHTML(hero.bio)}
                        </p>

                        <div class="hero-detail-actions">

                            <button
                                type="button"
                                class="button button-primary"
                                data-page="calculator"
                                data-calculator-hero="${Utils.escapeHTML(hero.id)}"
                            >
                                Try in Calculator
                            </button>

                            ${Render.bookmark(
                                "hero",
                                hero.id
                            )}

                        </div>

                        <div class="hero-detail-meta">

                            ${Render.badge(
                                Utils.capitalize(hero.role),
                                "green"
                            )}

                            ${Render.badge(
                                Utils.capitalize(hero.lane),
                                "neutral"
                            )}

                            ${Render.badge(
                                Utils.capitalize(hero.difficulty),
                                "neutral"
                            )}

                        </div>

                    </div>

                </section>


                <section class="content-section">

                    ${Render.sectionHeader(
                        "Base Stats",
                        "Verified values for the selected game version."
                    )}

                    <div class="stat-grid stat-grid-large">

                        ${Render.stat(
                            "HP",
                            Utils.formatNumber(stats.hp)
                        )}

                        ${Render.stat(
                            "Physical Attack",
                            Utils.formatNumber(
                                stats.physicalAttack
                            )
                        )}

                        ${Render.stat(
                            "Magic Attack",
                            Utils.formatNumber(
                                stats.magicAttack
                            )
                        )}

                        ${Render.stat(
                            "Physical Defense",
                            Utils.formatNumber(
                                stats.physicalDefense
                            )
                        )}

                        ${Render.stat(
                            "Magic Defense",
                            Utils.formatNumber(
                                stats.magicDefense
                            )
                        )}

                        ${Render.stat(
                            "Attack Speed",
                            stats.attackSpeed
                        )}

                        ${Render.stat(
                            "Movement Speed",
                            Utils.formatNumber(
                                stats.movementSpeed
                            )
                        )}

                        ${Render.stat(
                            "Crit Rate",
                            Utils.formatPercent(
                                stats.critRate
                            )
                        )}

                    </div>

                </section>


                <section class="content-section">

                    ${Render.sectionHeader(
                        "How to Play",
                        "A quick practical overview. Deeper strategy belongs in Guides."
                    )}

                    <div class="skills-grid">

                        ${
                            hero.skills
                                .map(skill => `
                                    <article class="skill-card">

                                        <div class="skill-icon">
                                            ${Media.icon(
                                                skill.iconUrl,
                                                skill.name
                                            )}
                                        </div>

                                        <div class="skill-content">

                                            <div class="skill-type">
                                                ${Utils.escapeHTML(
                                                    Utils.capitalize(
                                                        skill.type
                                                    )
                                                )}
                                            </div>

                                            <h3>
                                                ${Utils.escapeHTML(
                                                    skill.name
                                                )}
                                            </h3>

                                            <p>
                                                ${Utils.escapeHTML(
                                                    skill.description
                                                )}
                                            </p>

                                        </div>

                                    </article>
                                `)
                                .join("")
                        }

                    </div>

                </section>


                <section class="content-section">

                    ${Render.sectionHeader(
                        "Recommended Builds",
                        "Builds currently associated with this hero."
                    )}

                    ${
                        heroBuilds.length
                            ? `
                                <div class="build-grid">
                                    ${heroBuilds
                                        .map(BuildRenderer.card)
                                        .join("")}
                                </div>
                            `
                            : Render.emptyState(
                                "No verified builds yet",
                                "Recommended builds will appear when verified."
                            )
                    }

                </section>


                <section class="content-section">

                    ${Render.sectionHeader(
                        "Skins",
                        "Officially verified skin information."
                    )}

                    ${
                        hero.skins.length
                            ? `
                                <div class="skin-grid">
                                    ${hero.skins
                                        .map(skin => `
                                            <article class="skin-card">
                                                ${Media.image(
                                                    skin.imageUrl,
                                                    skin.name,
                                                    "skin-image"
                                                )}
                                                <div class="skin-body">
                                                    <h3>
                                                        ${Utils.escapeHTML(
                                                            skin.name
                                                        )}
                                                    </h3>
                                                </div>
                                            </article>
                                        `)
                                        .join("")}
                                </div>
                            `
                            : Render.emptyState(
                                "No verified skin data",
                                "Skin records will be added from verified sources."
                            )
                    }

                </section>


                <section class="content-section">

                    ${Render.sectionHeader(
                        "Patch History",
                        "Historical changes are preserved rather than overwritten."
                    )}

                    ${
                        hero.patchHistory.length
                            ? `
                                <div class="timeline">
                                    ${hero.patchHistory
                                        .map(change => `
                                            <article class="timeline-item">

                                                <div class="timeline-marker"></div>

                                                <div class="timeline-content">

                                                    <div class="timeline-meta">
                                                        ${Utils.escapeHTML(
                                                            change.version
                                                        )}
                                                        ·
                                                        ${Utils.escapeHTML(
                                                            change.date
                                                        )}
                                                    </div>

                                                    <p>
                                                        ${Utils.escapeHTML(
                                                            change.description
                                                        )}
                                                    </p>

                                                </div>

                                            </article>
                                        `)
                                        .join("")}
                                </div>
                            `
                            : Render.emptyState(
                                "No patch history",
                                "Historical changes will appear here when verified."
                            )
                    }

                </section>

            </div>
        `;
    }
};


/* =========================================================
   16. EQUIPMENT RENDERING
   ========================================================= */

const EquipmentRenderer = {

    card(item) {

        return `
            <article class="equipment-card">

                <a
                    href="?page=item&slug=${encodeURIComponent(item.slug)}"
                    data-page="item"
                    data-slug="${Utils.escapeHTML(item.slug)}"
                    class="equipment-card-main"
                >

                    <div class="equipment-icon-large">
                        ${Media.icon(
                            item.iconUrl,
                            item.name
                        )}
                    </div>

                    <div class="equipment-card-info">

                        <div class="equipment-card-type">
                            ${Utils.escapeHTML(
                                Utils.capitalize(item.type)
                            )}
                        </div>

                        <h3>
                            ${Utils.escapeHTML(item.name)}
                        </h3>

                        <div class="equipment-price">
                            ${Utils.formatNumber(item.price)}
                        </div>

                    </div>

                </a>

                <div class="equipment-stats">

                    ${
                        Object.entries(item.stats)
                            .map(([key, value]) => `
                                <span class="mini-stat">
                                    ${Utils.escapeHTML(
                                        Utils.capitalize(
                                            key.replace(
                                                /([A-Z])/g,
                                                " $1"
                                            )
                                        )
                                    )}
                                    <strong>
                                        +${Utils.escapeHTML(value)}
                                    </strong>
                                </span>
                            `)
                            .join("")
                    }

                </div>

            </article>
        `;
    },

    detail(item) {

        if (!item) {
            return Render.emptyState(
                "Equipment not found",
                "The requested equipment does not exist in the current dataset."
            );
        }

        const usingBuilds = DATA.builds.filter(
            build => build.items.includes(item.id)
        );

        return `
            <div class="equipment-detail">

                <section class="detail-banner">

                    <div class="detail-banner-icon">
                        ${Media.icon(
                            item.iconUrl,
                            item.name
                        )}
                    </div>

                    <div class="detail-banner-copy">

                        <div class="eyebrow">
                            ${Utils.capitalize(item.type)}
                        </div>

                        <h1>
                            ${Utils.escapeHTML(item.name)}
                        </h1>

                        <p>
                            ${Utils.escapeHTML(item.description)}
                        </p>

                    </div>

                    <div class="detail-banner-price">

                        <span>Price</span>

                        <strong>
                            ${Utils.formatNumber(item.price)}
                        </strong>

                    </div>

                </section>


                <section class="content-section">

                    ${Render.sectionHeader(
                        "Equipment Stats"
                    )}

                    <div class="stat-grid">

                        ${
                            Object.entries(item.stats)
                                .map(([key, value]) =>
                                    Render.stat(
                                        key.replace(
                                            /([A-Z])/g,
                                            " $1"
                                        ),
                                        value
                                    )
                                )
                                .join("")
                        }

                    </div>

                </section>


                <section class="content-section">

                    ${Render.sectionHeader(
                        "Passive Effects"
                    )}

                    <div class="passive-list">

                        ${
                            item.passives.length
                                ? item.passives
                                    .map(passive => `
                                        <article class="passive-card">

                                            <div class="passive-icon">
                                                P
                                            </div>

                                            <div>
                                                <h3>
                                                    ${Utils.escapeHTML(
                                                        passive.name
                                                    )}
                                                </h3>

                                                <p>
                                                    ${Utils.escapeHTML(
                                                        passive.description
                                                    )}
                                                </p>
                                            </div>

                                        </article>
                                    `)
                                    .join("")
                                : Render.emptyState(
                                    "No passive data",
                                    "Verified passive information will appear here."
                                )
                        }

                    </div>

                </section>


                <section class="content-section">

                    ${Render.sectionHeader(
                        "Builds Using This Item"
                    )}

                    ${
                        usingBuilds.length
                            ? `
                                <div class="build-grid">
                                    ${usingBuilds
                                        .map(BuildRenderer.card)
                                        .join("")}
                                </div>
                            `
                            : Render.emptyState(
                                "No builds currently listed"
                            )
                    }

                </section>

            </div>
        `;
    }
};


/* =========================================================
   17. BUILD RENDERING
   ========================================================= */

const BuildRenderer = {

    itemStrip(itemIds) {

        return `
            <div class="build-item-strip">

                ${
                    itemIds
                        .map(id => {

                            const item =
                                DATA.equipment.find(
                                    entry =>
                                        entry.id === id
                                );

                            if (!item) {
                                return `
                                    <div class="build-item-slot is-empty">
                                        —
                                    </div>
                                `;
                            }

                            return `
                                <div
                                    class="build-item-slot"
                                    title="${Utils.escapeHTML(item.name)}"
                                >
                                    ${Media.icon(
                                        item.iconUrl,
                                        item.name
                                    )}
                                </div>
                            `;
                        })
                        .join("")
                }

            </div>
        `;
    },

    card(build) {

        const hero = DATA.heroes.find(
            hero => hero.id === build.heroId
        );

        return `
            <article class="build-card">

                <div class="build-card-top">

                    <div class="build-hero-mini">

                        ${
                            hero
                                ? Media.image(
                                    hero.imageUrl,
                                    hero.name,
                                    "build-hero-image"
                                )
                                : ""
                        }

                    </div>

                    <div class="build-card-copy">

                        <div class="eyebrow">
                            ${Utils.escapeHTML(
                                build.type
                            )}
                        </div>

                        <h3>
                            ${Utils.escapeHTML(
                                build.name
                            )}
                        </h3>

                        <p>
                            ${Utils.escapeHTML(
                                build.description
                            )}
                        </p>

                    </div>

                </div>

                ${this.itemStrip(build.items)}

                <div class="build-card-bottom">

                    <span class="build-author">
                        ${Utils.escapeHTML(
                            build.author
                        )}
                    </span>

                    <a
                        href="?page=build&slug=${encodeURIComponent(build.slug)}"
                        data-page="build"
                        data-slug="${Utils.escapeHTML(build.slug)}"
                        class="text-link"
                    >
                        View build →
                    </a>

                </div>

            </article>
        `;
    },

    detail(build) {

        if (!build) {
            return Render.emptyState(
                "Build not found",
                "The requested build does not exist."
            );
        }

        const hero = DATA.heroes.find(
            entry => entry.id === build.heroId
        );

        const items = build.items.map(
            id => DATA.equipment.find(
                item => item.id === id
            )
        );

        return `
            <div class="build-detail">

                <section class="detail-banner build-detail-banner">

                    <div class="detail-banner-copy">

                        <div class="eyebrow">
                            ${Utils.escapeHTML(
                                build.type
                            )}
                        </div>

                        <h1>
                            ${Utils.escapeHTML(
                                build.name
                            )}
                        </h1>

                        <p>
                            ${Utils.escapeHTML(
                                build.description
                            )}
                        </p>

                        <div class="detail-meta-line">

                            ${
                                hero
                                    ? `
                                        <span>
                                            Hero:
                                            <strong>
                                                ${Utils.escapeHTML(
                                                    hero.name
                                                )}
                                            </strong>
                                        </span>
                                    `
                                    : ""
                            }

                            <span>
                                Source:
                                <strong>
                                    ${Utils.escapeHTML(
                                        build.source
                                    )}
                                </strong>
                            </span>

                        </div>

                    </div>

                </section>


                <section class="content-section">

                    ${Render.sectionHeader(
                        "Equipment",
                        "Six equipment slots used by this build."
                    )}

                    <div class="build-detail-items">

                        ${
                            items
                                .map((item, index) => `
                                    <article class="build-detail-item">

                                        <div class="build-slot-number">
                                            ${index + 1}
                                        </div>

                                        ${
                                            item
                                                ? Media.icon(
                                                    item.iconUrl,
                                                    item.name,
                                                    "build-detail-item-icon"
                                                )
                                                : `
                                                    <div class="build-detail-empty">
                                                        Empty
                                                    </div>
                                                `
                                        }

                                        <h3>
                                            ${
                                                item
                                                    ? Utils.escapeHTML(
                                                        item.name
                                                    )
                                                    : "Empty"
                                            }
                                        </h3>

                                    </article>
                                `)
                                .join("")
                        }

                    </div>

                </section>


                <section class="content-section">

                    ${Render.sectionHeader(
                        "Try This Build",
                        "Send this six-slot setup directly to the calculator."
                    )}

                    <button
                        type="button"
                        class="button button-primary"
                        data-use-build="${Utils.escapeHTML(
                            build.id
                        )}"
                    >
                        Open in Calculator
                    </button>

                </section>

            </div>
        `;
    }
};


/* =========================================================
   18. HOMEPAGE SLIDER
   ========================================================= */

const Slider = {

    slides: [],

    async load() {

        this.slides = this.generateSlides();

        AppState.slider.index = Utils.clamp(
            Number(
                Storage.get(
                    HOKSTATS_CONFIG.storageKeys.sliderIndex,
                    0
                )
            ),
            0,
            Math.max(this.slides.length - 1, 0)
        );

        this.render();

        if (!AppState.slider.initialized) {
            this.bind();
            AppState.slider.initialized = true;
        }

        this.start();
    },

    generateSlides() {

        const hero =
            DATA.heroes.find(
                item => item.id === "dun"
            ) ||
            DATA.heroes[0];

        const build =
            DATA.builds[0];

        const patch =
            DATA.patches[0];

        const equipment =
            DATA.equipment[2];

        const guide =
            DATA.guides[0];

        const news =
            DATA.news[0];

        return [
            {
                type: "HERO",
                eyebrow: "Hero Database",
                title: hero
                    ? hero.name
                    : "Heroes",
                description:
                    hero
                        ? hero.bio
                        : "Explore verified hero data.",
                cta: "VIEW HERO",
                page: "hero",
                slug: hero?.slug,
                image: hero?.artUrl || hero?.imageUrl || "",
                accent: "green"
            },

            {
                type: "BUILD",
                eyebrow: "Build Engine",
                title: build
                    ? build.name
                    : "Builds",
                description:
                    build
                        ? build.description
                        : "Explore verified builds.",
                cta: "VIEW BUILD",
                page: "build",
                slug: build?.slug,
                image: "",
                accent: "blue"
            },

            {
                type: "PATCH",
                eyebrow: "Latest Patch",
                title: patch
                    ? patch.title
                    : "Patch Updates",
                description:
                    patch
                        ? patch.summary
                        : "Track verified patch changes.",
                cta: "VIEW PATCH",
                page: "patch",
                id: patch?.id,
                image: "",
                accent: "green"
            },

            {
                type: "EQUIPMENT",
                eyebrow: "Equipment Database",
                title: equipment
                    ? equipment.name
                    : "Equipment",
                description:
                    equipment
                        ? equipment.description
                        : "Compare equipment.",
                cta: "VIEW EQUIPMENT",
                page: "item",
                slug: equipment?.slug,
                image: "",
                accent: "blue"
            },

            {
                type: "GUIDE",
                eyebrow: "Guides",
                title: guide
                    ? guide.title
                    : "Guides",
                description:
                    guide
                        ? guide.summary
                        : "Learn the game.",
                cta: "READ GUIDE",
                page: "guide",
                slug: guide?.slug,
                image: "",
                accent: "green"
            },

            {
                type: "NEWS",
                eyebrow: "News",
                title: news
                    ? news.title
                    : "Latest News",
                description:
                    news
                        ? news.summary
                        : "Verified Honor of Kings news.",
                cta: "READ NEWS",
                page: "news",
                id: news?.id,
                image: news?.imageUrl || "",
                accent: "blue"
            }
        ];
    },

    render() {

        const root =
            DOM.query("#home-slider");

        if (!root || !this.slides.length) {
            return;
        }

        root.innerHTML = `
            <div class="hero-slider-track">

                ${
                    this.slides
                        .map((slide, index) => `
                            <article
                                class="home-slide ${index === AppState.slider.index ? "is-active" : ""}"
                                data-slide-index="${index}"
                                data-slide-type="${Utils.escapeHTML(slide.type)}"
                            >

                                <div class="home-slide-media">

                                    ${Media.image(
                                        slide.image,
                                        `${slide.title} artwork`,
                                        "home-slide-image"
                                    )}

                                </div>

                                <div class="home-slide-overlay"></div>

                                <div class="home-slide-content">

                                    <div class="eyebrow">
                                        ${Utils.escapeHTML(
                                            slide.eyebrow
                                        )}
                                    </div>

                                    <h1>
                                        ${Utils.escapeHTML(
                                            slide.title
                                        )}
                                    </h1>

                                    <p>
                                        ${Utils.escapeHTML(
                                            slide.description
                                        )}
                                    </p>

                                    <button
                                        type="button"
                                        class="button button-primary"
                                        data-slide-action="${index}"
                                    >
                                        ${Utils.escapeHTML(
                                            slide.cta
                                        )}
                                    </button>

                                </div>

                                <div class="home-slide-type">
                                    ${Utils.escapeHTML(
                                        slide.type
                                    )}
                                </div>

                            </article>
                        `)
                        .join("")
                }

            </div>

            <button
                type="button"
                class="slider-arrow slider-prev"
                aria-label="Previous slide"
                data-slider-prev
            >
                ‹
            </button>

            <button
                type="button"
                class="slider-arrow slider-next"
                aria-label="Next slide"
                data-slider-next
            >
                ›
            </button>

            <div
                class="slider-dots"
                aria-label="Slide navigation"
            >
                ${
                    this.slides
                        .map((slide, index) => `
                            <button
                                type="button"
                                class="slider-dot ${index === AppState.slider.index ? "is-active" : ""}"
                                data-slider-dot="${index}"
                                aria-label="Go to ${Utils.escapeHTML(
                                    slide.title
                                )}"
                            ></button>
                        `)
                        .join("")
                }
            </div>
        `;
    },

    bind() {

        document.addEventListener(
            "click",
            event => {

                const next =
                    event.target.closest(
                        "[data-slider-next]"
                    );

                if (next) {
                    this.next();
                    return;
                }

                const previous =
                    event.target.closest(
                        "[data-slider-prev]"
                    );

                if (previous) {
                    this.previous();
                    return;
                }

                const dot =
                    event.target.closest(
                        "[data-slider-dot]"
                    );

                if (dot) {
                    this.goTo(
                        Number(
                            dot.dataset.sliderDot
                        )
                    );
                    return;
                }

                const action =
                    event.target.closest(
                        "[data-slide-action]"
                    );

                if (action) {
                    const index = Number(
                        action.dataset.slideAction
                    );

                    const slide =
                        this.slides[index];

                    if (!slide) {
                        return;
                    }

                    Navigation.go(
                        slide.page,
                        {
                            slug: slide.slug,
                            id: slide.id
                        }
                    );
                }
            }
        );

        const slider =
            DOM.query("#home-slider");

        if (!slider) {
            return;
        }

        slider.addEventListener(
            "mouseenter",
            () => {
                AppState.slider.paused = true;
            }
        );

        slider.addEventListener(
            "mouseleave",
            () => {
                AppState.slider.paused = false;
            }
        );

        let touchStartX = null;

        slider.addEventListener(
            "touchstart",
            event => {
                touchStartX =
                    event.touches[0]?.clientX ?? null;
            },
            {
                passive: true
            }
        );

        slider.addEventListener(
            "touchend",
            event => {

                if (touchStartX === null) {
                    return;
                }

                const touchEndX =
                    event.changedTouches[0]?.clientX;

                if (touchEndX === undefined) {
                    return;
                }

                const delta =
                    touchStartX - touchEndX;

                if (Math.abs(delta) > 50) {

                    if (delta > 0) {
                        this.next();
                    } else {
                        this.previous();
                    }

                }

                touchStartX = null;
            },
            {
                passive: true
            }
        );
    },

    goTo(index) {

        if (!this.slides.length) {
            return;
        }

        AppState.slider.index =
            (index + this.slides.length) %
            this.slides.length;

        Storage.set(
            HOKSTATS_CONFIG.storageKeys.sliderIndex,
            AppState.slider.index
        );

        this.updateDOM();
    },

    next() {
        this.goTo(
            AppState.slider.index + 1
        );
    },

    previous() {
        this.goTo(
            AppState.slider.index - 1
        );
    },

    updateDOM() {

        DOM.queryAll(
            ".home-slide"
        ).forEach((slide, index) => {

            slide.classList.toggle(
                "is-active",
                index === AppState.slider.index
            );
        });

        DOM.queryAll(
            ".slider-dot"
        ).forEach((dot, index) => {

            dot.classList.toggle(
                "is-active",
                index === AppState.slider.index
            );
        });
    },

    start() {

        this.stop();

        if (
            Utils.prefersReducedMotion() ||
            this.slides.length <= 1
        ) {
            return;
        }

        AppState.slider.timer =
            setInterval(() => {

                if (!AppState.slider.paused) {
                    this.next();
                }

            }, HOKSTATS_CONFIG.slider.interval);
    },

    stop() {

        if (AppState.slider.timer) {
            clearInterval(
                AppState.slider.timer
            );

            AppState.slider.timer = null;
        }
    }
};


/* =========================================================
   19. SEARCH SYSTEM
   ========================================================= */

const Search = {

    all() {

        const heroes = DATA.heroes.map(item => ({
            type: "hero",
            id: item.id,
            slug: item.slug,
            title: item.name,
            description: `${Utils.capitalize(item.role)} · ${Utils.capitalize(item.lane)}`
        }));

        const equipment = DATA.equipment.map(item => ({
            type: "equipment",
            id: item.id,
            slug: item.slug,
            title: item.name,
            description: Utils.capitalize(item.type)
        }));

        const builds = DATA.builds.map(item => ({
            type: "build",
            id: item.id,
            slug: item.slug,
            title: item.name,
            description: "Build"
        }));

        const guides = DATA.guides.map(item => ({
            type: "guide",
            id: item.id,
            slug: item.slug,
            title: item.title,
            description: item.category
        }));

        const news = DATA.news.map(item => ({
            type: "news",
            id: item.id,
            slug: item.slug,
            title: item.title,
            description: item.category
        }));

        return [
            ...heroes,
            ...equipment,
            ...builds,
            ...guides,
            ...news
        ];
    },

    query(query) {

        const clean =
            String(query || "")
                .trim()
                .toLowerCase();

        if (!clean) {
            return [];
        }

        return this.all()
            .filter(item => {

                const haystack = [
                    item.title,
                    item.description,
                    item.type
                ]
                    .join(" ")
                    .toLowerCase();

                return haystack.includes(clean);
            })
            .slice(
                0,
                HOKSTATS_CONFIG.search.maxSuggestions
            );
    },

    bindDynamicSearch() {

        const inputs =
            DOM.queryAll(
                "[data-global-search], #global-search-input, .global-search-input"
            );

        inputs.forEach(input => {

            if (input.dataset.searchBound === "true") {
                return;
            }

            input.dataset.searchBound = "true";

            input.addEventListener(
                "input",
                Utils.debounce(
                    event => {

                        const query =
                            event.target.value;

                        AppState.searchQuery =
                            query;

                        this.showSuggestions(
                            event.target
                        );

                    },
                    120
                )
            );

            input.addEventListener(
                "keydown",
                event => {

                    if (event.key === "Enter") {

                        event.preventDefault();

                        const query =
                            event.target.value.trim();

                        if (query) {
                            Navigation.go(
                                "search"
                            );

                            Utils.updateURL({
                                page: "search",
                                q: query
                            });
                        }
                    }

                    if (event.key === "Escape") {
                        this.hideSuggestions();
                    }
                }
            );
        });
    },

    showSuggestions(input) {

        const query =
            input.value.trim();

        let container =
            input.parentElement?.querySelector(
                ".search-suggestions"
            );

        if (!container) {

            container = DOM.create(
                "div",
                "search-suggestions"
            );

            input.parentElement?.appendChild(
                container
            );
        }

        if (
            query.length <
            HOKSTATS_CONFIG.search.minCharacters
        ) {
            container.innerHTML = "";
            container.classList.remove("is-open");
            return;
        }

        const results =
            this.query(query);

        if (!results.length) {

            container.innerHTML = `
                <div class="search-no-results">
                    No matching data found.
                </div>
            `;

            container.classList.add(
                "is-open"
            );

            return;
        }

        container.innerHTML =
            results
                .map(item => {

                    let page =
                        item.type === "hero"
                            ? "hero"
                            : item.type === "equipment"
                                ? "item"
                                : item.type;

                    return `
                        <a
                            href="?page=${encodeURIComponent(page)}&slug=${encodeURIComponent(item.slug)}"
                            data-page="${Utils.escapeHTML(page)}"
                            data-slug="${Utils.escapeHTML(item.slug)}"
                            class="search-suggestion"
                        >

                            <span class="search-suggestion-icon">
                                ${Utils.getInitials(
                                    item.title
                                )}
                            </span>

                            <span class="search-suggestion-copy">

                                <strong>
                                    ${Utils.escapeHTML(
                                        item.title
                                    )}
                                </strong>

                                <small>
                                    ${Utils.escapeHTML(
                                        item.description
                                    )}
                                </small>

                            </span>

                            <span class="search-suggestion-arrow">
                                →
                            </span>

                        </a>
                    `;
                })
                .join("");

        container.classList.add(
            "is-open"
        );
    },

    hideSuggestions() {

        DOM.queryAll(
            ".search-suggestions"
        ).forEach(element => {
            element.classList.remove(
                "is-open"
            );
        });
    }
};


/* =========================================================
   20. CALCULATOR ENGINE
   ========================================================= */

const Calculator = {

    init() {

        const saved =
            Storage.get(
                HOKSTATS_CONFIG.storageKeys.calculator,
                null
            );

        if (
            saved &&
            Array.isArray(saved.slots)
        ) {

            AppState.calculator =
                {
                    heroId:
                        saved.heroId || null,

                    slots:
                        Array.from(
                            {
                                length:
                                    HOKSTATS_CONFIG.calculator.slots
                            },
                            (_, index) =>
                                saved.slots[index] ||
                                null
                        )
                };
        }
    },

    save() {

        Storage.set(
            HOKSTATS_CONFIG.storageKeys.calculator,
            AppState.calculator
        );
    },

    reset() {

        AppState.calculator = {
            heroId: null,
            slots: Array(
                HOKSTATS_CONFIG.calculator.slots
            ).fill(null)
        };

        this.save();

        Toast.show(
            "Calculator build reset.",
            "info"
        );

        Router.render();
    },

    setHero(heroId) {

        const hero =
            DATA.heroes.find(
                item => item.id === heroId
            );

        if (!hero) {
            return;
        }

        AppState.calculator.heroId =
            hero.id;

        this.save();

        Router.render();
    },

    setSlot(slotIndex, itemId) {

        if (
            slotIndex < 0 ||
            slotIndex >= HOKSTATS_CONFIG.calculator.slots
        ) {
            return;
        }

        const item =
            DATA.equipment.find(
                entry => entry.id === itemId
            );

        if (!item) {
            return;
        }

        AppState.calculator.slots[
            slotIndex
        ] = item.id;

        this.save();

        Router.render();
    },

    removeSlot(slotIndex) {

        if (
            slotIndex < 0 ||
            slotIndex >=
            HOKSTATS_CONFIG.calculator.slots
        ) {
            return;
        }

        AppState.calculator.slots[
            slotIndex
        ] = null;

        this.save();

        Router.render();
    },

    getSelectedItems() {

        return AppState.calculator.slots
            .map(id =>
                DATA.equipment.find(
                    item => item.id === id
                ) || null
            );
    },

    calculate() {

        const hero =
            DATA.heroes.find(
                item =>
                    item.id ===
                    AppState.calculator.heroId
            );

        const base = {
            hp: 0,
            physicalAttack: 0,
            magicAttack: 0,
            physicalDefense: 0,
            magicDefense: 0,
            attackSpeed: 0,
            movementSpeed: 0,
            critRate: 0,
            physicalPenetration: 0,
            magicPenetration: 0,
            cooldownReduction: 0
        };

        if (hero) {

            const stats =
                hero.stats || {};

            base.hp =
                Number(stats.hp) || 0;

            base.physicalAttack =
                Number(
                    stats.physicalAttack
                ) || 0;

            base.magicAttack =
                Number(
                    stats.magicAttack
                ) || 0;

            base.physicalDefense =
                Number(
                    stats.physicalDefense
                ) || 0;

            base.magicDefense =
                Number(
                    stats.magicDefense
                ) || 0;

            base.attackSpeed =
                Number(
                    stats.attackSpeed
                ) || 0;

            base.movementSpeed =
                Number(
                    stats.movementSpeed
                ) || 0;

            base.critRate =
                Number(
                    stats.critRate
                ) || 0;

            base.physicalPenetration = 0;
            base.magicPenetration = 0;

            base.cooldownReduction =
                Number(
                    stats.cooldownReduction
                ) || 0;
        }

        const equipmentTotals = {
            hp: 0,
            physicalAttack: 0,
            magicAttack: 0,
            physicalDefense: 0,
            magicDefense: 0,
            attackSpeed: 0,
            movementSpeed: 0,
            critRate: 0,
            physicalPenetration: 0,
            magicPenetration: 0,
            cooldownReduction: 0
        };

        const selected =
            this.getSelectedItems();

        selected.forEach(item => {

            if (!item) {
                return;
            }

            Object.entries(
                item.stats || {}
            ).forEach(([key, value]) => {

                if (
                    Object.prototype.hasOwnProperty.call(
                        equipmentTotals,
                        key
                    )
                ) {

                    equipmentTotals[key] +=
                        Number(value) || 0;
                }
            });
        });

        const final = {};

        Object.keys(base).forEach(key => {

            final[key] =
                base[key] +
                equipmentTotals[key];
        });

        return {
            hero,
            base,
            equipment: equipmentTotals,
            final
        };
    },

    bindDynamic() {

        DOM.queryAll(
            "[data-calculator-hero]"
        ).forEach(button => {

            if (button.dataset.calcBound === "true") {
                return;
            }

            button.dataset.calcBound = "true";

            button.addEventListener(
                "click",
                () => {

                    const heroId =
                        button.dataset.calculatorHero;

                    AppState.calculator.heroId =
                        heroId;

                    this.save();

                    Navigation.go(
                        "calculator"
                    );
                }
            );
        });

        DOM.queryAll(
            "[data-calculator-slot]"
        ).forEach(slot => {

            if (slot.dataset.calcBound === "true") {
                return;
            }

            slot.dataset.calcBound = "true";

            slot.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            slot.dataset.calculatorSlot
                        );

                    this.openItemSelector(index);
                }
            );
        });

        DOM.queryAll(
            "[data-calculator-remove]"
        ).forEach(button => {

            if (button.dataset.calcBound === "true") {
                return;
            }

            button.dataset.calcBound = "true";

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const index =
                        Number(
                            button.dataset.calculatorRemove
                        );

                    this.removeSlot(index);
                }
            );
        });

        DOM.queryAll(
            "[data-calculator-reset]"
        ).forEach(button => {

            if (button.dataset.calcBound === "true") {
                return;
            }

            button.dataset.calcBound = "true";

            button.addEventListener(
                "click",
                () => this.reset()
            );
        });

        DOM.queryAll(
            "[data-calculator-hero-select]"
        ).forEach(select => {

            if (select.dataset.calcBound === "true") {
                return;
            }

            select.dataset.calcBound = "true";

            select.addEventListener(
                "change",
                event => {

                    this.setHero(
                        event.target.value
                    );
                }
            );
        });
    },

    openItemSelector(slotIndex) {

        const content = `
            <div class="calculator-item-picker">

                <div class="picker-search">
                    <input
                        type="search"
                        class="form-input"
                        id="calculator-item-search"
                        placeholder="Search equipment..."
                        autocomplete="off"
                    >
                </div>

                <div
                    class="calculator-item-picker-grid"
                    id="calculator-item-results"
                >
                    ${this.itemPickerCards(
                        slotIndex,
                        DATA.equipment
                    )}
                </div>

            </div>
        `;

        Modal.open(
            content,
            {
                eyebrow: `Slot ${slotIndex + 1}`,
                title: "Choose Equipment"
            }
        );

        const search =
            DOM.query(
                "#calculator-item-search"
            );

        search?.addEventListener(
            "input",
            event => {

                const query =
                    event.target.value
                        .trim()
                        .toLowerCase();

                const filtered =
                    DATA.equipment.filter(
                        item =>
                            item.name
                                .toLowerCase()
                                .includes(query) ||
                            item.type
                                .toLowerCase()
                                .includes(query)
                    );

                const results =
                    DOM.query(
                        "#calculator-item-results"
                    );

                if (results) {

                    results.innerHTML =
                        this.itemPickerCards(
                            slotIndex,
                            filtered
                        );
                }
            }
        );

        DOM.queryAll(
            "[data-picker-item]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const itemId =
                        button.dataset.pickerItem;

                    this.setSlot(
                        slotIndex,
                        itemId
                    );

                    Modal.close();
                }
            );
        });
    },

    itemPickerCards(slotIndex, items) {

        if (!items.length) {
            return Render.emptyState(
                "No equipment found"
            );
        }

        return items
            .map(item => `
                <button
                    type="button"
                    class="calculator-picker-item"
                    data-picker-item="${Utils.escapeHTML(item.id)}"
                >

                    <span class="calculator-picker-icon">
                        ${Media.icon(
                            item.iconUrl,
                            item.name
                        )}
                    </span>

                    <span class="calculator-picker-copy">

                        <strong>
                            ${Utils.escapeHTML(
                                item.name
                            )}
                        </strong>

                        <small>
                            ${Utils.escapeHTML(
                                Utils.capitalize(
                                    item.type
                                )
                            )}
                        </small>

                    </span>

                    <span class="calculator-picker-price">
                        ${Utils.formatNumber(
                            item.price
                        )}
                    </span>

                </button>
            `)
            .join("");
    }
};


/* =========================================================
   21. PAGE IMPLEMENTATIONS
   ========================================================= */

const Pages = {

    async home(app) {

        app.innerHTML = `

            <section class="home-page">

                <div
                    class="home-slider"
                    id="home-slider"
                    aria-label="HoKStats featured content"
                >
                    ${Render.loading()}
                </div>


                <section class="home-explore content-section">

                    ${Render.sectionHeader(
                        "Explore HoKStats",
                        "Browse the database, tools and community."
                    )}

                    <div class="explore-grid">

                        ${this.exploreButton(
                            "Heroes",
                            "Heroes, skills and stats",
                            "heroes"
                        )}

                        ${this.exploreButton(
                            "Equipment",
                            "Items, stats and passives",
                            "equipment"
                        )}

                        ${this.exploreButton(
                            "Builds",
                            "Recommended and community builds",
                            "builds"
                        )}

                        ${this.exploreButton(
                            "Calculator",
                            "Build and compare six equipment slots",
                            "calculator"
                        )}

                        ${this.exploreButton(
                            "Meta",
                            "Role-based verified statistics",
                            "meta"
                        )}

                        ${this.exploreButton(
                            "Patches",
                            "Patch history and changes",
                            "patches"
                        )}

                        ${this.exploreButton(
                            "Guides",
                            "Practical guides and explanations",
                            "guides"
                        )}

                        ${this.exploreButton(
                            "Community",
                            "Questions and discussions",
                            "community"
                        )}

                    </div>

                </section>


                <section class="home-search-section">

                    <div class="home-search-panel">

                        <div class="eyebrow">
                            GLOBAL SEARCH
                        </div>

                        <h2>
                            Find anything in HoKStats
                        </h2>

                        <p>
                            Search heroes, equipment, builds, guides and news.
                        </p>

                        <div class="home-search">

                            <span class="home-search-icon">
                                /
                            </span>

                            <input
                                type="search"
                                class="global-search-input"
                                data-global-search
                                placeholder="Search Dun, equipment, builds..."
                                autocomplete="off"
                            >

                            <button
                                type="button"
                                class="button button-primary"
                                data-search-submit
                            >
                                Search
                            </button>

                        </div>

                    </div>

                </section>


                <section class="content-section">

                    ${Render.sectionHeader(
                        "Latest Verified Updates",
                        "Officially verified information is separated from unconfirmed reports."
                    )}

                    <div class="news-grid">

                        ${
                            DATA.news
                                .filter(
                                    item =>
                                        item.category !==
                                        "RUMOR"
                                )
                                .slice(0, 3)
                                .map(NewsRenderer.card)
                                .join("")
                        }

                    </div>

                </section>


                <section class="official-widget">

                    <div>

                        <div class="eyebrow">
                            OFFICIAL DATA
                        </div>

                        <h2>
                            Official Patch Notes
                        </h2>

                        <p>
                            HoKStats.gg keeps official sources separate from community reports and unconfirmed information.
                        </p>

                    </div>

                    <button
                        type="button"
                        class="button button-secondary"
                        data-page="patches"
                    >
                        View Patches
                    </button>

                </section>

            </section>
        `;

        await Slider.load();
    },


    exploreButton(title, description, page) {

        return `
            <button
                type="button"
                class="explore-card"
                data-page="${Utils.escapeHTML(page)}"
            >

                <span class="explore-number">
                    ${String(
                        [
                            "heroes",
                            "equipment",
                            "builds",
                            "calculator",
                            "meta",
                            "patches",
                            "guides",
                            "community"
                        ].indexOf(page) + 1
                    ).padStart(2, "0")}
                </span>

                <span class="explore-copy">

                    <strong>
                        ${Utils.escapeHTML(title)}
                    </strong>

                    <small>
                        ${Utils.escapeHTML(description)}
                    </small>

                </span>

                <span class="explore-arrow">
                    →
                </span>

            </button>
        `;
    },


    async heroes(app) {

        const heroes =
            await API.getHeroes();

        let filtered =
            [...heroes];

        const filter =
            AppState.heroFilter;

        if (filter.role !== "all") {
            filtered =
                filtered.filter(
                    hero =>
                        hero.role === filter.role
                );
        }

        if (filter.lane !== "all") {
            filtered =
                filtered.filter(
                    hero =>
                        hero.lane === filter.lane
                );
        }

        if (filter.difficulty !== "all") {
            filtered =
                filtered.filter(
                    hero =>
                        hero.difficulty ===
                        filter.difficulty
                );
        }

        filtered.sort(
            (a, b) => {

                if (filter.sort === "name") {
                    return a.name.localeCompare(
                        b.name
                    );
                }

                if (filter.sort === "release") {
                    return String(
                        b.releaseDate
                    ).localeCompare(
                        String(a.releaseDate)
                    );
                }

                return 0;
            }
        );

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: "DATABASE",
                title: "Heroes",
                description:
                    "Explore heroes, roles, lanes, abilities and verified base statistics."
            })}

            <section class="content-section">

                <div class="filter-toolbar">

                    <div class="filter-group">

                        <label>
                            Role
                            <select
                                class="form-select"
                                data-hero-filter="role"
                            >
                                <option value="all">All roles</option>
                                <option value="fighter">Fighter</option>
                                <option value="assassin">Assassin</option>
                                <option value="marksman">Marksman</option>
                                <option value="mage">Mage</option>
                                <option value="tank">Tank</option>
                                <option value="support">Support</option>
                            </select>
                        </label>

                        <label>
                            Lane
                            <select
                                class="form-select"
                                data-hero-filter="lane"
                            >
                                <option value="all">All lanes</option>
                                <option value="clash">Clash</option>
                                <option value="jungle">Jungle</option>
                                <option value="mid">Mid</option>
                                <option value="farm">Farm</option>
                                <option value="roam">Roam</option>
                            </select>
                        </label>

                        <label>
                            Difficulty
                            <select
                                class="form-select"
                                data-hero-filter="difficulty"
                            >
                                <option value="all">All difficulty</option>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </label>

                    </div>

                    <label>
                        Sort
                        <select
                            class="form-select"
                            data-hero-filter="sort"
                        >
                            <option value="name">Name</option>
                            <option value="release">Release</option>
                        </select>
                    </label>

                </div>


                <div class="hero-grid">

                    ${
                        filtered.length
                            ? filtered
                                .map(
                                    HeroRenderer.card
                                )
                                .join("")
                            : Render.emptyState(
                                "No heroes match these filters.",
                                "Try changing one or more filters."
                            )
                    }

                </div>

            </section>
        `;
    },


    async heroDetail(app) {

        const params =
            Utils.getQueryParams();

        const slug =
            params.slug;

        const hero =
            await API.getHero(slug);

        AppState.currentHero = hero;

        app.innerHTML = HeroRenderer.detail(
            hero
        );
    },


    async equipment(app) {

        let items =
            await API.getEquipment();

        const filter =
            AppState.equipmentFilter;

        if (filter.type !== "all") {

            items =
                items.filter(
                    item =>
                        item.type === filter.type
                );
        }

        if (filter.query) {

            const query =
                filter.query
                    .toLowerCase();

            items =
                items.filter(
                    item =>
                        item.name
                            .toLowerCase()
                            .includes(query)
                );
        }

        items.sort(
            (a, b) => {

                if (filter.sort === "price") {
                    return a.price - b.price;
                }

                return a.name.localeCompare(
                    b.name
                );
            }
        );

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: "DATABASE",
                title: "Equipment",
                description:
                    "Search equipment, compare attributes and inspect passive effects."
            })}

            <section class="content-section">

                <div class="filter-toolbar">

                    <label class="filter-search">

                        <span>
                            Search
                        </span>

                        <input
                            type="search"
                            class="form-input"
                            data-equipment-search
                            value="${Utils.escapeHTML(
                                filter.query
                            )}"
                            placeholder="Search equipment..."
                        >

                    </label>

                    <label>
                        Type
                        <select
                            class="form-select"
                            data-equipment-filter="type"
                        >
                            <option value="all">All types</option>
                            <option value="attack">Attack</option>
                            <option value="defense">Defense</option>
                            <option value="boots">Boots</option>
                            <option value="crit">Crit</option>
                            <option value="magic">Magic</option>
                            <option value="magic-defense">Magic Defense</option>
                        </select>
                    </label>

                    <label>
                        Sort
                        <select
                            class="form-select"
                            data-equipment-filter="sort"
                        >
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                        </select>
                    </label>

                </div>


                <div class="equipment-grid">

                    ${
                        items.length
                            ? items
                                .map(
                                    EquipmentRenderer.card
                                )
                                .join("")
                            : Render.emptyState(
                                "No equipment found.",
                                "Try another search or filter."
                            )
                    }

                </div>

            </section>
        `;
    },


    async equipmentDetail(app) {

        const params =
            Utils.getQueryParams();

        const item =
            await API.getEquipmentItem(
                params.slug
            );

        AppState.currentEquipment =
            item;

        app.innerHTML =
            EquipmentRenderer.detail(
                item
            );
    },


    async builds(app) {

        const builds =
            await API.getBuilds();

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: "BUILD ENGINE",
                title: "Builds",
                description:
                    "Explore recommended builds and send any setup to the calculator."
            })}

            <section class="content-section">

                <div class="build-tabs">

                    <button
                        type="button"
                        class="tab-button is-active"
                        data-build-tab="recommended"
                    >
                        Recommended
                    </button>

                    <button
                        type="button"
                        class="tab-button"
                        data-build-tab="community"
                    >
                        Community
                    </button>

                </div>

                <div class="build-grid">

                    ${
                        builds
                            .filter(
                                build =>
                                    build.type ===
                                    "recommended"
                            )
                            .map(
                                BuildRenderer.card
                            )
                            .join("")
                    }

                </div>

            </section>
        `;
    },


    async buildDetail(app) {

        const params =
            Utils.getQueryParams();

        const build =
            await API.getBuild(
                params.slug
            );

        AppState.currentBuild =
            build;

        app.innerHTML =
            BuildRenderer.detail(
                build
            );
    },


    async calculator(app) {

        const result =
            Calculator.calculate();

        const hero =
            result.hero;

        const selected =
            Calculator.getSelectedItems();

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: "CALCULATOR",
                title: "Equipment Calculator",
                description:
                    "Choose a hero and six equipment slots to calculate the resulting stat totals."
            })}

            <section class="calculator-layout">

                <div class="calculator-main">

                    <div class="calculator-toolbar">

                        <label class="calculator-hero-select">

                            <span>
                                Hero
                            </span>

                            <select
                                class="form-select"
                                data-calculator-hero-select
                            >
                                <option value="">
                                    Select hero
                                </option>

                                ${
                                    DATA.heroes
                                        .map(
                                            entry => `
                                                <option
                                                    value="${Utils.escapeHTML(entry.id)}"
                                                    ${
                                                        hero &&
                                                        hero.id ===
                                                        entry.id
                                                            ? "selected"
                                                            : ""
                                                    }
                                                >
                                                    ${Utils.escapeHTML(
                                                        entry.name
                                                    )}
                                                </option>
                                            `
                                        )
                                        .join("")
                                }

                            </select>

                        </label>

                        <button
                            type="button"
                            class="button button-secondary"
                            data-calculator-reset
                        >
                            Reset Build
                        </button>

                    </div>


                    <div class="calculator-slots">

                        ${
                            Array.from(
                                {
                                    length:
                                        HOKSTATS_CONFIG.calculator.slots
                                },
                                (_, index) => {

                                    const item =
                                        selected[index];

                                    return `
                                        <article
                                            class="calculator-slot ${item ? "has-item" : "is-empty"}"
                                            data-calculator-slot="${index}"
                                        >

                                            <div class="calculator-slot-number">
                                                ${index + 1}
                                            </div>

                                            <div class="calculator-slot-icon">

                                                ${
                                                    item
                                                        ? Media.icon(
                                                            item.iconUrl,
                                                            item.name
                                                        )
                                                        : `
                                                            <span class="slot-plus">
                                                                +
                                                            </span>
                                                        `
                                                }

                                            </div>

                                            <div class="calculator-slot-copy">

                                                <strong>
                                                    ${
                                                        item
                                                            ? Utils.escapeHTML(
                                                                item.name
                                                            )
                                                            : "Empty slot"
                                                    }
                                                </strong>

                                                <small>
                                                    ${
                                                        item
                                                            ? Utils.escapeHTML(
                                                                Utils.capitalize(
                                                                    item.type
                                                                )
                                                            )
                                                            : "Tap to choose"
                                                    }
                                                </small>

                                            </div>

                                            ${
                                                item
                                                    ? `
                                                        <button
                                                            type="button"
                                                            class="calculator-slot-remove"
                                                            data-calculator-remove="${index}"
                                                            aria-label="Remove ${Utils.escapeHTML(item.name)}"
                                                        >
                                                            ×
                                                        </button>
                                                    `
                                                    : ""
                                            }

                                        </article>
                                    `;
                                }
                            ).join("")
                        }

                    </div>


                    <section class="calculator-stat-section">

                        ${Render.sectionHeader(
                            "Final Stats",
                            "Current prototype calculation: Base + Equipment."
                        )}

                        <div class="stat-grid stat-grid-large">

                            ${Render.stat(
                                "HP",
                                Utils.formatNumber(
                                    result.final.hp
                                )
                            )}

                            ${Render.stat(
                                "Physical Attack",
                                Utils.formatNumber(
                                    result.final.physicalAttack
                                )
                            )}

                            ${Render.stat(
                                "Magic Attack",
                                Utils.formatNumber(
                                    result.final.magicAttack
                                )
                            )}

                            ${Render.stat(
                                "Physical Defense",
                                Utils.formatNumber(
                                    result.final.physicalDefense
                                )
                            )}

                            ${Render.stat(
                                "Magic Defense",
                                Utils.formatNumber(
                                    result.final.magicDefense
                                )
                            )}

                            ${Render.stat(
                                "Attack Speed",
                                result.final.attackSpeed
                            )}

                            ${Render.stat(
                                "Movement Speed",
                                Utils.formatNumber(
                                    result.final.movementSpeed
                                )
                            )}

                            ${Render.stat(
                                "Crit Rate",
                                Utils.formatPercent(
                                    result.final.critRate
                                )
                            )}

                            ${Render.stat(
                                "Physical Pen.",
                                Utils.formatNumber(
                                    result.final.physicalPenetration
                                )
                            )}

                            ${Render.stat(
                                "Magic Pen.",
                                Utils.formatNumber(
                                    result.final.magicPenetration
                                )
                            )}

                            ${Render.stat(
                                "Cooldown Reduction",
                                Utils.formatPercent(
                                    result.final.cooldownReduction
                                )
                            )}

                        </div>

                    </section>

                </div>


                <aside class="calculator-sidebar">

                    <div class="calculator-breakdown">

                        ${Render.sectionHeader(
                            "Breakdown"
                        )}

                        ${
                            hero
                                ? `
                                    <div class="breakdown-row">
                                        <span>Base</span>
                                        <strong>
                                            ${Utils.escapeHTML(
                                                hero.name
                                            )}
                                        </strong>
                                    </div>
                                `
                                : `
                                    <div class="breakdown-row">
                                        <span>Base</span>
                                        <strong>
                                            Select a hero
                                        </strong>
                                    </div>
                                `
                        }

                        <div class="breakdown-row">
                            <span>Equipment</span>
                            <strong>
                                ${
                                    selected.filter(
                                        Boolean
                                    ).length
                                }
                                / 6
                            </strong>
                        </div>

                        <div class="breakdown-divider"></div>

                        <div class="breakdown-note">
                            Percentage modifiers, hero effects and item passive calculations will be handled by the verified calculator engine once the official mechanics dataset is connected.
                        </div>

                    </div>


                    <div class="calculator-sidebar-card">

                        <div class="eyebrow">
                            DATABASE STATUS
                        </div>

                        <h3>
                            Verification first
                        </h3>

                        <p>
                            The calculator should never invent mechanics when verified data is unavailable.
                        </p>

                    </div>

                </aside>

            </section>
        `;
    },


    async meta(app) {

        const role =
            AppState.metaRole;

        const data =
            await API.getMeta(role);

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: "META",
                title: "Meta",
                description:
                    "Role-based statistics from verified sources. Unavailable values remain unavailable."
            })}

            <section class="content-section">

                <div class="role-tabs">

                    ${
                        [
                            ["overview", "Overview"],
                            ["clash", "Clash Lane"],
                            ["jungle", "Jungle"],
                            ["mid", "Mid Lane"],
                            ["farm", "Farm Lane"],
                            ["roam", "Roamer"]
                        ]
                            .map(
                                ([id, label]) => `
                                    <button
                                        type="button"
                                        class="tab-button ${
                                            role === id
                                                ? "is-active"
                                                : ""
                                        }"
                                        data-meta-role="${id}"
                                    >
                                        ${Utils.escapeHTML(
                                            label
                                        )}
                                    </button>
                                `
                            )
                            .join("")
                    }

                </div>


                ${
                    data.length
                        ? `
                            <div class="data-table-wrap">

                                <table class="data-table">

                                    <thead>
                                        <tr>
                                            <th>Hero</th>
                                            <th>Win Rate</th>
                                            <th>Pick Rate</th>
                                            <th>Ban Rate</th>
                                            <th>Trend</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        ${
                                            data
                                                .map(
                                                    row => {

                                                        const hero =
                                                            DATA.heroes.find(
                                                                item =>
                                                                    item.id ===
                                                                    row.heroId
                                                            );

                                                        return `
                                                            <tr>

                                                                <td>
                                                                    <strong>
                                                                        ${
                                                                            hero
                                                                                ? Utils.escapeHTML(
                                                                                    hero.name
                                                                                )
                                                                                : "Unknown"
                                                                        }
                                                                    </strong>
                                                                </td>

                                                                <td>
                                                                    ${
                                                                        row.winRate === null
                                                                            ? "—"
                                                                            : Utils.formatPercent(
                                                                                row.winRate
                                                                            )
                                                                    }
                                                                </td>

                                                                <td>
                                                                    ${
                                                                        row.pickRate === null
                                                                            ? "—"
                                                                            : Utils.formatPercent(
                                                                                row.pickRate
                                                                            )
                                                                    }
                                                                </td>

                                                                <td>
                                                                    ${
                                                                        row.banRate === null
                                                                            ? "—"
                                                                            : Utils.formatPercent(
                                                                                row.banRate
                                                                            )
                                                                    }
                                                                </td>

                                                                <td>
                                                                    ${Utils.escapeHTML(
                                                                        row.trend
                                                                    )}
                                                                </td>

                                                            </tr>
                                                        `;
                                                    }
                                                )
                                                .join("")
                                        }

                                    </tbody>

                                </table>

                            </div>
                        `
                        : Render.emptyState(
                            "Meta data unavailable",
                            "No verified regional meta snapshot is currently available."
                        )
                }

            </section>
        `;
    },


    async patches(app) {

        const patches =
            await API.getPatches();

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: "PATCH HISTORY",
                title: "Patches",
                description:
                    "Track current and historical game versions without overwriting old records."
            })}


            <section class="content-section">

                <div class="patch-list">

                    ${
                        patches
                            .map(
                                patch => `
                                    <article class="patch-card">

                                        <div class="patch-version">
                                            ${Utils.escapeHTML(
                                                patch.version
                                            )}
                                        </div>

                                        <div class="patch-copy">

                                            <div class="patch-meta">
                                                ${Utils.escapeHTML(
                                                    patch.date
                                                )}
                                                ·
                                                ${Utils.escapeHTML(
                                                    patch.season
                                                )}

                                                ${
                                                    patch.status ===
                                                    "current"
                                                        ? Render.badge(
                                                            "Current",
                                                            "green"
                                                        )
                                                        : ""
                                                }

                                            </div>

                                            <h3>
                                                ${Utils.escapeHTML(
                                                    patch.title
                                                )}
                                            </h3>

                                            <p>
                                                ${Utils.escapeHTML(
                                                    patch.summary
                                                )}
                                            </p>

                                        </div>

                                        <a
                                            href="?page=patch&id=${encodeURIComponent(patch.id)}"
                                            data-page="patch"
                                            data-id="${Utils.escapeHTML(patch.id)}"
                                            class="text-link"
                                        >
                                            View →
                                        </a>

                                    </article>
                                `
                            )
                            .join("")
                    }

                </div>

            </section>
        `;
    },


    async patchDetail(app) {

        const params =
            Utils.getQueryParams();

        const patch =
            DATA.patches.find(
                item =>
                    item.id === params.id
            );

        if (!patch) {
            app.innerHTML =
                Render.emptyState(
                    "Patch not found"
                );
            return;
        }

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: `PATCH ${patch.version}`,
                title: patch.title,
                description: patch.summary
            })}

            <section class="content-section">

                <div class="patch-detail-grid">

                    <article class="patch-detail-section">

                        <h2>
                            Hero Changes
                        </h2>

                        ${
                            patch.heroChanges.length
                                ? patch.heroChanges
                                    .map(
                                        change => `
                                            <div class="change-row">
                                                ${Utils.escapeHTML(
                                                    change.description
                                                )}
                                            </div>
                                        `
                                    )
                                    .join("")
                                : Render.emptyState(
                                    "No verified hero changes"
                                )
                        }

                    </article>


                    <article class="patch-detail-section">

                        <h2>
                            Equipment Changes
                        </h2>

                        ${
                            patch.equipmentChanges.length
                                ? patch.equipmentChanges
                                    .map(
                                        change => `
                                            <div class="change-row">
                                                ${Utils.escapeHTML(
                                                    change.description
                                                )}
                                            </div>
                                        `
                                    )
                                    .join("")
                                : Render.emptyState(
                                    "No verified equipment changes"
                                )
                        }

                    </article>


                    <article class="patch-detail-section">

                        <h2>
                            System Changes
                        </h2>

                        ${
                            patch.systemChanges.length
                                ? patch.systemChanges
                                    .map(
                                        change => `
                                            <div class="change-row">
                                                ${Utils.escapeHTML(
                                                    change
                                                )}
                                            </div>
                                        `
                                    )
                                    .join("")
                                : Render.emptyState(
                                    "No verified system changes"
                                )
                        }

                    </article>

                </div>

            </section>
        `;
    },


    async news(app) {

        const news =
            await API.getNews();

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: "NEWS",
                title: "News",
                description:
                    "Official announcements, upcoming content and clearly labelled unconfirmed reports."
            })}

            <section class="content-section">

                <div class="news-filter-tabs">

                    <button
                        type="button"
                        class="tab-button is-active"
                        data-news-filter="all"
                    >
                        All
                    </button>

                    <button
                        type="button"
                        class="tab-button"
                        data-news-filter="OFFICIAL"
                    >
                        Official
                    </button>

                    <button
                        type="button"
                        class="tab-button"
                        data-news-filter="COMING_SOON"
                    >
                        Coming Soon
                    </button>

                    <button
                        type="button"
                        class="tab-button"
                        data-news-filter="RUMOR"
                    >
                        Leaks & Rumors
                    </button>

                </div>


                <div class="news-grid">

                    ${
                        news
                            .map(
                                NewsRenderer.card
                            )
                            .join("")
                    }

                </div>

            </section>
        `;
    },


    async guides(app) {

        const guides =
            await API.getGuides();

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: "GUIDES",
                title: "Guides",
                description:
                    "Practical explanations, beginner resources and deeper hero strategy."
            })}

            <section class="content-section">

                <div class="guide-grid">

                    ${
                        guides
                            .map(
                                GuideRenderer.card
                            )
                            .join("")
                    }

                </div>

            </section>
        `;
    },


    async guideDetail(app) {

        const params =
            Utils.getQueryParams();

        const guide =
            DATA.guides.find(
                item =>
                    item.slug ===
                    params.slug
            );

        app.innerHTML =
            GuideRenderer.detail(
                guide
            );
    },


    async community(app) {

        const questions =
            await API.getQuestions();

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: "COMMUNITY",
                title: "Community",
                description:
                    "Ask questions, share knowledge and discuss the game."
            })}

            <section class="content-section">

                <div class="community-toolbar">

                    <button
                        type="button"
                        class="button button-primary"
                        data-community-ask
                    >
                        Ask a Question
                    </button>

                    <div class="community-tabs">

                        <button
                            type="button"
                            class="tab-button is-active"
                            data-community-filter="recent"
                        >
                            Recent
                        </button>

                        <button
                            type="button"
                            class="tab-button"
                            data-community-filter="popular"
                        >
                            Popular
                        </button>

                    </div>

                </div>


                <div class="question-list">

                    ${
                        questions
                            .map(
                                QuestionRenderer.card
                            )
                            .join("")
                    }

                </div>

            </section>
        `;
    },


    async search(app) {

        const params =
            Utils.getQueryParams();

        const query =
            params.query ||
            params.q ||
            "";

        AppState.searchQuery =
            query;

        const results =
            Search.query(query);

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: "SEARCH",
                title: "Search",
                description:
                    query
                        ? `Results for "${query}"`
                        : "Search the entire HoKStats database."
            })}

            <section class="content-section">

                <div class="search-page-box">

                    <input
                        type="search"
                        class="form-input"
                        id="search-page-input"
                        data-global-search
                        value="${Utils.escapeHTML(
                            query
                        )}"
                        placeholder="Search heroes, equipment, builds..."
                    >

                </div>


                <div class="search-results">

                    ${
                        results.length
                            ? results
                                .map(
                                    result => `
                                        <a
                                            href="?page=${
                                                result.type === "hero"
                                                    ? "hero"
                                                    : result.type === "equipment"
                                                        ? "item"
                                                        : result.type
                                            }&slug=${encodeURIComponent(result.slug)}"
                                            data-page="${
                                                result.type === "hero"
                                                    ? "hero"
                                                    : result.type === "equipment"
                                                        ? "item"
                                                        : result.type
                                            }"
                                            data-slug="${Utils.escapeHTML(result.slug)}"
                                            class="search-result"
                                        >

                                            <div class="search-result-icon">
                                                ${Utils.getInitials(
                                                    result.title
                                                )}
                                            </div>

                                            <div class="search-result-copy">

                                                <div class="eyebrow">
                                                    ${Utils.escapeHTML(
                                                        result.type
                                                    )}
                                                </div>

                                                <h3>
                                                    ${Utils.escapeHTML(
                                                        result.title
                                                    )}
                                                </h3>

                                                <p>
                                                    ${Utils.escapeHTML(
                                                        result.description
                                                    )}
                                                </p>

                                            </div>

                                            <span>
                                                →
                                            </span>

                                        </a>
                                    `
                                )
                                .join("")
                            : Render.emptyState(
                                query
                                    ? "No results found"
                                    : "Start searching",
                                query
                                    ? "Try another name or keyword."
                                    : "Search heroes, equipment, builds, guides and news."
                            )
                    }

                </div>

            </section>
        `;
    },


    async about(app) {

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: "ABOUT",
                title: "About HoKStats.gg",
                description:
                    "A living Honor of Kings database, utility and community hub."
            })}

            <section class="content-section">

                <div class="prose-layout">

                    <article class="info-panel">

                        <div class="eyebrow">
                            PURPOSE
                        </div>

                        <h2>
                            Information first.
                        </h2>

                        <p>
                            HoKStats.gg is designed around verified game information, useful tools and a clean database experience.
                        </p>

                    </article>


                    <article class="info-panel">

                        <div class="eyebrow">
                            DATA SOURCES
                        </div>

                        <h2>
                            Official-first verification
                        </h2>

                        <p>
                            Official live data is prioritized. Official announcements and verified historical information are used where appropriate.
                        </p>

                    </article>


                    <article class="info-panel">

                        <div class="eyebrow">
                            DISCLAIMER
                        </div>

                        <h2>
                            Independent project
                        </h2>

                        <p>
                            HoKStats.gg is an independent project and is not presented as an official Honor of Kings website.
                        </p>

                    </article>

                </div>

            </section>
        `;
    },


    async data(app) {

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: "DATA",
                title: "Data Status",
                description:
                    "Information about dataset versioning, verification and update status."
            })}


            <section class="content-section">

                <div class="data-status-grid">

                    <article class="data-status-card">

                        <span>
                            Live Data
                        </span>

                        <strong>
                            Connected
                        </strong>

                        <small>
                            Prototype dataset
                        </small>

                    </article>


                    <article class="data-status-card">

                        <span>
                            Test Data
                        </span>

                        <strong>
                            Separate
                        </strong>

                        <small>
                            Never treated as live
                        </small>

                    </article>


                    <article class="data-status-card">

                        <span>
                            Verification
                        </span>

                        <strong>
                            Official-first
                        </strong>

                        <small>
                            Unverified values remain unavailable
                        </small>

                    </article>


                    <article class="data-status-card">

                        <span>
                            Version
                        </span>

                        <strong>
                            ${Utils.escapeHTML(
                                HOKSTATS_CONFIG.version
                            )}
                        </strong>

                        <small>
                            Frontend prototype
                        </small>

                    </article>

                </div>


                <div class="info-panel">

                    <h2>
                        Update pipeline
                    </h2>

                    <div class="pipeline">

                        <span>Official Source</span>
                        <b>→</b>
                        <span>Collector</span>
                        <b>→</b>
                        <span>Change Detection</span>
                        <b>→</b>
                        <span>Validation</span>
                        <b>→</b>
                        <span>Database</span>

                    </div>

                </div>

            </section>
        `;
    },


    async admin(app) {

        app.innerHTML = `

            ${Render.pageHeader({
                eyebrow: "ADMIN",
                title: "Admin Dashboard",
                description:
                    "Administrative controls are intentionally separate from public navigation."
            })}


            <section class="content-section">

                <div class="admin-grid">

                    ${this.adminCard(
                        "Heroes",
                        "Manage verified hero data.",
                        "heroes"
                    )}

                    ${this.adminCard(
                        "Equipment",
                        "Manage equipment and passives.",
                        "equipment"
                    )}

                    ${this.adminCard(
                        "Patches",
                        "Review patch records.",
                        "patches"
                    )}

                    ${this.adminCard(
                        "News",
                        "Manage official and community content.",
                        "news"
                    )}

                    ${this.adminCard(
                        "Guides",
                        "Review guide status.",
                        "guides"
                    )}

                    ${this.adminCard(
                        "Community",
                        "Moderate questions and reports.",
                        "community"
                    )}

                    ${this.adminCard(
                        "Data Sync",
                        "Review synchronization jobs.",
                        "data"
                    )}

                    ${this.adminCard(
                        "Logs",
                        "Review change history and verification.",
                        "data"
                    )}

                </div>

            </section>
        `;
    },


    adminCard(title, description, page) {

        return `
            <button
                type="button"
                class="admin-card"
                data-page="${Utils.escapeHTML(page)}"
            >

                <span class="admin-card-mark">
                    +
                </span>

                <strong>
                    ${Utils.escapeHTML(title)}
                </strong>

                <small>
                    ${Utils.escapeHTML(description)}
                </small>

            </button>
        `;
    },


    async notFound(app) {

        app.innerHTML = `

            <section class="error-state">

                <div class="error-state-code">
                    404
                </div>

                <h1>
                    Page not found
                </h1>

                <p>
                    The requested HoKStats page does not exist.
                </p>

                <button
                    type="button"
                    class="button button-primary"
                    data-page="home"
                >
                    Back Home
                </button>

            </section>
        `;
    }
};


/* =========================================================
   22. NEWS RENDERER
   ========================================================= */

const NewsRenderer = {

    card(item) {

        const categoryClass =
            item.category === "RUMOR"
                ? "warning"
                : item.category === "OFFICIAL"
                    ? "green"
                    : "neutral";

        return `
            <article class="news-card">

                <a
                    href="?page=news&slug=${encodeURIComponent(item.slug)}"
                    data-page="news"
                    data-slug="${Utils.escapeHTML(item.slug)}"
                    class="news-media"
                >

                    ${Media.image(
                        item.imageUrl,
                        item.title,
                        "news-image"
                    )}

                    <div class="news-media-overlay"></div>

                    <div class="news-category">
                        ${Render.badge(
                            item.category === "RUMOR"
                                ? "UNCONFIRMED"
                                : item.category,
                            categoryClass
                        )}
                    </div>

                </a>

                <div class="news-card-body">

                    <div class="news-date">
                        ${Utils.escapeHTML(
                            item.date
                        )}
                    </div>

                    <h3>
                        ${Utils.escapeHTML(
                            item.title
                        )}
                    </h3>

                    <p>
                        ${Utils.escapeHTML(
                            item.summary
                        )}
                    </p>

                    <a
                        href="?page=news&slug=${encodeURIComponent(item.slug)}"
                        data-page="news"
                        data-slug="${Utils.escapeHTML(item.slug)}"
                        class="text-link"
                    >
                        Read more →
                    </a>

                </div>

            </article>
        `;
    }
};


/* =========================================================
   23. GUIDE RENDERER
   ========================================================= */

const GuideRenderer = {

    card(guide) {

        return `
            <article class="guide-card">

                <div class="guide-media">

                    ${Media.image(
                        guide.imageUrl,
                        guide.title,
                        "guide-image"
                    )}

                    <div class="guide-category">
                        ${Render.badge(
                            guide.category,
                            "green"
                        )}
                    </div>

                </div>

                <div class="guide-card-body">

                    <div class="guide-meta">
                        ${Utils.escapeHTML(
                            guide.patchVersion
                        )}
                        ·
                        ${Utils.escapeHTML(
                            guide.author
                        )}
                    </div>

                    <h3>
                        ${Utils.escapeHTML(
                            guide.title
                        )}
                    </h3>

                    <p>
                        ${Utils.escapeHTML(
                            guide.summary
                        )}
                    </p>

                    <a
                        href="?page=guide&slug=${encodeURIComponent(guide.slug)}"
                        data-page="guide"
                        data-slug="${Utils.escapeHTML(guide.slug)}"
                        class="text-link"
                    >
                        Read guide →
                    </a>

                </div>

            </article>
        `;
    },

    detail(guide) {

        if (!guide) {
            return Render.emptyState(
                "Guide not found"
            );
        }

        return `
            ${Render.pageHeader({
                eyebrow: guide.category,
                title: guide.title,
                description: guide.summary
            })}

            <section class="content-section">

                <div class="guide-detail-layout">

                    <article class="guide-content">

                        ${Media.image(
                            guide.imageUrl,
                            guide.title,
                            "guide-detail-image"
                        )}

                        <div class="prose-content">

                            <p>
                                ${Utils.escapeHTML(
                                    guide.content
                                )}
                            </p>

                        </div>

                    </article>


                    <aside class="guide-sidebar">

                        <div class="sidebar-panel">

                            <div class="eyebrow">
                                GUIDE INFO
                            </div>

                            <div class="sidebar-row">
                                <span>Category</span>
                                <strong>
                                    ${Utils.escapeHTML(
                                        guide.category
                                    )}
                                </strong>
                            </div>

                            <div class="sidebar-row">
                                <span>Patch</span>
                                <strong>
                                    ${Utils.escapeHTML(
                                        guide.patchVersion
                                    )}
                                </strong>
                            </div>

                            <div class="sidebar-row">
                                <span>Author</span>
                                <strong>
                                    ${Utils.escapeHTML(
                                        guide.author
                                    )}
                                </strong>
                            </div>

                        </div>

                    </aside>

                </div>

            </section>
        `;
    }
};


/* =========================================================
   24. COMMUNITY QUESTION RENDERER
   ========================================================= */

const QuestionRenderer = {

    card(question) {

        return `
            <article class="question-card">

                <div class="question-votes">

                    <strong>
                        ${Utils.formatNumber(
                            question.votes
                        )}
                    </strong>

                    <span>
                        votes
                    </span>

                </div>

                <div class="question-main">

                    <div class="question-meta">

                        ${Render.badge(
                            question.category,
                            "neutral"
                        )}

                        <span>
                            ${Utils.escapeHTML(
                                question.date
                            )}
                        </span>

                    </div>

                    <h3>
                        ${Utils.escapeHTML(
                            question.title
                        )}
                    </h3>

                    <p>
                        ${Utils.escapeHTML(
                            question.content
                        )}
                    </p>

                    <div class="question-bottom">

                        <span>
                            ${Utils.escapeHTML(
                                question.author
                            )}
                        </span>

                        <strong>
                            ${Utils.formatNumber(
                                question.answers
                            )}
                            answers
                        </strong>

                    </div>

                </div>

                <span class="question-arrow">
                    →
                </span>

            </article>
        `;
    }
};


/* =========================================================
   25. APP UI EVENTS
   ========================================================= */

const AppUI = {

    init() {

        document.addEventListener(
            "click",
            event => {

                const menuButton =
                    event.target.closest(
                        ".mobile-menu-toggle, [data-mobile-menu-toggle]"
                    );

                if (menuButton) {
                    Navigation.toggleMobileMenu();
                    return;
                }


                const bookmark =
                    event.target.closest(
                        "[data-bookmark-type]"
                    );

                if (bookmark) {

                    event.preventDefault();
                    event.stopPropagation();

                    Bookmarks.toggle(
                        bookmark.dataset.bookmarkType,
                        bookmark.dataset.bookmarkId
                    );

                    return;
                }


                const searchButton =
                    event.target.closest(
                        "[data-search-submit]"
                    );

                if (searchButton) {

                    const input =
                        DOM.query(
                            "[data-global-search]"
                        );

                    const query =
                        input?.value.trim();

                    if (query) {

                        Utils.updateURL({
                            page: "search",
                            q: query
                        });

                        Navigation.go(
                            "search"
                        );
                    }

                    return;
                }


                const heroFilter =
                    event.target.closest(
                        "[data-hero-filter]"
                    );

                if (heroFilter) {
                    return;
                }


                const metaRole =
                    event.target.closest(
                        "[data-meta-role]"
                    );

                if (metaRole) {

                    AppState.metaRole =
                        metaRole.dataset.metaRole;

                    Router.render();

                    return;
                }


                const buildTab =
                    event.target.closest(
                        "[data-build-tab]"
                    );

                if (buildTab) {

                    const tab =
                        buildTab.dataset.buildTab;

                    if (tab === "recommended") {

                        Router.render();

                    } else {

                        Toast.show(
                            "Community builds will be connected to user accounts.",
                            "info"
                        );
                    }

                    return;
                }


                const communityFilter =
                    event.target.closest(
                        "[data-community-filter]"
                    );

                if (communityFilter) {

                    AppState.communityFilter =
                        communityFilter.dataset.communityFilter;

                    Router.render();

                    return;
                }


                const ask =
                    event.target.closest(
                        "[data-community-ask]"
                    );

                if (ask) {

                    this.openQuestionModal();

                    return;
                }


                const useBuild =
                    event.target.closest(
                        "[data-use-build]"
                    );

                if (useBuild) {

                    const build =
                        DATA.builds.find(
                            item =>
                                item.id ===
                                useBuild.dataset.useBuild
                        );

                    if (!build) {
                        return;
                    }

                    AppState.calculator = {
                        heroId: build.heroId,
                        slots: [
                            ...build.items,
                            null,
                            null
                        ].slice(0, 6)
                    };

                    Calculator.save();

                    Navigation.go(
                        "calculator"
                    );

                    return;
                }


                const equipmentFilter =
                    event.target.closest(
                        "[data-equipment-filter]"
                    );

                if (equipmentFilter) {
                    return;
                }


                const newsFilter =
                    event.target.closest(
                        "[data-news-filter]"
                    );

                if (newsFilter) {

                    const category =
                        newsFilter.dataset.newsFilter;

                    DOM.queryAll(
                        ".news-card"
                    ).forEach(card => {

                        if (category === "all") {
                            card.hidden = false;
                            return;
                        }

                        const badge =
                            card.querySelector(
                                ".news-category"
                            );

                        const text =
                            badge?.textContent
                                ?.trim()
                                .toUpperCase();

                        card.hidden =
                            !text?.includes(
                                category === "RUMOR"
                                    ? "UNCONFIRMED"
                                    : category
                            );
                    });

                    DOM.queryAll(
                        "[data-news-filter]"
                    ).forEach(button => {

                        button.classList.toggle(
                            "is-active",
                            button === newsFilter
                        );
                    });

                    return;
                }

            }
        );


        document.addEventListener(
            "change",
            event => {

                const heroFilter =
                    event.target.closest(
                        "[data-hero-filter]"
                    );

                if (heroFilter) {

                    AppState.heroFilter[
                        heroFilter.dataset.heroFilter
                    ] =
                        heroFilter.value;

                    Router.render();

                    return;
                }


                const equipmentFilter =
                    event.target.closest(
                        "[data-equipment-filter]"
                    );

                if (equipmentFilter) {

                    AppState.equipmentFilter[
                        equipmentFilter.dataset.equipmentFilter
                    ] =
                        equipmentFilter.value;

                    Router.render();

                    return;
                }


                const equipmentSearch =
                    event.target.closest(
                        "[data-equipment-search]"
                    );

                if (equipmentSearch) {

                    AppState.equipmentFilter.query =
                        equipmentSearch.value;

                    Router.render();
                }
            }
        );


        const equipmentSearchInput =
            document.querySelector(
                "[data-equipment-search]"
            );

        if (equipmentSearchInput) {

            equipmentSearchInput.addEventListener(
                "input",
                Utils.debounce(
                    event => {

                        AppState.equipmentFilter.query =
                            event.target.value;

                        Router.render();

                    },
                    200
                )
            );
        }
    },


    bindDynamicActions() {

        const equipmentSearchInput =
            DOM.query(
                "[data-equipment-search]"
            );

        if (
            equipmentSearchInput &&
            equipmentSearchInput.dataset.bound !== "true"
        ) {

            equipmentSearchInput.dataset.bound =
                "true";

            equipmentSearchInput.addEventListener(
                "input",
                Utils.debounce(
                    event => {

                        AppState.equipmentFilter.query =
                            event.target.value;

                        Router.render();

                    },
                    220
                )
            );
        }


        DOM.queryAll(
            "[data-meta-role]"
        ).forEach(button => {

            button.classList.toggle(
                "is-active",
                button.dataset.metaRole ===
                AppState.metaRole
            );
        });
    },


    refreshActiveNavigation() {

        DOM.queryAll(
            "[data-page]"
        ).forEach(link => {

            const target =
                link.dataset.page;

            link.classList.toggle(
                "is-active",
                target === AppState.page ||
                (
                    target === "heroes" &&
                    AppState.page === "hero"
                ) ||
                (
                    target === "equipment" &&
                    AppState.page === "item"
                ) ||
                (
                    target === "builds" &&
                    AppState.page === "build"
                ) ||
                (
                    target === "patches" &&
                    AppState.page === "patch"
                ) ||
                (
                    target === "guides" &&
                    AppState.page === "guide"
                )
            );
        });
    },


    openQuestionModal() {

        Modal.open(
            `
                <form
                    id="question-form"
                    class="question-form"
                >

                    <label>
                        Title
                        <input
                            type="text"
                            class="form-input"
                            name="title"
                            required
                            maxlength="160"
                            placeholder="What do you want to ask?"
                        >
                    </label>

                    <label>
                        Category
                        <select
                            class="form-select"
                            name="category"
                        >
                            <option value="GENERAL">
                                General
                            </option>

                            <option value="HERO">
                                Heroes
                            </option>

                            <option value="EQUIPMENT">
                                Equipment
                            </option>

                            <option value="CALCULATOR">
                                Calculator
                            </option>

                            <option value="DATA">
                                Data
                            </option>
                        </select>
                    </label>

                    <label>
                        Question
                        <textarea
                            class="form-textarea"
                            name="content"
                            required
                            maxlength="5000"
                            rows="6"
                            placeholder="Explain your question..."
                        ></textarea>
                    </label>

                    <div class="modal-actions">

                        <button
                            type="button"
                            class="button button-secondary"
                            data-modal-close
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            class="button button-primary"
                        >
                            Post Question
                        </button>

                    </div>

                </form>
            `,
            {
                eyebrow: "COMMUNITY",
                title: "Ask a Question"
            }
        );

        const form =
            DOM.query(
                "#question-form"
            );

        form?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const data =
                    new FormData(form);

                const title =
                    String(
                        data.get("title") || ""
                    ).trim();

                const content =
                    String(
                        data.get("content") || ""
                    ).trim();

                if (!title || !content) {

                    Toast.show(
                        "Please complete the question.",
                        "error"
                    );

                    return;
                }

                Toast.show(
                    "Question saved locally for this prototype.",
                    "success"
                );

                Modal.close();
            }
        );

        DOM.queryAll(
            "[data-modal-close]"
        ).forEach(button => {

            button.addEventListener(
                "click",
                () => Modal.close()
            );
        });
    }
};


/* =========================================================
   26. LANGUAGE PLACEHOLDER SYSTEM
   =========================================================

   Real i18n should eventually come from translation data.

   Entity IDs stay shared between languages.
   ========================================================= */

const I18N = {

    dictionaries: {

        en: {
            home: "Home",
            heroes: "Heroes",
            equipment: "Equipment",
            builds: "Builds",
            calculator: "Calculator",
            meta: "Meta",
            patches: "Patches",
            guides: "Guides",
            community: "Community",
            search: "Search"
        },

        vi: {
            home: "Trang chủ",
            heroes: "Tướng",
            equipment: "Trang bị",
            builds: "Build",
            calculator: "Máy tính",
            meta: "Meta",
            patches: "Bản cập nhật",
            guides: "Hướng dẫn",
            community: "Cộng đồng",
            search: "Tìm kiếm"
        }
    },

    t(key) {

        const language =
            AppState.language;

        return (
            this.dictionaries[
                language
            ]?.[key] ||
            this.dictionaries.en[key] ||
            key
        );
    },

    setLanguage(language) {

        if (
            !HOKSTATS_CONFIG.supportedLanguages
                .includes(language)
        ) {
            return;
        }

        AppState.language =
            language;

        Storage.set(
            HOKSTATS_CONFIG.storageKeys.language,
            language
        );

        Router.render();
    }
};


/* =========================================================
   27. GLOBAL KEYBOARD SHORTCUTS
   ========================================================= */

const Keyboard = {

    init() {

        document.addEventListener(
            "keydown",
            event => {

                const target =
                    event.target;

                const editing =
                    target &&
                    (
                        target.matches(
                            "input, textarea, select"
                        ) ||
                        target.isContentEditable
                    );

                if (editing) {
                    return;
                }


                /*
                 * "/" focuses global search.
                 */
                if (event.key === "/") {

                    event.preventDefault();

                    const input =
                        DOM.query(
                            "[data-global-search]"
                        );

                    if (input) {
                        input.focus();
                    }

                    return;
                }


                /*
                 * Escape closes search suggestions.
                 */
                if (event.key === "Escape") {
                    Search.hideSuggestions();
                }

            }
        );
    }
};


/* =========================================================
   28. SEARCH OUTSIDE CLICK
   ========================================================= */

const SearchOutsideClick = {

    init() {

        document.addEventListener(
            "click",
            event => {

                if (
                    !event.target.closest(
                        ".home-search, .global-search, .search-box, .search-suggestions"
                    )
                ) {
                    Search.hideSuggestions();
                }

            }
        );
    }
};


/* =========================================================
   29. IMAGE FALLBACK HANDLER
   ========================================================= */

const ImageFallbacks = {

    init() {

        document.addEventListener(
            "error",
            event => {

                const image =
                    event.target;

                if (
                    image.tagName !== "IMG"
                ) {
                    return;
                }

                if (
                    image.dataset.fallbackApplied ===
                    "true"
                ) {
                    return;
                }

                image.dataset.fallbackApplied =
                    "true";

                image.style.display =
                    "none";

                const parent =
                    image.parentElement;

                if (!parent) {
                    return;
                }

                parent.classList.add(
                    "has-image-fallback"
                );

                if (
                    !parent.querySelector(
                        ".media-placeholder"
                    )
                ) {

                    const fallback =
                        DOM.create(
                            "div",
                            "media-placeholder"
                        );

                    fallback.innerHTML = `
                        <div class="media-placeholder-grid"></div>
                        <div class="media-placeholder-mark">
                            <span>HoK</span>
                            <small>ARTWORK</small>
                        </div>
                    `;

                    parent.appendChild(
                        fallback
                    );
                }
            },
            true
        );
    }
};


/* =========================================================
   30. INTERSECTION OBSERVER
   ========================================================= */

const RevealAnimations = {

    init() {

        if (
            Utils.prefersReducedMotion()
        ) {
            return;
        }

        if (
            !("IntersectionObserver" in window)
        ) {
            return;
        }

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "is-visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }

                        }
                    );

                },
                {
                    threshold: 0.08
                }
            );

        this.observe(
            observer
        );
    },

    observe(observer) {

        DOM.queryAll(
            ".hero-card, .equipment-card, .build-card, .news-card, .guide-card, .question-card, .info-panel, .stat-block"
        ).forEach(
            element => {

                if (
                    element.dataset.revealBound ===
                    "true"
                ) {
                    return;
                }

                element.dataset.revealBound =
                    "true";

                element.classList.add(
                    "reveal-on-scroll"
                );

                observer.observe(
                    element
                );
            }
        );
    }
};


/* =========================================================
   31. PAGE VISIBILITY
   ========================================================= */

const PageVisibility = {

    init() {

        document.addEventListener(
            "visibilitychange",
            () => {

                if (
                    document.hidden
                ) {
                    Slider.stop();
                } else if (
                    AppState.page ===
                    "home"
                ) {
                    Slider.start();
                }

            }
        );
    }
};


/* =========================================================
   32. MOBILE SWIPE NAVIGATION
   ========================================================= */

const MobileNavigation = {

    init() {

        let startX = null;
        let startY = null;

        document.addEventListener(
            "touchstart",
            event => {

                if (
                    AppState.page !==
                    "home"
                ) {
                    return;
                }

                startX =
                    event.touches[0]?.clientX;

                startY =
                    event.touches[0]?.clientY;

            },
            {
                passive: true
            }
        );

        document.addEventListener(
            "touchend",
            event => {

                if (
                    startX === null ||
                    startY === null
                ) {
                    return;
                }

                const endX =
                    event.changedTouches[0]?.clientX;

                const endY =
                    event.changedTouches[0]?.clientY;

                if (
                    endX === undefined ||
                    endY === undefined
                ) {
                    return;
                }

                const deltaX =
                    endX - startX;

                const deltaY =
                    endY - startY;

                if (
                    Math.abs(deltaX) >
                    70 &&
                    Math.abs(deltaX) >
                    Math.abs(deltaY)
                ) {

                    if (
                        deltaX < 0
                    ) {
                        Slider.next();
                    } else {
                        Slider.previous();
                    }
                }

                startX = null;
                startY = null;

            },
            {
                passive: true
            }
        );
    }
};


/* =========================================================
   33. DATA HEALTH CHECK
   ========================================================= */

const DataHealth = {

    run() {

        const report = {
            heroes: DATA.heroes.length,
            equipment: DATA.equipment.length,
            builds: DATA.builds.length,
            patches: DATA.patches.length,
            news: DATA.news.length,
            guides: DATA.guides.length,
            questions:
                DATA.community.questions.length,
            brokenBuildItems: 0,
            brokenBuildHeroes: 0
        };


        DATA.builds.forEach(
            build => {

                if (
                    !DATA.heroes.some(
                        hero =>
                            hero.id ===
                            build.heroId
                    )
                ) {
                    report.brokenBuildHeroes++;
                }

                build.items.forEach(
                    itemId => {

                        if (
                            !DATA.equipment.some(
                                item =>
                                    item.id ===
                                    itemId
                            )
                        ) {
                            report.brokenBuildItems++;
                        }
                    }
                );
            }
        );


        if (
            report.brokenBuildItems > 0 ||
            report.brokenBuildHeroes > 0
        ) {

            console.warn(
                "[HoKStats] Data health warning:",
                report
            );
        }

        return report;
    }
};


/* =========================================================
   34. ADMIN-READY DATA EVENTS
   ========================================================= */

const DataEvents = {

    emit(name, payload = {}) {

        window.dispatchEvent(
            new CustomEvent(
                `hokstats:${name}`,
                {
                    detail: payload
                }
            )
        );
    },

    on(name, callback) {

        window.addEventListener(
            `hokstats:${name}`,
            callback
        );
    }
};


/* =========================================================
   35. APP INITIALIZATION
   ========================================================= */

const App = {

    async init() {

        console.log(
            `%cHoKStats.gg%c frontend initialized`,
            "font-weight:700;color:#20C878;",
            "font-weight:400;color:inherit;"
        );

        Calculator.init();

        DataHealth.run();

        Navigation.init();

        AppUI.init();

        Keyboard.init();

        SearchOutsideClick.init();

        ImageFallbacks.init();

        PageVisibility.init();

        MobileNavigation.init();

        RevealAnimations.init();

        Navigation.loadFromURL();

        this.bindGlobalLanguage();

        this.bindBeforeUnload();

        this.exposeDebugTools();
    },


    bindGlobalLanguage() {

        DOM.queryAll(
            "[data-language]"
        ).forEach(select => {

            select.addEventListener(
                "change",
                event => {

                    I18N.setLanguage(
                        event.target.value
                    );
                }
            );

        });
    },


    bindBeforeUnload() {

        window.addEventListener(
            "beforeunload",
            () => {
                Slider.stop();
            }
        );
    },


    exposeDebugTools() {

        /*
         * Small developer helpers.
         * No production secrets.
         */

        window.HoKStats = {
            state: AppState,
            data: DATA,
            api: API,
            calculator: Calculator,
            navigation: Navigation,
            search: Search,
            bookmarks: Bookmarks,
            toast: Toast,
            modal: Modal,
            health: DataHealth
        };
    }
};


/* =========================================================
   36. START APPLICATION
   ========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => App.init(),
        {
            once: true
        }
    );

} else {

    App.init();

}


/* =========================================================
   END OF HoKStats.gg SCRIPT
   ========================================================= */
