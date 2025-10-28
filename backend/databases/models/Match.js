import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    
  },
  {
    timestamps: true,
  }
);

const Match = mongoose.model("Match", matchSchema);

export default Match;
