import React, { useState } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Restaurants } from './pages/Restaurants';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DeliveryDashboard } from './pages/delivery/DeliveryDashboard';
import { PaymentResult } from './pages/PaymentResult';
import { UserRole, User, Order } from './types';
import { ArrowLeft, X, MapPin, Phone, Navigation, Check, RefreshCw, FileText, CreditCard } from 'lucide-react';

const ClientOrders = () => {
  const { orders, user, refreshData, restaurants } = useStore();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter and sort
  const myOrders = orders
    .filter(o => o.userId === user?.id)
    .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null); // State for Details Modal

  const activeTrackingOrder = myOrders.find(o => o.id === trackingOrder);

  const handleRefresh = async () => {
      setIsRefreshing(true);
      await refreshData();
      setTimeout(() => setIsRefreshing(false), 500);
  };

  const getRestaurantName = (id: string) => {
      return restaurants.find(r => r.id === id)?.name || 'Unknown Restaurant';
  };

  // --- DETAILS MODAL ---
  const renderDetailsModal = () => {
      if (!detailsOrder) return null;

      const deliveryFee = 50;
      const subtotal = detailsOrder.totalPrice - deliveryFee; // Approximate reverse calc for display

      return (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                  <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-gray-900">Order Details</h3>
                      <button onClick={() => setDetailsOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto">
                      {/* Header Info */}
                      <div className="mb-6 flex justify-between items-start">
                          <div>
                              <p className="text-xs text-gray-500 uppercase font-bold">Order ID</p>
                              <p className="font-mono font-bold text-gray-900">#{detailsOrder.id.slice(-6)}</p>
                          </div>
                          <div className="text-right">
                              <p className="text-xs text-gray-500 uppercase font-bold">Date</p>
                              <p className="text-sm font-medium text-gray-900">{new Date(detailsOrder.createdAt).toLocaleDateString()}</p>
                          </div>
                      </div>

                      {/* Statuses */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                              <p className="text-xs text-orange-600 font-bold uppercase mb-1">Delivery Status</p>
                              <p className="font-bold text-gray-900">{detailsOrder.status}</p>
                          </div>
                          <div className={`p-3 rounded-lg border ${detailsOrder.paymentStatus === 'Paid' ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100'}`}>
                              <p className={`text-xs font-bold uppercase mb-1 ${detailsOrder.paymentStatus === 'Paid' ? 'text-green-600' : 'text-gray-500'}`}>Payment Status</p>
                              <div className="flex items-center gap-2">
                                  <p className="font-bold text-gray-900">{detailsOrder.paymentStatus || 'Pending'}</p>
                                  {detailsOrder.paymentMethod.includes('Chapa') && <CreditCard size={14} className="text-gray-400"/>}
                              </div>
                              <p className="text-[10px] text-gray-500 mt-1">{detailsOrder.paymentMethod}</p>
                          </div>
                      </div>

                      {/* Items List */}
                      <div className="mb-6">
                          <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">Items Ordered</h4>
                          <div className="space-y-4">
                              {detailsOrder.items.map((item, idx) => (
                                  <div key={idx} className="flex gap-3">
                                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="flex-1">
                                          <p className="font-bold text-sm text-gray-900">{item.name}</p>
                                          <p className="text-xs text-orange-600 font-medium">{getRestaurantName(item.restaurantId)}</p>
                                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                                              <span>Qty: {item.quantity}</span>
                                              <span>{item.price * item.quantity} ETB</span>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Financials */}
                      <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                              <span>Subtotal</span>
                              <span>{subtotal > 0 ? subtotal : detailsOrder.totalPrice} ETB</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                              <span>Delivery Fee</span>
                              <span>{deliveryFee} ETB</span>
                          </div>
                          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg text-gray-900">
                              <span>Total</span>
                              <span>{detailsOrder.totalPrice} ETB</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  // --- TRACKING MODAL ---
  const renderTrackingModal = () => {
     if(!activeTrackingOrder) return null;
     
     // Progress Logic
     const steps = ['Pending', 'In Progress', 'Out for Delivery', 'Delivered'];
     let currentStepIndex = steps.indexOf(activeTrackingOrder.status);
     if (currentStepIndex === -1 && activeTrackingOrder.status === 'Pending Payment') currentStepIndex = 0;
     if (currentStepIndex === -1) currentStepIndex = 0; // Fallback

     // Extract Driver Info safely
     const deliveryPerson = (typeof activeTrackingOrder.deliveryPersonId === 'object') 
        ? (activeTrackingOrder.deliveryPersonId as User) 
        : null;
     
     const driverName = deliveryPerson?.fullName || "Assigning Driver...";
     // Fallback phone number if driver hasn't set one (for demo/reliability)
     const driverPhone = deliveryPerson?.phone || "+251911234567";

     return (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-gray-900 p-5 text-white flex justify-between items-center shadow-md z-10">
                    <div>
                        <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Live Tracking</p>
                        <h3 className="font-bold text-lg">Order #{activeTrackingOrder.id.slice(-6)}</h3>
                    </div>
                    <button onClick={() => setTrackingOrder(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                {/* Map Simulation */}
                <div className="h-56 bg-gray-200 relative overflow-hidden group">
                     {/* Background Image of Map */}
                     <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Mekelle_map.png')] bg-cover bg-center opacity-60 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"></div>
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>

                     {/* User Home Marker */}
                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <div className="flex flex-col items-center animate-bounce-slow">
                            <MapPin className="text-red-600 drop-shadow-xl filter" size={40} fill="currentColor" />
                            <span className="bg-white text-xs font-bold px-3 py-1 rounded-full shadow-lg mt-1 text-gray-800">You</span>
                        </div>
                     </div>

                     {/* Simulated Driver Marker */}
                     {(activeTrackingOrder.status === 'In Progress' || activeTrackingOrder.status === 'Out for Delivery') && (
                         <div className="absolute top-1/3 left-1/4 animate-pulse duration-1000 z-20">
                             <div className="flex flex-col items-center transform translate-x-12 translate-y-4">
                                 <div className="bg-orange-600 p-2 rounded-full text-white shadow-xl border-2 border-white">
                                     <Navigation size={20} className="transform rotate-45" />
                                 </div>
                                 <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow mt-1">Driver</span>
                             </div>
                         </div>
                     )}
                </div>

                {/* Content Body */}
                <div className="p-6 overflow-y-auto">
                    {/* Status Steps */}
                    <div className="mb-8">
                        <div className="flex justify-between relative">
                            {/* Gray Background Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2 rounded-full"></div>
                            {/* Colored Progress Line */}
                            <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 transform -translate-y-1/2 rounded-full transition-all duration-1000 ease-out" style={{width: `${(currentStepIndex / (steps.length - 1)) * 100}%`}}></div>

                            {steps.map((step, idx) => {
                                const isCompleted = idx <= currentStepIndex;
                                const isCurrent = idx === currentStepIndex;
                                return (
                                    <div key={step} className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-4 transition-all duration-500 ${isCompleted ? 'bg-green-500 border-green-500 text-white scale-110' : 'bg-white border-gray-200 text-gray-300'}`}>
                                            {isCompleted ? <Check size={14} strokeWidth={4} /> : idx + 1}
                                        </div>
                                        <span className={`text-[10px] font-bold mt-2 uppercase tracking-wide ${isCurrent ? 'text-green-600' : 'text-gray-400'}`}>{step}</span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="text-center mt-6">
                            <h4 className="text-xl font-bold text-gray-900">{activeTrackingOrder.status}</h4>
                            <p className="text-gray-500 text-sm">
                                {activeTrackingOrder.status === 'Pending' && 'Restaurant is confirming your order.'}
                                {activeTrackingOrder.status === 'In Progress' && 'Driver is heading to the restaurant.'}
                                {activeTrackingOrder.status === 'Out for Delivery' && 'Food is on the way to you!'}
                                {activeTrackingOrder.status === 'Delivered' && 'Enjoy your meal!'}
                            </p>
                        </div>
                    </div>

                    {/* Driver Contact Card */}
                    {(activeTrackingOrder.status === 'In Progress' || activeTrackingOrder.status === 'Out for Delivery') && (
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-md border-2 border-white">
                                    🛵
                                </div>
                                <div>
                                    <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Your Driver</p>
                                    <p className="font-bold text-gray-900 text-lg">{driverName}</p>
                                    <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
                                         <Phone size={10} />
                                         <span className="font-mono font-medium">{driverPhone}</span>
                                     </div>
                                </div>
                            </div>
                            
                            <a href={`tel:${driverPhone}`} className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg hover:shadow-green-500/30 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center group" title="Call Driver">
                                <Phone size={20} fill="currentColor" className="group-hover:animate-pulse" />
                            </a>
                        </div>
                    )}
                </div>
                
                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400">
                    Updates refresh automatically
                </div>
            </div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Render Modals if Active */}
      {renderTrackingModal()}
      {renderDetailsModal()}

      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-orange-600 transition-colors font-medium">
                <ArrowLeft size={20} className="mr-2" /> Back
            </button>
            <button 
                onClick={handleRefresh} 
                className={`flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm ${isRefreshing ? 'opacity-70' : ''}`}
            >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                Refresh Status
            </button>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-900">My Orders</h2>
        
        {myOrders.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
               <p className="text-gray-500 text-lg">No past orders found.</p>
               <button onClick={() => navigate('/restaurants')} className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg font-bold">Start Ordering</button>
           </div>
        ) : (
          <div className="space-y-6">
            {myOrders.map(order => {
                // Inline driver check for main card
                const deliveryPerson = (typeof order.deliveryPersonId === 'object') ? (order.deliveryPersonId as User) : null;
                const showDriver = (order.status === 'In Progress' || order.status === 'Out for Delivery') && deliveryPerson;
                const fallbackPhone = deliveryPerson?.phone || "+251911234567";
                
                return (
                  <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                     {showDriver && (
                        <div className="absolute top-0 right-0 bg-orange-50 border-b border-l border-orange-100 px-3 py-1 rounded-bl-xl flex items-center gap-2">
                             <span className="text-[10px] font-bold text-orange-600 uppercase">Driver Assigned</span>
                        </div>
                     )}
                     
                     <div className="flex justify-between items-center mb-4 mt-2">
                        <div>
                            <span className="font-bold text-gray-900 text-lg">#{order.id.slice(-6)}</span>
                            <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-orange-100 text-orange-800 animate-pulse'
                        }`}>
                           {order.status}
                        </span>
                     </div>
                     
                     <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                        {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                     </div>
                     
                     {/* Driver Mini Card on List */}
                     {showDriver && (
                         <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between bg-orange-50/50 border border-orange-100 p-4 rounded-xl gap-4">
                             <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-orange-100">
                                     🛵
                                 </div>
                                 <div>
                                     <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Your Driver</p>
                                     <p className="font-bold text-gray-900 text-lg leading-tight">{deliveryPerson.fullName}</p>
                                     <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                         <Phone size={12} />
                                         <span className="font-mono font-medium">{fallbackPhone}</span>
                                     </div>
                                 </div>
                             </div>
                             <a 
                                href={`tel:${fallbackPhone}`} 
                                className="flex-shrink-0 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-green-500/30 transition-all font-bold group"
                             >
                                 <Phone size={18} fill="currentColor" className="group-hover:animate-pulse" />
                                 Call Driver
                             </a>
                         </div>
                     )}

                     <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                        <span className="font-bold text-xl text-gray-900">{order.totalPrice} <span className="text-sm font-normal text-gray-500">ETB</span></span>
                        
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDetailsOrder(order)}
                                className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
                            >
                                <FileText size={16} /> Details
                            </button>

                            {/* Track Order Button for Active Orders */}
                            {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                <button 
                                    onClick={() => setTrackingOrder(order.id)}
                                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-gray-900/20 transform hover:-translate-y-0.5"
                                >
                                    <MapPin size={16} /> Track
                                </button>
                            )}
                        </div>
                     </div>
                  </div>
                );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles: UserRole[] }) => {
  const { user, isAuthLoading } = useStore();
  const location = useLocation();

  if (isAuthLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Auth Routes - Reverted to exact paths for Custom Forms */}
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<Register />} />
          
          {/* Legacy redirects */}
          <Route path="/login" element={<Navigate to="/sign-in" replace />} />
          <Route path="/register" element={<Navigate to="/sign-up" replace />} />
          
          {/* Payment Routes */}
          <Route path="/payment/success" element={<PaymentResult />} />
          <Route path="/payment/failed" element={<PaymentResult />} />

          {/* Customer Routes */}
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/cart" element={<Cart />} />
          {/* Updated Orders Route to use new ClientOrders component */}
          <Route path="/orders" element={<ProtectedRoute allowedRoles={[UserRole.CLIENT]}><ClientOrders /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AdminDashboard /></ProtectedRoute>} />
          
          {/* Delivery Routes */}
          <Route path="/delivery" element={<ProtectedRoute allowedRoles={[UserRole.DELIVERY]}><DeliveryDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <AppContent />
      </Router>
    </StoreProvider>
  );
};

export default App;

































