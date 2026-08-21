import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wind, Eye, Compass, Anchor, Headphones, Hand, User, Shield, Activity } from 'lucide-react';
import './HomeScreen.scss';

const exercises = [
  { title: 'Breathe', subtitle: 'To quickly calm down', path: '/breathe', icon: Wind, color: '#e0f2fe' },
  { title: 'Perspective shift', subtitle: 'To see things differently', path: '/perspective', icon: Eye, color: '#fef08a' },
  { title: 'Values Compass', subtitle: 'To find your direction', path: '/values-compass', icon: Compass, color: '#fed7aa' },
  { title: 'Anchor', subtitle: 'To ground yourself in the present', path: '/anchor', icon: Anchor, color: '#e2e8f0' },
  { title: 'Sound Mapping', subtitle: 'To focus on sounds and find calm', path: '/sound-mapping', icon: Headphones, color: '#d9f99d' },
  { title: 'Stop', subtitle: 'To interrupt the stress cycle', path: '/stop', icon: Hand, color: '#fecaca' },
  { title: 'External Observer', subtitle: 'To detach from a difficult emotion', path: '/external-observer', icon: User, color: '#e9d5ff' },
  { title: 'Body Safe Place', subtitle: 'To find calm in your body', path: '/body-safe-place', icon: Shield, color: '#a7f3d0' },
  { title: 'Body Scan', subtitle: 'Zwiększenie świadomości ciała', path: '/body-scan', icon: Activity, color: '#fca5a5' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const HomeScreen = () => {
  return (
    <div className="home-screen">
      <motion.div 
        className="home-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="home-screen__title">Good morning.</h1>
        <p className="home-screen__subtitle">What do you need today?</p>
      </motion.div>

      <motion.div 
        className="home-screen__grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {exercises.map((ex, index) => {
          const IconComponent = ex.icon;
          return (
            <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to={ex.path} className="home-card glass-panel">
                <div className="icon-wrapper" style={{ backgroundColor: ex.color }}>
                  <IconComponent size={32} color="#2c3e38" strokeWidth={1.5} />
                </div>
                <div className="item-content">
                  <h3 className="item-title">{ex.title}</h3>
                  <p className="item-subtitle">{ex.subtitle}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default HomeScreen;