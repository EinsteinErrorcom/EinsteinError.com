export default function Page5() {
  return (
    <div className="page-shell">
      <main className="page-wrapper" style={{ textAlign: 'center', padding: '48px 16px' }}>
        <h1 style={{ color: '#00FFFF', fontSize: '28px', fontStyle: 'italic' }}>Page 5</h1>
        <p style={{ color: '#FFFF00', marginTop: '24px', fontSize: '20px' }}>
          Content coming soon.
        </p>
        <footer className="page-footer">
          <a className="page-footer__back" href="/page4">← Back to Page 4</a>
          <a className="page-footer__next" href="/page6">Go to Next Page →</a>
          <a className="page-footer__back" href="/">← Back to Home</a>
        </footer>
      </main>
    </div>
  );
}
