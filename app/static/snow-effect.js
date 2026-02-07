class SnowEffect {
    constructor() {
        this.canvas = document.getElementById('snow-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isActive = false;
        this.animationId = null;
        this.snowflakes = [];

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initSnowflakes();
    }

    start() {
        this.isActive = true;
        this.initSnowflakes();
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.snowflakes = [];
    }

    initSnowflakes() {
        this.snowflakes = [];
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const snowflakeCount = 60;

        for (let i = 0; i < snowflakeCount; i++) {
            this.snowflakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                char: chars[Math.floor(Math.random() * chars.length)],
                size: 10 + Math.random() * 25,
                speed: 0.3 + Math.random() * 1.2,
                swing: Math.random() * Math.PI * 2,
                swingSpeed: 0.02 + Math.random() * 0.03,
                swingAmplitude: 20 + Math.random() * 30,
                opacity: 0.5 + Math.random() * 0.5
            });
        }
    }

    updateSnowflakes() {
        for (const flake of this.snowflakes) {
            // Падение вниз
            flake.y += flake.speed;

            // Покачивание из стороны в сторону
            flake.swing += flake.swingSpeed;
            flake.x += Math.sin(flake.swing) * 0.5;

            // Возврат наверх при достижении низа
            if (flake.y > this.canvas.height + 50) {
                flake.y = -50;
                flake.x = Math.random() * this.canvas.width;
            }

            // Wrap around по горизонтали
            if (flake.x < -50) flake.x = this.canvas.width + 50;
            if (flake.x > this.canvas.width + 50) flake.x = -50;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateSnowflakes();

        for (const flake of this.snowflakes) {
            this.ctx.save();

            this.ctx.font = `${flake.size}px Alteran, monospace`;
            this.ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            // Легкое свечение
            this.ctx.shadowColor = '#ffffff';
            this.ctx.shadowBlur = 5;

            this.ctx.fillText(flake.char, flake.x, flake.y);

            this.ctx.restore();
        }
    }

    animate() {
        if (!this.isActive) return;
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

window.SnowEffect = SnowEffect;
