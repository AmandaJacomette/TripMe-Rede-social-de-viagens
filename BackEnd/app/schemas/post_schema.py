from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime

# ==========================================
# ESQUEMAS PARA FOTOS (PHOTOS)
# ==========================================

class PhotoBase(BaseModel):
    url: str = Field(..., description="URL da imagem gerada pelo Cloudinary")

class PhotoCreate(PhotoBase):
    pass

class PhotoResponse(PhotoBase):
    id: str
    post_id: str
    
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# ESQUEMAS PARA COMENTÁRIOS (COMMENTS)
# ==========================================

class CommentBase(BaseModel):
    text: str = Field(..., min_length=1, description="Conteúdo do comentário")

class CommentCreate(CommentBase):
    """O Angular envia apenas o texto. O ID do post vai na URL da requisição e o ID do usuário pegamos do token de login."""
    pass

class CommentResponse(CommentBase):
    id: str
    created_at: datetime
    user_id: str
    post_id: str
    
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# ESQUEMAS PARA CURTIDAS (LIKES)
# ==========================================

class PostLikeResponse(BaseModel):
    id: str
    user_id: str
    post_id: str
    
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# ESQUEMAS PARA PUBLICAÇÕES (POSTS)
# ==========================================

class PostBase(BaseModel):
    content: Optional[str] = Field(None, description="Legenda ou texto da publicação")
    route_id: Optional[str] = Field(None, description="ID de um roteiro associado a esta publicação (opcional)")

class PostCreate(PostBase):
    """
    Esquema para criação do Post.
    Nota: No FastAPI, o upload de arquivos de imagem geralmente é feito via Form-Data, 
    mas usamos photo_urls aqui caso o Angular faça o upload para o Cloudinary primeiro 
    e envie apenas as URLs prontas para o Back-end.
    """
    photo_urls: Optional[List[str]] = Field(default=[], description="Lista de URLs das imagens")

class PostResponse(PostBase):
    """O formato completo do Post que vai popular o Feed Inteligente do Angular"""
    id: str
    created_at: datetime
    user_id: str
    
    # Aninhamento: Um post já devolve as suas fotos, comentários e curtidas de uma vez só
    photos: List[PhotoResponse] = []
    comments: List[CommentResponse] = []
    likes: List[PostLikeResponse] = []
    
    model_config = ConfigDict(from_attributes=True)