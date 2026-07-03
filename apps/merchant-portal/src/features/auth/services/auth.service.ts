import { apiClient } from "@/lib/axios";
import {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterMerchant,
  RegisterResponse,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "../types/auth.type";

export const login = async (payload: LoginPayload) => {
  const result = await apiClient.post("/auth/login", payload);
  return result.data;
};

export const logout = async (refreshToken: string) => {
  const result = await apiClient.post("/auth/logout", { refreshToken });
  return result.data;
};

export const register = async (
  payload: RegisterMerchant,
): Promise<RegisterResponse> => {
  const result = await apiClient.post("/auth/register", payload);
  return result.data;
};

export const resendOtp = async (user_id: string) => {
  const result = await apiClient.post("/auth/resend-otp", { user_id });
  return result.data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const result = await apiClient.post("/auth/forgot-password", payload);
  return result.data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const result = await apiClient.post("/auth/reset-password", payload);
  return result.data;
};

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const result = await apiClient.post("/auth/verify-otp", payload);
  return result.data;
};

export const getProfile = async () => {
  const result = await apiClient.get("/auth/me");
  return result.data;
};
