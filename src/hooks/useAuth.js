import { useSelector } from "react-redux";
import { useAuth as useRootAuth } from "@/layouts/Root";

export const useAuth = () => {
  const { user, isAuthenticated } = useSelector(state => state.user);
  const { logout } = useRootAuth();

  const login = async (email, password) => {
    throw new Error("Please use the login page for authentication");
  };

  const register = async (userData) => {
    throw new Error("Please use the signup page for registration");
  };

  const isAuthenticatedFn = () => {
    return isAuthenticated;
  };

  return {
    user,
    loading: false,
    login,
    register,
    logout,
    isAuthenticated: isAuthenticatedFn
  };
};