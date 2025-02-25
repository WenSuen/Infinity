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

    // Check if the page is either the Products, About, or Contact page
    const isSolidHeaderPage = document.body.classList.contains('products-page') || 
                              document.body.classList.contains('about-page') ||
                              document.body.classList.contains('contact-page');

    if (!isSolidHeaderPage) {
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

        handleScroll();
    }
}

// WhatsApp Button Logic
function initializeWhatsAppButton() {
    const whatsappButton = document.getElementById("whatsappButton");
    if (whatsappButton) {
        whatsappButton.addEventListener("click", () => {
            const phoneNumber = "60193225830";
            const message = "Hi, I would like to know more about your products.";
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
        });
    }
}

// Featured Products Data (Supports carousel-style image transitions)
const products = [
    { 
        title: "Super Glue (L3)", 
        images: ["images/products/N (2).png", "images/products/34.png"], // 1 extra image
        colors: ["Red", "Green", "Blue"] 
    },
    { 
        title: "Corner & Clip", 
        images: ["images/products/22.png", "images/products/17.png"], // 1 extra image
        colors: ["Yellow", "Black"] 
    },
    { 
        title: "Magnet Stripe", 
        images: ["images/products/N.png", "images/products/45.png"], // 1 extra image
        badge: "Best Seller", 
        colors: ["White", "Gray"] 
    },
    { 
        title: "PVC Stripe", 
        images: ["images/products/13.png", "images/products/15.png"], // 1 extra image
        colors: ["Silver", "Gold"] 
    },
    { 
        title: "Mini Doors", 
        images: ["images/products/11.png", "images/products/9.png"], // 1 extra image
        colors: ["Brown", "Beige"] 
    },
];

// Function to start image transitions with a carousel effect (ONLY for featured products)
function startImageTransition() {
    document.querySelectorAll('.featured-product-card').forEach((card, index) => {
        const product = products[index]; // Get the corresponding product
        const img = card.querySelector("img"); // Select the image inside the card

        if (!img) return; // Ensure the image exists

        img.src = product.images[0]; // Always load the first image initially

        if (product.images.length > 1) { // Apply transition only if multiple images exist
            let currentImageIndex = 0;

            setInterval(() => {
                const nextImageIndex = (currentImageIndex + 1) % product.images.length;
                const nextImage = product.images[nextImageIndex];

                // Apply carousel slide effect
                img.style.transition = "transform 0.5s ease-in-out";
                img.style.transform = "translateX(100%)"; // Move out to the right

                setTimeout(() => {
                    img.src = nextImage; // Switch image
                    img.style.transition = "none";
                    img.style.transform = "translateX(-100%)"; // Move new image to the left instantly

                    setTimeout(() => {
                        img.style.transition = "transform 0.5s ease-in-out";
                        img.style.transform = "translateX(0)"; // Slide image back to center
                    }, 50); // Short delay to reset transform

                    currentImageIndex = nextImageIndex;
                }, 500); // Wait 0.5s before switching image
            }, 5000); // Change every 5 seconds
        }
    });
}

// Dynamically generate product cards for non-products pages
function renderFeaturedProducts() {
    const productGrid = document.getElementById("featuredProductGrid"); // Update the ID
    if (!productGrid) return;

    productGrid.innerHTML = products
        .map((product) => `
            <div class="product-item">
                ${product.badge ? `<div class="badge">${product.badge}</div>` : ""}
                <div class="featured-product-card product-card"> <!-- Ensure this class is present -->
                    <img src="${product.images[0]}" alt="${product.title}">
                    <h3>${product.title}</h3>
                </div>
            </div>
        `)
        .join("");

    startImageTransition(); // Start the carousel effect after rendering
}

// Products Page Logic
const productsPageCategories = {
    net: [
        { 
            title: "Fiberglass Net", 
            images: ["images/products/1.png", "images/placeholder.png"], 
            colors: ["Red", "Green"], 
            description: "Durable fiberglass net for various uses." 
        },
        { 
            title: "Stainless Steel Net", 
            images: ["images/magnet-stripe.jpg", "images/placeholder.png"], 
            colors: ["Silver"], 
            description: "High-quality stainless steel net." 
        },
        { 
            title: "Polyester Net", 
            images: ["images/magnet-stripe.jpg", "images/placeholder.png"], 
            colors: ["Blue", "Yellow"], 
            description: "Lightweight polyester net for indoor use." 
        },
    ],
    magnet: [
        { 
            title: "3M Magnet Stripe", 
            images: ["images/products/N.png", "images/placeholder.png"], 
            colors: ["Black", "Gray"], 
            description: "3M high-strength magnet stripe for sealing." 
        },
        { 
            title: "Magnet Stripe", 
            images: ["images/products/45.png", "images/placeholder.png"], 
            colors: ["White"], 
            description: "Versatile magnetic stripe for multiple applications." 
        },
    ],
    "mini-door": [
        { 
            title: "Mini Door", 
            images: ["images/products/N (4).png", "images/placeholder.png"], 
            colors: ["Brown"], 
            description: "Compact and stylish mini door." 
        },
    ],
    "pvc-stripe": [
        { 
            title: "PVC Stripe", 
            images: ["images/products/13.png", "images/placeholder.png"], 
            colors: ["Clear", "Opaque"], 
            description: "Durable PVC stripe for insulation." 
        },
    ],
    corner: [
        { 
            title: "Corner Up <br> (Flat Corner)", 
            images: ["images/products/17.png", "images/placeholder.png"], 
            colors: ["Silver", "Gold"], 
            description: "Flat corner for seamless jointing." 
        },
        { 
            title: "Corner Down (Handle Corner)", 
            images: ["images/products/22.png", "images/placeholder.png"], 
            colors: ["Bronze"], 
            description: "Handle corner for added functionality." 
        },
    ],
    clip: [
        { 
            title: "Clip", 
            images: ["images/products/27.png", "images/placeholder.png"], 
            colors: ["Black", "White"], 
            description: "Sturdy clip for fastening." 
        },
    ],
    glue: [
        { 
            title: "Super Glue (L3)", 
            images: ["images/products/N (2).png", "images/placeholder.png"], 
            colors: ["Transparent"], 
            description: "High-strength super glue for bonding." 
        },
    ],
    tape: [
        { 
            title: "3M Tape", 
            images: ["images/products/N (3).png", "images/placeholder.png"], 
            colors: ["Gray"], 
            description: "Reliable 3M tape for sealing." 
        },
        { 
            title: "Acrylic Form Tape", 
            images: ["images/products/38.png", "images/placeholder.png"], 
            colors: ["White"], 
            description: "Acrylic foam tape for superior adhesion." 
        },
        { 
            title: "P.E Form Tape", 
            images: ["images/products/41.png", "images/placeholder.png"], 
            colors: ["Black"], 
            description: "P.E foam tape for insulation." 
        },
    ],
};

