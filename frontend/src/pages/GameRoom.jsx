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
  const { getAllRoom, leaveRoom } = useRoomStore();
  const {
    cards,
    startGame,
    initSocketListeners,
    isStart,
    turnPlayerId,
    currentCardonTable,
  } = usePokerStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllRoom();
  }, [getAllRoom]);

  useEffect(() => {
    initSocketListeners();
  }, [initSocketListeners]);

  const Dealer = thisRoom.members[0];
  const SmallBlind = thisRoom.members[1];
  const BigBlind = thisRoom.members[2];

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
        <ButtonAction thisRoom={thisRoom} />
      </div>
      <div className="absolute top-10 flex justify-center w-full">
        {Dealer ? (
          <p>{Dealer.name}</p>
        ) : (
          <p className="text-gray-400 italic">Loading room...</p>
        )}
      </div>
      <div className="absolute bottom-10 flex gap-5 px-10">
        {thisRoom.members.map((player, index) => {
          const isDealer = index === 0;
          const isSmallBlind = index === 1;
          const isBigBlind = index === 2;
          return (
            <div
              className="flex flex-col items-center justify-center"
              key={player._id}
            >
              <div className="my-2">
                {isDealer ? (
                  <p className="text-blue-300">Deadler</p>
                ) : isSmallBlind ? (
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
