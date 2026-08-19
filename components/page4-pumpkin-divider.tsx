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
      <span className="page4-pumpkin-divider-wrap__sizer" aria-hidden="true">
        In our 12-Bit Universe, the Size of the Universe = ( Earth orbit-Radius )³
      </span>
      <div className="page4-pumpkin-divider-wrap__gap" style={{ height: gapAbove }} aria-hidden="true" />
      <div className="page4-pumpkin-divider-wrap__line" aria-hidden="true" />
      <div className="page4-pumpkin-divider-wrap__gap" style={{ height: gapBelow }} aria-hidden="true" />
    </div>
  );
}
