import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";

import type { WalletAdapter } from "./types";
import { DEFAULT_PUBLICKEY } from "../../consts/static";
import { ensureError } from "../../utils/utils";

interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean;
  isPhantom: boolean;
  signTransaction: (
    transaction: Transaction | VersionedTransaction
  ) => Promise<Transaction | VersionedTransaction>;
  signAllTransactions: (
    transactions: Transaction[] | VersionedTransaction[]
  ) => Promise<Transaction[] | VersionedTransaction[]>;
  signMessage: (
    message: Uint8Array,
    display?: "utf8" | "hex"
  ) => Promise<{ signature: Uint8Array }>;
  connect: (options?: {
    onlyIfTrusted?: boolean;
  }) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
}
export class PhantomWalletAdapter implements WalletAdapter {
  _phantomProvider: PhantomProvider | undefined;

  constructor() {
    this.connect = this.connect.bind(this);
  }

  get connected() {
    return this._phantomProvider?.isConnected || false;
  }

  signAllTransactions = async (
    transactions: Transaction[] | VersionedTransaction[]
  ): Promise<Transaction[] | VersionedTransaction[]> => {
    if (!this._phantomProvider) {
      return transactions;
    }
    return await this._phantomProvider.signAllTransactions(transactions);
  };

  get publicKey() {
    return this._phantomProvider?.publicKey
      ? new PublicKey(this._phantomProvider.publicKey.toString())
      : DEFAULT_PUBLICKEY;
  }

  signTransaction = async (transaction: Transaction | VersionedTransaction) => {
    if (!this._phantomProvider) {
      return transaction;
    }
    return await this._phantomProvider.signTransaction(transaction);
  };

  sendMessage = async (message: Uint8Array) => {
    if (!this._phantomProvider) {
      throw new Error("Phantom Wallet not connected");
    }
    console.warn(
      "Phantom Wallet does not support `sendMessage` method.",
      message
    );
    throw new Error("Method `sendMessage` not supported by Phantom Wallet.");
  };

  signMessage = async (message: Uint8Array) => {
    if (!this._phantomProvider) {
      throw new Error("Phantom Wallet not connected");
    }

    if (!(message instanceof Uint8Array)) {
      throw new TypeError("Expected message to be a Uint8Array");
    }

    const signedMessage = await this._phantomProvider.signMessage(
      message,
      "utf8"
    );

    return signedMessage.signature;
  };

  connect = async () => {
    if (this._phantomProvider) {
      return;
    }

    const provider = (window as any)?.solana;

    if (provider?.isPhantom) {
      this._phantomProvider = provider as PhantomProvider;
    } else {
      window.open("https://phantom.app/", "_blank");
      return;
    }

    try {
      await this._phantomProvider.connect();
    } catch (err: unknown) {
      const error = ensureError(err);
      console.log("Phantom connection failed:", error.message);
      this._phantomProvider = undefined;
    }
  };

  disconnect = async () => {
    if (this._phantomProvider) {
      try {
        await this._phantomProvider.disconnect();
        this._phantomProvider = undefined;
      } catch (e: unknown) {
        const error = ensureError(e);
        console.log(error);
      }
    }
  };
}
