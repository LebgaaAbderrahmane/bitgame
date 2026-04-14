'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Robot } from './Robot';
import { sounds } from '../lib/soundManager';

interface StoryIntroProps {
  onStart: () => void;
}

const STORY_STEPS = [
  {
    text: "SYSTEM ALERT: Logic Core Fragmented. Memory banks corrupted.",
    expression: "shocked",
  },
  {
    text: "Hello? I am BIT-01. I was hit by a solar flare while backup up the mainframe...",
    expression: "neutral",
  },
  {
    text: "I need to reach the RECOVERY STARS to reboot my logic circuits.",
    expression: "happy",
  },
  {
    text: "Can you help me? We'll need to use these logic chips to find the way.",
    expression: "determined",
  }
];

export const StoryIntro: React.FC<StoryIntroProps> = ({ onStart }) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < STORY_STEPS.length - 1) {
      setStep(step + 1);
      sounds.playMove(); // Audio feedback
    } else {
      sounds.startMusic();
      onStart();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#0d0d12] flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
      
      <div className="relative flex flex-col items-center gap-12 max-w-sm w-full">
        {/* Animated Robot */}
        <motion.div
           key={step}
           initial={{ scale: 0.8, y: 20 }}
           animate={{ scale: 1.2, y: 0 }}
           transition={{ type: 'spring' }}
           className="w-40 h-40"
        >
          <Robot 
            dir="right" 
            isExecuting={true} 
            collision={false} 
          />
        </motion.div>

        {/* Narrative Box */}
        <div className="glass p-8 rounded-[32px] w-full border border-white/20 min-h-[200px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-lg font-medium leading-relaxed text-white/90"
            >
              <span className="text-cyan-400 font-bold block mb-2 text-sm uppercase tracking-widest">
                [ BIT-01 ]
              </span>
              {STORY_STEPS[step].text}
            </motion.p>
          </AnimatePresence>

          <div className="mt-auto pt-6 flex justify-end">
            <button
               onClick={handleNext}
               className="px-8 py-3 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95"
            >
              {step === STORY_STEPS.length - 1 ? "Connect" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
