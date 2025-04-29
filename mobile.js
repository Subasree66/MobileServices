const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const mobileCards = document.querySelectorAll('.mobile-card');
const cartCount = document.getElementById('cart-count');
const cartPopup = document.getElementById('cart-popup');
const cartItems = document.getElementById('cart-items');
const toast = document.getElementById('toast');

let count = 0;
let cart = [];

// Search button click event
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.toLowerCase();
  filterProducts(searchTerm);
});

// Filter products based on search term
function filterProducts(searchTerm) {
  mobileCards.forEach(card => {
    const title = card.querySelector('h1').textContent.toLowerCase();
    const description = card.querySelector('p').textContent.toLowerCase();
    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Add product to cart functionality
const addCartButtons = document.querySelectorAll('.add-cart');
addCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const product = button.dataset.product;
    const price = parseFloat(button.dataset.price);
    addToCart(product, price);
    showToast();
  });
});

// Add product to cart and update cart view
function addToCart(product, price) {
  const existingProduct = cart.find(item => item.product === product);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ product, price, quantity: 1 });
  }
  count++; // Update the count
  cartCount.textContent = count; // Update cart count
  displayCart(); // Display updated cart
}

// Display cart items
function displayCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <span>${item.product} - $${item.price}</span>
      <span>
        <button onclick="changeQuantity('${item.product}', -1)">-</button>
        <span class="quantity">${item.quantity}</span>
        <button onclick="changeQuantity('${item.product}', 1)">+</button>
        <button onclick="deleteItem('${item.product}')" style="color: blue;background-color: red">Delete</button>
      </span>
      <span class="price">$${(item.quantity * item.price).toFixed(2)}</span>
    `;
    cartItems.appendChild(cartItem);
    total += item.quantity * item.price;
  });
  cartItems.innerHTML += `<hr><div><strong>Total: $${total.toFixed(2)}</strong></div>`;
}

// Change product quantity in cart
function changeQuantity(product, change) {
  const item = cart.find(item => item.product === product);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter(item => item.product !== product);
      count--; // Update count when removing item
      cartCount.textContent = count;
    }
    displayCart(); // Update cart view
  }
}

// Delete an item directly
function deleteItem(product) {
  const item = cart.find(item => item.product === product);
  if (item) {
    cart = cart.filter(item => item.product !== product);
    count--; // Update count when deleting
    cartCount.textContent = count;
    displayCart(); // Refresh cart display
  }
}

// Toggle cart popup visibility
function toggleCartPopup() {
  cartPopup.style.display = cartPopup.style.display === 'block' ? 'none' : 'block';
  displayCart(); // Display cart items when popup opens
}

// Reset the cart count and empty the cart
function closeCart() {
  cart = [];  // Clear the cart array
  count = 0;  // Reset count
  cartCount.textContent = count; // Update the cart count display
  cartPopup.style.display = 'none';  // Close the cart popup
}

// Checkout function to show the form
function checkout() {
  document.getElementById("checkout-form").style.display = "block";
}

// Show toast notification
function showToast() {
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// Form submission and email sending
document.getElementById("checkout-form").addEventListener("submit", function(e) {
  e.preventDefault();
 
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    orderDetails: document.getElementById("orderDetails").value
  };
 
  fetch("https://mobileservices-snzc.onrender.com/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      alert("✅ Email sent successfully!");
    } else {
      alert("❌ Failed to send email!.");
    }
  });
});
