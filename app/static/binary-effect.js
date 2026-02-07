class BinaryEffect {
    constructor() {
        this.canvas = document.getElementById('binary-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isActive = false;
        this.animationId = null;
        this.columns = [];
        this.columnWidth = 20;
        this.columnCount = 0;

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columnCount = Math.floor(this.canvas.width / this.columnWidth);
        this.initColumns();
    }

    start() {
        this.isActive = true;
        this.initColumns();
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.columns = [];
    }

    initColumns() {
        this.columns = [];
        const rowCount = Math.floor(this.canvas.height / 20);

        for (let i = 0; i < this.columnCount; i++) {
            const column = [];
            for (let j = 0; j < rowCount; j++) {
                column.push({
                    value: Math.random() > 0.5 ? '1' : '0',
                    opacity: Math.random(),
                    lastChange: Date.now() - Math.random() * 1000
                });
            }
            this.columns.push(column);
        }
    }

    updateColumns() {
        const now = Date.now();

        for (let i = 0; i < this.columns.length; i++) {
            const column = this.columns[i];

            for (let j = 0; j < column.length; j++) {
                const cell = column[j];

                // Случайное мигание (быстрое переключение между 0 и 1)
                if (now - cell.lastChange > 50 + Math.random() * 150) {
                    cell.value = Math.random() > 0.5 ? '1' : '0';
                    cell.opacity = 0.3 + Math.random() * 0.7;
                    cell.lastChange = now;
                }
            }
        }
    }

    draw() {
        // Полупрозрачная очистка для эффекта следа
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.updateColumns();

        this.ctx.font = '16px Alteran, monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        for (let i = 0; i < this.columns.length; i++) {
            const column = this.columns[i];
            const x = i * this.columnWidth + this.columnWidth / 2;

            for (let j = 0; j < column.length; j++) {
                const cell = column[j];
                const y = j * 20 + 10;

                this.ctx.save();

                this.ctx.fillStyle = `rgba(0, 255, 0, ${cell.opacity})`;

                // Добавляем свечение для некоторых символов
                if (cell.opacity > 0.7) {
                    this.ctx.shadowColor = '#00ff00';
                    this.ctx.shadowBlur = 10;
                }

                this.ctx.fillText(cell.value, x, y);

                this.ctx.restore();
            }
        }
    }

    animate() {
        if (!this.isActive) return;
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

window.BinaryEffect = BinaryEffect;
