class GameExecution {
    constructor(onUpdate, onFinish) {
        this.onUpdate = onUpdate; // Callback for UI updates (e.g. robot moved, card highlight)
        this.onFinish = onFinish; // Callback for game end (win/fail)
        this.isExecuting = false;
        this.storedValue = 0;
        this.stepsCounter = 0;
        this.blocks = {}; // User-defined blocks
    }

    async run(program, levelData, blocks = {}) {
        if (this.isExecuting) return;
        this.isExecuting = true;
        this.blocks = blocks;
        this.stepsCounter = 0;

        const startPos = levelData.startPos || this.findRobot(levelData.grid);
        const startCell = levelData.grid[startPos[0]][startPos[1]];
        
        const state = {
            pos: [...startPos],
            dir: startCell ? startCell.dir : 'right',
            grid: JSON.parse(JSON.stringify(levelData.grid)), // Clone grid
            reachedStar: false,
            collision: false
        };

        try {
            const result = await this.executeBlock(program, state);
            
            if (state.reachedStar) {
                this.onFinish('win');
            } else {
                this.onFinish('fail', state.collision ? 'Ouch! You hit something.' : 'Goal not reached.');
            }
        } catch (e) {
            console.error("Execution error:", e);
            this.onFinish('fail', 'An error occurred during execution.');
        } finally {
            this.isExecuting = false;
        }
    }

    async executeBlock(cards, state) {
        for (const card of cards) {
            if (!this.isExecuting || state.reachedStar || state.collision) break;
            
            this.onUpdate({ type: 'highlight', cardId: card.id });
            await new Promise(r => setTimeout(r, 600)); // Animation delay

            await this.executeCard(card, state);
            
            if (state.reachedStar || state.collision) break;
        }
    }

    async executeCard(card, state) {
        switch (card.type) {
            case 'MOVE':
                await this.moveRobot(state);
                break;
            case 'TURN_LEFT':
                state.dir = this.rotate(state.dir, -90);
                this.onUpdate({ type: 'robot_update', state });
                break;
            case 'TURN_RIGHT':
                state.dir = this.rotate(state.dir, 90);
                this.onUpdate({ type: 'robot_update', state });
                break;
            case 'JUMP':
                await this.moveRobot(state, 2);
                break;
            case 'REPEAT':
                const count = card.params?.count || 2;
                for (let i = 0; i < count; i++) {
                    if (state.reachedStar || state.collision) break;
                    await this.executeBlock(card.children || [], state);
                }
                break;
            case 'IF_GEM':
                if (this.isOnItem(state, 'gem')) {
                    await this.executeBlock(card.children || [], state);
                }
                break;
            case 'IF_WALL':
                if (this.isWallInFront(state)) {
                    await this.executeBlock(card.children || [], state);
                }
                break;
            case 'STORE':
                this.storedValue = this.stepsCounter;
                break;
            case 'USE':
                for (let i = 0; i < this.storedValue; i++) {
                    if (state.reachedStar || state.collision) break;
                    await this.moveRobot(state);
                }
                break;
            case 'CALL':
                const blockName = card.params?.blockName;
                if (this.blocks[blockName]) {
                    await this.executeBlock(this.blocks[blockName], state);
                }
                break;
        }
    }

    async moveRobot(state, distance = 1) {
        for (let i = 0; i < distance; i++) {
            const nextPos = this.getNextPos(state.pos, state.dir);
            
            if (this.isOutOfBounds(nextPos, state.grid) || this.isWall(nextPos, state.grid)) {
                state.collision = true;
                this.onUpdate({ type: 'robot_update', state });
                return;
            }

            state.pos = nextPos;
            this.stepsCounter++;
            
            if (this.isOnItem(state, 'star')) {
                state.reachedStar = true;
            }

            this.onUpdate({ type: 'robot_update', state });
            await new Promise(r => setTimeout(r, 400));
            
            if (state.reachedStar) break;
        }
    }

    rotate(currentDir, angle) {
        const dirs = ['up', 'right', 'down', 'left'];
        let idx = dirs.indexOf(currentDir);
        idx = (idx + (angle / 90)) % 4;
        if (idx < 0) idx += 4;
        return dirs[idx];
    }

    getNextPos(pos, dir) {
        const [r, c] = pos;
        if (dir === 'up') return [r - 1, c];
        if (dir === 'down') return [r + 1, c];
        if (dir === 'left') return [r, c - 1];
        if (dir === 'right') return [r, c + 1];
        return pos;
    }

    isOutOfBounds(pos, grid) {
        const [r, c] = pos;
        return r < 0 || r >= grid.length || c < 0 || c >= grid[0].length;
    }

    isWall(pos, grid) {
        return grid[pos[0]][pos[1]]?.type === 'wall';
    }

    isWallInFront(state) {
        const nextPos = this.getNextPos(state.pos, state.dir);
        return this.isOutOfBounds(nextPos, state.grid) || this.isWall(nextPos, state.grid);
    }

    isOnItem(state, type) {
        const cell = state.grid[state.pos[0]][state.pos[1]];
        return cell?.type === type;
    }

    findRobot(grid) {
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                if (grid[r][c]?.type === 'robot') return [r, c];
            }
        }
        return [0, 0];
    }

    stop() {
        this.isExecuting = false;
    }
}

if (typeof module !== 'undefined') {
    module.exports = GameExecution;
}
