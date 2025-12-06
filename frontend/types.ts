
export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
  DELIVERY = 'DELIVERY',
}

export enum OrderStatus {
  PENDING = 'Pending',
  PENDING_PAYMENT = 'Pending Payment',
  IN_PROGRESS = 'In Progress',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
}

export enum PaymentMethod {
  CASH = 'Cash',
  CHAPA = 'Chapa (Telebirr/Bank)',
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  address?: string;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number; // In ETB
  category: string;
  imageUrl: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  imageUrl: string;
  recommended: boolean;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string; 
  items: CartItem[];
  totalPrice: number;
  status: OrderStatus;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  deliveryPersonId?: string | User; // Updated to allow populated object
  tx_ref?: string;
  paymentStatus?: 'Pending' | 'Paid' | 'Failed';
  createdAt: string;
}

export interface DeliveryStat {
  date: string;
  sales: number;
  orders: number;
}