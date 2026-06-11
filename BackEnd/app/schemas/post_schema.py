from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional
from datetime import datetime
from .auth_schema import UserResponse

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
    pass

class CommentResponse(CommentBase):
    id: str
    text: str
    created_at: datetime
    author: UserResponse
    #user_id: str
    #post_id: str
    
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
#  ESQUEMA PARA LUGARES (PLACES)
# ==========================================
class PlaceResponse(BaseModel):
    id: str
    name: str = Field(..., description="Nome do local")
    lat: float = Field(..., description="Latitude")
    lon: float = Field(..., description="Longitude")
    visits_count: int = Field(0, description="Contador de visitas do local")

    model_config = ConfigDict(from_attributes=True)

# ==========================================
# ESQUEMAS PARA PUBLICAÇÕES (POSTS)
# ==========================================
class PostBase(BaseModel):
    content: Optional[str] = Field(None, description="Legenda ou texto da publicação")
    route_id: Optional[str] = Field(None, description="ID de um roteiro associado a esta publicação (opcional)")

class PostCreate(PostBase):
    """O front-end envia os dados geográficos soltos aqui ao publicar"""
    location_name: Optional[str] = Field(None, description="Nome do lugar vindo do mapa")
    latitude: Optional[float] = Field(None, description="Coordenada de Latitude")
    longitude: Optional[float] = Field(None, description="Coordenada de Longitude")
    photo_urls: Optional[List[str]] = Field(default_factory=list, description="Lista de URLs das imagens")

class PostResponse(BaseModel):
    id: str
    content: Optional[str]
    created_at: datetime
    route_id: Optional[str]
    place_id: Optional[str]
    place: Optional[PlaceResponse] 
    photos: List[PhotoResponse]     
    author: UserResponse  
    likes: List[PostLikeResponse] = [] 
    comments: List[CommentResponse] = []
             
    
    class Config:
        orm_mode = True

class PaginatedPostsResponse(BaseModel):
    items: List[PostResponse]       # Mapeia diretamente o data.items do front
    next_page: Optional[int] = None # Mapeia o data.next_page do front