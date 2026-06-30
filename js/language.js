let translations = {};

async function loadLanguage(lang) {
    const response = await fetch(`lang/${lang}.json`);
    translations = await response.json();

    document.querySelectorAll("[data-lang]").forEach(element => {
        const key = element.getAttribute("data-lang");

        if (translations[key]) {
            element.innerHTML = translations[key];
        }
    });

    document.documentElement.lang = lang;

    if (lang === "ar") {
        document.body.dir = "rtl";
    } else {
        document.body.dir = "ltr";
    }

    localStorage.setItem("language", lang);
}

document.addEventListener("DOMContentLoaded", () => {

    const saved = localStorage.getItem("language") || "tr";

    loadLanguage(saved);

    const selector = document.getElementById("languageSelector");

    if(selector){
        selector.value = saved;

        selector.addEventListener("change", function(){
            loadLanguage(this.value);
        });
    }

});