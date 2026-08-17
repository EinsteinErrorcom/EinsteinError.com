import {
  PAGE6_HIERARCHY_MARKER,
  splitPage6DocumentLines,
} from '@/lib/content/page6';

type Page6DocumentProps = {
  raw: string;
};

function renderLine(line: string) {
  const numberedMatch = line.match(/^(\d+)(\s*-\s*)(.*)$/);
  if (!numberedMatch) {
    return line;
  }

  return (
    <>
      <span className="page6__line-number">{numberedMatch[1]}</span>
      {numberedMatch[2]}
      {numberedMatch[3]}
    </>
  );
}

function Page6PreBlock({ lines }: { lines: string[] }) {
  return (
    <div className="page6__scroll">
      <pre className="page6__document">
        {lines.map((line, index) => (
          <span key={index} className="page6__document-line">
            {renderLine(line)}
            {'\n'}
          </span>
        ))}
      </pre>
    </div>
  );
}

/** Renders page6.txt literally — spacing in the file matches the page. */
export function Page6Document({ raw }: Page6DocumentProps) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const chunks = splitPage6DocumentLines(lines);

  return (
    <>
      {chunks.map((chunk, index) => {
        if (chunk.kind === 'title') {
          return (
            <h2 key={`${PAGE6_HIERARCHY_MARKER}-${index}`} className="page6__title f-x-large">
              {chunk.text}
            </h2>
          );
        }

        return <Page6PreBlock key={`pre-${index}`} lines={chunk.lines} />;
      })}
    </>
  );
}
