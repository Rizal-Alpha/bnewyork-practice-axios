//ini semua harus sesuai dengan data 'Responses > example' dari backend di link ini, FE yg ikut BE jangan ada gerakan tambahan
//https://be-blg-production.up.railway.app/api
export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  headline?: string;
  avatarUrl?: string;
}

export interface RegisterInput {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
}

export interface LoginResponse {
  token: string;
}
