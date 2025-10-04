import { ShoppingBag, HelpCircle, User, Settings, LogOut, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "./UserContext"

const AccountPage: React.FC = () => {
    const navigate = useNavigate();
    const {user} = useUser()
  const handleNavigation = (page: string): void => {
    console.log(`Navigating to: ${page}`);
    navigate(page);
    // Add your navigation logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="w-full max-w-none mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent tracking-tight">
                  MY ACCOUNT
                </h1>
                <p className="text-slate-400 text-lg">Manage your marketplace activities</p>
              </div>
            </div>

            <button 
              onClick={() => handleNavigation('logout')}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-slate-300 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium tracking-wide">Log Out</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 mb-12 border border-slate-700/50">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 tracking-wide">{user?.name}</h2>
                <p className="text-slate-400 text-lg mb-1">{user?.email}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-400 font-medium">Member since Jan 2025</span>
                  <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                  <span className="text-sm text-amber-400 font-medium">Pro Member</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Actions Grid */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Browse Products */}
            <button
              onClick={() => handleNavigation('/listing')}
              className="group bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 hover:border-blue-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 text-left"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-4xl font-black text-white mb-4 tracking-wide group-hover:text-blue-400 transition-colors">
                Browse Products
              </h3>
              <p className="text-slate-400 text-xl leading-relaxed">
                Explore our marketplace and discover amazing products from sellers worldwide
              </p>
              <div className="mt-6 flex items-center space-x-2 text-blue-400 font-bold">
                <span>View Listings</span>
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </button>

            {/* Request Help */}
            <button
              onClick={() => handleNavigation('/help')}
              className="group bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 hover:border-amber-400/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20 text-left"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-amber-600 to-amber-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform duration-300">
                <HelpCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-4xl font-black text-white mb-4 tracking-wide group-hover:text-amber-400 transition-colors">
                Request Help
              </h3>
              <p className="text-slate-400 text-xl leading-relaxed">
                Need assistance with a task? Post your request and connect with skilled professionals
              </p>
              <div className="mt-6 flex items-center space-x-2 text-amber-400 font-bold">
                <span>Post Request</span>
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </div>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <p className="text-slate-400 text-sm font-medium mb-2 tracking-wide">ACTIVE LISTINGS</p>
              <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">12</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <p className="text-slate-400 text-sm font-medium mb-2 tracking-wide">ITEMS SOLD</p>
              <p className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">48</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <p className="text-slate-400 text-sm font-medium mb-2 tracking-wide">HELP REQUESTS</p>
              <p className="text-4xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">5</p>
            </div>
            <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <p className="text-slate-400 text-sm font-medium mb-2 tracking-wide">RATING</p>
              <p className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">4.9</p>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50">
            <h3 className="text-2xl font-bold text-white mb-6 tracking-wide flex items-center space-x-3">
              <Settings className="w-6 h-6" />
              <span>Account Settings</span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <button className="px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-white transition-all duration-300 font-medium tracking-wide">
                Edit Profile
              </button>
              <button className="px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-white transition-all duration-300 font-medium tracking-wide">
                Notifications
              </button>
              <button className="px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-white transition-all duration-300 font-medium tracking-wide">
                Privacy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;