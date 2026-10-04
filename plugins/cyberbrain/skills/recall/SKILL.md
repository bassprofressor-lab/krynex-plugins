---
name: recall
description: Use before searching files, grepping, or reading code to answer a question about this project, and whenever earlier decisions, past bugs, or "why is it like this" might matter. Also when a task touches a file, server, or system the project has history with.
---

# Ask the project's memory first

This project keeps a Cyberbrain store. Rings 0 and 1 are already in your context; they
override everything below them. Rings 2 to 4 are not: ask for them.

1. `cyberbrain recall "<the question in the words you would use>"` — hybrid search, every
   hit carries a citation like `r2-a91f2c33e1bd`. A smaller ring number means more trust.
2. `cyberbrain recall --id <citation>` expands a hit to the full note.
3. `cyberbrain find <symbol>` gives exact line ranges from the code index; read only that
   range, not the whole file.

Rules:

- A hit marked `conflict` means a lower ring disagrees. The lower ring wins; say so.
- Quote the citation when you rely on a note. A claim from memory without a citation is a
  guess.
- A note is a snapshot. If it names a file, flag, or command, check that it still exists
  before you recommend it.
- No hit is not proof of absence: the note may use other words. Try the words a person with
  the problem would use, then search the code.
