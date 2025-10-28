import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    opponent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    result: {
      type: String,
      enum: ["win", "lose", "draw"],
      required: true,
    },
    chipsChange: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
    },
    room: {
      id: String,
      name: String,
    },
    playedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);
export default History;
