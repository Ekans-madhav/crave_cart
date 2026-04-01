import React, { useState, useEffect } from "react";
import * as blogService from "../../services/blogService";
import { 
  Plus, Edit, Trash2, Image as ImageIcon, Video, 
  Search, Filter, ChevronRight, CheckCircle2, XCircle,
  Newspaper, Flame, ChefHat, Utensils, Map, HeartPulse,
  Layout, Camera
} from "lucide-react";

export default function ManageBlog() {
  const [activeTab, setActiveTab] = useState("posts");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "hero", name: "Blog Hero", icon: Layout },
    { id: "posts", name: "Main Posts", icon: Newspaper },
    { id: "trending", name: "Trending", icon: Flame },
    { id: "gallery", name: "Gallery", icon: Camera },
    { id: "tips", name: "Chef Tips", icon: ChefHat },
    { id: "culture", name: "Culture", icon: Utensils },
    { id: "guides", name: "Guides", icon: Map },
    { id: "healthy", name: "Healthy", icon: HeartPulse },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      switch (activeTab) {
        case "hero": res = await blogService.getBlogHeroes(); break;
        case "posts": res = await blogService.getBlogPosts(); break;
        case "trending": res = await blogService.getTrendingStories(); break;
        case "gallery": res = await blogService.getFoodGallery(); break;
        case "tips": res = await blogService.getChefTips(); break;
        case "culture": res = await blogService.getFoodCulture(); break;
        case "guides": res = await blogService.getStreetGuides(); break;
        case "healthy": res = await blogService.getHealthyEating(); break;
        default: break;
      }
      const resContent = Array.isArray(res.data) ? res.data : (res.data.results || res.data.value || []);
      setData(resContent);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      // Only append if it's not null/undefined
      if (formData[key] !== null && formData[key] !== undefined) {
        // For image/media_file, only append if they are actual File objects (not URL strings)
        if ((key === 'image' || key === 'media_file') && typeof formData[key] === 'string') {
          return;
        }
        submitData.append(key, formData[key]);
      }
    });

    try {
      if (editingItem) {
        switch (activeTab) {
          case "hero": await blogService.updateBlogHero(editingItem.id, submitData); break;
          case "posts": await blogService.updateBlogPost(editingItem.id, submitData); break;
          case "trending": await blogService.updateTrendingStory(editingItem.id, submitData); break;
          case "gallery": await blogService.updateGalleryItem(editingItem.id, submitData); break;
          case "tips": await blogService.updateChefTip(editingItem.id, submitData); break;
          case "culture": await blogService.updateFoodCulture(editingItem.id, submitData); break;
          case "guides": await blogService.updateStreetGuide(editingItem.id, submitData); break;
          case "healthy": await blogService.updateHealthyEating(editingItem.id, submitData); break;
          default: break;
        }
      } else {
        switch (activeTab) {
          case "hero": await blogService.createBlogHero(submitData); break;
          case "posts": await blogService.createBlogPost(submitData); break;
          case "trending": await blogService.createTrendingStory(submitData); break;
          case "gallery": await blogService.createGalleryItem(submitData); break;
          case "tips": await blogService.createChefTip(submitData); break;
          case "culture": await blogService.createFoodCulture(submitData); break;
          case "guides": await blogService.createStreetGuide(submitData); break;
          case "healthy": await blogService.createHealthyEating(submitData); break;
          default: break;
        }
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({});
      fetchData();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      switch (activeTab) {
        case "hero": await blogService.deleteBlogHero(id); break;
        case "posts": await blogService.deleteBlogPost(id); break;
        case "trending": await blogService.deleteTrendingStory(id); break;
        case "gallery": await blogService.deleteGalleryItem(id); break;
        case "tips": await blogService.deleteChefTip(id); break;
        case "culture": await blogService.deleteFoodCulture(id); break;
        case "guides": await blogService.deleteStreetGuide(id); break;
        case "healthy": await blogService.deleteHealthyEating(id); break;
        default: break;
      }
      fetchData();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const openForm = (item = null) => {
    setEditingItem(item);
    setFormData(item ? { ...item, image: null, media_file: null } : { is_active: true });
    setShowModal(true);
  };

  const filteredData = data.filter(item => 
    (item.title || item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Blog Management</h1>
          <p className="text-gray-500 font-medium">Create and manage your blog content across all sections</p>
        </div>
        <button 
          onClick={() => openForm()}
          className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add New {tabs.find(t => t.id === activeTab).name}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold whitespace-nowrap transition-all border-2 ${
              activeTab === tab.id 
                ? "bg-white border-orange-600 text-orange-600 shadow-sm translate-y-[-2px]" 
                : "bg-white border-transparent text-gray-500 hover:border-gray-200"
            }`}
          >
            <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-orange-600" : "text-gray-400"}`} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder={`Search in ${tabs.find(t => t.id === activeTab).name}...`}
          className="bg-transparent border-none outline-none w-full font-medium text-gray-700"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold text-xl mb-4">No content found in this section</p>
          <button onClick={() => openForm()} className="text-orange-600 font-black hover:underline underline-offset-4">
            Create your first {tabs.find(t => t.id === activeTab).name} now →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
              <div className="relative h-48 bg-gray-100">
                {item.image || item.media_file ? (
                  <img src={item.image || item.media_file} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openForm(item)} className="bg-white p-2 rounded-lg text-blue-600 shadow-lg hover:bg-blue-50">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="bg-white p-2 rounded-lg text-red-600 shadow-lg hover:bg-red-50">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  {item.is_active ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <XCircle className="w-3 h-3" /> Inactive
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-black text-gray-900 mb-2 line-clamp-1">{item.title || item.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px] mb-4">
                  {item.description || item.subtitle || item.preview || item.content || "No description available."}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{activeTab}</span>
                  <span className="text-xs text-gray-400 font-medium">{new Date(item.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto pt-20">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-10 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400">
              <ChevronRight className="w-6 h-6 rotate-90" />
            </button>
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
              {editingItem ? "Edit Item" : `Add New ${tabs.find(t => t.id === activeTab).name}`}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-black text-gray-700 mb-2">Title / Name</label>
                  <input 
                    type="text" name="title" value={formData.title || ""} onChange={handleInputChange}
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500" required
                    placeholder="Enter heading title..."
                  />
                </div>

                {activeTab === "hero" && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-black text-gray-700 mb-2">Sub-Head (Optional)</label>
                      <input 
                        type="text" name="subtitle" value={formData.subtitle || ""} onChange={handleInputChange}
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500"
                        placeholder="e.g. Discover delicious recipes..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">Media File (Video/GIF)</label>
                      <input type="file" name="media_file" onChange={handleFileChange} className="w-full" />
                    </div>
                  </>
                )}

                {["posts", "trending", "tips", "culture", "guides", "healthy"].includes(activeTab) && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-black text-gray-700 mb-2">Subtitle / Preview Text</label>
                    <textarea 
                      name={activeTab === "posts" ? "description" : activeTab === "trending" ? "preview" : "subtitle"} 
                      value={formData.description || formData.subtitle || formData.preview || ""} 
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500 h-24"
                    />
                  </div>
                )}

                {["posts", "trending", "tips", "culture", "guides", "healthy"].includes(activeTab) && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-black text-gray-700 mb-2">Detailed Content</label>
                    <textarea 
                      name={activeTab === "posts" || activeTab === "trending" ? "detail" : "content"} 
                      value={formData.detail || formData.content || ""} 
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500 h-40"
                      required
                    />
                  </div>
                )}

                {activeTab === "posts" && (
                  <>
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">Category Label</label>
                      <input type="text" name="category" value={formData.category || ""} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500" required />
                    </div>
                    <div>
                      <label className="block text-sm font-black text-gray-700 mb-2">Display Date</label>
                      <input type="text" name="date" value={formData.date || ""} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500" placeholder="e.g. Oct 12, 2023" required />
                    </div>
                  </>
                )}

                {activeTab === "gallery" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-black text-gray-700 mb-2">Caption (Optional)</label>
                    <input type="text" name="caption" value={formData.caption || ""} onChange={handleInputChange} className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500" />
                  </div>
                )}

                {activeTab !== "hero" && (
                  <div>
                    <label className="block text-sm font-black text-gray-700 mb-2">Featured Image</label>
                    <input type="file" name="image" onChange={handleFileChange} className="w-full text-xs" required={!editingItem} />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" name="is_active" checked={formData.is_active || false} onChange={handleInputChange}
                    className="w-6 h-6 rounded accent-orange-600"
                  />
                  <label className="text-sm font-black text-gray-700">Display this content publicly?</label>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex gap-4">
                <button 
                  type="submit" 
                  className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  {editingItem ? "Update Changes" : "Create Asset"}
                </button>
                <button 
                  type="button" onClick={() => setShowModal(false)}
                  className="px-8 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-4 rounded-2xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
