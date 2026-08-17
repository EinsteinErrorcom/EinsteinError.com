import { PageNav } from "@/components/page-nav";

type ContactBarProps = {
  page: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  style?: React.CSSProperties;
};

export function ContactBar({ page, style }: ContactBarProps) {
  return (
    <div
      className="contact-bar"
      style={{
        fontWeight: 'bold',
        fontStyle: 'italic',
        fontSize: '20px',
        marginTop: '12px',
        textAlign: 'center',
        ...style,
      }}
    >
      <span style={{ color: '#40E0D0', fontSize: '25px' }}>Contact&nbsp;&nbsp;Us</span>
      <br />
      <span style={{ color: '#00FFFF' }}>WhatsApp</span>
      {'\u00A0'.repeat(4)}
      <span style={{ color: '#D0AB47' }}>+17802707009</span>
      <br />
      <span style={{ color: '#00FFFF' }}>Email</span>
      {'\u00A0'.repeat(4)}
      <span style={{ color: '#D0AB47' }}>wild.book0719@fastmail.com</span>
      <PageNav page={page} className="contact-bar__nav" />
    </div>
  );
}
