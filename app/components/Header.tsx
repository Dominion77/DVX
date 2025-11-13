'use client';

import { useState } from 'react';
import { FiSearch, FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';
import WalletConnect from './WalletConnect';
import Link from 'next/link';

interface HeaderProps {
  onCartClick: () => void;
  cartItemCount: number;
}

export default function Header({ onCartClick, cartItemCount }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-wider">LACOZT</h1>
            
            
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-l focus:outline-none focus:border-black"
                />
                <button className="absolute right-0 top-0 h-full px-6 bg-black text-white rounded-r hover:bg-gray-800 transition-colors">
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <WalletConnect />
              
              
              <button 
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <FiShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              
              <button 
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          
          <div className="md:hidden mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-black text-white rounded-r">
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center justify-between py-4">
            <div className="flex gap-8">
              <a href="/" className="hover:text-gray-300 transition-colors">Home</a>
              <a href="/shop" className="hover:text-gray-300 transition-colors">Catalog</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Pages</a>
              <a href="/blog" className="hover:text-gray-300 transition-colors">Blog</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-300 transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                <FaPinterest className="w-5 h-5" />
              </a>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700">
              <div className="flex flex-col gap-4">
                <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
                <Link href="/shop" className="hover:text-gray-300 transition-colors">Catalog</Link>
                <a href="#" className="hover:text-gray-300 transition-colors">Pages</a>
                <a href="/blog" className="hover:text-gray-300 transition-colors">Blog</a>
                <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
                <div className="flex gap-4 pt-4">
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    <FaFacebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    <FaTwitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    <FaInstagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="hover:text-gray-300 transition-colors">
                    <FaPinterest className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}