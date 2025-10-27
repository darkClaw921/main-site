// Эффект падающих символов "Матрица"
class MatrixEffect {
    constructor() {
        this.canvas = document.getElementById('matrix-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.columns = [];
        this.isActive = false;
        this.animationId = null;
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Символы для падения (цифры и некоторые спецсимволы)
        this.chars = '0123456789:.-+*='.split('');
        
        // Размер шрифта и количество колонок
        this.fontSize = 16;
        this.columnCount = Math.floor(this.canvas.width / this.fontSize);
        
        // Инициализация колонок
        this.columns = Array(this.columnCount).fill(1);
    }
    
    start() {
        this.isActive = true;
        this.animate();
    }
    
    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        // Очистка canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    draw() {
        // Полупрозрачный черный фон для эффекта следа
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Зеленый цвет для символов
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = `${this.fontSize}px 'Alteran', monospace`;
        
        // Рисуем символы
        for (let i = 0; i < this.columns.length; i++) {
            const char = this.chars[Math.floor(Math.random() * this.chars.length)];
            const x = i * this.fontSize;
            const y = this.columns[i] * this.fontSize;
            
            this.ctx.fillText(char, x, y);
            
            // Случайным образом сбрасываем колонку в начало
            if (y > this.canvas.height && Math.random() > 0.975) {
                this.columns[i] = 0;
            }
            
            this.columns[i]++;
        }
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Экспорт для использования в других скриптах
window.MatrixEffect = MatrixEffect;

