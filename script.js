// Change navbar background on scroll
window.addEventListener('scroll', () => {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.background = '#0f172a'; // Solid color when scrolling
        nav.style.padding = '1rem 10%';   // Shrink padding for a sleek look
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.03)';
        nav.style.padding = '1.5rem 10%';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});