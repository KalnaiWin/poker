import { Link, useNavigate, useParams } from "react-router";
import { useRoomStore } from "../stores/useRoomStore";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeClosed, Loader2, Lock } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

export const EnterRoomForm = () => {
  const { room, getAllRoom, isPendingFunction, joinRoom, leaveRoom } =
    useRoomStore();

  const { authPlayer } = useAuthStore();

  const navigate = useNavigate();
  const { roomId } = useParams();

  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [authentication, setAuthentication] = useState(false);

  useEffect(() => {
    getAllRoom();
  }, [getAllRoom]);

  const thisRoom = room?.find((r) => r._id === roomId);

  if (!thisRoom) return <p>Loading room...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isAuthenticated = await joinRoom(password, roomId);

    if (isAuthenticated) {
      console.log("Joined room!");
      setAuthentication(true);
    }
  };

  const isPlayerMember = thisRoom.members?.some(
    (memberId) => memberId.toString() === authPlayer?._id?.toString()
  );

  if (thisRoom.isPrivate && !authentication && !isPlayerMember) {
    return (
      <div className="relative w-full h-screen">
        <button className="bg-black px-4 py-2 rounded-md absolute top-5 left-5 cursor-pointer hover:opacity-80">
          <Link className="flex font-black text-white" to={"/join"}>
            <ArrowLeft /> Back
          </Link>
        </button>
        <div className="absolute-center w-3/5">
          <h1 className="flex gap-2 text-4xl font-black">
            {thisRoom.name}
            <span className="text-sm font-normal flex items-center opacity-50">
              created by {" - "} {thisRoom.creator.name}
            </span>
          </h1>
          <form
            className="my-5 border-2 border-dashed p-10 rounded-md"
            onSubmit={handleSubmit}
          >
            <label className="text-2xl font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute top-3 left-2 text-white" />
              <input
                type={open ? "text" : "password"}
                value={password}
                className="py-3 bg-red-500 placeholder-white border-2 border-black rounded-md w-full
                 focus:placeholder-white focus:bg-red-800 text-white focus:text-white
                 transition-colors duration-200 indent-9"
                placeholder="Enter room's password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                onClick={() => setOpen(!open)}
                className="absolute top-3 right-2 text-white cursor-pointer"
              >
                {open ? <Eye /> : <EyeClosed />}
              </div>
            </div>
            <div className="my-5">
              {isPendingFunction ? (
                <button
                  className="w-full rounded-md bg-black text-white px-5 py-2 text-xl opacity-50 cursor-not-allowed flex justify-center gap-2 items-center font-medium"
                  disabled
                >
                  <Loader2 className="animate-spin" />
                  Checking ...
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full font-medium rounded-md bg-black text-white px-5 py-2 text-xl hover:opacity-80 cursor-pointer"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Room: {thisRoom.name}</h2>
      <p>Total Players: {thisRoom.totalContain}</p>
      <p>Private: {thisRoom.isPrivate ? "Yes" : "No"}</p>
      <button
        onClick={() => {
          leaveRoom(roomId);
          navigate("/join");
        }}
        className="text-red-500"
      >
        Leave
      </button>
    </div>
  );
};
