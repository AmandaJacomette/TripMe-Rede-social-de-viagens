from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

# ==========================================
# ESQUEMAS PARA OS LUGARES (PLACES)
# ==========================================

class PlaceBase(BaseModel):
    name: str = Field(..., min_length=2, description="Nome do local/ponto turístico")
    address: Optional[str] = Field(None, description="Endereço completo do local")
    lat: float = Field(..., description="Latitude para o mapa georreferenciado")
    lon: float = Field(..., description="Longitude para o mapa georreferenciado")

class PlaceCreate(PlaceBase):
    """Esquema para quando o Angular envia um novo lugar"""
    pass

class PlaceResponse(PlaceBase):
    """Esquema de retorno do lugar com o ID do banco de dados"""
    id: str

    # Configuração para o Pydantic V2 ler os modelos do SQLAlchemy
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# ESQUEMAS PARA OS ROTEIROS (ROUTES)
# ==========================================

class RouteBase(BaseModel):
    name: str = Field(..., min_length=3, description="Nome do roteiro de viagem")
    description: Optional[str] = Field(None, description="Descrição detalhada do roteiro")
    category: Optional[str] = Field(None, description="Categoria do roteiro (ex: Praia, Eco, Gastronomia)")

class RouteCreate(RouteBase):
    """Esquema para criar um Roteiro. O Angular enviará o roteiro junto com os seus lugares."""
    places: List[PlaceCreate] = Field(default=[], description="Lista de lugares que compõem este roteiro")

class RouteResponse(RouteBase):
    """Esquema completo enviado de volta para o Angular exibir no ecrã"""
    id: str
    user_id: str
    places: List[PlaceResponse] = []

    # Configuração necessária para o FastAPI converter objetos do banco automaticamente
    model_config = ConfigDict(from_attributes=True)