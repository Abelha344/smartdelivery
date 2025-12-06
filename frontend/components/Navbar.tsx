import React from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { ShoppingCart, Menu, Zap, ShieldCheck, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserButton, useClerk } from "@clerk/clerk-react";

export const Navbar: React.FC = () => {
  const { user, cart, logout } = useStore();
  const { user: clerkUser } = useClerk();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path ? "text-orange-600 font-bold" : "text-gray-600 hover:text-orange-600";
  
  const handleNav = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => handleNav('/')} className="flex-shrink-0 flex items-center gap-2 focus:outline-none">
               <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                 <Zap size={24} fill="currentColor" />
               </div>
               <div className="flex flex-col leading-none items-start">
                 <span className="font-extrabold text-xl tracking-tight text-gray-900">Smart<span className="text-orange-600">Delivery</span></span>
                 <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Mekelle's Finest</span>
               </div>
            </button>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links based on Role */}
            {user?.role === UserRole.CLIENT && (
              <button onClick={() => handleNav('/orders')} className={isActive('/orders')}>My Orders</button>
            )}
            
            {user?.role === UserRole.ADMIN && (
               <button 
                 onClick={() => handleNav('/admin')} 
                 className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md font-medium"
               >
                 <ShieldCheck size={18} />
                 Admin Dashboard
               </button>
            )}

            {user?.role === UserRole.DELIVERY && (
               <button onClick={() => handleNav('/delivery')} className={isActive('/delivery')}>Tasks</button>
            )}

            {/* Cart - Visible to Clients and Guests */}
            {(!user || user.role === UserRole.CLIENT) && (
              <button onClick={() => handleNav('/cart')} className="relative p-2 text-gray-600 hover:text-orange-600 group focus:outline-none">
                <ShoppingCart size={24} className="group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full shadow-sm border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {!user ? (
              <div className="flex items-center gap-4">
                 <button 
                   onClick={() => navigate('/sign-in')} 
                   className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
                 >
                   Sign In
                 </button>
                 <button 
                   onClick={() => navigate('/sign-up')} 
                   className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 border-2 border-transparent rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                 >
                   Register
                 </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                   <div className="text-sm text-right hidden lg:block">
                     <p className="font-medium text-gray-900">{user.fullName}</p>
                     <p className="text-xs text-gray-500">{user.role}</p>
                   </div>
                   {clerkUser ? (
                       <UserButton afterSignOutUrl="/" />
                   ) : (
                       <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200 cursor-pointer" title="Manual Login">
                           {user.fullName.charAt(0)}
                       </div>
                   )}
                   {/* Explicit Logout for Manual Users */}
                   {!clerkUser && (
                       <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 transition-colors" title="Sign Out">
                           <LogOut size={20} />
                       </button>
                   )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
             {(!user || user?.role === UserRole.CLIENT) && (
                <button onClick={() => handleNav('/cart')} className="mr-4 relative p-2 text-gray-600 focus:outline-none">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </button>
             )}
             <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-gray-900 p-2 focus:outline-none">
               <Menu size={24} />
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pb-4 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {user ? (
               <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100 mb-2">
                  <span className="text-sm font-medium text-gray-500">{user.fullName} ({user.role})</span>
                  {clerkUser ? (
                      <UserButton afterSignOutUrl="/" />
                  ) : (
                      <button onClick={handleLogout} className="text-red-600 text-sm font-bold">Sign Out</button>
                  )}
               </div>
             ) : (
               <div className="grid grid-cols-2 gap-3 px-3 pb-2">
                  <button onClick={() => handleNav('/sign-in')} className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-gray-50 border border-gray-200 text-center">Sign In</button>
                  <button onClick={() => handleNav('/sign-up')} className="block w-full px-3 py-2 rounded-md text-base font-medium text-white bg-orange-600 text-center">Register</button>
               </div>
             )}
             
             {user?.role === UserRole.CLIENT && (
                 <button onClick={() => handleNav('/orders')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50">My Orders</button>
             )}
             {user?.role === UserRole.ADMIN && (
                <button onClick={() => handleNav('/admin')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-gray-900 hover:bg-gray-800">Admin Dashboard</button>
             )}
             {user?.role === UserRole.DELIVERY && (
                <button onClick={() => handleNav('/delivery')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-gray-50">My Tasks</button>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};
































