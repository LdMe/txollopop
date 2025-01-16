import { createContext,useState,useEffect } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({children}) => {
    const [id, setId] = useState(() => {
        const savedId = localStorage.getItem('userId');
        return savedId || null;
    });

    useEffect(() => {
        if (id) {
            localStorage.setItem('userId', id);
        } else {
            localStorage.removeItem('userId');
        }
    }, [id]);
    return (
        <LoginContext.Provider value={{id,setId}}>
            {children}
        </LoginContext.Provider>
    )
}