from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from loguru import logger
from pathlib import Path

# Инициализация приложения
app = FastAPI(title="Clock Display")

# Настройка путей
BASE_DIR = Path(__file__).resolve().parent
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# Настройка логирования
logger.add("app.log", rotation="10 MB", level="INFO")


@app.on_event("startup")
async def startup_event():
    logger.info("Приложение запущено")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Приложение остановлено")


@app.get("/", response_class=HTMLResponse)
async def get_clock(request: Request):
    """
    Главная страница с отображением часов
    """
    logger.info("Запрос главной страницы")
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/health")
async def health_check():
    """
    Эндпоинт для проверки здоровья приложения
    """
    return {"status": "healthy"}

