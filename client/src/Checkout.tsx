import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, Tag } from 'lucide-react';


const CheckoutPage: React.FC = () => {
  // use shared cart context
  const { items: cartItems, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState<string>('');
  const [promoApplied, setPromoApplied] = useState<boolean>(false);

  // use updateQuantity/removeItem from the cart context directly in JSX

  const discount = promoApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

  const handleContinueShopping = (): void => {
    navigate('/listing');
  };

  const handleCheckout = (): void => {
    console.log('Proceeding to checkout with items:', cartItems);
    // demo: clear cart after 'checkout'
    clearCart();
  };

  const applyPromoCode = (): void => {
    if (promoCode.trim().toLowerCase() === 'save10') {
      setPromoApplied(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleContinueShopping}
            className="flex items-center space-x-2 px-6 py-3 mb-6 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-slate-300 hover:bg-slate-700/50 hover:border-slate-500/50 hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium tracking-wide">Continue Shopping</span>
          </button>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent tracking-tight">
                SHOPPING CART
              </h1>
              <p className="text-slate-400 text-lg">{cartItems.length} items in your cart</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="col-span-8 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-16 border border-slate-700/50 text-center">
                <ShoppingCart className="w-24 h-24 text-slate-600 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">Your cart is empty</h2>
                <p className="text-slate-400 text-lg mb-8">Add some amazing products to get started!</p>
                <button
                  onClick={handleContinueShopping}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 hover:border-blue-400/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-6">
                    {/* Product Image */}
                    <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-800">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://via.placeholder.com/400x400/1e293b/64748b?text=${encodeURIComponent(item.name)}`;
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">{item.name}</h3>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-amber-400"></div>
                        <span className="text-slate-400 text-sm font-medium tracking-wider uppercase">{item.color}</span>
                      </div>
                      <p className="text-3xl font-black bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 bg-slate-800/50 rounded-2xl p-2 border border-slate-600/50">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-white transition-colors"
                        >
                          <Minus className="w-5 h-5 text-white" color="white" />
                        </button>
                        <span className="text-white font-bold text-xl w-12 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-white transition-colors"
                        >
                          <Plus className="w-5 h-5 text-white" color="white" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right w-32">
                        <p className="text-slate-400 text-sm mb-1">Subtotal</p>
                        <p className="text-2xl font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-3 hover:bg-red-500/20 rounded-xl transition-colors group"
                      >
                        <Trash2 className="w-6 h-6 text-slate-400 group-hover:text-red-400 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary */}
          <div className="col-span-4">
            <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 sticky top-8">
              <h2 className="text-3xl font-black text-white mb-8 tracking-wide">ORDER SUMMARY</h2>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-slate-300 text-sm font-medium mb-3 tracking-wide">
                  <Tag className="inline w-4 h-4 mr-2" />
                  PROMO CODE
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    disabled={promoApplied}
                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium disabled:opacity-50"
                  />
                  <button
                    onClick={applyPromoCode}
                    disabled={promoApplied}
                    className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 disabled:bg-emerald-500/50 text-white rounded-xl font-medium transition-colors disabled:cursor-not-allowed"
                  >
                    {promoApplied ? '✓' : 'Apply'}
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-emerald-400 text-sm mt-2 font-medium">✓ Promo code applied! 10% off</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-8 pb-8 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-lg">Subtotal</span>
                  <span className="text-white text-lg font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 text-lg">Discount (10%)</span>
                    <span className="text-emerald-400 text-lg font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-lg">Tax (8%)</span>
                  <span className="text-white text-lg font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-2xl font-bold text-white">Total</span>
                <span className="text-4xl font-black bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full flex items-center justify-center space-x-3 px-8 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-bold text-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-4"
              >
                <CreditCard className="w-6 h-6" />
                <span className="tracking-wide">PROCEED TO CHECKOUT</span>
              </button>

              {/* Continue Shopping */}
              <button
                onClick={handleContinueShopping}
                className="w-full px-8 py-4 bg-slate-800/50 border border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 text-white rounded-2xl font-bold text-lg transition-all duration-300"
              >
                Continue Shopping
              </button>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 text-center">
                <p className="text-slate-400 text-sm">
                  🔒 <span className="font-medium text-slate-300">Secure Checkout</span>
                </p>
                <p className="text-slate-500 text-xs mt-1">Your payment information is encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;