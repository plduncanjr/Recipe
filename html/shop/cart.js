<script>
// --- Cart persistence ---
const CART_KEY = "museum_cart";

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// --- Core operations ---
function addToCart(itemId, qty = 1) {
  const catalog = window.CATALOG || [];
  const item = catalog.find(p => p.id === itemId);
  if (!item) return;

  const cart = loadCart();
  const found = cart.find(i => i.id === itemId);
  if (found) { found.qty += qty; }
  else { cart.push({ id: item.id, name: item.name, price: item.price, qty: qty }); }
  saveCart(cart);
}

function updateQty(itemId, newQty) {
  const cart = loadCart();
  const it = cart.find(i => i.id === itemId);
  if (!it) return;
  it.qty = Math.max(1, parseInt(newQty, 10) || 1);
  saveCart(cart);
}

function removeFromCart(itemId) {
  let cart = loadCart();
  cart = cart.filter(i => i.id !== itemId);
  saveCart(cart);
}

function clearCart() { saveCart([]); }

// --- Totals & formatting ---
function calcTotals(cart, taxRate = 0.10) {
  let subtotal = 0;
  for (const it of cart) subtotal += it.price * it.qty;
  const tax = +(subtotal * taxRate).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), tax, total };
}

function money(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

// Expose for other pages
window.CartAPI = { loadCart, saveCart, addToCart, updateQty, removeFromCart, clearCart, calcTotals, money };
</script>
