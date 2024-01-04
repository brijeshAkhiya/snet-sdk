import React from "react";
import {
  WagmiConfig,
  configureChains,
  createConfig,
} from "wagmi";
import { infuraProvider } from 'wagmi/providers/infura'
import { polygonMumbai } from 'wagmi/chains'
import { connectorsForWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { 
  googleWallet,
} from '@zerodev/wagmi/rainbowkit'
export const projectId = 'b5486fa4-e3d9-450b-8428-646e757c10f6'

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [infuraProvider({apiKey: 'f36f7f706a58477884ce6fe89165666c'})]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Social',
      wallets: [
        googleWallet({chains, options: { projectId}})
    ],
  },
]);

const config = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient
})

function ZeroDevWrapper({children}: {children: React.ReactNode}) {
  return (
    <WagmiConfig config={config}>
    <RainbowKitProvider theme={darkTheme({
    accentColor: '#7F1BA4',
    accentColorForeground: 'white'})} chains={chains} modalSize="compact">
      {children}
    </RainbowKitProvider>
  </WagmiConfig>
  )
}

export default ZeroDevWrapper