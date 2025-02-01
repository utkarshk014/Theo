import google.generativeai as genai
from typing import Optional, List, Dict

class BaseGeminiService:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')