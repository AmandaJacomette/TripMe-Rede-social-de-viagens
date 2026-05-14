import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Float, Table
from sqlalchemy.orm import relationship
from app.core.config import Base

# ==========================================
# TABELAS DE ASSOCIAÇÃO (Muitos-para-Muitos)
# ==========================================

# Relaciona Roteiros e Lugares (Um roteiro tem vários lugares, um lugar pode estar em vários roteiros)
route_places = Table(
    "route_places",
    Base.metadata,
    Column("route_id", String(36), ForeignKey("routes.id"), primary_key=True),
    Column("place_id", String(36), ForeignKey("places.id"), primary_key=True)
)

# ==========================================
# ENTIDADES PRINCIPAIS
# ==========================================

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    profile_pic = Column(Text, nullable=True)
    bio = Column(String(255), nullable=True)
    
    # Relacionamentos
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    routes = relationship("Route", back_populates="creator")
    likes = relationship("PostLike", back_populates="user")

class Post(Base):
    __tablename__ = "posts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    content = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(String(36), ForeignKey("users.id"))
    
    # Um post pode (opcionalmente) estar ligado a um roteiro completo
    route_id = Column(String(36), ForeignKey("routes.id"), nullable=True)

    # Relacionamentos
    author = relationship("User", back_populates="posts")
    photos = relationship("Photo", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("PostLike", back_populates="post", cascade="all, delete-orphan")
    route = relationship("Route")

class Photo(Base):
    __tablename__ = "photos"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    url = Column(Text, nullable=False) # URL do Cloudinary
    post_id = Column(String(36), ForeignKey("posts.id"))

    post = relationship("Post", back_populates="photos")

class Comment(Base):
    __tablename__ = "comments"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    post_id = Column(String(36), ForeignKey("posts.id"))
    user_id = Column(String(36), ForeignKey("users.id"))

    post = relationship("Post", back_populates="comments")
    author = relationship("User")

class Route(Base):
    __tablename__ = "routes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=True) # Ex: Praia, Gastronomia, Aventura
    user_id = Column(String(36), ForeignKey("users.id"))

    creator = relationship("User", back_populates="routes")
    # Relacionamento Muitos-para-Muitos com Lugares
    places = relationship("Place", secondary=route_places, back_populates="routes")

class Place(Base):
    __tablename__ = "places"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(150), nullable=False)
    address = Column(Text, nullable=True)
    lat = Column(Float, nullable=False)
    lon = Column(Float, nullable=False)

    routes = relationship("Route", secondary=route_places, back_populates="places")

class PostLike(Base):
    __tablename__ = "post_likes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    post_id = Column(String(36), ForeignKey("posts.id"))
    user_id = Column(String(36), ForeignKey("users.id"))

    user = relationship("User", back_populates="likes")
    post = relationship("Post", back_populates="likes")