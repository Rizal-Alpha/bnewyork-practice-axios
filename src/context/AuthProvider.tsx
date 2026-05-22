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

  //useEffect  =>  fitur auto-login, nda perlu register lagi... ada 3 situasi yg di-handle:
  /*1. token kosong(null) => Langsung berhenti (return). Tidak melakukan apa-apa karena user belum login.
    2. Token Ada & Valid (Asli) => Mengambil data profil dari server, Menyimpannya ke setUser(me), Mematikan loading web.
    3. Token Ada tapi Invalid (Palsu/Kedaluwarsa) => Menghapus token dari localStorage, Mengosongkan state token, Mematikan loading web (User otomatis gagal login).*/
  useEffect(() => {
    if (!token) {
      //klo dia nda ada token maka nda perlu return apa pun
      return;
    }

    /*Ini adalah trik bernama Cleanup Flag. Internet itu punya kecepatan yang tidak pasti. Kadang request pertama lemot, lalu user buru-buru klik logout, lalu login lagi pakai akun lain (request kedua). Jika kita tidak pakai bendera ini, bisa terjadi tabrakan data (data milik akun pertama yang lemot tadi baru sampai, lalu tiba-tiba menimpa data akun kedua). Variabel cancelled mendeteksi apakah proses lama ini masih boleh mengubah data atau sudah basi. */
    let cancelled = false;

    /*ini materi promise, fungsi getMyProfile() tersebut menghasilkan sesuatu yang disebut Promise (Janji). Artinya: "Saya janji akan mengambilkan data profilmu. Tapi tunggu sebentar ya, jangan hancurkan aplikasinya selagi saya mengambil data." */
    getMyProfile() //fungsi ini ada di file  authService.ts
      .then((me) => {
        //.then() (artinya: "kemudian") digunakan untuk memberi tahu JavaScript apa yang harus dilakukan setelah janji tersebut ditepati (sukses).
        // me  di sini adalah hasil dari getMyProfile()
        if (!cancelled) {
          // 👈 Dicek dulu, apakah jalurnya masih aman?
          setUser(me); // Simpan data user ke state
          setInitializing(false); //token ada (!== null)
        }
      })

      //Penanganan Jika Token Eror/Palsu
      .catch(() => {
        localStorage.removeItem('token'); // Hapus token palsu dari memori browser
        setToken(null); // Kosongkan state token
        setInitializing(false); // Matikan loading spinner
      });

    return () => {
      cancelled = true; // 👈 Menghancurkan request lama yang masih melayang di internet
    };
  }, [token]); //"Kalau variabel token berubah, tolong jalankan fungsi ambil data profil ke server, langsung cek ke server apakah token itu asli/masih aktif. Kalau asli, ambil data profil usernya. Kalau palsu/kedaluwarsa, tendang usernya (logout).
  // Tolong awasi variabel token. Setiap kali user login, logout, atau ganti akun (yang menyebabkan nilai token berubah), jalankan ulang seluruh ritual pengecekan di atas dari awal!""

  const login = async (input: LoginInput) => {
    const { token: newToken } = await loginUser(input);
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  /*ini ada di type.ts
  interface RegisterInput {
    name: string;
    username: string;
    email: string;
    password: string;
    =================
    registerUser  tu fungsi di authService.ts
  }
 async => Ini adalah tanda pengenal. Kita memberi tahu JavaScript: "Hei, fungsi register ini di dalamnya bakal ada proses tunggu-menunggu ya!"
 await => Ini adalah perintah stop. Kita bilang ke JavaScript: "Tolong berhenti dan tunggu di baris ini sampai server selesai memproses registerUser. Jangan berani-berani lanjut ke baris bawahnya sebelum proses ini kelar dan sukses!" */
  const register = async (input: RegisterInput) => {
    await registerUser(input);
    await login({ email: input.email, password: input.password }); //fungsi login yang sudah kita buat sebelumnya hanya butuh 2 data saja untuk bekerja, yaitu email dan password. Dia tidak butuh data name atau username. ntar ni klo udah login akan bisa lanjut ke pages
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

  /* sebelumnya yaitu:   export const AuthContext = createContext<AuthContextValue | undefined> (undefined);
  createContext: Proses "membeli dan mendaftarkan" frekuensi radio baru milikmu.*/
  //"Siapa pun komponen yang ditaruh di dalam wadah {children} ini, mereka otomatis berada di dalam radius pancaran sinyal Wifi saya, dan mereka berhak mengambil data yang ada di dalam tombol value."
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  // Di balik layar, AuthProvider memancarkan ini: value = { user, token, isInitializing, login, register, logout }
}

//tugasku next:  lihat antena yg terima sinyal wifi dgn "useContext"
/*hasil: ternyata coach henry ada letak di file  useAuth.ts (teknik "custom hook") nda langsung di HomePage atau RegisterPage */
