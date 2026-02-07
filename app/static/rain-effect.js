class RainEffect {
    constructor() {
        this.canvas = document.getElementById('rain-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isActive = false;
        this.animationId = null;
        this.drops = [];
        this.lastGenerationTime = 0;
        this.generationInterval = 50; // мс между генерацией капель
        this.maxDrops = 200;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.isActive = true;
        this.drops = [];
        this.lastGenerationTime = Date.now();
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drops = [];
    }

    generateDrops() {
        const now = Date.now();
        const currentSecond = new Date().getSeconds();

        // Интенсивность зависит от текущей секунды
        const intensity = Math.floor(currentSecond / 10) + 1;

        if (now - this.lastGenerationTime > this.generationInterval / intensity && this.drops.length < this.maxDrops) {
            this.lastGenerationTime = now;

            // Генерируем капли от позиции часов (центр экрана)
            const clockCenterX = this.canvas.width / 2;
            const clockCenterY = this.canvas.height / 2;
            const clockWidth = this.canvas.width * 0.6; // примерная ширина часов

            const chars = '0123456789:';
            const drop = {
                x: clockCenterX + (Math.random() - 0.5) * clockWidth,
                y: clockCenterY - 50 + Math.random() * 100,
                vy: 0,
                size: 20 + Math.random() * 20,
                opacity: 1,
                life: 0,
                maxLife: 100,
                char: chars[Math.floor(Math.random() * chars.length)]
            };

            this.drops.push(drop);
        }
    }

    updateDrops() {
        const gravity = 0.3;
        const maxVelocity = 8;

        for (let i = this.drops.length - 1; i >= 0; i--) {
            const drop = this.drops[i];

            // Применяем гравитацию
            drop.vy += gravity;
            if (drop.vy > maxVelocity) {
                drop.vy = maxVelocity;
            }

            // Обновляем позицию
            drop.y += drop.vy;
            drop.life++;

            // Затухание прозрачности к концу жизни
            drop.opacity = 1 - (drop.life / drop.maxLife);

            // Удаляем капли за границей или с истекшим временем жизни
            if (drop.y > this.canvas.height || drop.life > drop.maxLife) {
                this.drops.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.generateDrops();
        this.updateDrops();

        // Рисуем капли
        for (const drop of this.drops) {
            this.ctx.save();

            this.ctx.font = `${drop.size}px Alteran, monospace`;
            this.ctx.fillStyle = `rgba(0, 204, 255, ${drop.opacity})`;
            this.ctx.shadowColor = '#00ccff';
            this.ctx.shadowBlur = 10;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            this.ctx.fillText(drop.char, drop.x, drop.y);

            this.ctx.restore();
        }
    }

    animate() {
        if (!this.isActive) return;
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

window.RainEffect = RainEffect;
