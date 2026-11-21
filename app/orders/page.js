'use client';
import useGet from '@/lib/useGet';
import { Protected, useApp } from '@/components/Providers';
import { State } from '@/components/ui';
function Orders() {
  const { token, userId } = useApp();
  const { data, err } = useGet(userId() ? '/orders/user/' + userId() : null, token);
  if (!data) return <State d={data} e={err} />;
  return (<><h2>My orders</h2>{!data.length && <p>No orders yet.</p>}
    {data.map((o) => (
      <div key={o._id} className="card" style={{ marginBottom: 14 }}>
        <div className="row"><b>#{o.id} · {o.paymentMethodType} · {o.isPaid ? 'Paid' : 'Not paid'} · {o.isDelivered ? 'Delivered' : 'Processing'}</b><b>{o.totalOrderPrice} EGP</b></div>
        <p>{o.shippingAddress?.details}, {o.shippingAddress?.city} · {o.shippingAddress?.phone}</p>
        <div className="row" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>{o.cartItems.map((i) => <img key={i._id} src={i.product.imageCover} width={70} title={`${i.product.title} x${i.count}`} alt="" />)}</div>
      </div>
    ))}</>);
}
export default function Page() { return <Protected><Orders /></Protected>; }
