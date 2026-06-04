import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

# Segurança e Autenticação
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from app.core.config import get_db, SECRET_KEY
from app.models.domain import Post, Photo, User
from app.schemas.post_schema import PostCreate, PostResponse

router = APIRouter()

# ==========================================
# DEPENDÊNCIA DE AUTENTICAÇÃO (VERIFICA O TOKEN)
# ==========================================
# Avisa ao FastAPI onde o Angular faz o login para pegar o token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")
ALGORITHM = "HS256"

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Verifica se o token enviado pelo Angular é válido e retorna o usuário dono dele"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais (Token inválido ou expirado)",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Tenta abrir o token usando a nossa SECRET_KEY
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user


# ==========================================
# ROTAS DE PUBLICAÇÕES (ENDPOINTS)
# ==========================================

@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post_in: PostCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user) # Exige que o usuário esteja logado!
):
    """Cria uma nova publicação e anexa as fotos a ela"""
    
    # 1. Cria o objeto do Post associando ao usuário logado
    new_post = Post(
        id=str(uuid.uuid4()),
        content=post_in.content,
        route_id=post_in.route_id,
        user_id=current_user.id
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    # 2. Se o usuário enviou fotos, nós as salvamos no banco atreladas ao Post
    if post_in.photo_urls:
        for url in post_in.photo_urls:
            new_photo = Photo(
                id=str(uuid.uuid4()),
                url=url,
                post_id=new_post.id
            )
            db.add(new_photo)
        db.commit()
        db.refresh(new_post) # Atualiza o post para trazer as fotos anexadas
        
    return new_post


@router.get("/", response_model=List[PostResponse])
def get_all_posts(db: Session = Depends(get_db)):
    """Busca todas as publicações (Feed Geral). Não exige estar logado para ver."""
    # Traz os posts ordenados do mais recente para o mais antigo
    posts = db.query(Post).order_by(Post.created_at.desc()).all()
    return posts


@router.get("/{post_id}", response_model=PostResponse)
def get_single_post(post_id: str, db: Session = Depends(get_db)):
    """Busca os detalhes de uma publicação específica pelo ID"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicação não encontrada")
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: str, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Apaga uma publicação. Só quem criou o post pode apagá-lo."""
    post = db.query(Post).filter(Post.id == post_id).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Publicação não encontrada")
        
    # Verifica se o usuário tentando apagar é o dono do post
    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Você não tem permissão para apagar esta publicação"
        )
        
    db.delete(post)
    db.commit()
    return None