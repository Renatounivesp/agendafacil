import { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any } | { user: User }>;
  signIn: (email: string, password: string) => Promise<{ error: any } | { user: User }>;
  signOut: () => Promise<void>;
  updateUserProfile: (username: string) => Promise<{ error: any } | { data: any }>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up a new user
  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (error) {
        return { error };
      }

      // Create a profile for the user
      if (data.user) {
        const { error: profileError } = await supabase
          .from('perfis')
          .insert([{ 
            id: data.user.id, 
            username: username,
            email: email 
          }]);

        if (profileError) {
          return { error: profileError };
        }
      }

      return { user: data.user };
    } catch (error) {
      return { error };
    }
  };

  // Sign in a user
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      return { user: data.user };
    } catch (error) {
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Update user profile
  const updateUserProfile = async (username: string) => {
    if (!user) {
      return { error: "Usuário não autenticado" };
    }

    try {
      const { data, error } = await supabase
        .from('perfis')
        .update({ username })
        .eq('id', user.id);

      if (error) {
        return { error };
      }

      return { data };
    } catch (error) {
      return { error };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}