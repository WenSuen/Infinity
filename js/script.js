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
                    handleHeaderScroll(); // If you still want the transparent-to-solid effect
                    highlightActivePage(); // <--- NEW function call for multi-page highlighting
                }
            })
            .catch((error) => console.error("Error loading component:", error));
    });
}

// 1) Highlight the active link based on the current page name
function highlightActivePage() {
    // Get the current page file name (e.g., "index.html", "about.html")
    const currentPage = window.location.pathname.split("/").pop();

    // Select all nav links in your header
    const navLinks = document.querySelectorAll('#main-header nav ul li a');

    // Remove 'active' from all links, then add 'active' to the link matching the current page
    navLinks.forEach(link => {
        link.classList.remove('active');
        
        // Compare link's href attribute (e.g., "index.html") to the current page file
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// 2) Dynamically preload the hero background image (optional)
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

// 3) Add or remove header styles based on scroll position (transparent vs solid)
function handleHeaderScroll() {
    const header = document.querySelector('#main-header');
    if (!header) return; // Ensure header exists before applying behavior

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

// 4) Add hover effects for product gallery (optional)
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

// 5) Initialize all functions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    preloadBackgroundImage();
    initializeProductHoverEffects();
    renderFeaturedProducts(); // New function for dynamically loading featured products
});

// Back to Top Button Logic
document.addEventListener("DOMContentLoaded", () => {
    const backToTopButton = document.getElementById("backToTop");

    const handleScroll = () => {
        const scrollThreshold = window.innerHeight * 1.5; // Show button after scrolling 1.5 times the viewport height
        if (window.scrollY > scrollThreshold) {
            backToTopButton.style.display = "flex"; // Show the button
        } else {
            backToTopButton.style.display = "none"; // Hide the button
        }
    };

    // Check scroll position on load
    handleScroll();

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Scroll back to the top when clicked
    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});

// WhatsApp Button Logic
document.addEventListener("DOMContentLoaded", () => {
    const whatsappButton = document.getElementById("whatsappButton");

    // Ensure the button is always visible
    whatsappButton.style.display = "flex"; // Show the button immediately when the page loads

    whatsappButton.addEventListener("click", () => {
        // Replace with your WhatsApp phone number (in international format, without the "+" sign)
        const phoneNumber = "60193225830"; // Example: Malaysia phone number
        const message = "Hi, I would like to know more about your products."; // Optional pre-filled message
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
    });
});

// Featured Products Logic
const products = [
    {
        title: "Magnetic Mosquito Net",
        image: "images/apple.jpg",
        price: "$25",
        badge: "Best Seller",
    },
    {
        title: "Netting Accessories",
        image: "images/apple.jpg",
        price: "$15",
        badge: "New",
    },
    {
        title: "Magnetic Clips",
        image: "images/apple.jpg",
        price: "$20",
    },
    {
        title: "High-Quality Mesh",
        image: "images/apple.jpg",
        price: "$30",
    },
    {
        title: "Door Frames",
        image: "images/apple.jpg",
        price: "$50",
    },
];

// Dynamically generate product cards
function renderFeaturedProducts() {
    const productGrid = document.getElementById("productGrid");
    if (!productGrid) return; // Ensure the grid container exists

    productGrid.innerHTML = products
        .map(
            (product) => `
            <div class="product-item">
                <div class="product-card">
                    ${
                        product.badge
                            ? `<span class="badge">${product.badge}</span>` // Badge if available
                            : ""
                    }
                    <img src="${product.image}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <div class="price">${product.price}</div>
                    <a href="products.html" class="product-overlay">
                        <i class="fas fa-search-plus"></i>
                        <p>See More</p>
                    </a>
                </div>
            </div>`
        )
        .join(""); // Convert array to a single HTML string
}

// Initialize Featured Products Rendering
document.addEventListener("DOMContentLoaded", () => {
    renderFeaturedProducts();
});
