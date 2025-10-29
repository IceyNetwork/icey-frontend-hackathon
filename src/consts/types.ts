export enum WalletType {
  BACKPACK = "BACKPACK",
  PHANTOM = "PHANTOM",
}

export type ValidationStatus =
  | "idle"
  | "checking"
  | "valid"
  | "invalid"
  | "invalid_self"
  | "error";
