'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, validators } from '@/lib/api';
import { useApp } from '@/components/Providers';
import { Form } from '@/components/ui';
export default function Forgot() {
  const [step, setStep] = useState(1); const [email, setEmail] = useState('');
  const { login } = useApp(); const router = useRouter();
  const post = (p, body, method = 'POST') => api(p, { method, body });
  if (step === 1) return <Form key="1" label="Send reset code" fields={[['email', 'Email', 'email']]} onSubmit={async (v) => { await post('/auth/forgotPasswords', v); setEmail(v.email); setStep(2); }} />;
  if (step === 2) return <Form key="2" label="Verify code" fields={[['resetCode', 'Code from your email']]} onSubmit={async (v) => { await post('/auth/verifyResetCode', v); setStep(3); }} />;
  return <Form key="3" label="Reset password" fields={[['newPassword', 'New password', 'password']]} onSubmit={async (v) => { validators.password(v.newPassword); const r = await post('/auth/resetPassword', { email, ...v }, 'PUT'); login(r.token); router.push('/'); }} />;
}
