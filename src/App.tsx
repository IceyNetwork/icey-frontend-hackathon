import { useState, useEffect, useRef } from "react";
import bs58 from "bs58";
import "./index.css";
import axios from "axios";
import { Connection, Transaction } from "@solana/web3.js";
import BN from "bn.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createTransferInstruction,
  getAccount,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { WalletType } from "./consts/types";
import {
  connectStaticWallet,
  disconnectWallet,
  getSolanaWallet,
} from "./web3/wallet";
import { TREASURY, USDC_MAIN } from "./consts/static";
import { convertBalanceToBN, printBN } from "./utils/utils";
import { AnimatedBackground } from "./components/Backgorunds/AnimatedBackground";
import { WalletModal } from "./components/Modals/WalletModal";
import { DepositModal } from "./components/Modals/DepositModal";
import { ConnectView } from "./components/ConnectView/ConnectView";
import { DisconnectButton } from "./components/Buttons/DisconnectButton";
import { BalanceLabel } from "./components/Labels/BalanceLabel";
import { ActionButtons } from "./components/Buttons/ActionButtons";
import { WithdrawModal } from "./components/Modals/WithdrawModal";
import { Toaster, toast } from "react-hot-toast";
import { useAnimatedModal } from "./hooks/useAnimatedModal";
import { TransferModal } from "./components/Modals/TransferModal";
import { useDebounce } from "./hooks/useDebounce";
import { AddFriendModal } from "./components/Modals/AddFriendModal";
import { MessagesDrawer } from "./components/Drawers/MessagesDrawer";

type ValidationStatus =
  | "idle"
  | "checking"
  | "valid"
  | "invalid"
  | "invalid_self"
  | "error";

type FriendRel = {
  _id: string;
  participants: [string, string];
  status: "pending" | "accepted";
  requestedBy: string;
  names?: Record<string, string>;
};

const AVATARS = ["🦊", "🐱", "🐺", "🦄"] as const;

export type ChatItem = {
  id: string;
  name: string;
  avatar: string;
  peer: string;
};

