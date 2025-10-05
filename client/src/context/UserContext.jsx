import { createContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext()

export const UserContextProvider = (props) => {
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [ userId, setUserId ] = useState(null);

    const value = {backendUrl, isLoggedIn, setIsLoggedIn, userId, setUserId};

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    )
}

