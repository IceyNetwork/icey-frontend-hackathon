import { useState } from "react";
import type { ChatItem } from "../../App";
import { formatTimestamp } from "../../utils/utils";

interface Message {
  _id: string;
  threadId: string;
  sender: string;
  content: string;
  kind: string;
  createdAt: string;
}

interface PendingItem {
  peer: string;
  name: string;
  avatar: string;
}

interface MessagesDrawerProps {
  userAddress: string | null;
  isOpen: boolean;
  onClose: () => void;
  chats: ChatItem[];
  messages: Record<string, Message[]>;
  selectedChat: string | null;
  setSelectedChat: (id: string | null) => void;
  messageInput: string;
  setMessageInput: (msg: string) => void;
  onSendMessage: () => void;
  onPay: (amount: number) => void;
  onOpenAddFriend: () => void;
  pendingIncoming: PendingItem[];
  pendingOutgoing: PendingItem[];
  onAcceptFriend: (peer: string) => void;
  onCancelRequest: (peer: string) => void;
}

export const MessagesDrawer = ({
  userAddress,
  isOpen,
  onClose,
  chats,
  messages,
  selectedChat,
  setSelectedChat,
  messageInput,
  setMessageInput,
  onSendMessage,
  onPay,
  onOpenAddFriend,
  pendingIncoming,
  pendingOutgoing,
  onAcceptFriend,
  onCancelRequest,
}: MessagesDrawerProps) => {
  const currentMessages = selectedChat ? messages[selectedChat] || [] : [];
  const currentChat = chats.find((c) => c.id === selectedChat);
  const [openIncoming, setOpenIncoming] = useState(false);
  const [openOutgoing, setOpenOutgoing] = useState(false);
  const [showCustomPay, setShowCustomPay] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>("");

  const openCustomPay = () => setShowCustomPay(true);
  const closeCustomPay = () => {
    setShowCustomPay(false);
    setCustomAmount("");
  };

  const submitCustomPay = () => {
    const amount = Number(customAmount);
    if (!isNaN(amount) && amount > 0) {
      onPay(amount);
      closeCustomPay();
    }
  };
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 h-full w-[480px] bg-linear-to-br from-cyan-950/95 to-blue-950/95 backdrop-blur-xl border-l border-cyan-500/20 shadow-2xl shadow-cyan-500/10 z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {!selectedChat ? (
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-cyan-500/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold bg-linear-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent">
                  Messages
                </h2>
                <button
                  onClick={onClose}
                  className="text-cyan-300/60 hover:text-cyan-200 transition-colors"
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
              </div>

              <button
                onClick={onOpenAddFriend}
                className="w-full group relative px-4 py-3 text-white font-semibold overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Add Friend
                </span>
              </button>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/30">
                  <button
                    onClick={() => setOpenIncoming((o) => !o)}
                    className="w-full px-4 py-3 flex items-center justify-between text-cyan-100"
                  >
                    <span className="font-semibold">
                      Invited You ({pendingIncoming.length})
                    </span>
                    <span
                      className={`transition-transform ${
                        openIncoming ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-300 ${
                      openIncoming ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="p-3 space-y-2">
                      {pendingIncoming.length === 0 ? (
                        <p className="text-sm text-cyan-300/60 px-1">
                          No incoming requests
                        </p>
                      ) : (
                        pendingIncoming.map((item) => (
                          <div
                            key={item.peer}
                            className="flex items-center justify-between gap-3 p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/20"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-lg">
                                {item.avatar}
                              </div>
                              <div className="text-cyan-100">{item.name}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => onAcceptFriend(item.peer)}
                                className="px-3 py-1.5 rounded-md bg-cyan-600/60 hover:bg-cyan-500/70 border border-cyan-400/30 text-white text-sm transition-all"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => onCancelRequest(item.peer)}
                                className="px-3 py-1.5 rounded-md bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-400/20 text-cyan-200 text-sm transition-all"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/30">
                  <button
                    onClick={() => setOpenOutgoing((o) => !o)}
                    className="w-full px-4 py-3 flex items-center justify-between text-cyan-100"
                  >
                    <span className="font-semibold">
                      Sent Requests ({pendingOutgoing.length})
                    </span>
                    <span
                      className={`transition-transform ${
                        openOutgoing ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-[max-height] duration-300 ${
                      openOutgoing ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="p-3 space-y-2">
                      {pendingOutgoing.length === 0 ? (
                        <p className="text-sm text-cyan-300/60 px-1">
                          No sent requests
                        </p>
                      ) : (
                        pendingOutgoing.map((item) => (
                          <div
                            key={item.peer}
                            className="flex items-center justify-between gap-3 p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/20"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-lg">
                                {item.avatar}
                              </div>
                              <div className="text-cyan-100">{item.name}</div>
                            </div>
                            <button
                              onClick={() => onCancelRequest(item.peer)}
                              className="px-3 py-1.5 rounded-md bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-400/20 text-cyan-200 text-sm transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className="w-full p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400/40 hover:bg-cyan-900/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-2xl">
                        {chat.avatar}
                      </div>
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-cyan-100">
                          {chat.name}
                        </span>
                      </div>
                      <p className="text-sm text-cyan-300/60 truncate">
                        {messages[chat.id] ? messages[chat.id][0].content : ""}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-cyan-500/20 flex items-center gap-4">
              <button
                onClick={() => setSelectedChat(null)}
                className="text-cyan-300/60 hover:text-cyan-200 transition-colors"
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="flex-1">
                <h3 className="font-bold text-cyan-100">{currentChat?.name}</h3>
              </div>
              <button
                onClick={onClose}
                className="text-cyan-300/60 hover:text-cyan-200 transition-colors"
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
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {[...currentMessages].reverse().map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${
                    msg.sender === userAddress ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.kind === "activity"
                        ? "bg-yellow-500/30 text-yellow-100 border border-yellow-400/40"
                        : msg.sender === userAddress
                        ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
                        : "bg-cyan-950/60 text-cyan-100 border border-cyan-500/20"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === userAddress
                          ? "text-cyan-200/70"
                          : "text-cyan-300/50"
                      }`}
                    >
                      {formatTimestamp(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-cyan-500/20">
              <p className="text-xs text-cyan-300/60 mb-2">Quick Pay</p>
              <div className="flex gap-2 mb-3">
                {[5, 10, 25].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => onPay(amount)}
                    className="flex-1 px-4 py-2 rounded-xl bg-cyan-600/40 hover:bg-cyan-500/60 border border-cyan-400/20 hover:border-cyan-400/40 text-white font-semibold text-sm transition-all duration-300 hover:scale-105"
                  >
                    ${amount}
                  </button>
                ))}
                <button
                  onClick={openCustomPay}
                  className="px-4 py-2 rounded-xl bg-blue-600/40 hover:bg-blue-500/60 border border-blue-400/20 hover:border-blue-400/40 text-white font-semibold text-sm transition-all duration-300 hover:scale-105"
                >
                  Custom
                </button>
              </div>
            </div>
            {showCustomPay && (
              <div className="px-4 pb-3 -mt-2">
                <div className="flex items-center gap-2 bg-cyan-950/40 border border-cyan-500/20 rounded-xl p-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300/60">
                      $
                    </span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      inputMode="decimal"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitCustomPay()}
                      placeholder="Enter amount"
                      className="w-full bg-transparent border border-cyan-500/20 focus:border-cyan-400/50 rounded-lg pl-7 pr-3 py-2 text-white placeholder-cyan-300/40 outline-none transition-colors"
                    />
                  </div>

                  <button
                    onClick={submitCustomPay}
                    disabled={!customAmount || Number(customAmount) <= 0}
                    className="px-3 py-2 rounded-lg bg-cyan-600/60 hover:bg-cyan-500/70 border border-cyan-400/30 text-white text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Pay
                  </button>

                  <button
                    onClick={closeCustomPay}
                    className="px-3 py-2 rounded-lg bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-400/20 text-cyan-200 text-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-[11px] text-cyan-300/60 mt-1">
                  Press Enter to pay
                </p>
              </div>
            )}

            <div className="p-4 border-t border-cyan-500/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-cyan-950/40 border border-cyan-500/20 rounded-xl px-4 py-3 text-white placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400/50 transition-colors"
                />
                <button
                  onClick={onSendMessage}
                  disabled={!messageInput.trim()}
                  className="px-6 py-3 rounded-xl bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
