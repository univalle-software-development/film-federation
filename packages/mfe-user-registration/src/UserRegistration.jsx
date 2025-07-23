// packages/mfe-user-registration/src/UserRegistration.jsx
import React, { useState } from 'react';
import { Button } from 'shared-components';
import { createUser } from 'shared-components/src/api';  // ← importa tu cliente HTTP

export default function UserRegistration() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const data = await createUser(email);
      setStatus(`Usuario creado con ID ${data.user_id}`);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Registro de Usuario</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="tu@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Registrando…' : 'Registrar'}
        </Button>
      </form>

      {status && <p className="mt-4 text-green-600">{status}</p>}
      {error  && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
