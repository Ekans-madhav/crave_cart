import React, { useEffect, useState } from "react";
import { getContactMessages, deleteContactMessage } from "../../services/contactService";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Phone, Trash2, Calendar, MessageSquare, AlertCircle } from "lucide-react";

const ManageContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await getContactMessages();
      const messagesList = Array.isArray(res.data) ? res.data : (res.data.results || res.data.value || []);
      setMessages(messagesList);
    } catch (err) {
      console.error(err);
      setError("Failed to load messages. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
      try {
        await deleteContactMessage(id);
        setMessages(messages.filter(m => m.id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete the message.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Contact Messages</h2>
          <p className="text-sm text-gray-500">Manage and respond to customer inquiries</p>
        </div>
        <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest outline outline-1 outline-orange-200">
          {messages.length} Total Messages
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh] bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 border-4 border-gray-100 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400 font-medium">Fetching inquiries...</p>
        </div>
      ) : error ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center flex flex-col items-center">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <p className="text-gray-800 font-bold">{error}</p>
            <button onClick={fetchMessages} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-xl font-bold shadow-lg hover:shadow-orange-200 transition-all">Retry</button>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl border border-dashed border-gray-200 text-center flex flex-col items-center">
            <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">No Messages Yet</h3>
            <p className="text-gray-300">New customer inquiries will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Header */}
                <div className="p-6 pb-4 border-b border-gray-50 bg-gray-50 group-hover:bg-orange-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-500 border border-gray-100">
                      <User size={20} />
                    </div>
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 line-clamp-1">{msg.name}</h4>
                    <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5 mt-0.5">
                      <Mail size={12} className="text-orange-300" /> {msg.email}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 space-y-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Subject</p>
                    <p className="text-sm font-bold text-gray-700">{msg.subject}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Message</p>
                    <div className="p-4 bg-orange-50/30 rounded-2xl border border-orange-50/50">
                        <p className="text-sm text-gray-600 leading-relaxed italic line-clamp-6 hover:line-clamp-none cursor-help transition-all duration-500">
                            "{msg.message}"
                        </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                   <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                      <Calendar size={14} className="text-orange-300" /> 
                      {new Date(msg.created_at).toLocaleDateString()}
                   </div>
                   {msg.phone && (
                     <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                        <Phone size={14} className="text-orange-300" /> 
                        {msg.phone}
                     </div>
                   )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ManageContact;
