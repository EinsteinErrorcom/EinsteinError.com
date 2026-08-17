type Page8NumberListProps = {
  numbers: string[];
};

export function Page8NumberList({ numbers }: Page8NumberListProps) {
  if (numbers.length === 0) {
    return null;
  }

  return (
    <section className="page8__numbers" aria-label="All numbers on page 8, sorted smallest to largest">
      <h2 className="page8__numbers-title f-x-large">All Numbers (Smallest → Largest)</h2>
      <pre className="page8__numbers-list">{numbers.join('\n')}</pre>
    </section>
  );
}
