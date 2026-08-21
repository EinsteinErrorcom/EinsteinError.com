/** True only on local `next dev` — blocks dev tools on Vercel preview/production. */
export function isLocalDevEnvironment(): boolean {
  return process.env.NODE_ENV === 'development';
}
