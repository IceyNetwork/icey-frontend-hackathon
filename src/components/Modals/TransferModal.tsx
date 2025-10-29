import { animationDuration } from "../../consts/static";
import type { ValidationStatus } from "../../consts/types";

import { ModalWrapper } from "./ModalWrapper";
import { User, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface TransferModalProps {
  setTransferModalOpen: (open: boolean) => void;
  balance: string;
  transferAmount: string;
  setTransferAmount: (amount: string) => void;
  recipientAddress: string;
  setRecipientAddress: (address: string) => void;
  handleTransferSubmit: () => void;
  handleTransferAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRecipientAddressChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleMaxTransfer: () => void;
  transferOngoing?: boolean;
  show: boolean;
  validationStatus: ValidationStatus;
}

export const TransferModal = ({
  setTransferModalOpen,
  balance,
  transferAmount,
  setTransferAmount,
  recipientAddress,
  setRecipientAddress,
  handleTransferSubmit,
  handleTransferAmountChange,
  handleRecipientAddressChange,
  handleMaxTransfer,
  transferOngoing,
  show,
  validationStatus,
}: TransferModalProps) => {
  const handleClose = () => {
    setTransferModalOpen(false);
    setTimeout(() => {
      setTransferAmount("");
      setRecipientAddress("");
    }, animationDuration);
  };

  const getHelperText = () => {
    switch (validationStatus) {
      case "valid":
        return <span className="text-green-400">Address valid</span>;
      case "invalid":
        return <span className="text-red-400">Invalid recipient address</span>;
      case "invalid_self":
        return (
          <span className="text-red-400">
            You cannot send a transfer to yourself.
          </span>
        );
      case "error":
        return (
          <span className="text-red-400">
            Error validating address. Please try again.
          </span>
        );
      default:
        return <span>&nbsp;</span>;
    }
  };

  return (
    <ModalWrapper show={show} onClose={handleClose} className="w-[480px]">
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-cyan-300/60 hover:text-cyan-200 transition-colors"
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
          Transfer USDC
        </h2>
        <p className="text-cyan-300/60">Enter address and amount to transfer</p>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
        <div className="flex justify-between items-center">
          <span className="text-cyan-300/70 text-sm">Your Balance</span>
          <span className="text-cyan-100 font-semibold">
            {balance ?? 0} USDC
          </span>
        </div>
      </div>

      <div className="mb-1">
        <label className="block text-cyan-300/70 text-sm mb-2">
          Recipient Address
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300/60 pointer-events-none" />
          <input
            type="text"
            value={recipientAddress}
            onChange={handleRecipientAddressChange}
            placeholder="Enter SOL address..."
            className="w-full bg-cyan-950/30 border border-cyan-500/20 rounded-xl px-4 py-4 text-white text-lg font-semibold placeholder-cyan-300/30 focus:outline-none focus:border-cyan-400/50 transition-colors pl-12 pr-12"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {validationStatus === "checking" && (
              <Loader2 className="w-5 h-5 text-cyan-300 animate-spin" />
            )}
            {validationStatus === "valid" && (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            )}
            {(validationStatus === "invalid" ||
              validationStatus === "invalid_self" ||
              validationStatus === "error") && (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
        </div>
      </div>

      <div className="h-5 mb-2 px-1 text-sm">{getHelperText()}</div>

      <div className="mb-6">
        <label className="block text-cyan-300/70 text-sm mb-2">Amount</label>
        <div className="relative">
          <input
            type="text"
            value={transferAmount}
            onChange={handleTransferAmountChange}
            placeholder="0.00"
            className="w-full bg-cyan-950/30 border border-cyan-500/20 rounded-xl px-4 py-4 text-white text-lg font-semibold placeholder-cyan-300/30 focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
          <button
            onClick={handleMaxTransfer}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-cyan-600/60 hover:bg-cyan-500/80 rounded-lg text-xs font-semibold text-white transition-colors"
          >
            MAX
          </button>
        </div>
      </div>

      <button
        onClick={handleTransferSubmit}
        disabled={
          !transferAmount ||
          !recipientAddress ||
          parseFloat(transferAmount) <= 0 ||
          transferOngoing ||
          validationStatus !== "valid"
        }
        className="w-full group relative px-6 py-4 text-white font-semibold overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <div className="absolute inset-0 bg-linear-to-r from-cyan-600/80 via-blue-600/80 to-cyan-600/80 transition-all duration-300 group-hover:from-cyan-500 group-hover:to-blue-500"></div>
        <div className="absolute inset-0 border border-cyan-400/20 rounded-xl group-hover:border-cyan-400/40 transition-all duration-300"></div>
        <span className="relative z-10 flex items-center justify-center gap-3">
          {transferOngoing ? (
            <>
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 border-3 border-cyan-200/20 rounded-full"></div>
                <div className="absolute inset-0 border-3 border-transparent border-t-cyan-200 border-r-cyan-200 rounded-full animate-spin"></div>
                <div className="absolute inset-2 bg-cyan-200 rounded-full animate-pulse"></div>
              </div>
              <span className="animate-pulse">Processing Transfer</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
              Transfer
            </>
          )}
        </span>
      </button>
    </ModalWrapper>
  );
};
