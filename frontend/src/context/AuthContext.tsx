import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  id: string;
  email: string;
  userType: "freelancer" | "client" | "agency" | "admin";
  firstName?: string;
  lastName?: string;
  isEmailVerified?: boolean;
  profileImage?: string;
}

interface SessionData {
  sessionId: string;
  expiresAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  initializing: boolean;
  sessionData: SessionData | null;
  login: (userData: User, token: string, sessionData: SessionData) => void;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedSessionData = localStorage.getItem("sessionData");
      const token = localStorage.getItem("token");
      
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
        if (storedSessionData) {
          setSessionData(JSON.parse(storedSessionData));
        }
      }
    } catch (err) {
      console.error("Error restoring user:", err);
    } finally {
      setInitializing(false);
    }
  }, []);

  const login = (userData: User, token: string, sessionData: SessionData) => {
    setUser(userData);
    setSessionData(sessionData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("sessionData", JSON.stringify(sessionData));
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Call logout API to invalidate session
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setUser(null);
      setSessionData(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("sessionData");
    }
  };

  const logoutAll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Call logout-all API to invalidate all sessions
        await fetch("/api/auth/logout-all", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Error during logout all:", error);
    } finally {
      setUser(null);
      setSessionData(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("sessionData");
    }
  };

  const hasRole = (role: string) => user?.userType === role;

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated: !!user, 
        initializing, 
        sessionData,
        login, 
        logout, 
        logoutAll, 
        hasRole 
      }}
    >
      {/* Render only after restoring user */}
      {!initializing && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
