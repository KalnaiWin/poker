import { Route, Routes } from "react-router";
import { useEffect } from "react";
import { HomeLoader } from "./components/loaders/HomeLoader";
import { Toaster } from "react-hot-toast";
import { AuthLayout } from "./layouts/AuthLayout";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { StartGame } from "./pages/home/StartGame";
import { CreateRoom } from "./pages/CreateRoom.jsx";
import { JoinRoom } from "./pages/JoinRoom.jsx";
import { EnterRoomForm } from "./pages/EnterRoomForm.jsx";
import { CheckPassword } from "./pages/CheckPassword.jsx";
import { useAuthStore } from "./stores/useAuthStore.js";

const App = () => {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <HomeLoader />;

  return (
    <div>
      <Routes>
        <Route path="/" element={<StartGame />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/join/:roomId/password" element={<CheckPassword />} />
        <Route path="/join/:roomId" element={<EnterRoomForm />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
