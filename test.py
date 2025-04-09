import pdfplumber
import requests
import os
from dotenv import load_dotenv

load_dotenv()

HF_API_TOKEN = os.getenv("HF_API_TOKEN")

API_URL = "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1"
HEADERS = {
    "Authorization": f"Bearer {HF_API_TOKEN}",
    "Content-Type": "application/json"
}

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text


def build_prompt(document_text):
    return f"""
Tu es un expert en conformité RGPD. On te fournit ci-dessous une politique de confidentialité extraite d’un document PDF.

Ta tâche est d’analyser ce texte et de répondre sous la forme JSON suivante :

{{
  "score": int (score de conformité sur 100),
  "points_positifs": [liste de points positifs identifiés],
  "points_a_ameliorer": [liste de faiblesses ou risques],
  "recommandations": [
    {{
      "article_rgpd": "article concerné",
      "recommendation": "amélioration proposée"
    }}
  ]
}}

Voici le texte à analyser :
\"\"\"
{document_text}
\"\"\"
"""


def query_huggingface(prompt):
    payload = {
        "inputs": prompt,
        "parameters": {"max_new_tokens": 1000}
    }
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    response.raise_for_status()
    return response.json()[0]["generated_text"]




if __name__ == "__main__":
    file_name = "politique-de-confidentialite-mistral.pdf"
    text = extract_text_from_pdf(file_name)
    prompt = build_prompt(text)
    #prompt = "Génère un json avec les informations suivantes : {nom: 'John', age: 30, ville: 'Paris'}. Renvoi uniquement le json, rien d'autre."
    
    
    print("⏳ Envoi au LLM...")
    output = query_huggingface(prompt)
    
    print("\n=== Réponse du modèle ===\n")
    print(output)
