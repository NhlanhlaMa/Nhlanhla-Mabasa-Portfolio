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

        // 1. URL-encode the title to handle spaces properly for GitHub Pages
        const encodedTitle = encodeURIComponent(data.title);
        const folderPath = `images/${encodedTitle}`;
        
        const maxImagesToCheck = 10; 
        const extensions = ['png', 'jpg', 'jpeg', 'webp'];
        const imageCheckPromises = [];

        // 2. Clear previous content and show a subtle loading state
        modalBody.innerHTML = `
            <h2>${data.title}</h2>
            <p style="color: #94a3b8; font-size: 0.95rem;">${data.desc}</p>
            <div class="image-carousel" style="display: flex; align-items: center; justify-content: center;">
                <span style="color: #475569;">Loading preview...</span>
            </div>
        `;

        modal.style.display = "block";
        document.body.style.overflow = "hidden";

        // 3. Helper function to check if an image actually exists
        const checkImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(src); // It exists!
                img.onerror = () => resolve(null); // Doesn't exist
                img.src = src;
            });
        };

        // 4. Create a list of all potential paths and check them all in parallel
        for (let i = 1; i <= maxImagesToCheck; i++) {
            extensions.forEach(ext => {
                imageCheckPromises.push(checkImage(`${folderPath}/${i}.${ext}`));
            });
        }

        // 5. Wait for all checks to complete
        const results = await Promise.all(imageCheckPromises);
        const validSrcs = results.filter(src => src !== null);

        // 6. Now render only the images we KNOW exist
        if (validSrcs.length > 0) {
            const imageTags = validSrcs.map((src, index) => 
                `<img src="${src}" class="modal-image ${index === 0 ? 'active' : ''}">`
            ).join('');

            const carousel = modalBody.querySelector('.image-carousel');
            carousel.innerHTML = imageTags;
            carousel.style.justifyContent = "unset"; // Reset centering

            if (validSrcs.length > 1) {
                let currentIndex = 0;
                const images = carousel.querySelectorAll('.modal-image');
                carouselInterval = setInterval(() => {
                    images[currentIndex].classList.remove('active');
                    currentIndex = (currentIndex + 1) % images.length;
                    images[currentIndex].classList.add('active');
                }, 4000); // 4 seconds is a bit more stable for live sites
            }
        } else {
            // No images found? Hide the carousel box entirely
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