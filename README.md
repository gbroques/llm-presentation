# LLM Presentation

The following is an outline for a high-level presentation on understanding the internals of large language models (LLMs).

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
