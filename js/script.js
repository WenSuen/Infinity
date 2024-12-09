// Function to load HTML components (header and footer)
function loadComponents() {
    const components = [
        { selector: ".header-container", file: "components/header.html" },
        { selector: ".footer-container", file: "components/footer.html" },
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
