import { createContext, useContext, useState } from "react";
import axios, { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";

export const AuthContext = createContext({});

const api = axios.create({
  baseURL: import.meta.env.VITE_USER_API_URL,
});

export const AuthProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const [userData, setUserData] = useState(authContext);
  const router = useNavigate();

  const handleRegister = async (name, username, password) => {
    try {
      let request = await api.post("/register", {
        name: name,
        username: username,
        password: password,
      });

      if (request.status === httpStatus.CREATED) {
        return request.data.message;
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      let request = await api.post("/login", {
        username: username,
        password: password,
      });

      if (request.status === httpStatus.OK) {
        return request.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const getHistoryOfUser = async () => {
    try {
      let request = await api.post("/get_all_activity", {
        params: {
          token: localStorage.getItem("token"),
        },
      });
      return request.data.message;
    } catch (error) {
      throw error;
    }
  };

  const addToUserHistory = async (meetingCode) => {
    try {
      let request = await api.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode,
      });
      return request.data;
    } catch (error) {
      throw error;
    }
  };

  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToUserHistory,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
