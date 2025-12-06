import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { MOCK_STATS } from '../../constants';
import { OrderStatus, UserRole, Restaurant, FoodItem, User, Order } from '../../types';
import { 
  Users, ShoppingBag, DollarSign, Truck, ArrowLeft, LayoutGrid, 
  ClipboardList, UtensilsCrossed, Plus, Trash2, Edit2, Search, Filter, Upload, Image as ImageIcon, Star, Phone, Eye, X, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000'];

export const AdminDashboard: React.FC = () => {
  const { 
    orders, users, restaurants, foods, 
    updateOrderStatus, assignDelivery, 
    addRestaurant, updateRestaurant, deleteRestaurant, 
    addFood, updateFood, deleteFood, 
    adminUpdateUser, adminDeleteUser 
  } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'restaurants' | 'menu' | 'users'>('overview');

  // --- OVERVIEW DATA ---
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status === OrderStatus.DELIVERED ? o.totalPrice : 0), 0);
  // Simulating 20% Profit Margin
  const totalProfit = totalRevenue * 0.2; 
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;

  const orderStatusData = [
    { name: 'Pending', value: orders.filter(o => o.status === OrderStatus.PENDING).length },
    { name: 'In Progress', value: orders.filter(o => o.status === OrderStatus.IN_PROGRESS).length },
    { name: 'Out for Delivery', value: orders.filter(o => o.status === OrderStatus.OUT_FOR_DELIVERY).length },
    { name: 'Delivered', value: orders.filter(o => o.status === OrderStatus.DELIVERED).length },
  ];

  // --- SUB-COMPONENT: OVERVIEW ---
  const Overview = () => (
    <div className="space-y-6 animate-fade-in">
       {/* KPIs */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</span>
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-extrabold text-gray-900">{totalRevenue.toLocaleString()} <span className="text-sm font-normal text-gray-500">ETB</span></h2>
                 <div className="p-2 bg-green-100 text-green-600 rounded-lg"><DollarSign size={24} /></div>
              </div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Profit (Est)</span>
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-extrabold text-gray-900">{totalProfit.toLocaleString()} <span className="text-sm font-normal text-gray-500">ETB</span></h2>
                 <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><DollarSign size={24} /></div>
              </div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Orders</span>
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-extrabold text-gray-900">{totalOrders}</h2>
                 <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><ShoppingBag size={24} /></div>
              </div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Pending</span>
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-extrabold text-red-600">{pendingOrders}</h2>
                 <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Truck size={24} /></div>
              </div>
           </div>
       </div>

       {/* Charts */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Sales Trend (Last 7 Days)</h3>
             <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={MOCK_STATS}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af'}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="sales" stroke="#ea580c" strokeWidth={3} dot={{r: 4}} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-6">Order Status Breakdown</h3>
             <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
          </div>
       </div>
    </div>
  );

  // --- SUB-COMPONENT: ORDER MANAGEMENT ---
  const OrderManagement = () => {
     const [filterDate, setFilterDate] = useState('');
     const [filterStatus, setFilterStatus] = useState<string>('All');
     const [filterDriver, setFilterDriver] = useState<string>('All');
     const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

     const deliveryStaff = users.filter(u => u.role === UserRole.DELIVERY);

     const filteredOrders = orders.filter(order => {
        const matchesDate = filterDate ? order.createdAt.startsWith(filterDate) : true;
        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
        const matchesDriver = filterDriver === 'All' || (filterDriver === 'Unassigned' ? !order.deliveryPersonId : (typeof order.deliveryPersonId === 'string' ? order.deliveryPersonId : order.deliveryPersonId?.id) === filterDriver);
        return matchesDate && matchesStatus && matchesDriver;
     });

     const getRestaurantName = (id: string) => restaurants.find(r => r.id === id)?.name || 'Unknown';

     return (
       <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         {/* Filters */}
         <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-4 items-end">
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Filter by Date</label>
               <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500" />
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
               <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm">
                  <option value="All">All Statuses</option>
                  {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Delivery Person</label>
               <select value={filterDriver} onChange={e => setFilterDriver(e.target.value)} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm">
                  <option value="All">All Drivers</option>
                  <option value="Unassigned">Unassigned</option>
                  {deliveryStaff.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
               </select>
            </div>
            <button onClick={() => {setFilterDate(''); setFilterStatus('All'); setFilterDriver('All');}} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-bold hover:bg-gray-300">
               Reset
            </button>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID & Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Driver</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length > 0 ? filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4 whitespace-nowrap">
                          <span className="block text-sm font-bold text-gray-900">#{order.id.slice(-6)}</span>
                          <span className="block text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userName}</td>
                       <td className="px-6 py-4 whitespace-nowrap">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`text-xs font-bold px-2 py-1 rounded-full border-0 cursor-pointer ${
                                order.status === OrderStatus.PENDING ? 'bg-red-100 text-red-800' :
                                order.status === OrderStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-800' :
                                order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                             {Object.values(OrderStatus).map(status => (
                               <option key={status} value={status}>{status}</option>
                             ))}
                          </select>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                           <select 
                             className="text-sm border-gray-300 rounded-md shadow-sm w-40"
                             value={typeof order.deliveryPersonId === 'object' ? order.deliveryPersonId.id : (order.deliveryPersonId || "")}
                             onChange={(e) => assignDelivery(order.id, e.target.value)}
                           >
                             <option value="" disabled>Select Driver</option>
                             {deliveryStaff.map(staff => (
                               <option key={staff.id} value={staff.id}>{staff.fullName}</option>
                             ))}
                           </select>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">{order.totalPrice} ETB</td>
                       <td className="px-6 py-4 whitespace-nowrap text-center">
                           <button onClick={() => setSelectedOrder(order)} className="text-gray-500 hover:text-orange-600 transition-colors">
                               <Eye size={18} />
                           </button>
                       </td>
                    </tr>
                  )) : (
                     <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">No orders found matching filters.</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Admin Detail Modal */}
         {selectedOrder && (
             <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                 <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                     <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center sticky top-0">
                         <h3 className="text-lg font-bold text-gray-900">Order #{selectedOrder.id}</h3>
                         <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={20} /></button>
                     </div>
                     <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                             <h4 className="font-bold text-gray-900 mb-2">Customer Details</h4>
                             <p className="text-sm text-gray-600"><span className="font-medium">Name:</span> {selectedOrder.userName}</p>
                             <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {selectedOrder.userPhone || 'N/A'}</p>
                             <div className="flex items-start gap-1 mt-1 text-sm text-gray-600">
                                <MapPin size={16} className="mt-0.5 text-gray-400" />
                                <span>{selectedOrder.deliveryAddress}</span>
                             </div>
                         </div>
                         <div>
                             <h4 className="font-bold text-gray-900 mb-2">Payment & Status</h4>
                             <p className="text-sm text-gray-600"><span className="font-medium">Method:</span> {selectedOrder.paymentMethod}</p>
                             <p className="text-sm text-gray-600"><span className="font-medium">Payment Status:</span> <span className={`font-bold ${selectedOrder.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'}`}>{selectedOrder.paymentStatus || 'Pending'}</span></p>
                             <p className="text-sm text-gray-600"><span className="font-medium">Delivery Status:</span> <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-bold">{selectedOrder.status}</span></p>
                         </div>
                     </div>
                     <div className="p-6 pt-0">
                         <h4 className="font-bold text-gray-900 mb-3 border-b pb-2">Order Items</h4>
                         <div className="space-y-4">
                             {selectedOrder.items.map((item, i) => (
                                 <div key={i} className="flex gap-4 items-center bg-gray-50 p-3 rounded-lg">
                                     <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-md" />
                                     <div className="flex-1">
                                         <p className="font-bold text-gray-900">{item.name}</p>
                                         <p className="text-xs text-orange-600 font-medium">{getRestaurantName(item.restaurantId)}</p>
                                     </div>
                                     <div className="text-right">
                                         <p className="text-sm font-medium">x{item.quantity}</p>
                                         <p className="text-sm font-bold">{item.price * item.quantity} ETB</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                         <div className="mt-6 flex justify-between items-center bg-gray-900 text-white p-4 rounded-lg">
                             <span className="font-bold">Total Amount</span>
                             <span className="text-xl font-bold text-orange-400">{selectedOrder.totalPrice} ETB</span>
                         </div>
                     </div>
                 </div>
             </div>
         )}
       </div>
     );
  };

  // --- SUB-COMPONENT: RESTAURANT MANAGEMENT ---
  const RestaurantManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', address: '', imageUrl: '', recommended: false });
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Client-side size check (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                 alert("File size too large. Please upload an image smaller than 10MB.");
                 return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (restaurant: Restaurant) => {
        setFormData({
            name: restaurant.name,
            address: restaurant.address,
            imageUrl: restaurant.imageUrl,
            recommended: restaurant.recommended
        });
        setEditingId(restaurant.id);
        setIsModalOpen(true);
    };

    const handleOpenAdd = () => {
        setFormData({ name: '', address: '', imageUrl: '', recommended: false });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            await updateRestaurant(editingId, formData);
        } else {
            await addRestaurant({ ...formData, rating: 4.5 });
        }
        setIsModalOpen(false);
        setFormData({ name: '', address: '', imageUrl: '', recommended: false });
        setEditingId(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Partner Restaurants</h3>
                <button onClick={handleOpenAdd} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold">
                    <Plus size={18} /> Add Restaurant
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map(r => (
                    <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                        <div className="h-40 relative">
                            <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => updateRestaurant(r.id, { recommended: !r.recommended })}
                                    className={`p-2 rounded-full shadow-md transition-colors ${r.recommended ? 'bg-orange-100 text-orange-600' : 'bg-white text-gray-400 hover:text-orange-600'}`}
                                    title={r.recommended ? "Remove Recommendation" : "Mark as Recommended"}
                                >
                                    <Star size={16} fill={r.recommended ? "currentColor" : "none"} />
                                </button>
                                <button 
                                    onClick={() => handleEdit(r)}
                                    className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 shadow-md"
                                    title="Edit Restaurant"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => { if(confirm('Delete ' + r.name + '?')) deleteRestaurant(r.id) }} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 shadow-md">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h4 className="font-bold text-gray-900">{r.name}</h4>
                            <p className="text-sm text-gray-500 mb-2">{r.address}</p>
                            {r.recommended && <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded-full">Recommended</span>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input required placeholder="Restaurant Name" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input required placeholder="Address" className="w-full border p-2 rounded" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                            
                            {/* Image Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-orange-500 transition-colors cursor-pointer relative bg-gray-50">
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/jpg, image/webp" 
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                {formData.imageUrl ? (
                                    <img src={formData.imageUrl} alt="Preview" className="h-32 w-full object-cover rounded-md" />
                                ) : (
                                    <div className="text-gray-500">
                                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm font-medium">Click to upload restaurant image</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                                    </div>
                                )}
                            </div>

                            <label className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                                <input type="checkbox" checked={formData.recommended} onChange={e => setFormData({...formData, recommended: e.target.checked})} className="rounded text-orange-600 focus:ring-orange-500" />
                                <span className="text-sm font-medium">Recommended Restaurant</span>
                            </label>
                            
                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" disabled={!formData.imageUrl} className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
  };

  // --- SUB-COMPONENT: MENU MANAGEMENT ---
  const MenuManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ 
        name: '', description: '', price: 0, category: 'Traditional Foods', 
        imageUrl: '', restaurantId: restaurants[0]?.id || '' 
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Client-side size check (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                 alert("File size too large. Please upload an image smaller than 10MB.");
                 return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = (food: FoodItem) => {
        setFormData({
            name: food.name,
            description: food.description,
            price: food.price,
            category: food.category,
            imageUrl: food.imageUrl,
            restaurantId: food.restaurantId
        });
        setEditingId(food.id);
        setIsModalOpen(true);
    };

    const handleOpenAdd = () => {
        // Reset form, default to first restaurant if available
        setFormData({ 
            name: '', description: '', price: 0, category: 'Traditional Foods', 
            imageUrl: '', restaurantId: restaurants[0]?.id || '' 
        });
        setEditingId(null);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            await updateFood(editingId, formData);
        } else {
            await addFood(formData);
        }
        setIsModalOpen(false);
        setFormData({ ...formData, name: '', description: '', price: 0, imageUrl: '' });
        setEditingId(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Food Menu Items</h3>
                <button onClick={handleOpenAdd} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold">
                    <Plus size={18} /> Add Food Item
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {foods.map(food => {
                            const restaurant = restaurants.find(r => r.id === food.restaurantId);
                            return (
                                <tr key={food.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <img src={food.imageUrl} className="w-10 h-10 rounded object-cover" alt="" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{food.name}</div>
                                            <div className="text-xs text-gray-500 truncate w-32">{food.description}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{restaurant?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{food.category}</span></td>
                                    <td className="px-6 py-4 text-sm font-bold">{food.price} ETB</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleEdit(food)} 
                                            className="text-blue-500 hover:text-blue-700"
                                            title="Edit Item"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => { if(confirm('Delete ' + food.name + '?')) deleteFood(food.id) }} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">{editingId ? 'Edit Food Item' : 'Add New Food Item'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <select required className="w-full border p-2 rounded" value={formData.restaurantId} onChange={e => setFormData({...formData, restaurantId: e.target.value})}>
                                <option value="" disabled>Select Restaurant</option>
                                {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                            <input required placeholder="Food Name" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <textarea required placeholder="Description" className="w-full border p-2 rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            <select required className="w-full border p-2 rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                {['Burger & Sandwiches', 'PIZZA', 'Fasting Foods', 'Traditional Foods'].map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input required type="number" placeholder="Price (ETB)" className="w-full border p-2 rounded" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                            
                            {/* Image Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-orange-500 transition-colors cursor-pointer relative bg-gray-50">
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/jpg, image/webp" 
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                {formData.imageUrl ? (
                                    <img src={formData.imageUrl} alt="Preview" className="h-32 w-full object-contain rounded-md" />
                                ) : (
                                    <div className="text-gray-500">
                                        <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                        <p className="text-sm font-medium">Click to upload food image</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" disabled={!formData.imageUrl} className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
  };

  // --- SUB-COMPONENT: USER MANAGEMENT ---
  const UserManagement = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ fullName: '', role: UserRole.CLIENT, phone: '' });

    const openEditModal = (u: User) => {
        setEditingUser(u);
        setFormData({
            fullName: u.fullName,
            role: u.role,
            phone: u.phone || ''
        });
        setIsEditModalOpen(true);
    };

    const handleTerminate = (userId: string, userName: string) => {
        const password = window.prompt(`TERMINATION WARNING:\n\nYou are about to permanently delete user "${userName}".\nThis action cannot be undone.\n\nPlease enter your Admin password to confirm.`);
        
        if (password) {
            // In a real app, verify password. Here we assume non-empty string is confirmation.
            adminDeleteUser(userId);
        }
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            await adminUpdateUser(editingUser.id, formData);
            setIsEditModalOpen(false);
            setEditingUser(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">User & Delivery Staff Management</h3>
                <p className="text-sm text-gray-500">Assign roles, manage phone numbers, and discipline staff.</p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map(u => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                                        {u.fullName.charAt(0)}
                                    </div>
                                    <span className="font-medium text-gray-900">{u.fullName}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                                        u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' : 
                                        u.role === UserRole.DELIVERY ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {u.phone ? u.phone : <span className="text-gray-300 italic">N/A</span>}
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button 
                                        onClick={() => openEditModal(u)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                        title="Edit User Details"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleTerminate(u.id, u.fullName)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Terminate User"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Edit User Profile</h3>
                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input 
                                    className="mt-1 w-full border border-gray-300 p-2 rounded focus:ring-orange-500 focus:border-orange-500" 
                                    value={formData.fullName} 
                                    onChange={e => setFormData({...formData, fullName: e.target.value})} 
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select 
                                    className="mt-1 w-full border border-gray-300 p-2 rounded focus:ring-orange-500 focus:border-orange-500"
                                    value={formData.role}
                                    onChange={e => setFormData({...formData, role: e.target.value as UserRole})} 
                                >
                                    {Object.values(UserRole).map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input 
                                        type="tel" 
                                        className="w-full border border-gray-300 pl-10 p-2 rounded focus:ring-orange-500 focus:border-orange-500" 
                                        placeholder="+251..."
                                        value={formData.phone} 
                                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Required for Delivery Staff to be contacted by clients.</p>
                            </div>

                            <div className="flex gap-2 justify-end mt-6">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
  };

  // --- MAIN LAYOUT ---
  const SidebarItem = ({ id, label, icon: Icon }: any) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeTab === id ? 'bg-orange-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
          <Icon size={20} />
          <span className="font-medium">{label}</span>
      </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 min-h-screen p-4 flex flex-col">
         <div className="flex items-center gap-2 mb-8 px-2">
             <button onClick={() => navigate('/')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-gray-500" />
             </button>
             <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
         </div>
         
         <div className="space-y-2 flex-1">
             <SidebarItem id="overview" label="Overview" icon={LayoutGrid} />
             <SidebarItem id="orders" label="Order System" icon={ClipboardList} />
             <SidebarItem id="restaurants" label="Restaurants" icon={UtensilsCrossed} />
             <SidebarItem id="menu" label="Food Menu" icon={ShoppingBag} />
             <SidebarItem id="users" label="Users & Roles" icon={Users} />
         </div>

         <div className="mt-auto pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
             MDS Admin v1.0
         </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
          <div className="max-w-7xl mx-auto">
             <div className="mb-8">
                 <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab.replace(/([A-Z])/g, ' $1')}</h2>
                 <p className="text-gray-500 text-sm">Manage your {activeTab} settings and view reports.</p>
             </div>
             
             {activeTab === 'overview' && <Overview />}
             {activeTab === 'orders' && <OrderManagement />}
             {activeTab === 'restaurants' && <RestaurantManagement />}
             {activeTab === 'menu' && <MenuManagement />}
             {activeTab === 'users' && <UserManagement />}
          </div>
      </main>
    </div>
  );
};