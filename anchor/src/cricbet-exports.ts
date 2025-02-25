// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import CricbetIDL from '../target/idl/cricbet.json'
import type { Cricbet } from '../target/types/cricbet'

// Re-export the generated IDL and type
export { Cricbet, CricbetIDL }

// The programId is imported from the program IDL.
export const CRICBET_PROGRAM_ID = new PublicKey(CricbetIDL.address)

// This is a helper function to get the Cricbet Anchor program.
export function getCricbetProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...CricbetIDL, address: address ? address.toBase58() : CricbetIDL.address } as Cricbet, provider)
}

// This is a helper function to get the program ID for the Cricbet program depending on the cluster.
export function getCricbetProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Cricbet program on devnet and testnet.
      return new PublicKey('2MyBTmgixDjf3zZD4S48B1QugFejCxLdh9abgv87mgu2')
    case 'mainnet-beta':
    default:
      return CRICBET_PROGRAM_ID
  }
}
