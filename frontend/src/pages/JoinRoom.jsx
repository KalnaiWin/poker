import { useEffect, useState } from "react";
import { useRoomStore } from "../stores/useRoomStore";
import {
  ArrowLeft,
  ChevronDown,
  LockKeyhole,
  LockKeyholeOpen,
  Search,
  User2,
} from "lucide-react";
import { Link, Navigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

export const JoinRoom = () => {
  const { getAllRoom, isLoadingRoom, room } = useRoomStore();
  const { authPlayer } = useAuthStore();

  if (!authPlayer) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    getAllRoom();
  }, [getAllRoom]);

  const [isToggle, setIsToggle] = useState(false);

  const playerRooms = room?.filter((r) => r.creator !== authPlayer?._id);

  if (isLoadingRoom) return <p>Loading rooms...</p>;

  return (
    <div className="bg-yellow-950 w-full h-screen text-white">
      <button className="bg-white px-4 py-2 rounded-md absolute top-5 left-5 cursor-pointer hover:opacity-80">
        <Link className="flex font-black text-black" to={"/"}>
          <ArrowLeft /> Back
        </Link>
      </button>
      <h1 className="text-center font-bold text-4xl pt-10">Join Room</h1>
      <div className="flex flex-col justify-center items-center my-10 gap-5">
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
        <div
          className="flex w-2/3 bg-white hover:bg-white/90 rounded-md items-center px-5"
          onClick={() => setIsToggle(!isToggle)}
        >
          <div className="flex items-center gap-2 justify-start w-full p-2">
            <img
              src={authPlayer.playerImg}
              alt={authPlayer.name}
              className="size-10 rounded-md border-2 border-white"
            />
            <p className="text-xl font-bold text-black">
              {authPlayer.name}
              {"'s "}room
            </p>
          </div>
          <div
            className={`transition-transform duration-300 ${
              isToggle ? "rotate-180" : "rotate-0"
            }`}
          >
            <ChevronDown className="text-black font-bold size-10" />
          </div>
        </div>
        <div className="w-full flex justify-center">
          {isToggle && (
            <div className="w-2/3 bg-white/10 rounded-md p-3 flex flex-col gap-2">
              {playerRooms?.length ? (
                playerRooms.map((r, index) => (
                  <div
                    key={r._id || index}
                    className="bg-yellow-800 text-white rounded-md px-3 py-2 flex flex-col gap-2"
                  >
                    <div className="flex justify-between">
                      <p className="font-bold text-lg">
                        {r.name}
                        <span className="text-sm opacity-80 font-normal">
                          {" Created by - "}
                          {r.creator.name}
                        </span>
                      </p>
                      {r.isPrivate ? (
                        <div className="flex items-center gap-2 font-medium">
                          <LockKeyhole className="text-red-500" />
                          <p>Private</p>
                        </div>
                      ) : (
                        <div className="flex  items-center gap-2 font-medium">
                          <LockKeyholeOpen className="text-green-500" />
                          <p>Public</p>
                        </div>
                      )}
                    </div>
                    <div className="w-full justify-between flex">
                      <div className="flex">
                        <div className="flex gap-2">
                          <User2 className="text-blue-300" />
                          <p>
                            {r.members?.length}
                            {"/"}
                            {r.totalContain}
                          </p>
                        </div>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-1 rounded-md">
                        Join
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-300">
                  No rooms created yet.
                </p>
              )}
            </div>
          )}
        </div>
        {/* All rooms */}
        <div></div>
      </div>
    </div>
  );
};
