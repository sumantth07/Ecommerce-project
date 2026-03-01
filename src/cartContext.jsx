import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const CartContext = createContext();

export const CartProvider = ({ children, user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ── Fetch cart from Supabase when user logs in ──
  const fetchCart = useCallback(async () => {
    if (!user) { setCartItems([]); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('cart')
      .select('*, products(*)')
      .eq('user_id', user.id);

    if (!error && data) {
      // Flatten product fields + quantity into one object
      const items = data.map((row) => ({
        ...row.products,
        quantity: row.quantity,
        cart_row_id: row.id,
      }));
      setCartItems(items);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ── Add to cart ──
  const addToCart = async (product) => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    const existing = cartItems.find((item) => item.id === product.id);
    const newQuantity = existing ? existing.quantity + 1 : 1;

    // Optimistic UI update
    if (existing) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
    }

    // Save to Supabase
    const { error } = await supabase.from('cart').upsert(
      {
        user_id: user.id,
        product_id: product.id,
        quantity: newQuantity,
      },
      { onConflict: 'user_id,product_id' }
    );

    if (error) {
      console.error('Error adding to cart:', error);
      fetchCart(); // re-sync if failed
    }
  };

  // ── Remove from cart ──
  const removeFromCart = async (productId) => {
    if (!user) return;
    setCartItems((prev) => prev.filter((item) => item.id !== productId));

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('Error removing from cart:', error);
      fetchCart();
    }
  };

  // ── Decrease quantity ──
  const decreaseQuantity = async (productId) => {
    if (!user) return;
    const existing = cartItems.find((item) => item.id === productId);
    if (!existing) return;

    if (existing.quantity <= 1) {
      await removeFromCart(productId);
      return;
    }

    const newQuantity = existing.quantity - 1;

    // Optimistic UI update
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    const { error } = await supabase
      .from('cart')
      .update({ quantity: newQuantity })
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error('Error decreasing quantity:', error);
      fetchCart();
    }
  };

  // ── Clear entire cart ──
  const clearCart = async () => {
    if (!user) return;
    setCartItems([]);
    await supabase.from('cart').delete().eq('user_id', user.id);
  };

  // ── Total price ──
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, decreaseQuantity, clearCart, totalPrice, loading }}>
      {children}

      {/* ── Login Popup ── */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Login to add items</h3>
            <p className="text-sm text-gray-500 mb-6">
              You need to be logged in to add products to your cart.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLoginPopup(false);
                  navigate('/login');
                }}
                className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);