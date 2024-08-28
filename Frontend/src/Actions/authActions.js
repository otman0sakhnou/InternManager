import api from "services/axiosInstance";

export const login = async (loginData) => {
  const response = await api.post("/auth/login", loginData);
  return response.data;
};

export const logout = async (refreshToken) => {
  console.log(refreshToken)
  await api.post("/auth/logout", { refreshToken });
};

export const refreshToken = async (refreshToken) => {
  const response = await api.post("/auth/refresh-token", { refreshToken });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (resetData) => {
  const response = await api.post("/auth/reset-password", resetData);
  return response.data;
};

export const changeEmail = async (emailData) => {
  const response = await api.post("/auth/change-email", emailData);
  return response.data;
};

export const confirmEmailChange = async (userId, email, token) => {
  const response = await api.get("/auth/confirm-email", {
    params: { userId, email, token },
  });
  return response.data;
};
