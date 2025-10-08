import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../helper";

export const UserContext = createContext()

export const UserContextProvider = (props) => {
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [ userData, setUserData ] = useState(null);

    const getUserData = async () => {
        try {
            const {data} = await axiosInstance.get('/api/users/getuserdata');
            if (data?.success) {
                console.log('User details:', data.data);
                setUserData(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Session expired. Please login again.")
        }
    }

    const value = {backendUrl, isLoggedIn, setIsLoggedIn, userData, setUserData, getUserData};

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    )
}

