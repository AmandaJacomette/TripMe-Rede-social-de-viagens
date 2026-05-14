from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importações internas do nosso projeto
# Obs: Descomente as rotas (routers) abaixo conforme for criando os arquivos na pasta 'api'
from app.models.domain import Base
from app.core.config import engine
# from app.api import post_endpoints
# from app.api import route_endpoints
# from app.api import feed_endpoints
# from app.api import auth

# 1. Cria todas as tabelas no PostgreSQL automaticamente
# Isso pega tudo que está em 'domain.py' e transforma em tabela real no banco
Base.metadata.create_all(bind=engine)

# 2. Inicializa o aplicativo FastAPI
app = FastAPI(
    title="Trip Me API",
    description="Backend da rede social georreferenciada de viagens (TCC)",
    version="1.0.0"
)

# 3. Configuração do CORS (Cross-Origin Resource Sharing)
# Extremamente importante! Sem isso, o Angular (Porta 4200) é bloqueado por segurança
# e não consegue fazer requisições para o FastAPI (Porta 8000).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Permite requisições vindo do Angular
    allow_credentials=True,
    allow_methods=["*"],                      # Permite todos os métodos (GET, POST, PUT, DELETE)
    allow_headers=["*"],                      # Permite todos os cabeçalhos
)

# 4. Rota raiz de teste
@app.get("/", tags=["Health Check"])
def read_root():
    return {"message": "Bem-vindo à API do Trip Me! O servidor está rodando perfeitamente."}

# 5. Registro das Rotas (Endpoints)
# É aqui que nós 'plugamos' os arquivos que farão as lógicas do sistema
# Vá descomentando conforme formos programando cada um deles:

# app.include_router(auth.router, prefix="/api/v1/auth", tags=["Autenticação"])
# app.include_router(feed_endpoints.router, prefix="/api/v1/feed", tags=["Feed Inteligente"])
# app.include_router(post_endpoints.router, prefix="/api/v1/posts", tags=["Publicações"])
# app.include_router(route_endpoints.router, prefix="/api/v1/routes", tags=["Roteiros"])