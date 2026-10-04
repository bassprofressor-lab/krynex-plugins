---
name: write
description: Use when you learned something in this session that should outlive it — a decision, a bug and its cause, a lesson, a fact about a system — or when the user says "remember", "merk dir", "note this", or the work is about to end.
---

# Write it down so the next session can find it

`cyberbrain write --ring 2 --kind knowledge|bug|lesson|decision|reference --name <kebab-slug> --body '...'`

Ring 2 is project knowledge, ring 3 the session record. **Rings 0 and 1 belong to the
operator: never write them.** Offer text instead with
`cyberbrain propose --ring 0 --kind decision --name <slug> --body '...'`; a different person
accepts it.

## The first line decides whether it is ever found

Begin the body with an italic `*Für:` line (or `*For:`): four to eight occasions, separated
by ` · `, in **the words of someone who has the problem and does not know the answer yet** —
symptoms, error text, half sentences, even the wrong guess. Not the words of the answer.

```
*Für: redis upgrade geplant · kann ich zurück · RDB-Format · Rollback Redis*
```

Then the fact, with the date and where it was checked. Link related notes with `[[slug]]`.

Do not write: what the code or git history already says, secrets, personal data, or scratch
context that only matters to this task. Before writing, recall whether a note already covers
it and update that one instead.

Never edit files under `.cyberbrain/` directly; the hook refuses it, because a raw write skips
the PII check, the audit row, and the reindex.
