import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../utils/helper";

export const UserContext = createContext()

export const UserContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [ userData, setUserData ] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const getUserData = async () => {
        try {
            const {data} = await axiosInstance.get('/api/users/getuserdata');
            if (data?.success) {
                console.log('User details:', data.data);
                setUserData(data.data);
                setToken(localStorage.getItem('token'));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            // Clear stale token if auth fails
            localStorage.removeItem('token');
            setToken(null);
            setUserData(null);
        }
    }

    // Auto-fetch user data on mount if a token exists
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                await getUserData();
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const value = {backendUrl, userData, setUserData, getUserData, token, setToken, isLoading};

    return (
        <UserContext.Provider value={value}>
            {props.children}
        </UserContext.Provider>
    )
}
