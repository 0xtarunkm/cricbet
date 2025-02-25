'use client'

import { getCricbetProgram, getCricbetProgramId} from '@project/anchor'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { getAssociatedTokenAddressSync, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Cluster, PublicKey, SystemProgram } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import anchor from "@coral-xyz/anchor";

export function useCricbetProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const provider = useAnchorProvider()
  
  const network = cluster?.network || 'devnet'
  const programId = useMemo(() => getCricbetProgramId(network as Cluster), [network])
  const program = useMemo(() => getCricbetProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['cricbet', 'all', { network }],
    queryFn: () => program.account.market.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { network }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
  }
}

export function useCricbetProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const { program, accounts } = useCricbetProgram()

  const accountQuery = useQuery({
    queryKey: ['cricbet', 'fetch', { cluster, account }],
    queryFn: () => program.account.market.fetch(account),
  })

  return {
    accountQuery,
  }
}

export function useCricbetSwap() {
  const { program } = useCricbetProgram()
  const { publicKey } = useWallet()

  const swapMutation = useMutation({
    mutationFn: async ({ 
      market, 
      mintYes, 
      mintNo, 
      mintUsdc,
      isBuying, 
      amountIn, 
      isYes, 
      minOut, 
      expiration = Math.floor(Date.now() / 1000) + 60
    }: { 
      market: PublicKey, 
      mintYes: PublicKey, 
      mintNo: PublicKey, 
      mintUsdc: PublicKey,
      isBuying: boolean, 
      amountIn: number, 
      isYes: boolean, 
      minOut: number, 
      expiration?: number 
    }) => {
      if (!publicKey) {
        throw new Error("Wallet not connected")
      }

      const vaultYes = getAssociatedTokenAddressSync(mintYes, market, true)
      const vaultNo = getAssociatedTokenAddressSync(mintNo, market, true)
      const vaultUsdc = getAssociatedTokenAddressSync(mintUsdc, market, true)
      
      const userAtaYes = getAssociatedTokenAddressSync(mintYes, publicKey, false)
      const userAtaNo = getAssociatedTokenAddressSync(mintNo, publicKey, false)
      const userAtaUsdc = getAssociatedTokenAddressSync(mintUsdc, publicKey, false)

      try {
        const tx = await program.methods
          .swap(
            isBuying,
            new anchor.BN(amountIn),
            isYes,
            new anchor.BN(minOut),
            new anchor.BN(expiration)
          )
          .accountsStrict({
            user: publicKey,
            mintYes: mintYes,
            mintNo: mintNo,
            mintUsdc: mintUsdc,
            vaultYes: vaultYes,
            vaultNo: vaultNo,
            vaultUsdc: vaultUsdc,
            userAtaYes: userAtaYes,
            userAtaNo: userAtaNo,
            userAtaUsdc: userAtaUsdc,
            market: market,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          })
          .rpc()

        toast.success(`Success : ${tx}`);
        return tx
      } catch (error) {
        console.error('Error executing swap:', error)
        toast.error(`Swap failed: ${(error as Error).message}`)
        throw error
      }
    },
    onError: (error) => {
      toast.error(`Swap failed: ${error.message}`)
    }
  })

  return {
    swapMutation,
  }
}
