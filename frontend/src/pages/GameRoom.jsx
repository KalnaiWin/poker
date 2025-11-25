import { useAuthStore } from "../stores/useAuthStore";
import { useRoomStore } from "../stores/useRoomStore";
import { DollarSign, LogOut, Triangle } from "lucide-react";
import { useNavigate } from "react-router";
import { usePokerStore } from "../stores/usePokerStore";
import { ButtonAction } from "../components/ButtonAction";
import { BestHandColor, RankPositionColor } from "../databases/utils";
import { useEffect } from "react";
import { MainEffect } from "../components/effect/pokerEffect";

export const GameRoom = ({ thisRoom }) => {
  const { authPlayer } = useAuthStore();
  const { leaveRoom, getAllRoom } = useRoomStore();
  const {
    isStart,
    currentCardonTable,
    playersCard,
    result,
    finish,
    initSocketListeners,
    effect,
  } = usePokerStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (finish) {
      console.log("Game finished! Show results modal or reset UI.");
    } else {
      console.log("Game restarted or empty room");
    }
  }, [finish]);

  useEffect(() => {
    getAllRoom();
    initSocketListeners();
  }, [getAllRoom]);

  if (finish) {
    return (
      <div className="relative w-full h-screen p-3">
        <div className="absolute-center p-2 rounded-md bg-white text-black">
          <div className="flex gap-2 w-full flex-col items-center bg-black p-4">
            <h1 className="text-2xl font-bold text-red-400">Cards on table</h1>
            <div className="flex w-full gap-2">
              {result[0]?.bestCards?.map((img, idx) => (
                <div key={idx}>
                  <img src={`/assets/cards/${img}.png`} alt="Card on table" />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full">
            {playersCard !== null ? (
              result.map((res) => (
                <div
                  key={res.player._id}
                  className="py-1 px-5 my-2 bg-white/90 shadow-xl text-black flex w-full justify-between gap-5 items-center"
                >
                  <div
                    className={`text-2xl font-extrabold ${RankPositionColor(
                      res.position
                    )}`}
                  >
                    {res.position}
                  </div>

                  <div className="flex flex-col justify-between items-center mb-2">
                    <div className="text-lg font-normal">{res.player.name}</div>
                    <div
                      className={`text-2xl font-bold ${BestHandColor(
                        res.bestHand
                      )}`}
                    >
                      {res.bestHand}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 items-center ">
                    <div className="flex gap-2">
                      {res.playerCards.map((card, idx) => (
                        <img
                          key={idx}
                          src={`/assets/cards/${card}.png`}
                          alt={card}
                          className="w-14 h-auto rounded-md shadow"
                        />
                      ))}
                    </div>
                  </div>
                  <div
                    className={`${
                      res.status === "win" ? "text-yellow-500" : "text-gray-700"
                    } font-bold uppercase italic`}
                  >
                    {res.status}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white text-3xl bg-red-500 p-5 flex items-center">
                Winner: {result[0]} 👑{" "}
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-4 items-center">
          <button
            onClick={() => {
              leaveRoom(thisRoom._id);
              navigate("/join");
            }}
            className="text-white bg-red-600 p-2 w-fit rounded-md flex items-center gap-2 hover:opacity-80 cursor-pointer"
          >
            <LogOut />
            Leave
          </button>
          <button className="text-white bg-blue-600 p-2 w-fit rounded-md flex items-center gap-2 hover:opacity-80 cursor-pointer">
            <Triangle className="rotate-90" />
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {!result && (
        <div className="relative w-full h-screen">
          {effect && (
            <div className="relative z-50 w-full h-screen">
              <div className="absolute-center">
                <MainEffect />
              </div>
            </div>
          )}

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
            <p className="text-gray-400 italic">
              {isStart ? "Start" : "Loading room..."}
            </p>
          </div>
          <div className="absolute bottom-10 flex gap-5 px-10">
            {thisRoom.members.map((player, index) => {
              return (
                <div
                  className="flex flex-col items-center justify-center"
                  key={player._id}
                >
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
      )}
    </>
  );
};
