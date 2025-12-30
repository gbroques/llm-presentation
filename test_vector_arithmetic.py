#!/usr/bin/env python3

from gensim.models import KeyedVectors

def load_glove_vectors(file_path):
    """Load GloVe vectors using gensim KeyedVectors."""
    return KeyedVectors.load_word2vec_format(file_path, binary=False, no_header=True)

def vector_arithmetic(kv, word1, word2, word3, operation="subtract_add"):
    """Perform vector arithmetic: word1 - word2 + word3"""
    try:
        if operation == "subtract_add":
            # Use gensim's built-in most_similar with positive/negative
            similar_words = kv.most_similar(positive=[word1, word3], negative=[word2], topn=5)
        return similar_words, None
    except KeyError as e:
        return None, f"Word not found: {e}"

def test_examples(kv):
    """Test various vector arithmetic examples."""
    examples = [
        # Geographic/Political
        ("china", "taiwan", "russia", "china - taiwan + russia"),
        ("beijing", "china", "russia", "beijing - china + russia"),
        ("washington", "america", "france", "washington - america + france"),
        
        # Grammar patterns
        ("walk", "walked", "run", "walk - walked + run"),
        ("cat", "cats", "dog", "cat - cats + dog"),
        ("good", "better", "bad", "good - better + bad"),
        
        # Creative/Abstract
        ("yeti", "snow", "economics", "yeti - snow + economics"),
        ("vampire", "blood", "plant", "vampire - blood + plant"),
        ("einstein", "physics", "music", "einstein - physics + music"),
        
        # Our best ones
        ("tokyo", "japan", "france", "tokyo - japan + france"),
        ("king", "man", "woman", "king - man + woman"),
        ("brother", "sister", "father", "brother - sister + father"),
    ]
    
    print("Vector Arithmetic Results:")
    print("=" * 50)
    
    for word1, word2, word3, description in examples:
        similar_words, error = vector_arithmetic(kv, word1, word2, word3)
        
        print(f"\n{description}:")
        if error:
            print(f"  Error: {error}")
        else:
            for i, (word, similarity) in enumerate(similar_words, 1):
                print(f"  {i}. {word} ({similarity:.3f})")

if __name__ == "__main__":
    print("Loading GloVe vectors...")
    kv = load_glove_vectors("glove_data/wiki_giga_2024_50_MFT20_vectors_seed_123_alpha_0.75_eta_0.075_combined.txt")
    print(f"Loaded {len(kv)} word vectors")
    
    test_examples(kv)
