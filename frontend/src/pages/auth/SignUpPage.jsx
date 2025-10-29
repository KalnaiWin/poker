import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { Link } from "react-router";
import { AvatarList, GenderList } from "../../databases/types";
import { Loader2, Lock, Mail, Send, User } from "lucide-react";

export const SignUpPage = () => {
  const { isAuthLoading, signup } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    playerImg: "/assets/avatar-anonymous.png",
    gender: "anonymous",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    signup(formData);
  };

  const isStep1Done = formData.name && formData.email && formData.password;

  return (
    <div className="w-full h-screen bg-green-950">
      <div className="flex flex-col gap-5 p-10 items-center w-full h-screen text-white">
        <Link to={"/"} className="flex gap-2 items-center">
          <img src="/images/logo.png" alt="Logo" className="size-25" />
          <h1 className="text-7xl font-bold ">Poker Game</h1>
        </Link>
        <div className="flex items-end gap-5">
          <h2 className="text-2xl font-extrabold underline">Sign up</h2>
          <Link to={"/login"} className="underline opacity-60">
            Already have an account - Login
          </Link>
        </div>{" "}
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
                    Create your account 🙋‍♂️
                  </p>
                </div>
                <div className="flex flex-col gap-1 relative focus-within:text-black text-white">
                  <input
                    type="text"
                    value={formData.name}
                    placeholder="Enter your name"
                    className="py-2 bg-green-800 placeholder-white rounded-md pl-8
                 focus:placeholder-black focus:bg-white text-white focus:text-black
                 transition-colors duration-200 indent-3"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <User className="absolute left-2 top-1/2 -translate-y-1/2 transition-colors duration-200" />
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
            <div className="w-1/3">
              <div className="flex flex-col gap-5 items-center">
                <div
                  className={`flex justify-center items-center text-3xl size-13 border-3 rounded-full border-dashed`}
                >
                  <span
                    className={`${
                      isStep1Done ? "bg-green-600 text-white" : ""
                    } size-10 rounded-full flex justify-center items-center font-black`}
                  >
                    2
                  </span>
                </div>
                <div className="flex flex-col">
                  <label className="text-md font-medium">Avatar</label>
                  <p className="text-sm text-gray-500">
                    Choose the avatar that you want 😃
                  </p>
                  <div className="mt-3 overflow-y-auto p-1">
                    <div className="grid grid-cols-4 gap-3 h-50">
                      {AvatarList.map((avatar, index) => (
                        <div
                          key={index}
                          className={`size-20 rounded-md cursor-pointer`}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              playerImg: avatar.href,
                            })
                          }
                        >
                          <img
                            src={avatar.href}
                            alt={avatar.name}
                            className={`object-cover rounded-md border-3 ${
                              formData.playerImg === avatar.href
                                ? "border-green-500 scale-105"
                                : "border-transparent hover:border-gray-400"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/3">
              <div className="flex flex-col gap-5 items-center">
                <div
                  className={`flex justify-center items-center text-3xl size-13 border-3 rounded-full border-dashed`}
                >
                  <span
                    className={`${
                      isStep1Done ? "bg-green-600 text-white" : ""
                    } size-10 rounded-full flex justify-center items-center font-black`}
                  >
                    3
                  </span>
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-md font-medium">Gender</label>
                  <p className="text-sm text-gray-500">
                    What gender are you 🤔
                  </p>
                  <div className="mt-3 overflow-y-auto p-1">
                    <div className="grid grid-cols-4 gap-3 h-50">
                      {GenderList.map((gender, index) => (
                        <div
                          key={index}
                          className={`bg-black p-2 flex justify-center items-center rounded-md cursor-pointer border-4  ${
                            formData.gender === gender.name
                              ? `${gender.border}`
                              : ""
                          }`}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              gender: gender.name,
                            })
                          }
                        >
                          <gender.icon className={`size-10 ${gender.color}`} />
                        </div>
                      ))}
                    </div>
                  </div>
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
