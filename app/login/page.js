'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useApp } from '@/components/Providers';
import { Form } from '@/components/ui';
export default function Login() {
  const { login } = useApp(); const router = useRouter();
  return <Form label="Login" fields={[['email', 'Email', 'email'], ['password', 'Password', 'password']]}
    onSubmit={async (v) => { const r = await api('/auth/signin', { method: 'POST', body: v }); login(r.token); router.push('/'); }}>
    <Link href="/forgot-password">Forgot password?</Link><Link href="/register">Create account</Link></Form>;
}
