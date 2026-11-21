import './globals.css';
import Providers from '@/components/Providers';
import Nav from '@/components/Nav';
export const metadata = { title: 'FreshCart' };
export default function RootLayout({ children }) {
  return <html lang="en"><body><Providers><Nav /><main>{children}</main></Providers></body></html>;
}
