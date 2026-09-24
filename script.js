/* ============================================================
   HOKSTAT.GG
   HOMEPAGE FRONTEND ENGINE
   ============================================================ */


/* ============================================================
   DEMO CONTENT
   ------------------------------------------------------------
   TEMPORARY ONLY.

   Later this entire section will be replaced by API/database
   data from HoKStat.

   Artwork fields are intentionally empty.
   Admin / official asset system can fill them later.
   ============================================================ */

const homepageContent = [

    {
        type: "hero",

        title: "Discover the Heroes",

        subtitle:
            "Explore abilities, stats, builds, skins and more.",

        meta: [
            "Hero Database",
            "Official Data"
        ],

        buttonText: "EXPLORE HEROES",

        link: "/heroes",

        artwork: "",

        alt: "Honor of Kings hero artwork"
    },


    {
        type: "build",

        title: "Build Your Way",

        subtitle:
            "Explore recommended builds or create your own setup.",

        meta: [
            "6 Equipment Slots",
            "Calculator Ready"
        ],

        buttonText: "VIEW BUILDS",

        link: "/builds",

        artwork: "",

        alt: "Honor of Kings build artwork",

        items: [
            "",
            "",
            "",
            "",
            "",
            ""
        ]
    },


    {
        type: "equipment",

        title: "Know Your Equipment",

        subtitle:
            "Stats, passives, prices, build paths and item history.",

        meta: [
            "Official Data",
            "Item Database"
        ],

        buttonText: "EXPLORE EQUIPMENT",

        link: "/equipment",

        artwork: "",

        alt: "Honor of Kings equipment artwork"
    },


    {
        type: "patch",

        title: "Patch Updates",

        subtitle:
            "Track hero changes, equipment changes and system updates.",

        meta: [
            "Patch History",
            "Version Tracking"
        ],

        buttonText: "VIEW PATCHES",

        link: "/patches",

        artwork: "",

        alt: "Honor of Kings patch artwork",

        version: "PATCH —",

        date: "DATE —"
    },


    {
        type: "guide",

        title: "Learn the Game",

        subtitle:
            "From beginner fundamentals to advanced gameplay.",

        meta: [
            "Guides",
            "Community"
        ],

        buttonText: "READ GUIDES",

        link: "/guides",

        artwork: "",

        alt: "Honor of Kings guide artwork"
    },


    {
        type: "news",

        title: "What's Happening in HoK?",

        subtitle:
            "Official announcements, upcoming content and community news.",

        meta: [
            "Official News",
            "Updates"
        ],

        buttonText: "VIEW NEWS",

        link: "/news",

        artwork: "",

        alt: "Honor of Kings news artwork"
    }

];


/* ============================================================
   STATE
   ============================================================ */

let currentSlide = 0;

let sliderTimer = null;

const SLIDE_DURATION = 6500;


/* ============================================================
   DOM
   ============================================================ */

const slidesContainer =
    document.getElementById("slidesContainer");

const sliderDots =
    document.getElementById("sliderDots");

const slideCounter =
    document.getElementById("slideCounter");

const sliderPrev =
    document.getElementById("sliderPrev");

const sliderNext =
    document.getElementById("sliderNext");

const heroSlider =
    document.getElementById("heroSlider");

const menuToggle =
    document.getElementById("menuToggle");

const mainMenu =
    document.getElementById("mainMenu");


/* ============================================================
   HELPERS
   ============================================================ */

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function typeLabel(type) {

    const labels = {

        hero: "FEATURED HERO",

        build: "FEATURED BUILD",

        equipment: "EQUIPMENT",

        patch: "LATEST UPDATE",

        guide: "FEATURED GUIDE",

        news: "NEWS"

    };

    return labels[type] || "FEATURED";
}


function loadImage(imageElement, url, alt = "") {

    if (!imageElement || !url) {
        return;
    }

    imageElement.alt = alt;

    imageElement.onload = () => {

        imageElement.classList.add("loaded");

    };

    imageElement.onerror = () => {

        imageElement.classList.remove("loaded");

    };

    imageElement.src = url;
}


