// --- 1. การจัดการ Navbar และฟังก์ชันทั่วไป ---

// เปลี่ยนลักษณะแถบเมนูด้านบน (Navbar) เวลาเลื่อนหน้าจอ
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    // ถ้าเลื่อนหน้าจอลงมามากกว่า 50px ให้เพิ่มคลาสตกแต่ง (shadow, blur)
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// ฟังก์ชันแจ้งเตือนเมื่อคลิกปุ่ม "ส่งอีเมลหาผม"
function showEmailAlert() {
    alert("ระบบกำลังเปิดแอปพลิเคชันอีเมลของคุณ เพื่อติดต่อ Chokniphat.p@gmail.com");
    window.location.href = "mailto:chokniphat.p@gmail.com";
}

// ข้อความต้อนรับใน Console
console.log("Welcome to Chokniphat's Portfolio! Handcrafted with HTML, CSS, and JS.");


// --- 2. การจัดการ Slider (เลื่อนหน้าเว็บ) ---

// ฟังก์ชันเลื่อน Slider ทีละ 1 รูป
function scrollSlider(sliderId, direction) {
    const slider = document.getElementById(sliderId);
    // หาความกว้างของรูปภาพรูปแรก รวมระยะห่าง (gap 24px)
    const items = slider.getElementsByClassName('gallery-item-container');
    
    if (items.length > 0) {
        // คำนวณความกว้างที่ต้องเลื่อน: ความกว้างรูป + ระยะห่าง (gap ใน Tailwind gap-6 คือ 24px)
        const itemWidth = items[0].offsetWidth + 24; 
        
        slider.scrollBy({
            left: direction * itemWidth,
            behavior: 'smooth'
        });
    }
}


// --- 3. ส่วนของ Lightbox ( Pop up ขยายรูปภาพ) ---

let currentImages = []; // เก็บรายการที่อยู่รูปภาพ (src) ทั้งหมดในแกลเลอรี่ที่กำลังเปิด
let currentIndex = 0;   // เก็บตำแหน่งรูปปัจจุบันที่กำลังแสดง

// ฟังก์ชันเปิด Pop up
function openLightbox(sliderId, index) {
    const slider = document.getElementById(sliderId);
    // ดึงทุกแท็ก <img> ใน Slider นั้นๆ มาเก็บใน Array
    const imagesInSlider = slider.getElementsByTagName('img');
    
    // เก็บที่อยู่รูปภาพ (src) ทั้งหมดลงใน Array currentImages
    currentImages = Array.from(imagesInSlider).map(img => img.src);
    currentIndex = index; // ตั้งค่ารูปเริ่มต้นที่จะแสดง

    updateModalImage(); // อัปเดตสมบัติของรูปใน Modal
    
    // แสดง Modal และปิดการเลื่อนหน้าเว็บพื้นหลัง
    const modal = document.getElementById('imageModal');
    modal.classList.add('active');
    modal.classList.remove('hidden'); // ตรวจสอบให้แน่ใจว่าไม่ได้โดนซ่อนด้วย class hidden
    document.body.style.overflow = 'hidden'; 
}

// ฟังก์ชันปิด Pop up
function closeLightbox() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('active');
    modal.classList.add('hidden'); // ซ่อน Modal
    document.body.style.overflow = 'auto'; // คืนค่าการเลื่อนหน้าเว็บ
}

// ฟังก์ชันเปลี่ยนรูปใน Pop up (ถัดไป/ย้อนกลับ)
function changeLightboxImage(direction) {
    if (currentImages.length === 0) return; // กันข้อผิดพลาดถ้าไม่มีรูป

    currentIndex += direction;
    
    // วนลูปรูปภาพ: ถ้าถัดไปจนถึงรูปสุดท้าย ให้กลับไปรูปแรกสุด
    if (currentIndex >= currentImages.length) {
        currentIndex = 0;
    }
    // ถ้าย้อนกลับจนถึงรูปแรกสุด ให้ไปรูปสุดท้าย
    if (currentIndex < 0) {
        currentIndex = currentImages.length - 1;
    }
    
    updateModalImage();
}

