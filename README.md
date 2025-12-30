# LLM Presentation

The following is an outline for a high-level presentation on understanding the internals of large language models (LLMs).

## Part I - LLMs History & Motivation

Timeline (from most recent to least recent):
* 2025 - Agentic Development (e.g. Kiro, Claude Code)
* 2022 - ChatGPT (GPT-3.5)
* 2019 - GPT-2
* 2018 - GPT-1
* 2017 - Transformer architecture
* 2013 - Word2vec (popularized word embeddings)

TODO: Discuss embeddings more generally:
* Digital media
    + Text
    + Images
    + Audio
    + Video
* Structured data
    + Rows in a spreadsheet or database
* Sequential data
    + Timeseries data
    + Sensor data
    + DNA - sequence of nucleotides (A, T, C, G)
    + Proteins - sequence of amino acids
* Relational / graph data
    + Social networks
    + Knowledge graphs
    + Recommendation systems
    + Molecules - atoms connected by chemical bonds
* 3D models
    + structured - vertices, edges, faces
    + sequential - vertices, edges, faces can have an order
    + relational - vertices, edges, and faces are connected

* Create p5 word_emebbings.svg demo where the points start with random placement, then slowly move to end position over a series of frames.

1. Embeddings - Word embeddings popularized by [Word2vec](https://en.wikipedia.org/wiki/Word2vec) (2013)
2. Transformer architecture - Attention Is All You Need (2017)
3. ChatGPT Launch GPT-3.5 (2022)
    a. One of the fastest adoption curves in technlogical history.
4. Why study GPT-2 (2019)?
5. LLM Evolutionary Tree diagram
  * Base is word embeddings like Word2Vec
  * Pink Encoder-Only branch
  * Green Encoder-Decoder branch
  * Blue-gray Decoder-Only branch
    + GPT-2 at base
    + Claude is an ancestor
6. Main differences between GPT-2 and GPT-3.5 are scale (in terms of both parameter count and training dataset) and training method (GPT-3.5 was additionally fine-tuned with RLHF).
7. Anand claims understanding GPT-2 allows you to understand 80% of state-of-the-art models.

## Part II - LLM Internals Overview

1. LLMs as next-token predictors
  * Illustate how concatenating the next token prediction to the input sequence, and re-running the model with that as input can generate a full text sequence.
2. Next-token prediction overview
  * Tokenization
  * Embeddings
  * Attention
3. Tokenization is the process of splitting text into smaller units called "tokens".
  * Visualize the above definition by surrounding tokens of it in semi-transparent colored boxes, unique colors for each token, with a matching solid colored border similar to the visualization seen on https://gpt-tokenizer.dev/.
4. Token embeddings
5. What are embeddings?
  * Show simple concocted illustration such as https://en.wikipedia.org/wiki/Word_embedding#/media/File:Word_embedding_illustration.svg.
6. Show token embedding matrix with dimensions.
7. Positional embeddings.
  * Motivate with a simple example such as "The mouse scares the elephant" vs. "The elephant scares the mouse".
8. Attention
  * Motivate with a simple example such as "A mouse ran across the kitchen floor." vs. "My mouse stopped scrolling."
  * Show masked attention weights for an example sentence.

## Part III - Attention

The following is an outline of a deep-dive presentation on the attention mechanism within large language models.

## Development Tools

### Extracting Real GPT-2 Embeddings

The presentation uses actual GPT-2 token embeddings for authenticity. To extract embeddings:

1. Create a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On macOS/Linux
   ```

2. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the embedding extraction script:
   ```bash
   python get_embeddings.py
   ```

This script extracts real embedding values from GPT-2's token embedding matrix, which are used in the presentation slides to show authentic data rather than made-up numbers.
