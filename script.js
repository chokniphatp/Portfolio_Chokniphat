// --- 1. การจัดการ Navbar และฟังก์ชันทั่วไป ---

// เปลี่ยนลักษณะแถบเมนูด้านบน (Navbar) เวลาเลื่อนหน้าจอ
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
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