// อัปเดตที่อยู่รูปภาพ (src) ในหน้าต่าง Modal ตาม currentIndex
function updateModalImage() {
    const modalImg = document.getElementById('modalImg');
    if (currentImages[currentIndex]) {
        modalImg.src = currentImages[currentIndex];
    }
}

// เพิ่มการรองรับการกดปุ่มบนคีย์บอร์ด (Esc เพื่อปิด, ลูกศรเพื่อเปลี่ยนรูป)
document.addEventListener('keydown', (e) => {
    // เช็กว่า Modal กำลังเปิดอยู่หรือไม่
    const activeModal = document.getElementById('imageModal');
    if (!activeModal || !activeModal.classList.contains('active')) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") changeLightboxImage(1);
    if (e.key === "ArrowLeft") changeLightboxImage(-1);
});

// ฟังก์ชัน เปิด/ปิด Pop-up ข้อมูลการเข้าสู่ระบบ
function toggleLoginPopup() {
    const popup = document.getElementById('loginPopup');
    
    // สลับคลาส hidden
    if (popup.classList.contains('hidden')) {
        popup.classList.remove('hidden');
    } else {
        popup.classList.add('hidden');
    }
}

// ปิด Pop-up เมื่อคลิกข้างนอกหน้าต่างข้อมูล
document.addEventListener('click', function(event) {
    const popup = document.getElementById('loginPopup');
    if (!popup) return;
    const btn = event.target.closest('button');
    
    // ถ้าคลิกข้างนอก และ Pop-up แสดงอยู่ ให้ซ่อนมัน
    if (!popup.contains(event.target) && (!btn || btn.getAttribute('onclick') !== 'toggleLoginPopup()')) {
        popup.classList.add('hidden');
    }
});


// Portfolio refresh interactions
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal-on-scroll').forEach((element) => {
    revealObserver.observe(element);
});

const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const setActiveNav = () => {
    let current = '';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navAnchors.forEach((anchor) => {
        anchor.classList.toggle('active', anchor.getAttribute('href') === `#${current}`);
    });
};

