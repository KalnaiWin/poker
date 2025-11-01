import { Crown, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useRoomStore } from "../stores/useRoomStore";

export const RoomDesign = ({ thisRoom }) => {
  const { authPlayer } = useAuthStore();
  const { kickPlayer, getAllRoom } = useRoomStore();

  useEffect(() => {
    getAllRoom();
  }, [getAllRoom]);

  const [tab, openTab] = useState(false);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center text-white relative">
      {/* Tab Menu */}
      <div className="absolute flex gap-2 top-5 right-5">
        <Menu className="size-8" onClick={() => openTab(!tab)} />
        {tab && (
          <div className="absolute top-0 right-10 bg-white shadow-xl rounded-lg border border-gray-200 p-4">
            <table className="min-w-[350px] text-sm text-gray-700 border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-800 border-b">
                  <th className="p-2 text-center font-semibold">Wins</th>
                  <th className="p-2 text-center font-semibold">Played</th>
                  <th className="p-2 text-center font-semibold">Name</th>
                  <th className="p-2 text-center font-semibold">Action</th>
                </tr>
              </thead>

              <tbody>
                {thisRoom.members.map((member, index) => {
                  const totalMatch = member.win + member.lose;

                  return (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-2 text-center">{member.win}</td>
                      <td className="p-2 text-center">{totalMatch}</td>

                      {/* Name + Avatar */}
                      <td className="p-2 flex items-center gap-2  relative">
                        <img
                          src={member.playerImg}
                          alt={member.name}
                          className="w-8 h-8 rounded-md object-cover border border-gray-300"
                        />

                        <span className="font-medium flex items-center gap-2">
                          {member.name}
                          {member.name === thisRoom.creator.name && (
                            <Crown className="size-5 text-yellow-500" />
                          )}
                        </span>
                      </td>

                      {member.name === thisRoom.creator.name ? (
                        <td className="p-2 text-center">
                          <p className="text-blue-500 font-semibold">Owner</p>
                        </td>
                      ) : thisRoom.creator.name === authPlayer.name ? (
                        <td className="p-2 text-center">
                          <button
                            className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                            onClick={() => kickPlayer(member._id, thisRoom._id)}
                          >
                            Kick
                          </button>
                        </td>
                      ) : (
                        <td className="p-2 text-center">
                          <p>Player</p>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div className="absolute top-2 left-2 min-w-[380px] min-h-[300px] bg-gray-900/70 rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm text-white">
          <div className="text-gray-400 p-2 rounded-md flex justify-center w-full">
            <p>Player join in the room</p>
          </div>
          <div className="p-2 rounded-md flex gap-2">
            <p className="font-medium">Player #1: </p>
            <span className="text-blue-300">Hello everyone 👋</span>
          </div>
        </div>

        {/* Input area */}
        <div className="flex items-center bg-gray-800/80 p-2">
          <textarea
            rows={1}
            placeholder="Type a message..."
            className="flex-1 resize-none bg-gray-700/70 text-white rounded-md p-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2 text-sm">
            Send
          </button>
        </div>
      </div>

      <div className="w-[10%]">
        <img
          src="/images/table.png"
          alt="Table"
          className="object-cover rounded-md"
        />
      </div>
      <div className="text-center">
        <h2>Room: {thisRoom.name}</h2>
        <p>Total Players: {thisRoom.totalContain}</p>
        <p>Private: {thisRoom.isPrivate ? "Yes" : "No"}</p>
      </div>
      <div className="grid grid-cols-10 gap-2 absolute bottom-10 w-full px-10">
        {thisRoom.members.map((member, index) => (
          <div className="flex gap-2 items-center" key={index}>
            <img
              src={member.playerImg}
              alt={member.name}
              className="size-10 border-2 border-white rounded-md"
            />
            <p>{member.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
