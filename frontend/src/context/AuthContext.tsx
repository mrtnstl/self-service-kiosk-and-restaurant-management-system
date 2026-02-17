import { createContext, useEffect, useState, type ReactNode } from "react";
import parseAndGetCookie from "../utils/cookieParser";

export type UserData = {
    name: string;
    roleId: number;
};

type AuthContextType ={
    user: UserData | null;
    setUser: (user: UserData | null)=>void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}:{children: ReactNode}) => {
    const [user, setUser] = useState<UserData | null>(null);
    useEffect(()=>{
        const loadUserFromCookie = () =>{
            const userData = (parseAndGetCookie("applianceUser") || parseAndGetCookie("reguralUser")) as UserData | null;
            setUser(userData);
        };
        loadUserFromCookie();
    },[]);

    const value: AuthContextType = {user, setUser};

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};
