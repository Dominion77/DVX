import { supabase } from './supabase';
import { Product, Order, User, CartItem, SupabaseOrder, SupabaseOrderItem } from '../types';

export const db = {
  products: {
    findMany: async (filters?: { category?: string; featured?: boolean }): Promise<Product[]> => {
      let query = supabase.from('products').select('*');
      
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters?.featured !== undefined) {
        query = query.eq('featured', filters.featured);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data.map(product => ({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        description: product.description,
        category: product.category,
        tags: product.tags || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        inStock: product.in_stock,
        featured: product.featured,
        inventory: product.inventory
      }));
    },
    
    findById: async (id: string): Promise<Product | null> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) return null;
      
      return {
        id: data.id,
        name: data.name,
        price: parseFloat(data.price),
        image: data.image,
        description: data.description,
        category: data.category,
        tags: data.tags || [],
        sizes: data.sizes || [],
        colors: data.colors || [],
        inStock: data.in_stock,
        featured: data.featured,
        inventory: data.inventory
      };
    },
    
    updateInventory: async (id: string, quantity: number): Promise<boolean> => {
      // First get current inventory
      const { data: product } = await supabase
        .from('products')
        .select('inventory')
        .eq('id', id)
        .single();
      
      if (!product || product.inventory < quantity) {
        return false;
      }
      
      const { error } = await supabase
        .from('products')
        .update({ 
          inventory: product.inventory - quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      return !error;
    }
  },
  
  // Order methods
  orders: {
    create: async (orderData: {
      userWallet: string;
      items: CartItem[];
      totalAmount: number;
      status: Order['status'];
      txHash: string;
    }): Promise<Order> => {
      // First, get or create user
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('wallet_address', orderData.userWallet)
        .single();
      
      let userId = user?.id;
      
      if (!userId) {
        const { data: newUser } = await supabase
          .from('users')
          .insert({ wallet_address: orderData.userWallet })
          .select('id')
          .single();
        
        userId = newUser?.id;
      }
      
      if (!userId) {
        throw new Error('Failed to create user');
      }
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          user_wallet: orderData.userWallet,
          total_amount: orderData.totalAmount,
          status: orderData.status,
          tx_hash: orderData.txHash
        })
        .select('*')
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price_at_time: item.product.price
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      return {
        id: order.id,
        userWallet: order.user_wallet,
        items: orderData.items,
        totalAmount: parseFloat(order.total_amount),
        status: order.status as Order['status'],
        txHash: order.tx_hash,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at)
      };
    },
    
    findByWallet: async (walletAddress: string): Promise<Order[]> => {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_at_time,
            products (*)
          )
        `)
        .eq('user_wallet', walletAddress)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return orders.map((order: SupabaseOrder) => ({
        id: order.id,
        userWallet: order.user_wallet,
        items: order.order_items.map((item: SupabaseOrderItem) => ({
          product: {
            id: item.products.id,
            name: item.products.name,
            price: parseFloat(item.products.price.toString()),
            image: item.products.image,
            description: item.products.description,
            category: item.products.category,
            tags: item.products.tags || [],
            sizes: item.products.sizes || [],
            colors: item.products.colors || [],
            inStock: item.products.in_stock,
            featured: item.products.featured,
            inventory: item.products.inventory
          },
          quantity: item.quantity
        })),
        totalAmount: parseFloat(order.total_amount.toString()),
        status: order.status as Order['status'],
        txHash: order.tx_hash,
        createdAt: new Date(order.created_at),
        updatedAt: new Date(order.updated_at)
      }));
    },
    
    updateStatus: async (orderId: string, status: Order['status']): Promise<boolean> => {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
      
      return !error;
    }
  },
  
  // User methods
  users: {
    findOrCreate: async (walletAddress: string): Promise<User> => {
      // Try to find existing user
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();
      
      if (existingUser) {
        return {
          id: existingUser.id,
          walletAddress: existingUser.wallet_address,
          email: existingUser.email,
          createdAt: new Date(existingUser.created_at)
        };
      }
      
      // Create new user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({ wallet_address: walletAddress })
        .select('*')
        .single();
      
      if (error) throw error;
      
      return {
        id: newUser.id,
        walletAddress: newUser.wallet_address,
        email: newUser.email,
        createdAt: new Date(newUser.created_at)
      };
    },
    
    findByWallet: async (walletAddress: string): Promise<User | null> => {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();
      
      if (error) return null;
      
      return {
        id: user.id,
        walletAddress: user.wallet_address,
        email: user.email,
        createdAt: new Date(user.created_at)
      };
    }
  },
  
  // Wishlist methods
  wishlists: {
    add: async (userId: string, productId: string): Promise<boolean> => {
      const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: userId, product_id: productId });
      
      return !error;
    },
    
    remove: async (userId: string, productId: string): Promise<boolean> => {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
      
      return !error;
    },
    
    getUserWishlist: async (userId: string): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          products (*)
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return data.map((item: any) => {
        const productData = item.products;
        return {
          id: productData.id,
          name: productData.name,
          price: parseFloat(productData.price.toString()),
          image: productData.image,
          description: productData.description,
          category: productData.category,
          tags: productData.tags || [],
          sizes: productData.sizes || [],
          colors: productData.colors || [],
          inStock: productData.in_stock,
          featured: productData.featured,
          inventory: productData.inventory
        };
      });
    }
  }
};