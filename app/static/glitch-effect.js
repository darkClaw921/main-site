class GlitchEffect {
    constructor() {
        this.canvas = document.getElementById('glitch-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isActive = false;
        this.animationId = null;
        this.glitchBlocks = [];
        this.lastGlitchTime = 0;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.isActive = true;
        this.glitchBlocks = [];
        this.lastGlitchTime = Date.now();
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.glitchBlocks = [];
    }

    createGlitchBlocks() {
        const now = Date.now();

        // Создаем новые глитч-блоки каждые 100-300мс
        if (now - this.lastGlitchTime > 100 + Math.random() * 200) {
            this.lastGlitchTime = now;

            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            const blockCount = 5 + Math.floor(Math.random() * 10);

            for (let i = 0; i < blockCount; i++) {
                this.glitchBlocks.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    width: 50 + Math.random() * 150,
                    height: 20 + Math.random() * 60,
                    offsetX: (Math.random() - 0.5) * 20,
                    char: chars[Math.floor(Math.random() * chars.length)],
                    life: 0,
                    maxLife: 5 + Math.floor(Math.random() * 10),
                    color: Math.random() > 0.5 ? 'red' : 'cyan'
                });
            }
        }

        // Обновляем и удаляем старые блоки
        for (let i = this.glitchBlocks.length - 1; i >= 0; i--) {
            const block = this.glitchBlocks[i];
            block.life++;

            if (block.life > block.maxLife) {
                this.glitchBlocks.splice(i, 1);
            }
        }

        // Ограничиваем количество блоков
        if (this.glitchBlocks.length > 50) {
            this.glitchBlocks = this.glitchBlocks.slice(-50);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.createGlitchBlocks();

        for (const block of this.glitchBlocks) {
            this.ctx.save();

            const opacity = 1 - (block.life / block.maxLife);

            if (block.color === 'red') {
                this.ctx.fillStyle = `rgba(255, 0, 0, ${opacity * 0.6})`;
            } else {
                this.ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.6})`;
            }

            // Рисуем глитч-блоки
            this.ctx.fillRect(
                block.x + block.offsetX,
                block.y,
                block.width,
                block.height
            );

            // Рисуем символы в блоке
            this.ctx.font = '20px Alteran, monospace';
            this.ctx.fillStyle = block.color === 'red'
                ? `rgba(255, 0, 0, ${opacity})`
                : `rgba(0, 255, 255, ${opacity})`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            const charCount = Math.floor(block.width / 20);
            for (let i = 0; i < charCount; i++) {
                this.ctx.fillText(
                    block.char,
                    block.x + block.offsetX + i * 20 + 10,
                    block.y + block.height / 2
                );
            }

            this.ctx.restore();
        }
    }

    animate() {
        if (!this.isActive) return;
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

window.GlitchEffect = GlitchEffect;
