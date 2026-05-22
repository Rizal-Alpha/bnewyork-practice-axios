//Tujuan utama dari kode ini adalah membuat "kurir otomatis" yang bertugas mengantar data ke server, sekaligus otomatis menyelipkan token keamanan (absensi/kunci masuk) setiap kali aplikasi Anda meminta data ke Back-End.
import axios from 'axios';

//agar kita nda nulis ulang url-nya tiap mau dipakai, jadi simpan ke variable:
export const api = axios.create({
  baseURL: 'https://be-blg-production.up.railway.app',
  timeout: 10000, //dikasi batas waktu request ke server, jika lewat maka req dibatalkan agar tidak lemot
});

//buat satpam otomatis kita:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//===================Henry's=============
// import axios from "axios";

// export const api = axios.create({
//   baseURL: "https://be-blg-production.up.railway.app",
//   timeout: 10000,
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      const message = (data as { message: unknown }).message;
      if (typeof message === 'string') return message;
    }
    return error.message;
  }

  if (error instanceof Error) return error.message;
  return 'terjadi kesalahan';
}
