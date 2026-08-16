import {
  PAGE7_HIERARCHY_MARKER,
  splitPage7DocumentLines,
} from '@/lib/content/page7';

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

function Page7PreBlock({ lines }: { lines: string[] }) {
  return (
    <div className="page7__scroll">
      <pre className="page7__document">
        {lines.map((line, index) => (
          <span key={index} className="page7__document-line">
            {renderLine(line)}
            {'\n'}
          </span>
        ))}
      </pre>
    </div>
  );
}

/** Renders page7.txt literally — spacing in the file matches the page. */
export function Page7Document({ raw }: Page7DocumentProps) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const chunks = splitPage7DocumentLines(lines);

  return (
    <>
      {chunks.map((chunk, index) => {
        if (chunk.kind === 'title') {
          return (
            <h2 key={`${PAGE7_HIERARCHY_MARKER}-${index}`} className="page7__title f-x-large">
              {chunk.text}
            </h2>
          );
        }

        return <Page7PreBlock key={`pre-${index}`} lines={chunk.lines} />;
      })}
    </>
  );
}
