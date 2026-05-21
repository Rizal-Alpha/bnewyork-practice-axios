import { useEffect, useState, type ReactNode } from 'react';
import { getMyProfile, loginUser, registerUser } from '../api/authService';
import type { LoginInput, RegisterInput, User } from '../types';
import { AuthContext, type AuthContextValue } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  //klo ini hasilnya adalah nilainya bukan true/false sperti di bawah
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('token')
  );

  // "Tolong buat sebuah state bernama isInitializing. Untuk nilai awalnya, tolong intip ke dalam memori browser (localStorage). Kalau di sana ada data bernama "token" (artinya tidak kosong/!== null), maka set nilai awalnya menjadi true. Tapi kalau kosong, set jadi false (maka perlu fetch token ulang). Dan ingat, jalankan pengecekan ini cukup satu kali saja saat aplikasi pertama kali terbuka (Lazy initialization, yaitu pakai () => ...  tanpa ini jika hanya   localStorage.getItem()  akan terus2an dipanggil ) intinya hasilnya adalah true/false"
  const [isInitializing, setInitializing] = useState(
    () => localStorage.getItem('token') !== null
  );

  useEffect(() => {
    if (!token) {
      //klo dia nda ada token maka nda perlu return apa saja
      return;
    }

    let cancelled = false;

    getMyProfile()
      .then((me) => {
        if (!cancelled) {
          setUser(me);
          setInitializing(false);
        }
      })

      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setInitializing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (input: LoginInput) => {
    const { token: newToken } = await loginUser(input);
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const register = async (input: RegisterInput) => {
    await registerUser(input);
    await login({ email: input.email, password: input.password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    token,
    isInitializing,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