function renderProductsForSections() {
    console.log("Rendering Products...");

    Object.keys(productsPageCategories).forEach((category) => {
        const section = document.getElementById(category);
        if (section) {
            const productGrid = section.querySelector(".product-grid");
            if (productGrid) {
                productGrid.innerHTML = productsPageCategories[category]
                    .map((product) => {
                        console.log(`Loading image: ${product.images[0]}`); // Debugging
                        return `
                            <div class="product-card">
                                <img src="${product.images[0]}" 
                                     alt="${product.title}" 
                                     class="product-image" 
                                     loading="lazy" 
                                     onerror="this.src='images/placeholder.png';">
                                <h3>${product.title.toUpperCase()}</h3>
                                <button class="view-details" onclick="openProductPageModal('${product.title}', '${category}')">
                                    More Details
                                </button>
                            </div>
                        `;
                    })
                    .join("");
            }
        }
    });
}

// Product Modal Logic
function openProductPageModal(title, category) {
    const product = productsPageCategories[category].find((p) => p.title === title);
    if (!product) return;

    const modal = document.getElementById("productModal");
    const modalContent = modal.querySelector(".modal-content");

    // Generate thumbnail images for selection
    const thumbnails = product.images.map((img, index) => `
        <img src="${img}" alt="Thumbnail ${index + 1}" class="thumbnail" 
            onclick="changeMainImage('${img}', this)">
    `).join("");

    // Set up modal content
    modalContent.innerHTML = `
        <button class="close" onclick="closeProductPageModal()">&times;</button>
        <h2>${product.title}</h2>
        <img id="mainProductImage" src="${product.images[0]}" alt="${product.title}" class="main-image">
        <div class="thumbnail-container">${thumbnails}</div>
        <p>${product.description}</p>
        <p>Available Colors:</p>
        <ul>${product.colors.map((color) => `<li>${color}</li>`).join("")}</ul>
    `;

    // Highlight first thumbnail as selected
    setTimeout(() => {
        const firstThumbnail = modal.querySelector(".thumbnail");
        if (firstThumbnail) {
            firstThumbnail.classList.add("selected");
        }
    }, 50);

    modal.style.display = "flex";
}

function changeMainImage(imageSrc, element) {
    const mainImage = document.getElementById("mainProductImage");

    if (mainImage) {
        mainImage.style.opacity = "0"; // Fade out
        setTimeout(() => {
            mainImage.src = imageSrc;
            mainImage.style.opacity = "1"; // Fade in
        }, 300);
    }

    // Remove 'selected' class from all thumbnails
    const thumbnails = document.querySelectorAll(".thumbnail");
    thumbnails.forEach((thumb) => thumb.classList.remove("selected"));

    // Add 'selected' class to clicked thumbnail
    if (element) {
        element.classList.add("selected");
    }
}

function closeProductPageModal() {
    const modal = document.getElementById("productModal");
    modal.style.display = "none";
}

window.addEventListener("click", (e) => {
    const modal = document.getElementById("productModal");
    if (e.target === modal) {
        closeProductPageModal();
    }
});

// Initialize Scroll-to-Section
function initializeScrollToSection() {
    const links = document.querySelectorAll(".product-navigation a");
    links.forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: "smooth",
                });
            }
        });
    });
}

function animateAboutUsTitle() {
    const title = document.querySelector(".about-us-text h3");

    if (title) {
        let text = title.textContent;
        title.innerHTML = ""; // Clear existing text

        text.split("").forEach((char, index) => {
            let span = document.createElement("span");
            span.textContent = char;
            span.style.setProperty("--delay", index);

            // Preserve spaces by converting them into non-breaking spaces
            if (char === " ") {
                span.innerHTML = "&nbsp;";
            }

            title.appendChild(span);
        });
    }
}

// Initialize all components when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    loadComponents();
    preloadBackgroundImage();
    initializeProductHoverEffects();
    renderFeaturedProducts();
    renderProductsForSections();
    startImageTransition();
    initializeScrollToSection();
    initializeBackToTopButton();
    initializeWhatsAppButton();
    animateAboutUsTitle(); 
});
