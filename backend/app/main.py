from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import APP_NAME, APP_VERSION
from .database import Base, engine
from .routers import users, categories, tags, tickets

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="API REST de gestion de tickets IT avec suggestion intelligente."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(categories.router)
app.include_router(tags.router)
app.include_router(tickets.router)


@app.get("/")
def root():
    return {"message": "Helpdesk Intelligent API is running"}