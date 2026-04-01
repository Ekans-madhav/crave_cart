import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import cartService from "../../services/cartService";
import ordersService from "../../services/ordersService";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      const formattedItems = data.items.map(item => ({
        cartItemId: item.id,
        id: item.product.id,
        name: item.product.name,
        price: parseFloat(item.product.price),
        image: item.product.image,
        quantity: item.quantity,
        product: item.product, 
        category: item.product.category,
      }));
      setCartItems(formattedItems);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }
    try {
      const data = await ordersService.getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
    fetchOrders();
  }, [fetchCart, fetchOrders]);

  const addToCart = async (dish) => {
    if (!isAuthenticated) {
      alert("Please login to add items to the cart.");
      window.location.href = "/login";
      return;
    }
    
    try {
      await cartService.addToCart(dish.id, 1);
      await fetchCart();
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const removeFromCart = async (index) => {
    const item = cartItems[index];
    if (!item) return;

    if (isAuthenticated && item.cartItemId) {
      setCartItems((prev) => prev.filter((_, i) => i !== index));
      try {
        await cartService.removeFromCart(item.cartItemId);
      } catch (error) {
        console.error("Remove from cart failed:", error);
        await fetchCart();
      }
    }
  };

  const updateQuantity = async (index, delta) => {
    const item = cartItems[index];
    if (!item) return;

    if (isAuthenticated && item.cartItemId) {
      const newQuantity = item.quantity + delta;
      if (newQuantity < 0) return;
      setCartItems(prev => {
        const next = [...prev];
        if (newQuantity === 0) return next.filter((_, i) => i !== index);
        next[index] = { ...next[index], quantity: newQuantity };
        return next;
      });
      try {
        if (newQuantity === 0) {
          await cartService.removeFromCart(item.cartItemId);
        } else {
          await cartService.updateCartItem(item.cartItemId, newQuantity);
        }
      } catch (error) {
        console.error("Update quantity failed:", error);
        await fetchCart();
      }
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
        setCartItems([]);
      } catch (error) {
        console.error("Clear cart failed:", error);
      }
    } else {
      setCartItems([]);
    }
  };

  const placeOrder = async (customerDetails) => {
    if (cartItems.length === 0) return null;

    const calculateTotal = () => {
      const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      return subtotal + 40; // Including delivery
    };

    const orderData = {
      full_name: customerDetails.fullName,
      email: customerDetails.email,
      phone: customerDetails.phoneNumber,
      address: customerDetails.streetAddress,
      city: customerDetails.city,
      state: customerDetails.state,
      pincode: customerDetails.pincode,
      total_price: Number(calculateTotal()) || 0,
      payment_method: 'COD',
      items: cartItems.map((item) => ({
        product: Number(item.id || item.product?.id),
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
      })),
    };

    try {
      const savedOrder = await ordersService.createOrder(orderData);
      setOrders((prev) => [savedOrder, ...prev]);
      await clearCart();
      return savedOrder;
    } catch (error) {
      console.error("Failed to place order:", error);
      throw error;
    }
  };

  const removeOrder = async (orderId) => {
    try {
      await ordersService.deleteOrder(orderId);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Failed to delete order from DB:", error);
      alert("Failed to delete order. Please try again.");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const updatedOrder = await ordersService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      return updatedOrder;
    } catch (error) {
      console.error("Failed to update status:", error);
      throw error;
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const updatedOrder = await ordersService.cancelOrder(orderId);
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order))
      );
      return updatedOrder;
    } catch (error) {
      console.error("Failed to cancel order:", error);
      throw error;
    }
  };

  const value = useMemo(() => ({
    cartItems,
    orders,
    loading,
    addToCart,
    getCartCount,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
    removeOrder,
    updateOrderStatus,
    cancelOrder,
    fetchOrders,
  }), [cartItems, orders, loading, fetchOrders]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
