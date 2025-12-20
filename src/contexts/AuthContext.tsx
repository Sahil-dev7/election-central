import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserRole = "super_admin" | "admin" | "voter";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User> = {
  "super@electvote.com": {
    id: "1",
    name: "Super Administrator",
    email: "super@electvote.com",
    role: "super_admin",
  },
  "admin@electvote.com": {
    id: "2",
    name: "Election Admin",
    email: "admin@electvote.com",
    role: "admin",
  },
  "voter@electvote.com": {
    id: "3",
    name: "John Voter",
    email: "voter@electvote.com",
    role: "voter",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("electvote_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // For demo: any email works, role determines access
    const mockUser: User = mockUsers[email] || {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split("@")[0].replace(/[.]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: role || "voter",
    };
    
    setUser(mockUser);
    localStorage.setItem("electvote_user", JSON.stringify(mockUser));
    setIsLoading(false);
    return true;
  }, []);

  const register = useCallback(async (name: string, email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: "voter", // New registrations are voters by default
    };
    
    setUser(newUser);
    localStorage.setItem("electvote_user", JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("electvote_user");
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem("electvote_user", JSON.stringify(updatedUser));
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
