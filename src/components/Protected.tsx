import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
  const { loading, mId, memberId } = useAuth();

  if (loading) {
    return <Loader2 className="animate-spin" />;
  }

  if (!mId || !memberId) {
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
};

export default Protected;
