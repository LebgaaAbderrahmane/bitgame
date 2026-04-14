export type Direction = 'up' | 'down' | 'left' | 'right';

export type CellType = 'robot' | 'star' | 'gem' | 'wall' | null;

export interface Cell {
  type: CellType;
  dir?: Direction; // Only for robot
}

export type Grid = (Cell | null)[][];

export type CardType = 
  | 'MOVE' 
  | 'TURN_LEFT' 
  | 'TURN_RIGHT' 
  | 'JUMP' 
  | 'REPEAT' 
  | 'IF_GEM' 
  | 'IF_WALL' 
  | 'STORE' 
  | 'USE' 
  | 'CREATE_BLOCK' 
  | 'CALL';

export interface ActionCard {
  id: string;
  type: CardType;
  params?: {
    count?: number;
    blockName?: string;
  };
  children?: ActionCard[];
}

export interface Level {
  id: number;
  title: string;
  grid: Grid;
  availableCards: CardType[];
  instruction: string;
  hint: string;
  maxCards: number;
  startPos?: [number, number];
}

export interface GameState {
  pos: [number, number];
  dir: Direction;
  isExecuting: boolean;
  currentLevelIndex: number;
  program: ActionCard[];
  highlightedCardId: string | null;
  attempts: number;
  message: string | null;
  success: boolean;
  collision: boolean;
  storedValue: number;
  stepsCounter: number;
  blocks: Record<string, ActionCard[]>;
  activeContainerId: string | null;
}
