import React, { useState, useEffect } from "react";
import { getHeadlines, createHeadline, deleteHeadline } from "../../services/headlineService";
import { Bell, Plus, Trash2, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

const Headlines = () => {
    const [headlines, setHeadlines] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newHeadline, setNewHeadline] = useState("");

    useEffect(() => {
        loadHeadlines();
    }, []);

    const loadHeadlines = async () => {
        setIsLoading(true);
        try {
            const res = await getHeadlines();
            setHeadlines(res.data);
        } catch (err) {
            console.error("Load Headlines Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newHeadline.trim()) return;
        try {
            await createHeadline({ title: newHeadline });
            setNewHeadline("");
            loadHeadlines();
        } catch (err) {
            console.error("Create Error:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this headline?")) return;
        try {
            await deleteHeadline(id);
            loadHeadlines();
        } catch (err) {
            console.error("Delete Error:", err);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-8 flex items-center justify-between">
                <div>
                   <h1 className="text-3xl font-bold text-gray-900">Headlines Panel</h1>
                   <p className="text-gray-500 mt-1">Manage top bar announcements and notifications</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-2xl">
                    <Megaphone className="text-orange-600 w-8 h-8" />
                </div>
            </div>

            {/* Create Section */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Plus size={20} className="text-orange-500" />
                    New Announcement
                </h3>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newHeadline}
                        onChange={(e) => setNewHeadline(e.target.value)}
                        placeholder="Enter announcement text (e.g., Get 50% OFF on your first order!)"
                        className="flex-1 px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500/20 text-gray-700"
                    />
                    <button
                        onClick={handleCreate}
                        disabled={!newHeadline.trim()}
                        className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                        Publish
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-3 font-medium">
                    * Note: Adding a new headline will automatically replace the existing one.
                </p>
            </div>

            {/* List Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 px-2">Active Headlines</h2>
                
                {isLoading ? (
                    <div className="py-20 flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                    </div>
                ) : headlines.length > 0 ? (
                    <div className="grid gap-4">
                        {headlines.map((headline) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={headline.id} 
                                className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-orange-200 transition-all"
                            >
                                <div className="flex-1 pr-4">
                                    <div className="flex items-start gap-3">
                                        <div className="bg-orange-50 p-2 rounded-xl text-orange-500 mt-1">
                                            <Bell size={18} />
                                        </div>
                                        <div>
                                            <p className="text-gray-800 font-semibold text-lg">{headline.title}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Posted on {new Date(headline.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleDelete(headline.id)}
                                        className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <Megaphone size={40} className="text-gray-200 mx-auto mb-3" />
                        <h3 className="text-gray-500 font-medium">No active announcements</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Headlines;
