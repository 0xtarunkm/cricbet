'use client'

import dynamic from 'next/dynamic'
import { AnchorProvider } from '@coral-xyz/anchor'
import {
    AnchorWallet,
    useConnection,
    useWallet,
    ConnectionProvider,
    WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { ReactNode, useCallback } from 'react'
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'

require('@solana/wallet-adapter-react-ui/styles.css')

export const WalletButton = dynamic(async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton, {
    ssr: false,
})

export function SolanaProvider({ children }: { children: ReactNode }) {
    const network = WalletAdapterNetwork.Devnet
    const endpoint = clusterApiUrl(network)
    const wallets = [new PhantomWalletAdapter()]
    const onError = useCallback((error: WalletError) => {
        console.error(error)
    }, [])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export function useAnchorProvider() {
    const { connection } = useConnection()
    const wallet = useWallet()

    return new AnchorProvider(connection, wallet as AnchorWallet, { commitment: 'confirmed' })
}
