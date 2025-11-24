'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { USDC_CONTRACT, MERCHANT_WALLET, formatUSDCAmount } from '../lib/blockchain';
import { CartItem } from '../types';
import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { generateOrderId } from '../lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
}

type PaymentStep = 'confirm' | 'processing' | 'success' | 'error';

export default function PaymentModal({ isOpen, onClose, cartItems, totalAmount }: PaymentModalProps) {
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('confirm');
  const [txHash, setTxHash] = useState<string>('');
  
  const { address } = useAccount();
  const { writeContract, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const handlePayment = async () => {
    if (!address) return;

    setPaymentStep('processing');
    
    const usdcAmount = formatUSDCAmount(totalAmount);
    
    writeContract({
      ...USDC_CONTRACT,
      functionName: 'transfer',
      args: [MERCHANT_WALLET, usdcAmount],
    }, {
      onSuccess: (hash) => {
        setTxHash(hash);
        // Wait for transaction confirmation
        setTimeout(() => {
          if (isConfirmed) {
            setPaymentStep('success');
            // Process order in backend
            processOrder(hash);
          }
        }, 2000);
      },
      onError: (error) => {
        console.error('Payment failed:', error);
        setPaymentStep('error');
      }
    });
  };

  

  const processOrder = async (txHash: string) => {
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          userWallet: address,
          txHash,
          currency: 'USDC'
        }),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setPaymentStep('success');
    } catch (error) {
      console.error('Order processing failed:', error);
      setPaymentStep('error');
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPaymentStep('confirm');
      setTxHash('');
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {paymentStep === 'confirm' && 'Confirm Payment'}
            {paymentStep === 'processing' && 'Processing Payment'}
            {paymentStep === 'success' && 'Payment Successful'}
            {paymentStep === 'error' && 'Payment Failed'}
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {paymentStep === 'confirm' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Order Summary:</h3>
              {cartItems.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm mb-1">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t mt-2 pt-2 font-bold">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>USDC Amount:</span>
                  <span>{totalAmount.toFixed(2)} USDC</span>
                </div>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition-colors font-semibold"
            >
              Confirm Payment
            </button>
          </div>
        )}
        
        {paymentStep === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg mb-2">Processing your payment...</p>
            <p className="text-sm text-gray-600">Please wait while we confirm your transaction</p>
            {txHash && (
              <p className="text-xs text-gray-500 mt-2 break-all">
                TX: {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </p>
            )}
          </div>
        )}
        
        {paymentStep === 'success' && (
          <div className="text-center py-8">
            <div className="text-green-500 text-4xl mb-4">
              <FiCheck className="mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">Your order has been confirmed and will be processed shortly.</p>
            <button
              onClick={handleClose}
              className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
        
        {paymentStep === 'error' && (
          <div className="text-center py-8">
            <div className="text-red-500 text-4xl mb-4">
              <FiAlertCircle className="mx-auto" />
            </div>
            <h3 className="text-xl font-bold mb-2">Payment Failed</h3>
            <p className="text-gray-600 mb-4">
              {error?.message || 'There was an error processing your payment. Please try again.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setPaymentStep('confirm')}
                className="flex-1 bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}