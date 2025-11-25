import { Link } from "lucide-react";

export const HomeLoader = () => {
  return (
    <div className="w-full h-screen bg-green-900 flex flex-col justify-center items-center px-5">
      <div className="flex gap-3 items-center mb-10">
        <img src="/images/logo.png" alt="Logo" className="w-24 h-24" />
        <h1 className="text-6xl font-black text-white drop-shadow-lg">
          Poker Game
        </h1>
      </div>

      <div className="flex flex-col items-center gap-3">
        <img
          src="/assets/avatar-anonymous.png"
          alt="Loading"
          className="h-16 w-16 rounded-md border-4 border-white shadow-lg animate-pulse"
        />
        <p className="text-white text-2xl font-semibold opacity-70">
          Loading player...
        </p>
      </div>
      <div className="flex gap-6 mt-10">
        <div className="animate-pulse px-20 py-6 rounded-lg border-4 border-blue-400 bg-blue-500/30 text-white font-bold text-xl shadow-lg select-none"></div>
        <div className="animate-pulse px-20 py-6 rounded-lg border-4 border-yellow-400 bg-yellow-500/30 text-white font-bold text-xl shadow-lg select-none"></div>
        <div className="animate-pulse px-20 py-6 rounded-lg border-4 border-red-400 bg-red-500/30 text-white font-bold text-xl shadow-lg select-none"></div>
      </div>
    </div>
  );
};
