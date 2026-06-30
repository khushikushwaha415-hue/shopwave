import { createContext, useState, useContext, useCallback } from "react";
import API from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await API.post("/cart", { productId, quantity });
    setCart(res.data);
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await API.put(`/cart/${productId}`, { quantity });
    setCart(res.data);
  };

  const removeFromCart = async (productId) => {
    const res = await API.delete(`/cart/${productId}`);
    setCart(res.data);
  };

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, loading, fetchCart, addToCart, updateQuantity, removeFromCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);