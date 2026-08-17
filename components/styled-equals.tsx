import { Fragment } from "react";

export function StyledEquals() {
  return <span className="styled-equals">=</span>;
}

export function renderStyledEquals(text: string) {
  const parts = text.split("=");

  if (parts.length === 1) {
    return text;
  }

  return parts.map((part, index) => (
    <Fragment key={index}>
      {part}
      {index < parts.length - 1 ? <StyledEquals /> : null}
    </Fragment>
  ));
}