/* ============================================================
   BUILD SLIDES
   ============================================================ */

function createSlides() {

    slidesContainer.innerHTML = "";

    sliderDots.innerHTML = "";

    homepageContent.forEach((item, index) => {

        const slide =
            document.createElement("article");

        slide.className =
            "hero-slide" +
            (index === 0 ? " active" : "");

        slide.dataset.type = item.type;

        slide.dataset.index = index;


        /* ART */

        const art =
            document.createElement("div");

        art.className =
            `slide-art ${item.type}-art`;


        const image =
            document.createElement("img");

        image.className =
            "slide-image";

        image.alt =
            item.alt || "";


        if (item.artwork) {

            loadImage(
                image,
                item.artwork,
                item.alt
            );

        }


        art.appendChild(image);


        /* CONTENT */

        const content =
            document.createElement("div");

        content.className =
            "slide-content";


        const category =
            document.createElement("span");

        category.className =
            "slide-category";

        category.textContent =
            typeLabel(item.type);


        const title =
            document.createElement("h1");

        title.className =
            "slide-title";

        title.textContent =
            item.title;


        const subtitle =
            document.createElement("p");

        subtitle.className =
            "slide-subtitle";

        subtitle.textContent =
            item.subtitle;


        content.appendChild(category);

        content.appendChild(title);

        content.appendChild(subtitle);


        /* META */

        if (Array.isArray(item.meta)) {

            const meta =
                document.createElement("div");

            meta.className =
                "slide-meta";


            item.meta.forEach(metaText => {

                const span =
                    document.createElement("span");

                span.textContent =
                    metaText;

                meta.appendChild(span);

            });


            content.appendChild(meta);

        }


        /* BUILD ITEMS */

        if (
            item.type === "build" &&
            Array.isArray(item.items)
        ) {

            const preview =
                document.createElement("div");

            preview.className =
                "equipment-preview";


            item.items.forEach((itemImage, itemIndex) => {

                const slot =
                    document.createElement("div");

                slot.className =
                    "equipment-slot";


                const slotImage =
                    document.createElement("img");

                slotImage.alt =
                    `Equipment slot ${itemIndex + 1}`;


                if (itemImage) {

                    loadImage(
                        slotImage,
                        itemImage,
                        `Equipment slot ${itemIndex + 1}`
                    );

                }


                slot.appendChild(slotImage);

                preview.appendChild(slot);

            });


            content.appendChild(preview);

        }


        /* PATCH META */

        if (item.type === "patch") {

            const patchMeta =
                document.createElement("div");

            patchMeta.className =
                "slide-meta";


            const version =
                document.createElement("span");

            version.textContent =
                item.version || "PATCH —";


            const date =
                document.createElement("span");

            date.textContent =
                item.date || "DATE —";


            patchMeta.appendChild(version);

            patchMeta.appendChild(date);

            content.appendChild(patchMeta);

        }


        /* BUTTON */

        const button =
            document.createElement("a");

        button.className =
            "slide-button primary-button";

        button.href =
            item.link || "#";

        button.textContent =
            item.buttonText || "EXPLORE";


        content.appendChild(button);


        slide.appendChild(art);

        slide.appendChild(content);

        slidesContainer.appendChild(slide);


        /* DOT */

        const dot =
            document.createElement("button");

        dot.type = "button";

        dot.className =
            "slider-dot" +
            (index === 0 ? " active" : "");

        dot.dataset.slide = index;

        dot.setAttribute(
            "aria-label",
            `Go to slide ${index + 1}`
        );


        dot.addEventListener(
            "click",
            () => {

                goToSlide(index);

                restartSlider();

            }
        );


        sliderDots.appendChild(dot);

    });


    updateCounter();

}


/* ============================================================
   SLIDER
   ============================================================ */

function getSlides() {

    return Array.from(
        slidesContainer.querySelectorAll(
            ".hero-slide"
        )
    );

}


function getDots() {

    return Array.from(
        sliderDots.querySelectorAll(
            ".slider-dot"
        )
    );

}


