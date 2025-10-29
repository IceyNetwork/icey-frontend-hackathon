export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "4s" }}
      ></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "4s", animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-400/8 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "4s", animationDelay: "2s" }}
      ></div>
    </div>
  );
};
