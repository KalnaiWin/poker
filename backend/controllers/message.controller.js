import Message from "../databases/models/Message.js";
import Player from "../databases/models/Player.js";
import Room from "../databases/models/Room.js";

export const GetAllMessage = async (req, res) => {
  const { roomId } = req.params;
  try {
    const messages = await Message.find({ room: roomId })
      .populate("sender", "name")
      .populate("reply", "text sender")
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (error) {
    console.error("GetAllMessage Error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const SendMessage = async (req, res) => {
  const { roomId, senderId, text } = req.body;
  try {
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

export const ReplyMessage = async (req, res) => {
  const { roomId, senderId, text, replyTo } = req.body;
  try {
    const room = await Room.findById(roomId);
    const player = await Player.findById(senderId);
    if (!player || !room)
      return res.status(404).json({ message: "Player or room is not exist" });

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required" });
    }

    const originalMessage = await Message.findOne({
      _id: replyTo,
      room: roomId,
    });
    if (!originalMessage) {
      return res.status(404).json({ message: "Original message not found" });
    }

    const replyMsg = await Message.create({
      room: roomId,
      sender: senderId,
      text: text.trim(),
      reply: replyTo,
    });

    const populatedMsg = await replyMsg.populate([
      { path: "sender", select: "name" },
      {
        path: "reply",
        select: "text sender",
        populate: { path: "sender", select: "name" },
      },
    ]);

    res.status(201).json(populatedMsg);
  } catch (error) {
    console.error("ReplyMessage Error:", error);
    res.status(500).json({ message: "Failed to reply to message" });
  }
};
