export const BASE = 'https://ecommerce.routemisr.com/api/v1';

export async function api(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { token }) },
    body: body && JSON.stringify(body),
  }).catch(() => { throw new Error('Network error, please check your connection'); });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token && typeof window !== 'undefined') window.dispatchEvent(new Event('auth-expired'));
    throw new Error(data.message || data.errors?.msg || `Request failed (${res.status})`);
  }
  return data;
}

export const validators = {
  password: (v) => { if (v.length < 6) throw new Error('Password must be at least 6 characters'); },
  match: (a, b) => { if (a !== b) throw new Error('Passwords do not match'); },
  phone: (v) => { if (!/^01[0125][0-9]{8}$/.test(v)) throw new Error('Enter a valid Egyptian phone number'); },
};
