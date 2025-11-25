import { ArrowLeft, ChevronDown, Search } from "lucide-react";
import { Link } from "react-router";

export const AllRoomLoader = () => {
  return (
    <div className="bg-yellow-950 w-full min-h-screen text-white">
      <button className="bg-white px-4 py-2 rounded-md absolute top-5 left-5 cursor-pointer hover:opacity-80">
        <Link className="flex font-black text-black" to={"/"}>
          <ArrowLeft /> Back
        </Link>
      </button>
      <h1 className="text-center font-bold text-4xl pt-10">Join Room</h1>
      <div className="flex flex-col justify-center items-center py-10 gap-5">
        <div className="relative w-2/3 flex justify-center">
          <input
            type="text"
            placeholder="Search room"
            className="py-2 bg-yellow-500 placeholder-white border-2 border-black rounded-md w-full
                 focus:placeholder-white  focus:bg-yellow-800 text-white focus:text-white
                 transition-colors duration-200 indent-9"
          />
          <Search className="absolute top-2.5 left-2" />
        </div>
        <div className="flex w-2/3 bg-white hover:bg-white/90 rounded-md items-center px-5">
          <div className="flex items-center gap-2 justify-start w-full p-2">
            <img
              src={"/assets/avatar-anonymous.png"}
              alt={"loading"}
              className="size-10 rounded-md border-2 border-white"
            />
          </div>
          <div className={`transition-transform duration-300 `}>
            <ChevronDown className="text-black font-bold size-10" />
          </div>
        </div>
        <div className="flex w-2/3 bg-white hover:bg-white/90 rounded-md items-center px-5">
          <p className="text-xl font-black text-black p-2">Other{"'s "}room</p>
        </div>
        <div className="w-full px-10 grid grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-yellow-800 p-4 text-white shadow-lg overflow-hidden relative"
            >
              <div className="absolute inset-0 -translate-x-full  from-transparent via-white/20 to-transparent" />
              <div className="flex justify-between mb-4">
                <div className="h-6 w-1/2 bg-white/40 rounded-md" />
                <div className="flex gap-2">
                  <div className="h-6 w-10 bg-white/40 rounded-md" />
                  <div className="h-6 w-20 bg-white/40 rounded-md" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center">
                  <div className="h-6 w-6 bg-white/40 rounded-full" />
                  <div className="h-4 w-20 bg-white/40 rounded-md" />
                </div>
                <div className="h-5 w-20 bg-blue-500/50 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
