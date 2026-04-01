import { useState } from "react";
import { useCart } from "../../context/user/CartContext";
import Header from "../../components/user/Header";
import { PackageOpen } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import OrderCard from "../../components/user/orders/OrderCard";
import DeleteOrderModal from "../../components/user/orders/DeleteOrderModal";
import EmptyOrders from "../../components/user/orders/EmptyOrders";
import ReviewModal from "../../components/user/ReviewModal";

export default function OrderHistory() {
  const { orders, removeOrder } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  
  // Review Modal States
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleRate = (product) => {
    setSelectedProduct(product);
    setIsReviewOpen(true);
  };

  const handleDeletePrompt = (orderId) => {
    setOrderToDelete(orderId);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      removeOrder(orderToDelete);
    }
    setModalOpen(false);
    setOrderToDelete(null);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen  bg-gradient-to-br from-gray-50 to-orange-50 py-10 mt-16 px-6 sm:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-4">
            <PackageOpen className="w-8 h-8 text-orange-500" />
            <h2 className="text-3xl font-black text-gray-800 tracking-tight">
              My <span className="text-orange-500">Orders</span>
            </h2>
          </div>

          <AnimatePresence mode="popLayout">
            {orders.length === 0 ? (
              <EmptyOrders key="empty-orders-state" />
            ) : (
              <div className="space-y-8" key="order-list">
                <AnimatePresence>
                  {orders.map((order) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onDeletePrompt={handleDeletePrompt} 
                      onRate={handleRate}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <DeleteOrderModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={confirmDelete}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReviewOpen && (
          <ReviewModal 
            isOpen={isReviewOpen} 
            onClose={() => setIsReviewOpen(false)} 
            product={selectedProduct} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
