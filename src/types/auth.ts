export interface SendOtpRequest {
  email?: string;
  mobile?: string;
}
export interface VerifyRegistrationOtpRequest {
  email?: string;
  mobile?: string;
  otp: string;
}
export interface CompleteRegistrationRequest {
  name: string;
  email?: string;
  mobile?: string;
}