// === NAVBAR SCROLL ===
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// === HAMBURGER MENU ===
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// === ANIMATED COUNTERS ===
function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(counter => {
        if (counter.dataset.animated) return;
        const rect = counter.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            counter.dataset.animated = 'true';
            const target = parseInt(counter.dataset.target);
            const suffix = counter.dataset.suffix || '';
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + suffix;
            }, 16);
        }
    });
}
window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

// === CONTACT FORM ===
document.querySelector('.contact-form')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = this.querySelector('[name="name"]').value;
    const phone = this.querySelector('[name="phone"]').value;
    if (!name || !phone) {
        alert('Please fill in your Name and Phone Number.');
        return;
    }
    const service = this.querySelector('[name="service"]').value;
    const message = this.querySelector('[name="message"]').value;
    const waMsg = `Hello, I'm ${name}. I need ${service}. ${message}. My phone: ${phone}`;
    window.open(`https://wa.me/919599961692?text=${encodeURIComponent(waMsg)}`, '_blank');
    alert('Thank you! Your inquiry has been sent via WhatsApp.');
    this.reset();
});

// === INIT AOS ===
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 800, once: true, offset: 100 });
});
