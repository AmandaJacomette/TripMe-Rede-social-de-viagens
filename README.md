# ✈️ Trip Me

> **Trabalho de Conclusão de Curso — Sistemas de Informação** > Uma plataforma de rede social georreferenciada focada no compartilhamento de experiências de viagem, criação de roteiros e recomendação inteligente de conteúdos.

Este repositório contém o código-fonte completo (Full-Stack) do projeto, dividido em Front-end (Aplicação Cliente) e Back-end (API e Banco de Dados).

---

## 🚀 Tecnologias Utilizadas

### Front-end (Cliente Web)
* **Biblioteca Base:** React (com TypeScript)
* **Ferramenta de Build (Bundler):** Vite
* **Roteamento e Estado:** TanStack Router
* **Estilização & Animações:** Tailwind CSS v4 + `tw-animate-css`
* **Mapas e Georreferenciamento:** Leaflet.js
* **Ambiente de Execução/Package Manager:** Node.js / npm

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

* 🗺️ **Mapas Interativos:** Visualização de publicações e roteiros diretamente em mapas usando Leaflet, sem depender de APIs pagas.
* 🧠 **Feed Inteligente (Smart Feed):** Motor de recomendação processado no servidor (Back-end), que utiliza *Time Decay* (decaimento por tempo) e afinidade do usuário para entregar posts relevantes.
* 🎒 **Gestão de Roteiros:** Crie roteiros detalhados vinculando múltiplos lugares. Inclui o recurso de **Clonagem Transacional**, permitindo copiar o roteiro de outro usuário com um clique, reaproveitando dados geográficos no banco.
* 📸 **Publicações Híbridas:** Suporte para "Photo Dumps" (apenas fotos e legenda) ou publicações vinculadas a roteiros estruturados.
* ❤️ **Interações Sociais Seguras:** Sistema de curtidas (*Toggle Like*) validado no banco de dados para garantir integridade e comentários armazenados de forma estruturada.
* 🔍 **Busca Avançada:** Filtros dinâmicos por tema, categoria ou localização exata.

---

## 🏗️ Arquitetura e Decisões de Engenharia

O projeto foi construído seguindo o padrão **"Smart Server / Dumb Client"**:
* **Processamento Centralizado:** O React atua estritamente na camada de apresentação (View). Toda a carga de processamento pesado, algoritmos de recomendação e regras de negócio estão blindados no back-end em Python.
* **Georreferenciamento de Ponta a Ponta:** O front-end captura as coordenadas via Nominatim API e envia para o back-end, permitindo futuras implementações de cálculos de distância (ex: posts perto de mim).
* **Integridade de Dados:** Utilização de deleção em cascata (*Cascade Delete*) no PostgreSQL para evitar registros órfãos (comentários sem posts) e transações seguras (*Rollback*) durante a clonagem de roteiros.

---

## 📂 Estrutura do Repositório

```text
TripMe-Rede-social-de-viagens/
├── README.md
├── .gitignore
│
├── frontend/                      # Aplicação React + Vite (Cliente)
│   ├── package.json
│   ├── vite.config.ts
│   ├── node_modules/
│   ├── public/
│   ├── .tanstack/                 # Pasta de cache do TanStack Router
│   ├── .vscode/
│   └── src/
│       ├── components/            # Componentes reutilizáveis (Logo, PostCard, AppShell)
│       ├── hooks/                 # Hooks customizados da aplicação
│       ├── lib/                   # Configurações de bibliotecas externas
│       ├── routes/                # Páginas e Rotas gerenciadas pelo TanStack
│       ├── main.tsx               # Ponto de entrada do React
│       ├── router.tsx             # Configuração e instância do roteador
│       ├── routeTree.gen.ts       # Árvore de rotas gerada automaticamente
│       ├── server.ts              # Configurações de integração/chamadas locais
│       ├── start.ts               # Script auxiliar de inicialização
│       └── styles.css             # Configuração e diretivas do Tailwind v4
│
└── BackEnd/                       # API FastAPI (Servidor de Dados)
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

* **Node.js e npm** (Para o Front-end)
* **Python 3.9+ e Pip** (Para o Back-end)
* **Docker e Docker Compose** (Para o Banco de Dados)
* Chaves de API do **Cloudinary** e do **Google**(Armazenamento de imagens gratuitas e login)

### 1. Configurando o Back-end

1. Navegue até a pasta `backend/`.
2. Crie um arquivo `.env` com base no modelo (configurando seu `DATABASE_URL` e chaves do Cloudinary e Google).
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

### 2. Configurando o Front-end

1. Em um novo terminal, navegue até a pasta `frontend/`.
2. Instale as dependências do Node:
```bash
npm install

```


3. Inicie o servidor:
```bash
npm run dev

```


*A aplicação web estará disponível no seu navegador em `http://localhost:5173`.*

---

**Desenvolvido por Amanda** como Trabalho de Conclusão de Curso em Sistemas de Informação.