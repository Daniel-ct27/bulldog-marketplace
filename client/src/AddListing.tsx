import React, { useState } from 'react';
import { Upload, DollarSign, Package, ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "./UserContext"
import axios from "axios";

const AddListingPage: React.FC = () => {
  const navigate = useNavigate();
  const {user,setUser} = useUser();

  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [productColor, setProductColor] = useState<string>('');
  const [productImage, setProductImage] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [productCategory, setProductCategory] = useState<string>('');
  const [productCondition, setProductCondition] = useState<string>('');
 

  const handleSubmit = async() => {
    
    const listingData = {
      productName,
      productPrice,
      productColor,
      productImage,
      productDescription,
      productCategory,
      productCondition,
      userEmail: user?.email
    };
    console.log('Submitting listing:', listingData);
    try{
      const res = await axios.post("http://127.0.0.1:8000/add_listing",listingData);
      navigate("/account");
    }
    catch(error:any){
      if (error.response?.status === 400) {
        navigate("/account");
        console.log("FAILED")
         // go directly to landing page if the backend sends a 404
      }
    }
  };

  const handleBack = (): void => {
    console.log('Going back to products page');
    navigate("/listing")
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 px-6 py-3 mb-8 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium tracking-wide">Back to Products</span>
          </button>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <Plus className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
              ADD NEW LISTING
            </h1>
            <p className="text-xl text-slate-400 font-light tracking-wide">
              List your product and reach thousands of potential buyers
            </p>
          </div>

          {/* Listing Form */}
          <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl">
            <div className="space-y-8">
              {/* Product Name */}
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-3 tracking-wider uppercase">
                  <Package className="inline w-4 h-4 mr-2" />
                  Product Name
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Quantum Wireless Headphones"
                  className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide text-lg"
                />
              </div>

              {/* Price and Color */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 text-sm font-bold mb-3 tracking-wider uppercase">
                    <DollarSign className="inline w-4 h-4 mr-2" />
                    Price
                  </label>
                  <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="299.99"
                    step="0.01"
                    className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide text-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-bold mb-3 tracking-wider uppercase">
                    Color
                  </label>
                  <input
                    type="text"
                    value={productColor}
                    onChange={(e) => setProductColor(e.target.value)}
                    placeholder="e.g., Obsidian, Sapphire"
                    className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide text-lg"
                  />
                </div>
              </div>

              {/* Category and Condition */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-300 text-sm font-bold mb-3 tracking-wider uppercase">
                    Category
                  </label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide text-lg"
                  >
                    <option value="" className="bg-slate-800">Select category</option>
                    <option value="electronics" className="bg-slate-800">Electronics</option>
                    <option value="fashion" className="bg-slate-800">Fashion</option>
                    <option value="home" className="bg-slate-800">Home & Garden</option>
                    <option value="sports" className="bg-slate-800">Sports & Outdoors</option>
                    <option value="automotive" className="bg-slate-800">Automotive</option>
                    <option value="other" className="bg-slate-800">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 text-sm font-bold mb-3 tracking-wider uppercase">
                    Condition
                  </label>
                  <select
                    value={productCondition}
                    onChange={(e) => setProductCondition(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide text-lg"
                  >
                    <option value="" className="bg-slate-800">Select condition</option>
                    <option value="new" className="bg-slate-800">Brand New</option>
                    <option value="like-new" className="bg-slate-800">Like New</option>
                    <option value="good" className="bg-slate-800">Good</option>
                    <option value="fair" className="bg-slate-800">Fair</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-3 tracking-wider uppercase">
                  <Upload className="inline w-4 h-4 mr-2" />
                  Image URL
                </label>
                <input
                  type="url"
                  value={productImage}
                  onChange={(e) => setProductImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide text-lg"
                />
                <p className="mt-2 text-slate-500 text-sm">Paste a direct link to your product image</p>
              </div>

              {/* Image Preview */}
              {productImage && (
                <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-700/50">
                  <p className="text-slate-300 text-sm font-medium mb-3 tracking-wider uppercase">Image Preview</p>
                  <img
                    src={productImage}
                    alt="Product preview"
                    className="w-full max-w-md mx-auto rounded-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/400x400/1e293b/64748b?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}

              {/* Product Description */}
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-3 tracking-wider uppercase">
                  Product Description
                </label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Describe your product in detail. Include features, specifications, and any relevant information..."
                  rows={6}
                  className="w-full px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide text-lg resize-none"
                />
                <p className="mt-2 text-slate-500 text-sm">A detailed description helps buyers make informed decisions</p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full flex items-center justify-center space-x-3 px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-bold text-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]"
              >
                <Plus className="w-6 h-6" />
                <span className="tracking-wide">CREATE LISTING</span>
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/30">
            <p className="text-slate-400 text-center">
              💡 <span className="font-medium text-slate-300">Pro Tip:</span> High-quality photos and detailed descriptions increase your chances of a quick sale
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddListingPage;