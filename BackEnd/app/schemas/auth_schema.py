from pydantic import BaseModel, EmailStr, ConfigDict, Field
from typing import Optional

# ==========================================
# ESQUEMAS PARA USUÁRIOS (USERS)
# ==========================================

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, description="Nome completo ou de exibição")
    # EmailStr valida automaticamente se tem '@' e '.com'
    email: EmailStr = Field(..., description="Endereço de e-mail do usuário")
    profile_pic: Optional[str] = Field(None, description="URL da foto de perfil")
    bio: Optional[str] = Field(None, max_length=255, description="Biografia curta do perfil")

class UserCreate(UserBase):
    """Esquema para quando o usuário está se cadastrando pela primeira vez"""
    password: str = Field(..., min_length=6, description="Senha em texto plano (será criptografada no backend)")

class UserLogin(BaseModel):
    """Esquema simples para a tela de Login"""
    email: EmailStr
    password: str

class UserResponse(UserBase):
    """Esquema de devolução dos dados do usuário (NUNCA devolve a senha!)"""
    id: str

    model_config = ConfigDict(from_attributes=True)


# ==========================================
# ESQUEMAS PARA AUTENTICAÇÃO (TOKENS)
# ==========================================

class Token(BaseModel):
    """Esquema para o Token JWT que o Angular vai salvar no LocalStorage"""
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    """Esquema para decodificar e validar o Token internamente"""
    user_id: Optional[str] = None