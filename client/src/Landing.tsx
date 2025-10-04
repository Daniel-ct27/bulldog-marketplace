
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";


import { useUser } from "./UserContext";
import React,{useState} from 'react';
import { LogIn, Zap, ShoppingBag, Users } from 'lucide-react';

const LandingPage: React.FC = () => {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();
  const { user, setUser } = useUser();
  


  const handleSubmit = async (event:React.FormEvent) => {
    event.preventDefault();
      console.log(email)
      console.log(password)
   

    //try carch to get user information from backend
    try{
      const res = await axios.post("http://127.0.0.1:8000/",{email:email,password:password});
      
      setUser(res.data);
      console.log(user?.email)
      console.log(user?.username)
      console.log(user?.name)

      navigate("/account");
    }
    catch(error:any){
      if (error.response?.status === 404) {
       
        console.log("FAILED")
        navigate("/"); // go directly to landing page if the backend sends a 404
      }

    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-600/10 to-transparent rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-8">
        <div className="text-center mb-16">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent tracking-tight">
            FUTURE MARKETPLACE
          </h1>
          <p className="text-2xl text-slate-400 font-light tracking-wide mb-4">
            Buy, sell, and request services in the next generation marketplace
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-blue-400/30 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Browse Products</h3>
            <p className="text-slate-400 text-lg leading-relaxed">Discover premium products from trusted sellers in our futuristic marketplace</p>
          </div>

          <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-amber-400/30 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-500/25">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Request Help</h3>
            <p className="text-slate-400 text-lg leading-relaxed">Need assistance? Post your task and connect with skilled professionals</p>
          </div>

          <div className="bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 hover:border-purple-400/30 transition-all duration-300 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">Sell Products</h3>
            <p className="text-slate-400 text-lg leading-relaxed">List your products and reach customers in our growing community</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-8 text-center tracking-wide">Welcome Back</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2 tracking-wide">EMAIL ADDRESS</label>
              <input 
                type="email" 
                placeholder="your@email.com"
                className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2 tracking-wide">PASSWORD</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded bg-slate-800 border-slate-600" />
                <span className="text-slate-400 text-sm font-medium">Remember me</span>
              </label>
              <a href="#" className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
                Forgot password?
              </a>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center space-x-3 px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-amber-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]"
              
            >
              <LogIn className="w-5 h-5" />
              <span className="tracking-wide">LOG IN</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <a href="#" className="text-amber-400 font-bold hover:text-amber-300 transition-colors">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;