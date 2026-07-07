import { createContext, useContext, useEffect, useState } from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  mId: string | null;
  memberId: string | null;
  loading: boolean;
  logout: () => void;
  login: (mid: string, memberId: string) => void;
}

//  sessionStorage.setItem("MID", user?.MID);
//  sessionStorage.setItem("memberID", user?.MemberID);

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [mId, setMID] = useState<string | null>(null);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const mid = sessionStorage.getItem("MID");
      const memberId = sessionStorage.getItem("memberID");

      if (!mid || !memberId) return;

      setMID(mid as string);
      setMemberId(memberId);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (mid: string, member: string) => {
    sessionStorage.setItem("MID", mid);
    sessionStorage.setItem("memberID", member);

    setMID(mid);
    setMemberId(member);
  };

  const logout = () => {
    sessionStorage.clear();
    setMID(null);
    setMemberId(null);
  };

  return (
    <AuthContext.Provider value={{ loading, mId, memberId, logout, login }}>
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
