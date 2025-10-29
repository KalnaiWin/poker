import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";

export const AuthLayout = () => {
  const { authPlayer } = useAuthStore();

  if (authPlayer) return <Navigate to="/" replace />;

  return (
    <div className="h-screen w-full">
      <Outlet />
    </div>
  );
};
