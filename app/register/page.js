'use client';
import { useRouter } from 'next/navigation';
import { api, validators } from '@/lib/api';
import { useApp } from '@/components/Providers';
import { Form } from '@/components/ui';
export default function Register() {
  const { login } = useApp(); const router = useRouter();
  return <Form label="Register" fields={[['name', 'Name'], ['email', 'Email', 'email'], ['phone', 'Phone', 'tel'], ['password', 'Password', 'password'], ['rePassword', 'Confirm password', 'password']]}
    onSubmit={async (v) => {
      validators.phone(v.phone); validators.password(v.password); validators.match(v.password, v.rePassword);
      const r = await api('/auth/signup', { method: 'POST', body: v }); login(r.token); router.push('/');
    }} />;
}
