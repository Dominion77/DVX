'use client';

import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';
import { Product } from './types';
import Link from 'next/link';
import { GoRocket, GoClock } from "react-icons/go";
import { GiTakeMyMoney } from "react-icons/gi";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true');
      const result = await response.json();
      
      if (result.success) {
        setFeaturedProducts(result.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={() => setIsCartOpen(true)} cartItemCount={cartItemCount} />
      
     
      <section 
        className="relative h-[600px] bg-cover bg-center"
        style={{ backgroundImage: "url('/images/slider1.jpg')" }}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-md ml-auto animate-fade-in">
            <p className="text-lg mb-2">Revealing the Shimmer</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Fabrics That Matches Your Personality
            </h1>
            <div className="flex gap-4 mt-8">
              <Link href="/shop">
              <button className="px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors">
                Shop Now
              </button>
              </Link>
              <button className="px-6 py-3 border-2 border-black hover:bg-black hover:text-white transition-colors">
                Read More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Bar */}
      <section className="bg-purple-600 text-white py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <span><GoRocket /></span>
            </div>
            <span className="font-semibold">Free Shipping</span>
            <p className="text-sm opacity-90">On orders over $99</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <span><GoClock/></span>
            </div>
            <span className="font-semibold">Order Online</span>
            <p className="text-sm opacity-90">Easy 24/7 online ordering</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
              <span><GiTakeMyMoney /></span>
            </div>
            <span className="font-semibold">Shop & Save</span>
            <p className="text-sm opacity-90">Save a few bucks</p>
          </div>
        </div>
      </section>

      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-sm uppercase text-gray-500 mb-2">Top View This Week</h2>
            <h3 className="text-3xl font-bold">Product Of The Week</h3>
          </div>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button className="text-white hover:text-pink-400 transition-colors">
            <i className="fas fa-heart"></i>
          </button>
          <button className="text-white hover:text-blue-400 transition-colors">
            <i className="fas fa-search"></i>
          </button>
          <button 
            onClick={() => onAddToCart(product)}
            className="text-white hover:text-green-400 transition-colors"
          >
            <i className="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          {product.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-pink-500 text-white text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
        <h4 className="font-semibold mb-2 hover:underline cursor-pointer">
          {product.name}
        </h4>
        <p className="text-red-500 font-bold">${product.price}</p>
      </div>
    </div>
  );
}