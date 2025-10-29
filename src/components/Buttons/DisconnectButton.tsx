import { getShortPubKey } from "../../utils/utils";
import { getSolanaWallet } from "../../web3/wallet";

interface DisconnectButtonProps {
  handleDisconnect: () => void;
}
export const DisconnectButton = ({
  handleDisconnect,
}: DisconnectButtonProps) => {
  const wallet = getSolanaWallet();

  return (
    <div className="fixed top-8 right-8 z-20">
      <button
        onClick={handleDisconnect}
        className="group flex items-center gap-2 backdrop-blur-xl bg-cyan-950/40 px-4 py-2 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 hover:bg-cyan-900/30"
      >
        <div className="flex items-center gap-2 text-cyan-300/70 group-hover:text-cyan-200 transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="text-sm font-medium">
            {getShortPubKey(wallet.publicKey)}
          </span>
        </div>
      </button>
    </div>
  );
};
