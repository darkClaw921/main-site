"""
Скрипт для запуска приложения
"""
import uvicorn
from loguru import logger

if __name__ == "__main__":
    logger.info("Запуск веб-приложения Clock Display")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

