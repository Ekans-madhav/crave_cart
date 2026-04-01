import React from 'react';
import { motion } from 'framer-motion';

const DeleteOrderModal = React.forwardRef(({ isOpen, onClose, onConfirm }, ref) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h3 className="mb-2 text-xl font-bold text-gray-800">Delete Order?</h3>
        <p className="mb-6 text-gray-600 font-medium">
          Are you sure you want to remove this order from your history?
        </p>
        
        <div className="flex justify-end gap-3 font-semibold">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-6 py-2.5 text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-500 px-6 py-2.5 text-white shadow-md transition-all hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Delete Order
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
});

export default DeleteOrderModal;
