
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
// import { User, Restaurant, FoodItem, Order, CartItem, UserRole, OrderStatus } from '../types';
// import { MOCK_RESTAURANTS, MOCK_FOODS } from '../constants';

// // Dynamic API URL detection
// // This ensures that if you access the site via 192.168.1.7, it calls the API at 192.168.1.7
// const getApiUrl = () => {
//     // 1. Check Vite Env Var
//     // @ts-ignore
//     if (import.meta.env && import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    
//     // 2. Dynamic Hostname
//     const hostname = window.location.hostname;
//     // If on localhost, use localhost:5000. If on network IP, use IP:5000
//     return `http://${hostname}:5000/api`;
// };

// const API_URL = getApiUrl();

// interface StoreContextType {
//   user: User | null;
//   users: User[];
//   restaurants: Restaurant[];
//   foods: FoodItem[];
//   orders: Order[];
//   cart: CartItem[];
//   login: (email: string, password: string) => Promise<boolean>;
//   register: (name: string, email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   addToCart: (item: FoodItem) => void;
//   removeFromCart: (itemId: string) => void;
//   updateCartQuantity: (itemId: string, delta: number) => void;
//   clearCart: () => void;
//   placeOrder: (deliveryDetails: { address: string; phone: string; paymentMethod: any }) => Promise<void>;
//   // Updated Return Type to include tx_ref
//   initializeChapaPayment: (deliveryDetails: { address: string; phone: string }) => Promise<{ success: boolean; url?: string; tx_ref?: string; message?: string }>;
//   updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
//   assignDelivery: (orderId: string, deliveryPersonId: string) => Promise<void>;
//   // New Admin Functions
//   addRestaurant: (data: Omit<Restaurant, 'id'>) => Promise<void>;
//   updateRestaurant: (id: string, data: Partial<Restaurant>) => Promise<void>;
//   deleteRestaurant: (id: string) => Promise<void>;
//   addFood: (data: Omit<FoodItem, 'id'>) => Promise<void>;
//   updateFood: (id: string, data: Partial<FoodItem>) => Promise<void>;
//   deleteFood: (id: string) => Promise<void>;
//   updateUserRole: (userId: string, role: UserRole) => Promise<void>;
//   adminUpdateUser: (userId: string, data: Partial<User>) => Promise<void>;
//   adminDeleteUser: (userId: string) => Promise<void>;
//   isAuthLoading: boolean;
//   refreshData: () => Promise<void>;
// }

// const StoreContext = createContext<StoreContextType | undefined>(undefined);

// export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user: clerkUser, isLoaded } = useUser();
//   const { signOut } = useClerk();
  
//   const [user, setUser] = useState<User | null>(null);
//   const [users, setUsers] = useState<User[]>([]);
//   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
//   const [foods, setFoods] = useState<FoodItem[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
//   const [isAuthLoading, setIsAuthLoading] = useState(true);

//   // 1. Clerk Synchronization (OAuth Path)
//   useEffect(() => {
//     const syncUser = async () => {
//         if (isLoaded && clerkUser) {
//             try {
//                 // Send Clerk data to backend to get local token/user object
//                 const res = await fetch(`${API_URL}/auth/sync`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         email: clerkUser.primaryEmailAddress?.emailAddress,
//                         fullName: clerkUser.fullName,
//                         avatar: clerkUser.imageUrl
//                     })
//                 });

//                 if (res.ok) {
//                     const data = await res.json();
//                     localStorage.setItem('token', data.token);
//                     setToken(data.token);
//                     setUser({ ...data, id: data._id });
//                 } else {
//                     console.error("Failed to sync Clerk user with backend");
//                 }
//             } catch (err) {
//                 console.error("Sync error:", err);
//             }
//         }
//         setIsAuthLoading(false);
//     };

//     syncUser();
//   }, [isLoaded, clerkUser]);

//   // 2. Load Initial Data (and User from Token if manually logged in)
//   useEffect(() => {
//      // If we have a token but no user (e.g. page refresh on manual auth), fetch me
//      const fetchMe = async () => {
//         if (token && !user) {
//             try {
//                 const res = await fetch(`${API_URL}/auth/me`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 if (res.ok) {
//                     const userData = await res.json();
//                     setUser({ ...userData, id: userData._id });
//                 } else {
//                     // Token invalid
//                     localStorage.removeItem('token');
//                     setToken(null);
//                 }
//             } catch (err) {
//                 console.error("Error fetching user", err);
//             }
//         }
//      };

//      if (token && !user) {
//         fetchMe();
//      }
//   }, [token, user]);

//   // 3. Load App Data
//   useEffect(() => {
//      if (user) {
//         loadData();
//      } else {
//         loadPublicData();
//      }
//   }, [user, token]);

//   const loadPublicData = async () => {
//       try {
//         const resRes = await fetch(`${API_URL}/restaurants`);
//         const resFood = await fetch(`${API_URL}/foods`);
        
//         if (!resRes.ok || !resFood.ok) throw new Error('Server returned error');

//         const dRes = await resRes.json();
//         const dFood = await resFood.json();
        
