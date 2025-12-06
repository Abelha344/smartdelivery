import React from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, ArrowRight, Clock, Plus, Zap, ShieldCheck } from 'lucide-react';
import jsConfetti from 'js-confetti';

export const Home: React.FC = () => {
  const { restaurants, foods, addToCart } = useStore();
  const navigate = useNavigate();
  const featuredRestaurants = restaurants.filter(r => r.recommended);
  const featuredFood = foods.slice(0, 8); // Show more items for a fuller grid

  const handleAddToCart = (food: any) => {
    addToCart(food);
    // Visual feedback
    const btn = document.getElementById(`btn-add-${food.id}`);
    if (btn) {
        btn.innerHTML = 'Added';
        btn.classList.add('bg-green-600');
        setTimeout(() => {
            btn.innerHTML = '';
            const icon = document.createElement('i'); // Re-add icon logic simplified
            btn.textContent = 'Add';
            btn.classList.remove('bg-green-600');
        }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
            alt="Ethiopian Food" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/20 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
                Smart Delivery in  Mekelle
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                Smart<span className="text-orange-500">Delivery</span><br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">at your door.</span>
              </h1>
              <p className="mt-4 text-xl text-gray-300 max-w-2xl mb-10 mx-auto md:mx-0 leading-relaxed">
                The smartest way to get food in Mekelle.Enjoy hot meals delivered with precision tracking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                 <button onClick={() => navigate('/restaurants')} className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all hover:scale-105 flex items-center justify-center gap-2">
                    Order Now <ArrowRight size={20} />
                 </button>
                 <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center">
                    Create Account
                 </button>
              </div>
          </div>
          {/* Hero Visual Mockup */}
          <div className="flex-1 hidden md:block relative">
             <div className="relative z-10 w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-orange-500 to-red-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
             <img 
               src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1000&auto=format&fit=crop" 
               className="relative z-20 w-full max-w-md mx-auto rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 border-4 border-gray-800/50"
               alt="App Preview"
             />
             <div className="absolute -bottom-6 -right-6 z-30 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce" style={{animationDuration: '3s'}}>
                <div className="bg-green-100 p-2 rounded-full text-green-600">
                   <Clock size={24} />
                </div>
                <div>
                   <p className="text-xs text-gray-500 font-bold uppercase">Avg Delivery</p>
                   <p className="text-lg font-bold text-gray-900">25 Mins</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Popular Foods (Real World Style) */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
             <div>
                <h2 className="text-3xl font-bold text-gray-900">Popular in Mekelle</h2>
                <p className="text-gray-500 mt-2">The most ordered items this week</p>
             </div>
             <button onClick={() => navigate('/restaurants')} className="text-orange-600 hover:text-orange-700 font-bold flex items-center hover:underline">
                View Menu <ArrowRight size={18} className="ml-1" />
             </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
             {featuredFood.map(food => {
               const restaurant = restaurants.find(r => r.id === food.restaurantId);
               return (
                 <div key={food.id} className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-100 transition-all duration-300 overflow-hidden">
                    {/* Card Image */}
                    <div className="relative h-48 overflow-hidden">
                       <img 
                         src={food.imageUrl} 
                         alt={food.name} 
                         className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                       />
                       <div className="absolute top-3 left-3 flex gap-2">
                           <span className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
                              <Clock size={12} className="text-orange-500" /> 20-30 min
                           </span>
                       </div>
                       <button 
                          onClick={() => addToCart(food)}
                          className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900 hover:bg-orange-600 hover:text-white transition-colors transform translate-y-12 group-hover:translate-y-0 duration-300"
                          title="Add to Cart"
                       >
                          <Plus size={20} />
                       </button>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col">
                       <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">{food.name}</h3>
                          <span className="text-gray-900 font-extrabold">{food.price}<span className="text-xs text-gray-500 font-normal ml-0.5">ETB</span></span>
                       </div>
                       
                       <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{food.description}</p>
                       
                       {/* Footer info */}
                       <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                                <img src={restaurant?.imageUrl} className="w-full h-full object-cover" alt={restaurant?.name} />
                             </div>
                             <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-700 hover:text-orange-600 cursor-pointer">{restaurant?.name}</span>
                                <div className="flex items-center text-[10px] text-gray-500">
                                   <Star size={10} className="text-yellow-400 fill-yellow-400 mr-1" />
                                   {restaurant?.rating} • {food.category}
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
               );
             })}
          </div>
        </div>
      </div>

      {/* Featured Restaurants (Simplified for brevity as focus was on Popular section) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
           <h2 className="text-3xl font-bold text-gray-900">Top Rated Partners</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRestaurants.map(restaurant => (
            <div key={restaurant.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
               <div className="h-48 relative">
                 <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
                 {restaurant.recommended && (
                   <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">
                     Recommended
                   </span>
                 )}
               </div>
               <div className="p-6">
                 <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                   <div className="flex items-center bg-green-50 px-2 py-1 rounded-md border border-green-100">
                     <Star size={14} className="text-green-600 fill-current" />
                     <span className="ml-1 text-sm font-bold text-green-700">{restaurant.rating}</span>
                   </div>
                 </div>
                 <div className="flex items-center text-gray-500 text-sm mb-4">
                   <MapPin size={16} className="mr-1 text-orange-500" />
                   {restaurant.address}
                 </div>
                 <button onClick={() => navigate('/restaurants')} className="block w-full text-center py-3 px-4 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 font-bold rounded-lg transition-colors">
                   View Menu
                 </button>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust/Features Section */}
      <div className="py-20 bg-gradient-to-b from-orange-50 to-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Why Smart Delivery?</h2>
                <p className="text-gray-500 mt-2">Optimized for Mekelle's unique landscape</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-600 rotate-3">
                     <Zap size={28} fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                  <p className="text-gray-500 leading-relaxed">Our smart routing algorithms find the quickest path through Mekelle's streets to ensure your food arrives hot.</p>
               </div>
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 -rotate-3">
                     <MapPin size={28} fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Live GPS Tracking</h3>
                  <p className="text-gray-500 leading-relaxed">Watch your delivery hero move on the map in real-time. Know exactly when to set the table.</p>
               </div>
               <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600 rotate-3">
                     <ShieldCheck size={28} fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Secure Payments</h3>
                  <p className="text-gray-500 leading-relaxed">Pay with Cash on Delivery or seamlessly through local banking apps. Your security is our priority.</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};












