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

    // Check if the page is either the Products, About, Gallery or Contact page
    const isSolidHeaderPage = document.body.classList.contains('products-page') || 
                              document.body.classList.contains('about-page') ||
                              document.body.classList.contains('contact-page') ||
                              document.body.classList.contains('gallery-page');

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
        images: ["images/products/22.png", "images/products/17.png", "images/products/27.png"], // 2 extra image
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
            title: "Fiberglass Insect Screen",
            images: ["images/products/1.png", "images/products/2.png"],
            colors: ["Black"],
            dimension: ['48" x 30 meters', '60" x 30 meters', '72" x 30 meters'],
            mesh: ["18 x 16 (+/-1)"],
            material: "Fiberglass",
            brand: "Polar Bear"
        },
        {
            title: "Stainless Steel Net",
            images: ["images/magnet-stripe.jpg", "images/placeholder.png"],
            colors: ["Black"],
            dimension: ['48" x 30 meters'],
            material: "Stainless Steel"
        },
        {
            title: "Polyester Net",
            images: ["images/magnet-stripe.jpg", "images/placeholder.png"],
            colors: ["Black"],
            dimension: ['48" x 30 meters'],
            material: "Polyester"
        },
    ],
    magnet: [
        {
            title: "3M Magnet",
            images: ["images/products/N.png", "images/products/4.png", "images/products/5.png", "images/products/6.png", "images/products/45.png", "images/products/7.png"],
            type: ["Magnet A", "Magnet B"],
            dimension: ['30 meters']
        },
    ],
    "mini-door": [
        {
            title: "Mini Door",
            images: ["images/products/N (4).png", "images/products/12.png", "images/products/9.png", "images/products/10.png"],
            colors: ["Black", "White", "Grey", "Brown"],
            type: ["With Stainless Steel", "With Fiber Net"],
            dimension: ['17.7cm x 19.8cm', '13cm x 20cm']
        },
    ],
    "pvc-stripe": [
        {
            title: "PVC Stripe",
            images: ["images/products/13.png", "images/products/14.png", "images/products/15.png", "images/products/16.png"],
            dimension: ['60 meters'],
            size: ["13mm x 1.2mm"],
            material: "PVC",
            colors: ["Black", "White", "Grey", "Brown"]
        },
    ],
    corner: [
        {
            title: "Corner Up (Flat Corner)",
            images: ["images/products/17.png", "images/products/18.png", "images/products/20.png", "images/products/BL.png", "images/products/BR.png"],
            colors: ["Black", "White", "Grey", "Brown"],
            quantity: ["100 pieces per pack"]
        },
        {
            title: "Corner Down (Handle Corner)",
            images: ["images/products/22.png", "images/products/23.png", "images/products/25.png", "images/products/BL (2).png", "images/products/BR (2).png"],
            colors: ["Black", "White", "Grey", "Brown"], // Fixed typo: was 'ccolors'
            quantity: ["100 pieces per pack"]
        },
    ],
    clip: [
        {
            title: "Clip",
            images: ["images/products/27.png", "images/products/31.png", "images/products/30.png", "images/products/BL (3).png", "images/products/BR (3).png"],
            colors: ["Black", "White", "Grey", "Brown"],
            quantity: ["100 pieces per pack"]
        },
    ],
    glue: [
        {
            title: "Super Glue",
            images: ["images/products/N (2).png", "images/products/35.png", "images/products/33.png", "images/products/34.png"],
            weight: ["20 grams per bottle"],
            type: ["L3"],
            quantity: ["50 pieces per box"]
        },
    ],
    tape: [
        {
            title: "3M Tape",
            images: ["images/products/N (3).png", "images/products/37.png"],
            type: ["3M 300LSE"],
            dimension: ['55" x 12mm']
        },
        {
            title: "Acrylic Form Tape",
            images: ["images/products/38.png", "images/products/39.png", "images/products/40.png"],
            colors: ["Grey"],
            dimension: ['±30 meters']
        },
        {
            title: "P.E Form Tape",
            images: ["images/products/41.png", "images/products/42.png", "images/products/43.png", "images/products/44.png"],
            colors: ["Black"],
            dimension: ['12mm']
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
                            <div class="product-card" onclick="openProductPageModal('${product.title}', '${category}')">
                                <img src="images/products/placeholder-low.png" 
                                    data-src="${product.images[0]}" 
                                    alt="${product.title}" 
                                    class="product-image lazy-load blur-load"
                                    loading="lazy" 
                                    onerror="this.src='images/placeholder.png';">
                                <h3>${product.title.toUpperCase()}</h3>
                                <button class="view-details" onclick="event.stopPropagation(); openProductPageModal('${product.title}', '${category}')">
                                    More Details
                                </button>
                            </div>
                        `;
                    })
                    .join("");

                // After inserting images, apply lazy loading effect
                lazyLoadImages();
            }
        }
    });
}

function lazyLoadImages() {
    const lazyImages = document.querySelectorAll(".lazy-load");

    lazyImages.forEach((img) => {
        const highRes = img.getAttribute("data-src");
        if (!highRes) return;

        const highResImage = new Image();
        highResImage.src = highRes;

        highResImage.onload = function () {
            img.src = highRes; // Swap to high-res
            img.classList.remove("blur-load"); // Remove blur
        };
    });
}

// Generate product details
function generateProductDetails(product) {
    const details = {
        Type: product.type,
        Brand: product.brand,
        Dimension: product.dimension,
        Size: product.size,
        Material: product.material,
        "Mesh/Inch": product.mesh,
        Weight: product.weight,
        Quantity: product.quantity
    };

    return Object.entries(details)
        .filter(([_, value]) => value !== undefined && value !== null && value !== "")
        .map(([label, value]) => {
            const formattedValue = Array.isArray(value) ? value.join(", ") : value;
            return `<li><strong>${label}:</strong> ${formattedValue}</li>`;
        })
        .join("");
}

let currentModalImageIndex = 0; // Keep track of the current image index

function openProductPageModal(title, category) {
    const product = productsPageCategories[category].find((p) => p.title === title);
    if (!product) return;

    const modal = document.getElementById("productModal");
    const modalContent = modal.querySelector(".modal-content");

    // Generate thumbnail images for selection
    const thumbnails = product.images.map((img, index) => `
        <img src="${img}" alt="Thumbnail ${index + 1}" class="thumbnail" 
            onclick="changeMainImage('${img}', this); currentModalImageIndex = ${index};">
    `).join("");

    // Safe color mapping
    const colorMap = {
        Black: "#000000",
        White: "#FFFFFF",
        Grey: "#808080",
        Brown: "#402F1D",
        Transparent: "#f0f0f0" // Light gray so it shows on white background
    };

    // Dynamically generate optional details
    const extraDetails = generateProductDetails(product);
    const isMiniDoor = category === "mini-door" && product.title === "Mini Door";
    const colors = product.colors?.length
        ? `
            <div class="product-colors">
                <p><strong>${isMiniDoor ? "Available Colors for frame:" : "Available Colors:"}</strong></p>
                <div class="color-swatches">
                    ${product.colors.map((color) => `
                        <span class="color-swatch" title="${color}" style="background-color: ${colorMap[color]};"></span>
                    `).join("")}
                </div>
            </div>
        `
        : "";

    const imageList = product.images;
    currentModalImageIndex = 0;
    modal.dataset.images = JSON.stringify(imageList); // Save image array to modal

    // Set up modal content with arrows beside image
    modalContent.innerHTML = `
        <button class="close" onclick="closeProductPageModal()">&times;</button>
        <h2>${product.title}</h2>
        <div class="modal-image-wrapper">
            <button class="modal-arrow left" onclick="showPrevModalImage()">&larr;</button>
            <img id="mainProductImage" src="${imageList[0]}" alt="${product.title}" class="main-image">
            <button class="modal-arrow right" onclick="showNextModalImage()">&rarr;</button>
        </div>
        <div class="thumbnail-container">${thumbnails}</div>
        ${colors}
        ${extraDetails ? `<ul class="product-details">${extraDetails}</ul>` : ""}
    `;

    modal.style.display = "flex";

    // Highlight the first thumbnail
    setTimeout(() => {
        const firstThumbnail = modal.querySelector(".thumbnail");
        if (firstThumbnail) firstThumbnail.classList.add("selected");
    }, 50);
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

function showNextModalImage() {
    const modal = document.getElementById("productModal");
    const imageList = JSON.parse(modal.dataset.images || "[]");
    if (!imageList.length) return;

    currentModalImageIndex = (currentModalImageIndex + 1) % imageList.length;
    changeMainImage(imageList[currentModalImageIndex]);
}

function showPrevModalImage() {
    const modal = document.getElementById("productModal");
    const imageList = JSON.parse(modal.dataset.images || "[]");
    if (!imageList.length) return;

    currentModalImageIndex = (currentModalImageIndex - 1 + imageList.length) % imageList.length;
    changeMainImage(imageList[currentModalImageIndex]);
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

// Function to initialize gallery with categories and lightbox
function initializeGallery() {
    const windowGallery = document.getElementById("windowGallery");
    const doorGallery = document.getElementById("doorGallery");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const closeLightbox = document.querySelector(".close-lightbox");
    const prevButton = document.getElementById("prevImg");
    const nextButton = document.getElementById("nextImg");

    // Image paths for each category
    const images = {
        window: [
            "images/gallery/window/46.png", "images/gallery/window/49.png", "images/gallery/window/50.png",
            "images/gallery/window/53.png", "images/gallery/window/54.png", "images/gallery/window/55.png",
            "images/gallery/window/56.png", "images/gallery/window/58.png"
        ],
        door: [
            "images/gallery/door/47.png", "images/gallery/door/48.png", "images/gallery/door/51.png",
            "images/gallery/door/52.png", "images/gallery/door/57.png", "images/gallery/door/59.png"
        ]
    };

    let currentCategory = null;
    let currentIndex = 0;

    // Load images into the gallery section
    function loadGallery(category, galleryElement) {
        galleryElement.innerHTML = ""; // Clear existing
        images[category].forEach((img, index) => {
            const imgElement = document.createElement("img");
            imgElement.src = img;
            imgElement.alt = `${category} project`;
            imgElement.classList.add("gallery-item");
            imgElement.addEventListener("click", () => openLightbox(category, index));
            galleryElement.appendChild(imgElement);
        });
    }

    // Open lightbox and show selected image
    function openLightbox(category, index) {
        lightbox.classList.add("show");
        lightbox.classList.remove("hide");
        lightbox.style.visibility = "visible";
        lightbox.style.opacity = "1";
        lightboxImg.src = images[category][index];
        currentCategory = category;
        currentIndex = index;
        document.body.style.overflow = "hidden"; // Lock scroll
    }

    // Close lightbox with fade animation
    function closeLightboxHandler() {
        lightbox.classList.add("hide");
        lightbox.classList.remove("show");
        setTimeout(() => {
            lightbox.style.visibility = "hidden";
            lightbox.style.opacity = "0";
        }, 300);
        document.body.style.overflow = ""; // Unlock scroll
    }

    // Show next image in current category
    function showNextImage() {
        if (!currentCategory) return;
        currentIndex = (currentIndex + 1) % images[currentCategory].length;
        lightboxImg.src = images[currentCategory][currentIndex];
    }

    // Show previous image
    function showPrevImage() {
        if (!currentCategory) return;
        currentIndex = (currentIndex - 1 + images[currentCategory].length) % images[currentCategory].length;
        lightboxImg.src = images[currentCategory][currentIndex];
    }

    // Handle arrow keys and escape
    function handleKeydown(event) {
        if (lightbox.classList.contains("show")) {
            if (event.key === "ArrowRight") {
                showNextImage();
            } else if (event.key === "ArrowLeft") {
                showPrevImage();
            } else if (event.key === "Escape") {
                closeLightboxHandler();
            }
        }
    }

    // Close lightbox by clicking outside image
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) {
            closeLightboxHandler();
        }
    });

    // Lightbox control buttons
    closeLightbox.addEventListener("click", closeLightboxHandler);
    nextButton.addEventListener("click", showNextImage);
    prevButton.addEventListener("click", showPrevImage);
    document.addEventListener("keydown", handleKeydown);

    // Load both galleries
    loadGallery("window", windowGallery);
    loadGallery("door", doorGallery);
}

// Initialize all components when DOM is fully loaded
document.addEventListener("DOMContentLoaded", async () => {
    await loadComponents();  // Ensure header/footer loads first

    // Now initialize everything else
    preloadBackgroundImage();
    initializeProductHoverEffects();
    renderFeaturedProducts();
    renderProductsForSections();
    startImageTransition();
    initializeScrollToSection();
    initializeBackToTopButton();
    initializeWhatsAppButton();
    animateAboutUsTitle(); 
    initializeGallery();
});
