let translations = {};

const languageNames = {
    tr: "Türkçe",
    en: "English",
    fr: "Français",
    ar: "العربية"
};

async function loadLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);

        if (!response.ok) {
            console.error(`Dil dosyası yüklenemedi: ${lang}.json`);
            return;
        }

        translations = await response.json();

        // Yazıları değiştir (innerHTML yerine textContent güvenliği)
        document.querySelectorAll("[data-i18n]").forEach(el => {
            const key = el.dataset.i18n;
            if (translations[key]) {
                // Marquee için özel kontrol (animasyon bozulmasın)
                if (el.classList.contains('marquee-content')) {
                    el.textContent = translations[key];
                } else {
                    el.innerHTML = translations[key];
                }
            }
        });

        // Placeholderları değiştir
        document.querySelectorAll("[data-placeholder]").forEach(el => {
            const key = el.dataset.placeholder;
            if (translations[key]) {
                el.placeholder = translations[key];
            }
        });

        // Select option'ları değiştir
        document.querySelectorAll('select option[data-i18n]').forEach(option => {
            const key = option.dataset.i18n;
            if (translations[key]) {
                option.textContent = translations[key];
            }
        });

        // Sayfa dili ve yönü
        document.documentElement.lang = lang;
        document.body.dir = lang === "ar" ? "rtl" : "ltr";

        // Dil adı güncelle
        const current = document.getElementById("currentLang");
        if (current) {
            current.textContent = languageNames[lang];
        }

        // ============================================
        // MOBİL DİL BUTONLARINI GÜNCELLE (aktif olanı vurgula)
        // ============================================
        document.querySelectorAll('.lang-btn-mobile').forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('bg-[#1e3a5f]', 'text-white');
                btn.classList.remove('border-gray-200');
            } else {
                btn.classList.remove('bg-[#1e3a5f]', 'text-white');
                btn.classList.add('border-gray-200');
            }
        });

        // Kaydet
        localStorage.setItem("language", lang);

    } catch (error) {
        console.error("Dil yüklenirken hata:", error);
    }
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

    // ============================================
    // MOBİL DİL SEÇİCİ DESTEĞİ (buraya ekleyin)
    // ============================================
    document.querySelectorAll('.lang-btn-mobile').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            loadLanguage(lang);
            
            // Menüyü kapat
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
            
            // Eğer menü kapatma fonksiyonunuz farklıysa (örneğin style.display kullanıyorsanız):
            // if (mobileMenu) mobileMenu.style.display = 'none';
        });
    });
});