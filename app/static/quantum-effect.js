class QuantumEffect {
    constructor() {
        this.canvas = document.getElementById('quantum-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isActive = false;
        this.animationId = null;
        this.quantumStates = [];
        this.flashes = [];
        this.positionUpdateInterval = null;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initQuantumStates();
    }

    start() {
        this.isActive = true;
        this.initQuantumStates();
        this.startPositionUpdates();
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.positionUpdateInterval) {
            clearInterval(this.positionUpdateInterval);
            this.positionUpdateInterval = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.quantumStates = [];
        this.flashes = [];
    }

    initQuantumStates() {
        // Получаем текущее время для определения количества символов
        const timeString = document.getElementById('clock')?.textContent || '00:00:00:000';
        const chars = timeString.split('');

        this.quantumStates = [];

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const charSpacing = 60; // примерное расстояние между символами
        const startX = centerX - (chars.length * charSpacing) / 2;

        for (let i = 0; i < chars.length; i++) {
            const baseX = startX + i * charSpacing;
            const baseY = centerY;

            // Создаем 3-5 позиций для каждого символа (эффект суперпозиции)
            const positionCount = 3 + Math.floor(Math.random() * 3);
            const positions = [];

            for (let j = 0; j < positionCount; j++) {
                // Основная позиция в центре, призрачные - разбросаны по всему экрану
                if (j === 0) {
                    positions.push({
                        x: baseX,
                        y: baseY,
                        opacity: 1,
                        isPrimary: true
                    });
                } else {
                    positions.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        opacity: 0.2 + Math.random() * 0.3,
                        isPrimary: false
                    });
                }
            }

            this.quantumStates.push({
                char: chars[i],
                positions: positions,
                brightness: 1
            });
        }
    }

    startPositionUpdates() {
        // Обновляем позиции каждые 50-100мс
        this.positionUpdateInterval = setInterval(() => {
            if (!this.isActive) return;

            for (const state of this.quantumStates) {
                // Случайно перемещаем призрачные копии
                for (let i = 1; i < state.positions.length; i++) {
                    const pos = state.positions[i];
                    pos.x += (Math.random() - 0.5) * 50;
                    pos.y += (Math.random() - 0.5) * 50;

                    // Держим призрачные копии в пределах экрана
                    if (pos.x < 0) pos.x = this.canvas.width;
                    if (pos.x > this.canvas.width) pos.x = 0;
                    if (pos.y < 0) pos.y = this.canvas.height;
                    if (pos.y > this.canvas.height) pos.y = 0;
                }

                // Мерцание яркости основной копии
                state.brightness = 0.8 + Math.random() * 0.4;
            }

            // Иногда создаем вспышки
            if (Math.random() < 0.1) {
                this.createFlash();
            }
        }, 75);
    }

    createFlash() {
        if (this.quantumStates.length < 2) return;

        // Выбираем две случайные позиции для вспышки
        const state1 = this.quantumStates[Math.floor(Math.random() * this.quantumStates.length)];
        const state2 = this.quantumStates[Math.floor(Math.random() * this.quantumStates.length)];

        if (state1 === state2) return;

        const pos1 = state1.positions[0];
        const pos2 = state2.positions[0];

        this.flashes.push({
            x1: pos1.x,
            y1: pos1.y,
            x2: pos2.x,
            y2: pos2.y,
            opacity: 1,
            life: 0,
            maxLife: 20
        });
    }

    updateFlashes() {
        for (let i = this.flashes.length - 1; i >= 0; i--) {
            const flash = this.flashes[i];
            flash.life++;
            flash.opacity = 1 - (flash.life / flash.maxLife);

            if (flash.life > flash.maxLife) {
                this.flashes.splice(i, 1);
            }
        }
    }

    drawQuantumStates() {
        for (const state of this.quantumStates) {
            // Рисуем все позиции (призрачные копии)
            for (let i = state.positions.length - 1; i >= 0; i--) {
                const pos = state.positions[i];

                this.ctx.save();

                const brightness = pos.isPrimary ? state.brightness : 1;
                const opacity = pos.opacity * brightness;

                this.ctx.font = '60px Alteran, monospace';
                this.ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`;

                if (pos.isPrimary) {
                    this.ctx.shadowColor = '#00ffff';
                    this.ctx.shadowBlur = 20;
                }

                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';

                this.ctx.fillText(state.char, pos.x, pos.y);

                this.ctx.restore();
            }
        }
    }

    drawFlashes() {
        for (const flash of this.flashes) {
            this.ctx.save();

            this.ctx.strokeStyle = `rgba(255, 255, 255, ${flash.opacity})`;
            this.ctx.lineWidth = 2;
            this.ctx.shadowColor = '#ffffff';
            this.ctx.shadowBlur = 10;

            this.ctx.beginPath();
            this.ctx.moveTo(flash.x1, flash.y1);
            this.ctx.lineTo(flash.x2, flash.y2);
            this.ctx.stroke();

            this.ctx.restore();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateFlashes();
        this.drawQuantumStates();
        this.drawFlashes();
    }

    animate() {
        if (!this.isActive) return;
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

window.QuantumEffect = QuantumEffect;
