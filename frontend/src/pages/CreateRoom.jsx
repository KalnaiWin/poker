import {
  ArrowLeft,
  Box,
  CircleMinus,
  CirclePlus,
  Loader,
  LockKeyhole,
  LockKeyholeOpen,
  User2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useRoomStore } from "../stores/useRoomStore";
import { useAuthStore } from "../stores/useAuthStore";

export const CreateRoom = () => {
  const {
    isPendingFunction,
    createRoom,
    room,
    getAllRoom,
    deleteRoom,
    isDeletingRoom,
  } = useRoomStore();
  const { authPlayer } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    totalContain: 2,
    isPrivate: false,
    password: "",
  });

  useEffect(() => {
    getAllRoom();
  }, [getAllRoom]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createRoom(formData);
    setFormData({
      name: "",
      totalContain: 2,
      isPrivate: false,
      password: "",
    });
  };

  const roomList = Array.isArray(room) ? room : room?.rooms || [];
  const playerRooms = roomList.filter(
    (r) => String(r.creator?._id || r.creator) === String(authPlayer?._id)
  );

  return (
    <div className="w-full h-screen bg-blue-950">
      <button className="bg-white px-4 py-2 rounded-md absolute top-5 left-5 cursor-pointer hover:opacity-80">
        <Link className="flex font-black" to={"/"}>
          <ArrowLeft /> Back
        </Link>
      </button>
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <h1 className="text-white font-bold text-5xl">Create room</h1>
        <form
          className="flex flex-col w-2/3 bg-white py-5 px-10 rounded-md my-10 gap-5"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xl font-bold">Room{"'s"} Name</label>
            <input
              type="text"
              value={formData.name}
              placeholder="Enter your name"
              className="py-2 bg-blue-300 placeholder-black border-2 border-black rounded-md w-full
                 focus:placeholder-white  focus:bg-blue-500 text-white focus:text-white
                 transition-colors duration-200 indent-3"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="flex w-full items-start gap-10">
            <div className="flex flex-col gap-1 justify-center items-center">
              <label className="text-xl font-bold">Status</label>
              <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isPrivate: e.target.checked ? true : false,
                  })
                }
              />
              {formData.isPrivate ? (
                <div className="flex gap-2 items-center">
                  <LockKeyhole className="text-red-500" />
                  <p className="font-medium">Private</p>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <LockKeyholeOpen className="text-green-500" />
                  <p className="font-medium">Public</p>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-xl font-bold">Password</label>
              <input
                type="text"
                placeholder="Enter your room's password"
                className={`py-2 bg-blue-300 placeholder-black border-2 border-black rounded-md w-full
                 focus:placeholder-white  focus:bg-blue-500 text-white focus:text-white
                 transition-colors duration-200 indent-3 ${
                   formData.isPrivate === false
                     ? "opacity-50 hover:cursor-not-allowed"
                     : ""
                 }`}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={!formData.isPrivate}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <label className="text-xl font-bold">Total players</label>
            <input
              type="number"
              value={formData.totalContain}
              className="py-1 bg-blue-300 placeholder-black border-2 border-black rounded-md w-1/3
                 focus:placeholder-white  focus:bg-blue-500 text-white focus:text-white
                 transition-colors duration-200 indent-3"
              placeholder="the number of players"
              onChange={(e) =>
                setFormData({ ...formData, totalContain: e.target.value })
              }
            />
          </div>
          <div className="w-full flex justify-between">
            <div className="flex gap-2 items-center">
              <Box className="text-red-500" />
              <p className="text-xl font-bold">
                {playerRooms?.length}
                {"/"}5
              </p>
            </div>
            {playerRooms?.length < 5 ? (
              isPendingFunction ? (
                <button
                  className="hover:cursor-not-allowed bg-blue-600 text-white px-4 py-2 rounded-md opacity-50 text-xl font-bold flex items-center gap-1"
                  disabled
                >
                  <Loader className="animate-spin" /> Creating ....
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:opacity-80 text-xl font-bold flex items-center gap-1 cursor-pointer"
                >
                  <CirclePlus />
                  Create
                </button>
              )
            ) : (
              <p className="text-red-500 flex items-center gap-2">
                <CircleMinus />
                You have reached the max of total rooms
              </p>
            )}
          </div>
        </form>
        <div className="flex gap-2 w-2/3 justify-start">
          {playerRooms.map((r, index) => (
            <div
              key={index || r._id}
              className="bg-white px-5 py-2 rounded-md text-sm"
            >
              <div className="flex gap-2">
                <p className="font-bold line-clamp-1 max-w-2xl">{r.name}</p>
                <p>
                  {new Date(r.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="flex gap-2 justify-center mb-3">
                Max player: <User2 className={`${r.isPrivate ? "text-red-500" : "text-green-500"}`} />
                <p className="font-black">{r.totalContain}</p>
              </span>
              {isDeletingRoom ? (
                <button
                  className="bg-red-500 text-white px-3 py-2 rounded-md w-full opacity-50 cursor-not-allowed flex items-center gap-2"
                  disabled
                >
                  <Loader className="animate-spin" />
                  Deleting ...
                </button>
              ) : (
                <button
                  className="bg-red-500 text-white px-3 py-2 rounded-md w-full hover:opacity-80 cursor-pointer"
                  onClick={() => deleteRoom(r._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
