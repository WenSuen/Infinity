// Function to load HTML components (header, footer)
function loadComponents() {
    const components = [
        { selector: ".header-container", file: "static/header.html" },
        { selector: ".footer-container", file: "static/footer.html" },
    ];

    components.forEach((component) => {
        fetch(component.file)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${component.file}`);
                }
                return response.text();
            })
            .then((data) => {
                document.querySelector(component.selector).innerHTML = data;

                // Initialize header behavior and highlight the active page after the header is loaded
                if (component.selector === ".header-container") {
                    handleHeaderScroll(); // Handles header scroll behavior
                    highlightActivePage(); // Highlights the active page in the navigation
                }
            })
            .catch((error) => console.error("Error loading component:", error));
    });
}

// Highlight the active link based on the current page name
function highlightActivePage() {
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll('#main-header nav ul li a');

    navLinks.forEach((link) => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// Dynamically preload the hero background image (optional)
function preloadBackgroundImage() {
    const img = new Image();
    img.src = 'images/background.png'; // Ensure the path is correct
    img.onload = () => {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.style.backgroundImage = `url('${img.src}')`;
        }
    };
    img.onerror = () => {
        console.error("Failed to load the background image.");
    };
}

// Add or remove header styles based on scroll position (transparent vs solid)
function handleHeaderScroll() {
    const header = document.querySelector('#main-header');
    if (!header) return;

    // Check if the current page is the products page
    const isProductsPage = document.body.classList.contains('products-page');

    if (!isProductsPage) {
        // Apply scroll-based header behavior only for non-products pages
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('solid-header');
                header.classList.remove('transparent-header');
            } else {
                header.classList.add('transparent-header');
                header.classList.remove('solid-header');
            }
        });
    } else {
        // Ensure the header remains solid on the products page
        header.classList.remove('transparent-header');
        header.classList.add('solid-header');
    }
}

// Initialize hover effects for the product gallery
function initializeProductHoverEffects() {
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach((item) => {
        item.addEventListener('mouseenter', () => {
            item.classList.add('hovered');
        });
        item.addEventListener('mouseleave', () => {
            item.classList.remove('hovered');
        });
    });
}

// Back to Top Button Logic
function initializeBackToTopButton() {
    const backToTopButton = document.getElementById("backToTop");
    if (backToTopButton) {
        const handleScroll = () => {
            const scrollThreshold = window.innerHeight * 1.5;
            backToTopButton.style.display = window.scrollY > scrollThreshold ? "flex" : "none";
        };

        window.addEventListener("scroll", handleScroll);
        backToTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        // Initialize visibility on load
        handleScroll();
    }
}

// WhatsApp Button Logic
function initializeWhatsAppButton() {
    const whatsappButton = document.getElementById("whatsappButton");
    if (whatsappButton) {
        whatsappButton.addEventListener("click", () => {
            const phoneNumber = "60193225830"; // Replace with your number
            const message = "Hi, I would like to know more about your products."; // Optional pre-filled message
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
        });
    }
}

// Featured Products Logic
const products = [
    { title: "Netting Accessories", image: "images/apple.jpg", colors: ["Red", "Green", "Blue"] },
    { title: "Magnetic Clips", image: "images/apple.jpg", colors: ["Yellow", "Black"] },
    { title: "Magnetic Mosquito Net", image: "images/apple.jpg", badge: "Best Seller", colors: ["White", "Gray"] },
    { title: "High-Quality Mesh", image: "images/apple.jpg", colors: ["Silver", "Gold"] },
    { title: "Door Frames", image: "images/apple.jpg", colors: ["Brown", "Beige"] },
];

// Dynamically generate product cards only for non-products pages
function renderFeaturedProducts() {
    const isProductsPage = document.body.classList.contains('products-page');
    if (isProductsPage) return; // Skip rendering if it's the products page

    const productGrid = document.getElementById("productGrid");
    if (!productGrid) return;

    productGrid.innerHTML = products
        .map((product) => `
            <div class="product-item" onclick="showProductDetails('${product.title}')">
                ${product.badge ? `<div class="badge">${product.badge}</div>` : ""}
                <div class="product-card">
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                </div>
            </div>
        `)
        .join("");
}

// Show product details in a modal
function showProductDetails(title) {
    const product = products.find((p) => p.title === title);
    if (!product) return;

    const modal = document.getElementById("productModal");
    const modalContent = document.querySelector("#productModal .modal-content");

    modalContent.innerHTML = `
        <span class="close" onclick="closeModal()">&times;</span>
        <h2>${product.title}</h2>
        <img src="${product.image}" alt="${product.title}" style="max-width: 100%; height: auto;">
        <p>Available Colors:</p>
        <ul>
            ${product.colors.map((color) => `<li>${color}</li>`).join("")}
        </ul>
    `;

    modal.style.display = "block";
}

// Close the modal
function closeModal() {
    const modal = document.getElementById("productModal");
    modal.style.display = "none";
}

// Initialize all components when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    loadComponents();
    preloadBackgroundImage();
    initializeProductHoverEffects();
    renderFeaturedProducts();
    initializeBackToTopButton();
    initializeWhatsAppButton();
});
