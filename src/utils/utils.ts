import type { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const ensureError = (value: unknown): Error => {
  if (value instanceof Error) return value;

  let stringified = "[Unable to stringify the thrown value]";

  stringified = JSON.stringify(value);

  const error = new Error(stringified);
  return error;
};

export const printBN = (amount: BN, decimals: number): string => {
  if (!amount) {
    return "0";
  }
  const amountString = amount.toString();
  const isNegative = amountString.length > 0 && amountString[0] === "-";

  const balanceString = isNegative ? amountString.slice(1) : amountString;

  if (balanceString.length <= decimals) {
    return (
      (isNegative ? "-" : "") +
      "0." +
      "0".repeat(decimals - balanceString.length) +
      balanceString
    );
  } else {
    return (
      (isNegative ? "-" : "") +
      trimZeros(
        balanceString.substring(0, balanceString.length - decimals) +
          "." +
          balanceString.substring(balanceString.length - decimals)
      )
    );
  }
};

export const trimZeros = (numStr: string): string => {
  if (!numStr) {
    return "";
  }
  return numStr
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/^0+(\d)|(\d)0+$/gm, "$1$2")
    .replace(/\.$/, "");
};

export const convertBalanceToBN = (amount: string, decimals: number): BN => {
  const balanceString = amount.split(".");
  if (balanceString.length !== 2) {
    return new BN(balanceString[0] + "0".repeat(decimals));
  }
  if (balanceString[1].length <= decimals) {
    return new BN(
      balanceString[0] +
        balanceString[1] +
        "0".repeat(decimals - balanceString[1].length)
    );
  }
  return new BN(0);
};

export const getShortPubKey = (publicKey: PublicKey) => {
  if (!publicKey) return "";
  const base58 = publicKey.toBase58();
  return `${base58.slice(0, 4)}...${base58.slice(-4)}`;
};

export const formatTimestamp = (iso: string): string => {
  const date = new Date(iso);
  const now = new Date();

  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === now.getFullYear() ? undefined : "numeric",
  });
};
