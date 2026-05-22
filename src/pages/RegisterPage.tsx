import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import { type RegisterInput } from '../types';

/*[User klik tombol Register]
          │
          ▼
1. Fungsi `handleSubmit()` di RegisterPage terpicu.
          │
          ▼
2. Layar berubah jadi Loading (`setIsLoading(true)`).
          │
          ▼
3. Baris `await register(form);` dieksekusi.
   👉 Di sini RegisterPage berteriak lewat Wifi: "Hei AuthProvider di pusat! 
      Ini saya kirim data form-nya (name, email, pass). Tolong daftarin ke server!"
          │
          ▼
4. Di Pusat (AuthProvider), fungsi register asli bekerja:
   - Menembak data ke database (`await registerUser`).
   - Begitu sukses, langsung menembak fungsi login otomatis (`await login`).
   - State `token` dan `user` di pusat otomatis terisi data baru.
          │
          ▼
5. Karena proses di pusat selesai dan sukses, RegisterPage menerima sinyal balik: "Beres!"
          │
          ▼
6. Baris selanjutnya `navigate('/');` berjalan, dan user disetir mulus ke HomePage dalam kondisi sudah login. */

export function RegisterPage() {
  //"Kantong Data" Lokal,
  // bertugas menyiapkan wadah memori sementara khusus untuk halaman ini saja.
  const [form, setForm] = useState<RegisterInput>({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //==================
  //Mengambil Alat dari Luar
  /*register ni nama buatan, ini ada di contract di Interface AuthContextValue dan AuthProvider.
  mengapa pakai tanda {} karena isi dari useAuth tu adlah object cetakan dari  Interface AuthContextValue dan hanya perlu bagian registernya
  isi dari  useAuth()  adalah  useContext()*/
  const { register } = useAuth();
  const navigate = useNavigate(); //useNavigate() tu dari npm react-router-dom

  //================
  //Spion Otomatis Ketikan User
  //Memperbarui isi form setiap kali user mengetik satu huruf di kolom input (Name, Username, Email, atau Password).
  //trik Dynamic Key [e.target.name]
  /* ini bisa mendeteksi otomatis: "Oh, user lagi ngetik di input yang atribut name-nya adalah 'email', maka masukkan ketikannya ke dalam data email di state." Kode ...prev bertugas menyalin data kolom lain agar tidak terhapus. */
  const handleChange = (e: { target: { name: string; value: string } }) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })); //krna setiap input ada  value={}
  };

  //======================
  //Jantung Utama Alur Register
  const handleSubmit = async () => {
    setIsLoading(true); //kasi efek loading dulu
    setError(null); //dan awal2 pasti nda mungkin langsung error alias masih null

    try {
      await register(form); // ⏳ Berhenti di sini, tunggu kirim data ke server selesai
      navigate('/'); // 🚗 Kalau sukses, langsung setir user ke halaman utama
      //navigate: Ini adalah nama fungsi "supir otomatis" yang kamu panggil dari hasil const navigate = useNavigate() (milik library react-router-dom)
      //bedakan menyalin fungsi (nda boleh pakai tanda kurung) dengan menyalin hasil(navigate itu menyalin hasil berupa fungsi sehingga navigate itu adalah fungsi baru sehingga bisa terima argumen '/')
      /*ada hubungannya ke App.tsx: <Route path="/" element={<HomePage />} />  
      Artinya, jalur '/' itu sudah dijodohkan dengan komponen . Jadi saat kode navigate('/') dieksekusi, React Router langsung tahu kalau user harus diantar ke halaman utama. */
    } catch (err: unknown) {
      setError(getErrorMessage(err)); // ❌ Kalau gagal, tangkap erornya dan simpan ke state,
      //getErrorMessage()   ni kita tambah di axiosInstance.ts
    }
  };

  //========================
  //Satpam Tampilan
  /*React membaca kode dari atas ke bawah. Jika status isLoading bernilai true, React akan langsung memotong komando (return) dan menampilkan teks "Memuat..." saja. Formulir pendaftaran di bawahnya tidak akan dimunculkan ke layar demi keamanan agar user tidak menekan tombol submit berkali-kali saat proses kirim data sedang berjalan. */
  if (isLoading) {
    return <p className='text-center mt-10 text-gray-500'>Memuat...</p>;
  }
  if (error) {
    return <p className='text-center mt-10 text-gray-500'>{error}</p>;
  }
  //===========================
  return (
    <div className='max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow'>
      <h1 className='text-2xl font-bold mb-4'>Register</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className='space-y-3'
      >
        <input
          name='name'
          placeholder='Nama Lengkap'
          value={form.name}
          onChange={handleChange}
          required
          className='w-full border border-gray-300 rounded px-3 py-2'
        />
        <input
          name='username'
          placeholder='Username'
          value={form.username}
          onChange={handleChange}
          required
          className='w-full border border-gray-300 rounded px-3 py-2'
        />
        <input
          name='email'
          type='email'
          placeholder='Email'
          value={form.email}
          onChange={handleChange}
          required
          className='w-full border border-gray-300 rounded px-3 py-2'
        />
        <input
          name='password'
          type='password'
          placeholder='Password (min 8 karakter)'
          value={form.password}
          onChange={handleChange}
          required
          minLength={8}
          className='w-full border border-gray-300 rounded px-3 py-2'
        />

        {error && <p className='text-red-600 text-sm'>{error}</p>}

        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50'
        >
          {isLoading ? 'Mendaftarkan...' : 'Register'}
        </button>
      </form>

      <p className='text-sm text-gray-600 mt-4'>
        Sudah punya akun?{' '}
        <Link to='/login' className='text-blue-600 hover:underline'>
          Login di sini
        </Link>
      </p>
    </div>
  );
}
