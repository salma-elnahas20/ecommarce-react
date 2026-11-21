'use client';
import Link from 'next/link';
import { api } from '@/lib/api';
import useGet from '@/lib/useGet';
import { Protected, useApp } from '@/components/Providers';
import { State } from '@/components/ui';
function Cart() {
  const { token, setCartCount, say } = useApp();
  const { data, err, setData } = useGet('/cart', token);
  const run = async (path, method, body) => {
    try { const r = await api(path, { method, body, token }); if (r.data) { setData(r); setCartCount(r.numOfCartItems); } } catch (e) { say(e.message); }
  };
  const clear = async () => { await api('/cart', { method: 'DELETE', token }); setData({ data: { products: [], totalCartPrice: 0 } }); setCartCount(0); };
  if (!data) return <State d={data} e={err} />;
  const items = data.data.products;
  return (<>
    <h2>Shopping cart</h2>
    {!items.length ? <p>Your cart is empty. <Link href="/products">Shop now</Link></p> : <>
      {items.map(({ product: p, count, price }) => (
        <div key={p._id} className="card item">
          <img src={p.imageCover} alt="" />
          <div><h4>{p.title}</h4><b>{price} EGP</b><br /><button onClick={() => run('/cart/' + p._id, 'DELETE')} style={{ background: '#c00', marginTop: 6 }}>Remove</button></div>
          <div className="row">
            <button onClick={() => count > 1 ? run('/cart/' + p._id, 'PUT', { count: count - 1 }) : run('/cart/' + p._id, 'DELETE')}>−</button>
            <b>{count}</b>
            <button onClick={() => run('/cart/' + p._id, 'PUT', { count: count + 1 })}>+</button>
          </div>
        </div>
      ))}
      <div className="card row"><h3>Total: {data.data.totalCartPrice} EGP</h3><div className="row"><button onClick={clear} style={{ background: '#888' }}>Clear cart</button><Link href="/products"><button style={{ background: '#555' }}>Continue shopping</button></Link><Link href="/checkout"><button>Checkout</button></Link></div></div>
    </>}
  </>);
}
export default function Page() { return <Protected><Cart /></Protected>; }
