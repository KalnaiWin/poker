import { Crown, Menu, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useRoomStore } from "../stores/useRoomStore";
import { ChatPage } from "../pages/ChatPage";
import { GameRoom } from "../pages/GameRoom";

export const RoomDesign = ({ thisRoom }) => {
  const { authPlayer } = useAuthStore();
  const { kickPlayer, getAllRoom } = useRoomStore();

  useEffect(() => {
    getAllRoom();
  }, [getAllRoom]);

  const [tab, openTab] = useState(false);
  const [chat, openChat] = useState(false);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center text-white relative">
      {/* Tab Menu */}
      <div className="absolute top-5 right-5 flex flex-col gap-4 z-20">
        <div className="flex gap-2 top-5 right-5 justify-end">
          <Menu
            className="size-8"
            onClick={() => {
              openTab(!tab);
              openChat(false);
            }}
          />
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
                              onClick={() =>
                                kickPlayer(member._id, thisRoom._id)
                              }
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
        {/* Chat */}
        <div className="flex gap-2">
          {chat && <ChatPage thisRoom={thisRoom} />}
          <MessageCircle
            className="size-8"
            onClick={() => {
              openChat(!chat);
              openTab(false);
            }}
          />
        </div>
      </div>
      <div className="w-full z-10">
        <GameRoom thisRoom={thisRoom} />
      </div>
    </div>
  );
};
