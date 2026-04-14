class TinyCoder {
    constructor() {
        this.currentLevelIdx = this.loadProgress();
        this.attempts = 0;
        this.program = [];
        this.blocks = {};
        this.activeContainerId = null; // ID of REPEAT/IF where new cards go

        this.execution = new GameExecution(
            (update) => this.handleExecutionUpdate(update),
            (status, msg) => this.handleExecutionFinish(status, msg)
        );

        this.ui = new GameUI({
            onAddCard: (type) => this.addCard(type),
            onRemoveCard: (id) => this.removeCard(id),
            onEditCard: (id) => this.editCard(id),
            onRun: () => this.runProgram(),
            onReset: () => this.resetProgram(),
            onHint: () => this.showHint()
        });

        this.loadLevel(this.currentLevelIdx);
    }

    loadProgress() {
        return parseInt(localStorage.getItem('tiny_coder_level') || '0');
    }

    saveProgress(idx) {
        localStorage.setItem('tiny_coder_level', idx.toString());
    }

    loadLevel(idx) {
        this.currentLevelIdx = idx;
        const level = LEVELS[idx];
        this.program = [];
        this.attempts = 0;
        this.ui.renderGrid(level);
        this.ui.renderProgram(this.program);
        this.ui.renderPalette(level.availableCards);
        this.ui.updateStats(this.attempts);
    }

    addCard(type) {
        const id = Math.random().toString(36).substr(2, 9);
        const newCard = { id, type };

        if (['REPEAT', 'IF_GEM', 'IF_WALL'].includes(type)) {
            newCard.children = [];
            newCard.params = { count: 2 };
        }

        if (this.activeContainerId) {
            const container = this.findCardById(this.program, this.activeContainerId);
            if (container && container.children) {
                container.children.push(newCard);
            } else {
                this.program.push(newCard);
            }
        } else {
            this.program.push(newCard);
        }

        // If it's a container, make it the active one automatically
        if (newCard.children) {
            this.activeContainerId = newCard.id;
        }

        this.ui.renderProgram(this.program, null, this.activeContainerId);
    }

    findCardById(cards, id) {
        for (const card of cards) {
            if (card.id === id) return card;
            if (card.children) {
                const found = this.findCardById(card.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    removeCard(id) {
        const removeRecursive = (cards) => {
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
        
        removeRecursive(this.program);
        if (this.activeContainerId === id) this.activeContainerId = null;
        this.ui.renderProgram(this.program, null, this.activeContainerId);
    }

    editCard(id) {
        const card = this.findCardById(this.program, id);
        if (card) {
            if (['REPEAT', 'IF_GEM', 'IF_WALL'].includes(card.type)) {
                if (this.activeContainerId === id) {
                    this.activeContainerId = null; // Toggle out
                } else {
                    this.activeContainerId = id; // Toggle in
                }
            }
            
            if (card.type === 'REPEAT') {
                card.params.count = (card.params.count % 5) + 1;
                if (card.params.count < 2) card.params.count = 2;
            }
        }
        this.ui.renderProgram(this.program, null, this.activeContainerId);
    }

    async runProgram() {
        if (this.execution.isExecuting) return;
        this.attempts++;
        this.ui.updateStats(this.attempts);
        
        // Reset robot to start on UI
        this.ui.renderGrid(LEVELS[this.currentLevelIdx]);
        
        await this.execution.run(this.program, LEVELS[this.currentLevelIdx], this.blocks);
    }

    resetProgram() {
        this.program = [];
        this.ui.renderProgram(this.program);
        this.ui.renderGrid(LEVELS[this.currentLevelIdx]);
    }

    handleExecutionUpdate(update) {
        if (update.type === 'robot_update') {
            this.ui.renderGrid(LEVELS[this.currentLevelIdx], update.state);
        } else if (update.type === 'highlight') {
            this.ui.renderProgram(this.program, update.cardId);
        }
    }

    handleExecutionFinish(status, msg) {
        this.ui.renderProgram(this.program); // Clear highlights
        
        if (status === 'win') {
            this.showWinModal();
        } else {
            this.ui.showModal(`<h3>Try Again!</h3><p>${msg}</p>`);
        }
    }

    showWinModal() {
        const isLastLevel = this.currentLevelIdx === LEVELS.length - 1;
        const nextContent = isLastLevel 
            ? "<h3>Amazing!</h3><p>You've completed all levels and mastered algorithmic thinking!</p><button onclick='location.reload()'>Start Over</button>"
            : `<h3>Success!</h3><p>Level ${LEVELS[this.currentLevelIdx].id} Complete.</p><button id='next-lvl-btn'>Next Level</button>`;
        
        this.ui.showModal(nextContent);
        
        if (!isLastLevel) {
            document.getElementById('next-lvl-btn').onclick = () => {
                this.ui.closeModal();
                this.saveProgress(this.currentLevelIdx + 1);
                this.loadLevel(this.currentLevelIdx + 1);
            };
        }
    }

    showHint() {
        const hint = LEVELS[this.currentLevelIdx].hint;
        this.ui.showModal(`<h3>💡 Hint</h3><p>${hint}</p>`);
    }
}

// Start Game
window.addEventListener('scroll', (e) => e.preventDefault(), { passive: false });
document.addEventListener('DOMContentLoaded', () => {
    window.game = new TinyCoder();
});
