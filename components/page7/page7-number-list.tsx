import { Fragment, type ReactNode } from 'react';

const PI_NOTE =
  '"Pi"  is a FINITE 12 digit number because ALL Circles are Polygons.';

const TAU_NOTE = 'Tau = Pi x 2.  Tau is superior to Pi.';

const EARTH_DENSITY_NOTE = (
  <>
    The Density of earth which is truly the Density of the &quot;Lattice&quot; at that
    <br />
    specific &quot;Orbit Radius&quot;.
  </>
);

const EARTH_ORBIT_TIME_NOTE = (
  <>
    Earth orbit-Time ( Lunar Year in Seconds ) which is also the &quot;Tension&quot; of
    <br />
    the Lattice.
  </>
);

const LIGHT_VELOCITY_NOTE = (
  <>
    The Velocity of Gravity and the EM-wave.{'  '}
    Einstein&apos;s <span className="page7__numbers-note--red">MISTAKEN</span> Velocity of
    <br />
    Light.{'  '}
    Light velocity = Orbit Velocity as Light is simply Gravity which is slowed down after striking any
    EM-wave which then enables it to become
    <br />
    visible.
  </>
);

const SPACE_PRESSURE_NOTE = (
  <>
    The enormous &quot;Pressure of Space&quot; ( the Strong Force ) that is responsible
    <br />
    for holding atoms together, along with all Chemical reactions, plus the flow of Gravity into the
    earth, and the velocity of the EM-wave.
  </>
);

const NUMBER_NOTES: Record<string, ReactNode> = {
  '3.14159265359': PI_NOTE,
  '6.28318530718': TAU_NOTE,
  '4884.33473424833070115936469003': EARTH_DENSITY_NOTE,
  '30591067': EARTH_ORBIT_TIME_NOTE,
  '299792458': LIGHT_VELOCITY_NOTE,
  '4600192388713.969741338072534351284552285': SPACE_PRESSURE_NOTE,
};

type Page7NumberListProps = {
  numbers: string[];
};

export function Page7NumberList({ numbers }: Page7NumberListProps) {
  if (numbers.length === 0) {
    return null;
  }

  return (
    <div className="page7__numbers-list">
      {numbers.map((number, index) => (
        <Fragment key={index}>
          <div className="page7__numbers-line">{number}</div>
          {NUMBER_NOTES[number] ? (
            <div className="page7__numbers-note">{NUMBER_NOTES[number]}</div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
