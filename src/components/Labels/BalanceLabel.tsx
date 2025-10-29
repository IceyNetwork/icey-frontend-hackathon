interface BalanceLabelProps {
  balance: string;
}
export const BalanceLabel = ({ balance }: BalanceLabelProps) => {
  return (
    <div className="text-center mb-12">
      <p className="text-cyan-300/60 text-sm mb-2 uppercase tracking-wider">
        Total Balance
      </p>
      <h2 className="text-7xl font-bold bg-linear-to-r from-cyan-200 via-blue-200 to-cyan-300 bg-clip-text text-transparent mb-2">
        ${balance ?? "0"}
      </h2>
    </div>
  );
};
