import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.scss';

const exercises = [
  { title: 'Breathe', subtitle: 'To quick calm down', path: '/breathe' },
  { title: 'Perspective shift', subtitle: 'To see things differently', path: '/perspective' },
  { title: 'Values Compass', subtitle: 'To find your direction', path: '/values-compass' },
  { title: 'Anchor', subtitle: 'To ground yourself in the present moment', path: '/anchor' },
  { title: 'Sound Mapping', subtitle: 'To focus on sounds and find calm', path: '/sound-mapping' },
  { title: 'Stop', subtitle: 'To interrupt the stress cycle', path: '/stop' },
  { title: 'External Observer', subtitle: 'To detach from a difficult emotion', path: '/external-observer' },
  { title: 'Body Safe Place', subtitle: 'To find a feeling of calm in your body', path: '/body-safe-place' },
  
];

const HomeScreen = () => {
  return (
    <div className="home-screen">
      <h1 className="home-screen__title">What do you need?</h1>
      <ul className="home-screen__list">
        {exercises.map((ex, index) => (
          <li key={index} className="home-screen__list-item">
            <Link to={ex.path}>
              <div className="item-content">
                <span className="item-title">{ex.title}</span>
                <span className="item-subtitle">{ex.subtitle}</span>
              </div>
              <span className="item-arrow">&gt;</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeScreen;