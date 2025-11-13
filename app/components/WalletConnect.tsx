'use client';

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { USDC_CONTRACT } from '../lib/blockchain';
import { truncateAddress } from '../lib/utils';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  
  const { data: usdcBalance } = useBalance({
    address: address as `0x${string}`,
    token: USDC_CONTRACT.address,
    query: {
      enabled: !!address,
    },
  });

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium flex items-center gap-2">
            <FiUser className="w-4 h-4" />
            {truncateAddress(address)}
          </div>
          {usdcBalance && (
            <div className="text-xs text-gray-600">
              {parseFloat(usdcBalance.formatted).toFixed(2)} USDC
            </div>
          )}
        </div>
        <button
          onClick={() => disconnect()}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <FiLogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
    >
      <FiUser className="w-4 h-4" />
      Connect Wallet
    </button>
  );
}