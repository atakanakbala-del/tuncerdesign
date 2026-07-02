let translations = {};

const languageNames = {
    tr: "Türkçe",
    en: "English",
    fr: "Français",
    ar: "العربية"
};

async function loadLanguage(lang) {

    const response = await fetch(`lang/${lang}.json`);
    translations = await response.json();

    // Yazıları değiştir
    document.querySelectorAll("[data-i18n]").forEach(el => {

        const key = el.dataset.i18n;

        if (translations[key]) {
            el.innerHTML = translations[key];
        }

    });

    // Placeholderları değiştir
    document.querySelectorAll("[data-placeholder]").forEach(el => {

        const key = el.dataset.placeholder;

        if (translations[key]) {
            el.placeholder = translations[key];
        }

    });

    // Sayfa dili
    document.documentElement.lang = lang;
    document.body.dir = lang === "ar" ? "rtl" : "ltr";

    // Dil adı
    const current = document.getElementById("currentLang");

    if (current) {
        current.textContent = languageNames[lang];
    }

    // Kaydet
    localStorage.setItem("language", lang);
}

document.addEventListener("DOMContentLoaded", () => {

    const saved = localStorage.getItem("language") || "tr";

    loadLanguage(saved);

    const languageButton = document.getElementById("languageButton");
    const languageMenu = document.getElementById("languageMenu");

    if (languageButton && languageMenu) {

        languageButton.addEventListener("click", (e) => {

            e.stopPropagation();
            languageMenu.classList.toggle("hidden");

        });

        document.addEventListener("click", () => {

            languageMenu.classList.add("hidden");

        });

        document.querySelectorAll(".lang-btn").forEach(btn => {

            btn.addEventListener("click", () => {

                loadLanguage(btn.dataset.lang);

                languageMenu.classList.add("hidden");

            });

        });

    }

});