window.addEventListener('scroll', setActiveNav);
setActiveNav();
// --- Portfolio language switcher ---
(() => {
    const STORAGE_KEY = 'portfolioLanguage';
    const urlLanguage = new URLSearchParams(window.location.search).get('lang');
    if (urlLanguage === 'en' || urlLanguage === 'th') {
        localStorage.setItem(STORAGE_KEY, urlLanguage);
    }
    const defaultLanguage = (urlLanguage === 'en' || urlLanguage === 'th') ? urlLanguage : (localStorage.getItem(STORAGE_KEY) || 'th');

    const pageName = (() => {
        const file = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
        if (file.includes('experience-detail')) return 'experience';
        if (file.includes('vpn-detail')) return 'vpn';
        if (file.includes('rentflow-detail')) return 'rentflow';
        return 'index';
    })();

    const shared = {
        'footer p': {
            en: '&copy; 2026 Chokniphat Pitakkorpol. All rights reserved.',
            th: '&copy; 2026 Chokniphat Pitakkorpol. All rights reserved.'
        }
    };

    const translations = {
        index: {
            '.nav-links a[href="#about"]': { th: 'เกี่ยวกับผม', en: 'About Me' },
            '.nav-links a[href="#projects"]': { th: 'ผลงาน', en: 'Projects' },
            '.nav-links a[href="#experience"]': { th: 'ประสบการณ์', en: 'Experience' },
            '.nav-links a[href="#contact"]': { th: 'ติดต่อ', en: 'Contact' },
            '.hero-kicker': { en: 'Fresh Graduate Portfolio' },
            '.hero-title': { en: 'Hello,<br>I am <span class="scg-blue-text">Chokniphat Pitakkorpol</span>' },
            '.hero-copy': { en: 'A fresh graduate from the Faculty of Engineering, Electronics and Telecommunication Engineering, King Mongkut\'s University of Technology Thonburi (KMUTT).<br>Graduated in June 2026.' },
            '.primary-btn': { en: 'View Projects' },
            '.secondary-btn': { en: 'Contact' },
            '.hero-focus span:nth-child(1)': { en: '<i class="fa-solid fa-graduation-cap"></i> KMUTT Graduate 2026' },
            '.hero-focus span:nth-child(2)': { en: '<i class="fa-solid fa-diagram-project"></i> Senior Project' },
            '.hero-focus span:nth-child(3)': { en: '<i class="fa-solid fa-briefcase"></i> Internship Experience' },
            '.hero-snapshot div:nth-child(1) span': { en: 'Senior project with authentication and secure access workflow' },
            '.hero-snapshot div:nth-child(2) span': { en: 'DAS, Fiber Optic, Data Center, and field reporting experience' },
            '.hero-snapshot div:nth-child(3) span': { en: 'Prototype for billing, contracts, and workflow automation' },
            '#projects .section-heading p': { en: 'Selected Work' },
            '#projects .project-card:nth-child(1) p.text-gray-600': { en: 'Developed an automated billing and rental contract management prototype to reduce manual workflow steps.' },
            '#projects .project-card:nth-child(1) a': { en: 'View Project Details <i class="fa-solid fa-arrow-right ml-1"></i>' },
            '#projects .project-card:nth-child(2) p.text-gray-600': { en: 'Designed and deployed a secure virtual private network (VPN) system for controlled remote access.' },
            '#projects .project-card:nth-child(2) li:nth-child(2)': { en: '<strong>Security:</strong> Login + OTP before receiving VPN configuration' },
            '#projects .project-card:nth-child(2) li:nth-child(3)': { en: '<strong>Impact:</strong> Supports multiple devices, reduces software licensing cost, and enables external access securely' },
            '#projects .project-card:nth-child(2) a': { en: 'View Project Details <i class="fa-solid fa-arrow-right ml-1"></i>' },
            '#experience .section-heading p': { en: 'Internship Journey' },
            '#experience .section-heading h2': { en: 'Experience' },
            '#experience .experience-card h3': { en: 'Network Engineer (Intern)' },
            '#experience .experience-card p.text-sm': { en: '<i class="fa-solid fa-calendar-days mr-2 text-blue-600"></i>June - November 2025 (6 months)' },
            '#experience .experience-card p.leading-relaxed': { en: 'Interned on the OBK Mobile project, covering DAS quality inspection, Fiber Optic work, Data Center support, Walk Test, Excel reporting, and coordination with Huawei/AIS teams on the One Bangkok site.' },
            '#experience .experience-card a': { en: 'View Experience Details <i class="fa-solid fa-arrow-right ml-1"></i>' },
            '#contact h2': { th: 'ติดต่อ', en: 'Contact' },
            '.contact-button': { en: 'Send Email' }
        },
        experience: {
            'nav > div > a:first-child': { en: '<i class="fa-solid fa-chevron-left mr-2"></i> Back to Experience' },
            '.intern-hero p.uppercase:first-child': { en: 'Internship Experience' },
            '.intern-hero h1': { en: 'Network Engineer Intern' },
            '.intern-hero .text-lg.text-gray-700': { en: 'Internship experience at TCC Technology on the One Bangkok (OBK Mobile) project, covering field work, DAS quality inspection, Fiber Optic infrastructure, and progress reporting to support engineers on a real project site.' },
            '.intern-panel strong.block': { en: 'OBK Mobile Project' },
            '.intern-panel span.text-sm.text-gray-500': { en: 'Network / DAS / Fiber / Data Center' },
            'aside.intern-panel .space-y-4 p:nth-child(4)': { en: '<i class="fa-solid fa-calendar-days scg-blue-text mr-2"></i> June - November 2025' },
            'aside.intern-panel .space-y-4 p:nth-child(5)': { en: '<i class="fa-solid fa-clock scg-blue-text mr-2"></i> Duration: 6 months' },
            'section.max-w-6xl .text-center p.uppercase': { en: 'Work Scope Summary' },
            'section.max-w-6xl .text-center h2': { en: 'Main Responsibilities During Internship' },
            '.work-card:nth-child(1) .space-y-4 p:nth-child(1)': { en: '<strong>QC Coverage:</strong> Responsible for quality inspection of DAS (Distributed Antenna System) installation across the One Bangkok project, including residential zones (R1-R3), office buildings (O1-O3), the Forum shopping area, and the underground Carpark. The Carpark area specifically included more than 238 antennas across 12 sectors.' },
            '.work-card:nth-child(1) .space-y-4 p:nth-child(2)': { en: '<strong>Technical Compliance:</strong> Checked Feeder cables, Jumper cables, Connectors, and Splitter Boxes against As-built drawings and Huawei/AIS engineering standards.' },
            '.work-card:nth-child(1) .space-y-4 p:nth-child(3)': { en: '<strong>Signal Analysis:</strong> Assisted with Walk Test and analyzed RF parameters such as VSWR, Return Loss, and Cable Loss across 900MHz, 1800MHz, 2100MHz, and 2600MHz using handheld software, together with nPerf stability testing.' },
            '.work-card:nth-child(2) .space-y-4 p:nth-child(1)': { en: '<strong>Infrastructure Maintenance:</strong> Worked in Data Center and Main Comm Room areas to support fiber splicing and patching based on assigned core diagrams, including 7-Eleven related systems.' },
            '.work-card:nth-child(2) .space-y-4 p:nth-child(2)': { en: '<strong>Advanced Troubleshooting:</strong> Analyzed and resolved signal drop issues using OTDR (Optical Time Domain Reflectometer) and Laser Test tools to identify fiber breaks or incorrect connection points.' },
            '.work-card:nth-child(2) .space-y-4 p:nth-child(3)': { en: '<strong>Network Deployment:</strong> Supported Access Point (WiFi) installation and verification, including readiness checks for installation points and internal connectivity.' },
            '.intern-panel.border-l-4 h2': { en: '<i class="fa-solid fa-square-poll-vertical mr-2"></i>Key Accomplishments' },
            '.intern-panel.border-l-4 p': { en: 'Managed progress reports and installation photo databases through an Excel dashboard, helping engineers track site defects more quickly and accurately, reduce data inconsistencies, and support PAT (Provisional Acceptance Test) document handover within the project timeline.' },
            '.space-y-6 .intern-panel:nth-child(2) h2': { en: 'Key Skills Gained' },
            '.space-y-6 .intern-panel:nth-child(2) li:nth-child(1) span': { en: 'Inspected DAS/Fiber installation work on-site against As-built documents and required standards.' },
            '.space-y-6 .intern-panel:nth-child(2) li:nth-child(2) span': { en: 'Analyzed signal issues using Walk Test, handheld software, OTDR, Laser Test, and nPerf.' },
            '.space-y-6 .intern-panel:nth-child(2) li:nth-child(3) span': { en: 'Prepared progress reports, defect tracking, and supporting documents for PAT handover.' },
            'aside.space-y-6 .intern-panel:nth-child(2) h2': { en: 'What I Learned' },
            'aside.space-y-6 .intern-panel:nth-child(2) p': { en: 'I learned careful on-site inspection, communication with cross-functional teams, systematic defect data management, and how electronics, telecommunication, and network infrastructure knowledge connects with real field operations.' }
        },
        vpn: {
            'nav > div > a:first-child': { en: '<i class="fa-solid fa-chevron-left mr-2"></i> Back to Projects' },
            '.vpn-hero p.uppercase': { en: 'Senior Project' },
            '.vpn-hero h1': { en: 'Secure, Mobile-ready VPN Platform' },
            '.vpn-hero .text-lg.text-gray-700': { en: 'Designed an integration process for a secure VPN system that supports multiple devices and reduces software licensing limitations by combining open-source components with cloud deployment.' },
            '.vpn-stat:nth-child(1) span': { en: 'Software licensing' },
            '.vpn-stat:nth-child(2) span': { en: 'Device types tested' },
            '.vpn-stat:nth-child(3) span': { en: 'Usability score' },
            '.vpn-stat:nth-child(4) span': { en: 'Prototype cost' },
            'main > section:nth-of-type(2) > div:nth-of-type(1) article:nth-child(1) p': { en: 'The organization had limitations from existing VPN licensing, especially for mobile and tablet usage that required extra cost, making remote work less flexible.' },
            'main > section:nth-of-type(2) > div:nth-of-type(1) article:nth-child(2) p': { en: 'Integrated Flask, Keycloak, WireGuard, and PostgreSQL into one platform, allowing users to log in with MFA and download VPN configuration or scan a QR code.' },
            'main > section:nth-of-type(2) > div:nth-of-type(1) article:nth-child(3) p': { en: 'Migrated to AWS EC2 to solve CG-NAT limitations, successfully tested remote access from external networks, supported multiple devices, and added ELK for centralized logging.' },
            'main > section:nth-of-type(2) > div:nth-of-type(2) p.uppercase': { en: 'Design Process' },
            'main > section:nth-of-type(2) > div:nth-of-type(2) h2': { en: 'What the System Can Do' },
            '.vpn-step:nth-child(1) p': { en: 'Users must pass username/password authentication and OTP from Keycloak before accessing VPN configuration files.' },
            '.vpn-step:nth-child(2) p': { en: 'The system creates a WireGuard peer, assigns an IP address, generates a .conf file, and displays a QR code for mobile onboarding.' },
            '.vpn-step:nth-child(3) p': { en: 'Moved from a local VM to AWS EC2 so the system has a public IP and can accept connections from external networks.' },
            '.vpn-step:nth-child(4) p': { en: 'Added Logstash, Elasticsearch, and Kibana to collect logs from Keycloak, Flask, and WireGuard into one dashboard.' },
            'section.mb-16 > p': { en: 'Project Screenshots' },
            'section.mb-16 > h2': { en: 'Project Screenshots' },
            '.vpn-ping-combo figcaption span:nth-child(2)': { en: 'Scroll to view' },
            'main > section:nth-of-type(2) > section:nth-of-type(2) .vpn-panel h2': { en: 'Evaluation Summary' },
            'main > section:nth-of-type(2) > section:nth-of-type(2) .vpn-panel .grid div:nth-child(1) span': { en: 'Login + OTP before receiving VPN config' },
            'main > section:nth-of-type(2) > section:nth-of-type(2) .vpn-panel .grid div:nth-child(2) span': { en: 'Tested on laptop, mobile, and tablet' },
            'main > section:nth-of-type(2) > section:nth-of-type(2) .vpn-panel .grid div:nth-child(3) span': { en: 'Successfully connected from an external network' },
            'main > section:nth-of-type(2) > section:nth-of-type(2) .vpn-panel .grid div:nth-child(4) span': { en: 'Higher than the 80% target benchmark' },
            'aside.vpn-panel h3:nth-of-type(2)': { en: 'My Contribution' },
            'aside.vpn-panel p': { en: 'Contributed to both Network Engineering and Cyber Security parts by designing the VPN connection workflow, MFA authentication, user permission handling, and a simulated internal service to demonstrate secure access after connecting through VPN under organizational security policy constraints.' }
        },
        rentflow: {
            'nav > div > a:first-child': { en: '<i class="fa-solid fa-chevron-left mr-2"></i> Back to Home' },
            'header p': { en: 'A full-cycle dormitory and condominium management prototype developed with Google Apps Script.' },
            'section.mb-16 h2': { en: 'Project Gallery' },
            '.slider-section:nth-child(1) h3': { en: '<i class="fa-solid fa-user-tie scg-blue-text mr-3"></i> 1. Owner View' },
            '.slider-section:nth-child(1) p': { en: 'Main dashboard for property management, room management, and automatic invoice generation.' },
            '.slider-section:nth-child(3) h3': { en: '<i class="fa-solid fa-user-circle scg-blue-text mr-3"></i> 2. Tenant View' },
            '.slider-section:nth-child(3) p': { en: 'User-side screens for login, invoice payment, payment history, and issue reporting in the tenant workflow.' },
            'main > div.grid > div:nth-child(1) section:nth-child(1) h2': { en: 'Background and Problem' },
            'main > div.grid > div:nth-child(1) section:nth-child(1) p': { en: 'The original dormitory management process relied on manual records, which caused errors in utility calculations and delays in invoice delivery. I designed this prototype to reduce repetitive work and improve data accuracy.' },
            'main > div.grid > div:nth-child(1) section:nth-child(2) h2': { en: 'Solution' },
            'main > div.grid > div:nth-child(1) section:nth-child(2) li:nth-child(1) span': { en: '<strong>Automation:</strong> Automatically generates invoices from Google Sheets data.' },
            'main > div.grid > div:nth-child(1) section:nth-child(2) li:nth-child(2) span': { en: '<strong>Centralized Data:</strong> Centralizes rental contract data and payment status in one place.' },
            '.bg-white.p-6 h3:nth-of-type(2)': { en: 'Try the Prototype' },
            '.bg-white.p-6 button': { en: '<i class="fa-solid fa-key mr-2"></i> Test Login Information' },
            '.bg-white.p-6 a[target="_blank"]': { en: '<i class="fa-solid fa-external-link mr-2"></i> Open Rentflow System' }
        }
    };

    const pageTranslations = { ...shared, ...(translations[pageName] || {}) };

    const setElementContent = (element, value) => {
        if (value === undefined) return;
        element.innerHTML = value;
    };

    const applyLanguage = (language) => {
        document.documentElement.lang = language;
        Object.entries(pageTranslations).forEach(([selector, copy]) => {
            document.querySelectorAll(selector).forEach((element) => {
                if (!element.dataset.i18nOriginal) {
                    element.dataset.i18nOriginal = element.innerHTML;
                }
                const value = language === 'en' ? copy.en : (copy.th || element.dataset.i18nOriginal);
                setElementContent(element, value);
            });
        });

        document.querySelectorAll('[data-language-toggle]').forEach((button) => {
            button.setAttribute('aria-label', language === 'en' ? 'Switch to Thai' : 'Switch to English');
            button.innerHTML = `<i class="fa-solid fa-globe"></i><span>${language.toUpperCase()}</span>`;
        });
    };

    const createLanguageButton = (extraClass = '') => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `language-toggle ${extraClass}`.trim();
        button.dataset.languageToggle = 'true';
        button.addEventListener('click', () => {
            const current = localStorage.getItem(STORAGE_KEY) || 'th';
            const next = current === 'en' ? 'th' : 'en';
            localStorage.setItem(STORAGE_KEY, next);
            applyLanguage(next);
        });
        return button;
    };

    const addLanguageToggle = () => {
        if (document.querySelector('[data-language-toggle]')) return;

        const mainNavLinks = document.querySelector('#navbar .nav-links');
        if (mainNavLinks) {
            mainNavLinks.appendChild(createLanguageButton('desktop-language-toggle'));
            const navInner = document.querySelector('#navbar .max-w-6xl');
            if (navInner) navInner.appendChild(createLanguageButton('mobile-language-toggle'));
            return;
        }

        const detailNav = document.querySelector('nav .max-w-6xl, nav .max-w-4xl');
        if (detailNav) {
            const holder = document.createElement('div');
            holder.className = 'flex items-center gap-3';
            const brand = detailNav.querySelector('.brand-mark');
            if (brand) holder.appendChild(brand);
            holder.appendChild(createLanguageButton());
            detailNav.appendChild(holder);
            detailNav.classList.add('gap-4');
        }
    };

    window.getPortfolioLanguage = () => localStorage.getItem(STORAGE_KEY) || 'th';

    addLanguageToggle();
    applyLanguage(defaultLanguage);
})();
