import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, Wind, Eye, Anchor, Compass, Shield, Hand } from 'lucide-react';
import './ControlPanel.scss';

const dockItems = [
  { id: 'breathe', path: '/breathe', Icon: Wind, color: '#e0f2fe' },
  { id: 'perspective', path: '/perspective', Icon: Eye, color: '#fef08a' },
  { id: 'play', isPlayButton: true, color: '#ffffff' }, // Special central button
  { id: 'anchor', path: '/anchor', Icon: Anchor, color: '#e2e8f0' },
  { id: 'compass', path: '/values-compass', Icon: Compass, color: '#fed7aa' },
  { id: 'scan', path: '/body-safe-place', Icon: Shield, color: '#a7f3d0' },
  { id: 'stop', path: '/stop', Icon: Hand, color: '#fecaca' },
];

const ControlPanel = ({ onPlayPause, isPlaying }) => {
  const location = useLocation();

  // Filter out the play button if the onPlayPause callback is not provided
  const activeItems = onPlayPause 
    ? dockItems 
    : dockItems.filter(item => !item.isPlayButton);

  return (
    <div className="control-panel-wrapper">
      <div className="control-panel-dock">
        {activeItems.map((item) => {
          if (item.isPlayButton) {
            return (
              <motion.button
                key="play-pause"
                className={`dock-item play-button ${isPlaying ? 'active' : ''}`}
                onClick={onPlayPause}
                whileHover={{ y: -15, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                style={{ backgroundColor: item.color }}
              >
                {isPlaying ? <Pause size={24} color="#2c3e38" /> : <Play size={24} color="#2c3e38" />}
              </motion.button>
            );
          }

          const isActive = location.pathname === item.path;

          return (
            <Link key={item.id} to={item.path}>
              <motion.div
                className={`dock-item ${isActive ? 'active' : ''}`}
                whileHover={{ y: -15, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                style={{ backgroundColor: item.color }}
              >
                <item.Icon size={24} color="#2c3e38" strokeWidth={1.5} />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ControlPanel;