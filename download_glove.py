#!/usr/bin/env python3
"""
Download GloVe 2024 word embeddings using gensim
"""

from gensim.models import KeyedVectors
import urllib.request
import zipfile
import os

def download_glove():
    print("Downloading GloVe 2024 WikiGiga 50d embeddings...")
    
    # Create data directory
    data_dir = "glove_data"
    os.makedirs(data_dir, exist_ok=True)
    
    # Download URL for GloVe 2024
    url = "https://nlp.stanford.edu/data/wordvecs/glove.2024.wikigiga.50d.zip"
    zip_path = os.path.join(data_dir, "glove.2024.wikigiga.50d.zip")
    
    if not os.path.exists(zip_path):
        print("Downloading...")
        urllib.request.urlretrieve(url, zip_path)
        print("Download complete!")
    
    # Extract
    txt_path = os.path.join(data_dir, "wiki_giga_2024_50_MFT20_vectors_seed_123_alpha_0.75_eta_0.075_combined.txt")
    if not os.path.exists(txt_path):
        print("Extracting...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(data_dir)
        print("Extraction complete!")
    
    # Load with gensim
    print("Loading with gensim...")
    model = KeyedVectors.load_word2vec_format(txt_path, binary=False, no_header=True)
    
    # Test
    print(f"Vector for 'apple': {model['apple'][:5]}...")
    print(f"Most similar to 'apple': {model.most_similar('apple', topn=3)}")
    
    return model

if __name__ == "__main__":
    model = download_glove()
