import React, { useState, useEffect } from "react";
import { getTodayOffers, createTodayOffer, updateTodayOffer, deleteTodayOffer } from "../../services/todayOfferService";
import { Gift, Plus, Trash2, Edit2, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ManageOffer = () => {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    coupon_code: "",
    is_active: true
  });

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const res = await getTodayOffers();
      // Handle potential API response structure (array or individual object)
      const data = Array.isArray(res.data) ? res.data : (res.data.results || res.data.value || (res.data ? [res.data] : []));
      setOffers(data);
    } catch (err) {
      console.error("Load Offers Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discount: "",
      coupon_code: "",
      is_active: true
    });
    setEditingOffer(null);
  };

  const handleOpenModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        title: offer.title,
        description: offer.description,
        discount: offer.discount || "",
        coupon_code: offer.coupon_code || "",
        is_active: offer.is_active
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await updateTodayOffer(editingOffer.id, formData);
      } else {
        await createTodayOffer(formData);
      }
      setIsModalOpen(false);
      loadOffers();
    } catch (err) {
      console.error("Save Offer Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await deleteTodayOffer(id);
        loadOffers();
      } catch (err) {
        console.error("Delete Error:", err);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Today's Best Offers</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage seasonal promotions and coupon codes</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-200 hover:scale-105 transition-all"
          >
            <Plus size={20} /> Create New Offer
          </button>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="py-32 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.length > 0 ? (
              offers.map((offer) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={offer.id} 
                  className={`bg-white rounded-3xl p-6 shadow-sm border-2 transition-all relative group ${offer.is_active ? 'border-orange-50' : 'border-gray-50 opactiy-75 grayscale'}`}
                >
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(offer)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(offer.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
                    <Gift className="text-orange-600 w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 pr-16 leading-tight">{offer.title}</h3>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{offer.description}</p>
                  
                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-black text-orange-600">{offer.discount}</p>
                      <div className="mt-1 px-3 py-1 bg-gray-100 rounded-lg text-xs font-mono font-bold text-gray-600 border border-gray-200">
                        CODE: {offer.coupon_code}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-xs font-bold uppercase tracking-tighter ${offer.is_active ? 'text-green-500' : 'text-gray-400'}`}>
                       {offer.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                       {offer.is_active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
                <div className="col-span-full py-24 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                    <Gift size={48} className="text-gray-200 mx-auto mb-4" />
                    <h3 className="text-gray-500 font-bold text-xl">No active promotions</h3>
                    <p className="text-gray-400 mt-1">Start by creating your first membership-exclusive deal</p>
                </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setIsModalOpen(false)}
                 className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
               ></motion.div>

               <motion.div 
                 initial={{ scale: 0.9, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.9, opacity: 0, y: 20 }}
                 className="bg-white rounded-[40px] w-full max-w-lg p-8 shadow-2xl relative z-20"
               >
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black text-gray-900">{editingOffer ? 'Edit Offer' : 'Create Offer'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <XCircle className="text-gray-400" />
                    </button>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-2">Offer Title</label>
                        <input 
                            required
                            type="text" 
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-orange-500/10 font-bold"
                            placeholder="e.g., Weekend Bonanza"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-2">Description</label>
                        <textarea 
                            id="offer-description"
                            rows="3"
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-orange-500/10 font-medium"
                            placeholder="Briefly describe the offer..."
                            value={formData.description || ""}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-2">Discount Text</label>
                            <input 
                                required
                                type="text"
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-orange-500/10 font-black text-orange-600"
                                placeholder="e.g., 50% OFF"
                                value={formData.discount}
                                onChange={(e) => setFormData({...formData, discount: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-black text-gray-700 uppercase tracking-widest mb-2">Coupon Code</label>
                            <input 
                                required
                                type="text"
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 focus:ring-4 focus:ring-orange-500/10 font-mono font-bold"
                                placeholder="e.g., WINTER50"
                                value={formData.coupon_code}
                                onChange={(e) => setFormData({...formData, coupon_code: e.target.value.toUpperCase()})}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                        <input 
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                            className="w-6 h-6 rounded-lg border-none text-orange-500 focus:ring-offset-0 focus:ring-orange-500/20"
                        />
                        <span className="font-bold text-gray-700">Display this offer live?</span>
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-xl font-black rounded-3xl shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(249,115,22,0.5)] active:scale-[0.98] transition-all"
                    >
                        {editingOffer ? 'Commit Changes' : 'Create & Publish'}
                    </button>
                 </form>
               </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageOffer;
