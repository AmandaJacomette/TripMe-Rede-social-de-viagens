# 🌍 Trip Me

> **Trabalho de Conclusão de Curso - Sistemas de Informação** > Uma plataforma de rede social georreferenciada focada no compartilhamento de experiências de viagem, criação de roteiros e recomendação inteligente de conteúdos.

Este repositório contém o código-fonte completo (Full-Stack) do projeto, dividido em **Front-end** (Aplicação Cliente) e **Back-end** (API e Banco de Dados).

## 🚀 Tecnologias Utilizadas

### Front-end (Cliente Web)

* **Framework:** Angular
* **Linguagem:** TypeScript, HTML5, CSS3
* **Mapas e Georreferenciamento:** Leaflet.js
* **Comunicação HTTP:** Angular HttpClient

### Back-end (API Rest)

* **Framework:** FastAPI (Python)
* **Banco de Dados:** PostgreSQL (containerizado via Docker)
* **ORM & Validação:** SQLAlchemy + Pydantic
* **Autenticação:** Integração prevista com Google OAuth2

### APIs e Serviços Externos

* **OpenStreetMap (Nominatim):** Geocodificação gratuita para transformar nomes de locais em coordenadas (Latitude/Longitude).
* **Cloudinary:** Armazenamento e otimização em nuvem para uploads de imagens e fotos.

---

## ✨ Principais Funcionalidades

* **🗺️ Mapas Interativos:** Visualização de publicações e roteiros diretamente em mapas usando Leaflet, sem depender de APIs pagas.
* **🧠 Feed Inteligente (Smart Feed):** Motor de recomendação processado no servidor (*Back-end*), que utiliza *Time Decay* (decaimento por tempo) e afinidade do usuário para entregar posts relevantes.
* **🎒 Gestão de Roteiros:** Crie roteiros detalhados vinculando múltiplos lugares. Inclui o recurso de **Clonagem Transacional**, permitindo copiar o roteiro de outro usuário com um clique, reaproveitando dados geográficos no banco.
* **📸 Publicações Híbridas:** Suporte para "Photo Dumps" (apenas fotos e legenda) ou publicações vinculadas a roteiros estruturados.
* **❤️ Interações Sociais à prova de fraudes:** Sistema de curtidas (Toggle Like) validado no banco de dados para garantir integridade e comentários em tempo real.
* **🔍 Busca Avançada:** Filtros dinâmicos por tema, categoria ou localização exata.

---

## 🏗️ Arquitetura e Decisões de Engenharia

O projeto foi construído seguindo o padrão **"Smart Server / Dumb Client"**:

1. **Processamento Centralizado:** O Angular atua estritamente na camada de apresentação (View). Toda a carga de processamento pesado, algoritmos de recomendação e regras de negócio estão blindados no back-end.
2. **Georreferenciamento de Ponta a Ponta:** O front-end captura as coordenadas via Nominatim API e envia para o back-end, permitindo futuras implementações de cálculos de distância (ex: *posts perto de mim*).
3. **Integridade de Dados:** Utilização de deleção em cascata (*Cascade Delete*) no PostgreSQL para evitar registros órfãos (comentários sem posts) e transações seguras (*Rollback*) durante a clonagem de roteiros.

---

## 📂 Estrutura do Repositório

```text
travel-social-app/
├── README.md
│
├── frontend/                      # Aplicação Angular (Interface do Usuário)
│   ├── package.json
│   ├── angular.json
│   └── src/
│       ├── app/
│       │   ├── components/        # Feed, Posts, Mapas, Formulários
│       │   ├── services/          # Integração HTTP com o FastAPI
│       │   └── models/            # Interfaces TypeScript
│       └── assets/
│
└── backend/                       # API FastAPI (Servidor de Dados)
    ├── docker-compose.yml         # Container do PostgreSQL
    ├── requirements.txt
    ├── .env                       # Chaves da API e URL do Banco
    └── app/
        ├── main.py                # Entrypoint da API
        ├── api/                   # Controladores e Endpoints (Rotas)
        ├── models/                # Entidades do Banco de Dados (ORM)
        ├── schemas/               # Validação de Dados (Pydantic)
        └── services/              # Motor de Recomendação e Cloudinary

```

---

## 🛠️ Como executar o projeto localmente

### Pré-requisitos

* **Node.js e Angular CLI** (Para o Front-end)
* **Python 3.9+ e Pip** (Para o Back-end)
* **Docker e Docker Compose** (Para o Banco de Dados)
* Chaves de API do **Cloudinary** (Armazenamento de imagens gratuitas)

### 1. Configurando o Back-end

1. Navegue até a pasta `backend/`.
2. Crie um arquivo `.env` com base no modelo (configurando seu `DATABASE_URL` e chaves do Cloudinary).
3. Suba o banco de dados usando o Docker:
```bash
docker-compose up -d

```


4. Instale as dependências do Python:
```bash
pip install -r requirements.txt

```


5. Inicie o servidor FastAPI:
```bash
uvicorn app.main:app --reload

```


*A API estará disponível em `http://localhost:8000`. Acesse `/docs` para visualizar a documentação interativa (Swagger).*

### 2. Configurando o Front-end

1. Em um novo terminal, navegue até a pasta `frontend/`.
2. Instale as dependências do Node:
```bash
npm install

```


3. Inicie o servidor de desenvolvimento do Angular:
```bash
ng serve

```


*A aplicação web estará disponível no seu navegador em `http://localhost:4200`.*

---

**Desenvolvido por Amanda** como Trabalho de Conclusão de Curso em Sistemas de Informação.