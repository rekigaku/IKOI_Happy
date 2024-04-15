import { useState } from 'react';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error(await res.json().then(data => data.error));

      const data = await res.json();
      setUser(data.employee_name);
      setMessage('');
      setShowModal(true);
      
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('ログインに失敗しました');
      setShowModal(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form className="p-10 bg-white rounded-lg shadow-lg" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email:</label>
          <input
            type="email"
            id="email"
            className="input input-bordered w-full max-w-xs"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">Password:</label>
          <input
            type="password"
            id="password"
            className="input input-bordered w-full max-w-xs"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">ログイン</button>
      </form>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">ようこそ、{user}さん</h3>
            <p className="py-4">Weekly Reportへ進んでください。</p>
            <div className="modal-action font-bold text-lg">
              <Link href="/weekly">Weekly Report Page</Link>
              <a href="#" className="btn" onClick={() => setShowModal(false)}>閉じる</a>
            </div>
          </div>
        </div>
      )}

      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
}
