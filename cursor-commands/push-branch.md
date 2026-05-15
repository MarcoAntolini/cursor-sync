# Push current branch only

Push **existing local commits** for the **current branch** to its upstream remote (typically `git push`).

**Constraints**

- Do **not** `git add`, `git commit`, `git reset`, rebase, amend, or otherwise change local commits or the working tree.
- If no upstream is set, set it once with `git push -u origin HEAD` (or the branch’s remote-tracking equivalent) so future pushes are plain `git push`.
- If the push is rejected (non-fast-forward), explain why and ask how I want to proceed—do not force-push unless I explicitly request it.
