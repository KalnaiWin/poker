import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  DollarSign,
  Frown,
  Trophy,
  Undo2,
  User2,
} from "lucide-react";
import { BestHandColor } from "../databases/utils";

export const DashboardPage = () => {
  const { authPlayer, historyMatch, history } = useAuthStore();

  const [toggleHistory, setToggleHistory] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authPlayer) {
      navigate("/login");
      return;
    }
    historyMatch();
  }, [authPlayer, navigate, historyMatch]);

  if (!authPlayer) return null;

  const handleToggle = (matchId) => {
    setToggleHistory(toggleHistory === matchId ? null : matchId);
  };

  return (
    <div className="bg-black/80 w-full p-5 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="border-2 border-white p-1 w-fit rounded-md bg-white/30">
            <img
              src={`${authPlayer.playerImg}`}
              alt=""
              className="size-14 rounded-md"
            />
          </div>
          <p className={`text-4xl text-white italic font-semibold`}>
            {authPlayer.name}
          </p>
          <Link to={"/"} className="text-red-500 bg-red-300/40 rounded-md p-2">
            <Undo2 className="text-2xl font-black" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <p className="flex flex-col gap-2 border border-white bg-white/20 px-3 py-1 rounded-md">
            <div className="text-green-500 flex gap-2">
              Total Chips <DollarSign />
            </div>
            <span className="text-white">{authPlayer.chips}</span>
          </p>
          <div className="flex flex-col gap-2 border border-white bg-white/20 px-3 py-1 rounded-md">
            <div className="text-yellow-400 flex gap-2">
              Win <Trophy />
            </div>
            <p className="text-white font-bold">{authPlayer.win}</p>
          </div>
          <div className="flex flex-col gap-2 border border-white bg-white/20 px-3 py-1 rounded-md">
            <div className="text-red-500 flex gap-2">
              Lose <Frown />
            </div>
            <p className="text-white font-bold">{authPlayer.lose}</p>
          </div>
        </div>
      </div>
      <div>
        {history && history.length > 0 ? (
          <div className="flex flex-col gap-5">
            {history.map((match) => {
              const isToggled = toggleHistory === match._id;
              const chipsGet = match.chipsChange <= 0 ? "" : "+";
              return (
                <div key={match._id}>
                  <div className="border border-white py-3 px-3 flex justify-around items-center">
                    <div>
                      <p
                        className={`${
                          match.result === "win"
                            ? "text-yellow-400"
                            : match.result === "lose"
                            ? "text-red-500"
                            : "text-gray-500"
                        } text-2xl uppercase italic font-bold`}
                      >
                        {match?.result || 0}
                      </p>
                      <p className="text-white">{match.room.name}</p>
                    </div>
                    <div className="flex justify-center items-center flex-col">
                      <div className="flex gap-2 text-blue-400 text-2xl items-center">
                        <User2 className="font-extrabold" />
                        {match.opponents.length + 1}
                      </div>
                      <p
                        className={`${
                          chipsGet === "+"
                            ? "text-green-500"
                            : match.chipsChange < 0
                            ? "text-red-500"
                            : "text-white"
                        } text-md font-black`}
                      >
                        {chipsGet}
                        {match.chipsChange}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {match.card.map((cd, idx) => (
                        <img
                          key={idx}
                          src={`/assets/cards/${cd}.png`}
                          alt={cd}
                          className="w-16 object-contain"
                        />
                      ))}
                    </div>
                    <div
                      className="text-white cursor-pointer font-extrabold text-2xl hover:text-gray-400 transition-all duration-500"
                      onClick={() => handleToggle(match._id)}
                    >
                      {isToggled ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </div>
                  <div className="">
                    {isToggled && (
                      <div className="border border-t-0 border-white bg-black/60 p-4 flex flex-col overflow-x-auto">
                        <div className="grid grid-cols-4 gap-10 min-w-max">
                          {match.playerHands?.map((hand, idx) => (
                            <div
                              key={idx}
                              className="flex flex-col items-center"
                            >
                              <div className="flex gap-2 items-center">
                                <div className="text-white font-semibold mb-2">
                                  <img
                                    src={`${hand.playerId.playerImg}`}
                                    alt={hand.playerId?.name}
                                    className="w-10"
                                  />
                                  <p className="text-xl">
                                    {hand.playerId?.name || "Unknown Player"}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  {hand.hand?.map((ca) => (
                                    <img
                                      key={ca}
                                      src={`/assets/cards/${ca}.png`}
                                      alt={ca}
                                      className="w-16 h-20 object-contain"
                                    />
                                  ))}
                                </div>
                              </div>
                              <div
                                className={`text-xl font-bold mt-2 ${BestHandColor(
                                  hand.rank
                                )}`}
                              >
                                {hand.rank}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="absolute-center border-2 border-white text-center px-10 py-10 rounded-md bg-white/30 flex flex-col items-center gap-5">
            <p className="text-2xl text-blue-800 font-medium">
              <p> You have not played any matches yet.</p>
              <p>Let{"'"}s start your journey here</p>
            </p>
            <Link
              to={"/join"}
              className="text-white bg-blue-500 rounded-md w-full py-1 font-medium hover:opacity-80"
            >
              Join
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
