// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 500);
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);
if (typeof Flip !== 'undefined') gsap.registerPlugin(Flip);

// Projects Bento Gallery (pinned scroll: mosaic -> full-bleed filmstrip)
const projectsGallery = document.getElementById('projectsGallery');
if (projectsGallery && typeof Flip !== 'undefined') {
    const isCoarsePointerOrNarrow = window.matchMedia('(max-width: 900px), (pointer: coarse) and (max-width: 1024px)').matches;

    if (!isCoarsePointerOrNarrow) {
        let galleryFlipCtx;

        const createGalleryTween = () => {
            const galleryWrap = projectsGallery.closest('.gallery-wrap');
            const galleryItems = projectsGallery.querySelectorAll('.gallery__item');
            if (!galleryWrap || !galleryItems.length) return;

            if (galleryFlipCtx) galleryFlipCtx.revert();
            projectsGallery.classList.remove('gallery--final');

            galleryFlipCtx = gsap.context(() => {
                projectsGallery.classList.add('gallery--final');
                const flipState = Flip.getState(galleryItems);
                projectsGallery.classList.remove('gallery--final');

                const flip = Flip.to(flipState, {
                    simple: true,
                    ease: 'expoScale(1, 5)'
                });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: projectsGallery,
                        start: 'center center',
                        end: '+=100%',
                        scrub: true,
                        pin: galleryWrap
                    }
                });
                tl.add(flip);

                return () => gsap.set(galleryItems, { clearProps: 'all' });
            });
        };

        createGalleryTween();

        let galleryResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(galleryResizeTimeout);
            galleryResizeTimeout = setTimeout(createGalleryTween, 250);
        });
    }
}

// Hero Rotating Word
const heroRotatingWord = document.getElementById('heroRotatingWord');
if (heroRotatingWord) {
    let heroWords = [];
    try {
        heroWords = JSON.parse(heroRotatingWord.dataset.words || '[]');
    } catch (e) {
        heroWords = [];
    }

    if (heroWords.length > 1) {
        let heroWordIndex = 0;
        setInterval(() => {
            heroWordIndex = (heroWordIndex + 1) % heroWords.length;
            gsap.to(heroRotatingWord, {
                y: -12,
                opacity: 0,
                duration: 0.35,
                ease: 'power2.in',
                onComplete: () => {
                    heroRotatingWord.textContent = heroWords[heroWordIndex];
                    gsap.fromTo(heroRotatingWord,
                        { y: 12, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
                    );
                }
            });
        }, 2600);
    }
}

// Reveal animations
gsap.utils.toArray('.reveal').forEach(element => {
    gsap.fromTo(element,
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        }
    );
});

// Counter Animation
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    if (isNaN(target)) return;

    gsap.to(counter, {
        innerHTML: target,
        duration: 2,
        snap: { innerHTML: 1 },
        scrollTrigger: {
            trigger: counter,
            start: 'top 80%',
        },
        onUpdate: function () {
            const value = Math.ceil(this.targets()[0].innerHTML);
            counter.textContent = target === 100 ? value + '%' : value + '+';
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    if (window.pageYOffset > 100) {
        navbar.classList.add('shadow-lg');
        navbar.querySelector('.glass')?.classList.add('bg-white/95');
    } else {
        navbar.classList.remove('shadow-lg');
        navbar.querySelector('.glass')?.classList.remove('bg-white/95');
    }
});

// Mobile Menu
const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (menuBtn && closeMenu && mobileMenu) {
    menuBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
    closeMenu.addEventListener('click', () => mobileMenu.classList.remove('active'));

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.remove('active'));
    });
}

// Language Dropdown
const languageButton = document.getElementById('languageButton');
const languageMenu = document.getElementById('languageMenu');

if (languageButton && languageMenu) {
    languageButton.addEventListener('click', (e) => {
        e.stopPropagation();
        languageMenu.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
        languageMenu.classList.add('hidden');
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact Form - Formspree Entegrasyonu
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const action = this.getAttribute('action');
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Butonu yükleme durumuna getir
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';

        fetch(action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Gönderim başarısız');
            }
        })
        .then(data => {
            // Başarılı
            const toast = document.getElementById('toast');
            if (toast) {
                toast.querySelector('.font-bold').textContent = 'Başarılı!';
                toast.querySelector('.text-sm').textContent = 'Mesajınız alındı, en kısa sürede dönüş yapacağız.';
                toast.classList.add('show');
            }

            this.reset();

            setTimeout(() => {
                if (toast) toast.classList.remove('show');
            }, 4000);
        })
        .catch(error => {
            console.error('Hata:', error);
            alert('Mesaj gönderilemedi. Lütfen tekrar deneyin veya doğrudan arayın: 0536 985 29 26');
        })
        .finally(() => {
            // Butonu eski haline getir
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        });
    });
}

// Parallax (sadece desktop)
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.hero-shape');

        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
            const yOffset = (window.innerHeight / 2 - e.clientY) / speed;
            shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
}


// Dinamik yıl güncelleme
document.querySelectorAll('[data-i18n="footer.copyright"]').forEach(el => {
    const currentYear = new Date().getFullYear();
    el.innerHTML = el.innerHTML.replace(/\d{4}/, currentYear);
});