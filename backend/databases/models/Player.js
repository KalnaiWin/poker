import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "This name has been already used"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "This email has been already used"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      required: [true, "This ppassword has been alreayd used"],
    },
    playerImg: {
      type: String,
      default: "file:///D:/Full/Poker/Poker/avatar-anonymous.png",
    },
    gender: {
      type: String,
      enum: [
        "male",
        "female",
        "croissant",
        "egg",
        "robot",
        "other",
        "sandwich",
        "anonymous",
      ],
      default: "anonymous",
    },
    chips: {
      type: Number,
      default: 2000,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },
    history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "History",
      },
    ],
    win: {
      type: Number,
      default: 0,
    },
    lose: {
      type: Number,
      default: 0,
    },
    last_daily_claim: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Player = mongoose.model("Player", playerSchema);

export default Player;
