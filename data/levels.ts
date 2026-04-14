import { Level } from '../types';

export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Level 1: Straight Ahead",
    grid: [
      [{ type: 'robot', dir: 'right' }, null, null, null, null, { type: 'star' }],
      [null, null, null, null, null, null]
    ],
    availableCards: ["MOVE"],
    instruction: "The robot needs to reach the star. Use MOVE to go forward!",
    hint: "Tap MOVE 5 times to reach the star."
  },
  {
    id: 2,
    title: "Level 2: The Turn",
    grid: [
      [{ type: 'robot', dir: 'right' }, null, null],
      [null, null, { type: 'star' }]
    ],
    availableCards: ["MOVE", "TURN_RIGHT"],
    instruction: "Moving forward isn't enough. You can TURN RIGHT to change direction.",
    hint: "MOVE, MOVE, TURN RIGHT, then MOVE."
  },
  {
    id: 3,
    title: "Level 3: Back and Forth",
    grid: [
      [{ type: 'robot', dir: 'right' }, null, { type: 'star' }],
      [null, { type: 'wall' }, null]
    ],
    availableCards: ["MOVE", "TURN_LEFT", "TURN_RIGHT"],
    instruction: "Use your turns carefully to navigate the grid.",
    hint: "You need 2 moves, but maybe a turn first? Wait, no, just MOVE, MOVE."
  },
  {
    id: 4,
    title: "Level 4: Loop It",
    grid: [
      [{ type: 'robot', dir: 'right' }, null, null, null, null, { type: 'star' }],
      [null, null, null, null, null, null]
    ],
    availableCards: ["MOVE", "REPEAT"],
    instruction: "Repeating yourself? Use REPEAT to do multiple steps at once!",
    hint: "Add a REPEAT card, set it to 5, and drag a MOVE inside."
  },
  {
    id: 5,
    title: "Level 5: Snake Pattern",
    grid: [
      [{ type: 'robot', dir: 'right' }, null, { type: 'wall' }, { type: 'star' }, null, null],
      [null, null, null, null, null, null]
    ],
    availableCards: ["MOVE", "TURN_LEFT", "TURN_RIGHT", "REPEAT"],
    instruction: "Walls are impassable! You must go around them.",
    hint: "Turn right, move down, then turn left to pass under the wall."
  },
  {
    id: 6,
    title: "Level 6: Long Hallway",
    grid: [
      [{ type: 'robot', dir: 'down' }, null, null, null, null, null],
      [{ type: 'star' }, null, null, null, null, null]
    ],
    availableCards: ["MOVE", "REPEAT"],
    instruction: "Sometimes a single loop is all you need.",
    hint: "Just one MOVE inside a REPEAT."
  },
  {
    id: 7,
    title: "Level 7: The Gem Sorter",
    grid: [
      [{ type: 'robot', dir: 'right' }, { type: 'gem' }, null, { type: 'star' }, null, null],
      [null, null, null, null, null, null]
    ],
    availableCards: ["MOVE", "IF_GEM", "JUMP"],
    instruction: "Wait! There's a gem. Use IF GEM to jump over it.",
    hint: "MOVE, IF GEM { JUMP }, MOVE."
  },
  {
    id: 8,
    title: "Level 8: Guarded Path",
    grid: [
      [{ type: 'robot', dir: 'right' }, { type: 'wall' }, null, { type: 'star' }, null, null],
      [null, null, null, null, null, null]
    ],
    availableCards: ["MOVE", "IF_WALL", "TURN_RIGHT", "TURN_LEFT"],
    instruction: "Walls block your way. Use IF WALL to turn if the path is blocked.",
    hint: "Use IF WALL to decide when to turn based on your surroundings."
  },
  {
    id: 9,
    title: "Level 9: Precision Navigation",
    grid: [
      [{ type: 'robot', dir: 'right' }, { type: "gem" }, { type: "wall" }, { type: "star" }, null, null],
      [null, null, null, null, null, null]
    ],
    availableCards: ["MOVE", "IF_GEM", "IF_WALL", "REPEAT", "TURN_LEFT", "TURN_RIGHT"],
    instruction: "Combine conditionals and loops for ultimate control.",
    hint: "A loop can contain multiple IF statements."
  },
  {
    id: 10,
    title: "Level 10: Store It",
    grid: [
      [{ type: 'robot', dir: 'right' }, null, { type: 'gem' }, null, { type: 'star' }, null],
      [null, null, null, null, null, null]
    ],
    availableCards: ["MOVE", "STORE", "USE"],
    instruction: "Gems can tell us distance. Use STORE to remember steps until a gem, then USE it.",
    hint: "Move to the gem, STORE, then move to the star using USE."
  },
  {
    id: 11,
    title: "Level 11: Variable Dash",
    grid: [
      [{ type: 'robot', dir: 'right' }, null, null, { type: 'gem' }, null, { type: 'star' }],
      [null, null, null, null, null, null]
    ],
    availableCards: ["MOVE", "STORE", "USE", "REPEAT"],
    instruction: "Use variables to repeat a precise number of times.",
    hint: "STORE can capture how many steps you've taken."
  },
  {
    id: 12,
    title: "Level 12: Complex Storage",
    grid: [
      [{ type: 'robot', dir: 'right' }, { type: 'gem' }, null, { type: 'gem' }, null, { type: 'star' }],
      [null, null, null, null, null, null]
    ],
    availableCards: ["MOVE", "STORE", "USE"],
    instruction: "Every time you STORE, the previous value is updated.",
    hint: "Think about which value you need to remember last."
  },
  {
    id: 13,
    title: "Level 13: Functions! 🧩",
    grid: [
      [{ type: 'robot', dir: 'right' }, null, null, null, null, null],
      [null, null, null, null, null, { type: 'star' }]
    ],
    availableCards: ["MOVE", "TURN_RIGHT", "TURN_LEFT", "CREATE_BLOCK", "CALL"],
    instruction: "Create your own blocks! Blocks group cards together. Define 'ZIGZAG'.",
    hint: "Create a block with MOVE, TURN, MOVE, TURN back. Then CALL it twice."
  },
  {
    id: 14,
    title: "Level 14: Repeat Blocks",
    grid: [
      [{ type: 'robot', dir: 'right' }, null, null, null, null, null],
      [{ type: 'star' }, null, null, null, null, null]
    ],
    availableCards: ["MOVE", "TURN_RIGHT", "REPEAT", "CREATE_BLOCK", "CALL"],
    instruction: "Loops can call blocks too! This is real programming.",
    hint: "Put a CALL inside a REPEAT loop."
  },
  {
    id: 15,
    title: "Level 15: The Final Challenge",
    grid: [
      [{ type: 'robot', dir: 'right' }, { type: 'gem' }, { type: 'wall' }, { type: 'gem' }, { type: 'wall' }, { type: 'star' }],
      [null, null, null, null, null, null]
    ],
    availableCards: ["MOVE", "REPEAT", "IF_GEM", "IF_WALL", "CREATE_BLOCK", "CALL", "TURN_LEFT", "TURN_RIGHT"],
    instruction: "Use everything you've learned. Sequences, Loops, Conditionals, and Blocks.",
    hint: "Walls block row 0. You'll need to use row 1 to bypass them!"
  }
];
