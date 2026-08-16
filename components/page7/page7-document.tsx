type Page7DocumentProps = {
  raw: string;
};

function renderLine(line: string) {
  const numberedMatch = line.match(/^(\d+)(\s*-\s*)(.*)$/);
  if (!numberedMatch) {
    return line;
  }

  return (
    <>
      <span className="page7__line-number">{numberedMatch[1]}</span>
      {numberedMatch[2]}
      {numberedMatch[3]}
    </>
  );
}

/** Renders page7.txt literally — spacing in the file matches the page. */
export function Page7Document({ raw }: Page7DocumentProps) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');

  return (
    <pre className="page7__document">
      {lines.map((line, index) => (
        <span key={index} className="page7__document-line">
          {renderLine(line)}
          {'\n'}
        </span>
      ))}
    </pre>
  );
}
