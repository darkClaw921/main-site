class VortexEffect {
    constructor() {
        this.canvas = document.getElementById('vortex-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isActive = false;
        this.animationId = null;
        this.particles = [];
        this.angle = 0;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initParticles();
    }

    start() {
        this.isActive = true;
        this.angle = 0;
        this.initParticles();
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

    initParticles() {
        this.particles = [];
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                distance: 50 + Math.random() * 400,
                angle: Math.random() * Math.PI * 2,
                speed: 0.01 + Math.random() * 0.02,
                spiralSpeed: 0.5 + Math.random() * 1,
                char: chars[Math.floor(Math.random() * chars.length)],
                size: 12 + Math.random() * 20,
                opacity: 0.4 + Math.random() * 0.6
            });
        }
    }

    updateParticles() {
        this.angle += 0.005;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        for (const particle of this.particles) {
            // Спиральное движение
            particle.angle += particle.speed;
            particle.distance += particle.spiralSpeed;

            // Возврат к центру при достижении края
            const maxDistance = Math.max(this.canvas.width, this.canvas.height) / 2 + 100;
            if (particle.distance > maxDistance) {
                particle.distance = 50;
                particle.angle = Math.random() * Math.PI * 2;
            }

            // Вычисляем позицию
            particle.x = centerX + Math.cos(particle.angle + this.angle) * particle.distance;
            particle.y = centerY + Math.sin(particle.angle + this.angle) * particle.distance;
        }
    }

    draw() {
        // Полупрозрачная очистка для эффекта следа
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateParticles();

        for (const particle of this.particles) {
            this.ctx.save();

            this.ctx.font = `${particle.size}px Alteran, monospace`;
            this.ctx.fillStyle = `rgba(68, 68, 255, ${particle.opacity})`;
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

window.VortexEffect = VortexEffect;
