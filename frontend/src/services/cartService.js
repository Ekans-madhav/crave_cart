import API from "./api";

const cartService = {
  getCart: async () => {
    const response = await API.get("/api/cart/my_cart/");
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await API.post("/api/cart/add_to_cart/", {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await API.post("/api/cart/update_quantity/", {
      item_id: itemId,
      quantity,
    });
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await API.post("/api/cart/remove_item/", {
      item_id: itemId,
    });
    return response.data;
  },

  clearCart: async () => {
    const response = await API.post("/api/cart/clear_cart/");
    return response.data;
  },
};

export default cartService;
