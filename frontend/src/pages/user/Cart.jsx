import { useCart } from "../../context/user/CartContext";
import Header from "../../components/user/Header";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import EmptyCart from "../../components/user/cart/EmptyCart";
import CartItemCard from "../../components/user/cart/CartItemCard";
import CartSummary from "../../components/user/cart/CartSummary";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartCount } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const deliveryCharge = 40;
  const total = subtotal + deliveryCharge;
  const itemCount = getCartCount();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/order");
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-10 mt-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 border-b border-gray-200 pb-4 flex items-center gap-3">
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">
              My<span className="text-orange-500">Card</span>
            </h2>
            {itemCount > 0 && (
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                {itemCount} items
              </span>
            )}
          </div>

          <AnimatePresence mode="wait">
            {cartItems.length === 0 ? (
              <EmptyCart key="empty-cart" />
            ) : (
              <div key="cart-content" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left side: Cart Items */}
                <div className="lg:col-span-8 flex flex-col gap-5">
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <CartItemCard
                        key={`${item.id}-${index}`}
                        item={item}
                        index={index}
                        onRemove={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Right side: Summary */}
                <div className="lg:col-span-4 h-full relative">
                  <CartSummary
                    subtotal={subtotal}
                    deliveryCharge={deliveryCharge}
                    total={total}
                    itemCount={itemCount}
                    onCheckout={handleCheckout}
                  />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
