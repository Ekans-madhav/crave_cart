import api from './api';

const ordersService = {
  getOrders: async () => {
    try {
      const response = await api.get('/api/orders/');
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/api/orders/', orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await api.get(`/api/orders/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.patch(`/api/orders/${id}/`, { status });
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  cancelOrder: async (id) => {
    try {
      const response = await api.post(`/api/orders/${id}/cancel/`);
      return response.data;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/api/orders/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }
};

export default ordersService;
