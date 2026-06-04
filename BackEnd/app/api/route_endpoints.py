import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.config import get_db
from app.models.domain import Route, Place, User
from app.schemas.route_schema import RouteCreate, RouteResponse

from app.api.post_endpoints import get_current_user

router = APIRouter()

# ==========================================
# ROTAS DE ROTEIROS (ENDPOINTS)
# ==========================================

@router.post("/", response_model=RouteResponse, status_code=status.HTTP_201_CREATED)
def create_route(
    route_in: RouteCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user) # Exige login!
):
    """
    Cria um novo roteiro e já cadastra todos os locais anexados a ele de uma só vez.
    """
    
    # 1. Cria a base do Roteiro (sem os lugares ainda)
    new_route = Route(
        id=str(uuid.uuid4()),
        name=route_in.name,
        description=route_in.description,
        category=route_in.category,
        user_id=current_user.id
    )
    
    # 2. Verifica se o Angular enviou uma lista de lugares junto com o roteiro
    if route_in.places:
        for place_data in route_in.places:
            new_place = Place(
                id=str(uuid.uuid4()),
                name=place_data.name,
                address=place_data.address,
                lat=place_data.lat,
                lon=place_data.lon
            )
            
            # A MÁGICA ACONTECE AQUI:
            # Ao fazer ".append", o SQLAlchemy cadastra o lugar na tabela 'places'
            # e já preenche a tabela de associação 'route_places' automaticamente!
            new_route.places.append(new_place)
            
    # 3. Salva tudo no banco de dados numa tacada só
    db.add(new_route)
    db.commit()
    db.refresh(new_route) # Traz o roteiro do banco já com a lista de lugares pronta
    
    return new_route


@router.get("/", response_model=List[RouteResponse])
def get_all_routes(db: Session = Depends(get_db)):
    """Busca todos os roteiros públicos do Trip Me"""
    routes = db.query(Route).all()
    return routes


@router.get("/my-routes", response_model=List[RouteResponse])
def get_my_routes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Busca apenas os roteiros criados pelo usuário que está logado (para o Perfil dele)"""
    routes = db.query(Route).filter(Route.user_id == current_user.id).all()
    return routes


@router.get("/{route_id}", response_model=RouteResponse)
def get_single_route(route_id: str, db: Session = Depends(get_db)):
    """Busca os detalhes de um roteiro específico pelo ID"""
    route = db.query(Route).filter(Route.id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail="Roteiro não encontrado")
    return route


@router.delete("/{route_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_route(
    route_id: str, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Apaga um roteiro (apenas o dono pode apagar)"""
    route = db.query(Route).filter(Route.id == route_id).first()
    
    if not route:
        raise HTTPException(status_code=404, detail="Roteiro não encontrado")
        
    if route.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Você não tem permissão para apagar este roteiro"
        )
        
    db.delete(route)
    db.commit()
    return None