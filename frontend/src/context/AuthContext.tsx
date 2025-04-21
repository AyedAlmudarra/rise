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
    let isMounted = true; // Prevent state updates on unmounted component

    const fetchSessionAndRole = async (currentSession: Session | null) => {
      if (!isMounted) return; // Exit if component unmounted

      setUser(currentSession?.user ?? null);
      setSession(currentSession);

      let determinedRole: 'startup' | 'investor' | null = null;

      if (currentSession?.user) {
        const currentUser = currentSession.user;
        const userId = currentUser.id;
        
        // --- Priority 1: Check user_metadata --- 
        const metadataRole = currentUser.user_metadata?.role;
        if (metadataRole === 'startup' || metadataRole === 'investor') {
            determinedRole = metadataRole;
            console.log(`Role found in metadata: ${determinedRole}`);
        }
        
        // --- Priority 2: Check database tables (if metadata role not found) --- 
        if (!determinedRole) {
            console.log(`Role not in metadata, checking database for user: ${userId}`);
             // Check startups table
             const { count: startupCount, error: startupError } = await supabase
                .from('startups')
                .select('id', { count: 'exact', head: true }) // Fetch only count
                .eq('user_id', userId);

            if (startupError && startupError.code !== 'PGRST116') { // PGRST116 = no rows found
                console.error('Error checking startup profile:', startupError);
            } else if (startupCount && startupCount > 0) { // Check the count directly
                determinedRole = 'startup';
                console.log(`Role found in startups table: ${determinedRole}`);
            } else {
                // If not found in startups, check investors table
                 const { count: investorCount, error: investorError } = await supabase
                    .from('investors')
                    .select('id', { count: 'exact', head: true })
                    .eq('user_id', userId);

                if (investorError && investorError.code !== 'PGRST116') {
                    console.error('Error checking investor profile:', investorError);
                } else if (investorCount && investorCount > 0) { // Check the count directly
                    determinedRole = 'investor';
                    console.log(`Role found in investors table: ${determinedRole}`);
                } else {
                    console.warn(`User ${userId} found but has no matching profile in startups or investors, and no role in metadata.`);
                }
            }
        }
      } else {
        // No user session
        determinedRole = null;
      }

       if (isMounted) {
            setUserRole(determinedRole);
            setLoading(false); // Set loading false after role determination
       }
    };

    // Initial check
    supabase.auth.getSession().then(({ data }) => {
        if (isMounted) {
           fetchSessionAndRole(data.session);
        }
    }).catch(error => {
        console.error("Initial getSession error:", error);
        if (isMounted) setLoading(false);
    });

    // Listener for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (isMounted) {
          console.log('Auth state changed, event:', _event, 'session:', session);
          setLoading(true); // Set loading true while re-fetching
          fetchSessionAndRole(session);
        }
    });

    return () => {
      isMounted = false; // Cleanup flag
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    // State will be updated by onAuthStateChange listener, which sets loading=false
  };

  const value = {
    session,
    user,
    userRole,
    loading,
    signOut,
  };

  // Display loading indicator centrally
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