//         setRestaurants(dRes.length > 0 ? dRes.map((r:any) => ({...r, id: r._id})) : MOCK_RESTAURANTS);
//         setFoods(dFood.length > 0 ? dFood.map((f:any) => ({...f, id: f._id})) : MOCK_FOODS);
//       } catch (err) {
//         console.warn("Backend not available, using mock data:", err);
//         setRestaurants(MOCK_RESTAURANTS);
//         setFoods(MOCK_FOODS);
//       }
//   };

//   const loadData = async () => {
//       loadPublicData();

//       if (!token) return;

//       try {
//           const resOrders = await fetch(`${API_URL}/orders`, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           if (resOrders.ok) {
//             const dOrders = await resOrders.json();
//             if (Array.isArray(dOrders)) {
//                 setOrders(dOrders.map((o:any) => ({...o, id: o._id})));
//             }
//           } else if(user?.role === UserRole.CLIENT) {
//               const resMyOrders = await fetch(`${API_URL}/orders/myorders`, {
//                  headers: { Authorization: `Bearer ${token}` }
//               });
//               if (resMyOrders.ok) {
//                 const dMyOrders = await resMyOrders.json();
//                 if (Array.isArray(dMyOrders)) {
//                     setOrders(dMyOrders.map((o:any) => ({...o, id: o._id})));
//                 }
//               }
//           }

//           if (user?.role === UserRole.ADMIN) {
//              const resUsers = await fetch(`${API_URL}/auth/users`, {
//                  headers: { Authorization: `Bearer ${token}` }
//              });
//              if (resUsers.ok) {
//                  const dUsers = await resUsers.json();
//                  if (Array.isArray(dUsers)) {
//                      setUsers(dUsers.map((u:any) => ({...u, id: u._id})));
//                  }
//              }
//           }

//       } catch (err) {
//           console.error("Failed to load protected data", err);
//       }
//   };

//   const refreshData = async () => {
//     await loadData();
//   };

//   // Traditional JWT Login
//   const login = async (email: string, password: string) => {
//     try {
//         const res = await fetch(`${API_URL}/auth/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password })
//         });
        
//         if (res.ok) {
//             const data = await res.json();
//             localStorage.setItem('token', data.token);
//             setToken(data.token);
//             setUser({ ...data, id: data._id });
//             return true;
//         }
//         return false;
//     } catch (err) {
//         console.error("Login failed", err);
//         return false;
//     }
//   };

//   // Traditional JWT Register
//   const register = async (name: string, email: string, password: string) => {
//     try {
//         const res = await fetch(`${API_URL}/auth/register`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ fullName: name, email, password })
//         });
        
//         if (res.ok) {
//             const data = await res.json();
//             localStorage.setItem('token', data.token);
//             setToken(data.token);
//             setUser({ ...data, id: data._id });
//             return true;
//         }
//         return false;
//     } catch (err) {
//         console.error("Register failed", err);
//         return false;
//     }
//   };

//   const logout = () => {
//     // If Clerk user is active, sign out from Clerk
//     if (clerkUser) {
//         signOut();
//     }
//     // Always clear local state (handles both Clerk and JWT paths)
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//     setCart([]);
//     setOrders([]);
//     setUsers([]);
//   };

//   const addToCart = (item: FoodItem) => {
//     setCart(prev => {
//       const existing = prev.find(i => i.id === item.id);
//       if (existing) {
//         return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
//       }
//       return [...prev, { ...item, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (itemId: string) => {
//     setCart(prev => prev.filter(i => i.id !== itemId));
//   };

//   const updateCartQuantity = (itemId: string, delta: number) => {
//     setCart(prev => prev.map(i => {
//       if (i.id === itemId) {
//         return { ...i, quantity: Math.max(1, i.quantity + delta) };
//       }
//       return i;
//     }));
//   };

//   const clearCart = () => setCart([]);

//   const placeOrder = async (details: { address: string; phone: string; paymentMethod: any }) => {
//     if (!user || !token) return;
    
//     try {
//         const orderData = {
//             items: cart,
//             totalPrice: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
//             deliveryAddress: details.address,
//             userPhone: details.phone, // Include Phone Number
//             paymentMethod: details.paymentMethod
//         };

//         const res = await fetch(`${API_URL}/orders`, {
//             method: 'POST',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify(orderData)
//         });

//         if (res.ok) {
//             clearCart();
//             loadData();
//         } else {
//             alert("Failed to place order. Server error.");
//         }
//     } catch (err) {
//         console.error("Order failed", err);
//         alert("Network error: Could not place order.");
//     }
//   };

//   const initializeChapaPayment = async (details: { address: string; phone: string }) => {
//     if (!user || !token) return { success: false, message: 'Not authenticated' };

//     try {
//         const orderData = {
//             items: cart,
//             totalPrice: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + 50,
//             deliveryAddress: details.address,
//             userInfo: { phone: details.phone }
//         };

//         const res = await fetch(`${API_URL}/payment/chapa/initialize`, {
//             method: 'POST',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify(orderData)
//         });

//         const contentType = res.headers.get("content-type");
//         if (contentType && contentType.indexOf("application/json") !== -1) {
//             const data = await res.json();
            
//             if (res.ok && data.checkout_url) {
//                 // Pass back tx_ref for dev simulation
//                 return { success: true, url: data.checkout_url, tx_ref: data.tx_ref };
//             } else {
//                 return { 
//                     success: false, 
//                     message: data.details || data.message || 'Payment initialization failed' 
//                 };
//             }
//         }
//         return { success: false, message: 'Invalid server response' };
//     } catch (err: any) {
//         console.error("Chapa init failed", err);
//         return { success: false, message: err.message || 'Connection error' };
//     }
//   };

