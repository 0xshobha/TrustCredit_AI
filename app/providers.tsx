'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { type ReactNode, useState } from 'react';

// Define Creditcoin Testnet chain
const creditcoinTestnet = {
    id: 102031,
    name: 'Creditcoin Testnet',
    nativeCurrency: { name: 'CTC', symbol: 'tCTC', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc.cc3-testnet.creditcoin.network'] },
    },
    blockExplorers: {
        default: { name: 'Creditcoin Explorer', url: 'https://creditcoin-testnet.blockscout.com' },
    },
    testnet: true,
} as const;

const config = createConfig({
    chains: [creditcoinTestnet, mainnet],
    transports: {
        [creditcoinTestnet.id]: http(),
        [mainnet.id]: http(),
    },
    ssr: true,
});

export function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#06b6d4',
                        accentColorForeground: 'white',
                        borderRadius: 'medium',
                        fontStack: 'system',
                        overlayBlur: 'small',
                    })}
                >
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
