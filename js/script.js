// Function to load HTML components (header, footer, and optionally head)
function loadComponents() {
    const components = [
        { selector: ".header-container", file: "static/header.html" },
        { selector: ".footer-container", file: "static/footer.html" },
    ];

    components.forEach(component => {
        fetch(component.file)
            .then(response => response.text())
            .then(data => {
                document.querySelector(component.selector).innerHTML = data;

                // Initialize header scroll behavior after it's loaded
                if (component.selector === ".header-container") {
                    handleHeaderScroll();
                }
            })
            .catch(error => console.error("Error loading component:", error));
    });
}

// Function to dynamically preload the background image
function preloadBackgroundImage() {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = 'images/background.png'; // Ensure the path is correct
    document.head.appendChild(preloadLink);
}

// Add or remove header styles based on scroll position
function handleHeaderScroll() {
    const header = document.querySelector('#main-header');

    document.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('solid-header');
            header.classList.remove('transparent-header');
        } else {
            header.classList.add('transparent-header');
            header.classList.remove('solid-header');
        }
    });
}

// Highlight active navigation link based on scroll position
function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#main-header nav ul li a');

    window.addEventListener('scroll', () => {
        let currentSection = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 60; // Adjust for header height
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize all functions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    preloadBackgroundImage();
    highlightActiveNavLink();
});