//   const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/orders/${orderId}/status`, {
//             method: 'PUT',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({ status })
//         });
//         setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
//     } catch (err) {
//         console.error(err);
//     }
//   };

//   const assignDelivery = async (orderId: string, deliveryPersonId: string) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/orders/${orderId}/status`, {
//             method: 'PUT',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({ deliveryPersonId, status: OrderStatus.IN_PROGRESS })
//         });
//         setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryPersonId, status: OrderStatus.IN_PROGRESS } : o));
//     } catch (err) {
//         console.error(err);
//     }
//   };

//   // --- Admin Functions ---

//   const addRestaurant = async (data: Omit<Restaurant, 'id'>) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/restaurants`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(data)
//         });
//         loadPublicData();
//     } catch(err) { console.error(err); }
//   };

//   const updateRestaurant = async (id: string, data: Partial<Restaurant>) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/restaurants/${id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(data)
//         });
//         loadPublicData();
//     } catch(err) { console.error(err); }
//   };

//   const deleteRestaurant = async (id: string) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/restaurants/${id}`, {
//             method: 'DELETE',
//             headers: { 'Authorization': `Bearer ${token}` }
//         });
//         loadPublicData();
//     } catch(err) { console.error(err); }
//   };

//   const addFood = async (data: Omit<FoodItem, 'id'>) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/foods`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(data)
//         });
//         loadPublicData();
//     } catch(err) { console.error(err); }
//   };

//   const updateFood = async (id: string, data: Partial<FoodItem>) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/foods/${id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(data)
//         });
//         loadPublicData();
//     } catch(err) { console.error(err); }
//   };

//   const deleteFood = async (id: string) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/foods/${id}`, {
//             method: 'DELETE',
//             headers: { 'Authorization': `Bearer ${token}` }
//         });
//         loadPublicData();
//     } catch(err) { console.error(err); }
//   };

//   // Legacy role update
//   const updateUserRole = async (userId: string, role: UserRole) => {
//     if (!token) return;
//     try {
//         const res = await fetch(`${API_URL}/auth/users/${userId}/role`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify({ role })
//         });
//         if(res.ok) {
//             setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
//         }
//     } catch(err) { console.error(err); }
//   };

//   // New Comprehensive Update (Role + Phone)
//   const adminUpdateUser = async (userId: string, data: Partial<User>) => {
//       if (!token) return;
//       try {
//           const res = await fetch(`${API_URL}/auth/users/${userId}`, {
//               method: 'PUT',
//               headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//               body: JSON.stringify(data)
//           });
//           if (res.ok) {
//               const responseData = await res.json();
//               // Update local state
//               setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
//           }
//       } catch (err) { console.error(err); }
//   };

//   // Terminate User
//   const adminDeleteUser = async (userId: string) => {
//       if (!token) return;
//       try {
//           const res = await fetch(`${API_URL}/auth/users/${userId}`, {
//               method: 'DELETE',
//               headers: { 'Authorization': `Bearer ${token}` }
//           });
//           if (res.ok) {
//               setUsers(prev => prev.filter(u => u.id !== userId));
//           }
//       } catch (err) { console.error(err); }
//   };

//   return (
//     <StoreContext.Provider value={{
//       user, users, restaurants, foods, orders, cart,
//       login, register, logout, addToCart, removeFromCart, updateCartQuantity, clearCart,
//       placeOrder, initializeChapaPayment, updateOrderStatus, assignDelivery,
//       addRestaurant, updateRestaurant, deleteRestaurant, addFood, updateFood, deleteFood, 
//       updateUserRole, adminUpdateUser, adminDeleteUser,
//       isAuthLoading, refreshData
//     }}>
//       {children}
//     </StoreContext.Provider>
//   );
// };

// export const useStore = () => {
//   const context = useContext(StoreContext);
//   if (!context) throw new Error('useStore must be used within a StoreProvider');
//   return context;
// };



















// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
// import { User, Restaurant, FoodItem, Order, CartItem, UserRole, OrderStatus } from '../types';
// import { MOCK_RESTAURANTS, MOCK_FOODS } from '../constants';

// // Dynamic API URL detection
// // This function is crucial for switching between local (http://localhost:5000/api) 
// // and Vercel production (relative path /api).
// const getApiUrl = () => {
//     // 1. Check Vite Env Var (Highest Priority)
//     // @ts-ignore
//     if (import.meta.env && import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    
//     // 2. Dynamic Hostname Check (Local Development)
//     const hostname = window.location.hostname;
//     const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.');
    
//     if (isLocalDev) {
//         // Use absolute URL with port 5000 for local dev/network testing
//         return `http://${hostname}:5000/api`;
//     }

//     // 3. Production Environment (Vercel)
//     // On Vercel, the vercel.json routes the relative path /api to the serverless function.
//     return '/api'; 
// };

// const API_URL = getApiUrl();

