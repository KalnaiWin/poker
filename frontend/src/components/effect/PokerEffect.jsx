import { usePokerStore } from "../../stores/usePokerStore";

export const MainEffect = () => {
  const { effect } = usePokerStore();

  if (!effect) return null;

  const Effects = {
    start: <StartGameEffect />,
    turn: <TurnEffect />,
    river: <RiverEffect />,
    showdown: <Showdown />,
  };

  return <div>{Effects[effect]}</div>;
};

export const StartGameEffect = () => {
  return (
    <div className="animate-slide bg-red-500 px-10">
      <div className="text-6xl font-black text-white text-center p-5">
        Bet your chips
      </div>
    </div>
  );
};

export const TurnEffect = () => {
  return (
    <div className="animate-slide bg-blue-500 px-10">
      <div className="text-6xl font-black text-white text-center p-5">
        Start the turn
      </div>
    </div>
  );
};

export const RiverEffect = () => {
  return (
    <div className="animate-slide bg-purple-500 px-10">
      <div className="text-6xl font-black text-white text-center p-5">
        Start the river
      </div>
    </div>
  );
};

export const Showdown = () => {
  return (
    <div className="animate-slide bg-yellow-400 px-10">
      <div className="text-6xl font-black text-white text-center p-5">
        Show down
      </div>
    </div>
  );
};
