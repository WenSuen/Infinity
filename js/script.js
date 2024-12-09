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
