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
            })
            .catch(error => console.error("Error loading component:", error));
    });
}

// Load components on DOMContentLoaded
document.addEventListener("DOMContentLoaded", loadComponents);

// Change header background on scroll
document.addEventListener('scroll', () => {
    const header = document.querySelector('.header-container');
    if (window.scrollY > 50) {
        header.classList.add('solid-header');
        header.classList.remove('transparent-header');
    } else {
        header.classList.add('transparent-header');
        header.classList.remove('solid-header');
    }
});
