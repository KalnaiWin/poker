import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useRoomStore } from "../stores/useRoomStore";
import {
  ArrowUpCircle,
  Check,
  Coins,
  Gamepad2,
  HandCoins,
  LogOut,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { usePokerStore } from "../stores/usePokerStore";

export const GameRoom = ({ thisRoom }) => {
  const { authPlayer, socket } = useAuthStore();
  const { getAllRoom, leaveRoom } = useRoomStore();
  const { cards, startGame, initSocketListeners } = usePokerStore();
  const navigate = useNavigate();


  useEffect(() => {
    getAllRoom();
  }, [getAllRoom]);

  useEffect(() => {
    if (socket) {
      initSocketListeners();
    }
  }, [socket]);

  const Dealer = thisRoom.members[0];
  const SmallBlind = thisRoom.members[1];
  const BigBlind = thisRoom.members[2];

  return (
    <div className="relative w-full h-screen">
      <div className="absolute left-5 top-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Gamepad2 className="text-sky-400" />
          Guide {"( G )"}
        </div>
        <div className="flex items-center gap-2">
          <XCircle className="text-red-500" />
          Fold {"( X )"}
        </div>
        <div className="flex items-center gap-2">
          <Check className="text-green-400" />
          Check {"( E )"}
        </div>
        <div className="flex items-center gap-2">
          <HandCoins className="text-yellow-400" />
          Call {"( C )"}
        </div>
        <div className="flex items-center gap-2">
          <Coins className="text-amber-500" />
          Bet {"( B )"}
        </div>
        <div className="flex items-center gap-2">
          <ArrowUpCircle className="text-purple-400" />
          Raise {"( R )"}
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
        <div className="my-10 p-3 border-2 border-dashed rounded-md inline-flex gap-2 bg-white/30">
          {cards
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
            onClick={() => startGame(thisRoom._id, 1)}
          >
            <p className="bg-blue-500 p-1 text-center rounded-sm hover:opacity-80 transition-all duration-300 cursor-pointer">
              Start
            </p>
          </div>
        )}
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
