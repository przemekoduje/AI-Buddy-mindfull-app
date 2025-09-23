import React from 'react';
import './ShatterAnimation.scss';

const ShatterAnimation = ({ text }) => {
  // Generujemy 20 odłamków
  const shards = Array.from({ length: 20 });

  return (
    <div className="shatter-container">
      {shards.map((_, i) => (
        <div key={i} className="shard">{i % 4 === 0 ? text : ''}</div>
      ))}
    </div>
  );
};

export default ShatterAnimation;