import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FoodItem, Restaurant } from '../types';
import { Plus, Minus, Search, ArrowLeft } from 'lucide-react';
import jsConfetti from 'js-confetti';
import { useNavigate } from 'react-router-dom';

export const Restaurants: React.FC = () => {
  const { restaurants, foods, addToCart } = useStore();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(null);

  const categories = ['All', ...Array.from(new Set(foods.map(f => f.category)))];

  const filteredFoods = foods.filter(food => {
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRestaurant = activeRestaurantId ? food.restaurantId === activeRestaurantId : true;
    return matchesCategory && matchesSearch && matchesRestaurant;
  });

  const handleAddToCart = (food: FoodItem) => {
    addToCart(food);
    // Simple toast could go here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-orange-600 mb-6 transition-colors font-medium">
             <ArrowLeft size={20} className="mr-2" /> Back
        </button>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="relative flex-1 max-w-lg">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search className="h-5 w-5 text-gray-400" />
             </div>
             <input
               type="text"
               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
               placeholder="Search for food..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                   selectedCategory === cat 
                     ? 'bg-orange-600 text-white' 
                     : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        {/* Restaurant Quick Filter (Optional) */}
        {!activeRestaurantId && (
          <div className="mb-8">
             <h3 className="text-lg font-semibold mb-4 text-gray-700">Filter by Restaurant</h3>
             <div className="flex gap-4 overflow-x-auto pb-4">
               <button 
                  onClick={() => setActiveRestaurantId(null)}
                  className={`flex-shrink-0 w-32 p-3 rounded-lg border-2 text-center transition-all ${activeRestaurantId === null ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}
               >
                 <span className="font-bold block">All</span>
               </button>
               {restaurants.map(r => (
                 <button 
                    key={r.id}
                    onClick={() => setActiveRestaurantId(r.id)}
                    className={`flex-shrink-0 w-48 p-3 rounded-lg border-2 text-left transition-all ${activeRestaurantId === r.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}
                 >
                   <div className="font-bold truncate">{r.name}</div>
                   <div className="text-xs text-gray-500 truncate">{r.address}</div>
                 </button>
               ))}
             </div>
          </div>
        )}

        {/* Food Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredFoods.map(food => {
             const restaurant = restaurants.find(r => r.id === food.restaurantId);
             return (
               <div key={food.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                  <div className="h-48 relative overflow-hidden group">
                     <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-white text-sm">{food.description}</p>
                     </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                     <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{food.name}</h3>
                          <p className="text-xs text-gray-500">{restaurant?.name}</p>
                        </div>
                        <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded">{food.category}</span>
                     </div>
                     
                     <div className="mt-auto flex items-center justify-between pt-4">
                        <span className="text-lg font-bold text-gray-900">{food.price} ETB</span>
                        <button 
                          onClick={() => handleAddToCart(food)}
                          className="flex items-center justify-center p-2 rounded-full bg-orange-600 text-white hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        >
                          <Plus size={20} />
                        </button>
                     </div>
                  </div>
               </div>
             );
           })}
        </div>

        {filteredFoods.length === 0 && (
           <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No food found matching your criteria.</p>
           </div>
        )}
      </div>
    </div>
  );
};