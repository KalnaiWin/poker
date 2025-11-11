import { useNavigate } from "react-router";
import { ActionIcon } from "../databases/types";
import { useAuthStore } from "../stores/useAuthStore";
import { usePokerStore } from "../stores/usePokerStore";
import { useRoomStore } from "../stores/useRoomStore";
import { useEffect } from "react";
import {
  ArrowUpCircle,
  Check,
  Coins,
  Gamepad2,
  HandCoins,
  LogOut,
  XCircle,
} from "lucide-react";

export const ButtonAction = ({ thisRoom }) => {
  const { authPlayer } = useAuthStore();
  const { getAllRoom, leaveRoom } = useRoomStore();
  const {
    cards,
    startGame,
    initSocketListeners,
    isStart,
    turnPlayerId,
    betChips,
  } = usePokerStore();
  const navigate = useNavigate();

  useEffect(() => {
    getAllRoom();
  }, [getAllRoom]);

  useEffect(() => {
    initSocketListeners();
  }, [initSocketListeners]);

  const handleAction = (action) => {
    let chipBet = 0;

    if (action === "bet") chipBet = 1;
    if (action === "call") chipBet = 50; 

    betChips(chipBet, roomId, authPlayer._id, action);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Gamepad2 className="text-sky-400" />
          Guide
        </div>
        <div
          className="flex items-center gap-2"
          onClick={() => handleAction("fold")}
        >
          <XCircle className="text-red-500" />
          Fold
        </div>
        <div
          className="flex items-center gap-2"
          onClick={() => handleAction("check")}
        >
          <Check className="text-green-400" />
          Check
        </div>
        <div
          className="flex items-center gap-2"
          onClick={() => handleAction("call")}
        >
          <HandCoins className="text-yellow-400" />
          Call
        </div>
        <div
          className="flex items-center gap-2"
          onClick={() => handleAction("bet")}
        >
          <Coins className="text-amber-500" />
          Bet
        </div>
        <div
          className="flex items-center gap-2"
          onClick={() => handleAction("raise")}
        >
          <ArrowUpCircle className="text-purple-400" />
          Raise
        </div>
        <button
          onClick={() => {
            leaveRoom(thisRoom._id);
            navigate("/join");
          }}
          className="text-white bg-red-600 p-1 rounded-md flex items-center gap-2 hover:opacity-80 cursor-pointer"
        >
          <LogOut />
          Leave
        </button>
      </div>

      <div className="my-10 p-3 border-2 border-dashed rounded-md inline-flex gap-2 bg-white/30">
        {cards &&
          cards
            .filter((card) => card.name === authPlayer.name)
            .map((card) => (
              <div key={card.playerId} className="flex gap-2 w-fit">
                <img
                  src={`/assets/cards/${card.hand[0]}.png`}
                  alt={card.playerId}
                  className="w-20 h-auto object-cover"
                />
                <img
                  src={`/assets/cards/${card.hand[1]}.png`}
                  alt={card.playerId}
                  className="w-20 h-auto object-cover"
                />
              </div>
            ))}
      </div>
      {thisRoom.creator._id === authPlayer._id && (
        <div
          className="p-2 border-2 border-dashed"
          onClick={() => startGame(thisRoom._id)}
        >
          <p className="bg-blue-500 p-1 text-center rounded-sm hover:opacity-80 transition-all duration-300 cursor-pointer">
            {isStart ? "Stop" : "Start"}
          </p>
        </div>
      )}
    </div>
  );
};
