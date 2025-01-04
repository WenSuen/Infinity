// Function to load HTML components (header, footer, and optionally head)
function loadComponents() {
    const components = [
        { selector: ".header-container", file: "static/header.html" },
        { selector: ".footer-container", file: "static/footer.html" },
    ];

    components.forEach(component => {
        fetch(component.file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${component.file}`);
                }
                return response.text();
            })
            .then(data => {
                document.querySelector(component.selector).innerHTML = data;

                // Initialize header scroll behavior after it's loaded
                if (component.selector === ".header-container") {
                    handleHeaderScroll();
                    highlightActiveNavLink(); // Ensure active link logic is initialized
                }
            })
            .catch(error => console.error("Error loading component:", error));
    });
}

// Dynamically preload the background image
function preloadBackgroundImage() {
    const img = new Image();
    img.src = 'images/background.png'; // Adjust the path if necessary
    img.onload = () => {
        document.querySelector('.hero').style.backgroundImage = `url('${img.src}')`;
    };
    img.onerror = () => {
        console.error("Failed to load the background image.");
    };
}

// Add or remove header styles based on scroll position
function handleHeaderScroll() {
    const header = document.querySelector('#main-header');

    window.addEventListener('scroll', () => {
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
});
