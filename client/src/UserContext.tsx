import { createContext, useContext, useEffect, useState, type ReactNode} from "react";

// shape of user data
type User = { id: number; username: string; name: string; email: string } | null;

// shape of the context value
type UserContextType = {
  user: User;
  setUser: (u: User) => void;
};

// create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {

    const [user, setUserState] = useState<User>(null);
    
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUserState(JSON.parse(storedUser));
      }, []);
    
      // update state and localStorage together
      const setUser = (u: User) => {
        setUserState(u);
        if (u) localStorage.setItem("user", JSON.stringify(u));
        else localStorage.removeItem("user");
      };
  
    return (
      <UserContext.Provider value={{ user, setUser }}>
        {children}
      </UserContext.Provider>
    );
  }

export function useUser() {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used inside UserProvider");
    return context;
  }