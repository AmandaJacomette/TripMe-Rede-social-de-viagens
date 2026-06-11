from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importações internas do nosso projeto
from app.models.domain import Base
from app.core.config import engine
from app.api import post_endpoints
from app.api import route_endpoints
from app.api import feed_endpoints
from app.api import auth

# 1. Cria todas as tabelas no PostgreSQL automaticamente
Base.metadata.create_all(bind=engine)

# 2. Inicializa o aplicativo FastAPI
app = FastAPI(
    title="Trip Me API",
    description="Backend da rede social georreferenciada de viagens (TCC)",
    version="1.0.0"
)

# 3. Configuração do CORS (Cross-Origin Resource Sharing)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permite requisições vindo do Angular
    allow_credentials=True,
    allow_methods=["*"],                      # Permite todos os métodos (GET, POST, PUT, DELETE)
    allow_headers=["*"],                      # Permite todos os cabeçalhos
)

# 4. Rota raiz de teste
@app.get("/", tags=["Health Check"])
def read_root():
    return {"message": "Bem-vindo à API do Trip Me! O servidor está rodando perfeitamente."}

# 5. Registro das Rotas (Endpoints)

app.include_router(auth.router, prefix="/auth", tags=["Autenticação"])
app.include_router(feed_endpoints.router, prefix="/feed", tags=["Feed Inteligente"])
app.include_router(post_endpoints.router, prefix="/posts", tags=["Publicações"])
app.include_router(route_endpoints.router, prefix="/routes", tags=["Roteiros"])