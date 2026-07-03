export interface RegisterUser {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  otp_sent: boolean;
  user_id: number;
}

export interface LoginPayload {
  email: string;
  password: string;
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

export type ApplicationStatus =
  | "approved"
  | "declined"
  | "pending"
  | "submitted"
  | null;

export interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  application_submitted: boolean;
  application_approved: boolean;
  application_status: ApplicationStatus;
}
