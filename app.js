document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Magnetic Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const magneticElements = document.querySelectorAll('.magnetic-btn, .tilt-card');
    const stickingElements = document.querySelectorAll('a, .carousel-arrow, .open-modal, .cursor-stick');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor?.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor?.classList.remove('hovering'));
        
        if (el.classList.contains('magnetic-btn')) {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            el.addEventListener('mouseleave', () => el.style.transform = `translate(0px, 0px)`);
        }
    });

    stickingElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor?.classList.add('sticking'));
        el.addEventListener('mouseleave', () => cursor?.classList.remove('sticking'));
    });


    // --- 2. Canvas Particles (Gold Dust) ---
    const canvas = document.getElementById('particles-canvas');
    if(canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const numParticles = 80;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                speedX: Math.random() * 0.4 - 0.2,
                speedY: Math.random() * -0.5 - 0.1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
                ctx.fill();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }


    // --- 3. Cinematic Carousel Ken Burns ---
    const slides = document.querySelectorAll('.carousel-slide');
    const bars = document.querySelectorAll('.progress-fill');
    const prevBtn = document.querySelector('.carousel-arrow.prev');
    const nextBtn = document.querySelector('.carousel-arrow.next');
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 6000;

    function wrapText(el) {
        if(el.classList.contains('wrapped')) return;
        const text = el.innerText;
        el.innerHTML = '';
        const words = text.split(' ');
        words.forEach(word => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word-span';
            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.innerText = char;
                charSpan.classList.add('char-span');
                wordSpan.appendChild(charSpan);
            });
            el.appendChild(wordSpan);
        });
        el.classList.add('wrapped');
    }

    function animateText(slide) {
        const titles = slide.querySelectorAll('.fade-text');
        titles.forEach(title => {
            wrapText(title);
            const chars = title.querySelectorAll('.char-span');
            chars.forEach((char, idx) => {
                char.classList.remove('visible');
                setTimeout(() => char.classList.add('visible'), idx * 30 + 300);
            });
        });
    }

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        if(bars[currentSlide]) bars[currentSlide].style.width = '0%';
        if(bars[currentSlide]) bars[currentSlide].style.transition = 'none';

        currentSlide = (n + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        animateText(slides[currentSlide]);
        
        // Progress bar logic
        if(bars[currentSlide]) {
            setTimeout(() => {
                bars[currentSlide].style.transition = `width ${slideDuration}ms linear`;
                bars[currentSlide].style.width = '100%';
            }, 50);
        }

        resetInterval();
    }

    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }

    if(slides.length > 0) {
        nextBtn?.addEventListener('click', nextSlide);
        prevBtn?.addEventListener('click', prevSlide);
        
        function resetInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, slideDuration);
        }
        
        // init
        goToSlide(0);
    }


    // --- 4. 3D Tilt Parallax & General ---
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height/2) / (rect.height/2)) * -15; 
            const rotateY = ((x - rect.width/2) / (rect.width/2)) * 15;
            card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)';
        });
        card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

    // Navbar Shrink & Opacity
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // Modals
    const openModalBtns = document.querySelectorAll('.open-modal');
    const closeBtns = document.querySelectorAll('.close-modal');
    const modalOverlays = document.querySelectorAll('.modal-overlay');

    openModalBtns.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = document.getElementById(`modal-${btn.getAttribute('data-modal')}`);
        if(modal) modal.classList.add('active');
    }));

    closeBtns.forEach(btn => btn.addEventListener('click', () => modalOverlays.forEach(m => m.classList.remove('active'))));
    modalOverlays.forEach(m => m.addEventListener('click', (e) => { if(e.target === m) m.classList.remove('active'); }));

});
