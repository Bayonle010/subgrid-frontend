import { apiClient } from "@/lib/axios";
import {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterResponse,
  RegisterUser,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "../types/auth.type";

export const login = async (payload: LoginPayload) => {
  const result = await apiClient.post(`/login`, payload);
  return result.data;
};

export const register = async (
  registerPayload: RegisterUser,
): Promise<RegisterResponse> => {
  const result = await apiClient.post("/register", registerPayload);
  return result.data;
};

export const resendOtp = async (user_id: string) => {
  const result = await apiClient.post("/resend-otp", { user_id });
  return result;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const result = await apiClient.post("/forget-password", payload);
  return result.data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const result = await apiClient.post(`/reset-password`, payload);
  return result.data;
};

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const result = await apiClient.post(`/verify-otp`, payload);
  return result.data;
};

export const profile = async () => {
  const result = await apiClient.get("/profile");
  return result.data;
};
