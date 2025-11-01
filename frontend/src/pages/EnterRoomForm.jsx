import { useNavigate, useParams } from "react-router";
import { useRoomStore } from "../stores/useRoomStore";
import { useEffect } from "react";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { RoomDesign } from "../components/RoomDesign";

export const EnterRoomForm = () => {
  const { room, getAllRoom, leaveRoom } = useRoomStore();
  const { authPlayer } = useAuthStore();
  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    getAllRoom();
  }, [getAllRoom]);

  const thisRoom = room?.find((r) => r._id === roomId);

  useEffect(() => {
    if (thisRoom && authPlayer) {
      const isPlayerMember = thisRoom.members?.some(
        (member) => member._id?.toString() === authPlayer?._id?.toString()
      );
      if (thisRoom.isPrivate && !isPlayerMember) {
        navigate(`/join/${roomId}/password`, { replace: true });
      }
    }
  }, [thisRoom, authPlayer, roomId, navigate]);

  if (!thisRoom) return <p>Loading room...</p>;

  const isPlayerMember = thisRoom.members?.some(
    (member) => member._id?.toString() === authPlayer?._id?.toString()
  );

  if (!isPlayerMember && thisRoom.isPrivate) {
    return null; 
  }

  return (
    <div className="bg-green-900 w-full h-screen relative flex justify-center items-center">
      <RoomDesign thisRoom={thisRoom} />
      <button
        onClick={() => {
          leaveRoom(roomId);
          navigate("/join");
        }}
        className="text-white absolute top-[50%] rotate-90 -right-10 bg-red-600 px-5 py-1 rounded-md flex items-center gap-2 hover:opacity-80 cursor-pointer"
      >
        <LogOut />
        Leave
      </button>
    </div>
  );
};
