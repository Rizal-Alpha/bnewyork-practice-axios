import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import { type RegisterInput } from '../types';

export function RegisterPage() {
  const [form, setForm] = useState<RegisterInput>({
    name: '',
    username: '',
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*register ni nama buatan, ini ada di contract di Interface AuthContextValue dan AuthProvider.
  mengapa pakai tanda {} karena isi dari useAuth tu adlah object cetakan dari  Interface AuthContextValue */
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: { target: { name: string; value: string } }) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await register(form);
      navigate('/');
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return <p className='text-center mt-10 text-gray-500'>Memuat...</p>;
  }
  if (error) {
    return <p className='text-center mt-10 text-gray-500'>{error}</p>;
  }

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
