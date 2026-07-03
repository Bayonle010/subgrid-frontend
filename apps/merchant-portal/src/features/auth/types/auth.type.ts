export interface RegisterMerchant {
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  businessEmail: string;
  password: string;
}

export interface AuthTokenUser {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface AuthTokenData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  tenantId: string;
  user: AuthTokenUser;
}

export interface ApiAuthResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: AuthTokenData;
}

export type RegisterResponse = ApiAuthResponse;

export interface LoginPayload {
  email: string;
  password: string;
}

export type LoginResponse = ApiAuthResponse;

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
