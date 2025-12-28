#!/usr/bin/env python3
"""
Extract actual GPT-2 token embeddings for use in the presentation.
This script gets the real embedding values for specific tokens.
"""

from transformers import GPT2Tokenizer, GPT2Model
import torch

def get_token_embedding(text, model_name="gpt2"):
    """Get the embedding for a specific token."""
    tokenizer = GPT2Tokenizer.from_pretrained(model_name)
    model = GPT2Model.from_pretrained(model_name)
    
    # Tokenize the text
    tokens = tokenizer.encode(text)
    print(f"Text: '{text}'")
    print(f"Token IDs: {tokens}")
    
    # Get embeddings for each token
    for i, token_id in enumerate(tokens):
        token_text = tokenizer.decode([token_id])
        embedding = model.wte.weight[token_id].detach().numpy()
        
        print(f"\nToken {i}: '{token_text}' (ID: {token_id})")
        print(f"Embedding shape: {embedding.shape}")
        print(f"First 10 values: {embedding[:10].round(2).tolist()}")
        print(f"Last 5 values: {embedding[-5:].round(2).tolist()}")
        
        # Format for presentation (first 5 and last 1)
        presentation_values = embedding[:5].round(2).tolist() + ["..."] + [embedding[-1].round(2)]
        print(f"For presentation: {presentation_values}")

if __name__ == "__main__":
    # Extract embedding for "Mike" token
    get_token_embedding("Mike")
