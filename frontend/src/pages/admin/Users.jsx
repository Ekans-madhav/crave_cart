import React, { useState, useEffect } from "react";
import { Search, UserX, UserCheck, Shield, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getUsers } from "../../services/userService";


const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setIsLoading(true);
    getUsers()
      .then((res) => {
        setUsers(Array.isArray(res.data) ? res.data : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Users Error:", err);
        setIsLoading(false);
      });
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user? (Backend API required)")) {
       console.log("Delete not implemented in backend yet for ID:", id);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage your {users.length} registered customers
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-shadow"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-100 to-red-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md">
                        {user.full_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{user.full_name}</h3>
                        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${user.is_admin ? "text-purple-600 bg-purple-50" : "text-emerald-600 bg-emerald-50"}`}>
                          <UserCheck className="w-3 h-3 mr-1" /> {user.is_admin ? "Admin" : "Customer"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <UserX className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Last Login: {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 border-dashed">
                <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium">No users found</p>
                <p className="text-sm">Try empty your search filter.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
};

export default Users;
