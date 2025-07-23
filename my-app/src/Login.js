import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    // Navigate to dashboard after login
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-2 text-center">Welcome</h2>
        <hr className="mb-6" />
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-0 py-2 border-0 border-b-2 border-blue-400 focus:border-blue-600 focus:ring-0 outline-none placeholder-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="mb-2">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-0 py-2 border-0 border-b-2 border-blue-400 focus:border-blue-600 focus:ring-0 outline-none placeholder-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <div className="mb-6 text-right">
          <a href="/" className="text-blue-500 text-sm hover:underline">Forgot Password</a>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition-colors text-lg font-semibold mb-4"
        >
          Login
        </button>
        <div className="text-center text-sm">
          Don't have an account?{' '}
          <a href="/" className="text-blue-500 font-medium hover:underline">SignUp</a>
        </div>
      </form>
    </div>
  );
}

export default Login; 