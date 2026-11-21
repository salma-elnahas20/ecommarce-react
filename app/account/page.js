'use client';
import { api, validators } from '@/lib/api';
import useGet from '@/lib/useGet';
import Link from 'next/link';
import { Protected, useApp } from '@/components/Providers';
import { Form, State } from '@/components/ui';

function Account() {
  const { token, say } = useApp();
  const addr = useGet('/addresses', token);
  return (<>
    <h2>My account</h2>
    <div className="split">
      <div>
        <h3>Update profile</h3>
        <Form label="Save" fields={[['name', 'Name'], ['email', 'Email', 'email'], ['phone', 'Phone', 'tel']]}
          onSubmit={async (v) => { validators.phone(v.phone); await api('/users/updateMe', { method: 'PUT', body: v, token }); say('Profile updated'); }} />
        <p className="center"><Link href="/change-password">Change password</Link></p>
      </div>
      <div>
        <h3>Saved addresses</h3><State d={addr.data} e={addr.err} />
        {addr.data?.data?.length === 0 && <p className="muted">No saved addresses.</p>}
        {addr.data?.data?.map((a) => (
          <div key={a._id} className="card row" style={{ marginBottom: 10 }}>
            <span><b>{a.name}</b> — {a.details}, {a.city} · {a.phone}</span>
            <button style={{ background: '#c00' }} onClick={async () => { const r = await api('/addresses/' + a._id, { method: 'DELETE', token }); addr.setData({ data: r.data }); }}>Remove</button>
          </div>
        ))}
        <Form label="Add address" fields={[['name', 'Label (e.g. Home)'], ['details', 'Address details'], ['phone', 'Phone', 'tel'], ['city', 'City']]}
          onSubmit={async (v) => { validators.phone(v.phone); const r = await api('/addresses', { method: 'POST', body: v, token }); addr.setData({ data: r.data }); }} />
      </div>
    </div>
  </>);
}
export default function Page() { return <Protected><Account /></Protected>; }
