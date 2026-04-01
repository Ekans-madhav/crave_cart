import React, { useEffect, useState } from "react";
import { useCart } from "../../context/user/CartContext";
import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingBag, Utensils, DollarSign, MessageSquare } from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { getUsers } from "../../services/userService";
import { getContactMessages } from "../../services/contactService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { orders } = useCart();
  const [usersCount, setUsersCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers().then(res => {
        const users = Array.isArray(res.data) ? res.data : (res.data.results || res.data.value || []);
        setUsersCount(users.length);
    }).catch(err => console.log(err));

    // Fetch messages count
    getContactMessages().then(res => {
        const msgs = Array.isArray(res.data) ? res.data : (res.data.results || res.data.value || []);
        setMessagesCount(msgs.length);
    }).catch(err => console.log(err));
  }, []);

  // Calculate real values
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
  
  const totalItemsOrdered = orders.reduce((sum, order) => 
    sum + (order.items?.reduce((s, item) => s + (item.quantity || 0), 0) || 0), 0
  );

  // Chart Data: Last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayOrders = orders.filter(o => new Date(o.created_at).toDateString() === d.toDateString());
    const count = dayOrders.length;
    const revenue = dayOrders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0);
    return { name: dateStr, orders: count, revenue: revenue };
  });

  const stats = [
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6 text-indigo-500" />,
      bg: "bg-indigo-100",
      trend: "+12.5%",
      trendColor: "text-emerald-500",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingBag className="w-6 h-6 text-orange-500" />,
      bg: "bg-orange-100",
      trend: "+8.2%",
      trendColor: "text-emerald-500",
    },
    {
      title: "Customers",
      value: usersCount,
      icon: <Users className="w-6 h-6 text-blue-500" />,
      bg: "bg-blue-100",
      trend: "+2.4%",
      trendColor: "text-emerald-500",
    },
    {
      title: "Inquiries",
      value: messagesCount,
      icon: <MessageSquare className="w-6 h-6 text-rose-500" />,
      bg: "bg-rose-100",
      trend: "New",
      trendColor: "text-rose-500",
      onClick: () => navigate("/admin/messages")
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            onClick={stat.onClick}
            className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${stat.onClick ? "cursor-pointer hover:border-orange-200 transition-all" : ""}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>{stat.icon}</div>
              <div className={`text-sm font-semibold flex items-center ${stat.trendColor}`}>
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order Summary Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Order Summary</h3>
            <p className="text-sm text-gray-500">Order analytics for the last 7 days</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
              <span className="text-xs font-medium text-gray-600">Revenue (₹)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
              <span className="text-xs font-medium text-gray-600">Orders</span>
            </div>
          </div>
        </div>
        
        <div className="h-[350px] w-full" style={{ minHeight: '350px' }}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9ca3af', fontSize: 12}}
                dy={10}
              />
              <YAxis 
                hide 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="#f97316" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorOrders)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.4 }}
           className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
            <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order, i) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 font-medium text-gray-800">#{order.id}</td>
                      <td className="py-4 text-gray-600">{order.full_name || "Guest"}</td>
                      <td className="py-4 text-gray-500 text-sm">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 font-medium">₹{order.total_price}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                          order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.4, delay: 0.1 }}
           className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-tr from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
             <Utensils className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Cravecard Admin</h3>
          <p className="text-gray-500 text-sm mb-6">
            Managing your operations effectively and efficiently.
          </p>
          <div className="w-full bg-orange-50 rounded-xl p-4 border border-orange-100">
             <p className="text-sm font-semibold text-orange-800">Platform Status: <span className="text-green-600">All Systems Operational</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
