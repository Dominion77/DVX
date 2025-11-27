'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { Product } from '../types';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';

export default function Shop() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    inStock: false
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      
      const response = await fetch(`/api/products?${queryParams}`);
      const result = await response.json();
      
      if (result.success) {
        let filteredProducts = result.data.products;
        
        if (filters.inStock) {
          filteredProducts = filteredProducts.filter((p: Product) => p.inStock);
        }
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-').map(Number);
          filteredProducts = filteredProducts.filter((p: Product) => 
            p.price >= min && p.price <= max
          );
        }
        
        setProducts(filteredProducts);
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <FiFilter className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Filters</h3>
              </div>
              
              <div className="space-y-6">
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Tops">Tops</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Suits">Suits</option>
                  </select>
                </div>
                
                
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Prices</option>
                    <option value="0-25">$0 - $25</option>
                    <option value="25-50">$25 - $50</option>
                    <option value="50-100">$50 - $100</option>
                  </select>
                </div>
                
              
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={filters.inStock}
                    onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="inStock" className="ml-2 text-sm font-medium">
                    In Stock Only
                  </label>
                </div>
                
                <button
                  onClick={() => setFilters({ category: '', priceRange: '', inStock: false })}
                  className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">All Products</h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-900 text-white' : 'bg-gray-200'}`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={addToCart}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
            
            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

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

function ProductCard({ product, onAddToCart, viewMode }: { 
  product: Product; 
  onAddToCart: (product: Product) => void;
  viewMode: 'grid' | 'list';
}) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-48 h-48 object-cover"
          />
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <span className="text-2xl font-bold text-red-500">${product.price}</span>
            </div>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex gap-2 mb-4">
              {product.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-blue-900  text-white text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-4 text-sm text-gray-500">
                <span>Sizes: {product.sizes.join(', ')}</span>
                <span>Colors: {product.colors.join(', ')}</span>
                <span className={product.inStock ? 'text-green-500' : 'text-red-500'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <button
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            disabled={!product.inStock}
            className="text-white hover:text-green-400 transition-colors disabled:text-gray-400"
          >
            <i className="fas fa-cart-plus"></i>
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-2 mb-2">
          {product.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-blue-900 text-white text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
        <h4 className="font-semibold mb-2 hover:underline cursor-pointer">
          {product.name}
        </h4>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-red-500 font-bold">${product.price}</p>
          <span className={`text-xs px-2 py-1 rounded ${
            product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
      </div>
    </div>
  );
}