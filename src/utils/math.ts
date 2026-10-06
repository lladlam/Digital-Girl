export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
export const ease = (v: number) => { const p = clamp(v); return p * p * (3 - 2 * p); };
export const out = (v: number) => 1 - Math.pow(1 - clamp(v), 3);
export const windowed = (p: number, a: number, b: number) => ease((p - a) / (b - a));
export const seed = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const C = {paper: '#F0EBDC', ink: '#171B1C', red: '#EF443B', mint: '#B9D0BF', dust: '#B7B2A5', pale: '#D9D5C9'};
