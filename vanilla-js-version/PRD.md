Here’s a clear, structured **Product Requirements Document (PRD)** for *Tiny Coder* – a vertical, level‑based mobile web game that teaches algorithmic thinking to absolute beginners.

---

# Tiny Coder – PRD

## 1. Overview
**Tagline:** *Teach a robot to think. One card at a time.*  
**Platform:** Mobile web browser (iOS / Android). No installation.  
**Orientation:** Vertical (portrait), one‑thumb friendly.  
**Target user:** Absolute beginners (age 10+ or anyone new to programming). No prior coding knowledge assumed.  
**Core loop:** Build a sequence of action cards → press RUN → watch robot execute → if goal reached, next level; if not, edit and try again.

## 2. Learning goals (algorithmic concepts)
The game introduces one new concept every 2–3 levels, in this order:

| Level range | Concept | Real‑world programming equivalent |
|-------------|---------|------------------------------------|
| 1–3 | Sequence | Statements in order |
| 4–6 | Loops (repeat a fixed number of times) | `for` or `repeat` loops |
| 7–9 | Conditionals (if gem / if wall) | `if` statements |
| 10–12 | Simple variables (store / use a number) | Variables & assignment |
| 13–15 | Functions (create and call a named block) | Functions / procedures |

**Non‑goals:** No text coding, no real‑time, no scoring penalties for wrong attempts.

## 3. Game mechanics

### 3.1 The world
- **Grid:** 2 rows × 6 columns (fixed size, no scrolling).
- **Cells:** Can contain the robot 🤖, a star ★ (goal), a gem 💎, or a wall 🧱 (impassable).
- **Robot:** Has a direction (up, down, left, right) shown by a small arrow inside the emoji or a separate indicator.

### 3.2 Action cards (available per level)
Each card is a large button (min 60×60px). Cards can be **nested** inside REPEAT or IF cards.

| Card | Icon | Behaviour |
|------|------|-----------|
| MOVE | ➡️ | Move one cell forward (if blocked by wall or edge, fail). |
| TURN LEFT | ↪️ | Rotate robot 90° left. |
| TURN RIGHT | ↩️ | Rotate robot 90° right. |
| JUMP | ⤴️ | Jump over one cell (land on next; fails if landing on wall or out of bounds). |
| REPEAT n | 🔁 | Contains a list of cards. Executes them `n` times (n = 2–5, set via stepper). |
| IF GEM | 💎? | Contains a list of cards. Executes only if robot is on a gem cell. |
| IF WALL | 🧱? | Contains a list of cards. Executes only if the cell in front is a wall. |
| STORE | 📦 | Remembers the number of steps taken since last reset (or a fixed count). |
| USE | 🔓 | Repeats the last stored number of steps (each step = a MOVE action). |
| CREATE BLOCK | 🧩 | Opens a modal to name a new block and define its sequence (max 6 cards). |
| CALL [name] | 📞 | Executes a previously created block. |

> *Only cards relevant to completed levels are shown in the “Add card” palette.*

### 3.3 Program execution
- Programs are executed **top to bottom**.
- Nested cards (inside REPEAT/IF) are executed according to their parent.
- Execution stops if: robot reaches ★ (success), robot hits a wall/edge (fail), or program ends without reaching ★ (fail).
- After fail, robot resets to start; program remains editable.

### 3.4 Level definition (JSON)
```json
{
  "levelId": 5,
  "grid": [
    [{ "type": "robot", "dir": "right" }, null, null, null, { "type": "star" }],
    [null, null, null, null, null]
  ],
  "startPos": [0,0],
  "availableCards": ["MOVE", "REPEAT"],
  "maxRepeat": 4,
  "goalCondition": "robot on star",
  "instruction": "Use REPEAT to move 4 steps."
}
```

## 4. Level progression (detailed examples)

| Lvl | Concept | Grid (start to goal) | Available cards | Solution hint |
|-----|---------|----------------------|----------------|----------------|
| 1 | Sequence | 🤖 → . . . ★ (same row) | MOVE | MOVE, MOVE, MOVE |
| 2 | Sequence + turn | 🤖 → . ↑ ★ (star up) | MOVE, TURN LEFT | MOVE, TURN LEFT, MOVE |
| 4 | Loop | 🤖 → . . . . ★ (5 apart) | MOVE, REPEAT (max 4) | REPEAT 4 [ MOVE ] |
| 7 | Conditional (gem) | 🤖 💎 . ★ | MOVE, IF GEM, JUMP | MOVE, IF GEM [ JUMP ], MOVE |
| 10 | Variable | 🤖 . . 💎 ★ (distance to gem varies each reset) | MOVE, STORE, USE | MOVE until gem → STORE → MOVE, USE |
| 13 | Function | Complex repeating pattern (e.g., turn+move+turn) twice | CREATE BLOCK, CALL, MOVE, TURN | Create block “zigzag”, call it twice |