// interface StoreContextType {
//   user: User | null;
//   users: User[];
//   restaurants: Restaurant[];
//   foods: FoodItem[];
//   orders: Order[];
//   cart: CartItem[];
//   login: (email: string, password: string) => Promise<boolean>;
//   register: (name: string, email: string, password: string) => Promise<boolean>;
//   logout: () => void;
//   addToCart: (item: FoodItem) => void;
//   removeFromCart: (itemId: string) => void;
//   updateCartQuantity: (itemId: string, delta: number) => void;
//   clearCart: () => void;
//   placeOrder: (deliveryDetails: { address: string; phone: string; paymentMethod: any }) => Promise<void>;
//   // Updated Return Type to include tx_ref
//   initializeChapaPayment: (deliveryDetails: { address: string; phone: string }) => Promise<{ success: boolean; url?: string; tx_ref?: string; message?: string }>;
//   updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
//   assignDelivery: (orderId: string, deliveryPersonId: string) => Promise<void>;
//   // New Admin Functions
//   addRestaurant: (data: Omit<Restaurant, 'id'>) => Promise<void>;
//   updateRestaurant: (id: string, data: Partial<Restaurant>) => Promise<void>;
//   deleteRestaurant: (id: string) => Promise<void>;
//   addFood: (data: Omit<FoodItem, 'id'>) => Promise<void>;
//   updateFood: (id: string, data: Partial<FoodItem>) => Promise<void>;
//   deleteFood: (id: string) => Promise<void>;
//   updateUserRole: (userId: string, role: UserRole) => Promise<void>;
//   adminUpdateUser: (userId: string, data: Partial<User>) => Promise<void>;
//   adminDeleteUser: (userId: string) => Promise<void>;
//   isAuthLoading: boolean;
//   refreshData: () => Promise<void>;
// }

// const StoreContext = createContext<StoreContextType | undefined>(undefined);

// export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user: clerkUser, isLoaded } = useUser();
//   const { signOut } = useClerk();
//   
//   const [user, setUser] = useState<User | null>(null);
//   const [users, setUsers] = useState<User[]>([]);
//   const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
//   const [foods, setFoods] = useState<FoodItem[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
//   const [isAuthLoading, setIsAuthLoading] = useState(true);

//   // 1. Clerk Synchronization (OAuth Path)
//   useEffect(() => {
//     const syncUser = async () => {
//         if (isLoaded && clerkUser) {
//             try {
//                 // Send Clerk data to backend to get local token/user object
//                 const res = await fetch(`${API_URL}/auth/sync`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         email: clerkUser.primaryEmailAddress?.emailAddress,
//                         fullName: clerkUser.fullName,
//                         avatar: clerkUser.imageUrl
//                     })
//                 });

//                 if (res.ok) {
//                     const data = await res.json();
//                     localStorage.setItem('token', data.token);
//                     setToken(data.token);
//                     setUser({ ...data, id: data._id });
//                 } else {
//                     console.error("Failed to sync Clerk user with backend");
//                 }
//             } catch (err) {
//                 console.error("Sync error:", err);
//             }
//         }
//         setIsAuthLoading(false);
//     };

//     syncUser();
//   }, [isLoaded, clerkUser]);

//   // 2. Load Initial Data (and User from Token if manually logged in)
//   useEffect(() => {
//      // If we have a token but no user (e.g. page refresh on manual auth), fetch me
//      const fetchMe = async () => {
//         if (token && !user) {
//             try {
//                 const res = await fetch(`${API_URL}/auth/me`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 if (res.ok) {
//                     const userData = await res.json();
//                     setUser({ ...userData, id: userData._id });
//                 } else {
//                     // Token invalid
//                     localStorage.removeItem('token');
//                     setToken(null);
//                 }
//             } catch (err) {
//                 console.error("Error fetching user", err);
//             }
//         }
//      };

//      if (token && !user) {
//         fetchMe();
//      }
//   }, [token, user]);

//   // 3. Load App Data
//   useEffect(() => {
//      if (user) {
//         loadData();
//      } else {
//         loadPublicData();
//      }
//   }, [user, token]);

//   const loadPublicData = async () => {
//       try {
//         const resRes = await fetch(`${API_URL}/restaurants`);
//         const resFood = await fetch(`${API_URL}/foods`);
//         
//         if (!resRes.ok || !resFood.ok) throw new Error('Server returned error');

//         const dRes = await resRes.json();
//         const dFood = await resFood.json();
//         
//         setRestaurants(dRes.length > 0 ? dRes.map((r:any) => ({...r, id: r._id})) : MOCK_RESTAURANTS);
//         setFoods(dFood.length > 0 ? dFood.map((f:any) => ({...f, id: f._id})) : MOCK_FOODS);
//       } catch (err) {
//         console.warn("Backend not available, using mock data:", err);
//         setRestaurants(MOCK_RESTAURANTS);
//         setFoods(MOCK_FOODS);
//       }
//   };

//   const loadData = async () => {
//       loadPublicData();

//       if (!token) return;

//       try {
//           const resOrders = await fetch(`${API_URL}/orders`, {
//             headers: { Authorization: `Bearer ${token}` }
//           });
//           if (resOrders.ok) {
//             const dOrders = await resOrders.json();
//             if (Array.isArray(dOrders)) {
//                 setOrders(dOrders.map((o:any) => ({...o, id: o._id})));
//             }
//           } else if(user?.role === UserRole.CLIENT) {
//               const resMyOrders = await fetch(`${API_URL}/orders/myorders`, {
//                  headers: { Authorization: `Bearer ${token}` }
//               });
//               if (resMyOrders.ok) {
//                 const dMyOrders = await resMyOrders.json();
//                 if (Array.isArray(dMyOrders)) {
//                     setOrders(dMyOrders.map((o:any) => ({...o, id: o._id})));
//                 }
//               }
//           }

