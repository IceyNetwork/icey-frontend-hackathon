import { ModalWrapper } from "./ModalWrapper";

interface WithdrawModalProps {
  setWithdrawModalOpen: (open: boolean) => void;
  balance: string;
  withdrawAmount: string;
  setWithdrawAmount: (amount: string) => void;
  handleWithdrawSubmit: () => void;
  handleWithdrawAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleMaxWithdraw: () => void;
  withdrawOngoing?: boolean;
  show: boolean;
}

export const WithdrawModal = ({
  setWithdrawModalOpen,
  balance,
  withdrawAmount,
  setWithdrawAmount,
  handleWithdrawSubmit,
  handleWithdrawAmountChange,
  handleMaxWithdraw,
  withdrawOngoing,
  show,
}: WithdrawModalProps) => {
  const handleClose = () => {
    setWithdrawModalOpen(false);
    setTimeout(() => {
      setWithdrawAmount("");
    }, 300);
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
          Withdraw USDC
        </h2>
        <p className="text-cyan-300/60">Enter amount to withdraw</p>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
        <div className="flex justify-between items-center">
          <span className="text-cyan-300/70 text-sm">Balance</span>
          <span className="text-cyan-100 font-semibold">
            {balance ?? 0} USDC
          </span>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-cyan-300/70 text-sm mb-2">Amount</label>
        <div className="relative">
          <input
            type="text"
            value={withdrawAmount}
            onChange={handleWithdrawAmountChange}
            placeholder="0.00"
            className="w-full bg-cyan-950/30 border border-cyan-500/20 rounded-xl px-4 py-4 text-white text-lg font-semibold placeholder-cyan-300/30 focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
          <button
            onClick={handleMaxWithdraw}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-cyan-600/60 hover:bg-cyan-500/80 rounded-lg text-xs font-semibold text-white transition-colors"
          >
            MAX
          </button>
        </div>
      </div>

      <button
        onClick={handleWithdrawSubmit}
        disabled={
          !withdrawAmount || parseFloat(withdrawAmount) <= 0 || withdrawOngoing
        }
        className="w-full group relative px-6 py-4 text-white font-semibold overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <div className="absolute inset-0 bg-linear-to-r from-cyan-600/80 via-blue-600/80 to-cyan-600/80 transition-all duration-300 group-hover:from-cyan-500 group-hover:to-blue-500"></div>
        <div className="absolute inset-0 border border-cyan-400/20 rounded-xl group-hover:border-cyan-400/40 transition-all duration-300"></div>
        <span className="relative z-10 flex items-center justify-center gap-3">
          {withdrawOngoing ? (
            <>
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 border-3 border-cyan-200/20 rounded-full"></div>
                <div className="absolute inset-0 border-3 border-transparent border-t-cyan-200 border-r-cyan-200 rounded-full animate-spin"></div>
                <div className="absolute inset-2 bg-cyan-200 rounded-full animate-pulse"></div>
              </div>
              <span className="animate-pulse">Processing Transaction</span>
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
                  d="M18 12H6"
                />
              </svg>
              Withdraw
            </>
          )}
        </span>
      </button>
    </ModalWrapper>
  );
};
