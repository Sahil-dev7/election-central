import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";

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
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile and role from database
  const fetchUserProfile = useCallback(async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      // Fetch voter profile
      const { data: voter, error: voterError } = await supabase
        .from("voters")
        .select("*")
        .eq("id", supabaseUser.id)
        .maybeSingle();

      // Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", supabaseUser.id)
        .maybeSingle();

      if (voterError) {
        console.error("Error fetching voter profile:", voterError);
      }
      if (roleError) {
        console.error("Error fetching user role:", roleError);
      }

      const role = (roleData?.role as UserRole) || "voter";
      const fullName = voter?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0] || "User";

      return {
        id: supabaseUser.id,
        name: fullName,
        email: supabaseUser.email || "",
        role,
        avatar: supabaseUser.user_metadata?.avatar_url,
      };
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;

          if (session?.user) {
            // Use setTimeout to avoid potential deadlock with Supabase client
            setTimeout(async () => {
              if (!mounted) return;
              const profile = await fetchUserProfile(session.user);
              if (mounted) {
                setUser(profile);
                setIsLoading(false);
              }
            }, 0);
          } else {
            setUser(null);
            setIsLoading(false);
          }
        });

        // THEN get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          const profile = await fetchUserProfile(session.user);
          if (mounted) {
            setUser(profile);
          }
        }
        
        if (mounted) {
          setIsLoading(false);
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [fetchUserProfile]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user);
        setUser(profile);
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login exception:", error);
      setIsLoading(false);
      return false;
    }
  }, [fetchUserProfile]);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error("Registration error:", error.message);
        setIsLoading(false);
        return false;
      }

      // Note: User needs to verify email before they can sign in
      // The trigger will auto-create their profile when they verify
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Registration exception:", error);
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    // Note: In production, role switching should only be allowed for super_admins
    // and should update the database. For now, this is a local-only operation.
    if (user) {
      setUser({ ...user, role });
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
