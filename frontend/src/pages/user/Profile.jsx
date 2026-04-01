import { useEffect, useState } from "react";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { getProfile } from "../../services/api";
import { User, Mail, Phone, Calendar, Shield, LogOut, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-6 py-20 max-w-4xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Cover / Header Area */}
          <div className="h-48 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 relative">
            <div className="absolute -bottom-16 left-12">
              <div className="w-32 h-32 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white">
                <User className="w-16 h-16 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="pt-20 pb-12 px-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl font-black text-gray-800 tracking-tight">
                  {profile?.full_name || "User Profile"}
                </h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <p className="text-orange-500 font-bold flex items-center gap-2">
                    <Shield className="w-4 h-4" /> 
                    {profile?.is_staff ? "Administrator" : "Valued Member"}
                  </p>
                  {profile?.is_subscribed && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                      <Crown className="w-3 h-3" /> Membership Unlocked
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 font-bold rounded-2xl transition-all duration-300"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Personal Information</h2>
                
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-orange-200 transition-all">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Mail className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Email Address</p>
                    <p className="text-gray-800 font-bold">{profile?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-orange-200 transition-all">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Phone className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Phone Number</p>
                    <p className="text-gray-800 font-bold">{profile?.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 border-b pb-4">Account Stats</h2>
                
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-orange-200 transition-all">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <Calendar className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Joined Date</p>
                    <p className="text-gray-800 font-bold">
                      {profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }) : "N/A"}
                    </p>
                  </div>
                </div>

                {/* VIP card removed */}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
