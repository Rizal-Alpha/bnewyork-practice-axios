//ini kumpulan function yg berhubungan dgn authentication, coba liat di link ini: https://be-blg-production.up.railway.app/api   ada yg untuk login, terkait user, terkait post
//sebelum itu kita buat API contract di type.ts sesuai backend
import type {
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
  User,
} from '../types';
import { api } from './axiosInstance';

//kalo urusan dgn API kita harus selalu ingat pakai async-await, karna tidak 100% request dikembalikan selalu berhasil
export async function registerUser(
  input: RegisterInput
): Promise<RegisterResponse> {
  //.post => krna kita ingin mengirimkan ke backend biar diolah
  //'/auth/register' => ni end point nya
  const res = await api.post<RegisterResponse>('/auth/register', input);
  //kenapa  .data  krna axios ini ada banyak, dan yg mo kita ambil cuma  .data
  return res.data;
}

export async function loginUser(input: LoginInput): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/login', input);
  return res.data;
}

export async function getMyProfile(): Promise<User> {
  //.get => ambil data dari database
  //krna nda mo kirim ke server.. cuma nerima doang maka argumen cuma satu (end point) nda perlu pakai input sprti post
  const res = await api.get<User>('/users/me');
  return res.data;
}
