type GoldLinesDividerProps = {
  style?: React.CSSProperties;
  className?: string;
};

export function GoldLinesDivider({ style, className }: GoldLinesDividerProps) {
  return (
    <div
      className={className ? `gold-lines-divider ${className}` : 'gold-lines-divider'}
      style={{
        width: '75%',
        margin: '20px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        ...style,
      }}
      aria-hidden="true"
    >
      <div style={{ height: '6px', backgroundColor: '#D0AB47' }} />
      <div style={{ height: '6px', backgroundColor: '#D0AB47' }} />
      <div style={{ height: '6px', backgroundColor: '#D0AB47' }} />
    </div>
  );
}
