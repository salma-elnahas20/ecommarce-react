'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Protected, useApp } from '@/components/Providers';
import { Form } from '@/components/ui';
function Checkout() {
  const { token, setCartCount, say } = useApp();
  const [way, setWay] = useState('cash');
  const router = useRouter();
  const submit = async (v) => {
    const cart = await api('/cart', { token });
    const id = cart.cartId || cart.data._id;
    const body = { shippingAddress: { details: v.details, phone: v.phone, city: v.city } };
    if (way === 'cash') {
      await api('/orders/' + id, { method: 'POST', body, token });
      setCartCount(0); say('Order placed'); router.push('/orders');
    } else {
      const r = await api(`/orders/checkout-session/${id}?url=${window.location.origin}`, { method: 'POST', body, token });
      window.location.href = r.session.url;
    }
  };
  return (<Form label={way === 'cash' ? 'Place cash order' : 'Pay online'} onSubmit={submit} fields={[['details', 'Address details'], ['phone', 'Phone', 'tel'], ['city', 'City']]}>
    <label>Payment way<select value={way} onChange={(e) => setWay(e.target.value)}><option value="cash">Cash on delivery</option><option value="online">Online (card)</option></select></label>
  </Form>);
}
export default function Page() { return <Protected><Checkout /></Protected>; }
