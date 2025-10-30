import bcrypt from "bcryptjs";
import Room from "../databases/models/Room.js";
import Message from "../databases/models/Message.js";

export const CreateRoom = async (req, res) => {
  const { name, totalContain, isPrivate, password } = req.body;
  const ownerRoom = req.player._id;
  try {
    if (!ownerRoom) {
      return res.status(404).json({ message: "Player not found controller" });
    }

    if (!name)
      return res.status(400).json({ message: "Room's name is required" });

    const salt = await bcrypt.genSalt(10);
    let hashedPassword = null;

    if (isPrivate) {
      if (!password) {
        return res
          .status(400)
          .json({ message: "Password is required for private rooms" });
      }
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password should be at least 6 characters" });
      }

      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newRoom = await Room.create({
      name,
      password: hashedPassword,
      totalContain: totalContain || 2,
      isPrivate,
      creator: ownerRoom,
      members: [ownerRoom],
    });

    res.status(201).json({
      message: "Room created successfully",
      room: {
        _id: newRoom._id,
        name: newRoom.name,
        totalContain: newRoom.totalContain,
        isPrivate: newRoom.isPrivate,
        creator: newRoom.creator,
        members: newRoom.members,
        createdAt: newRoom.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Failed to create room" });
  }
};

export const DeleteRoom = async (req, res) => {
  const { roomId } = req.params;
  const ownerRoom = req.player._id;
  try {
    const room = await Room.findById(roomId);
    if (!room)
      return res.status(404).json({ message: "This room is not exist" });

    if (room.creator.toString() !== ownerRoom.toString())
      return res
        .status(403)
        .json({ message: "Only owner can delete this room" });

    await Message.deleteMany({ room: room._id });
    await room.deleteOne();

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("DeleteRoom Error:", error);
    res.status(500).json({ message: "Failed to delete room" });
  }
};

export const GetAllRoom = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("creator", "name")
      .sort({ createdAt: -1 });

    return res.json(rooms);
  } catch (error) {
    console.error("GetAllRoom Error:", error);
    res.status(500).json({ message: "Failed to get rooms" });
  }
};

export const JoinRoom = async (req, res) => {
  const { roomId } = req.params;
  const { password } = req.body;
  const playerId = req.player._id;

  try {
    const room = await Room.findById(roomId);
    if (!room)
      return res.status(404).json({ message: "This room is not exist" });

    if (room.isPrivate) {
      const isMatch = await bcrypt.compare(password, room.password);
      if (!isMatch)
        return res.status(401).json({ message: "Incorrect room password" });
    }

    if (room.members.includes(playerId))
      return res.status(400).json({ message: "You are already in this room" });

    if (room.totalContain === room.members.length) {
      return res.status(400).json({ message: "Room is full" });
    }

    room.members.push(playerId);
    await room.save();

    res.json({ message: "Joined room successfully", room });
  } catch (error) {
    console.error("JoinRoom Error:", error);
    res.status(500).json({ message: "Failed to join room" });
  }
};
