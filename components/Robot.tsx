import React from 'react';
import { motion } from 'framer-motion';
import { Direction } from '../types';

interface RobotProps {
  dir: Direction;
  isExecuting: boolean;
  collision?: boolean;
}

export const Robot: React.FC<RobotProps> = ({ dir, isExecuting, collision }) => {
  const rotation = {
    up: -90,
    down: 90,
    left: 180,
    right: 0
  }[dir];

  return (
    <motion.div
      animate={{ rotate: rotation }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="relative w-full h-full flex items-center justify-center"
    >
      {/* Robot Base */}
      <svg viewBox="0 0 100 100" className={`w-12 h-12 drop-shadow-lg ${collision ? 'opacity-50' : ''}`}>
        <defs>
          <linearGradient id="robotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#00f2ff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#bc13fe', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Body */}
        <rect x="20" y="20" width="60" height="60" rx="12" fill="url(#robotGrad)" />
        <rect x="25" y="25" width="50" height="50" rx="8" fill="#1a1a2e" />
        
        {/* Antennas */}
        <line x1="50" y1="20" x2="50" y2="5" stroke="#00f2ff" strokeWidth="4" />
        <circle cx="50" cy="5" r="4" fill="#bc13fe" />
        
        {/* Eyes */}
        <motion.g
          animate={isExecuting && !collision ? { scaleY: [1, 0.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2, times: [0, 0.1, 0.2] }}
        >
          {collision ? (
            <g>
              <path d="M 35 40 L 45 50 M 45 40 L 35 50" stroke="#ff4d4d" strokeWidth="3" />
              <path d="M 55 40 L 65 50 M 65 40 L 55 50" stroke="#ff4d4d" strokeWidth="3" />
            </g>
          ) : (
            <>
              <circle cx="40" cy="45" r="5" fill="#00f2ff" />
              <circle cx="60" cy="45" r="5" fill="#00f2ff" />
            </>
          )}
        </motion.g>
        
        {/* Mouth/Indicator */}
        <rect x="40" y="60" width="20" height="4" rx="2" fill="#00f2ff" opacity="0.6" />

        {/* Direction Indicator */}
        <path d="M 85 50 L 75 42 L 75 58 Z" fill="#00f2ff" />
      </svg>
      
      {/* Sparkles/Glow if executing */}
      {isExecuting && (
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full"
        />
      )}
    </motion.div>
  );
};
