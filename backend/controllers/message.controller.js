import Message from "../databases/models/Message.js";
import Player from "../databases/models/Player.js";
import Room from "../databases/models/Room.js";

export const GetAllMessage = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ room: roomId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (error) {
    console.error("GetAllMessage Error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const SendMessage = async (req, res) => {
  const { roomId } = req.params;
  const senderId = req?.player?._id;
  const { text } = req.body;
  try {
    if (!text || !text.trim()) {
      return;
    }

    const room = await Room.findById(roomId);
    const player = await Player.findById(senderId);
    if (!player || !room)
      return res.status(404).json({ message: "Player or room is not exist" });

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const newMessage = await Message.create({
      room: roomId,
      sender: senderId,
      text: text.trim(),
    });

    const populatedMsg = await newMessage.populate("sender", "name");

    res.status(201).json(populatedMsg);
  } catch (error) {
    console.error("SendMessage Error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};

export const ResetMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (room.members.length === 0) {
      await Message.deleteMany({ room: roomId });
      return res.status(200).json({ message: "All messages deleted" });
    } else {
      return res
        .status(200)
        .json({ message: "Room still has members, no reset" });
    }
  } catch (error) {
    console.error("ResetMessages Error:", error);
    res.status(500).json({ message: "Failed to reset messages" });
  }
};
