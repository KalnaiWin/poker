import { useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../../stores/useAuthStore";
import { Loader2, Lock, Mail, Send } from "lucide-react";

export const LoginPage = () => {
  const { isAuthLoading, login } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    login(formData);
  };

  const isStep1Done = formData.email && formData.password.length > 6;

  return (
    <div className="w-full h-screen bg-green-950">
      <div className="flex flex-col gap-5 p-10 items-center w-full h-screen text-white">
        <Link to={"/"} className="flex gap-2 items-center">
          <img src="/images/logo.png" alt="Logo" className="size-25" />
          <h1 className="text-7xl font-bold ">Poker Game</h1>
        </Link>
        <div className="flex items-end gap-5">
          <h2 className="text-2xl font-extrabold underline">Log In</h2>
          <Link to={"/signup"} className="underline opacity-60">
            Do not have an account - Sign up
          </Link>
        </div>
        <form
          className="w-full bg-white text-black flex flex-col py-5 justify-center items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-between px-5 w-full gap-20">
            <div className="w-1/3 flex flex-col gap-5 items-center">
              <div
                className={`flex justify-center items-center text-3xl size-13 border-3 rounded-full border-dashed`}
              >
                <span
                  className={`${
                    isStep1Done ? "bg-green-600 text-white" : ""
                  } size-10 rounded-full flex justify-center items-center font-black transition-all duration-300`}
                >
                  1
                </span>
              </div>
              <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col">
                  <h1 className="text-md font-medium">Account</h1>
                  <p className="text-sm text-gray-500">
                    Welcome back, player 🙋‍♂️
                  </p>
                </div>
                <div className="flex flex-col gap-1 relative focus-within:text-black text-white">
                  <input
                    type="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    className="py-2 bg-green-800 placeholder-white rounded-md pl-8
                 focus:placeholder-black focus:bg-white text-white focus:text-black
                 transition-colors duration-200 indent-3"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <Mail className="absolute left-2 top-1/2 -translate-y-1/2 transition-colors duration-200" />
                </div>
                <div className="flex flex-col gap-1 relative focus-within:text-black text-white">
                  <input
                    type="password"
                    value={formData.password}
                    placeholder="Enter your password"
                    className="py-2 bg-green-800 placeholder-white rounded-md pl-8
                 focus:placeholder-black focus:bg-white text-white focus:text-black
                 transition-colors duration-200 indent-3"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <Lock className="absolute left-2 top-1/2 -translate-y-1/2 transition-colors duration-200" />
                </div>
              </div>
            </div>
            <div className="w-1/3 flex flex-col items-center gap-5">
              <div
                className={`flex justify-center items-center text-3xl size-13 border-3 rounded-full border-dashed`}
              >
                <span
                  className={`${
                    isStep1Done ? "bg-green-600 text-white" : ""
                  } size-10 rounded-full flex justify-center items-center font-black transition-all duration-300`}
                >
                  2
                </span>
              </div>
              <div className="relative">
                <img
                  src="/images/image1.png"
                  alt="Image1"
                  className="object-cover rounded-md"
                />
                <div className="absolute p-1 -top-5 -left-3 rounded-md bg-yellow-400 -rotate-12">
                  <p className="p-1 border-2 border-dotted text-md px-4 font-bold">
                    Bet it
                  </p>
                </div>
              </div>
            </div>
            <div className="w-1/3 flex flex-col items-center gap-5">
              <div
                className={`flex justify-center items-center text-3xl size-13 border-3 rounded-full border-dashed`}
              >
                <span
                  className={`${
                    isStep1Done ? "bg-green-600 text-white" : ""
                  } size-10 rounded-full flex justify-center items-center font-black transition-all duration-300`}
                >
                  3
                </span>
              </div>
              <div className="relative">
                <img
                  src="/images/victory.png"
                  alt="victory"
                  className="object-cover rounded-md"
                />
                <div className="absolute p-1 -top-5 -left-3 rounded-md bg-red-500 -rotate-12">
                  <p className="p-1 border-2 border-dotted text-md px-4 font-bold text-white">
                    Take all
                  </p>
                </div>
              </div>
            </div>
          </div>
          {isAuthLoading ? (
            <button
              className="flex justify-center items-center gap-2 w-1/3 py-2 mt-10 bg-green-600 rounded-md cursor-not-allowed text-white opacity-50"
              disabled
            >
              <Loader2 className="animate-spin" /> Loading
            </button>
          ) : (
            <button
              type="submit"
              className="flex justify-center items-center gap-2 w-1/3 py-2 mt-10 bg-green-600 rounded-md hover:opacity-80 cursor-pointer text-white"
            >
              <Send /> Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
