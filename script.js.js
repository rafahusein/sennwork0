// Sample product data
const products = [
    {
        id: 1,
        title: "Lukisan Ragam Hias",
        description: "Lukisan yang menggabungkan antara flora dan fauna.",
        price: 25000,
    image: "./images/gambar_kepik.jpg"




    

    },
    {
        id: 2,
        title: "Eco print",
        description: "Karya yang menggunakan metode ekstrak dari sari tumbuhan.",
        price: 18000,
        image: "./images/Ecoprint.jpg"


    },
    {
        id: 3,
        title: "Recyle craft",
        description: "Karya yang saya buat dari botol plastik bekas berbentuk minion",
        price: 10000,
        image: "./images/minion.jpg"

    },
    {
        id: 4,
        title: "Poster sekolah",
        description: "karya digital poster, kamu juga bisa request poster sesuai keinginan mu.",
        price: 20000,
        image: "./images/pster.jpg"
    },
    {
        id: 5,
        title: "Karya seni kolase",
        description: "Karya seni yang dibuat menggunakan potongan potongan kecil dari bahan sehingga membentuk sebuah pola yang aesthetic.",
        price: 15000,
        image: "./images/kupu.jpg"
    },
    {
        id: 6,
        title: "Costum logo",
        description: "Karya digital logo kamu bisa cosume logo sesuai keinginan kamu",
        price: 25000,
        image: "./images/logo.jpg"
    }
];

// Cart functionality
let cart = [];
let currentProduct = null;

// DOM Elements
const cartModal = document.getElementById('cartModal');
const productModal = document.getElementById('productModal');
const cartCount = document.querySelector('.cart-count');
const galleryGrid = document.getElementById('galleryGrid');

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (event.target === productModal) {
            productModal.style.display = 'none';
        }
    });
});

// Load products into gallery
function loadProducts() {
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        galleryGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description.substring(0, 80)}...</p>
            <p class="product-price">Rp ${formatPrice(product.price)}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
            </button>
        </div>
    `;
    
    // Add click event to open product modal (except for the button)
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('add-to-cart-btn') && !e.target.classList.contains('fas')) {
            openProductModal(product);
        }
    });
    
    return card;
}

// Format price to Indonesian Rupiah
function formatPrice(price) {
    return price.toLocaleString('id-ID');
}

// Open product modal
function openProductModal(product) {
    if (!productModal) return;
    
    currentProduct = product;
    
    document.getElementById('modalTitle').textContent = product.title;
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalPrice').textContent = formatPrice(product.price);
    
    productModal.style.display = 'block';
}

// Close product modal
function closeProductModal() {
    if (productModal) {
        productModal.style.display = 'none';
    }
    currentProduct = null;
}

// Add to cart from modal
function addToCartFromModal() {
    if (currentProduct) {
        addToCart(currentProduct.id);
        closeProductModal();
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    updateCartCount();
    showNotification('Produk berhasil ditambahkan ke keranjang!');
}

// Update cart count
function updateCartCount() {
    if (!cartCount) return;
    
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Toggle cart modal
function toggleCart() {
    if (!cartModal) return;
    
    if (cartModal.style.display === 'block') {
        cartModal.style.display = 'none';
    } else {
        updateCartDisplay();
        cartModal.style.display = 'block';
    }
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Keranjang belanja kosong</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>Jumlah: ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <p class="cart-item-price">Rp ${formatPrice(item.price * item.quantity)}</p>
                <button onclick="removeFromCart(${index})" style="background: #e74c3c; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer; margin-left: 0.5rem;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(itemElement);
        total += item.price * item.quantity;
    });
    
    cartTotal.textContent = formatPrice(total);
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
    showNotification('Produk berhasil dihapus dari keranjang!');
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Keranjang belanja kosong!');
        return;
    }
    
    // Create order summary
    let orderSummary = 'Halo! Saya ingin memesan:\n\n';
    let total = 0;
    
    cart.forEach(item => {
        orderSummary += `${item.title} - ${item.quantity}x - Rp ${formatPrice(item.price * item.quantity)}\n`;
        total += item.price * item.quantity;
    });
    
    orderSummary += `\nTotal: Rp ${formatPrice(total)}\n\nTerima kasih!`;
    
    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(orderSummary);
    const whatsappUrl = `https://wa.me/6288801977030?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Clear cart
    cart = [];
    updateCartCount();
    toggleCart();
    
    showNotification('Anda akan diarahkan ke WhatsApp untuk menyelesaikan pesanan!');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        max-width: 300px;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Contact functions
function openWhatsApp() {
    window.open('https://wa.me/6288801977030', '_blank');
}

function openInstagram() {
    window.open('https://instagram.com/hsen_0x', '_blank');
}

function openEmail() {
    window.location.href = 'mailto:rafahusein145@gmail.com';
}
