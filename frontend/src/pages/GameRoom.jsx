import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useRoomStore } from "../stores/useRoomStore";
import { DollarSign, LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { usePokerStore } from "../stores/usePokerStore";
import { ActionIcon } from "../databases/types";
import { ButtonAction } from "../components/ButtonAction";

export const GameRoom = ({ thisRoom }) => {
  const { authPlayer } = useAuthStore();
  const { getAllRoom } = useRoomStore();
  const {
    initSocketListeners,
    isStart,
    currentCardonTable,
    playersCard,
    showdown,
  } = usePokerStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllRoom();
  }, [getAllRoom]);

  useEffect(() => {
    initSocketListeners();
  }, [initSocketListeners]);

  return (
    <div className="relative w-full h-screen">
      <div className="absolute-center flex justify-center gap-2">
        {currentCardonTable.map((card, idx) => (
          <div key={idx} className="w-[15%]">
            <img
              src={`/assets/cards/${card}.png`}
              alt={card}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
      <div className="absolute left-5 top-5 flex flex-col gap-2">
        {showdown === false && <ButtonAction thisRoom={thisRoom} />}
      </div>
      <div className="absolute top-10 flex justify-center w-full">
        <p className="text-gray-400 italic">
          {isStart ? "Start" : "Loading room..."}
        </p>
      </div>
      <div className="absolute bottom-10 flex gap-5 px-10">
        {thisRoom.members.map((player, index) => {
          const isSmallBlind = index === 0;
          const isBigBlind = index === 1;
          return (
            <div
              className="flex flex-col items-center justify-center"
              key={player._id}
            >
              <div className="my-2">
                {isSmallBlind ? (
                  <p className="text-green-200">Small Blind</p>
                ) : isBigBlind ? (
                  <p className="text-red-200">Big Blind</p>
                ) : (
                  ""
                )}
              </div>
              <div
                className={`size-15 rounded-md p-1 border-2  ${
                  authPlayer.name === player.name
                    ? "border-white"
                    : "border-white/50"
                }`}
              >
                <img
                  src={player.playerImg}
                  alt={player.name}
                  className="rounded-md"
                />
              </div>
              <p
                className={`${
                  authPlayer.name === player.name
                    ? "text-white"
                    : "text-white/50"
                }`}
              >
                {player.name}
              </p>
              <div className="p-1 rounded-sm bg-white text-yellow-600 my-2 flex gap-1">
                <DollarSign />
                <p className="font-bold">{player.chips}</p>
              </div>
              <div className="flex gap-2 mt-2">
                {playersCard[player._id]?.map((card, i) => (
                  <img
                    key={i}
                    src={`/assets/cards/${card}.png`}
                    alt={card}
                    className="w-10 h-14 object-contain"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
