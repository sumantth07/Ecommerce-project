// src/context/CartContext.jsx
import { createContext, useState, useContext,useEffect } from 'react';

// 1. Create the Context
const CartContext = createContext();

// 2. Create the Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const storedCart = localStorage.getItem("cartItems");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);



  // Function to add item (Basic version)
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if item is already in cart
      const itemExists = prevItems.find((item) => item.id === product.id);
      
      if (itemExists) {
        // If yes, increase quantity
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
           

      } else {
        // If no, add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
      
    });
   
    
  };

  // Function to remove item
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Function to decrease quantity
  const decreaseQuantity = (productId) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          // 1. Find the item
          if (item.id === productId) {
            // 2. Return a new item with 1 less quantity
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        // 3. Chain a filter to remove anything that hit 0
        .filter((item) => item.quantity > 0);
    });
  };

  // Calculate total price (Derived state)
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart,decreaseQuantity, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Create a Custom Hook (for easy access)
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);