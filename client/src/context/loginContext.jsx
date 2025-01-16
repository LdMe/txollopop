import { createContext,useState } from "react";

export const LoginContext = createContext();

export const LoginProvider = ({children}) => {
    const [id, setId] = useState(null);
    return (
        <LoginContext.Provider value={{id,setId}}>
            {children}
        </LoginContext.Provider>
    )
}