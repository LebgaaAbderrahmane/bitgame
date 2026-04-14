import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  RotateCcw, 
  RotateCw, 
  ArrowUp, 
  IterationCcw, 
  Diamond, 
  BrickWall, 
  Package, 
  Unlock,
  Plus,
  ArrowDownLeft
} from 'lucide-react';
import { CardType } from '../types';

interface ActionPaletteProps {
  availableCards: CardType[];
  onAdd: (type: CardType) => void;
  onCloseContainer: () => void;
  activeContainerId: string | null;
  disabled?: boolean;
}

export const ActionPalette: React.FC<ActionPaletteProps> = ({ 
  availableCards, 
  onAdd, 
  onCloseContainer,
  activeContainerId,
  disabled 
}) => {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 touch-pan-x scrollbar-hide">
      <div className="flex gap-3 px-6 min-w-max">
        {/* End Loop Button */}
        {activeContainerId && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCloseContainer}
            className="flex flex-col items-center gap-2 p-3 min-w-[100px] rounded-2xl bg-red-500/10 border border-red-500/30 text-red-500"
          >
            <div className="p-2 rounded-xl bg-red-500/20">
              <ArrowDownLeft className="w-6 h-6 rotate-45" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
              END LOOP
            </span>
          </motion.button>
        )}

        {availableCards.map((type) => {
          const { Icon, color } = getCardConfig(type);
          
          return (
            <motion.button
              key={type}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              disabled={disabled}
              onClick={() => onAdd(type)}
              className={`
                flex flex-col items-center gap-2 p-3 min-w-[80px] rounded-2xl glass
                transition-opacity ${disabled ? 'opacity-50 grayscale' : 'hover:bg-white/10'}
              `}
            >
              <div className={`p-2 rounded-xl bg-${color}-400/10 text-${color}-400`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                {type.split('_')[0]}
              </span>
              <Plus className="w-3 h-3 text-white/20" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

function getCardConfig(type: CardType) {
  switch (type) {
    case 'MOVE': return { Icon: ChevronRight, color: 'cyan' };
    case 'TURN_LEFT': return { Icon: RotateCcw, color: 'purple' };
    case 'TURN_RIGHT': return { Icon: RotateCw, color: 'purple' };
    case 'JUMP': return { Icon: ArrowUp, color: 'blue' };
    case 'REPEAT': return { Icon: IterationCcw, color: 'pink' };
    case 'IF_GEM': return { Icon: Diamond, color: 'teal' };
    case 'IF_WALL': return { Icon: BrickWall, color: 'orange' };
    case 'STORE': return { Icon: Package, color: 'amber' };
    case 'USE': return { Icon: Unlock, color: 'lime' };
    default: return { Icon: ChevronRight, color: 'slate' };
  }
}
