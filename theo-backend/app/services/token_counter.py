from typing import Dict, Optional
import tiktoken  

class TokenCounter:
    def __init__(self):
        # Using GPT-3.5 encoder as it's close to what most models use
        self.encoder = tiktoken.encoding_for_model("gpt-3.5-turbo")
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in a piece of text"""
        return len(self.encoder.encode(text))
    
    def count_conversation_tokens(self, messages: list) -> int:
        """Count total tokens in a list of messages"""
        total = 0
        for message in messages:
            total += self.count_tokens(message.content)
        return total