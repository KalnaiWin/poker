import {
  Bot,
  Croissant,
  Egg,
  HatGlasses,
  Mars,
  Plane,
  Sandwich,
  Venus,
} from "lucide-react";

export const GenderIcon = ({ name }) => {
  switch (name) {
    case "male":
      return <Mars className="text-blue-500" />;
    case "female":
      return <Venus className="text-pink-500" />;
    case "croissant":
      return <Croissant className="text-yellow-500" />;
    case "egg":
      return <Egg className="text-amber-500" />;
    case "robot":
      return <Bot className="text-gray-500" />;
    case "sandwich":
      return <Sandwich className="text-green-500" />;
    case "plane":
      return <Plane className="text-orange-500" />;
    default:
      return <HatGlasses className="text-purple-500" />;
  }
};

export const BestHandColor = (name) => {
  switch (name) {
    case "High Card":
      return "text-gray-500";
    case "One Pair":
      return "text-blue-500";
    case "Two Pair":
      return "text-indigo-500";
    case "Three of a Kind":
      return "text-purple-500";
    case "Straight":
      return "text-pink-500";
    case "Flush":
      return "text-red-500";
    case "Full House":
      return "text-orange-500";
    case "Four of a Kind":
      return "text-yellow-500";
    case "Straight Flush":
      return "text-green-500";
    case "Royal Flush":
      return "text-teal-500";
    default:
      return "text-black";
  }
};

export const RankPositionColor = (position) => {
  switch (position) {
    case 1:
      return "text-yellow-500";
    case 2:
      return "text-gray-500";
    case 3:
      return "text-amber-500";
    default:
      return "text-black";
  }
};
