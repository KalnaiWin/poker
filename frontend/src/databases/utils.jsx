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
