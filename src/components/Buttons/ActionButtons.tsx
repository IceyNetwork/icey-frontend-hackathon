interface ActionButtonsProps {
  setDepositModalOpen: (open: boolean) => void;
  setWithdrawModalOpen: (open: boolean) => void;
  setTransferModalOpen: (open: boolean) => void;
  setMessagesDrawerOpen: (open: boolean) => void;
}

export const ActionButtons = ({
  setDepositModalOpen,
  setWithdrawModalOpen,
  setTransferModalOpen,
  setMessagesDrawerOpen,
}: ActionButtonsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => setDepositModalOpen(true)}
        className="group relative px-6 py-4 text-white font-semibold overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
      >
        <div className="absolute inset-0 bg-linear-to-r from-cyan-600/60 to-blue-600/60 transition-all duration-300 group-hover:from-cyan-500/80 group-hover:to-blue-500/80"></div>
        <div className="absolute inset-0 border border-cyan-400/20 rounded-xl group-hover:border-cyan-400/40 transition-all duration-300"></div>
        <span className="relative z-10 flex items-center justify-center gap-2">
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Deposit
        </span>
      </button>

      <button
        onClick={() => setWithdrawModalOpen(true)}
        className="group relative px-6 py-4 text-white font-semibold overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
      >
        <div className="absolute inset-0 bg-linear-to-r from-blue-600/60 to-cyan-600/60 transition-all duration-300 group-hover:from-blue-500/80 group-hover:to-cyan-500/80"></div>
        <div className="absolute inset-0 border border-blue-400/20 rounded-xl group-hover:border-blue-400/40 transition-all duration-300"></div>
        <span className="relative z-10 flex items-center justify-center gap-2">
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
              d="M20 12H4"
            />
          </svg>
          Withdraw
        </span>
      </button>

      <button
        onClick={() => setTransferModalOpen(true)}
        className="group relative px-6 py-4 text-white font-semibold overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
      >
        <div className="absolute inset-0 bg-linear-to-r from-cyan-700/60 to-blue-700/60 transition-all duration-300 group-hover:from-cyan-600/80 group-hover:to-blue-600/80"></div>
        <div className="absolute inset-0 border border-cyan-400/20 rounded-xl group-hover:border-cyan-400/40 transition-all duration-300"></div>
        <span className="relative z-10 flex items-center justify-center gap-2">
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
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          Transfer
        </span>
      </button>

      <button
        onClick={() => setMessagesDrawerOpen(true)}
        className="group relative px-6 py-4 text-white font-semibold overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
      >
        <div className="absolute inset-0 bg-linear-to-r from-blue-700/60 to-cyan-700/60 transition-all duration-300 group-hover:from-blue-600/80 group-hover:to-cyan-600/80"></div>
        <div className="absolute inset-0 border border-blue-400/20 rounded-xl group-hover:border-blue-400/40 transition-all duration-300"></div>
        <span className="relative z-10 flex items-center justify-center gap-2">
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
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          Message
        </span>
      </button>
    </div>
  );
};
