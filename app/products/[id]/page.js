'use client';
import { use, useState } from 'react';
import { api } from '@/lib/api';
import useGet from '@/lib/useGet';
import { useApp } from '@/components/Providers';
import { State, Form } from '@/components/ui';

function Reviews({ id }) {
  const { token, say } = useApp();
  const { data, reload } = useGet(`/products/${id}/reviews`);
  return (<div className="card" style={{ marginTop: 20 }}>
    <h3>Reviews</h3>
    {data && !data.data?.length && <p className="muted">No reviews yet.</p>}
    {data?.data?.map((r) => <div key={r._id} className="review"><b>{r.user?.name}</b> · ★ {r.rating}<p>{r.review}</p></div>)}
    {token ? <Form label="Submit review" fields={[['review', 'Your review'], ['rating', 'Rating (1-5)', 'number']]}
      onSubmit={async (v) => { await api(`/products/${id}/reviews`, { method: 'POST', body: { review: v.review, rating: Number(v.rating) }, token }); say('Review added'); reload(); }} /> : <p className="muted">Login to write a review.</p>}
  </div>);
}

export default function Details({ params }) {
  const { id } = use(params);
  const { data, err } = useGet('/products/' + id);
  const { addToCart, toggleWish, wish } = useApp();
  const [img, setImg] = useState(null);
  if (err) return <p className="err center">Product not found or unavailable. ({err})</p>;
  if (!data) return <State d={data} e={err} />;
  const p = data.data;
  if (!p) return <p className="err center">Product not found.</p>;
  return (<>
    <div className="split card">
      <div><img src={img || p.imageCover} alt={p.title} /><div className="thumbs">{[p.imageCover, ...(p.images || [])].map((i) => <img key={i} src={i} onClick={() => setImg(i)} alt="" />)}</div></div>
      <div>
        <h2>{p.title}</h2><p>{p.description}</p>
        <p>{p.category?.name} · {p.brand?.name}</p>
        <div className="row"><b>{p.price} EGP</b><span>★ {p.ratingsAverage} ({p.ratingsQuantity})</span></div>
        <p className={p.quantity > 0 ? 'muted' : 'err'}>{p.quantity > 0 ? `${p.quantity} in stock` : 'Out of stock'}</p>
        <div className="row"><button disabled={p.quantity < 1} onClick={() => addToCart(p._id)}>Add to cart</button><button className={wish.includes(p._id) ? 'heart on' : 'heart'} onClick={() => toggleWish(p._id)}>♥</button></div>
      </div>
    </div>
    <Reviews id={id} />
  </>);
}
