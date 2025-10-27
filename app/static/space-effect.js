// Эффект пролета мимо символов-звезд "Космос"
class SpaceEffect {
    constructor() {
        this.canvas = document.getElementById('space-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.isActive = false;
        this.animationId = null;
        this.centerX = 0;
        this.centerY = 0;
        
        // Символы для "звезд" - цифры, знаки препинания и английские буквы
        this.chars = '0123456789:.-+*=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        // Пересоздаем звезды при изменении размера
        if (this.isActive) {
            this.initStars();
        }
    }
    
    initStars() {
        this.stars = [];
        const starCount = 150; // Количество звезд
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push(this.createStar());
        }
    }
    
    createStar() {
        // Случайный угол от центра
        const angle = Math.random() * Math.PI * 2;
        
        // Случайное расстояние от центра (начинаем близко к центру)
        const distance = Math.random() * 100;
        
        // Позиция относительно центра
        const x = this.centerX + Math.cos(angle) * distance;
        const y = this.centerY + Math.sin(angle) * distance;
        
        // Скорость движения (будет увеличиваться с расстоянием) - замедлили в 2 раза
        const baseSpeed = 0.5 + Math.random() * 1;
        
        // Случайный символ
        const char = this.chars[Math.floor(Math.random() * this.chars.length)];
        
        return {
            x: x,
            y: y,
            prevX: x,
            prevY: y,
            angle: angle,
            speed: baseSpeed,
            char: char,
            size: 20 + Math.random() * 12 // Размер от 20 до 32px - увеличили
        };
    }
    
    start() {
        this.isActive = true;
        this.initStars();
        this.animate();
    }
    
    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.stars = [];
    }
    
    draw() {
        // Полупрозрачный черный фон для эффекта следа - увеличили прозрачность для лучшей видимости
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            
            // Сохраняем предыдущую позицию для эффекта следа
            star.prevX = star.x;
            star.prevY = star.y;
            
            // Расстояние от центра
            const dx = star.x - this.centerX;
            const dy = star.y - this.centerY;
            const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
            
            // Ускорение с расстоянием - замедлили для лучшей видимости
            const acceleration = 1 + (distanceFromCenter / 500);
            const currentSpeed = star.speed * acceleration;
            
            // Обновляем позицию
            star.x += Math.cos(star.angle) * currentSpeed;
            star.y += Math.sin(star.angle) * currentSpeed;
            
            // Прозрачность зависит от расстояния
            const maxDistance = Math.max(this.canvas.width, this.canvas.height);
            const opacity = Math.max(0, 1 - (distanceFromCenter / maxDistance));
            
            // Рисуем след (линию от предыдущей позиции) - укоротили для лучшей видимости символов
            const trailLength = Math.min(currentSpeed * 2.5, 40);
            const trailX = star.x - Math.cos(star.angle) * trailLength;
            const trailY = star.y - Math.sin(star.angle) * trailLength;
            
            // Градиент для следа
            const gradient = this.ctx.createLinearGradient(trailX, trailY, star.x, star.y);
            gradient.addColorStop(0, `rgba(180, 220, 255, 0)`);
            gradient.addColorStop(1, `rgba(180, 220, 255, ${opacity * 0.8})`);
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 3; // Увеличили толщину следа
            this.ctx.beginPath();
            this.ctx.moveTo(trailX, trailY);
            this.ctx.lineTo(star.x, star.y);
            this.ctx.stroke();
            
            // Рисуем символ с жирным шрифтом для лучшей видимости
            this.ctx.font = `bold ${star.size}px 'Alteran', monospace`;
            this.ctx.fillStyle = `rgba(200, 230, 255, ${opacity})`;
            this.ctx.fillText(star.char, star.x, star.y);
            
            // Если символ вышел за пределы экрана, создаем новый
            if (star.x < -50 || star.x > this.canvas.width + 50 || 
                star.y < -50 || star.y > this.canvas.height + 50) {
                this.stars[i] = this.createStar();
            }
        }
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Экспорт для использования в других скриптах
window.SpaceEffect = SpaceEffect;

