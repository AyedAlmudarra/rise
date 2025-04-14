import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { Spinner } from 'flowbite-react';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: 'startup' | 'investor' | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'startup' | 'investor' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndRole = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch user role
          const { id: userId } = session.user;
          
          // Check startups table
          const { data: startupData, error: startupError } = await supabase
            .from('startups')
            .select('id') // Select only one column for efficiency
            .eq('user_id', userId)
            .single();
            
          if (startupData) {
            setUserRole('startup');
          } else {
            // If not found in startups, check investors table
            const { data: investorData, error: investorError } = await supabase
              .from('investors')
              .select('id') // Select only one column
              .eq('user_id', userId)
              .single();
              
            if (investorData) {
              setUserRole('investor');
            } else {
              // Handle cases where user exists but has no profile (e.g., mid-registration)
              setUserRole(null);
              console.warn(`User ${userId} found but has no matching profile in startups or investors.`);
            }
            // Log investor check errors if necessary, excluding 'PGRST116' (Not Found)
            if (investorError && investorError.code !== 'PGRST116') {
              console.error('Error checking investor profile:', investorError);
            }
          }
          // Log startup check errors if necessary, excluding 'PGRST116' (Not Found)
          if (startupError && startupError.code !== 'PGRST116') {
            console.error('Error checking startup profile:', startupError);
          }
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error fetching session or role:', error);
        setSession(null);
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Re-fetch role when auth state changes (login/logout)
      if (session?.user) {
          fetchSessionAndRole(); // Re-run the fetch logic
      } else {
          setUserRole(null); // Clear role on logout
          setLoading(false); // Ensure loading stops on logout
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    // State will be updated by onAuthStateChange listener
  };

  const value = {
    session,
    user,
    userRole,
    loading,
    signOut,
  };

  // Display loading indicator while fetching session/role
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 