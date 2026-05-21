import { createContext } from 'react';
import type { LoginInput, RegisterInput, User } from '../types';

//ni buat useContext contract dulu:
export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isInitializing: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

//Membuat sebuah kotak "Sertifikat Kosong" bernama AuthContext
//<Typescript> => Tapi, kalau aplikasinya baru pertama kali menyala dan belum siap, isinya boleh undefined (kosong) dulu."
//(undefined) di dalam kurung paling akhir. Ini adalah nilai awal (default value) saat kotak pertama kali diciptakan sebelum diisi data apa-apa oleh komponen utama Anda.
//undefined itu "Belum ada nilainya" atau "Sistem tidak tahu ini apaan".
export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);
