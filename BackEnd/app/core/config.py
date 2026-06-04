import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import cloudinary

# 1. Carrega as variáveis do arquivo .env
load_dotenv()

# 2. Configurações do Banco de Dados (PostgreSQL)
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

# O SessionLocal será usado para criar uma "sessão" a cada requisição à API
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# A Base será usada pelos nossos Models (User, Post, etc) para criar as tabelas
Base = declarative_base()

# 3. Configurações do Cloudinary (Upload de Imagens)
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# 4. Outras Configurações Globais
SECRET_KEY = os.getenv("SECRET_KEY")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

# Dependência para obter o banco de dados nas rotas
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()