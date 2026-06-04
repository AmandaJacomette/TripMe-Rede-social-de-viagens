import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
import os

# ==========================================
# CONFIGURAÇÃO DO CLOUDINARY
# ==========================================
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def upload_image(file: UploadFile, folder_name: str = "tripme_posts") -> str:
    """
    Recebe um arquivo de imagem do FastAPI e envia para o Cloudinary.
    Retorna a URL segura (https) da imagem gerada.
    """
    try:
        # Verifica se o arquivo é realmente uma imagem
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="O arquivo enviado não é uma imagem válida.")

        # Faz o upload para o Cloudinary
        # O parâmetro 'folder' organiza as imagens em pastas lá no painel do Cloudinary
        upload_result = cloudinary.uploader.upload(
            file.file,
            folder=folder_name,
            # Redimensionamento automático: se a foto for gigante, reduzimos para economizar internet
            transformation=[
                {"width": 1080, "crop": "limit"} # Limita a largura máxima para o padrão do Instagram/Feed
            ]
        )
        
        # Retorna a URL pronta para ser salva no nosso banco de dados
        return upload_result.get("secure_url")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao fazer upload da imagem: {str(e)}")

def upload_profile_picture(file: UploadFile) -> str:
    """
    Serviço específico para fotos de perfil.
    Já recorta a imagem em um quadrado perfeito (aspect ratio 1:1) focando no rosto.
    """
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="O arquivo enviado não é uma imagem válida.")

        upload_result = cloudinary.uploader.upload(
            file.file,
            folder="tripme_profiles",
            transformation=[
                {"width": 400, "height": 400, "crop": "fill", "gravity": "face"}
            ]
        )
        return upload_result.get("secure_url")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao fazer upload da foto de perfil: {str(e)}")