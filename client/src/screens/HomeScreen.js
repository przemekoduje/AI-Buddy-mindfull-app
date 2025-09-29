import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.scss';

const exercises = [
  { title: 'Breathe', subtitle: 'To quick calm down', path: '/breathe' },
  { title: 'Perspective shift', subtitle: 'To see things differently', path: '/perspective' },
  { title: 'Values Compass', subtitle: 'To set your intentions for the day', path: '/daily-compass' },
  { title: 'Anchor', subtitle: 'To realease anxieties', path: '/anchor' },
  
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