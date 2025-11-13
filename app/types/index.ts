export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  inventory: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userWallet: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  txHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRequest {
  cartItems: CartItem[];
  totalAmount: number;
  userWallet: string;
  currency: 'USDC';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SupabaseProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  featured: boolean;
  inventory: number;
  created_at: string;
  updated_at: string;
}

export interface SupabaseOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  created_at: string;
  products: SupabaseProduct;
}

export interface SupabaseOrder {
  id: string;
  user_id: string;
  user_wallet: string;
  total_amount: number;
  status: string;
  tx_hash: string;
  created_at: string;
  updated_at: string;
  order_items: SupabaseOrderItem[];
}

export interface SupabaseWishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products: SupabaseProduct;
}