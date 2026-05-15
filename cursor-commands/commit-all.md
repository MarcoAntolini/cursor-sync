# Commit all changes (smart message)

Follow the project skill **git-smart-commit** at `.cursor/skills/git-smart-commit/SKILL.md`.

1. Stage **all** changes with `git add -A`.
2. Inspect `git status` and `git diff --staged`; write **one** commit with a message that matches the skill (**Conventional Commits 1.0.0**: header `type(scope)!: description`, optional body, optional footers including `BREAKING CHANGE:` when applicable).
3. Create the commit. **Do not** push unless I explicitly ask you to push in this message.
4. After a **successful** commit, **always paste the full commit message into the chat** for me—the exact text Git recorded (header, body, footers), e.g. from `git log -1 --format=%B`; do not only say “committed” without the message.

If there is nothing to commit, report that and stop.
