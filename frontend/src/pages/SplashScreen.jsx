export default function SplashScreen() {
  return (
    <div className="h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center animate-fade">
        <h1 className="text-6xl font-extrabold text-white">ClaimAxis</h1>
        <p className="text-gray-400 mt-3 tracking-wide">
          Initializing AI systems…
        </p>
      </div>
    </div>
  );
}
