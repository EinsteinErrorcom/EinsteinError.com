import { PageEndFooter } from '@/components/page-end-footer';

export default function SparePage() {
  return (
    <main className="page-wrapper" style={{ textAlign: 'center', padding: '48px 16px' }}>
      <h1 style={{ color: '#00FFFF', fontSize: '28px', fontStyle: 'italic' }}>Page 12 — Spare</h1>
      <p style={{ color: '#C5A059', marginTop: '24px' }}>Reserved for future content.</p>
      <PageEndFooter pageNumber={12} />
    </main>
  );
}
