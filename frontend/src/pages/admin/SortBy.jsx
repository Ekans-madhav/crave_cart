import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, X, Loader2, ArrowUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getSortOptions, createSortOption, updateSortOption, deleteSortOption } from "../../services/categoryService";

const SortBy = () => {
    const [sortOptions, setSortOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        label: "",
        value: "",
        is_active: true
    });

    useEffect(() => {
        loadSortOptions();
    }, []);

    const loadSortOptions = () => {
        setIsLoading(true);
        getSortOptions()
            .then(res => {
                setSortOptions(Array.isArray(res.data) ? res.data : []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setIsLoading(false);
            });
    };

    const handleOpenModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({ label: item.label, value: item.value, is_active: item.is_active });
        } else {
            setEditingItem(null);
            setFormData({ label: "", value: "", is_active: true });
        }
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this sort option?")) {
            try {
                await deleteSortOption(id);
                loadSortOptions();
            } catch (err) {
                console.error("Delete Error:", err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await updateSortOption(editingItem.id, formData);
            } else {
                await createSortOption(formData);
            }
            setIsModalOpen(false);
            loadSortOptions();
        } catch (err) {
            console.error("CRUD Error:", err);
            alert("Error managing sort option. Ensure value is unique.");
        }
    };

    const filteredOptions = sortOptions.filter(opt =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Sorting Management</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage public sorting criteria for your menu</p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center shadow-md transition-transform active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Sort Option
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search sort options..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredOptions.map((opt, index) => (
                            <motion.div
                                key={opt.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                                className={`bg-white rounded-2xl shadow-sm border ${opt.is_active ? 'border-gray-100' : 'border-red-200 grayscale'} p-6 flex flex-col items-center justify-between group hover:shadow-lg transition-all`}
                            >
                                <div className="text-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-3 mx-auto">
                                        <ArrowUpDown className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-lg">{opt.label}</h3>
                                    <code className="text-xs text-gray-400 block px-2 py-0.5 bg-gray-50 rounded mt-1">{opt.value}</code>
                                </div>
                                <div className="flex gap-2 w-full pt-4 border-t border-gray-50">
                                    <button onClick={() => handleOpenModal(opt)} className="flex-1 flex justify-center items-center py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(opt.id)} className="flex-1 flex justify-center items-center py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingItem ? "Edit Sort Option" : "Add New Sort Option"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Label (e.g. Price: Low to High)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Price: Low to High"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Key Value (e.g. price-low, rating)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="price-low"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Show to public</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-md transition-all active:scale-95"
                                >
                                    {editingItem ? "Update Option" : "Create Option"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default SortBy;
