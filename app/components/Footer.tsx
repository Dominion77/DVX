'use client'

import { FaFacebook, FaInstagram, FaPinterest } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { FiMapPin, FiClipboard, FiShield, FiHelpCircle, FiTruck, FiCreditCard } from 'react-icons/fi';

const presentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FiHelpCircle className="w-5 h-5" />
              About Us
            </h3>
            <p className="text-gray-400 text-sm">
              Pellentesque posuere orci lobortis scelerisque blandit. Donec id tellus lacinia.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FiClipboard className="w-5 h-5" />
              Information
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <FiMapPin className="w-4 h-4" />
                Store Location
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <FiClipboard className="w-4 h-4" />
                Order & Return
              </li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2">
                <FiShield className="w-4 h-4" />
                Privacy Policy
              </li>
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              <li className="hover:text-white cursor-pointer transition-colors">Career</li>
              <li className="hover:text-white cursor-pointer transition-colors">Delivery</li>
            </ul>
          </div>

        
          <div>
            <h3 className="font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Help & FAQ's</li>
              <li className="hover:text-white cursor-pointer transition-colors">Information</li>
              <li className="hover:text-white cursor-pointer transition-colors">Shipping Details</li>
              <li className="hover:text-white cursor-pointer transition-colors">Online Payment</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-transparent border border-white text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
              />
              <button className="w-full px-4 py-3 bg-white text-black font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                <FiCreditCard className="w-5 h-5" />
                Sign Up
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-6 mt-8">
          <a href="#" className="hover:text-gray-300 transition-colors">
            <FaFacebook className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            <FaXTwitter className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            <FaInstagram className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors">
            <FaPinterest className="w-6 h-6" />
          </a>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>All Right Reserved © {presentYear}, ZeroBase</p>
        </div>
      </div>
    </footer>
  );
}