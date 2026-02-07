class BounceEffect {
    constructor() {
        this.canvas = document.getElementById('bounce-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isActive = false;
        this.animationId = null;
        this.particles = [];

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start(timeString = '00:00:00:000') {
        this.isActive = true;
        this.initParticles(timeString);
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

    initParticles(timeString) {
        this.particles = [];
        const chars = timeString.split('');

        for (let i = 0; i < chars.length; i++) {
            const particle = {
                char: chars[i],
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: 60 + Math.random() * 40,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1
            };
            this.particles.push(particle);
        }
    }

    updateTime(timeString) {
        const chars = timeString.split('');
        for (let i = 0; i < this.particles.length && i < chars.length; i++) {
            this.particles[i].char = chars[i];
        }
    }

    updateParticles() {
        for (const particle of this.particles) {
            // Обновление позиции
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Обновление вращения
            particle.rotation += particle.rotationSpeed;

            // Проверка границ и отскок
            this.checkBoundaryCollision(particle);

            // Затухание скорости
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Минимальная скорость для предотвращения остановки
            const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
            if (speed < 0.5) {
                const angle = Math.random() * Math.PI * 2;
                particle.vx = Math.cos(angle) * 0.5;
                particle.vy = Math.sin(angle) * 0.5;
            }
        }
    }

    checkBoundaryCollision(particle) {
        const margin = particle.size / 2;
        const elasticity = 0.85;

        // Левая и правая границы
        if (particle.x - margin < 0) {
            particle.x = margin;
            particle.vx = Math.abs(particle.vx) * elasticity;
        } else if (particle.x + margin > this.canvas.width) {
            particle.x = this.canvas.width - margin;
            particle.vx = -Math.abs(particle.vx) * elasticity;
        }

        // Верхняя и нижняя границы
        if (particle.y - margin < 0) {
            particle.y = margin;
            particle.vy = Math.abs(particle.vy) * elasticity;
        } else if (particle.y + margin > this.canvas.height) {
            particle.y = this.canvas.height - margin;
            particle.vy = -Math.abs(particle.vy) * elasticity;
        }
    }

    draw() {
        // Полупрозрачная очистка для эффекта следа
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateParticles();

        // Рисуем частицы
        for (const particle of this.particles) {
            this.ctx.save();

            // Перемещаемся к позиции частицы
            this.ctx.translate(particle.x, particle.y);

            // Применяем вращение
            this.ctx.rotate(particle.rotation);

            // Настраиваем стиль
            this.ctx.font = `${particle.size}px Alteran, monospace`;
            this.ctx.fillStyle = '#ff8800';
            this.ctx.shadowColor = '#ff8800';
            this.ctx.shadowBlur = 20;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            // Рисуем символ
            this.ctx.fillText(particle.char, 0, 0);

            this.ctx.restore();
        }
    }

    animate() {
        if (!this.isActive) return;
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

window.BounceEffect = BounceEffect;
