import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Repeat, Cpu, Diamond, Milestone, Box, Unlock } from 'lucide-react';
import { ActionCard, CardType } from '../types';

interface ProgramListProps {
  program: ActionCard[];
  highlightedCardId: string | null;
  activeContainerId: string | null;
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
}

export const ProgramList: React.FC<ProgramListProps> = ({ 
  program, 
  highlightedCardId, 
  activeContainerId,
  onRemove, 
  onEdit 
}) => {
  return (
    <div className="flex-1 flex flex-col gap-2 overflow-y-auto p-4 min-h-0 border-l border-white/5 ml-2 touch-pan-y custom-scrollbar">
      <AnimatePresence>
        {program.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-white/20 italic text-sm text-center mt-10"
          >
            Choose actions to build your sequence
          </motion.div>
        ) : (
          program.map((card, idx) => (
            <CardItem 
              key={card.id} 
              card={card} 
              isHighlighted={highlightedCardId === card.id}
              isActive={activeContainerId === card.id}
              activeContainerId={activeContainerId}
              onRemove={onRemove}
              onEdit={onEdit}
            />
          ))
        )}
      </AnimatePresence>
    </div>
  );
};

const CardItem: React.FC<{ 
  card: ActionCard; 
  isHighlighted: boolean;
  isActive: boolean;
  activeContainerId: string | null;
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
}> = ({ card, isHighlighted, isActive, activeContainerId, onRemove, onEdit }) => {
  const Icon = getCardIcon(card.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`
        flex flex-col gap-1 w-full
      `}
    >
      <div 
        onClick={() => onEdit?.(card.id)}
        className={`
          flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group relative
          ${isHighlighted ? 'bg-cyan-400/20 border-cyan-400 neon-glow-cyan' : ''}
          ${isActive ? 'bg-white/10 border-dashed border-cyan-400/50' : 'bg-white/5 border-white/10 hover:border-white/20'}
          ${!isHighlighted && !isActive ? 'bg-white/5 border-white/10' : ''}
        `}
      >
        {isActive && (
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-cyan-400 rounded-full shadow-[0_0_8px_white]" />
        )}
        <Icon className={`w-4 h-4 
          ${isHighlighted ? 'text-cyan-400' : ''}
          ${isActive ? 'text-cyan-400' : 'text-white/60 group-hover:text-white'}
        `} />
        <span className="text-xs font-mono uppercase tracking-tighter flex-1 select-none">
          {card.type.replace('_', ' ')}
          {card.type === 'REPEAT' && (
             <span className="ml-2 px-1.5 py-0.5 bg-cyan-400 text-black rounded text-[10px] font-bold">
               x{card.params?.count || 2}
             </span>
          )}
        </span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove(card.id);
          }}
          className="p-1 hover:bg-white/10 rounded-md text-white/40 hover:text-red-400 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      </div>

      {card.children && (
        <div className="ml-6 pl-4 border-l-2 border-white/10 flex flex-col gap-2 mt-1">
          {card.children.map((child) => (
            <CardItem 
               key={child.id} 
               card={child} 
               isHighlighted={isHighlighted} 
               isActive={activeContainerId === child.id}
               activeContainerId={activeContainerId}
               onRemove={onRemove}
            />
          ))}
          {card.children.length === 0 && (
             <div className="text-[10px] text-white/10 italic">Empty loop</div>
          )}
        </div>
      )}
    </motion.div>
  );
};

function getCardIcon(type: CardType) {
  switch (type) {
    case 'MOVE': return ChevronRight;
    case 'TURN_LEFT': return Repeat;
    case 'TURN_RIGHT': return Repeat;
    case 'JUMP': return Cpu;
    case 'REPEAT': return Repeat;
    case 'IF_GEM': return Diamond;
    case 'IF_WALL': return Milestone;
    case 'STORE': return Box;
    case 'USE': return Unlock;
    default: return ChevronRight;
  }
}