//           if (user?.role === UserRole.ADMIN) {
//              const resUsers = await fetch(`${API_URL}/auth/users`, {
//                  headers: { Authorization: `Bearer ${token}` }
//              });
//              if (resUsers.ok) {
//                  const dUsers = await resUsers.json();
//                  if (Array.isArray(dUsers)) {
//                      setUsers(dUsers.map((u:any) => ({...u, id: u._id})));
//                  }
//              }
//           }

//       } catch (err) {
//           console.error("Failed to load protected data", err);
//       }
//   };

//   const refreshData = async () => {
//     await loadData();
//   };

//   // Traditional JWT Login
//   const login = async (email: string, password: string) => {
//     try {
//         const res = await fetch(`${API_URL}/auth/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password })
//         });
//         
//         if (res.ok) {
//             const data = await res.json();
//             localStorage.setItem('token', data.token);
//             setToken(data.token);
//             setUser({ ...data, id: data._id });
//             return true;
//         }
//         return false;
//     } catch (err) {
//         console.error("Login failed", err);
//         return false;
//     }
//   };

//   // Traditional JWT Register
//   const register = async (name: string, email: string, password: string) => {
//     try {
//         const res = await fetch(`${API_URL}/auth/register`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ fullName: name, email, password })
//         });
//         
//         if (res.ok) {
//             const data = await res.json();
//             localStorage.setItem('token', data.token);
//             setToken(data.token);
//             setUser({ ...data, id: data._id });
//             return true;
//         }
//         return false;
//     } catch (err) {
//         console.error("Register failed", err);
//         return false;
//     }
//   };

//   const logout = () => {
//     // If Clerk user is active, sign out from Clerk
//     if (clerkUser) {
//         signOut();
//     }
//     // Always clear local state (handles both Clerk and JWT paths)
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//     setCart([]);
//     setOrders([]);
//     setUsers([]);
//   };

//   const addToCart = (item: FoodItem) => {
//     setCart(prev => {
//       const existing = prev.find(i => i.id === item.id);
//       if (existing) {
//         return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
//       }
//       return [...prev, { ...item, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (itemId: string) => {
//     setCart(prev => prev.filter(i => i.id !== itemId));
//   };

//   const updateCartQuantity = (itemId: string, delta: number) => {
//     setCart(prev => prev.map(i => {
//       if (i.id === itemId) {
//         return { ...i, quantity: Math.max(1, i.quantity + delta) };
//       }
//       return i;
//     }));
//   };

//   const clearCart = () => setCart([]);

//   const placeOrder = async (details: { address: string; phone: string; paymentMethod: any }) => {
//     if (!user || !token) return;
//     
//     try {
//         const orderData = {
//             items: cart,
//             totalPrice: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
//             deliveryAddress: details.address,
//             userPhone: details.phone, // Include Phone Number
//             paymentMethod: details.paymentMethod
//         };

//         const res = await fetch(`${API_URL}/orders`, {
//             method: 'POST',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify(orderData)
//         });

//         if (res.ok) {
//             clearCart();
//             loadData();
//         } else {
//             alert("Failed to place order. Server error.");
//         }
//     } catch (err) {
//         console.error("Order failed", err);
//         alert("Network error: Could not place order.");
//     }
//   };

//   const initializeChapaPayment = async (details: { address: string; phone: string }) => {
//     if (!user || !token) return { success: false, message: 'Not authenticated' };

//     try {
//         const orderData = {
//             items: cart,
//             totalPrice: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + 50,
//             deliveryAddress: details.address,
//             userInfo: { phone: details.phone }
//         };

//         const res = await fetch(`${API_URL}/payment/chapa/initialize`, {
//             method: 'POST',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify(orderData)
//         });

//         const contentType = res.headers.get("content-type");
//         if (contentType && contentType.indexOf("application/json") !== -1) {
//             const data = await res.json();
//             
//             if (res.ok && data.checkout_url) {
//                 // Pass back tx_ref for dev simulation
//                 return { success: true, url: data.checkout_url, tx_ref: data.tx_ref };
//             } else {
//                 return { 
//                     success: false, 
//                     message: data.details || data.message || 'Payment initialization failed' 
//                 };
//             }
//         }
//         return { success: false, message: 'Invalid server response' };
//     } catch (err: any) {
//         console.error("Chapa init failed", err);
//         return { success: false, message: err.message || 'Connection error' };
//     }
//   };

//   const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/orders/${orderId}/status`, {
//             method: 'PUT',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({ status })
//         });
//         setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
//     } catch (err) {
//         console.error(err);
//     }
//   };

//   const assignDelivery = async (orderId: string, deliveryPersonId: string) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/orders/${orderId}/status`, {
//             method: 'PUT',
//             headers: { 
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({ deliveryPersonId, status: OrderStatus.IN_PROGRESS })
//         });
//         setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryPersonId, status: OrderStatus.IN_PROGRESS } : o));
//     } catch (err) {
//         console.error(err);
//     }
//   };

//   // --- Admin Functions ---

