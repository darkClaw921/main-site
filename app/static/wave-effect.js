class WaveEffect {
    constructor() {
        this.canvas = document.getElementById('wave-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isActive = false;
        this.animationId = null;
        this.particles = [];
        this.time = 0;

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
        this.time = 0;
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
        const particleCount = 80;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                baseY: Math.random() * this.canvas.height,
                char: chars[Math.floor(Math.random() * chars.length)],
                size: 15 + Math.random() * 25,
                speed: 0.5 + Math.random() * 1.5,
                waveOffset: Math.random() * Math.PI * 2,
                opacity: 0.3 + Math.random() * 0.7
            });
        }
    }

    updateParticles() {
        this.time += 0.02;

        for (const particle of this.particles) {
            // Вертикальная волна
            particle.y = particle.baseY + Math.sin(this.time + particle.waveOffset) * 50;

            // Горизонтальная волна
            particle.x += Math.sin(this.time * particle.speed + particle.waveOffset) * 2;

            // Wrap around
            if (particle.x < -50) particle.x = this.canvas.width + 50;
            if (particle.x > this.canvas.width + 50) particle.x = -50;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateParticles();

        for (const particle of this.particles) {
            this.ctx.save();

            this.ctx.font = `${particle.size}px Alteran, monospace`;
            this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
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

window.WaveEffect = WaveEffect;
