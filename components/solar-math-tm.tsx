type SolarMathTMProps = {
  className?: string;
};

export function SolarMathTM({ className }: SolarMathTMProps) {
  return (
    <span className={className}>
      SolarMath<sup className="solar-math-tm__mark">TM</sup>
    </span>
  );
}
