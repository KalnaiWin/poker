import { Link } from "react-router";
import { GenderIcon } from "../../databases/utils";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";

export const StartGame = () => {
  const { authPlayer, logout } = useAuthStore();

  return (
    <div className="w-full h-screen bg-green-900 flex flex-col justify-center items-center">
      <Link to={"/"} className="flex gap-2 items-center">
        <img src="/images/logo.png" alt="Logo" className="size-25" />
        <h1 className="text-7xl font-bold text-white">Poker Game</h1>
      </Link>
      {!authPlayer ? (
        <div className="bg-red-500 text-white p-5 text-4xl px-5 py-2 rounded-md my-10">
          <Link to={"/login"}>Start now</Link>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center my-5">
          {/* Profile */}
          <div className="flex flex-col w-full items-start">
            <div className="flex gap-5">
              <img
                src={authPlayer.playerImg}
                alt={authPlayer.name}
                className="size-10 rounded-md border-2 border-white"
              />
              <div className="text-3xl text-white font-medium relative">
                {authPlayer.name}
                <div className="absolute top-0 -right-7 opacity-80">
                  <GenderIcon name={authPlayer.gender} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white w-full"></div>

          <div className="flex gap-5 my-5">
            <Link
              to={"/dashboard"}
              className="flex gap-2 bg-green-500 text-black rounded-md px-4 py-2 border-3 border-dotted cursor-pointer hover:opacity-80"
            >
              Dashboard
            </Link>
            <Link
              to={"/create"}
              className="flex gap-2 bg-blue-500 text-black rounded-md px-4 py-2 border-3 border-dotted cursor-pointer hover:opacity-80"
            >
              Create room
            </Link>
            <Link
              to={"/join"}
              className="flex gap-2 bg-yellow-500 text-black rounded-md px-4 py-2 border-3 border-dotted cursor-pointer hover:opacity-80"
            >
              Join room
            </Link>
            <Link
              onClick={logout}
              className="flex gap-2 bg-red-500 text-black rounded-md px-4 py-2 border-3 border-dotted cursor-pointer hover:opacity-80"
            >
              Logout <LogOut />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
