import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/helpdesk")
APP_NAME = os.getenv("APP_NAME", "Helpdesk Intelligent API")
APP_VERSION = os.getenv("APP_VERSION", "1.0.0")