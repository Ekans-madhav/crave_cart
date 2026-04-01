import { useState } from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { subscribeNewsletter } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Check, Crown, CreditCard, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Membership() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      await subscribeNewsletter();
      navigate("/");
    } catch (err) {
      console.error("Subscription error:", err);
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "Unlock Today's Best Offers & Coupons",
    "Early access to new menu items",
    "Exclusive discounts on premium dishes",
    "Free delivery on orders above ₹500",
    "Priority customer support"
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-24 px-6">
        <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-[2.5rem] shadow-2xl overflow-hidden bg-white border border-orange-100">
          
          {/* Left Side: Benefits */}
          <div className="p-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Crown className="w-48 h-48 rotate-12" />
             </div>
             
             <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs uppercase tracking-widest mb-6">
                  <Zap className="w-3 h-3" /> Premium Membership
                </div>
                
                <h1 className="text-4xl font-black mb-6 leading-tight">
                  Unlock <br />
                  <span className="text-orange-500 text-5xl">CraveCart VIP</span>
                </h1>
                
                <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                  Join our exclusive circle of food lovers and enjoy premium perks on every order you place.
                </p>
                
                <ul className="space-y-4">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 bg-orange-500 rounded-full p-0.5">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-300 font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
             </div>
          </div>

          {/* Right Side: Payment Info */}
          <div className="p-12 flex flex-col justify-center">
            <div className="text-center mb-10">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Monthly Plan</span>
                <div className="flex items-baseline justify-center gap-1 mt-2">
                    <span className="text-5xl font-black text-gray-900">₹299</span>
                    <span className="text-gray-400 font-bold">/ Month</span>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center gap-4 group hover:border-orange-200 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-black text-gray-800 uppercase tracking-tight">Secured Payment</p>
                        <p className="text-xs text-gray-500">Pay safely with UPI, Cards, or Wallet</p>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                </div>

                <div className="pt-4">
                    <button 
                        onClick={handleSubscribe}
                        disabled={loading}
                        className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3
                            ${loading 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                : "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-orange-500/40 hover:-translate-y-1"
                            }`}
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
                        ) : (
                            <>Subscribe Now & Save</>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em] font-bold">
                        100% Risk Free • Cancel Anytime
                    </p>
                </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
