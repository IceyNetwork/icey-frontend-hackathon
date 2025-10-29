import { User, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { ModalWrapper } from "./ModalWrapper";
import type { ValidationStatus } from "../../consts/types";

interface AddFriendModalProps {
  show: boolean;
  onClose: () => void;
  friendName: string;
  friendAddress: string;
  onAddFriend: () => void;
  handleFriendNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFriendAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validationStatus: ValidationStatus;
  addFriendOngoing: boolean;
}

export const AddFriendModal = ({
  show,
  onClose,
  friendName,
  friendAddress,
  onAddFriend,
  handleFriendNameChange,
  handleFriendAddressChange,
  validationStatus,
  addFriendOngoing,
}: AddFriendModalProps) => {
  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    onAddFriend();
  };
  //TODO dodać walidacje ze friend juz jest na liscie
  const getHelperText = () => {
    switch (validationStatus) {
      case "valid":
        return <span className="text-green-400">User found.</span>;
      case "invalid":
        return <span className="text-red-400">Invalid friend address</span>;
      case "invalid_self":
        return <span className="text-red-400">You cannot add yourself.</span>;
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
          Add Friend
        </h2>
        <p className="text-cyan-300/60">
          Enter friend's details to start chatting
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-cyan-300/70 text-sm mb-2">
          Friend's Name
        </label>
        <div className="relative">
          <input
            type="text"
            value={friendName}
            onChange={handleFriendNameChange}
            placeholder="e.g., Alex"
            className="w-full bg-cyan-950/30 border border-cyan-500/20 rounded-xl px-4 py-4 text-white text-lg font-semibold placeholder-cyan-300/30 focus:outline-none focus:border-cyan-400/50 transition-colors pr-12"
          />
          <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300/60 pointer-events-none" />
        </div>
      </div>

      <div className="mb-1">
        <label className="block text-cyan-300/70 text-sm mb-2">
          Wallet Address
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-300/60 pointer-events-none" />
          <input
            type="text"
            value={friendAddress}
            onChange={handleFriendAddressChange} //
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

      <button
        onClick={handleSubmit}
        disabled={
          !friendName.trim() ||
          !friendAddress.trim() ||
          addFriendOngoing ||
          validationStatus !== "valid"
        }
        className="w-full group relative px-6 py-4 text-white font-bold overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <div className="absolute inset-0 bg-linear-to-r from-cyan-600/80 via-blue-600/80 to-cyan-600/80 transition-all duration-300 group-hover:from-cyan-500 group-hover:to-blue-500"></div>
        <div className="absolute inset-0 border border-cyan-400/20 rounded-xl group-hover:border-cyan-400/40 transition-all duration-300"></div>
        <span className="relative z-10 flex items-center justify-center gap-2">
          {addFriendOngoing ? (
            <>
              <div className="relative w-6 h-6">
                <div className="absolute inset-0 border-3 border-cyan-200/20 rounded-full"></div>
                <div className="absolute inset-0 border-3 border-transparent border-t-cyan-200 border-r-cyan-200 rounded-full animate-spin"></div>
                <div className="absolute inset-2 bg-cyan-200 rounded-full animate-pulse"></div>
              </div>
              <span className="animate-pulse">Sending Request...</span>
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Add Friend
            </>
          )}
        </span>
      </button>

      <div className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
        <div className="flex gap-3 justify-center items-center">
          <div className="text-cyan-400 ">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="text-cyan-300/80 text-sm">
              Your friend will appear in your messages list after they accept
              your request.
            </p>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
