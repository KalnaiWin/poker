import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
    opponents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Player",
        required: true,
      },
    ],
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
    card: [
      {
        type: String,
      },
    ],
    playerHands: [
      {
        playerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Player",
          required: true,
        },
        hand: [
          {
            type: String, // The 2 hole cards, e.g., ["AH", "KD"]
          },
        ],
        rank: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const History = mongoose.model("History", historySchema);
export default History;
