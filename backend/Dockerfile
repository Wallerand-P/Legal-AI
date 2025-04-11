# Utilise une image Python optimisée
FROM python:3.12-slim

# Mettre à jour pip
RUN pip install --upgrade pip

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste des fichiers du backend
COPY . .

# Spécifier la variable d’environnement (facultatif)
ENV PYTHONUNBUFFERED=1

# Exposer le port utilisé par FastAPI (par défaut 8000)
EXPOSE 8000

# Lancer l’application avec uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
