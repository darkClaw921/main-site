class LightningEffect {
    constructor() {
        this.canvas = document.getElementById('lightning-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isActive = false;
        this.animationId = null;
        this.bolts = [];
        this.particles = [];
        this.lastBoltTime = 0;

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
        this.bolts = [];
        this.lastBoltTime = Date.now();
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
        this.bolts = [];
        this.particles = [];
    }

    initParticles() {
        this.particles = [];
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        const particleCount = 40;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                char: chars[Math.floor(Math.random() * chars.length)],
                size: 12 + Math.random() * 18,
                opacity: 0.3 + Math.random() * 0.4
            });
        }
    }

    createLightningBolt() {
        const now = Date.now();

        // Создаем молнии каждые 300-800мс
        if (now - this.lastBoltTime > 300 + Math.random() * 500) {
            this.lastBoltTime = now;

            // Выбираем две случайные частицы для соединения молнией
            if (this.particles.length >= 2) {
                const p1 = this.particles[Math.floor(Math.random() * this.particles.length)];
                const p2 = this.particles[Math.floor(Math.random() * this.particles.length)];

                if (p1 !== p2) {
                    this.bolts.push({
                        x1: p1.x,
                        y1: p1.y,
                        x2: p2.x,
                        y2: p2.y,
                        segments: this.generateBoltSegments(p1.x, p1.y, p2.x, p2.y),
                        life: 0,
                        maxLife: 10,
                        opacity: 1
                    });
                }
            }
        }

        // Обновляем молнии
        for (let i = this.bolts.length - 1; i >= 0; i--) {
            const bolt = this.bolts[i];
            bolt.life++;
            bolt.opacity = 1 - (bolt.life / bolt.maxLife);

            if (bolt.life > bolt.maxLife) {
                this.bolts.splice(i, 1);
            }
        }
    }

    generateBoltSegments(x1, y1, x2, y2) {
        const segments = [];
        const segmentCount = 8;

        for (let i = 0; i <= segmentCount; i++) {
            const t = i / segmentCount;
            const x = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 30;
            const y = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 30;
            segments.push({ x, y });
        }

        return segments;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.createLightningBolt();

        // Рисуем молнии
        for (const bolt of this.bolts) {
            this.ctx.save();

            this.ctx.strokeStyle = `rgba(255, 255, 0, ${bolt.opacity})`;
            this.ctx.lineWidth = 2;
            this.ctx.shadowColor = '#ffff00';
            this.ctx.shadowBlur = 15;

            this.ctx.beginPath();
            this.ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y);

            for (let i = 1; i < bolt.segments.length; i++) {
                this.ctx.lineTo(bolt.segments[i].x, bolt.segments[i].y);
            }

            this.ctx.stroke();

            this.ctx.restore();
        }

        // Рисуем фоновые частицы
        for (const particle of this.particles) {
            this.ctx.save();

            this.ctx.font = `${particle.size}px Alteran, monospace`;
            this.ctx.fillStyle = `rgba(255, 255, 0, ${particle.opacity})`;
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

window.LightningEffect = LightningEffect;
