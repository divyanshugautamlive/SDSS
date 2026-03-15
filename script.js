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
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }
  
  // === BROCHURE REQUEST ===
  const brochureBtns = document.querySelectorAll('.btn-brochure');
  brochureBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert("Brochure request sent! We'll WhatsApp it to you shortly.");
      const waUrl = "https://wa.me/919599961692?text=Hi%20SDSS%2C%20I%27d%20like%20to%20receive%20your%20company%20brochure.";
      window.open(waUrl, '_blank');
    });
  });

  // === CLIENT LOGOS MARQUEE CLONE ===
  const marquee = document.querySelector('.marquee-container');
  if (marquee) {
    const logos = Array.from(marquee.children);
    logos.forEach(logo => {
      const clone = logo.cloneNode(true);
      marquee.appendChild(clone);
    });
  }

  // === TESTIMONIALS SLIDER ===
  const track = document.querySelector('.slider-track');
  if (track) {
    const cards = Array.from(track.children);
    const nextBtn = document.querySelector('.slider-next');
    const prevBtn = document.querySelector('.slider-prev');
    let currentIndex = 0;
    
    // Auto slide
    let slideTimer = setInterval(nextSlide, 4000);
    
    function getCardsPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function updateSlider() {
      const cardWidth = track.clientWidth / getCardsPerView();
      const maxIndex = Math.max(0, cards.length - getCardsPerView());
      if (currentIndex > maxIndex) currentIndex = 0;
      if (currentIndex < 0) currentIndex = maxIndex;
      
      const gap = 30;
      track.style.transform = `translateX(-${currentIndex * (100 / getCardsPerView())}%)`;
    }

    function nextSlide() {
      const maxIndex = Math.max(0, cards.length - getCardsPerView());
      if (currentIndex >= maxIndex) currentIndex = 0;
      else currentIndex++;
      updateSlider();
    }
    
    function prevSlide() {
      const maxIndex = Math.max(0, cards.length - getCardsPerView());
      if (currentIndex <= 0) currentIndex = maxIndex;
      else currentIndex--;
      updateSlider();
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

    function resetTimer() {
      clearInterval(slideTimer);
      slideTimer = setInterval(nextSlide, 4000);
    }
    
    window.addEventListener('resize', updateSlider);
    
    // Touch support
    let startX = 0;
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      clearInterval(slideTimer);
    });
    track.addEventListener('touchend', e => {
      let endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) nextSlide();
      else if (endX - startX > 50) prevSlide();
      resetTimer();
    });
  }
});
