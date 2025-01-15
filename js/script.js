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

// Placeholder Data for Each Section
const productsPageCategories = {
    net: [
        { title: "Fiberglass Net", image: "images/fiberglass-net.jpg", colors: ["Red", "Green"], description: "Durable fiberglass net for various uses." },
        { title: "Stainless Steel Net", image: "images/stainless-steel-net.jpg", colors: ["Silver"], description: "High-quality stainless steel net." },
        { title: "Polyester Net", image: "images/polyester-net.jpg", colors: ["Blue", "Yellow"], description: "Lightweight polyester net for indoor use." },
    ],
    magnet: [
        { title: "3M Magnet Stripe", image: "images/3m-magnet.jpg", colors: ["Black", "Gray"], description: "3M high-strength magnet stripe for sealing." },
        { title: "Magnet Stripe", image: "images/magnet-stripe.jpg", colors: ["White"], description: "Versatile magnetic stripe for multiple applications." },
    ],
    "mini-door": [
        { title: "Mini Door", image: "images/mini-door.jpg", colors: ["Brown"], description: "Compact and stylish mini door." },
    ],
    "pvc-stripe": [
        { title: "PVC Stripe", image: "images/pvc-stripe.jpg", colors: ["Clear", "Opaque"], description: "Durable PVC stripe for insulation." },
    ],
    corner: [
        { title: "Corner Up (Flat Corner)", image: "images/corner-up.jpg", colors: ["Silver", "Gold"], description: "Flat corner for seamless jointing." },
        { title: "Corner Down (Handle Corner)", image: "images/corner-down.jpg", colors: ["Bronze"], description: "Handle corner for added functionality." },
    ],
    clip: [
        { title: "Clip", image: "images/clip.jpg", colors: ["Black", "White"], description: "Sturdy clip for fastening." },
    ],
    glue: [
        { title: "Super Glue (L3)", image: "images/super-glue.jpg", colors: ["Transparent"], description: "High-strength super glue for bonding." },
    ],
    tape: [
        { title: "3M Tape", image: "images/3m-tape.jpg", colors: ["Gray"], description: "Reliable 3M tape for sealing." },
        { title: "Acrylic Form Tape", image: "images/acrylic-form-tape.jpg", colors: ["White"], description: "Acrylic foam tape for superior adhesion." },
        { title: "P.E Form Tape", image: "images/pe-form-tape.jpg", colors: ["Black"], description: "P.E foam tape for insulation." },
    ],
};

// Render Products for Each Section
function renderProductsForSections() {
    Object.keys(productsPageCategories).forEach((category) => {
        const section = document.getElementById(category);
        const productGrid = section.querySelector(".product-grid");

        if (productGrid) {
            productGrid.innerHTML = productsPageCategories[category]
                .map(
                    (product) => `
                    <div class="product-item">
                        <div class="product-card">
                            <img src="${product.image}" alt="${product.title}">
                            <h3>${product.title}</h3>
                            <button onclick="openProductPageModal('${product.title}', '${category}')">View Details</button>
                        </div>
                    </div>
                `
                )
                .join("");
        }
    });
}

// Open Product Modal (Updated to Handle Multiple Categories)
function openProductPageModal(title, category) {
    const product = productsPageCategories[category].find((p) => p.title === title);
    if (!product) return;

    const modal = document.getElementById("productModal");
    const modalContent = modal.querySelector(".modal-content");

    modalContent.innerHTML = `
        <button class="close" onclick="closeProductPageModal()">&times;</button>
        <h2>${product.title}</h2>
        <img src="${product.image}" alt="${product.title}">
        <p>${product.description}</p>
        <p>Available Colors:</p>
        <ul>
            ${product.colors.map((color) => `<li>${color}</li>`).join("")}
        </ul>
    `;

    modal.style.display = "flex";
}

// Close the Modal
function closeProductPageModal() {
    const modal = document.getElementById("productModal");
    modal.style.display = "none";
}

// Close the modal when clicking outside of it
window.addEventListener("click", (e) => {
    const modal = document.getElementById("productModal");
    if (e.target === modal) {
        closeProductPageModal();
    }
});

// Initialize Scroll-to-Section Functionality
function initializeScrollToSection() {
    const links = document.querySelectorAll(".product-navigation a");
    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70, // Offset for fixed header
                    behavior: "smooth",
                });
            }
        });
    });
}

// Initialize Products Page components
document.addEventListener("DOMContentLoaded", () => {
    const isProductsPage = document.body.classList.contains("products-page");
    if (isProductsPage) {
        renderProductsForSections(); // Render products for all sections
        initializeScrollToSection(); // Set up scroll functionality
    }
});

// Initialize all shared components when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    loadComponents();
    preloadBackgroundImage();
    initializeProductHoverEffects();
    renderFeaturedProducts();
    initializeBackToTopButton();
    initializeWhatsAppButton();
});
