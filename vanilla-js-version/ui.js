class GameUI {
    constructor(callbacks) {
        this.callbacks = callbacks; // onAddCard, onRun, onReset, onLevelSelect, onHint
        this.gridContainer = document.getElementById('grid-container');
        this.programList = document.getElementById('program-list');
        this.paletteContainer = document.getElementById('palette-container');
        this.instructionText = document.getElementById('instruction-text');
        this.levelTitle = document.getElementById('level-title');
        this.attemptsText = document.getElementById('attempts');
        this.modal = document.getElementById('modal-container');
        this.modalBody = document.getElementById('modal-body');

        this.initEvents();
    }

    initEvents() {
        document.getElementById('run-btn').addEventListener('click', () => this.callbacks.onRun());
        document.getElementById('reset-btn').addEventListener('click', () => this.callbacks.onReset());
        document.getElementById('hint-btn').addEventListener('click', () => this.callbacks.onHint());
        this.modal.querySelector('.modal-close-btn').addEventListener('click', () => this.closeModal());
    }

    renderGrid(level, robotState = null) {
        this.gridContainer.innerHTML = '';
        level.grid.forEach((row, r) => {
            row.forEach((cell, c) => {
                const el = document.createElement('div');
                el.className = 'cell';
                
                // Content
                if (cell) {
                    if (cell.type === 'star') el.textContent = '★';
                    if (cell.type === 'gem') el.textContent = '💎';
                    if (cell.type === 'wall') el.textContent = '🧱';
                    if (cell.type === 'robot' && !robotState) {
                        this.addRobotToCell(el, cell.dir);
                    }
                }

                // Check if robot is currently here via execution state
                if (robotState && robotState.pos[0] === r && robotState.pos[1] === c) {
                    this.addRobotToCell(el, robotState.dir);
                    el.classList.add('active-robot');
                    if (robotState.collision) el.style.backgroundColor = 'rgba(255, 77, 77, 0.3)';
                    if (robotState.reachedStar) el.style.backgroundColor = 'rgba(0, 255, 136, 0.3)';
                }

                this.gridContainer.appendChild(el);
            });
        });

        this.instructionText.textContent = level.instruction;
        this.levelTitle.textContent = `Level ${level.id}`;
    }

    addRobotToCell(cellEl, dir) {
        const robot = document.createElement('span');
        robot.textContent = '🤖';
        const indicator = document.createElement('div');
        indicator.className = 'robot-indicator';
        
        // Rotate indicator based on direction
        const rotations = { 'up': 0, 'right': 90, 'down': 180, 'left': 270 };
        indicator.style.transform = `translateX(-50%) rotate(${rotations[dir]}deg)`;
        indicator.style.left = '50%';
        indicator.style.top = '-10px';

        cellEl.appendChild(robot);
        cellEl.appendChild(indicator);
    }

    renderProgram(program, highlightedCardId = null, activeContainerId = null) {
        if (program.length === 0) {
            this.programList.innerHTML = '<div class="empty-state">Add cards below to start coding</div>';
            return;
        }

        this.programList.innerHTML = '';
        program.forEach(card => {
            const cardEl = this.createCardElement(card, highlightedCardId, activeContainerId);
            this.programList.appendChild(cardEl);
        });
    }

    createCardElement(card, highlightedCardId, activeContainerId) {
        const el = document.createElement('div');
        el.className = `program-card ${card.id === highlightedCardId ? 'executing' : ''}`;
        if (card.id === activeContainerId) el.classList.add('active-target');
        
        const icon = document.createElement('span');
        icon.className = 'card-icon';
        icon.textContent = this.getCardIcon(card.type);
        
        const label = document.createElement('span');
        label.className = 'card-label';
        label.textContent = card.type.replace('_', ' ');

        if (card.type === 'REPEAT') {
            const stepper = document.createElement('span');
            stepper.className = 'card-stepper';
            stepper.textContent = ` x${card.params?.count || 2}`;
            label.appendChild(stepper);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '×';
        deleteBtn.className = 'delete-card-btn';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            this.callbacks.onRemoveCard(card.id);
        };

        el.appendChild(icon);
        el.appendChild(label);
        el.appendChild(deleteBtn);

        // Nested children (Recursive)
        if (card.children) {
            const container = document.createElement('div');
            container.className = 'nested-container';
            card.children.forEach(child => {
                container.appendChild(this.createCardElement(child, highlightedCardId, activeContainerId));
            });
            
            const outer = document.createElement('div');
            outer.style.display = 'contents';
            outer.appendChild(el);
            outer.appendChild(container);
            
            // To make clicking on REPEAT card work for param editing if needed
            el.onclick = () => this.callbacks.onEditCard(card.id);

            const wrapper = document.createElement('div');
            wrapper.style.marginBottom = '8px';
            wrapper.appendChild(el);
            wrapper.appendChild(container);
            return wrapper;
        }

        el.onclick = () => this.callbacks.onEditCard(card.id);
        return el;
    }

    getCardIcon(type) {
        const icons = {
            'MOVE': '➡️', 'TURN_LEFT': '↪️', 'TURN_RIGHT': '↩️', 'JUMP': '⤴️',
            'REPEAT': '🔁', 'IF_GEM': '💎?', 'IF_WALL': '🧱?', 'STORE': '📦',
            'USE': '🔓', 'CREATE_BLOCK': '🧩', 'CALL': '📞'
        };
        return icons[type] || '❓';
    }

    renderPalette(availableCards) {
        this.paletteContainer.innerHTML = '';
        availableCards.forEach(type => {
            const chip = document.createElement('div');
            chip.className = 'action-chip';
            chip.innerHTML = `<span class="chip-icon">${this.getCardIcon(type)}</span>
                             <span class="chip-label">${type.split('_')[0]}</span>`;
            chip.onclick = () => this.callbacks.onAddCard(type);
            this.paletteContainer.appendChild(chip);
        });
    }

    updateStats(attempts) {
        this.attemptsText.textContent = `Attempts: ${attempts}`;
    }

    showModal(html) {
        this.modalBody.innerHTML = html;
        this.modal.classList.remove('hidden');
    }

    closeModal() {
        this.modal.classList.add('hidden');
    }
}

if (typeof module !== 'undefined') {
    module.exports = GameUI;
}
