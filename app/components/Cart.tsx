'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import PaymentModal from './PaymentModal';
import { CartItem } from '../types';
import { FiX, FiMinus, FiPlus } from 'react-icons/fi';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
}

export default function Cart({ isOpen, onClose, cartItems, setCartItems }: CartProps) {
  const [showPayment, setShowPayment] = useState(false);
  const { isConnected } = useAccount();

  const total = cartItems.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.product.id !== productId));
    } else {
      setCartItems(cartItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
        <div className="bg-white w-full max-w-md h-full overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <button 
                onClick={onClose}
                className="text-2xl hover:text-gray-600"
              >
                <FiX />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-4 border-b pb-4">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <p className="text-red-500 font-bold">${item.product.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between text-xl font-bold mb-6">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (!isConnected) {
                        alert('Please connect your wallet first');
                        return;
                      }
                      setShowPayment(true);
                    }}
                    className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors"
                  >
                    {isConnected ? 'Pay with USDC' : 'Connect Wallet to Pay'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        cartItems={cartItems}
        totalAmount={total}
      />
    </>
  );
}