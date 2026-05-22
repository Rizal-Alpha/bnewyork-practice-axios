import { Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import './index.css';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';

function App() {
  //ambil dari wifi berupa isInitializing, dimana React tidak akan diizinkan untuk membaca kode yang ada di bawahnya (jalur , HomePage, atau RegisterPage). Gerbangnya dikunci rapat-rapat.
  const { isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-500'>
        Loading Website...
      </div>
    );
  }
  return (
    <main>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </main>
  );
}

export default App;
