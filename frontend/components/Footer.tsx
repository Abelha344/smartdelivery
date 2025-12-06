import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
             {/* Brand Column */}
             <div>
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Zap size={24} fill="currentColor" />
                   </div>
                   <div className="flex flex-col leading-none">
                     <span className="font-extrabold text-xl text-white tracking-tight">Smart<span className="text-orange-500">Delivery</span></span>
                     <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Mekelle's Finest</span>
                   </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                   Experience the smartest way to eat in Mekelle. We connect you with the city's best kitchens, delivering hot and fresh meals directly to your location with real-time tracking.
                </p>
                <div className="flex gap-4">
                   <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors text-white">
                      <Facebook size={20} />
                   </button>
                   <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors text-white">
                      <Twitter size={20} />
                   </button>
                   <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition-colors text-white">
                      <Instagram size={20} />
                   </button>
                </div>
             </div>
             
             {/* Quick Links */}
             <div>
                <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                    Quick Links
                    <span className="absolute bottom-[-8px] left-0 w-12 h-1 bg-orange-600 rounded-full"></span>
                </h3>
                <ul className="space-y-3 text-sm">
                   <li><button onClick={() => navigate('/')} className="hover:text-orange-500 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-orange-500 rounded-full"></span>Home</button></li>
                   <li><button onClick={() => navigate('/restaurants')} className="hover:text-orange-500 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-orange-500 rounded-full"></span>Browse Food</button></li>
                   <li><button onClick={() => navigate('/login')} className="hover:text-orange-500 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-orange-500 rounded-full"></span>Login</button></li>
                   <li><button onClick={() => navigate('/register')} className="hover:text-orange-500 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-orange-500 rounded-full"></span>Register</button></li>
                </ul>
             </div>

             {/* Contact Info */}
             <div>
                <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                    Contact Us
                    <span className="absolute bottom-[-8px] left-0 w-12 h-1 bg-orange-600 rounded-full"></span>
                </h3>
                <ul className="space-y-4 text-sm">
                   <li className="flex items-start gap-3">
                      <div className="p-2 bg-gray-800 rounded-lg text-orange-500">
                        <MapPin size={18} />
                      </div>
                      <span className="mt-1">Romanat Square, Mekelle,<br/>Tigray, Ethiopia</span>
                   </li>
                   <li className="flex items-center gap-3">
                      <div className="p-2 bg-gray-800 rounded-lg text-orange-500">
                        <Phone size={18} />
                      </div>
                      <span>+251923059893</span>
                   </li>
                   <li className="flex items-center gap-3">
                      <div className="p-2 bg-gray-800 rounded-lg text-orange-500">
                         <Mail size={18} />
                      </div>
                      <span>support@smartdelivery.et</span>
                   </li>
                </ul>
             </div>

             {/* Newsletter/App */}
             <div>
                <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                    Get the App
                    <span className="absolute bottom-[-8px] left-0 w-12 h-1 bg-orange-600 rounded-full"></span>
                </h3>
                <p className="text-gray-400 text-sm mb-4">Download our mobile app for faster ordering and exclusive offers.</p>
                <div className="space-y-3">
                    <button className="w-full bg-gray-800 hover:bg-gray-700 p-3 rounded-xl flex items-center gap-3 transition-colors border border-gray-700">
                        <div className="text-2xl">🍎</div>
                        <div className="text-left">
                            <div className="text-[10px] text-gray-400 uppercase">Download on the</div>
                            <div className="font-bold text-sm text-white">App Store</div>
                        </div>
                    </button>
                    <button className="w-full bg-gray-800 hover:bg-gray-700 p-3 rounded-xl flex items-center gap-3 transition-colors border border-gray-700">
                        <div className="text-2xl">🤖</div>
                        <div className="text-left">
                            <div className="text-[10px] text-gray-400 uppercase">Get it on</div>
                            <div className="font-bold text-sm text-white">Google Play</div>
                        </div>
                    </button>
                </div>
             </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-sm text-gray-500">&copy; 2025 Smart Delivery Service. All rights reserved.</p>
             <div className="flex gap-6 text-sm text-gray-500">
                <button className="hover:text-white transition-colors">Privacy Policy</button>
                <button className="hover:text-white transition-colors">Terms of Service</button>
                <button className="hover:text-white transition-colors">Cookie Policy</button>
             </div>
          </div>
       </div>
    </footer>
  );
};

















