import { useState } from "react";
import { useCart } from "./cartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cartItems = [], addToCart, removeFromCart, totalPrice = 0, decreaseQuantity, placeOrder } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const handleIncrease = (item) => addToCart(item);

  const handleDecrease = (item) => {
    if (item.quantity === 1) removeFromCart(item.id);
    else decreaseQuantity(item.id);
  };

  // ── Checkout: save order to DB then show success popup
  const handleCheckout = async () => {
    setPlacing(true);
    const error = await placeOrder();
    setPlacing(false);
    if (!error) setShowSuccess(true);
  };

  if (!showSuccess && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="w-full max-w-xl text-center bg-white/50 border border-gray-200 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Your cart is empty</h2>
          <p className="mt-2 text-sm text-slate-600">Looks like you haven't added anything yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      <div className="max-w-5xl mx-auto bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-slate-900">Shopping Cart</h3>
          <p className="text-sm text-slate-500 mt-1">{cartItems.length} item(s)</p>
        </div>

        <ul className="divide-y divide-gray-100">
          {cartItems.map((item) => (
            <li key={item.id} className="flex flex-row items-center gap-4 px-4 py-4">
              <img
                src={item.image ? item.image.replace(/"/g, "") : ''}
                alt={item.name || "product"}
                className="w-20 h-20 rounded-md object-cover bg-gray-50"
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/96")}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-slate-900 truncate">{item.name}</h4>
                  <div className="text-sm font-semibold text-slate-900">${(item.price || 0).toFixed(2)}</div>
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate">{item.description || ""}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={() => handleDecrease(item)} className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 text-slate-700 hover:bg-gray-200">−</button>
                  <span className="px-3 text-sm font-medium text-slate-900">{item.quantity ?? 1}</span>
                  <button onClick={() => handleIncrease(item)} className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">+</button>
                  <button onClick={() => removeFromCart(item.id)} className="ml-4 text-sm text-red-600 hover:underline">Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500">Total</div>
            <div className="text-2xl font-bold text-slate-900">${Number(totalPrice || 0).toFixed(2)}</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={placing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-md font-medium"
            >
              {placing ? "Placing order..." : "Checkout now!"}
            </button>
            <button
              type="button"
              onClick={() => cartItems.forEach((it) => removeFromCart(it.id))}
              className="px-4 py-2 bg-gray-100 text-slate-900 rounded-md"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-100">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6 animate-bounce">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Order Placed!</h2>
            <p className="text-slate-500 mb-8 text-lg">Thanks for ordering. Your items will be shipped shortly!</p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowSuccess(false); navigate('/homepage'); }}
                className="flex-1 py-3 px-4 bg-gray-100 text-slate-900 rounded-xl font-bold"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => { setShowSuccess(false); navigate('/orders'); }}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold"
              >
                View Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}