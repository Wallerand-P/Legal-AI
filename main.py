
import os
import pdfplumber
import json
import re
import logging
from dotenv import load_dotenv
from openai import AzureOpenAI
from openai.types.chat import ChatCompletionMessageParam
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from tempfile import NamedTemporaryFile

# Ignorer les messages de log de pdfminer
logging.getLogger("pdfminer").setLevel(logging.ERROR)

# Chargement des variables d’environnement
load_dotenv()

AZURE_OPENAI_KEY = os.getenv("AZURE_OPENAI_KEY")
AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
AZURE_OPENAI_DEPLOYMENT = os.getenv("AZURE_OPENAI_DEPLOYMENT")
AZURE_OPENAI_API_VERSION = os.getenv("AZURE_OPENAI_API_VERSION")

app = FastAPI()

# Autorise les appels du front local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # à restreindre pour la prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Extraction du texte d’un PDF
def extract_text_from_pdf(pdf_path):
    full_text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            full_text += page.extract_text() + "\n"
    return full_text.strip()

# Construction du prompt
def build_prompt(text: str, regulation: str) -> list[ChatCompletionMessageParam]:
    if regulation.lower() == "ccpa":
        legal_role = "You are a lawyer specializing in CCPA (California Consumer Privacy Act)."
    elif regulation.lower() == "lgpd":
        legal_role = "You are a lawyer specializing in LGPD (Brazil)."
    elif regulation.lower() == "pdpa":
        legal_role = "You are a lawyer specializing in PDPA (Singapore)."
    elif regulation.lower() == "pipeda":
        legal_role = "You are a lawyer specializing in PIPEDA (Canada)."
    else:
        legal_role = "You are a lawyer specializing in GDPR (EU)."

    return [
        {
            "role": "system",
            "content": (
                f"{legal_role}\n"
                "You must analyze a privacy policy and respond ONLY with a JSON strictly following the structure below:\n\n"
                "{\n"
                '  "score": integer between 0 and 100,\n'
                '  "positivePoints": [\n'
                "    {\n"
                '      "type": "positive",\n'
                '      "title": "short title",\n'
                '      "description": "explanation in one or two sentences",\n'
                '      "gdprArticle": "article of the regulation you specialize in (e.g., Article 5(1)(b))"\n'
                "    },\n"
                "    ...\n"
                "  ],\n"
                '  "improvementPoints": [\n'
                "    {\n"
                '      "type": "improvement",\n'
                '      "title": "short title",\n'
                '      "description": "explanation of the point to improve",\n'
                '      "gdprArticle": "article of the regulation you specialize in",\n'
                '      "recommendation": "advice to correct this point"\n'
                "    },\n"
                "    ...\n"
                "  ]\n"
                "}\n\n"
                "Respond in English with nothing else but this JSON (no comments, no explanations)."
            )
        },
        {
            "role": "user",
            "content": f"Here is the text to audit:\n\"\"\"\n{text}\n\"\"\""
        }
    ]


def extract_json_from_response(content: str) -> dict:
    try:
        # Cherche le premier bloc JSON valide
        json_match = re.search(r"\{.*\}", content, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(0))
        else:
            raise ValueError("Aucun JSON trouvé dans la réponse.")
    except json.JSONDecodeError as e:
        raise ValueError(f"Erreur de parsing JSON : {e}")

# Appel du LLM via Azure OpenAI
def call_llm(messages: list[ChatCompletionMessageParam]) -> dict:
    # Initialisation du client Azure OpenAI
    #print('Appel au LLM')
    client = AzureOpenAI(
    api_key=AZURE_OPENAI_KEY,
    api_version=AZURE_OPENAI_API_VERSION,
    azure_endpoint=AZURE_OPENAI_ENDPOINT,
)
    
    response = client.chat.completions.create(
        model=AZURE_OPENAI_DEPLOYMENT,
        messages=messages,
        temperature=0.2,
    )
    content = response.choices[0].message.content
    return extract_json_from_response(content)


@app.post("/analyze")
async def analyze_pdf(file: UploadFile = File(...), regulation: str = Form("rgpd")):
    with NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        text = extract_text_from_pdf(tmp_path)
        messages = build_prompt(text, regulation)
        llm_response = call_llm(messages)
        #json_response = json.loads(llm_response)  # On s'attend à un vrai JSON
        return llm_response
    except Exception as e:
        return {"---error": str(e)}
    finally:
        os.remove(tmp_path)


# Point d’entrée
if __name__ == "__main__":
    pdf_path = "politique-de-confidentialite-mistral.pdf"  # Remplace par ton fichier local

    print("Started main.py")
    print("📄 Lecture du PDF...")
    text = extract_text_from_pdf(pdf_path)

    print("🧠 Construction du prompt...")
    messages = build_prompt(text, 'rgpd')

    print("🤖 Appel au modèle GPT...")
    try:
        result = call_llm(messages)
        print("✅ Réponse JSON :")
        print(json.dumps(result, indent=2, ensure_ascii=False))
    except Exception as e:
        print("❌ Erreur :")
        print(e)

