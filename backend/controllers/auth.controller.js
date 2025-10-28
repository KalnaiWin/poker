import { genrateToken } from "../config/utils.js";
import Player from "../databases/models/Player.js";
import bcrypt from "bcryptjs";

export const SignUp = async (req, res) => {
  const { name, email, password, playerImg, gender } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "The length of password should be at least 6." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existUserWithThisEmail = await Player.findOne({ email: email });
    if (existUserWithThisEmail)
      return res
        .status(400)
        .json({ message: "This email has been already used." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newPlayer = new Player({
      name,
      email,
      password: hashedPassword,
      playerImg,
      gender,
    });

    if (newPlayer) {
      const savedPlayer = await newPlayer.save();
      genrateToken(savedPlayer._id, res);
      res.status(201).json({
        _id: newPlayer.id,
        name: newPlayer.name,
        email: newPlayer.email,
        password: newPlayer.password,
        playerImg: newPlayer.playerImg,
        gender: newPlayer.gender,
      });
    }
  } catch (error) {
    console.log("Error in signup controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const player = await Player.findOne({ email });
    if (!player) return res.status(400).json({ message: "Invalid Credential" });

    const isPasswordCorrect = await bcrypt.compare(password, player.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Creadentials" });

    genrateToken(player._id, res);
    res.status(200).json({
      _id: player._id,
      name: player.name,
      email: player.email,
      playerImg: player.playerImg,
      gender: player.gender,
    });
  } catch (error) {
    console.error("Error in login controller: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const LogOut = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully." });
};

export const SelectImg = (req, res) => {
  const { image } = req.body;
  try {
  } catch (error) {}
};
