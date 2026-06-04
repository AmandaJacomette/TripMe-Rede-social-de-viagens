import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import get_db
from app.models.domain import Post, Comment, PostLike, User
from app.schemas.post_schema import CommentCreate, CommentResponse, PostResponse
from app.services.recommendation_service import calculate_feed_score

# Reaproveitamos a função de segurança para garantir que só logados curtem e comentam
from app.api.post_endpoints import get_current_user

router = APIRouter()

# ==========================================
# ROTAS DE ENGAJAMENTO (FEED / INTERAÇÕES)
# ==========================================

@router.post("/{post_id}/like", status_code=status.HTTP_200_OK)
def toggle_like(
    post_id: str, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Sistema de 'Toggle': Se o usuário não curtiu, ele curte. 
    Se ele já curtiu e clicar de novo, a curtida é removida (Unlike).
    """
    # 1. Verifica se a publicação existe
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicação não encontrada")

    # 2. Verifica se o usuário já curtiu este post
    existing_like = db.query(PostLike).filter(
        PostLike.post_id == post_id, 
        PostLike.user_id == current_user.id
    ).first()

    if existing_like:
        # Se já curtiu, nós apagamos a curtida (Unlike)
        db.delete(existing_like)
        db.commit()
        return {"message": "Curtida removida", "liked": False}
    else:
        # Se não curtiu, nós criamos a curtida (Like)
        new_like = PostLike(
            id=str(uuid.uuid4()),
            post_id=post_id,
            user_id=current_user.id
        )
        db.add(new_like)
        db.commit()
        return {"message": "Publicação curtida", "liked": True}


@router.post("/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def add_comment(
    post_id: str, 
    comment_in: CommentCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Adiciona um comentário a uma publicação específica"""
    
    # 1. Verifica se o post existe
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Publicação não encontrada")

    # 2. Cria o comentário
    new_comment = Comment(
        id=str(uuid.uuid4()),
        text=comment_in.text,
        post_id=post_id,
        user_id=current_user.id
    )
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    return new_comment


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: str, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Apaga um comentário. Só o dono do comentário ou o dono do Post podem apagar."""
    
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comentário não encontrado")
        
    # Busca o post para saber quem é o dono dele
    post = db.query(Post).filter(Post.id == comment.post_id).first()

    # Regra de negócio: Você só pode apagar se o comentário for seu, 
    # OU se o comentário estiver na SUA publicação (dono do post moderando)
    if comment.user_id != current_user.id and post.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Você não tem permissão para apagar este comentário"
        )
        
    db.delete(comment)
    db.commit()
    return None

# ==========================================
# ROTA DO ALGORITMO DE RECOMENDAÇÃO
# ==========================================

@router.post("/for-you", response_model=List[PostResponse])
def get_for_you_feed(
    skip: int = 0,   # Valor padrão: 0
    limit: int = 20, # Valor padrão: 20
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    POST /feed/for-you?skip=0&limit=20
    Permite paginação infinita. O Angular aumenta o 'skip' conforme o usuário rola a tela.
    """
    
    posts = calculate_feed_score(db=db, user_id=current_user.id, skip=skip, limit=limit)
    
    return posts