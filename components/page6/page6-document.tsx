import {
  PAGE6_HIERARCHY_MARKER,
  isPage6HierarchyPrimaryLine,
  splitPage6DocumentLines,
} from '@/lib/content/page6';
import { Fragment } from 'react';
import { renderStyledEquals, StyledEquals } from '@/components/styled-equals';

type Page6DocumentProps = {
  raw: string;
};

function renderDefinitionLine(text: string) {
  const defMatch = text.match(/^(.+?)  =  (.*)$/);
  if (!defMatch) {
    return renderStyledEquals(text);
  }

  return (
    <>
      <span className="page6__definition-key">{defMatch[1]}</span>
      {'  '}
      <StyledEquals />
      {'  '}
      <span className="page6__definition-value">{defMatch[2]}</span>
    </>
  );
}

function renderLine(line: string) {
  const numberedMatch = line.match(/^(\d+)(\s*-\s*)(.*)$/);
  if (!numberedMatch) {
    return renderPlainLine(line);
  }

  return (
    <>
      <span className="page6__line-number">{numberedMatch[1]}</span>
      {numberedMatch[2]}
      {renderDefinitionLine(numberedMatch[3])}
    </>
  );
}

function renderPrimaryHierarchyLine(line: string) {
  const trimmed = line.trimStart();
  const leading = line.slice(0, line.length - trimmed.length);
  const match = trimmed.match(/^(\d*)([A-Za-z][^=]*?)(\s*=)(\s*)([\s\S]*)$/);

  if (!match) {
    return renderStyledEquals(line);
  }

  const [, digits, words, equalsSpacing, afterEqualsSpace, rest] = match;

  return (
    <>
      {leading}
      {digits}
      <span className="page6__term-key">{words}</span>
      {equalsSpacing.slice(0, -1)}
      <StyledEquals />
      {afterEqualsSpace}
      {renderStyledEquals(rest)}
    </>
  );
}

function renderPlainLine(line: string) {
  if (!isPage6HierarchyPrimaryLine(line)) {
    return renderStyledEquals(line);
  }

  return renderPrimaryHierarchyLine(line);
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

function renderHierarchyTitle(text: string) {
  if (text.includes('\n')) {
    const lines = text.split('\n');
    return (
      <>
        {lines.map((line, index) => (
          <Fragment key={index}>
            {index > 0 ? <br /> : null}
            {renderStyledEquals(line)}
          </Fragment>
        ))}
      </>
    );
  }

  return renderStyledEquals(text);
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
              {renderHierarchyTitle(chunk.text)}
            </h2>
          );
        }

        return <Page6PreBlock key={`pre-${index}`} lines={chunk.lines} />;
      })}
    </>
  );
}
