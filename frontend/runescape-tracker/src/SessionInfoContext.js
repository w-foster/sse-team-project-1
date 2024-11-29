import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';

const SessionInfoContext = createContext();

export const SessionInfoProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Check for existing session when app starts
    useEffect(() => {
        const fetchUserSession = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data?.user || null);
        };

        fetchUserSession();

        // Listen for supabase auth state changes
        const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user || null);
        });

        return () => {
            subscription.subscription.unsubscribe();  // cleanup listener when unmounting
        }
    }, []);

    return <SessionInfoContext.Provider value={{ user, setUser }}>{children}</SessionInfoContext.Provider>
};

// Custom hook for other components to access session info
export const useSessionInfo = () => useContext(SessionInfoContext);