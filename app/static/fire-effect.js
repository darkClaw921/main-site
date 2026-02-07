class FireEffect {
    constructor() {
        this.canvas = document.getElementById('fire-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isActive = false;
        this.animationId = null;
        this.particles = [];
        this.lastGenerationTime = 0;
        this.generationInterval = 30; // мс между генерацией частиц
        this.maxParticles = 300;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.isActive = true;
        this.particles = [];
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
        this.particles = [];
    }

    generateParticles() {
        const now = Date.now();

        if (now - this.lastGenerationTime > this.generationInterval && this.particles.length < this.maxParticles) {
            this.lastGenerationTime = now;

            // Генерируем частицы снизу от часов (центр экрана)
            const clockCenterX = this.canvas.width / 2;
            const clockCenterY = this.canvas.height / 2;
            const clockWidth = this.canvas.width * 0.6;

            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

            for (let i = 0; i < 3; i++) {
                const particle = {
                    x: clockCenterX + (Math.random() - 0.5) * clockWidth,
                    y: clockCenterY + 50,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -2 - Math.random() * 3,
                    size: 10 + Math.random() * 20,
                    life: 0,
                    maxLife: 60 + Math.random() * 40,
                    char: chars[Math.floor(Math.random() * chars.length)]
                };

                this.particles.push(particle);
            }
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // Движение вверх с замедлением
            particle.vy *= 0.98;

            // Турбулентность (случайные отклонения)
            particle.vx += (Math.random() - 0.5) * 0.3;
            particle.vx *= 0.95;

            // Обновление позиции
            particle.x += particle.vx;
            particle.y += particle.vy;

            particle.life++;

            // Удаляем старые частицы
            if (particle.life > particle.maxLife) {
                this.particles.splice(i, 1);
            }
        }
    }

    getParticleColor(particle) {
        const lifeRatio = particle.life / particle.maxLife;

        // Градиент: желтый -> оранжевый -> красный -> затухание
        if (lifeRatio < 0.33) {
            // Желтый -> Оранжевый
            const r = 255;
            const g = Math.floor(255 - lifeRatio * 3 * 153);
            return `rgba(${r}, ${g}, 0, 1)`;
        } else if (lifeRatio < 0.66) {
            // Оранжевый -> Красный
            const r = 255;
            const g = Math.floor(102 - (lifeRatio - 0.33) * 3 * 102);
            return `rgba(${r}, ${g}, 0, 1)`;
        } else {
            // Красный -> Затухание
            const opacity = 1 - (lifeRatio - 0.66) * 3;
            return `rgba(255, 0, 0, ${Math.max(0, opacity)})`;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.generateParticles();
        this.updateParticles();

        // Рисуем частицы
        for (const particle of this.particles) {
            const lifeRatio = particle.life / particle.maxLife;
            const currentSize = particle.size * (1 - lifeRatio * 0.5);

            this.ctx.save();

            this.ctx.font = `${currentSize}px Alteran, monospace`;
            this.ctx.fillStyle = this.getParticleColor(particle);
            this.ctx.shadowColor = '#ffaa00';
            this.ctx.shadowBlur = 15;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            this.ctx.fillText(particle.char, particle.x, particle.y);

            this.ctx.restore();
        }
    }

    animate() {
        if (!this.isActive) return;
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

window.FireEffect = FireEffect;
