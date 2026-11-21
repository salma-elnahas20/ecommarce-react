'use client';
import { api, validators } from '@/lib/api';
import { Protected, useApp } from '@/components/Providers';
import { Form } from '@/components/ui';
export function ChangePassword() {
  const { token, login, say } = useApp();
  return <Form label="Change password" fields={[['currentPassword', 'Current password', 'password'], ['password', 'New password', 'password'], ['rePassword', 'Confirm new password', 'password']]}
    onSubmit={async (v) => {
      validators.password(v.password); validators.match(v.password, v.rePassword);
      const r = await api('/users/changeMyPassword', { method: 'PUT', body: v, token }); login(r.token); say('Password changed');
    }} />;
}
export default function Page() { return <Protected><ChangePassword /></Protected>; }
