import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Flame, Gem as GemIcon, BrickWall } from 'lucide-react';
import { Grid as GridType, Direction, Cell } from '../types';
import { Robot } from './Robot';

interface GridProps {
  grid: GridType;
  pos: [number, number];
  dir: Direction;
  isExecuting: boolean;
  collision: boolean;
  success: boolean;
}

export const Grid: React.FC<GridProps> = ({ grid, pos, dir, isExecuting, collision, success }) => {
  return (
    <motion.div
      animate={collision ? { x: [-5, 5, -5, 5, 0], scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.3 }}
      className="relative glass p-4 rounded-2xl overflow-hidden neon-glow-cyan"
    >
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          minWidth: '320px'
        }}
      >
        {grid.map((row, r) => (
          row.map((cell, c) => {
            const isRobotHere = pos[0] === r && pos[1] === c;

            return (
              <div
                key={`${r}-${c}`}
                className={`
                  aspect-square w-12 rounded-lg relative flex items-center justify-center
                  ${cell?.type === 'wall' ? 'bg-slate-800' : 'bg-white/5'}
                  border border-white/10
                `}
              >
                {/* Cell Contents */}
                <AnimatePresence>
                  {cell?.type === 'star' && !success && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                      exit={{ scale: 0, scaleY: 0 }}
                      transition={{ rotate: { repeat: Infinity, duration: 2 } }}
                    >
                      <Star className="text-yellow-400 fill-yellow-400 w-8 h-8 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                    </motion.div>
                  )}

                  {cell?.type === 'gem' && (
                    <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}>
                      <GemIcon className="text-cyan-400 w-6 h-6" />
                    </motion.div>
                  )}

                  {cell?.type === 'wall' && (
                    <div className="w-full h-full flex items-center justify-center p-2">
                      <BrickWall className="text-slate-500 fill-slate-800 w-full h-full" />
                    </div>
                  )}
                </AnimatePresence>

                {/* Robot Rendering */}
                {isRobotHere && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center p-1">
                    <Robot dir={dir} isExecuting={isExecuting} collision={collision} />
                  </div>
                )}
              </div>
            );
          })
        ))}
      </div>

      {/* Effects Overlays */}
      {collision && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          className="absolute inset-0 bg-red-500/20 pointer-events-none"
        />
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          className="absolute inset-0 bg-green-500/20 pointer-events-none"
        />
      )}
    </motion.div>
  );
};
