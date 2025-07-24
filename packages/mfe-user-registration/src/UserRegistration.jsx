// packages/mfe-user-registration/src/UserRegistration.jsx
import React, { useState } from 'react';
import { Button } from 'shared-components';
import { createUser, loginUser } from 'shared-components/src/api';

const AuthForm = ({ buttonText, onSubmit, loading, email, setEmail }) => (
  <form onSubmit={onSubmit}>
    <div className="relative">

        <input
            type="email"
            required
            placeholder="tu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
        />
    </div>
    <Button 
        type="submit" 
        disabled={loading} 
        className="w-full mt-4 text-white font-bold py-3 px-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
    >
      {loading ? 'Procesando…' : buttonText}
    </Button>
  </form>
);

// El componente principal ahora acepta `onLoginSuccess`
export default function AuthPage({ onLoginSuccess = () => {} }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const clearState = () => {
    setError(null);
    setStatus(null);
  };

  const handleResponse = (data) => {
    // call shell
    onLoginSuccess(data); 
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    clearState();
    try {
      const action = isLogin ? loginUser : createUser;
      const data = await action(email);
      handleResponse(data);
    } catch (err)      {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearState();
    setEmail('');
  };

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
        <div className="p-8 sm:p-10 max-w-md w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 space-y-6">
            <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900">
                {isLogin ? 'Bienvenido' : 'Únete Ahora'}
            </h2>
            <AuthForm
                buttonText={isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                onSubmit={handleSubmit}
                loading={loading}
                email={email}
                setEmail={setEmail}
            />
            {status && <p className="mt-4 text-center text-green-700 bg-green-100 p-3 rounded-xl">{status}</p>}
            {error  && <p className="mt-4 text-center text-red-700 bg-red-100 p-3 rounded-xl">{error}</p>}
            <div className="text-center">
                <button onClick={toggleMode} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                    {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                </button>
            </div>
        </div>
    </div>
  );
}
