import { useState, useEffect } from "react";
import { useCart } from "../../context/user/CartContext";
import Header from "../../components/user/Header";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MapPin, Banknote, CreditCard, Wallet, ReceiptText, ShieldCheck, CheckCircle, PackageSearch, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewModal from "../../components/user/ReviewModal";
import { Star } from "lucide-react";
import paymentService from "../../services/paymentService";
import { verifyOffer } from "../../services/todayOfferService";
import { Ticket, X } from "lucide-react";

export default function Payment() {
  const { orders, fetchOrders } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Review Modal States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openReviewModal = (product) => {
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
  };

  useEffect(() => {
    if (orderId) {
      const foundOrder = orders.find((o) => String(o.id) === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        // Optional: Re-fetch if not found locally
        fetchOrders();
      }
    } else {
      navigate("/orders");
    }
  }, [orderId, orders, navigate, fetchOrders]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsVerifying(true);
    setCouponError("");
    try {
      const res = await verifyOffer(couponCode);
      if (res.data?.valid) {
        setAppliedCoupon(res.data);
        const discountStr = res.data.discount; // e.g. "50% OFF" or "₹100 OFF"
        const total = parseFloat(order.total_price);
        let discount = 0;

        if (discountStr.includes('%')) {
          const percent = parseInt(discountStr.replace(/[^0-9]/g, ''));
          discount = (total * percent) / 100;
        } else {
          discount = parseInt(discountStr.replace(/[^0-9]/g, ''));
        }
        
        setDiscountAmount(discount);
        setCouponCode("");
      }
    } catch (err) {
      setCouponError(err.response?.data?.error || "Invalid coupon code");
    } finally {
      setIsVerifying(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (order && !loading) {
      setLoading(true);
      try {
        const finalAmount = parseFloat(order.total_price) - discountAmount;
        const paymentData = {
          order_id: order.id,
          amount: finalAmount,
          payment_method: paymentMethod,
          coupon_code: appliedCoupon?.code
        };
        
        await paymentService.processPayment(paymentData);
        
        // Refresh orders context to reflect "Order placed" status
        await fetchOrders();
        setIsSuccess(true);
      } catch (error) {
        console.error("Payment Error:", error);
        alert("Payment failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  if (!order) return null;

  if (isSuccess) {
    return (
      <div className="min-h-screen  bg-gradient-to-br from-gray-50 to-orange-50 flex flex-col font-sans">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6 mt-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full text-center relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
            
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-3">
              Payment Successful!
            </h1>
            
            <p className="text-gray-600 font-medium mb-6">
              Your order has been placed.
            </p>

            <div className="bg-orange-50/50 rounded-2xl p-6 mb-10 border border-orange-100/50">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-orange-500 fill-current" /> Rate Your Experience
              </h3>
              <div className="space-y-3">
                 {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                       <span className="font-bold text-gray-700 text-sm">Review {item.product_details?.name || "Premium Dish"}?</span>
                       <button 
                          onClick={() => openReviewModal(item.product_details)}
                          className="px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          Rate Now
                       </button>
                    </div>
                 ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate("/orders")}
                className="w-full sm:w-auto px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                <PackageSearch className="w-5 h-5" /> View Orders
              </button>
              
              <button 
                onClick={() => navigate("/home")}
                className="w-full sm:w-auto px-8 py-3.5 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                <Home className="w-5 h-5" /> Back to Home
              </button>
            </div>
          </motion.div>
        </main>
        
        <AnimatePresence>
            {isReviewModalOpen && (
                <ReviewModal 
                    isOpen={isReviewModalOpen} 
                    onClose={() => setIsReviewModalOpen(false)} 
                    product={selectedProduct}
                />
            )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-10 mt-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-gray-800 tracking-tight mb-8 border-b border-gray-200 pb-4">
            Payment <span className="text-orange-500">Details</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Column - Payment Methods & Address Summary */}
            <div className="space-y-8">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Delivery To
                </h3>
                
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                  <p className="font-bold text-gray-800 text-lg">{order.full_name || "Valued Customer"}</p>
                  <p className="text-gray-600 font-medium mt-1">{order.address || "Address not provided"}</p>
                  <p className="text-gray-600 font-medium">{order.city || ""}</p>
                  <p className="text-gray-800 font-bold mt-3 text-sm">📞 {order.phone || "No phone provided"}</p>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                  <Wallet className="w-5 h-5 text-orange-500" />
                  Payment <span className="text-orange-500">Method</span>
                </h3>
                
                <div className="space-y-4">
                  {/* COD */}
                  <label className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "COD" ? "border-orange-500 bg-orange-50" : "border-gray-100 hover:border-gray-200"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                          <Banknote className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-base">Cash on Delivery</h4>
                          <p className="text-xs text-gray-500">Pay comfortably at doorstep</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "COD" ? "border-orange-500 bg-orange-500" : "border-gray-300"}`}>
                        {paymentMethod === "COD" && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                    <input type="radio" name="payment" value="COD" checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="h-full relative">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-orange-100 sticky top-28">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                  <ReceiptText className="w-5 h-5 text-orange-500" /> Order Info
                </h3>
                
                <div className="space-y-4 mb-6 pt-2 max-h-56 overflow-y-auto pr-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm md:text-base group">
                      <span className="text-gray-700 font-medium flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-gray-50 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                          {item.quantity}
                        </span>
                        × {item.product_details?.name}
                      </span>
                      <span className="text-gray-800 font-bold whitespace-nowrap">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4 mb-4 pt-6 border-t border-gray-100">
                  {/* Coupon Section */}
                  {!appliedCoupon ? (
                    <div className="space-y-2">
                       <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Apply Promo Code</p>
                       <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                              type="text" 
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              placeholder="e.g. WEEK50" 
                              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                            />
                          </div>
                          <button 
                            onClick={handleApplyCoupon}
                            disabled={isVerifying || !couponCode}
                            className="px-4 py-2 bg-orange-100 text-orange-600 font-bold rounded-xl text-sm hover:bg-orange-200 disabled:opacity-50 transition-colors"
                          >
                            {isVerifying ? "..." : "Apply"}
                          </button>
                       </div>
                       {couponError && <p className="text-[10px] text-red-500 font-bold ml-1">{couponError}</p>}
                    </div>
                  ) : (
                    <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                             <Ticket className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-green-600 uppercase tracking-tighter">Applied Coupon</p>
                             <p className="text-sm font-bold text-gray-800">{appliedCoupon.code}</p>
                          </div>
                       </div>
                       <button onClick={removeCoupon} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                          <X className="w-4 h-4" />
                       </button>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600 font-medium pt-2">
                    <span>Total Bill</span>
                    <span className="font-bold text-gray-800">₹{order.total_price}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-black animate-in fade-in slide-in-from-top-1">
                      <span>Order Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-900 font-black text-xl pt-2 border-t border-gray-100">
                    <span>Payable Amount</span>
                    <span className="text-orange-600">₹{parseFloat(order.total_price) - discountAmount}</span>
                  </div>
                </div>
                
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className={`w-full py-4 ${loading ? 'bg-orange-300' : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'} text-white font-black text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2`}
                >
                  {loading ? 'Processing...' : 'Confirm Payment'} <ShieldCheck className="w-5 h-5" />
                </button>
                
                <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
                  <ShieldCheck className="w-4 h-4" />
                  <p className="text-xs font-medium">
                    Payments are 100% secure and encrypted.
                  </p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
