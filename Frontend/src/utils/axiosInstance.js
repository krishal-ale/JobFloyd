import axios from "axios";
import store from "@/redux/store";
import { clearAuthState } from "@/redux/authSlice";

const axiosInstance = axios.create({
  withCredentials: true,
});

let hasHandledSessionExpiry = false;

export const triggerSessionExpired = () => {
  if (hasHandledSessionExpiry) return;

  hasHandledSessionExpiry = true;

  store.dispatch(clearAuthState());
  localStorage.removeItem("persist:root");
  window.dispatchEvent(new Event("session-expired"));
};

export const resetSessionExpiryHandler = () => {
  hasHandledSessionExpiry = false;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      triggerSessionExpired();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;