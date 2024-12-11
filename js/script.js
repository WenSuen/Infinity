// Function to load HTML components (header and footer)
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
                // Add scroll listener after header is loaded
                if (component.selector === ".header-container") {
                    handleHeaderScroll();
                }
            })
            .catch(error => console.error("Error loading component:", error));
    });
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

// Load components on DOMContentLoaded
document.addEventListener("DOMContentLoaded", loadComponents);
