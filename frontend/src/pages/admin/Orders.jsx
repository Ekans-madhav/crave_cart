import React, { useState } from "react";
import { useCart } from "../../context/user/CartContext";
import { Search, Filter, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const { orders, updateOrderStatus, removeOrder } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.full_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-orange-100 text-orange-600 border-orange-200";
      case "Order placed": return "bg-blue-100 text-blue-600 border-blue-200";
      case "Accepted": return "bg-sky-100 text-sky-600 border-sky-200";
      case "Preparing": return "bg-purple-100 text-purple-600 border-purple-200";
      case "Out for delivery": return "bg-indigo-100 text-indigo-600 border-indigo-200";
      case "Delivered": return "bg-green-100 text-green-600 border-green-200";
      case "Cancelled": return "bg-red-100 text-red-600 border-red-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const handleStatusChangeAction = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert(`Status updated to ${newStatus} for Order #${orderId}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Orders Management</h2>
          <p className="text-gray-500 text-sm mt-1">Manage all user orders here.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none appearance-none bg-white font-medium text-gray-700 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Order placed">Order placed</option>
              <option value="Accepted">Accepted</option>
              <option value="Preparing">Preparing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="py-4 px-6 font-medium">Order Details</th>
                <th className="py-4 px-6 font-medium">Customer</th>
                <th className="py-4 px-6 font-medium">Items</th>
                <th className="py-4 px-6 font-medium">Amount</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order, i) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-gray-50 hover:bg-orange-50/30 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-800">#{order.id}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(order.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-800">
                          {order.full_name || "Guest"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {order.phone}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600 max-w-[200px] truncate" title={order.items?.map(item => `${item.quantity}x ${item.product_details?.name}`).join(', ')}>
                          {order.items?.length || 0} items <br />
                          <span className="text-xs text-gray-400">
                            {order.items?.map(item => item.product_details?.name).join(', ').substring(0, 30)}...
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-800">₹{order.total_price}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-xs border font-bold rounded-full inline-block ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <select
                             value={order.status}
                             onChange={(e) => handleStatusChangeAction(order.id, e.target.value)}
                             className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                          >
                             <option value="Pending">Pending</option>
                             <option value="Order placed">Order placed</option>
                             <option value="Accepted">Accepted</option>
                             <option value="Preparing">Preparing</option>
                             <option value="Out for delivery">Out for delivery</option>
                             <option value="Delivered">Delivered</option>
                             <option value="Cancelled">Cancelled</option>
                          </select>
                          <button 
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to delete Order #${order.id}?`)) {
                                try {
                                  await removeOrder(order.id);
                                  alert("Order deleted successfully.");
                                } catch (err) {
                                  alert("Failed to delete order.");
                                }
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-500">
                      <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <p>No orders found matching your search.</p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
