interface Page4PumpkinDividerProps {
  gapAbove?: string;
  gapBelow?: string;
}

export function Page4PumpkinDivider({
  gapAbove = "3em",
  gapBelow = "3em",
}: Page4PumpkinDividerProps) {
  return (
    <div className="page4-pumpkin-divider-wrap">
      <div className="page4-pumpkin-divider-wrap__gap" style={{ height: gapAbove }} aria-hidden="true" />
      <div className="page4-pumpkin-divider-wrap__line" aria-hidden="true" />
      <div className="page4-pumpkin-divider-wrap__gap" style={{ height: gapBelow }} aria-hidden="true" />
    </div>
  );
}
