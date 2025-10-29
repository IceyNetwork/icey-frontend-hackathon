import { BackpackWalletAdapter } from "./adapters/backpack";
import type { WalletAdapter } from "./adapters/types";
import { PhantomWalletAdapter } from "./adapters/phantom";
import { WalletType } from "../consts/types";
import { sleep } from "../utils/utils";

let _wallet: WalletAdapter;

const getSolanaWallet = (): WalletAdapter => {
  return _wallet;
};

const disconnectWallet = async () => {
  await _wallet.disconnect();
};

const connectStaticWallet = async (wallet: WalletType) => {
  switch (wallet) {
    case WalletType.BACKPACK:
      _wallet = new BackpackWalletAdapter();
      break;
    case WalletType.PHANTOM:
      _wallet = new PhantomWalletAdapter();
      break;
    default:
      _wallet = new BackpackWalletAdapter();
      break;
  }

  await sleep(300);
  await _wallet.connect();

  return _wallet.connected
    ? (localStorage.setItem("WALLET_TYPE", wallet.toString()), true)
    : false;
};

export { getSolanaWallet, disconnectWallet, connectStaticWallet };
