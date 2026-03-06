import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import authApi from "../services/api/auth";
import { CircularProgress, Box } from "@mui/material";

interface User {
  id: string;
  fn: string;
  ln: string;
  lg: string;
  rl: { sm: string; mt: string }[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const checkUser = async () => {
    try {
      const res = await authApi.me();
      if (res.success && res.data?.data) {
        const u = res.data.data;
        const isManager = u.rl?.some((x: any) => x.mt === "all" && x.sm === "all");
        
        if (isManager) {
          setUser(u);
        } else {
          setUser(null);
          if (location.pathname !== "/login") {
            navigate("/login");
          }
        }
      } else {
        setUser(null);
        if (location.pathname !== "/login") {
          navigate("/login");
        }
      }
    } catch (err) {
      setUser(null);
      if (location.pathname !== "/login") {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, [location.pathname]);

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    navigate("/login");
  };

  const refreshUser = async () => {
    setLoading(true);
    await checkUser();
  };

  if (loading && location.pathname !== "/login") {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
