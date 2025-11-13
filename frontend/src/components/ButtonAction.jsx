import { useNavigate } from "react-router";
import { ActionIcon } from "../databases/types";
import { useAuthStore } from "../stores/useAuthStore";
import { usePokerStore } from "../stores/usePokerStore";
import { useRoomStore } from "../stores/useRoomStore";
import { useEffect, useState } from "react";
import {
  ArrowUpCircle,
  Check,
  Coins,
  Gamepad2,
  HandCoins,
  LogOut,
  XCircle,
} from "lucide-react";

export const ButtonAction = ({ thisRoom, SB, BB }) => {
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

  const [betAmount, setBetAmount] = useState(10);
  const [raiseAmount, setRaiseAmount] = useState(10);

  const isMyTurn = turnPlayerId === authPlayer._id;
  const isDisabled =  !isMyTurn; 
  
  useEffect(() => {
    getAllRoom();
  }, [getAllRoom]);

  useEffect(() => {
    initSocketListeners();
  }, [initSocketListeners]);

  const handleAction = (action, chipAmount = 0) => {
    if (!isMyTurn) {
      console.log("Not your turn:", authPlayer._id);
      return;
    }

    if (action === "call" || action === "fold" || action === "check") {
      betChips(undefined, thisRoom._id, authPlayer._id, action);
    } else if (action === "bet") {
      betChips(chipAmount, thisRoom._id, authPlayer._id, action);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        {!isMyTurn && (
          <div className="text-yellow-400 text-sm mb-2">
            Waiting for other players...
          </div>
        )}

        <button
          className={`flex items-center gap-2 ${!isMyTurn ? "opacity-50" : ""}`}
          disabled={!isMyTurn}
        >
          <Gamepad2 className="text-sky-400" />
          Guide
        </button>

        <button
          className={`flex items-center gap-2 ${
            isDisabled ? "opacity-50" : ""
          }`}
          onClick={() => handleAction("fold", 0)}
        >
          <XCircle className="text-red-500" />
          Fold
        </button>

        <button
          className={`flex items-center gap-2 ${
            isDisabled ? "opacity-50" : ""
          }`}
          onClick={() => handleAction("check", 0)}
          disabled={isDisabled}
        >
          <Check className="text-green-400" />
          Check
        </button>

        <button
          className={`flex items-center gap-2 ${
            isDisabled ? "opacity-50" : ""
          }`}
          onClick={() => handleAction("call", 0)}
          disabled={isDisabled}
        >
          <HandCoins className="text-yellow-400" />
          Call
        </button>

        <button
          className={`flex items-center gap-2 ${
            isDisabled ? "opacity-50" : ""
          }`}
          onClick={() => handleAction("bet", betAmount)}
          disabled={isDisabled}
        >
          <Coins className="text-amber-500" />
          <input
            type="number"
            className="w-[30%] px-1 rounded-sm border border-white text-black"
            placeholder="10"
            value={betAmount}
            onChange={(e) => setBetAmount(Number(e.target.value))}
            disabled={isDisabled}
          />
          Bet
        </button>

        <button
          className={`flex items-center gap-2 ${
            isDisabled ? "opacity-50" : ""
          }`}
          onClick={() => handleAction("raise", raiseAmount)}
          disabled={isDisabled}
        >
          <ArrowUpCircle className="text-purple-400" />
          <input
            type="number"
            className="w-[30%] px-1 rounded-sm border border-white text-black"
            placeholder="10"
            value={raiseAmount}
            onChange={(e) => setRaiseAmount(Number(e.target.value))}
            disabled={isDisabled}
          />
          Raise
        </button>

        <button
          onClick={() => {
            leaveRoom(thisRoom._id);
            navigate("/join");
          }}
          className="text-white bg-red-600 p-1 w-fit rounded-md flex items-center gap-2 hover:opacity-80 cursor-pointer"
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
          className="p-2 border-2 border-dashed w-[40%]"
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
