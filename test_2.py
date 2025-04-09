import os
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()

# Variables d'environnement ou définies directement ici
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")  
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")  
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")

# Création du client Azure OpenAI
client = AzureOpenAI(
    api_key=AZURE_OPENAI_KEY,
    api_version=AZURE_OPENAI_API_VERSION,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
)

# Appel au modèle GPT-4o
response = client.chat.completions.create(
    model=AZURE_OPENAI_DEPLOYMENT,
    messages = [
    {"role": "system", "content": "Tu es un juriste spécialisé en RGPD. Réponds uniquement en JSON (score sur 100, points forts, points à améliorer)."},
    {"role": "user", "content": "Analyse la politique de confidentialité de Mistral AI et dis-moi si elle est conforme."}
],
    temperature=0.3,
    max_tokens=3000,
)

# Affiche la réponse
print(response.choices[0].message.content)

