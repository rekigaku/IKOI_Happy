'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  // This function will be called when the form is submitted
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch('http://127.0.0.1:5000/employee');
      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      const employee = data.employee.find((emp) =>
        emp.detail.some((d) => d.email === email && d.password === password)
      );

      if (employee) {
        setUser(employee.detail[0].name);
        setMessage('');
      } else {
        setUser(null);
        setMessage('データが一致しません');
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setMessage('データの取得に失敗しました');
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password" // 自動補完属性というものらしい
          />
        </div>
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
      {message && <p>{message}</p>}
      {user && (
        <div>
          <p>ようこそ、{user}さん</p>
          <Link href="/weekly">週間ページへ</Link>

        </div>
      )}
    </div>
  );
}
