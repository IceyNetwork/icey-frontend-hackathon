interface ConnectViewProps {
  setOpen: (open: boolean) => void;
}

export const ConnectView = ({ setOpen }: ConnectViewProps) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold mb-4 bg-linear-to-r from-cyan-200 via-blue-200 to-cyan-300 bg-clip-text text-transparent">
          ICEY
        </h1>
        <p className="text-cyan-300/60 text-lg">
          Connect your wallet to continue
        </p>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="group relative px-12 py-5 text-xl font-bold text-white overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30"
      >
        <div className="absolute inset-0 bg-linear-to-r from-cyan-600/80 via-blue-600/80 to-cyan-600/80 transition-all duration-500 group-hover:from-cyan-500 group-hover:to-blue-500"></div>
        <div className="absolute inset-0 bg-linear-to-r from-cyan-400 via-blue-400 to-cyan-400 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-40"></div>
        <span className="relative z-10 flex items-center gap-3">
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
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          Connect Wallet
        </span>
      </button>
    </div>
  );
};
