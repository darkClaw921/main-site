class PulseEffect {
    constructor() {
        this.canvas = document.getElementById('pulse-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isActive = false;
        this.animationId = null;
        this.waves = [];
        this.particles = [];
        this.lastSecond = -1;

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
        this.waves = [];
        this.lastSecond = new Date().getSeconds();
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
        this.waves = [];
        this.particles = [];
    }

    initParticles() {
        this.particles = [];
        const particleCount = 30; // Уменьшено с 50 до 30
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: 2 + Math.random() * 3,
                baseSize: 2 + Math.random() * 3,
                brightness: 0.5 + Math.random() * 0.5,
                char: chars[Math.floor(Math.random() * chars.length)] // Предгенерируем символ
            });
        }
    }

    checkSecondChange() {
        const currentSecond = new Date().getSeconds();

        if (currentSecond !== this.lastSecond) {
            this.lastSecond = currentSecond;

            // Ограничиваем количество волн до 5
            if (this.waves.length >= 5) {
                this.waves.shift(); // Удаляем самую старую волну
            }

            // Создаем новую волну от центра
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            this.waves.push({
                radius: 0,
                opacity: 1,
                birthTime: Date.now(),
                symbols: [] // Будем кешировать символы для этой волны
            });
        }
    }

    updateWaves() {
        const waveSpeed = 5; // Увеличено с 3 до 5 для более быстрого исчезновения
        const maxRadius = Math.max(this.canvas.width, this.canvas.height);

        for (let i = this.waves.length - 1; i >= 0; i--) {
            const wave = this.waves[i];

            wave.radius += waveSpeed;
            wave.opacity = 1 - (wave.radius / maxRadius);

            // Удаляем волны, достигшие края или с низкой прозрачностью
            if (wave.radius > maxRadius || wave.opacity < 0.1) {
                this.waves.splice(i, 1);
            }
        }
    }

    updateParticles() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        for (const particle of this.particles) {
            // Дрейф частиц
            particle.x += particle.vx;
            particle.y += particle.vy;

            // Границы экрана (wrap around)
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Эффект колебания от волн
            let waveEffect = 0;
            for (const wave of this.waves) {
                const dx = particle.x - centerX;
                const dy = particle.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Если частица близка к волне
                const waveDiff = Math.abs(distance - wave.radius);
                if (waveDiff < 30) {
                    waveEffect = Math.max(waveEffect, (1 - waveDiff / 30) * wave.opacity);
                }
            }

            // Изменяем размер частицы при прохождении волны
            particle.size = particle.baseSize * (1 + waveEffect * 2);
        }
    }

    drawWaves() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        for (const wave of this.waves) {
            // Пропускаем волны с очень низкой прозрачностью
            if (wave.opacity < 0.1) continue;

            this.ctx.save();

            // Ограничиваем максимальное количество символов до 60
            const symbolCount = Math.min(60, Math.max(20, Math.floor(wave.radius / 20)));
            const angleStep = (Math.PI * 2) / symbolCount;

            // Генерируем символы только один раз для этой волны
            if (wave.symbols.length !== symbolCount) {
                wave.symbols = [];
                for (let i = 0; i < symbolCount; i++) {
                    wave.symbols.push(chars[Math.floor(Math.random() * chars.length)]);
                }
            }

            this.ctx.font = '12px Alteran, monospace';
            this.ctx.fillStyle = `rgba(170, 0, 255, ${wave.opacity})`;
            // Убираем shadow для оптимизации
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            // Рисуем символы по окружности
            for (let i = 0; i < symbolCount; i++) {
                const angle = i * angleStep;
                const x = centerX + Math.cos(angle) * wave.radius;
                const y = centerY + Math.sin(angle) * wave.radius;

                this.ctx.fillText(wave.symbols[i], x, y);
            }

            this.ctx.restore();
        }
    }

    drawParticles() {
        for (const particle of this.particles) {
            this.ctx.save();

            this.ctx.font = `${particle.size * 3}px Alteran, monospace`;
            this.ctx.fillStyle = `rgba(255, 0, 255, ${particle.brightness})`;
            // Убираем shadow для оптимизации
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            this.ctx.fillText(particle.char, particle.x, particle.y);

            this.ctx.restore();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.checkSecondChange();
        this.updateWaves();
        this.updateParticles();

        this.drawWaves();
        this.drawParticles();
    }

    animate() {
        if (!this.isActive) return;
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

window.PulseEffect = PulseEffect;
