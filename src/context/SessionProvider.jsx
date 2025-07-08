import { useState, useEffect } from "react";
import SessionContext from "./SessionContext";
import { supabase } from "../pages/supabase/client-supabase";



export default function SessionProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{
        session, setSession
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
