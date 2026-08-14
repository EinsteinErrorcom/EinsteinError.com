type ContactBarProps = {
  style?: React.CSSProperties;
};

export function ContactBar({ style }: ContactBarProps) {
  return (
    <div
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
    </div>
  );
}
