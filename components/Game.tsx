'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Play, RotateCcw, Lightbulb, Trophy, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGame } from '../hooks/useGame';
import { Grid } from './Grid';
import { ProgramList } from './ProgramList';
import { ActionPalette } from './ActionPalette';
import { StoryIntro } from './StoryIntro';
import { LEVELS } from '../data/levels';
import { sounds } from '../lib/soundManager';

export const Game: React.FC = () => {
  const { 
    gameState, 
    level, 
    resetGame, 
    runProgram, 
    addCard, 
    removeCard,
    editCard,
    closeContainer,
    nextLevel, 
    setProgram 
  } = useGame();

  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showStory, setShowStory] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Check if story seen in this session
    const seen = sessionStorage.getItem('tiny_coder_story_seen');
    if (seen) setShowStory(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-lg mx-auto bg-[#0d0d12] relative overflow-hidden touch-manipulation">
      {/* Header */}
      <header className="flex justify-between items-center p-4 z-20">
        <button 
          onClick={() => setShowLevelSelect(true)}
          className="glass px-4 py-2 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors"
        >
          <span className="text-yellow-400 font-bold">★</span>
          <span className="text-sm font-bold uppercase tracking-wider">{level.title}</span>
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              sounds.toggleMute();
              setIsMuted(!isMuted);
            }}
            className="text-white/40 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <div className="text-[10px] uppercase tracking-widest text-white/40">
            Attempts: <span className="text-white font-mono">{gameState.attempts}</span>
          </div>
        </div>
      </header>

      {/* World Preview */}
      <main className="flex-none flex flex-col items-center justify-center p-4 gap-4 relative">
        <Grid 
          grid={level.grid}
          pos={gameState.pos}
          dir={gameState.dir}
          isExecuting={gameState.isExecuting}
          collision={gameState.collision}
          success={gameState.success}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={level.id}
          className="glass p-4 rounded-2xl border-l-4 border-cyan-400 w-full"
        >
          <p className="text-sm text-white/80 leading-relaxed italic">
            "{level.instruction}"
          </p>
        </motion.div>
      </main>

      {/* Code Editor Area */}
      <section className="flex-1 flex flex-col glass rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-10 overflow-hidden min-h-0 touch-auto">
        <div className="flex justify-between items-center px-8 py-6">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white/30">Your Sequence</h2>
          <div className="flex gap-2">
             <button 
              onClick={() => {
                closeContainer();
                runProgram();
              }}
              disabled={gameState.isExecuting || gameState.program.length === 0}
              className="px-6 py-2 bg-cyan-400 text-black rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(0,242,255,0.4)] disabled:opacity-30 active:scale-95 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" /> Run
            </button>
            <button 
              onClick={() => resetGame()}
              className="p-2 glass rounded-xl hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>

        <ProgramList 
          program={gameState.program}
          highlightedCardId={gameState.highlightedCardId}
          activeContainerId={gameState.activeContainerId}
          onRemove={removeCard}
          onEdit={editCard}
        />

        <ActionPalette 
          availableCards={level.availableCards}
          onAdd={(type) => addCard(type)}
          onCloseContainer={closeContainer}
          activeContainerId={gameState.activeContainerId}
          disabled={gameState.isExecuting}
        />
      </section>

      {/* Narrative Overlay */}
      <AnimatePresence>
        {showStory && (
          <StoryIntro 
            onStart={() => {
              setShowStory(false);
              sessionStorage.setItem('tiny_coder_story_seen', 'true');
            }} 
          />
        )}
      </AnimatePresence>

      {/* Persistence / Modals */}
      <AnimatePresence>
        {gameState.message && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass p-8 rounded-[32px] w-full max-w-sm border border-white/20 text-center"
            >
              <div className="flex justify-center mb-6">
                {gameState.success ? (
                  <div className="bg-green-400/20 p-4 rounded-full neon-glow-green">
                    <Trophy className="w-12 h-12 text-green-400" />
                  </div>
                ) : (
                  <div className="bg-red-400/20 p-4 rounded-full neon-glow-red">
                    <AlertTriangle className="w-12 h-12 text-red-400" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-black uppercase mb-2 tracking-tight">
                {gameState.success ? "Stellar!" : "Oops!"}
              </h2>
              <p className="text-white/60 mb-10 text-sm">
                {gameState.message}
              </p>
              
              <div className="flex flex-col gap-3">
                {gameState.success ? (
                  <button 
                    onClick={nextLevel}
                    className="w-full py-4 bg-cyan-400 text-black rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-cyan-400/20 active:scale-95 transition-transform"
                  >
                    Next Logic Chip
                  </button>
                ) : (
                  <button 
                    onClick={() => resetGame()}
                    className="w-full py-4 glass text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-transform"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showLevelSelect && (
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl"
          >
            <div className="w-full max-w-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black uppercase tracking-widest">Levels</h2>
                <button onClick={() => setShowLevelSelect(false)} className="text-white/40">✕</button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {LEVELS.map((lvl, idx) => (
                  <button
                    key={lvl.id}
                    onClick={() => {
                       // Note: implementation of level jumping
                       resetGame(idx);
                       setShowLevelSelect(false);
                    }}
                    className={`aspect-square rounded-xl flex items-center justify-center font-black transition-all ${idx === gameState.currentLevelIndex ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,242,255,0.6)]' : 'glass text-white/60 hover:bg-white/10'}`}
                  >
                    {lvl.id}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
