import { useState } from "react";
import { useCart } from "./cartContext";

export default function Cart() {
  const { cartItems = [], addToCart, removeFromCart, totalPrice = 0, decreaseQuantity } = useCart();
  
  // 1. State for the Success Popup
  const [showSuccess, setShowSuccess] = useState(false);

  const handleIncrease = (item) => {
    addToCart(item);
  };

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      removeFromCart(item.id);
    } else {
      decreaseQuantity(item.id);
    }
  };

  // 2. Handle Checkout Click (Show Popup)
  const handleCheckout = () => {
    setShowSuccess(true);
  };

  // 3. Handle Popup Close (Clear Cart & Reset)
  const handleCloseSuccess = () => {
    // Clear the cart manually (using your existing logic)
    cartItems.forEach((it) => removeFromCart(it.id ?? it));
    setShowSuccess(false);
  };

  // 4. Conditional Rendering
  // Note: We check !showSuccess here so the empty state doesn't trigger 
  // while the success popup is showing.
  if (!showSuccess && (!cartItems || cartItems.length === 0)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="w-full max-w-xl text-center bg-white/50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-lg p-8 backdrop-blur">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Your cart is empty</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Looks like you haven't added anything yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 relative"> 
      {/* Main Cart Content */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">Shopping Cart</h3>
          <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">{cartItems.length} item(s)</p>
        </div>

        <ul className="divide-y divide-gray-100 dark:divide-slate-800">
          {cartItems.map((item) => (
            <li key={item.id} className="flex flex-row items-center gap-4 px-4 py-4">
              <img
                src={item.image ? item.image.replace(/"/g, "") : ''}
                alt={item.name || "product"}
                className="w-20 h-20 rounded-md object-cover bg-gray-50 dark:bg-slate-800"
                onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/96")}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">{item.name}</h4>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">${(item.price || 0).toFixed(2)}</div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 truncate">{item.color || item.description || ""}</p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDecrease(item)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-700"
                  >
                    −
                  </button>

                  <span className="px-3 text-sm font-medium text-slate-900 dark:text-white">{item.quantity ?? 1}</span>

                  <button
                    type="button"
                    onClick={() => handleIncrease(item)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id ?? item)}
                    className="ml-4 text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-300">Total</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">${Number(totalPrice || 0).toFixed(2)}</div>
          </div>

          <div className="flex items-center gap-3">
            {/* 5. Trigger the Popup on Click */}
            <button
              type="button"
              onClick={handleCheckout} 
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium"
            >
              Checkout now! 
            </button>

            <button
              type="button"
              onClick={() => {
                cartItems.forEach((it) => removeFromCart(it.id ?? it));
              }}
              className="px-4 py-2 bg-gray-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-md"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* --- BIG SUCCESS POPUP --- */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform scale-100 transition-transform border border-gray-100 dark:border-slate-800">
            {/* Big Check Icon */}
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6 animate-bounce">
              <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Order Placed!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
              Thanks for ordering. Your items will be shipped shortly!
            </p>
            
            <button
              onClick={handleCloseSuccess}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

    </div>
  );
}