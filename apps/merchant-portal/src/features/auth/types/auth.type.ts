export interface RegisterMerchant {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  businessEmail: string;
  password: string;
}

export interface RegisterResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  must_change_password: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  must_change_password: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
  reset_password_link: string;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface VerifyOtpPayload {
  otp_code: string;
  user_id: number;
}

export interface MerchantProfile {
  businessName: string;
  supportEmail: string;
  logoUrl?: string;
  primaryColor?: string;
  billingTimezone?: string;
}
