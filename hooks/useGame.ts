import { useCallback, useRef, useState } from 'react';
import { LEVELS } from '../data/levels';
import { sounds } from '../lib/soundManager';
import { ActionCard, CardType, Direction, GameState } from '@/types';

const INITIAL_SPEED = 500;

export function useGame() {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [gameState, setGameState] = useState<GameState>({
    pos: [0, 0],
    dir: 'right',
    isExecuting: false,
    currentLevelIndex: 0,
    program: [],
    highlightedCardId: null,
    attempts: 0,
    message: null,
    success: false,
    collision: false,
    storedValue: 0,
    stepsCounter: 0,
    blocks: {},
    activeContainerId: null,
  });

  const executionRef = useRef<boolean>(false);
  const stepsCounterRef = useRef<number>(0);
  const storedValueRef = useRef<number>(0);

  const level = LEVELS[currentLevelIdx];

  const resetGame = useCallback((levelIdx?: number) => {
    const idx = levelIdx !== undefined ? levelIdx : currentLevelIdx;

    // Update the base currentLevelIdx if a new one is provided
    if (levelIdx !== undefined) {
      setCurrentLevelIdx(idx);
    }

    const currentLevel = LEVELS[idx];

    // Find initial robot pos
    let startPos: [number, number] = [0, 0];
    let startDir: Direction = 'right';

    currentLevel.grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell?.type === 'robot') {
          startPos = [r, c];
          startDir = cell.dir || 'right';
        }
      });
    });

    setGameState(prev => ({
      ...prev,
      pos: startPos,
      dir: startDir,
      isExecuting: false,
      currentLevelIndex: idx,
      program: [], // Reset program on level change or full reset
      highlightedCardId: null,
      message: null,
      success: false,
      collision: false,
      storedValue: 0,
      stepsCounter: 0,
      blocks: {},
      activeContainerId: null,
    }));

    executionRef.current = false;
    stepsCounterRef.current = 0;
  }, [currentLevelIdx]);

  const updateState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const getNextPos = (pos: [number, number], dir: Direction): [number, number] => {
    const [r, c] = pos;
    switch (dir) {
      case 'up': return [r - 1, c];
      case 'down': return [r + 1, c];
      case 'left': return [r, c - 1];
      case 'right': return [r, c + 1];
    }
  };

  const isInvalid = (pos: [number, number], grid: (any)[][]) => {
    const [r, c] = pos;
    return r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c]?.type === 'wall';
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runProgram = async () => {
    if (gameState.isExecuting) return;

    executionRef.current = true;
    updateState({ isExecuting: true, attempts: gameState.attempts + 1, message: null, success: false, collision: false });

    // Prepare initial state for execution
    let currentPos = [...gameState.pos] as [number, number];
    let currentDir = gameState.dir;
    stepsCounterRef.current = 0;

    const executeBlock = async (cards: ActionCard[]): Promise<boolean> => {
      for (const card of cards) {
        if (!executionRef.current) return false;

        updateState({ highlightedCardId: card.id });
        await delay(INITIAL_SPEED);

        const result = await executeCard(card);
        if (!result) return false;
        if (gameState.success || gameState.collision) return true;
      }
      return true;
    };

    const executeCard = async (card: ActionCard): Promise<boolean> => {
      switch (card.type) {
        case 'MOVE':
          return await moveRobot();
        case 'TURN_LEFT':
          currentDir = rotate(currentDir, -90);
          updateState({ dir: currentDir });
          sounds.playTurn();
          return true;
        case 'TURN_RIGHT':
          currentDir = rotate(currentDir, 90);
          updateState({ dir: currentDir });
          sounds.playTurn();
          return true;
        case 'JUMP':
          return await moveRobot(2);
        case 'REPEAT':
          const count = card.params?.count || 2;
          for (let i = 0; i < count; i++) {
            const success = await executeBlock(card.children || []);
            if (!success || executionRef.current === false) return false;
          }
          return true;
        case 'IF_GEM':
          if (level.grid[currentPos[0]][currentPos[1]]?.type === 'gem') {
            return await executeBlock(card.children || []);
          }
          return true;
        case 'IF_WALL':
          const next = getNextPos(currentPos, currentDir);
          if (isInvalid(next, level.grid)) {
            return await executeBlock(card.children || []);
          }
          return true;
        case 'STORE':
          storedValueRef.current = stepsCounterRef.current;
          updateState({ storedValue: storedValueRef.current });
          return true;
        case 'USE':
          for (let i = 0; i < storedValueRef.current; i++) {
            const success = await moveRobot();
            if (!success) return false;
          }
          return true;
        default:
          return true;
      }
    };

    const moveRobot = async (dist = 1): Promise<boolean> => {
      for (let i = 0; i < dist; i++) {
        const next = getNextPos(currentPos, currentDir);
        if (isInvalid(next, level.grid)) {
          updateState({ collision: true, message: "Ouch! You hit a wall or the edge." });
          sounds.playHitWall();
          executionRef.current = false;
          return false;
        }
        currentPos = next;
        stepsCounterRef.current++;
        updateState({ pos: currentPos, stepsCounter: stepsCounterRef.current });
        sounds.playMove();

        // Check for gem
        if (level.grid[currentPos[0]][currentPos[1]]?.type === 'gem') {
          sounds.playCollect();
        }

        if (level.grid[currentPos[0]][currentPos[1]]?.type === 'star') {
          updateState({ success: true, message: "Success! You reached the star." });
          sounds.playSuccess();
          executionRef.current = false;
          return true;
        }
        await delay(300);
      }
      return true;
    };

    const rotate = (dir: Direction, angle: number): Direction => {
      const dirs: Direction[] = ['up', 'right', 'down', 'left'];
      let idx = dirs.indexOf(dir);
      idx = (idx + (angle / 90) + 4) % 4;
      return dirs[idx];
    };

    await executeBlock(gameState.program);

    if (executionRef.current && !gameState.success) {
      // Finished all cards but didn't reach star
      updateState({ isExecuting: false, highlightedCardId: null, message: "Program ended. Goal not reached." });
      sounds.playFail();
    } else {
      updateState({ isExecuting: false, highlightedCardId: null });
    }
    executionRef.current = false;
  };

  const addCard = (type: CardType) => {
    const id = Math.random().toString(36).substr(2, 9);
    const isContainer = ['REPEAT', 'IF_GEM', 'IF_WALL'].includes(type);

    const newCard: ActionCard = { id, type };
    if (isContainer) {
      newCard.children = [];
      newCard.params = { count: 2 };
    }

    setGameState(prev => {
      const newProgram = JSON.parse(JSON.stringify(prev.program));
      let updatedActiveId = prev.activeContainerId;

      if (prev.activeContainerId) {
        // Find container and add child
        const findAndAdd = (cards: ActionCard[]): boolean => {
          for (const card of cards) {
            if (card.id === prev.activeContainerId && card.children) {
              card.children.push(newCard);
              return true;
            }
            if (card.children && findAndAdd(card.children)) return true;
          }
          return false;
        };
        findAndAdd(newProgram);
      } else {
        newProgram.push(newCard);
      }

      // If we just added a container, make it the new active one
      if (isContainer) {
        updatedActiveId = id;
      }

      return {
        ...prev,
        program: newProgram,
        activeContainerId: updatedActiveId
      };
    });
  };

  const removeCard = (id: string) => {
    setGameState(prev => {
      const newProgram = JSON.parse(JSON.stringify(prev.program));
      const removeRecursive = (cards: ActionCard[]): boolean => {
        const idx = cards.findIndex(c => c.id === id);
        if (idx !== -1) {
          cards.splice(idx, 1);
          return true;
        }
        for (const card of cards) {
          if (card.children && removeRecursive(card.children)) return true;
        }
        return false;
      };
      removeRecursive(newProgram);
      return { ...prev, program: newProgram };
    });
  };

  const editCard = (id: string) => {
    setGameState(prev => {
      const newProgram = JSON.parse(JSON.stringify(prev.program));
      const findAndEdit = (cards: ActionCard[]): boolean => {
        for (const card of cards) {
          if (card.id === id) {
            if (card.type === 'REPEAT') {
              const currentCount = card.params?.count ?? 2;
              const nextCount = (currentCount % 5) + 1;
              card.params = { ...card.params, count: nextCount < 2 ? 2 : nextCount };
            }
            return true;
          }
          if (card.children && findAndEdit(card.children)) return true;
        }
        return false;
      };
      findAndEdit(newProgram);
      return { ...prev, program: newProgram };
    });
  };

  const closeContainer = () => {
    updateState({ activeContainerId: null });
  };

  return {
    gameState,
    level,
    resetGame,
    runProgram,
    addCard,
    removeCard,
    editCard,
    closeContainer,
    setProgram: (program: ActionCard[]) => updateState({ program }),
    nextLevel: () => {
      const nextIdx = (currentLevelIdx + 1) % LEVELS.length;
      setCurrentLevelIdx(nextIdx);
      resetGame(nextIdx);
    }
  };
}
