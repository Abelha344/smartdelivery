import { FoodItem, Order, OrderStatus, PaymentMethod, Restaurant, User, UserRole } from './types';

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    fullName: 'Abebe Bikila',
    email: 'client@mds.com',
    role: UserRole.CLIENT,
    avatar: 'https://i.pravatar.cc/150?u=u1',
    address: 'Kebele 16, House 404'
  },
  {
    id: 'u2',
    fullName: 'MDS Admin',
    email: 'admin@mds.com',
    role: UserRole.ADMIN,
    avatar: 'https://i.pravatar.cc/150?u=u2'
  },
  {
    id: 'u3',
    fullName: 'Dawit Delivery',
    email: 'delivery@mds.com',
    role: UserRole.DELIVERY,
    phone: '+251911234567',
    avatar: 'https://i.pravatar.cc/150?u=u3'
  }
];

// Mock Restaurants
export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Geza Gerlase',
    address: '16 Kebelle, Mekelle',
    rating: 4.8,
    recommended: true,
    imageUrl: 'https://picsum.photos/id/431/400/300'
  },
  {
    id: 'r2',
    name: 'Raey Restaurant',
    address: 'Romanat Square, Mekelle',
    rating: 4.5,
    recommended: true,
    imageUrl: 'https://picsum.photos/id/292/400/300'
  },
  {
    id: 'r3',
    name: 'Mekelle Pizza',
    address: 'Ayder Road',
    rating: 4.2,
    recommended: false,
    imageUrl: 'https://picsum.photos/id/1080/400/300'
  }
];

// Mock Food Items
export const MOCK_FOODS: FoodItem[] = [
  {
    id: 'f1',
    restaurantId: 'r1',
    name: 'Special Tibs',
    description: 'Sautéed beef with rosemary, onion, and jalapeños.',
    price: 350,
    category: 'Traditional Foods',
    imageUrl: 'https://picsum.photos/id/292/200/200'
  },
  {
    id: 'f2',
    restaurantId: 'r1',
    name: 'Shiro Tegamino',
    description: 'Rich chickpea stew served with injera.',
    price: 180,
    category: 'Fasting Foods',
    imageUrl: 'https://picsum.photos/id/312/200/200'
  },
  {
    id: 'f3',
    restaurantId: 'r2',
    name: 'Doro Wat',
    description: 'Spicy chicken stew with hard-boiled eggs.',
    price: 450,
    category: 'Traditional Foods',
    imageUrl: 'https://picsum.photos/id/835/200/200'
  },
  {
    id: 'f4',
    restaurantId: 'r3',
    name: 'Beef Burger',
    description: 'Juicy beef patty with cheese and special sauce.',
    price: 250,
    category: 'Burger & Sandwiches',
    imageUrl: 'https://picsum.photos/id/163/200/200'
  },
  {
    id: 'f5',
    restaurantId: 'r3',
    name: 'Margherita Pizza',
    description: 'Classic tomato and mozzarella pizza.',
    price: 300,
    category: 'PIZZA',
    imageUrl: 'https://picsum.photos/id/365/200/200'
  },
  {
    id: 'f6',
    restaurantId: 'r3',
    name: 'Club Sandwich',
    description: 'Triple decker sandwich with grilled chicken.',
    price: 220,
    category: 'Burger & Sandwiches',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop'
  },
  {
    id: 'f7',
    restaurantId: 'r2',
    name: 'Fasting Firfir',
    description: 'Spicy torn injera mixed with berbere sauce.',
    price: 140,
    category: 'Fasting Foods',
    imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&h=400&fit=crop'
  }
];

// Mock Orders
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001',
    userId: 'u1',
    userName: 'Abebe Bikila',
    items: [{ ...MOCK_FOODS[0], quantity: 2 }],
    totalPrice: 700,
    status: OrderStatus.DELIVERED,
    deliveryAddress: 'Kebele 16, House 404',
    paymentMethod: PaymentMethod.CASH,
    deliveryPersonId: 'u3',
    createdAt: '2023-10-25T10:30:00Z'
  },
  {
    id: 'ord-002',
    userId: 'u4',
    userName: 'Hagos T',
    items: [{ ...MOCK_FOODS[3], quantity: 1 }],
    totalPrice: 250,
    status: OrderStatus.PENDING,
    deliveryAddress: 'Ayder Referral Hospital Gate',
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    createdAt: '2023-10-26T12:00:00Z'
  }
];

export const MOCK_STATS = [
  { date: 'Mon', sales: 4000, orders: 12 },
  { date: 'Tue', sales: 3000, orders: 8 },
  { date: 'Wed', sales: 2000, orders: 5 },
  { date: 'Thu', sales: 2780, orders: 10 },
  { date: 'Fri', sales: 1890, orders: 7 },
  { date: 'Sat', sales: 6390, orders: 25 },
  { date: 'Sun', sales: 3490, orders: 15 },
];