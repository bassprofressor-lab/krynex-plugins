---
name: handoff
description: Use before starting a subagent or parallel agents on the same task, and before ending a session that someone else (or a later session) will continue.
---

# Hand over what is known, with citations

A subagent starts without this session's context. Three agents that each search from zero
search the same tree three times, and their results can disagree without anyone noticing.

**Gather once, then pass it on.**

1. Write a throwaway file in your scratchpad (not in the store): the `recall` citations you
   relied on, the `find` line ranges, findings already checked, and what is still open.
2. Name that file in the subagent's prompt and tell it to read the file instead of
   repeating the search.
3. Keep citations as citations (`r2-…`), so the subagent can expand them with
   `cyberbrain recall --id` rather than trusting your paraphrase.

For the end of a session: record a ring-3 note named `uebergabe-<date>` (or `handoff-<date>`)
with what was done, what is live, what is open and for whom, using the `write` skill. Its
`*Für:` line uses the words of whoever picks it up next ("where do I continue", "what is open").

Do not put the throwaway file into the store: ring 3 is the session record, not a task's
scratchpad, and indexing scratch dilutes the very hit list the `*Für:` line is there for.