function goToSlide(index) {

    const slides = getSlides();

    const dots = getDots();


    if (!slides.length) {
        return;
    }


    if (index < 0) {
        index = slides.length - 1;
    }

    if (index >= slides.length) {
        index = 0;
    }


    slides.forEach(
        (slide, slideIndex) => {

            slide.classList.toggle(
                "active",
                slideIndex === index
            );

        }
    );


    dots.forEach(
        (dot, dotIndex) => {

            dot.classList.toggle(
                "active",
                dotIndex === index
            );

        }
    );


    currentSlide = index;

    updateCounter();

}


function nextSlide() {

    goToSlide(
        currentSlide + 1
    );

}


function previousSlide() {

    goToSlide(
        currentSlide - 1
    );

}


function startSlider() {

    stopSlider();


    sliderTimer =
        setInterval(
            () => {

                nextSlide();

            },
            SLIDE_DURATION
        );

}


function stopSlider() {

    if (sliderTimer) {

        clearInterval(sliderTimer);

        sliderTimer = null;

    }

}


function restartSlider() {

    startSlider();

}


function updateCounter() {

    const total =
        homepageContent.length;

    const current =
        currentSlide + 1;


    slideCounter.textContent =
        `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;

}


/* ============================================================
   SLIDER EVENTS
   ============================================================ */

sliderNext.addEventListener(
    "click",
    () => {

        nextSlide();

        restartSlider();

    }
);


sliderPrev.addEventListener(
    "click",
    () => {

        previousSlide();

        restartSlider();

    }
);


heroSlider.addEventListener(
    "mouseenter",
    () => {

        stopSlider();

    }
);


heroSlider.addEventListener(
    "mouseleave",
    () => {

        startSlider();

    }
);


/* ============================================================
   TOUCH / SWIPE
   ============================================================ */

let touchStartX = 0;

let touchEndX = 0;


heroSlider.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.changedTouches[0].screenX;

        stopSlider();

    },
    { passive: true }
);


heroSlider.addEventListener(
    "touchend",
    event => {

        touchEndX =
            event.changedTouches[0].screenX;


        const distance =
            touchEndX - touchStartX;


        if (Math.abs(distance) > 50) {

            if (distance < 0) {
                nextSlide();
            } else {
                previousSlide();
            }

        }


        startSlider();

    },
    { passive: true }
);


/* ============================================================
   KEYBOARD
   ============================================================ */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "ArrowRight"
        ) {

            nextSlide();

            restartSlider();

        }


        if (
            event.key === "ArrowLeft"
        ) {

            previousSlide();

            restartSlider();

        }

    }
);


/* ============================================================
   MOBILE MENU
   ============================================================ */

menuToggle.addEventListener(
    "click",
    () => {

        const isOpen =
            mainMenu.classList.toggle(
                "open"
            );


        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    }
);


/* Close menu after navigation */

mainMenu.addEventListener(
    "click",
    event => {

        if (
            event.target.tagName === "A"
        ) {

            mainMenu.classList.remove(
                "open"
            );

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);


/* ============================================================
   QUICK SEARCH
   ------------------------------------------------------------
   TEMPORARY local search.
   Later replaced with /api/search.
   ============================================================ */

const searchableContent = [

    {
        type: "HERO",
        name: "Dun",
        url: "/heroes/dun"
    },

    {
        type: "HERO",
        name: "Arthur",
        url: "/heroes/arthur"
    },

    {
        type: "EQUIPMENT",
        name: "Equipment Database",
        url: "/equipment"
    },

    {
        type: "BUILD",
        name: "Recommended Builds",
        url: "/builds"
    },

    {
        type: "GUIDE",
        name: "Beginner Guides",
        url: "/guides"
    },

    {
        type: "PATCH",
        name: "Patch History",
        url: "/patches"
    },

    {
        type: "NEWS",
        name: "Honor of Kings News",
        url: "/news"
    },

    {
        type: "COMMUNITY",
        name: "Community Q&A",
        url: "/community"
    }

];


const quickSearchForm =
    document.getElementById(
        "quickSearchForm"
    );

const quickSearchInput =
    document.getElementById(
        "quickSearchInput"
    );

const quickSearchResults =
    document.getElementById(
        "quickSearchResults"
    );


function renderSearchResults(query) {

    const cleanQuery =
        query
            .trim()
            .toLowerCase();


    if (!cleanQuery) {

        quickSearchResults.hidden =
            true;

        quickSearchResults.innerHTML =
            "";

        return;

    }


    const results =
        searchableContent
            .filter(item =>
                item.name
                    .toLowerCase()
                    .includes(cleanQuery)
            )
            .slice(0, 6);


    if (!results.length) {

        quickSearchResults.innerHTML = `

            <div class="search-result">

                <span class="search-result-type">
                    SEARCH
                </span>

                <span class="search-result-name">
                    No results found
                </span>

            </div>

        `;

        quickSearchResults.hidden =
            false;

        return;

    }


    quickSearchResults.innerHTML =
        results
            .map(item => `

                <a
                    href="${escapeHTML(item.url)}"
                    class="search-result"
                >

                    <span class="search-result-type">
                        ${escapeHTML(item.type)}
                    </span>

                    <span class="search-result-name">
                        ${escapeHTML(item.name)}
                    </span>

                </a>

            `)
            .join("");


    quickSearchResults.hidden =
        false;

}


quickSearchInput.addEventListener(
    "input",
    () => {

        renderSearchResults(
            quickSearchInput.value
        );

    }
);


quickSearchForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const query =
            quickSearchInput.value
                .trim();


        if (!query) {
            return;
        }


        const firstResult =
            searchableContent.find(item =>
                item.name
                    .toLowerCase()
                    .includes(
                        query.toLowerCase()
                    )
            );


        if (firstResult) {

            window.location.href =
                firstResult.url;

        } else {

            window.location.href =
                `/search?q=${encodeURIComponent(query)}`;

        }

    }
);


/* ============================================================
   OFFICIAL PATCH NOTES
   ------------------------------------------------------------
   TEMPORARY PLACEHOLDER.
   Later populated from verified official source.
   ============================================================ */

const officialPatch = {

    version: "PATCH —",

    title: "Latest Official Update",

    summary:
        "Official patch information will appear here after the verified official data source is connected.",

    date: "—",

    sourceUrl: "",

    artwork: "",

    alt:
        "Official Honor of Kings patch artwork"

};


function renderOfficialPatch() {

    const version =
        document.getElementById(
            "officialPatchVersion"
        );

    const title =
        document.getElementById(
            "officialPatchTitle"
        );

    const summary =
        document.getElementById(
            "officialPatchSummary"
        );

    const date =
        document.getElementById(
            "officialPatchDate"
        );

    const link =
        document.getElementById(
            "officialPatchLink"
        );

    const image =
        document.getElementById(
            "officialPatchImage"
        );


    version.textContent =
        officialPatch.version;

    title.textContent =
        officialPatch.title;

    summary.textContent =
        officialPatch.summary;

    date.textContent =
        officialPatch.date;


    if (officialPatch.sourceUrl) {

        link.href =
            officialPatch.sourceUrl;

        link.style.display =
            "inline";

    } else {

        link.style.display =
            "none";

    }


    if (officialPatch.artwork) {

        loadImage(
            image,
            officialPatch.artwork,
            officialPatch.alt
        );

    }

}


/* ============================================================
   FEATURED CONTENT
   ------------------------------------------------------------
   TEMPORARY placeholder data.
   ============================================================ */

const featuredContent = {

    main: {

        tag: "FEATURED",

        title: "Explore the World of HoKStat",

        description:
            "Heroes, equipment, builds, guides, updates and community resources.",

        link: "/heroes",

        artwork: "",

        alt: "Featured Honor of Kings content"

    },


    smallOne: {

        title: "Featured Hero",

        link: "/heroes",

        artwork: "",

        alt: "Featured Honor of Kings hero"

    },


    smallTwo: {

        title: "Featured Build",

        link: "/builds",

        artwork: "",

        alt: "Featured Honor of Kings build"

    }

};


function renderFeaturedContent() {

    const mainImage =
        document.getElementById(
            "featuredMainImage"
        );

    const mainTag =
        document.getElementById(
            "featuredMainTag"
        );

    const mainTitle =
        document.getElementById(
            "featuredMainTitle"
        );

    const mainDescription =
        document.getElementById(
            "featuredMainDescription"
        );

    const mainLink =
        document.getElementById(
            "featuredMainLink"
        );


    mainTag.textContent =
        featuredContent.main.tag;

    mainTitle.textContent =
        featuredContent.main.title;

    mainDescription.textContent =
        featuredContent.main.description;

    mainLink.href =
        featuredContent.main.link;


    if (featuredContent.main.artwork) {

        loadImage(
            mainImage,
            featuredContent.main.artwork,
            featuredContent.main.alt
        );

    }


    const smallImage1 =
        document.getElementById(
            "featuredSmallImage1"
        );

    const smallTitle1 =
        document.getElementById(
            "featuredSmallTitle1"
        );

    const smallLink1 =
        document.getElementById(
            "featuredSmallLink1"
        );


    smallTitle1.textContent =
        featuredContent.smallOne.title;

    smallLink1.href =
        featuredContent.smallOne.link;


    if (featuredContent.smallOne.artwork) {

        loadImage(
            smallImage1,
            featuredContent.smallOne.artwork,
            featuredContent.smallOne.alt
        );

    }


    const smallImage2 =
        document.getElementById(
            "featuredSmallImage2"
        );

    const smallTitle2 =
        document.getElementById(
            "featuredSmallTitle2"
        );

    const smallLink2 =
        document.getElementById(
            "featuredSmallLink2"
        );


    smallTitle2.textContent =
        featuredContent.smallTwo.title;

    smallLink2.href =
        featuredContent.smallTwo.link;


    if (featuredContent.smallTwo.artwork) {

        loadImage(
            smallImage2,
            featuredContent.smallTwo.artwork,
            featuredContent.smallTwo.alt
        );

    }

}


/* ============================================================
   OFFICIAL TOKEN SHOPS
   ------------------------------------------------------------
   Empty until exact official URLs are verified.
   DO NOT put third-party shops here.
   ============================================================ */

const officialShops = {

    one: {

        name: "Official Token Shop",

        url: "",

        region: "",

        logo: ""

    },


    two: {

        name: "Official Token Shop",

        url: "",

        region: "",

        logo: ""

    }

};


function renderOfficialShops() {

    const shopOne =
        document.getElementById(
            "officialShopOne"
        );

    const shopTwo =
        document.getElementById(
            "officialShopTwo"
        );


    if (officialShops.one.url) {

        shopOne.href =
            officialShops.one.url;

        shopOne.querySelector(
            "h3"
        ).textContent =
            officialShops.one.name;

    }


    if (officialShops.two.url) {

        shopTwo.href =
            officialShops.two.url;

        shopTwo.querySelector(
            "h3"
        ).textContent =
            officialShops.two.name;

    }

}


/* ============================================================
   ACCOUNT UI
   ------------------------------------------------------------
   TEMPORARY GUEST STATE.
   Later connected to Auth.
   ============================================================ */

function setAccountState(state) {

    const guestMenu =
        document.getElementById(
            "guestMenu"
        );

    const userMenu =
        document.getElementById(
            "userMenu"
        );

    const adminMenu =
        document.getElementById(
            "adminMenu"
        );


    guestMenu.hidden =
        state !== "guest";

    userMenu.hidden =
        state !== "user";

    adminMenu.hidden =
        state !== "admin";

}


/* Initial state */

setAccountState("guest");


/* ============================================================
   LOGOUT PLACEHOLDER
   ============================================================ */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


logoutButton.addEventListener(
    "click",
    () => {

        /*
         * Later:
         *
         * await auth.signOut();
         *
         * Then redirect to homepage.
         */

        setAccountState("guest");

    }
);


/* ============================================================
   INITIALIZE
   ============================================================ */

function initializeHomepage() {

    createSlides();

    renderOfficialPatch();

    renderFeaturedContent();

    renderOfficialShops();

    startSlider();

}


/* Start */

initializeHomepage();
