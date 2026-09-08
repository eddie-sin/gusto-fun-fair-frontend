'use client';

import Link from 'next/link';
import { Eye, EyeOff, Ticket } from 'lucide-react';
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from './app-provider';

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const { login, register } = useApp();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === 'register';

  const submit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanName = name.trim().replace(/\s+/g, ' ');
    if (cleanName.length < 2 || cleanName.length > 50) return setError('Your name must be between 2 and 50 characters.');
    if (password.length < 8 || password.length > 128) return setError('Your password must be between 8 and 128 characters.');
    if (isRegister && password !== confirm) return setError('The two passwords do not match.');
    setError(''); setSubmitting(true);
    try {
      await (isRegister ? register(cleanName, password) : login(cleanName, password));
      router.push('/profile');
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to continue. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return <main className="auth-page"><Link href="/" className="auth-brand"><Ticket aria-hidden="true" /> GUSTO Fun Fair</Link><div className="auth-layout">
    <section className="auth-art"><p className="eyebrow">11 September 2026</p><h1>{isRegister ? 'Save your seat at the table.' : 'Your tickets are waiting.'}</h1><p>One simple account keeps your orders, payment updates and fair-day tickets together.</p><div className="auth-ticket" aria-hidden="true"><span>FUN FAIR</span><strong>ADMIT ONE</strong><span>GUSTO</span></div></section>
    <section className="auth-panel"><div><p className="eyebrow">{isRegister ? 'New around here?' : 'Welcome back'}</p><h2>{isRegister ? 'Create your account' : 'Log in'}</h2><p>{isRegister ? 'Choose a name and password. No email address is needed.' : 'Use the same name and password you registered with.'}</p></div>
      <form onSubmit={submit} noValidate>
        <label className="field"><span>Name</span><input autoComplete="username" value={name} onChange={(event) => setName(event.target.value)} maxLength={50} required placeholder="Your name" /><small>2–50 characters</small></label>
        <label className="field"><span>Password</span><div className="password-field"><input type={showPassword ? 'text' : 'password'} autoComplete={isRegister ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={128} required placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
        {isRegister && <label className="field"><span>Confirm password</span><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required placeholder="Type it once more" /></label>}
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button--full" disabled={submitting}>{submitting ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'}</button>
      </form>
      <p className="auth-switch">{isRegister ? 'Already have an account?' : 'Need an account?'} <Link href={isRegister ? '/login' : '/register'}>{isRegister ? 'Log in' : 'Create one'}</Link></p>
    </section>
  </div></main>;
}
