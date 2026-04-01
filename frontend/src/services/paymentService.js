import API from "./api";

const paymentService = {
  processPayment: async (paymentData) => {
    try {
      const response = await API.post("/api/payments/process/", paymentData);
      return response.data;
    } catch (error) {
      console.error("Payment processing error:", error);
      throw error;
    }
  },

  getUserPayments: async () => {
    try {
      const response = await API.get("/api/payments/my-payments/");
      return response.data;
    } catch (error) {
      console.error("Fetch user payments error:", error);
      throw error;
    }
  },
};

export default paymentService;
