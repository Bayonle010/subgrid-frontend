import { useMutation } from "@tanstack/react-query";
import {
  login,
  register,
  resendOtp,
  forgotPassword,
  resetPassword,
  verifyOtp,
  getProfile,
} from "../services/auth.service";
import {
  LoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  RegisterResponse,
  VerifyOtpPayload,
} from "../types/auth.type";
import { useToast } from "@/shared/toast";

export const useRegister = (
  sc: (val: RegisterResponse) => void,
  ec?: (err: any) => void,
) => {
  return useMutation({
    mutationFn: register,
    onSuccess: sc,
    onError: ec,
  });
};

export const useLogin = (sc: (val: any) => void, ec?: (err: any) => void) => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: sc,
    onError: ec,
  });
};

export const useResendOtp = (
  sc: (val: any) => void,
  ec?: (err: any) => void,
) => {
  return useMutation({
    mutationFn: (user_id: string) => resendOtp(user_id),
    onSuccess: sc,
    onError: ec,
  });
};

export const useForgotPassword = (
  sc: (val: any) => void,
  ec?: (err: any) => void,
) => {
  const { addToast } = useToast();
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
    onSuccess: (res) => {
      sc(res);
      addToast({
        title: "Reset link sent",
        description: "Check your inbox for the password reset link",
        variant: "success",
        duration: 10000,
      });
    },
    onError: (e: any) => {
      const message =
        e?.response?.data?.detail ?? "Failed to send reset link. Try again.";
      addToast({ title: "Error", description: message, variant: "error" });
      ec?.(e);
    },
  });
};

export const useResetPassword = (
  sc: (val: any) => void,
  ec?: (err: any) => void,
) => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
    onSuccess: sc,
    onError: ec,
  });
};

export const useVerifyOtp = (
  sc: (val: any) => void,
  ec?: (err: any) => void,
) => {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => verifyOtp(payload),
    onSuccess: sc,
    onError: ec,
  });
};

export const useGetProfile = (
  sc: (val: any) => void,
  ec?: (err: any) => void,
) => {
  return useMutation({
    mutationFn: getProfile,
    onSuccess: sc,
    onError: ec,
  });
};
