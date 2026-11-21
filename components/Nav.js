'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from './Providers';

export default function Nav() {
  const { token, logout, cartCount, wish } = useApp();
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();
  const item = (href, label) => (
    <Link href={href} onClick={() => setOpen(false)} className={path === href || (href !== '/' && path.startsWith(href)) ? 'active' : ''}>{label}</Link>
  );
  return (
    <nav className="nav">
      <Link href="/" className="logo">🛒 FreshCart</Link>
      <button className="burger" aria-label="Menu" onClick={() => setOpen(!open)}>☰</button>
      <div className={'links' + (open ? ' open' : '')}>
        {item('/products', 'Products')}{item('/categories', 'Categories')}{item('/brands', 'Brands')}
        {token ? <>
          {item('/wishlist', `Wishlist (${wish.length})`)}{item('/cart', `Cart (${cartCount})`)}
          {item('/orders', 'Orders')}{item('/account', 'Account')}
          <button className="link-btn" onClick={() => { logout(); setOpen(false); router.push('/login'); }}>Logout</button>
        </> : <>{item('/login', 'Login')}{item('/register', 'Register')}</>}
      </div>
    </nav>
  );
}
