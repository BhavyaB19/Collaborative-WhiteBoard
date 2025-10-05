import axios from "axios";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";

const backendUrl = useContext(UserContext)

const axiosInstance = axios.create({
    baseURL: backendUrl,
    headers: {},

});

export default axiosInstance