import { createContext, useContext, useEffect, useState } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  mId: string | null;
  memberId: string | null;
  role: "admin" | "member" | "franchise" | null;
  loading: boolean;
  logout: () => void;
  login: (mid: string, memberId: string, role: string) => void;
}

//  sessionStorage.setItem("MID", user?.MID);
//  sessionStorage.setItem("memberID", user?.MemberID);

type Role = "admin" | "member" | "franchise";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [mId, setMID] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const mid = sessionStorage.getItem("MID");
      const memberId = sessionStorage.getItem("memberID");
      const role = sessionStorage.getItem("role");

      if (!mid || !memberId) return;

      setMID(mid as string);
      setMemberId(memberId);
      setRole(role as Role);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (mid: string, member: string, role: string) => {
    sessionStorage.setItem("MID", mid);
    sessionStorage.setItem("memberID", member);
    sessionStorage.setItem("role", role);

    setMID(mid);
    setRole(role as Role);
    setMemberId(member);
  };

  const logout = () => {
    sessionStorage.clear();
    setMID(null);
    setMemberId(null);
  };

  return (
    <AuthContext.Provider
      value={{ loading, mId, memberId, role, logout, login }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a <AuthProvider />");
  }
  return context;
};
