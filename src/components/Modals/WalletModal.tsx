import { backpackIcon, phantomIcon } from "../../consts/icons";
import { WalletType } from "../../consts/types";
import { ModalWrapper } from "./ModalWrapper";

interface WalletModalProps {
  show: boolean;
  isLoading: boolean;
  setOpen: (open: boolean) => void;
  handleConnect: (walletType: WalletType) => void;
}

export const WalletModal = ({
  show,
  isLoading,
  setOpen,
  handleConnect,
}: WalletModalProps) => {
  return (
    <ModalWrapper
      show={show}
      onClose={() => setOpen(false)}
      className="w-[480px]"
    >
      <button
        onClick={() => setOpen(false)}
        disabled={isLoading}
        className="absolute top-4 right-4 text-cyan-300/60 hover:text-cyan-200 transition-colors disabled:opacity-30"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-linear-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
          Connect Wallet
        </h2>
        <p className="text-cyan-300/60">Choose your preferred wallet</p>
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-10">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-400 rounded-full animate-spin"
                style={{ animationDirection: "reverse" }}
              ></div>
            </div>
          </div>
          <p className="text-cyan-200 mt-6 font-semibold text-lg">
            Connecting...
          </p>
          <p className="text-cyan-300/60 mt-2">Please approve in your wallet</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-8">
        <button
          onClick={() => handleConnect(WalletType.BACKPACK)}
          disabled={isLoading}
          className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl bg-linear-to-br from-cyan-950/40 to-blue-950/30 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-rose-50 to-rose-100 p-4 group-hover:scale-110 transition-transform duration-300">
            <img src={backpackIcon} alt="Backpack" className="w-full h-full" />
          </div>
          <span className="text-cyan-100 font-semibold text-lg">Backpack</span>
        </button>

        <button
          onClick={() => handleConnect(WalletType.PHANTOM)}
          disabled={isLoading}
          className="group relative flex flex-col items-center gap-4 p-6 rounded-2xl bg-linear-to-br from-cyan-950/40 to-blue-950/30 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#9886e5] to-[#9987e9] p-3 group-hover:scale-110 transition-transform duration-300">
            <img
              src={phantomIcon}
              alt="Phantom"
              className="w-full h-full rounded-xl"
            />
          </div>
          <span className="text-cyan-100 font-semibold text-lg">Phantom</span>
        </button>
      </div>

      <div className="text-center text-sm text-cyan-300/50">
        <p>By connecting, you agree to our Terms of Service</p>
      </div>
    </ModalWrapper>
  );
};
