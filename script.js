// Project Data Mapping
const projectDetails = {
    tickets: {
        title: "Ticket Management System",
        desc: "A C#/.NET 8 multi-tier system built for professional assessments, focusing on back-end architecture and clean code."
    },
    updater: {
        title: "Software Update Manager",
        desc: "A secure version control and distribution engine developed using C# and WPF."
    },
    simulator: {
        title: "Training Simulator",
        desc: "A high-performance training simulator utilizing Unity and C# for realistic academy training environments."
    },
    bridge: {
        title: "Hardware-Software Bridge",
        desc: "Python-based system utilizing OpenCV for high-speed camera processing and coordinate correction."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.navbar');
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-button');
    let carouselInterval; // Variable to hold the timer

    // 1. Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = '#0f172a';
            nav.style.padding = '1rem 10%';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.03)';
            nav.style.padding = '1.5rem 10%';
        }
    });

    // 2. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 3. Modal Logic
    const openModal = async (projectId) => {
        const data = projectDetails[projectId];
        if (!data) return;

        clearInterval(carouselInterval);

        const encodedTitle = encodeURIComponent(data.title);
        const folderPath = `images/${encodedTitle}`;
        
        const maxImagesToCheck = 10; 
        const extensions = ['png', 'jpg', 'jpeg', 'webp'];
        const imageCheckPromises = [];

        // Loading state // #475569;">Loading preview...</span>
        modalBody.innerHTML = `
            <h2>${data.title}</h2>
            <p style="color: #94a3b8; font-size: 0.95rem;">${data.desc}</p>
            <div class="image-carousel" style="display: flex; align-items: center; justify-content: center;">
                <span style="color: #475569;"></span>
            </div>
        `;

        modal.style.display = "block";
        document.body.style.overflow = "hidden";

        const checkImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(src);
                img.onerror = () => resolve(null);
                img.src = src;
            });
        };

        for (let i = 1; i <= maxImagesToCheck; i++) {
            extensions.forEach(ext => {
                imageCheckPromises.push(checkImage(`${folderPath}/${i}.${ext}`));
            });
        }

        const results = await Promise.all(imageCheckPromises);
        const validSrcs = results.filter(src => src !== null);

        if (validSrcs.length > 0) {
            // We render images WITHOUT the 'active' class initially
            const imageTags = validSrcs.map((src) => 
                `<img src="${src}" class="modal-image">`
            ).join('');

            const carousel = modalBody.querySelector('.image-carousel');
            carousel.innerHTML = imageTags;
            carousel.style.justifyContent = "unset";

            // Trigger the "Smooth Entry"
            const images = carousel.querySelectorAll('.modal-image');
            
            // requestAnimationFrame ensures the browser has rendered the hidden images 
            // before we tell it to fade the first one in.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    images[0].classList.add('active'); 
                });
            });

            if (validSrcs.length > 1) {
                let currentIndex = 0;
                carouselInterval = setInterval(() => {
                    images[currentIndex].classList.remove('active');
                    currentIndex = (currentIndex + 1) % images.length;
                    images[currentIndex].classList.add('active');
                }, 4000); // Slightly slower interval for a more premium feel
            }
        } else {
            const carousel = modalBody.querySelector('.image-carousel');
            if (carousel) carousel.style.display = 'none';
        }
    };

    // Clear the interval when closing the modal
    const closeModal = () => {
        clearInterval(carouselInterval);
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    };

    // Card Click Events
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project');
            openModal(projectId);
        });
    });

    // Close Events
    closeBtn.onclick = closeModal;
    window.onclick = (event) => {
        if (event.target === modal) closeModal();
    };
});

document.querySelectorAll('.tilt-card').forEach(card => {
    // Smooth entry configuration
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), background 0.3s ease";

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to the element (from 0 to width/height)
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;  

        // Convert coordinates to a scale of -0.5 to 0.5
        const xPercent = (x / rect.width) - 0.5;
        const yPercent = (y / rect.height) - 0.5;

        // Configure intensity (Degrees of maximum rotation)
        const maxRotation = 12; 

        // Calculate rotation angles (Notice: Y mouse position dictates X-axis rotation)
        const rotateX = (-yPercent * maxRotation).toFixed(2);
        const rotateY = (xPercent * maxRotation).toFixed(2);

        // Apply 3D transform and subtle scale-up on hover
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Update custom properties for the tracking light reflection
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });

    // Reset card state smoothly when the mouse leaves
    card.addEventListener('mouseleave', () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
        card.style.setProperty('--mouse-x', `-999px`);
        card.style.setProperty('--mouse-y', `-999px`);
    });
});