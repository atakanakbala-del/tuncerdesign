let translations = {};

async function loadLanguage(lang) {

    try {

        const response = await fetch(`lang/${lang}.json`);
        translations = await response.json();

        document.querySelectorAll("[data-i18n]").forEach(el => {

            const key = el.dataset.i18n;

            if (translations[key]) {
                el.innerHTML = translations[key];
            }

        });

        document.documentElement.lang = lang;
        document.body.dir = lang === "ar" ? "rtl" : "ltr";

        localStorage.setItem("language", lang);

        const names = {
            tr: "Türkçe",
            en: "English",
            fr: "Français",
            ar: "العربية"
        };

        const current = document.getElementById("currentLang");

        if(current){
            current.textContent = names[lang];
        }

        document.getElementById("languageMenu")?.classList.add("hidden");

    } catch(err){

        console.error(err);

    }

}

document.addEventListener("DOMContentLoaded", ()=>{

    const saved = localStorage.getItem("language") || "tr";

    loadLanguage(saved);

    document.querySelectorAll(".lang-btn").forEach(btn=>{

        btn.addEventListener("click", ()=>{

            loadLanguage(btn.dataset.lang);

        });

    });

});