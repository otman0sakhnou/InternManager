import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "store/useAuthStore";


const Logout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout();
        navigate("/login");
      } catch (err) {
        console.error("Logout failed", err);
      }
    };

    handleLogout();
  }, [logout, navigate]); 

  return null;
};

export default Logout;