//   const addRestaurant = async (data: Omit<Restaurant, 'id'>) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/restaurants`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(data)
//         });
//         loadPublicData();
//     } catch(err) { console.error(err); }
//   };

//   const updateRestaurant = async (id: string, data: Partial<Restaurant>) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/restaurants/${id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(data)
//         });
//         loadPublicData();
//     } catch(err) { console.error(err); }
//   };

//   const deleteRestaurant = async (id: string) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/restaurants/${id}`, {
//             method: 'DELETE',
//             headers: { 'Authorization': `Bearer ${token}` }
//         });
//         loadPublicData();
//     } catch(err) { console.error(err); }
//   };

//   const addFood = async (data: Omit<FoodItem, 'id'>) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/foods`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(data)
//         });
//         loadPublicData();
//     } catch(err) { console.error(err); }
//   };

//   const updateFood = async (id: string, data: Partial<FoodItem>) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/foods/${id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify(data)
//         });
//         loadPublicData();
//     } catch(err) { console.error(err); }
//   };

//   const deleteFood = async (id: string) => {
//     if (!token) return;
//     try {
//         await fetch(`${API_URL}/foods/${id}`, {
//             method: 'DELETE',
//             headers: { 'Authorization': `Bearer ${token}` }
//         });
//         loadPublicData();
//     } catch(err) { console.error(err); }
//   };

//   // Legacy role update
//   const updateUserRole = async (userId: string, role: UserRole) => {
//     if (!token) return;
//     try {
//         const res = await fetch(`${API_URL}/auth/users/${userId}/role`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//             body: JSON.stringify({ role })
//         });
//         if(res.ok) {
//             setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
//         }
//     } catch(err) { console.error(err); }
//   };

//   // New Comprehensive Update (Role + Phone)
//   const adminUpdateUser = async (userId: string, data: Partial<User>) => {
//       if (!token) return;
//       try {
//           const res = await fetch(`${API_URL}/auth/users/${userId}`, {
//               method: 'PUT',
//               headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//               body: JSON.stringify(data)
//           });
//           if (res.ok) {
//               const responseData = await res.json();
//               // Update local state
//               setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
//           }
//       } catch (err) { console.error(err); }
//   };

//   // Terminate User
//   const adminDeleteUser = async (userId: string) => {
//       if (!token) return;
//       try {
//           const res = await fetch(`${API_URL}/auth/users/${userId}`, {
//               method: 'DELETE',
//               headers: { 'Authorization': `Bearer ${token}` }
//           });
//           if (res.ok) {
//               setUsers(prev => prev.filter(u => u.id !== userId));
//           }
//       } catch (err) { console.error(err); }
//   };

//   return (
//     <StoreContext.Provider value={{
//       user, users, restaurants, foods, orders, cart,
//       login, register, logout, addToCart, removeFromCart, updateCartQuantity, clearCart,
//       placeOrder, initializeChapaPayment, updateOrderStatus, assignDelivery,
//       addRestaurant, updateRestaurant, deleteRestaurant, addFood, updateFood, deleteFood, 
//       updateUserRole, adminUpdateUser, adminDeleteUser,
//       isAuthLoading, refreshData
//     }}>
//       {children}
//     </StoreContext.Provider>
//   );
// };

// export const useStore = () => {
//   const context = useContext(StoreContext);
//   if (!context) throw new Error('useStore must be used within a StoreProvider');
//   return context;
// };



























































import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { User, Restaurant, FoodItem, Order, CartItem, UserRole, OrderStatus } from '../types';
import { MOCK_RESTAURANTS, MOCK_FOODS } from '../constants';

