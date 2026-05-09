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
    const openModal = (projectId) => {
        const data = projectDetails[projectId];
        if (!data) return;

        clearInterval(carouselInterval);

        // 1. Generate the folder path based on the title
        const folderPath = `images/${data.title}`;
        
        // 2. Define how many images to check and which extensions to try
        const maxImagesToCheck = 10; 
        const extensions = ['png', 'jpg', 'jpeg', 'webp'];
        let imageTags = '';

        // 3. Build image tags for all potential images
        // We render them all, and the ones that don't exist will be removed by 'onerror'
        for (let i = 1; i <= maxImagesToCheck; i++) {
            extensions.forEach(ext => {
                const fullPath = `${folderPath}/${i}.${ext}`;
                imageTags += `<img src="${fullPath}" class="modal-image" onerror="this.remove()">`;
            });
        }

        modalBody.innerHTML = `
            <h2>${data.title}</h2>
            <p style="color: #94a3b8; font-size: 0.95rem;">${data.desc}</p>
            <div class="image-carousel">
                ${imageTags}
            </div>
        `;

        modal.style.display = "block";
        document.body.style.overflow = "hidden";

        // 4. Wait a split second for the browser to try loading images, then start carousel
        setTimeout(() => {
            const validImages = modalBody.querySelectorAll('.modal-image');
            if (validImages.length > 0) {
                validImages[0].classList.add('active'); // Set first valid image to active
                
                if (validImages.length > 1) {
                    let currentIndex = 0;
                    carouselInterval = setInterval(() => {
                        validImages[currentIndex].classList.remove('active');
                        currentIndex = (currentIndex + 1) % validImages.length;
                        validImages[currentIndex].classList.add('active');
                    }, 4000);
                }
            } else {
                // Hide carousel if no images were found after the check
                const carousel = modalBody.querySelector('.image-carousel');
                if (carousel) carousel.style.display = 'none';
            }
        }, 100); // Small delay to let 'onerror' fire for missing files
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