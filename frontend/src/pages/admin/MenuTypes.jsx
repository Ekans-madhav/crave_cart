import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, X, Loader2, Tag, ArrowUpDown, Grid, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    getMenuTypes, createMenuType, updateMenuType, deleteMenuType,
    getSortOptions, createSortOption, updateSortOption, deleteSortOption,
    getCategories, createCategory, updateCategory, deleteCategory 
} from "../../services/categoryService";
import { getImageUrl } from "../../services/api";

const MenuTypes = () => {
    const [activeTab, setActiveTab] = useState("categories"); // "categories", "types", or "sort"
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: "", // for menu types & categories
        label: "", // for sort options
        value: "", // for sort options
        image: null, // for categories
    });
    const [imagePreview, setImagePreview] = useState("");

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = () => {
        setIsLoading(true);
        let fetchFunc;
        switch(activeTab) {
            case "categories": fetchFunc = getCategories; break;
            case "types": fetchFunc = getMenuTypes; break;
            case "sort": fetchFunc = getSortOptions; break;
            default: fetchFunc = getCategories;
        }

        fetchFunc()
            .then(res => {
                const list = Array.isArray(res.data) ? res.data : (res.data.results || res.data.value || []);
                setData(list);
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
            if (activeTab === "categories") {
                setFormData({ name: item.name, image: null });
                setImagePreview(getImageUrl(item.image));
            } else if (activeTab === "types") {
                setFormData({ name: item.name });
            } else {
                setFormData({ label: item.label, value: item.value });
            }
        } else {
            setEditingItem(null);
            setFormData({ name: "", label: "", value: "", image: null });
            setImagePreview("");
        }
        setIsModalOpen(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleDelete = async (id) => {
        const msg = activeTab === "categories" ? "category" : activeTab === "types" ? "menu type" : "sort option";
        if (window.confirm(`Are you sure you want to delete this ${msg}?`)) {
            try {
                if (activeTab === "categories") await deleteCategory(id);
                else if (activeTab === "types") await deleteMenuType(id);
                else await deleteSortOption(id);
                loadData();
            } catch (err) {
                console.error("Delete Error:", err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (activeTab === "categories") {
                const categoryData = new FormData();
                categoryData.append("name", formData.name);
                if (formData.image) categoryData.append("image", formData.image);
                
                if (editingItem) await updateCategory(editingItem.id, categoryData);
                else await createCategory(categoryData);
            } else if (activeTab === "types") {
                if (editingItem) await updateMenuType(editingItem.id, { name: formData.name });
                else await createMenuType({ name: formData.name });
            } else {
                if (editingItem) await updateSortOption(editingItem.id, { label: formData.label, value: formData.value });
                else await createSortOption({ label: formData.label, value: formData.value });
            }
            setIsModalOpen(false);
            loadData();
        } catch (err) {
            console.error("CRUD Error:", err);
            alert("Error saving. Please check your data.");
        }
    };

    const filteredData = data.filter(item => {
        const search = searchTerm.toLowerCase();
        if (activeTab === "categories" || activeTab === "types") {
            return item.name?.toLowerCase().includes(search);
        }
        return item.label?.toLowerCase().includes(search) || item.value?.toLowerCase().includes(search);
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Classifications</h2>
                    <p className="text-gray-500 text-sm mt-1">Manage Categories, Menu Types and Sorting</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner scrollbar-hide overflow-x-auto max-w-full">
                    <button 
                        onClick={() => setActiveTab("categories")}
                        className={`px-4 lg:px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'categories' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Grid className="w-4 h-4" /> Categories
                    </button>
                    <button 
                        onClick={() => setActiveTab("types")}
                        className={`px-4 lg:px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'types' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Tag className="w-4 h-4" /> Menu Types
                    </button>
                    <button 
                        onClick={() => setActiveTab("sort")}
                        className={`px-4 lg:px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'sort' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <ArrowUpDown className="w-4 h-4" /> Sorting
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="relative flex-1 md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder={`Search ${activeTab === 'categories' ? 'categories' : activeTab === 'types' ? 'types' : 'sort options'}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
                    />
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center shadow-md transition-transform active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add {activeTab === "categories" ? "Category" : activeTab === "types" ? "Type" : "Option"}
                </button>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredData.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.03 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all"
                            >
                                {activeTab === "categories" ? (
                                    <div className="relative h-40 bg-gray-50">
                                        {item.image ? (
                                            <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-12 h-12 text-gray-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button onClick={() => handleOpenModal(item)} className="bg-white p-2 rounded-full text-blue-600 hover:scale-110 transition-transform">
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="bg-white p-2 rounded-full text-red-600 hover:scale-110 transition-transform">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-0 inset-x-0 p-3 bg-white/90 backdrop-blur-sm">
                                            <h3 className="font-bold text-gray-800 text-center truncate">{item.name}</h3>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 flex flex-col items-center justify-between h-full">
                                        <div className="text-center mb-4 w-full">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto ${
                                                activeTab === "types" 
                                                    ? (item.name === 'VEG' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')
                                                    : 'bg-orange-100 text-orange-600'
                                            }`}>
                                                {activeTab === "types" ? (
                                                    <div className={`w-3 h-3 rounded-full border-2 ${item.name === 'VEG' ? 'border-green-600' : 'border-red-600'}`} />
                                                ) : (
                                                    <ArrowUpDown className="w-6 h-6" />
                                                )}
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-lg truncate">{activeTab === "types" ? item.name : item.label}</h3>
                                            {activeTab === "sort" && <span className="text-xs text-gray-400 block mt-1">{item.value}</span>}
                                        </div>
                                        <div className="flex gap-2 w-full pt-4 border-t border-gray-50">
                                            <button onClick={() => handleOpenModal(item)} className="flex-1 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors text-xs font-bold">Edit</button>
                                            <button onClick={() => handleDelete(item.id)} className="flex-1 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors text-xs font-bold">Delete</button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold text-gray-800">{editingItem ? "Edit" : "Add New"} {activeTab.slice(0, -1)}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-2"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {activeTab === "categories" ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                        <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                        {imagePreview ? (
                                            <div className="relative h-32 rounded-xl overflow-hidden mb-2">
                                                <img src={imagePreview} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => { setImagePreview(""); setFormData({...formData, image: null}) }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><X className="w-3 h-3"/></button>
                                            </div>
                                        ) : (
                                            <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                                <ImageIcon className="w-8 h-8 text-gray-400" />
                                                <input type="file" className="hidden" onChange={handleImageChange} />
                                            </label>
                                        )}
                                    </div>
                                </>
                            ) : activeTab === "types" ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Type</label>
                                    <select 
                                        required 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                                    >
                                        <option value="">Select a type...</option>
                                        <option value="VEG">Veg</option>
                                        <option value="NONVEG">Non-Veg</option>
                                    </select>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                                        <input type="text" required value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Value Key</label>
                                        <input type="text" required value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value.toLowerCase().replace(/ /g, '-') })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                                    </div>
                                </>
                            )}
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl text-gray-500 font-bold hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600">Save</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default MenuTypes;

