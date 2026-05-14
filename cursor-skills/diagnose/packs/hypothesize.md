# Phase 3 — Hypothesize

Generate **3–5 ranked hypotheses** before testing any of them. Single-hypothesis generation anchors on the first plausible idea — that's how flailing starts.

## Format

Each hypothesis must be **falsifiable**: state the prediction it makes.

> Format: "If <X> is the cause, then <changing Y> will make the bug disappear / <changing Z> will make it worse."

If you cannot state the prediction, the hypothesis is a vibe — discard or sharpen it.

## Rank, then show the list

Show the ranked list to the user **before testing**. They often have domain knowledge that re-ranks instantly ("we just deployed a change to #3"), or know hypotheses they've already ruled out. Cheap checkpoint, big time saver. Don't block on it — proceed with your ranking if the user is AFK.

## Test the top hypothesis minimally

Scientific method:

1. **State it clearly.** "I think X is the root cause because Y." Write it down. Be specific, not vague.
2. **Test minimally.** Make the SMALLEST possible change to test the hypothesis. **One variable at a time.** Don't fix multiple things at once.
3. **Verify before continuing.**
   - Worked? → Proceed to instrument-and-fix
   - Didn't work? → Form a NEW hypothesis from the next-ranked candidate
   - **DON'T** add more fixes on top
4. **When you don't know.** Say "I don't understand X." Don't pretend to know. Ask for help. Research more.

## Why ranked, not single

A single hypothesis is psychologically sticky — you'll keep finding reasons it's right even when evidence says otherwise. Multiple ranked candidates force you to evaluate each one's prediction against the loop output, and your top pick is no longer "the answer" but "the one I'll test first."
