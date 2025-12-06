import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus, Order } from '../../types';
import { MapPin, Phone, CheckSquare, Navigation, ArrowLeft, FileText, X, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DeliveryDashboard: React.FC = () => {
  const { user, orders, updateOrderStatus, restaurants } = useStore();
  const navigate = useNavigate();
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);
  
  // Filter orders assigned to this delivery person
  const myOrders = orders.filter(o => o.deliveryPersonId === user?.id && o.status !== OrderStatus.DELIVERED);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleDirections = (address: string) => {
      // Use Google Maps Search query with the address
      const query = encodeURIComponent(address + ", Mekelle, Ethiopia");
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const getRestaurantName = (id: string) => {
      return restaurants.find(r => r.id === id)?.name || 'Unknown Restaurant';
  };

  // --- DETAILS MODAL ---
  const renderDetailsModal = () => {
      if (!detailsOrder) return null;

      return (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                  <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-gray-900">Task Details</h3>
                      <button onClick={() => setDetailsOrder(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto">
                      {/* Customer Info */}
                      <div className="bg-orange-50 p-4 rounded-xl mb-4">
                          <p className="text-xs text-orange-600 font-bold uppercase mb-1">Deliver To</p>
                          <p className="font-bold text-gray-900 text-lg">{detailsOrder.userName}</p>
                          <div className="flex items-center gap-2 mt-1">
                              <Phone size={14} className="text-orange-600"/>
                              <a href={`tel:${detailsOrder.userPhone}`} className="text-sm font-medium underline">{detailsOrder.userPhone || 'No Phone'}</a>
                          </div>
                          <div className="flex items-start gap-2 mt-2">
                              <MapPin size={14} className="text-orange-600 mt-0.5"/>
                              <p className="text-sm">{detailsOrder.deliveryAddress}</p>
                          </div>
                      </div>

                      {/* Payment Status */}
                      <div className="mb-6 flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                          <div>
                              <p className="text-xs text-gray-500 uppercase font-bold">Payment</p>
                              <p className="font-bold text-gray-900">{detailsOrder.paymentMethod}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${detailsOrder.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                              {detailsOrder.paymentStatus || 'Pending'}
                          </div>
                      </div>

                      {/* Items List */}
                      <div className="mb-6">
                          <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">Pickup Items</h4>
                          <div className="space-y-4">
                              {detailsOrder.items.map((item, idx) => (
                                  <div key={idx} className="flex gap-3">
                                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="flex-1">
                                          <p className="font-bold text-sm text-gray-900">{item.name}</p>
                                          <p className="text-xs text-orange-600 font-bold bg-orange-50 inline-block px-1 rounded mt-1">{getRestaurantName(item.restaurantId)}</p>
                                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                                              <span>Qty: {item.quantity}</span>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      <div className="text-center text-xs text-gray-400">
                          Order ID: #{detailsOrder.id.slice(-6)}
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderDetailsModal()}
      
      {/* Map Simulation Container (Top Half) */}
      <div className="h-[40vh] bg-gray-300 relative w-full overflow-hidden">
         {/* Back Button */}
         <button onClick={() => navigate('/')} className="absolute top-4 left-4 z-20 bg-white/90 p-2 rounded-full text-gray-700 hover:text-orange-600 shadow-md transition-colors">
            <ArrowLeft size={24} />
         </button>

         {/* Simple Visual Placeholder for a Map */}
         <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Mekelle_map.png')] bg-cover bg-center opacity-50 grayscale"></div>
         <div className="absolute inset-0 flex items-center justify-center">
            <p className="bg-white/80 px-4 py-2 rounded-md shadow-md text-gray-800 font-bold">Interactive Map View (Simulated)</p>
         </div>
         {/* Simulated Markers */}
         <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
               <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
               <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">You</div>
            </div>
         </div>
         {myOrders.length > 0 && (
             <div className="absolute top-1/2 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                   <div className="w-8 h-8 text-orange-600 drop-shadow-md"><MapPin fill="currentColor" /></div>
                   <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 text-xs px-2 py-1 rounded font-bold shadow-sm whitespace-nowrap">Order #{myOrders[0].id.slice(-4)}</div>
                </div>
             </div>
         )}
      </div>

      {/* Task List (Bottom Half) */}
      <div className="p-4 -mt-6 relative z-10">
         <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-gray-900 ml-2">Active Deliveries ({myOrders.length})</h2>
            
            {myOrders.length === 0 ? (
               <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <CheckSquare className="text-gray-400 w-8 h-8" />
                  </div>
                  <p className="text-gray-500">No active orders assigned. You are online and waiting.</p>
               </div>
            ) : (
               myOrders.map(order => (
                 <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-orange-500">
                    <div className="p-5">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <span className="inline-block px-2 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-md mb-2">
                                {order.status}
                             </span>
                             <h3 className="text-lg font-bold text-gray-900">{order.userName}</h3>
                             <p className="text-sm text-gray-500">Order #{order.id}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-lg font-bold text-gray-900">{order.totalPrice} ETB</p>
                             <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                          </div>
                       </div>
                       
                       <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
                          <div className="flex items-start text-sm text-gray-700">
                             <MapPin size={16} className="mr-2 mt-0.5 text-gray-400" />
                             <span className="font-medium">{order.deliveryAddress}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                             <Phone size={16} className="mr-2 text-gray-400" />
                             {order.userPhone ? (
                                <a href={`tel:${order.userPhone}`} className="text-blue-600 cursor-pointer hover:underline font-medium">
                                   {order.userPhone} (Call)
                                </a>
                             ) : (
                                <span className="text-gray-400 italic">No phone number</span>
                             )}
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3 mb-3">
                          <button 
                            onClick={() => handleDirections(order.deliveryAddress)}
                            className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                             <Navigation size={16} className="mr-2" />
                             Directions
                          </button>
                          <button 
                             onClick={() => setDetailsOrder(order)}
                             className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                             <FileText size={16} className="mr-2" />
                             Details
                          </button>
                       </div>

                        {order.status === OrderStatus.OUT_FOR_DELIVERY ? (
                            <button 
                            onClick={() => handleUpdateStatus(order.id, OrderStatus.DELIVERED)}
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                            >
                            Mark Delivered
                            </button>
                        ) : (
                            <button 
                            onClick={() => handleUpdateStatus(order.id, OrderStatus.OUT_FOR_DELIVERY)}
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                            >
                            Start Delivery
                            </button>
                        )}
                    </div>
                 </div>
               ))
            )}
         </div>
      </div>
    </div>
  );
};