function App() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [availableBalance, setAvailableBalance] = useState<BN | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositOngoing, setDepositOngoing] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawOngoing, setWithdrawOngoing] = useState(false);

  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [transferOngoing, setTransferOngoing] = useState(false);
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatus>("idle");
  const debouncedRecipientAddress = useDebounce(recipientAddress, 500);
  const [messagesDrawerOpen, setMessagesDrawerOpen] = useState(false);
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendAddress, setFriendAddress] = useState("");
  const [addFriendOngoing, setAddFriendOngoing] = useState(false);
  const [friendValidationStatus, setFriendValidationStatus] =
    useState<ValidationStatus>("idle");
  const debouncedFriendAddress = useDebounce(friendAddress, 500);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const connection = new Connection(
    "https://devnet.helius-rpc.com/?api-key=2fe47b6e-4ace-42ed-ac8c-334520be28ef"
  );
  const [friends, setFriends] = useState<FriendRel[]>([]);
  const [pendingIncoming, setPendingIncoming] = useState<FriendRel[]>([]);
  const [pendingOutgoing, setPendingOutgoing] = useState<FriendRel[]>([]);
  const [messagesByPeer, setMessagesByPeer] = useState<Record<string, any[]>>(
    {}
  );
  const [threadByPeer, setThreadByPeer] = useState<Record<string, string>>({});
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const pollMsgsRef = useRef<NodeJS.Timeout | null>(null);

  const pickAvatar = (addr: string) => {
    let h = 0;
    for (let i = 0; i < addr.length; i++) h = (h * 31 + addr.charCodeAt(i)) | 0;
    return AVATARS[Math.abs(h) % AVATARS.length];
  };

  const peerOf = (rel: FriendRel, my: string) =>
    rel.participants[0] === my ? rel.participants[1] : rel.participants[0];

  const short = (addr: string) =>
    addr.length > 10 ? `${addr.slice(0, 4)}…${addr.slice(-4)}` : addr;

  const displayName = (rel: FriendRel, my: string) => {
    const p = peerOf(rel, my);
    const nm = rel.names?.[my];
    return nm?.trim() || short(p);
  };

  const { isMounted: walletIsMounted, show: walletShow } =
    useAnimatedModal(open);
  const { isMounted: depositIsMounted, show: depositShow } =
    useAnimatedModal(depositModalOpen);
  const { isMounted: withdrawIsMounted, show: withdrawShow } =
    useAnimatedModal(withdrawModalOpen);
  const { isMounted: transferIsMounted, show: transferShow } =
    useAnimatedModal(transferModalOpen);
  const { isMounted: addFriendIsMounted, show: addFriendShow } =
    useAnimatedModal(addFriendModalOpen);

  useEffect(() => {
    const validateAddress = async () => {
      const trimmedAddress = debouncedRecipientAddress.trim();

      if (trimmedAddress === "") {
        setValidationStatus("idle");
        return;
      }
      if (trimmedAddress === userAddress) {
        setValidationStatus("invalid_self");
        return;
      }
      setValidationStatus("checking");
      try {
        const { data } = await axios.get(
          "http://localhost:3000/wallet/check-user",
          {
            params: { address: trimmedAddress },
            withCredentials: true,
          }
        );
        if (data.exists) {
          setValidationStatus("valid");
        } else {
          setValidationStatus("invalid");
        }
      } catch (error) {
        setValidationStatus("error");
      }
    };
    validateAddress();
  }, [debouncedRecipientAddress, userAddress]);

  useEffect(() => {
    const validateFriendAddress = async () => {
      const trimmedAddress = debouncedFriendAddress.trim();
      if (trimmedAddress === "") {
        setFriendValidationStatus("idle");
        return;
      }
      if (trimmedAddress === userAddress) {
        setFriendValidationStatus("invalid_self");
        return;
      }
      setFriendValidationStatus("checking");
      try {
        const { data } = await axios.get(
          "http://localhost:3000/wallet/check-user",
          {
            params: { address: trimmedAddress },
            withCredentials: true,
          }
        );
        if (data.exists) {
          setFriendValidationStatus("valid");
        } else {
          setFriendValidationStatus("invalid");
        }
      } catch (error) {
        setFriendValidationStatus("error");
      }
    };
    validateFriendAddress();
  }, [debouncedFriendAddress, userAddress]);

  const handleConnect = async (walletType: WalletType) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const success = await connectStaticWallet(walletType);
      if (success) {
        const wallet = getSolanaWallet();
        const address = wallet.publicKey.toString();
        setUserAddress(address);

        const response = await axios.post(
          "http://localhost:3000/auth/nonce",
          {
            address: address,
          },
          { withCredentials: true }
        );
        const signature = await wallet.signMessage(
          new TextEncoder().encode(response.data.message)
        );
        const bs58Signature = bs58.encode(signature);
        await axios.post(
          "http://localhost:3000/auth/login",
          {
            address: address,
            signature: bs58Signature,
          },
          { withCredentials: true }
        );
        const ata = getAssociatedTokenAddressSync(
          USDC_MAIN.address,
          wallet.publicKey,
          false,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID
        );
        getAccount(connection, ata)
          .then((account) => {
            setAvailableBalance(new BN(account.amount));
          })
          .catch((err) => {
            console.log("Error fetching ATA account:", err);
          });
        setIsConnected(true);
        setIsLoading(false);
        setOpen(false);
        toast.success("Wallet connected!");
      } else {
        console.warn("Wallet connection failed or was cancelled.");
        toast.error("Connection cancelled.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isConnected) return;
    axios
      .get("http://localhost:3000/wallet/balance", {
        withCredentials: true,
      })
      .then((response) => {
        const balance = new BN(response.data.amount);
        setBalance(printBN(balance, USDC_MAIN.decimals));
      })
      .catch((error) => {
        console.error("Error fetching balance:", error);
      });
  }, [isConnected]);

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      toast.success("Wallet disconnected.");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    } finally {
      setIsConnected(false);
      setUserAddress(null);
    }
  };

  const handleDepositAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const maxValue = printBN(availableBalance ?? new BN(0), USDC_MAIN.decimals);
    if (value === "" || /^\d*\.?\d{0,6}$/.test(value)) {
      setDepositAmount(
        value === "" ? value : +value > +maxValue ? maxValue : value
      );
    }
  };

  const handleWithdrawAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const maxValue = balance ?? "0";
    if (value === "" || /^\d*\.?\d{0,6}$/.test(value)) {
      setWithdrawAmount(
        value === "" ? value : +value > +maxValue ? maxValue : value
      );
    }
  };

  const handleTransferAmountChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const maxValue = balance ?? "0";
    if (value === "" || /^\d*\.?\d{0,6}$/.test(value)) {
      setTransferAmount(
        value === "" ? value : +value > +maxValue ? maxValue : value
      );
    }
  };

  const handleRecipientAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRecipientAddress(e.target.value);
    if (validationStatus !== "checking") {
      setValidationStatus("idle");
    }
  };

  const handleFriendNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFriendName(e.target.value);
  };

  const handleFriendAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFriendAddress(e.target.value);
    if (friendValidationStatus !== "checking") {
      setFriendValidationStatus("idle");
    }
  };

  const handleMaxDeposit = () => {
    if (!availableBalance) return;
    setDepositAmount(
      printBN(availableBalance, USDC_MAIN.decimals).replace(/,/g, "")
    );
  };

  const handleMaxWithdraw = () => {
    if (!balance) return;
    setWithdrawAmount(balance);
  };

  const handleMaxTransfer = () => {
    if (!balance) return;
    setTransferAmount(balance);
  };

  const refreshUser = async () => {
    const wallet = getSolanaWallet();

    const ata = getAssociatedTokenAddressSync(
      USDC_MAIN.address,
      wallet.publicKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const balanceResponse = await axios.get(
      "http://localhost:3000/wallet/balance",
      {
        withCredentials: true,
      }
    );
    const balance = new BN(balanceResponse.data.amount);
    setBalance(printBN(balance, USDC_MAIN.decimals));

    const account = await getAccount(connection, ata);

    setAvailableBalance(new BN(account.amount));
  };

  const handleDepositSubmit = async () => {
    if (depositOngoing) return;
    setDepositOngoing(true);
    const depositPromise = async () => {
      const wallet = getSolanaWallet();
      const ata = getAssociatedTokenAddressSync(
        USDC_MAIN.address,
        wallet.publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      const rawAmount = convertBalanceToBN(depositAmount, USDC_MAIN.decimals);
      const ix = createTransferInstruction(
        ata,
        TREASURY,
        wallet.publicKey,
        Number(rawAmount),
        [],
        TOKEN_PROGRAM_ID
      );
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash();
      const tx = new Transaction().add(ix);
      tx.recentBlockhash = blockhash;
      tx.lastValidBlockHeight = lastValidBlockHeight;
      tx.feePayer = wallet.publicKey;

      const signed = await wallet.signTransaction(tx);
      const txBase64 = Buffer.from(signed.serialize()).toString("base64");

      await axios.post(
        "http://localhost:3000/wallet/deposit",
        {
          txBase64,
          expectedAmount: Number(rawAmount),
        },
        { withCredentials: true }
      );
      await refreshUser();
    };
    try {
      await toast.promise(depositPromise(), {
        loading: "Processing deposit...",
        success: "Deposit successful!",
        error: "Transaction failed. Please try again.",
      });
      setDepositModalOpen(false);
      setDepositAmount("");
    } catch (error) {
      console.error("Deposit error:", error);
    } finally {
      setDepositOngoing(false);
    }
  };

  const handleWithdrawSubmit = async () => {
    if (withdrawOngoing) return;
    setWithdrawOngoing(true);
    const withdrawPromise = async () => {
      const rawAmount = convertBalanceToBN(withdrawAmount, USDC_MAIN.decimals);
      await axios.post(
        "http://localhost:3000/wallet/withdraw",
        {
          amount: Number(rawAmount),
        },
        { withCredentials: true }
      );
      await refreshUser();
    };
    try {
      await toast.promise(withdrawPromise(), {
        loading: "Processing withdrawal...",
        success: "Withdrawal successful!",
        error: "Withdrawal failed. Please try again.",
      });
      setWithdrawModalOpen(false);
      setWithdrawAmount("");
    } catch (error) {
      console.error("Withdrawal error:", error);
    } finally {
      setWithdrawOngoing(false);
    }
  };

  const handleTransferSubmit = async () => {
    if (transferOngoing) return;
    setTransferOngoing(true);
    const transferPromise = async () => {
      const rawAmount = convertBalanceToBN(transferAmount, USDC_MAIN.decimals);
      await axios.post(
        "http://localhost:3000/wallet/transfer",
        {
          to: recipientAddress,
          amount: Number(rawAmount),
        },
        { withCredentials: true }
      );
      await refreshUser();
    };
    try {
      await toast.promise(transferPromise(), {
        loading: "Processing transfer...",
        success: "Transfer successful!",
        error: (err) =>
          err.response?.data?.error || "Transfer failed. Please try again.",
      });
      setTransferModalOpen(false);
      setTransferAmount("");
      setRecipientAddress("");
    } catch (error) {
      console.error("Transfer error:", error);
    } finally {
      setTransferOngoing(false);
    }
  };

  const fetchFriends = async () => {
    if (!userAddress) return;
    const { data } = await axios.get<FriendRel[]>(
      `http://localhost:3000/friends`,
      {
        withCredentials: true,
      }
    );
    for (const item of data) {
      const peer = peerOf(item, userAddress);
      await fetchMessagesFor(peer);
    }
    setFriends(data);
  };

  const fetchPending = async () => {
    const { data } = await axios.get<FriendRel[]>(
      `http://localhost:3000/friends/pending`,
      {
        withCredentials: true,
      }
    );
    if (!userAddress) return;
    setPendingIncoming(data.filter((r) => r.requestedBy !== userAddress));
    setPendingOutgoing(data.filter((r) => r.requestedBy === userAddress));
  };

  const ensureThreadFor = async (peer: string) => {
    if (threadByPeer[peer]) return threadByPeer[peer];
    const { data } = await axios.post(
      `http://localhost:3000/threads`,
      { peer },
      { withCredentials: true }
    );
    const id = data._id as string;
    setThreadByPeer((m) => ({ ...m, [peer]: id }));
    return id;
  };

  const fetchMessagesFor = async (peer: string) => {
    const threadId = await ensureThreadFor(peer);
    const { data } = await axios.get(
      `http://localhost:3000/messages/${threadId}`,
      {
        withCredentials: true,
        params: { limit: 50 },
      }
    );
    setMessagesByPeer((m) => ({ ...m, [peer]: data }));
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;
    const content = messageInput.trim();
    2;
    setMessageInput("");

    try {
      const threadId = await ensureThreadFor(selectedChat);
      await axios.post(
        `http://localhost:3000/messages`,
        { content, kind: "text", threadId },
        { withCredentials: true }
      );
      await Promise.all([fetchMessagesFor(selectedChat), refreshUser()]);
    } catch (e) {
      toast.error("Failed to send message");
    }
  };

  const handlePay = async (amount: number) => {
    if (!selectedChat || !balance) return;
    if (amount > Number(balance)) {
      return toast.error("Not enough balance");
    }
    const transferPromise = async () => {
      const rawAmount = convertBalanceToBN(
        amount.toString(),
        USDC_MAIN.decimals
      );
      await axios.post(
        "http://localhost:3000/wallet/transfer",
        {
          to: selectedChat,
          amount: Number(rawAmount),
        },
        { withCredentials: true }
      );
      await refreshUser();
    };

    try {
      await toast.promise(transferPromise(), {
        loading: "Processing transfer...",
        success: "Transfer successful!",
        error: (err) =>
          err.response?.data?.error || "Transfer failed. Please try again.",
      });
      const content = `Sent $${amount}!`;
      const threadId = await ensureThreadFor(selectedChat);
      await axios.post(
        `http://localhost:3000/messages`,
        { content, kind: "activity", threadId },
        { withCredentials: true }
      );
      await Promise.all([fetchMessagesFor(selectedChat), refreshUser()]);
    } catch (error) {
      console.error("Transfer error:", error);
    }
  };

  const handleAddFriendSubmit = async () => {
    if (addFriendOngoing || friendValidationStatus !== "valid") return;
    setAddFriendOngoing(true);
    const addFriendPromise = async () => {
      await axios.post(
        `http://localhost:3000/friends/request`,
        { peer: friendAddress.trim(), name: friendName.trim() || undefined },
        { withCredentials: true }
      );
      await Promise.all([fetchFriends(), fetchPending(), refreshUser()]);
    };
    try {
      await toast.promise(addFriendPromise(), {
        loading: "Sending friend request...",
        success: "Friend request sent!",
        error: (err) => err.response?.data?.error || "Failed to add friend.",
      });
      setAddFriendModalOpen(false);
      setFriendName("");
      setFriendAddress("");
    } finally {
      setAddFriendOngoing(false);
    }
  };

  const handleAcceptFriend = async (peer: string) => {
    await axios.post(
      `http://localhost:3000/friends/accept`,
      { peer },
      { withCredentials: true }
    );
    await Promise.all([fetchFriends(), fetchPending(), refreshUser()]);
  };

  const handleCancelRequest = async (peer: string) => {
    await axios.delete(
      `http://localhost:3000/friends/${encodeURIComponent(peer)}`,
      {
        withCredentials: true,
      }
    );
    await Promise.all([fetchFriends(), fetchPending(), refreshUser()]);
  };

  useEffect(() => {
    if (!isConnected || !userAddress) return;

    const startPoll = () => {
      pollRef.current = setInterval(() => {
        fetchFriends().catch(() => {});
        fetchPending().catch(() => {});
      }, 3000);

      pollMsgsRef.current = setInterval(() => {
        if (selectedChat) fetchMessagesFor(selectedChat).catch(() => {});
      }, 3000);
    };

    fetchFriends().catch(() => {});
    fetchPending().catch(() => {});
    if (selectedChat) fetchMessagesFor(selectedChat).catch(() => {});

    startPoll();
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (pollMsgsRef.current) clearInterval(pollMsgsRef.current);
    };
  }, [isConnected, userAddress, selectedChat]);

  const chatsFromFriends: ChatItem[] = !userAddress
    ? []
    : friends
        .filter((r) => r.status === "accepted")
        .map((r) => {
          const peer = peerOf(r, userAddress);
          return {
            id: peer,
            peer,
            name: displayName(r, userAddress),
            avatar: pickAvatar(peer),
          };
        });

  return (
    <main className="relative flex min-h-screen items-center justify-center w-full overflow-hidden bg-linear-to-br from-[#0a0e27] via-[#0f1535] to-[#0a0e27]">
      <AnimatedBackground />

      <Toaster
        position="bottom-left"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#e2e8f0",
            border: "1px solid #334155",
          },
        }}
      />

      <div className="relative z-10 w-full">
        {!isConnected ? (
          <ConnectView setOpen={setOpen} />
        ) : (
          <div className="flex flex-col items-center w-full px-8">
            <DisconnectButton handleDisconnect={handleDisconnect} />

            <div className="backdrop-blur-xl bg-linear-to-br from-cyan-950/40 to-blue-950/30 p-12 rounded-3xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 max-w-2xl w-full">
              <BalanceLabel balance={balance ?? "0"} />
              <ActionButtons
                setDepositModalOpen={setDepositModalOpen}
                setWithdrawModalOpen={setWithdrawModalOpen}
                setTransferModalOpen={setTransferModalOpen}
                setMessagesDrawerOpen={setMessagesDrawerOpen}
              />
            </div>
          </div>
        )}
      </div>

      {walletIsMounted && (
        <WalletModal
          handleConnect={handleConnect}
          isLoading={isLoading}
          setOpen={setOpen}
          show={walletShow}
        />
      )}

      {depositIsMounted && (
        <DepositModal
          availableBalance={availableBalance ?? new BN(0)}
          depositAmount={depositAmount}
          handleDepositAmountChange={handleDepositAmountChange}
          handleDepositSubmit={handleDepositSubmit}
          handleMaxDeposit={handleMaxDeposit}
          setDepositAmount={setDepositAmount}
          setDepositModalOpen={setDepositModalOpen}
          depositOngoing={depositOngoing}
          show={depositShow}
        />
      )}

      {withdrawIsMounted && (
        <WithdrawModal
          balance={balance ?? "0"}
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          handleWithdrawSubmit={handleWithdrawSubmit}
          handleWithdrawAmountChange={handleWithdrawAmountChange}
          handleMaxWithdraw={handleMaxWithdraw}
          setWithdrawModalOpen={setWithdrawModalOpen}
          withdrawOngoing={withdrawOngoing}
          show={withdrawShow}
        />
      )}

      {transferIsMounted && (
        <TransferModal
          show={transferShow}
          setTransferModalOpen={setTransferModalOpen}
          balance={balance ?? "0"}
          transferAmount={transferAmount}
          setTransferAmount={setTransferAmount}
          recipientAddress={recipientAddress}
          setRecipientAddress={setRecipientAddress}
          handleTransferSubmit={handleTransferSubmit}
          handleTransferAmountChange={handleTransferAmountChange}
          handleRecipientAddressChange={handleRecipientAddressChange}
          handleMaxTransfer={handleMaxTransfer}
          transferOngoing={transferOngoing}
          validationStatus={validationStatus}
        />
      )}

      <MessagesDrawer
        userAddress={userAddress}
        isOpen={messagesDrawerOpen}
        onClose={() => setMessagesDrawerOpen(false)}
        chats={chatsFromFriends}
        messages={messagesByPeer}
        selectedChat={selectedChat}
        setSelectedChat={(id) => {
          setSelectedChat(id);
          if (id) fetchMessagesFor(id).catch(() => {});
        }}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        onSendMessage={handleSendMessage}
        onPay={handlePay}
        onOpenAddFriend={() => setAddFriendModalOpen(true)}
        pendingIncoming={pendingIncoming.map((r) => {
          const p = userAddress ? peerOf(r, userAddress) : "";
          return {
            peer: p,
            name: displayName(r, userAddress!),
            avatar: pickAvatar(p),
          };
        })}
        pendingOutgoing={pendingOutgoing.map((r) => {
          const p = userAddress ? peerOf(r, userAddress) : "";
          return {
            peer: p,
            name: displayName(r, userAddress!),
            avatar: pickAvatar(p),
          };
        })}
        onAcceptFriend={handleAcceptFriend}
        onCancelRequest={handleCancelRequest}
      />

      {addFriendIsMounted && (
        <AddFriendModal
          show={addFriendShow}
          onClose={() => {
            setAddFriendModalOpen(false);
            setTimeout(() => {
              setFriendName("");
              setFriendAddress("");
              setFriendValidationStatus("idle");
            }, 300);
          }}
          friendName={friendName}
          friendAddress={friendAddress}
          onAddFriend={handleAddFriendSubmit}
          handleFriendNameChange={handleFriendNameChange}
          handleFriendAddressChange={handleFriendAddressChange}
          validationStatus={friendValidationStatus}
          addFriendOngoing={addFriendOngoing}
        />
      )}
    </main>
  );
}

export default App;
