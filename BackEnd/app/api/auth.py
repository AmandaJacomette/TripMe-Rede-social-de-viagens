import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from app.core.config import get_db, SECRET_KEY
from app.models.domain import User
from app.schemas.auth_schema import UserCreate, UserResponse, UserLogin, Token

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ==========================================
# CONFIGURAÇÕES DE SEGURANÇA
# ==========================================
# Criptografia de senhas usando Bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configuração do Token
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # Token dura 7 dias

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # Cria o token combinando os dados, a chave secreta do .env e o algoritmo
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# ==========================================
# ROTAS (ENDPOINTS)
# ==========================================

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Rota para o Angular enviar os dados do novo usuário e criar a conta"""
    
    # 1. Verifica se o email já existe no banco
    user_exists = db.query(User).filter(User.email == user.email).first()
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Este e-mail já está em uso."
        )

    # 2. Criptografa a senha antes de salvar
    hashed_pw = get_password_hash(user.password)
    
    # 3. Cria o objeto do usuário (mapeando para o SQLAlchemy)
    new_user = User(
        id=str(uuid.uuid4()),
        name=user.name,
        username=user.username,
        email=user.email,
        profile_pic=user.profile_pic,
        bio=user.bio,
        hashed_password=hashed_pw
    )
    
    # 4. Salva no banco de dados
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Rota para o Angular enviar e-mail e senha e receber o Token de acesso"""
    
    # 1. Busca o usuário pelo e-mail
    user = db.query(User).filter(User.email == user_credentials.email).first()
    
    # 2. Verifica se o usuário existe e se a senha digitada bate com a do banco
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 3. Gera o token de acesso escondendo o ID do usuário lá dentro ("sub" = subject)
    access_token = create_access_token(data={"sub": user.id})
    
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Token inválido")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return user

@router.get("/users/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user