import Config from 'react-native-config';
import { CompleteRegistrationRequest, SendOtpRequest, VerifyRegistrationOtpRequest } from '../types/auth';
import api from './api';
import authApi from './authapi';



export const sendRegistrationOtp = async (
  data: SendOtpRequest,
) => {
  const response = await authApi.post(
    'auth/register/send-otp',
    data,
  );

  return response.data;
};


export const verifyRegistrationOtp = async (
  data: VerifyRegistrationOtpRequest,
) => {
  const response = await authApi.post(
    'auth/register/verify-otp',
    data,
  );

  return response.data;
};

export const completeRegistration = async (
  data: CompleteRegistrationRequest,
  registerToken:string
) => {
  const response = await authApi.post(
    'auth/register/complete',
    data,
    {
        headers:{
            Authorization: `Bearer ${registerToken}`
        }
    }
  );

  return response.data;
};


export const sendLoginOtp = async (
  data: SendOtpRequest,
) => {
  const BASE_URL = Config.API_BASE_URL;

console.log("API BASE URL:", BASE_URL)
  const response = await authApi.post(
    'auth/login/send-otp',
    data,
  );

  return response.data;
};
export const verifyLoginOtp = async (
  data: VerifyRegistrationOtpRequest,
) => {
  const response = await authApi.post(
    'auth/login/verify-otp',
    data,
  );

  return response.data;
};

export const logout = async (refreshToken:string) => {
  const response = await api.post('auth/logout',{
    refreshToken
  });
  return response.data;
};

export const logoutAll = async () => {
  const response = await api.post('auth/logoutall');
  return response.data;
}