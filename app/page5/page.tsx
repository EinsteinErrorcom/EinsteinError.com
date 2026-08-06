import { PageEndFooter } from '@/components/page-end-footer';

export default function Page5() {
  return (
    <div className="page-shell">
      <main className="page-wrapper" style={{ textAlign: 'center', padding: '48px 16px' }}>
        <h1 style={{ color: '#00FFFF', fontSize: '28px', fontStyle: 'italic' }}>Page 5</h1>
        <p style={{ color: '#FFFF00', marginTop: '24px', fontSize: '20px' }}>
          Content coming soon.
        </p>
        <PageEndFooter pageNumber={5} />
      </main>
    </div>
  );
}
