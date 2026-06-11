import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

from app.core.config import get_db, SECRET_KEY
from app.models.domain import Post, Photo, User, Place, Comment, PostLike
from app.schemas.post_schema import PostCreate, PostResponse, CommentResponse, PaginatedPostsResponse

from app.services.cloudinary_service import upload_image 
from app.services.recommendation_service import calculate_feed_score 

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False) # auto_error=False permite rota sem token
ALGORITHM = "HS256"

# ==========================================
# DEPENDÊNCIAS DE AUTENTICAÇÃO
# ==========================================

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Obrigatório: Retorna o usuário ou barra a requisição com 401"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais (Token inválido ou expirado)",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception
    try:
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

def get_current_user_optional(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Optional[User]:
    """Opcional: Se houver token inválido ou ausente, apenas retorna None sem travar a rota"""
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        return db.query(User).filter(User.id == user_id).first()
    except JWTError:
        return None

# ==========================================
# ROTAS DE PUBLICAÇÕES
# ==========================================

@router.post("/uploads", response_model=List[str], status_code=status.HTTP_201_CREATED)
async def upload_multiple_files(files: List[UploadFile] = File(...)):
    """Recebe múltiplos arquivos, salva no Cloudinary e retorna as URLs"""
    if not files:
        raise HTTPException(status_code=400, detail="Nenhum arquivo enviado.")
        
    uploaded_urls = []
    for file in files:
        url = upload_image(file)
        uploaded_urls.append(url)
        
    return uploaded_urls


@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(post_in: PostCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Cria uma publicação, gerencia a tabela de Places e associa as fotos"""
    new_post = Post(
        id=str(uuid.uuid4()),
        content=post_in.content,
        route_id=post_in.route_id,
        user_id=current_user.id
    )

    location_name = post_in.location_name
    latitude = post_in.latitude
    longitude = post_in.longitude
    
    if location_name and latitude is not None and longitude is not None:
        existing_place = db.query(Place).filter(Place.lat == latitude, Place.lon == longitude).first()
        
        if not existing_place:
            new_place = Place(
                id=str(uuid.uuid4()),
                name=location_name,
                lat=latitude,
                lon=longitude,
                visits_count=1
            )
            db.add(new_place)
            new_post.place = new_place
        else:
            existing_place.visits_count += 1
            new_post.place = existing_place
            
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    if post_in.photo_urls:
        for url in post_in.photo_urls:
            new_photo = Photo(id=str(uuid.uuid4()), url=url, post_id=new_post.id)
            db.add(new_photo)
        db.commit()
        db.refresh(new_post)
        
    return new_post

@router.get("/foryou", response_model=PaginatedPostsResponse) 
def get_for_you_feed(
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Retorna o Feed Inteligente estruturado com paginação para o Front-end"""
    # 1. Calculamos o skip original
    skip = (page - 1) * limit
    user_id = current_user.id if current_user else None
    
    # 2. Pedimos ao algoritmo um item a mais (limit + 1) para descobrir se tem próxima página
    posts = calculate_feed_score(db=db, user_id=user_id, skip=skip, limit=limit + 1)
    
    # 3. Lógica para definir a próxima página
    next_page = None
    if len(posts) > limit:
        next_page = page + 1
        posts = posts[:limit] # Remove o item extra para mandar o tamanho exato solicitado
        
    # 4. Devolve o objeto envelopado exatamente como data.items e data.next_page
    return {
        "items": posts,
        "next_page": next_page
    }


@router.get("/{post_id}", response_model=PostResponse)
def get_single_post(post_id: str, db: Session = Depends(get_db)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicação não encontrada")
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicação não encontrada")
    if post.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permissão negada")
        
    db.delete(post)
    db.commit()
    return None

# ==========================================
#  INTERAÇÕES (CURTIDAS E COMENTÁRIOS)
# ==========================================

@router.post("/{post_id}/like")
def toggle_like(post_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Adiciona ou remove a curtida do post de forma dinâmica (Toggle)"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicação não encontrada")

    # Verifica se a curtida já existe
    existing_like = db.query(PostLike).filter(
        PostLike.post_id == post_id, 
        PostLike.user_id == current_user.id
    ).first()

    if existing_like:
        db.delete(existing_like)
        has_liked = False
    else:
        new_like = PostLike(id=str(uuid.uuid4()), post_id=post_id, user_id=current_user.id)
        db.add(new_like)
        has_liked = True

    db.commit()
    
    # Recalcula a quantidade de curtidas atualizada para devolver ao Front
    likes_count = db.query(PostLike).filter(PostLike.post_id == post_id).count()
    return {"likes_count": likes_count, "has_liked": has_liked}


@router.get("/{post_id}/comments", response_model=List[CommentResponse])
def get_comments(post_id: str, db: Session = Depends(get_db)):
    """Busca a lista de comentários de uma publicação"""
    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.asc()).all()
    return comments


@router.post("/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def add_comment(
    post_id: str, 
    comment_in: dict,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Cria um novo comentário atrelado à publicação e ao usuário logado"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicação não encontrada")
        
    text_content = comment_in.get("content")
    if not text_content or not text_content.strip():
        raise HTTPException(status_code=400, detail="O comentário não pode ser vazio")

    new_comment = Comment(
        id=str(uuid.uuid4()),
        text=text_content,
        post_id=post_id,
        user_id=current_user.id,
        created_at=datetime.utcnow()
    )
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment