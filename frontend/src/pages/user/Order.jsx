import React, { useState } from "react";
import { useCart } from "../../context/user/CartContext";
import { useAuth } from "../../context/user/AuthContext";
import Header from "../../components/user/Header";
import { useNavigate } from "react-router-dom";
import { MapPin, Minus, Plus, CreditCard, ChevronRight } from "lucide-react";

export default function Order() {
  const { cartItems, updateQuantity, placeOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    phoneNumber: user?.phone || "",
    streetAddress: "",
    city: "",
    state: "",
    pincode: "",
  });

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen  bg-gradient-to-br from-gray-50 to-orange-50 flex flex-col items-center justify-center p-6 mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No items to <span className="text-orange-500">Order</span></h2>
            <button 
              onClick={() => navigate("/cart")}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition"
            >
              Return to Cart
            </button>
        </div>
      </>
    );
  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const deliveryCharge = 40;
  const total = subtotal + deliveryCharge;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length > 0) {
      const formAddr = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      };
      
      try {
        const newOrder = await placeOrder(formAddr);
        if (newOrder) {
          navigate(`/payment?orderId=${newOrder.id}`);
        }
      } catch (error) {
        alert("Failed to place order. Please try again.");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10 mt-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-8 border-b border-gray-200 pb-4">
            Order <span className="text-orange-500">Details</span>
          </h2>

          <form id="order-form" onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column: Delivery Form */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Delivery Address
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-sm font-bold text-gray-700">Full Name</label>
                    <input
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-sm font-bold text-gray-700">Email</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-sm font-bold text-gray-700">Phone Number</label>
                    <input
                      required
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+91 99XXXXXX00"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-1.5 flex flex-col">
                  <label className="text-sm font-bold text-gray-700">Address Line</label>
                  <textarea
                    required
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    rows="3"
                    placeholder="123 Street Name, Neighborhood"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-sm font-bold text-gray-700">City</label>
                    <input
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Chennai"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-sm font-bold text-gray-700">State</label>
                    <input
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="Tamil Nadu"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-sm font-bold text-gray-700">Pincode</label>
                    <input
                      required
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="600001"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Order Items Review */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
                  Cart Items Review
                </h3>
                
                <div className="space-y-5">
                  {cartItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center gap-4 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-white">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base sm:text-lg font-bold text-gray-800 tracking-tight truncate">{item.name}</h4>
                        <div className="text-orange-600 font-bold">₹{item.price}</div>
                        <div className="text-xs text-gray-500 mt-0.5">Subtotal: ₹{item.price * item.quantity}</div>
                      </div>
                      
                      {/* +/- Controller */}
                      <div className="flex flex-col items-center bg-white border border-gray-200 rounded-lg p-1">
                        <button
                          type="button" 
                          onClick={() => updateQuantity(index, 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-bold text-gray-700 text-sm">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(index, -1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-orange-100 sticky top-28">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
                  Order Summary
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-800">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-gray-800">₹{deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-gray-800 pt-5 border-t border-gray-200 mt-2">
                    <span>Total Amount</span>
                    <span className="text-orange-600">₹{total}</span>
                  </div>
                </div>
                
                <button
                  type="submit"
                  form="order-form"
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Proceed to Payment <ChevronRight className="w-5 h-5" />
                </button>
                
                <p className="text-xs text-center text-gray-400 mt-6 font-medium px-4">
                  By placing this order, you are shifting securely to the payment portal.
                </p>
              </div>
            </div>
            
          </form>
        </div>
      </div>
    </>
  );
}
