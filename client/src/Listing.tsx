import React, { useState , useEffect} from 'react';
import { Heart, ShoppingCart, Search,Plus,LogOut} from 'lucide-react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { useCart } from './CartContext';
interface Product {
  id: number;
  name: string;
  price: number;
  color: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductListing: React.FC = () => {
  const {setUser} = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const { items: cartItems, addItem, removeItem } = useCart();
  const navigate = useNavigate();
  // Sample product data - you can replace with props or API data
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const endpoint = debouncedSearch
          ? `http://127.0.0.1:8000/search?q=${encodeURIComponent(debouncedSearch)}&k=8`
          : "http://127.0.0.1:8000/listing";
        const res = await axios.get(endpoint);
        if (!cancelled) {
          setProducts(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const colors: string[] = ['all', ...new Set(products.map(p => p.color.toLowerCase()))];

  const filteredAndSortedProducts: Product[] = products
    .filter(product => 
      (selectedColor === 'all' || product.color.toLowerCase() === selectedColor)
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const toggleFavorite = (productId: number): void => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const toggleCart = (product: Product): void => {
    const exists = cartItems.some(i => i.id === product.id);
    if (exists) removeItem(product.id);
    else addItem({ id: product.id, name: product.name, price: product.price, color: product.color, image: product.image }, 1);
  };

  const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
    <div className="group relative bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-700/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-400/30">
      {/* Futuristic glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/400x400/1e293b/64748b?text=${encodeURIComponent(product.name)}`;
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
        
        {/* Favorite button */}
        <button
          onClick={() => toggleFavorite(product.id)}
          className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
            favorites.has(product.id) 
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25' 
              : 'bg-slate-900/60 text-slate-300 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${favorites.has(product.id) ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-6 relative z-10">
        <h3 className="font-bold text-xl text-white mb-3 leading-tight tracking-wide">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-black bg-gradient-to-r from-blue-400 to-amber-400 bg-clip-text text-transparent">
              ${product.price}
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-amber-400"></div>
              <span className="text-slate-300 text-sm font-medium tracking-wider uppercase">
                {product.color}
              </span>
            </div>
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={() => toggleCart(product)}
          className={`w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
            cartItems.some(i => i.id === product.id)
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
              : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-amber-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="tracking-wide">{cartItems.some(i => i.id === product.id) ? 'ADDED TO CART' : 'ADD TO CART'}</span>
        </button>
      </div>
    </div>
  );

  
  const handleBack = () => {
    console.log('Going back to account page');
   
    navigate("/account");

  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSelectedColor(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setSortBy(e.target.value);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] bg-gradient-to-br from-blue-600/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-[32rem] h-[32rem] bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Top Bar: Back to Account & Logout */}
      <div className="flex justify-between items-center w-full px-8 pt-8 z-20 relative">
        {/* Back to Account Button */}
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-800/60 border border-slate-600/60 rounded-2xl text-slate-300 hover:bg-slate-700/70 hover:border-slate-500/70 hover:text-white transition-all duration-300 font-medium tracking-wide shadow"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Account</span>
        </button>
        {/* Logout Button */}
        <button 
          onClick={async() => {
              axios.get("http://127.0.0.1:8000/logout")
              setUser(null);
              localStorage.removeItem("user"); 
              navigate("/")
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-800/60 border border-slate-600/60 rounded-2xl text-slate-300 hover:bg-red-600/80 hover:border-red-500/70 hover:text-white transition-all duration-300 font-medium tracking-wide shadow"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium tracking-wide">Log Out</span>
        </button>
      </div>

      <div className="relative z-10 px-4 md:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex flex-col items-center mb-12 w-full">
          <h1 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent tracking-tight w-full text-center">
            BULLDOG MARKETPLACE
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-light tracking-wide mb-4 w-full text-center">
            Discover tomorrow's technology today
          </p>
          <button
            onClick={() => navigate('/add')}
            className="flex items-center space-x-3 px-8 py-5 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 flex-shrink-0"
          >
            <Plus className="w-6 h-6" />
            <span className="tracking-wide">ADD LISTING</span>
          </button>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-r from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 mb-12 border border-slate-700/50 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 lg:space-x-8 w-full">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium tracking-wide"
              />
            </div>

            <div className="flex items-center space-x-4 w-full lg:w-auto">
              {/* Color Filter */}
              <select
                value={selectedColor}
                onChange={handleColorChange}
                className="px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium tracking-wide"
              >
                {colors.map(color => (
                  <option key={color} value={color} className="bg-slate-800">
                    {color === 'all' ? 'All Colors' : color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="px-6 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium tracking-wide"
              >
                <option value="name" className="bg-slate-800">Sort by Name</option>
                <option value="price-low" className="bg-slate-800">Price: Low to High</option>
                <option value="price-high" className="bg-slate-800">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 w-full gap-4">
          <p className="text-slate-400 font-medium tracking-wide">
            Showing <span className="text-blue-400 font-bold">{filteredAndSortedProducts.length}</span> of <span className="text-amber-400 font-bold">{products.length}</span> products
          </p>
              <div className="flex items-center space-x-6 text-slate-400 font-medium">
            <span className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-pink-400 font-bold">{favorites.size}</span>
              <span>favorites</span>
            </span>
            <span className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-bold">{cartItems.reduce((s,i)=> s + i.quantity, 0)}</span>
              <span>in cart</span>
            </span>
            <button
              onClick={() => navigate('/checkout')}
              className="px-3 py-2 bg-blue-600/60 hover:bg-blue-600 rounded-xl text-white font-medium ml-2"
            >
              Go to Checkout
            </button>
          </div>
        </div>

        {/* Products Grid - Responsive */}
        {isLoading ? (
          <div className="text-center py-20 w-full">
            <div className="text-6xl mb-4 animate-pulse">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">Searching listings…</h3>
            <p className="text-slate-400">Give us a second to find the best matches.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 auto-rows-max w-full">
              {filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-20 w-full">
                <div className="text-8xl mb-6">🔮</div>
                <h3 className="text-2xl font-bold text-white mb-4">No products found</h3>
                <p className="text-slate-400 text-lg">Try adjusting your search parameters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListing;