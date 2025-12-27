import { useState, useEffect } from 'react';
import './PlanetInfo.css';

interface PlanetData {
  name: string;
  color: string;
  distance: string;
  diameter: string;
  dayLength: string;
  fact: string;
}

const planetData: Record<string, PlanetData> = {
  Mercury: {
    name: 'Mercury',
    color: '#8C7E6D',
    distance: '57.9 million km',
    diameter: '4,879 km',
    dayLength: '59 Earth days',
    fact: 'The smallest planet in our solar system and closest to the Sun.'
  },
  Venus: {
    name: 'Venus',
    color: '#E6C87A',
    distance: '108.2 million km',
    diameter: '12,104 km',
    dayLength: '243 Earth days',
    fact: 'Venus spins backwards compared to most planets.'
  },
  Earth: {
    name: 'Earth',
    color: '#4169E1',
    distance: '149.6 million km',
    diameter: '12,742 km',
    dayLength: '24 hours',
    fact: 'The only planet known to harbor life.'
  },
  Mars: {
    name: 'Mars',
    color: '#CD5C5C',
    distance: '227.9 million km',
    diameter: '6,779 km',
    dayLength: '24.6 hours',
    fact: 'Home to the tallest mountain in the solar system, Olympus Mons.'
  },
  Jupiter: {
    name: 'Jupiter',
    color: '#D4A574',
    distance: '778.5 million km',
    diameter: '139,820 km',
    dayLength: '10 hours',
    fact: 'The Great Red Spot is a storm that has raged for over 400 years.'
  },
  Saturn: {
    name: 'Saturn',
    color: '#F4D59E',
    distance: '1.4 billion km',
    diameter: '116,460 km',
    dayLength: '10.7 hours',
    fact: 'Saturn could float in water because it is mostly gas.'
  },
  Uranus: {
    name: 'Uranus',
    color: '#7EC8E3',
    distance: '2.9 billion km',
    diameter: '50,724 km',
    dayLength: '17 hours',
    fact: 'Uranus rotates on its side, like a rolling ball.'
  },
  Neptune: {
    name: 'Neptune',
    color: '#4B6CB7',
    distance: '4.5 billion km',
    diameter: '49,244 km',
    dayLength: '16 hours',
    fact: 'Neptune has the strongest winds in the solar system.'
  },
  Sun: {
    name: 'Sun',
    color: '#FDB813',
    distance: '0 km (center)',
    diameter: '1,392,684 km',
    dayLength: '25 Earth days',
    fact: 'The Sun contains 99.86% of the mass in our solar system.'
  }
};

interface PlanetInfoProps {
  planetName: string | null;
  position: { x: number; y: number } | null;
}

export function PlanetInfo({ planetName, position }: PlanetInfoProps) {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<PlanetData | null>(null);

  useEffect(() => {
    if (planetName && position && planetData[planetName]) {
      setData(planetData[planetName]);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [planetName, position]);

  if (!data || !position) return null;

  return (
    <div 
      className={`planet-info-overlay ${visible ? 'visible' : ''}`}
      style={{
        left: position.x + 20,
        top: position.y - 100,
      }}
    >
      <div className="planet-info-card">
        <h3>
          <span className="planet-dot" style={{ background: data.color }} />
          {data.name}
        </h3>
        <div className="planet-stats">
          <div className="stat">
            <span className="stat-label">Distance from Sun</span>
            <span className="stat-value">{data.distance}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Diameter</span>
            <span className="stat-value">{data.diameter}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Day Length</span>
            <span className="stat-value">{data.dayLength}</span>
          </div>
        </div>
        <p className="planet-fact">{data.fact}</p>
      </div>
    </div>
  );
}