// Dynamic API URL detection
// This ensures that if you access the site via 192.168.1.7, it calls the API at 192.168.1.7
const getApiUrl = () => {
    // 1. Check Vite Env Var
    // @ts-ignore
    if (import.meta.env && import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
    
    // 2. Dynamic Hostname
    const hostname = window.location.hostname;
    // Default fallback: Use the current hostname/IP but explicitly set port 5000 for the API
    return `http://${hostname}:5000/api`;
};

const API_URL = getApiUrl();

interface StoreContextType {
  user: User | null;
  users: User[];
  restaurants: Restaurant[];
  foods: FoodItem[];
  orders: Order[];
  cart: CartItem[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addToCart: (item: FoodItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: (deliveryDetails: { address: string; phone: string; paymentMethod: any }) => Promise<void>;
  initializeChapaPayment: (deliveryDetails: { address: string; phone: string }) => Promise<{ success: boolean; url?: string; tx_ref?: string; message?: string }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  assignDelivery: (orderId: string, deliveryPersonId: string) => Promise<void>;
  // New Admin Functions
  addRestaurant: (data: Omit<Restaurant, 'id'>) => Promise<void>;
  updateRestaurant: (id: string, data: Partial<Restaurant>) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
  addFood: (data: Omit<FoodItem, 'id'>) => Promise<void>;
  updateFood: (id: string, data: Partial<FoodItem>) => Promise<void>;
  deleteFood: (id: string) => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  adminUpdateUser: (userId: string, data: Partial<User>) => Promise<void>;
  adminDeleteUser: (userId: string) => Promise<void>;
  isAuthLoading: boolean;
  refreshData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // 1. Clerk Synchronization (OAuth Path)
  useEffect(() => {
    const syncUser = async () => {
        if (isLoaded && clerkUser) {
            try {
                // Send Clerk data to backend to get local token/user object
                const res = await fetch(`${API_URL}/auth/sync`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: clerkUser.primaryEmailAddress?.emailAddress,
                        fullName: clerkUser.fullName,
                        avatar: clerkUser.imageUrl
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                    setUser({ ...data, id: data._id });
                } else {
                    console.error("Failed to sync Clerk user with backend");
                }
            } catch (err) {
                console.error("Sync error:", err);
            }
        }
        setIsAuthLoading(false);
    };

    syncUser();
  }, [isLoaded, clerkUser]);

  // 2. Load Initial Data (and User from Token if manually logged in)
  useEffect(() => {
     // If we have a token but no user (e.g. page refresh on manual auth), fetch me
     const fetchMe = async () => {
        if (token && !user) {
            try {
                const res = await fetch(`${API_URL}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const userData = await res.json();
                    setUser({ ...userData, id: userData._id });
                } else {
                    // Token invalid
                    localStorage.removeItem('token');
                    setToken(null);
                }
            } catch (err) {
                console.error("Error fetching user", err);
            }
        }
     };

     if (token && !user) {
        fetchMe();
     }
  }, [token, user]);

  // 3. Load App Data
  useEffect(() => {
     if (user) {
        loadData();
     } else {
        loadPublicData();
     }
  }, [user, token]);

  const loadPublicData = async () => {
      try {
        const resRes = await fetch(`${API_URL}/restaurants`);
        // FIX: Corrected endpoint to use the consolidated route prefix
        const resFood = await fetch(`${API_URL}/restaurants/foods`); 
        
        if (!resRes.ok || !resFood.ok) throw new Error('Server returned error');

        const dRes = await resRes.json();
        const dFood = await resFood.json();
        
        setRestaurants(dRes.length > 0 ? dRes.map((r:any) => ({...r, id: r._id})) : MOCK_RESTAURANTS);
        setFoods(dFood.length > 0 ? dFood.map((f:any) => ({...f, id: f._id})) : MOCK_FOODS);
      } catch (err) {
        console.warn("Backend not available, using mock data:", err);
        setRestaurants(MOCK_RESTAURANTS);
        setFoods(MOCK_FOODS);
      }
  };

  const loadData = async () => {
      loadPublicData();

      if (!token) return;

      try {
          const resOrders = await fetch(`${API_URL}/orders`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (resOrders.ok) {
            const dOrders = await resOrders.json();
            if (Array.isArray(dOrders)) {
                setOrders(dOrders.map((o:any) => ({...o, id: o._id})));
            }
          } else if(user?.role === UserRole.CLIENT) {
              const resMyOrders = await fetch(`${API_URL}/orders/myorders`, {
                 headers: { Authorization: `Bearer ${token}` }
              });
              if (resMyOrders.ok) {
                const dMyOrders = await resMyOrders.json();
                if (Array.isArray(dMyOrders)) {
                    setOrders(dMyOrders.map((o:any) => ({...o, id: o._id})));
                }
              }
          }

          if (user?.role === UserRole.ADMIN) {
             const resUsers = await fetch(`${API_URL}/auth/users`, {
                 headers: { Authorization: `Bearer ${token}` }
             });
             if (resUsers.ok) {
                 const dUsers = await resUsers.json();
                 if (Array.isArray(dUsers)) {
                     setUsers(dUsers.map((u:any) => ({...u, id: u._id})));
                 }
             }
          }

      } catch (err) {
          console.error("Failed to load protected data", err);
      }
  };

  const refreshData = async () => {
    await loadData();
  };

  // Traditional JWT Login
  const login = async (email: string, password: string) => {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser({ ...data, id: data._id });
            return true;
        }
        return false;
    } catch (err) {
        console.error("Login failed", err);
        return false;
    }
  };

  // Traditional JWT Register
  const register = async (name: string, email: string, password: string) => {
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName: name, email, password })
        });
        
        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser({ ...data, id: data._id });
            return true;
        }
        return false;
    } catch (err) {
        console.error("Register failed", err);
        return false;
    }
  };

  const logout = () => {
    // If Clerk user is active, sign out from Clerk
    if (clerkUser) {
        signOut();
    }
    // Always clear local state (handles both Clerk and JWT paths)
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCart([]);
    setOrders([]);
    setUsers([]);
  };

  const addToCart = (item: FoodItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === itemId) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (details: { address: string; phone: string; paymentMethod: any }) => {
    if (!user || !token) return;
    
    try {
        const orderData = {
            items: cart,
            totalPrice: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
            deliveryAddress: details.address,
            userPhone: details.phone, // Include Phone Number
            paymentMethod: details.paymentMethod
        };

        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        if (res.ok) {
            clearCart();
            loadData();
        } else {
            alert("Failed to place order. Server error.");
        }
    } catch (err) {
        console.error("Order failed", err);
        alert("Network error: Could not place order.");
    }
  };

  // -----------------------------------------------------------------
  // FINAL FIX APPLIED: Chapa Initialization Route Path
  // -----------------------------------------------------------------
  const initializeChapaPayment = async (details: { address: string; phone: string }) => {
    if (!user || !token) return { success: false, message: 'Not authenticated' };

    try {
        const orderData = {
            items: cart,
            totalPrice: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + 50,
            deliveryAddress: details.address,
            userInfo: { phone: details.phone }
        };

        // 🔥 FIX: Changed '/payments/chapa/initialize' to the singular '/payment/chapa/initialize'
        const res = await fetch(`${API_URL}/payment/chapa/initialize`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        // --- Start Robust Error Handling ---
        const contentType = res.headers.get("content-type");
        let isJson = contentType && contentType.includes("application/json"); 
        let data: any = {};

        if (isJson) {
            try {
                data = await res.json();
            } catch (e) {
                console.error("Failed to parse JSON response:", e);
                isJson = false; 
            }
        }

        if (res.ok) {
            // Success path (HTTP 200)
            if (data.checkout_url) {
                return { success: true, url: data.checkout_url, tx_ref: data.tx_ref };
            } else {
                // Server returned 200 OK but missing expected data
                return { success: false, message: data.message || 'Payment server responded OK but data is missing' };
            }
        } else {
            // Request failed (HTTP Status 4xx or 5xx)
            console.error("Chapa init failed with status:", res.status, data);
            const serverError = isJson 
                ? (data.details || data.message || `Server Error (Status: ${res.status})`)
                : `Server returned non-JSON error (Status: ${res.status}). Check backend logs.`;
            
            return { 
                success: false, 
                message: serverError
            };
        }
        // --- End Robust Error Handling ---
    } catch (err: any) {
        console.error("Chapa init failed (Network/Connection error)", err);
        return { success: false, message: err.message || 'Connection error or unhandled request failure' };
    }
  };
  // -----------------------------------------------------------------

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!token) return;
    try {
        await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) {
        console.error(err);
    }
  };

  const assignDelivery = async (orderId: string, deliveryPersonId: string) => {
    if (!token) return;
    try {
        await fetch(`${API_URL}/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ deliveryPersonId, status: OrderStatus.IN_PROGRESS })
        });
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryPersonId, status: OrderStatus.IN_PROGRESS } : o));
    } catch (err) {
        console.error(err);
    }
  };

  // --- Admin Functions ---

  // NOTE: Admin food/restaurant functions must now point to the /restaurants/foods routes
  // e.g. /api/restaurants/foods instead of /api/foods

  const addRestaurant = async (data: Omit<Restaurant, 'id'>) => {
    if (!token) return;
    try {
        await fetch(`${API_URL}/restaurants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        loadPublicData();
    } catch(err) { console.error(err); }
  };

  const updateRestaurant = async (id: string, data: Partial<Restaurant>) => {
    if (!token) return;
    try {
        await fetch(`${API_URL}/restaurants/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        loadPublicData();
    } catch(err) { console.error(err); }
  };

  const deleteRestaurant = async (id: string) => {
    if (!token) return;
    try {
        await fetch(`${API_URL}/restaurants/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadPublicData();
    } catch(err) { console.error(err); }
  };

  // FIX: Updated URL from /api/foods to /api/restaurants/foods
  const addFood = async (data: Omit<FoodItem, 'id'>) => {
    if (!token) return;
    try {
        await fetch(`${API_URL}/restaurants/foods`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        loadPublicData();
    } catch(err) { console.error(err); }
  };

  // FIX: Updated URL from /api/foods/:id to /api/restaurants/foods/:id
  const updateFood = async (id: string, data: Partial<FoodItem>) => {
    if (!token) return;
    try {
        await fetch(`${API_URL}/restaurants/foods/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(data)
        });
        loadPublicData();
    } catch(err) { console.error(err); }
  };

  // FIX: Updated URL from /api/foods/:id to /api/restaurants/foods/:id
  const deleteFood = async (id: string) => {
    if (!token) return;
    try {
        await fetch(`${API_URL}/restaurants/foods/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        loadPublicData();
    } catch(err) { console.error(err); }
  };

  // Legacy role update
  const updateUserRole = async (userId: string, role: UserRole) => {
    if (!token) return;
    try {
        const res = await fetch(`${API_URL}/auth/users/${userId}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ role })
        });
        if(res.ok) {
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
        }
    } catch(err) { console.error(err); }
  };

  // New Comprehensive Update (Role + Phone)
  const adminUpdateUser = async (userId: string, data: Partial<User>) => {
      if (!token) return;
      try {
          const res = await fetch(`${API_URL}/auth/users/${userId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify(data)
          });
          if (res.ok) {
              const responseData = await res.json();
              // Update local state
              setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
          }
      } catch (err) { console.error(err); }
  };

  // Terminate User
  const adminDeleteUser = async (userId: string) => {
      if (!token) return;
      try {
          const res = await fetch(`${API_URL}/auth/users/${userId}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
              setUsers(prev => prev.filter(u => u.id !== userId));
          }
      } catch (err) { console.error(err); }
  };

  return (
    <StoreContext.Provider value={{
      user, users, restaurants, foods, orders, cart,
      login, register, logout, addToCart, removeFromCart, updateCartQuantity, clearCart,
      placeOrder, initializeChapaPayment, updateOrderStatus, assignDelivery,
      addRestaurant, updateRestaurant, deleteRestaurant, addFood, updateFood, deleteFood, 
      updateUserRole, adminUpdateUser, adminDeleteUser,
      isAuthLoading, refreshData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};