> *Each level includes a short, friendly text instruction (e.g., “The robot can repeat itself. Use REPEAT to save time.”)*

## 5. UI / Layout (vertical, one thumb)

```
┌────────────────────────────┐
│ ★  Level 7       💡 Hint   │  ← Top bar (status)
│ Attempts: 2                │
├────────────────────────────┤
│                            │
│   🤖  💎  .   ★   .   .    │  ← Grid (2 rows x 6 cols)
│   .   .   .   .   .   .    │    (touch to inspect cell)
│                            │
├────────────────────────────┤
│ Your program:              │
│ ┌──────────────────────┐   │
│ │ [MOVE]               │   │
│ │ [IF GEM]             │   │
│ │   [JUMP]             │   │  ← Program list (cards)
│ │ [REPEAT 2]           │   │    (drag handles ≡ to reorder)
│ │   [MOVE]             │   │
│ └──────────────────────┘   │
├────────────────────────────┤
│ [➕ ADD CARD]  [▶️ RUN]  [🗑️ RESET] │
└────────────────────────────┘
```

**Key interactions:**
- **Tap a card** → edit it (if REPEAT, show number stepper; if IF, show nested area).
- **Drag cards** (using a ≡ handle) to reorder. Drag a card *onto* a REPEAT/IF to nest it.
- **Long‑press** a card → delete or duplicate.
- **ADD CARD** → opens a horizontal palette of available cards (only those unlocked by level).
- **RUN** → animate robot moving card‑by‑card (highlight current card).
- **RESET** → clears entire program (confirmation dialog optional).
- **Hint** → shows a small text tip (costs nothing, encourages learning).

## 6. Technical requirements (frontend only)

### 6.1 Technologies
- HTML5, CSS3 (Flex/Grid), vanilla JavaScript (no frameworks required).
- Canvas **or** DOM elements for grid (DOM is easier for touch events).
- LocalStorage to save progress (level reached).

### 6.2 Performance & compatibility
- Works offline after first load (service worker optional).
- Touch events: `touchstart` (no 300ms delay). Drag & drop via HTML5 drag‑and‑drop **or** simpler: tap to select, tap target position to move (more robust for mobile).
- No external assets – use emojis + CSS arrows for robot direction.

### 6.3 Code structure (suggested)
```
index.html
styles.css
main.js
levels.js (array of level objects)
cards.js (card definitions & execution logic)
render.js (grid + program list UI)
```

### 6.4 Execution engine (pseudocode)
```javascript
function executeProgram(programCards, worldState) {
  for each card in programCards:
    if card.type === "MOVE": tryMove()
    else if card.type === "REPEAT": for i=1 to card.count: executeProgram(card.children, worldState)
    else if card.type === "IF_GEM": if worldState.robotOnGem: executeProgram(card.children)
    // ... etc.
    if worldState.reachedStar: return "win"
    if worldState.collision: return "fail"
  return "fail" if no star reached
}
```

## 7. Success criteria (MVP)
- [ ] 15 complete levels, each introducing one new card.
- [ ] Drag‑and‑drop reordering and nesting works without bugs.
- [ ] Robot animation is clear (moves cell by cell, shows current card).
- [ ] Game saves progress and allows level selection (locked levels are visible but disabled).
- [ ] No crashes on iPhone / Chrome / Samsung Internet.
- [ ] A first‑time user can finish level 3 without external help.

## 8. Out of scope for v1
- Undo button (RESET is enough).
- Sound effects.
- Multiplayer or sharing.
- Custom level editor.
- Variable scope or complex expressions (only “store steps taken”).

## 9. Example level flow (player mental model)

1. **Read** instruction: “Get the star. Use REPEAT so you don’t write MOVE five times.”
2. **Tap ADD CARD** → choose REPEAT → set count to 5 → drag MOVE inside it.
3. **Press RUN** → robot moves 5 steps and reaches star → confetti animation → “Next Level” button appears.
4. If wrong (robot hits wall), program stops, robot resets, player edits cards and runs again.

---

This PRD gives a developer everything needed to build *Tiny Coder* in a few hours. The game is original, fun, and pedagogically sound – perfect for absolute beginners to learn algorithmic thinking by playing.