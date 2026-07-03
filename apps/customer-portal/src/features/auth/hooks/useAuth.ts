import { ChangeEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useForgotPassword,
  useGetProfile,
  useLogin,
  useRegister,
  useResendOtp,
  useResetPassword,
  useVerifyOtp,
} from "./auth.hooks";
import { LoginPayload, Profile, RegisterUser } from "../types/auth.type";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "../types/auth.schema";
import { useToast } from "@/shared/toast";
import { useAuthStore } from "@/shared/store/auth.store";

const PASSWORD_REQUIREMENTS = [
  { label: "Uppercase", regex: /[A-Z]/ },
  { label: "Lowercase", regex: /[a-z]/ },
  { label: "Number", regex: /[0-9]/ },
  { label: "Special character", regex: /[!@#$%^&*(),.?":{}|<>]/ },
  { label: "Min 8 characters", regex: /.{8,}/ },
];

type FormErrors = Partial<Record<keyof RegisterUser, string>>;

export const useRegisterScreen = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<RegisterUser>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { mutate, isPending } = useRegister((data) => {
    console.log(data);
    router.push(
      `/verify-email?email=${encodeURIComponent(formData.email)}&id=${data.user_id}`,
    );
  });

  const handleChange =
    (field: keyof RegisterUser) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear the error for the field as the user types
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }));
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof RegisterUser;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!agreedToTerms) return;

    // Convert dob from YYYY-MM-DD (native date input) to DD/MM/YYYY before sending
    const [year, month, day] = formData.dob.split("-");
    const formattedDob = `${day}/${month}/${year}`;

    mutate({ ...formData, dob: formattedDob });
  };

  const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
    label: req.label,
    passed: req.regex.test(formData.password),
  }));

  const allRequirementsMet = requirements.every((r) => r.passed);

  return {
    formData,
    errors,
    agreedToTerms,
    setAgreedToTerms,
    handleChange,
    handlePhoneChange,
    handleRegister,
    isPending,
    requirements,
    allRequirementsMet,
  };
};

export const useVerifyEmailScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const user_id = searchParams.get("id") ?? "";

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const { mutate: verifyMutate, isPending: isVerifying } = useVerifyOtp(
    () => {
      router.push("/success-page");
    },
    () => {
      setOtpError("Invalid code. Please check and try again.");
    },
  );

  const { mutate: resendMutate, isPending: isResending } = useResendOtp(() => {
    setOtpError("");
  });

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setOtpError("Please enter the complete 6-digit code.");
      return;
    }
    setOtpError("");
    verifyMutate({ otp_code: otp, user_id: Number(user_id) });
  };

  const handleResendOtp = () => {
    resendMutate(user_id);
  };

  return {
    email,
    otp,
    setOtp,
    otpError,
    handleVerifyEmail,
    handleResendOtp,
    isVerifying,
    isResending,
  };
};

type LoginErrors = Partial<Record<keyof LoginPayload, string>>;

export const useLoginScreen = () => {
  const router = useRouter();
  const { setAuth, user } = useAuthStore();

  const [formData, setFormData] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const { mutate: getProfile } = useGetProfile(
    (data: Profile) => {
      setAuth({
        access_token: user?.access_token!,
        must_change_password: user?.must_change_password!,
        token_type: user?.token_type!,
        userInfo: data,
      });
      if (!data.application_approved) {
        router.replace("/onboarding");
      }else{
        router.replace("/da")
      }
    },
    () => {},
  );
  const [serverError, setServerError] = useState("");
  const { addToast } = useToast();

  const { mutate, isPending } = useLogin(
    (data) => {
      setAuth({
        access_token: data.access_token,
        token_type: data.token_type,
        must_change_password: data.must_change_password,
      });
      getProfile();
      // router.push("/onboarding");
    },
    (e) => {
      const detail = e?.response?.data?.detail;
      const message =
        typeof detail === "string" && detail
          ? detail
          : "Invalid email or password. Please try again.";

      setServerError(message);
      addToast({
        variant: "error",
        title: "Login failed",
        description: message,
      });
    },
  );

  const handleChange =
    (field: keyof LoginPayload) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
      if (serverError) setServerError("");
    };

  const handleLogin = () => {
    const result = loginSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: LoginErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginPayload;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    mutate(formData);
  };

  return {
    formData,
    errors,
    serverError,
    handleChange,
    handleLogin,
    isPending,
  };
};

export const useRecoverAccountScreen = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const router = useRouter();

  const { mutate, isPending } = useForgotPassword(
    () => {
      router.replace("/login");
    },
    () => {},
  );

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const handleRecoverAccount = () => {
    const result = emailSchema.safeParse(email);

    if (!result.success) {
      setEmailError(result.error.issues[0].message);
      return;
    }

    mutate({
      email,
      reset_password_link: `${window.location.origin}/reset-password`,
    });
  };

  return {
    email,
    emailError,
    handleEmailChange,
    handleRecoverAccount,
    isPending,
  };
};

type ResetPasswordErrors = { newPassword?: string; confirmPassword?: string };

export const useResetPasswordScreen = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const { addToast } = useToast();

  const { mutate, isPending } = useResetPassword(
    () => {
      addToast({
        variant: "success",
        title: "Password reset",
        description: "Your password has been updated successfully.",
      });
      router.replace("/reset-successful");
    },
    () => {
      addToast({
        variant: "error",
        title: "Reset failed",
        description: "Something went wrong. Please try again.",
      });
    },
  );

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    if (errors.newPassword)
      setErrors((prev) => ({ ...prev, newPassword: undefined }));
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword)
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    const result = resetPasswordSchema.safeParse({
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: ResetPasswordErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ResetPasswordErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    mutate({ new_password: newPassword, token });
  };

  const requirements = PASSWORD_REQUIREMENTS.map((req) => ({
    label: req.label,
    passed: req.regex.test(newPassword),
  }));

  return {
    newPassword,
    confirmPassword,
    errors,
    isPending,
    requirements,
    handlePasswordChange,
    handleConfirmPasswordChange,
    handleResetPassword,
  };
};
