// 🔮 Contoh masa depan HomePage-mu kalau sudah pakai useAuth:
import { useAuth } from '../hooks/useAuth';

export const HomePage = () => {
  // Mengambil data user yang sedang login dari Wifi useAuth
  const { user, logout } = useAuth();

  return (
    <div>
      {/* Jika user ada, tampilkan namanya. Jika tidak ada, panggil "Tamu" */}
      <h1>Selamat Datang, {user ? user.name : 'Tamu'}!</h1>

      {user && <button onClick={logout}>Keluar dari Aplikasi</button>}
    </div>
  );
};
