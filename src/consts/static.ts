import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
export const SOLANA_MAINNET_GENESIS_HASH =
  "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d";
export const DEFAULT_PUBLICKEY = new PublicKey(0);
export const DECIMAL = 6;
export const MINT = new PublicKey(
  "2mgv5DmCpkkNkhfwR4zrKNwDz2KMYHnEMkBQr1EHCkj8"
);

export const USDC_MAIN = {
  tokenProgram: TOKEN_PROGRAM_ID,
  symbol: "USDC",
  address: MINT,
  decimals: DECIMAL,
  name: "USD Coin",
  logoURI:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
};

export const TREASURY = new PublicKey(
  "2JaukYkmeHE19CX9syTNZBb8EyKP6C11mmcM1LgzfD6W"
);
export const animationDuration = 400;
