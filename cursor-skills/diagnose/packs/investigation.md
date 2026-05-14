# Phase 2 — Investigation

You have a feedback loop and a reproducible failure. Now figure out what's actually going on **before proposing fixes**.

When exploring the codebase, use the project's domain glossary to get a clear mental model of the relevant modules, and check ADRs in the area you're touching.

## 1. Read error messages carefully

- Don't skip past errors or warnings — they often contain the exact solution
- Read stack traces completely
- Note line numbers, file paths, error codes

## 2. Confirm reproducibility

- Can you trigger it reliably?
- What are the exact steps?
- Does it happen every time?
- If not reproducible → go back to Phase 1 (feedback loop), don't guess

## 3. Check recent changes

- Git diff, recent commits
- New dependencies, config changes
- Environmental differences
- "It worked yesterday" → what changed?

## 4. Gather evidence in multi-component systems

**WHEN the system has multiple components** (CI → build → signing, API → service → database):

**BEFORE proposing fixes, add diagnostic instrumentation:**

```
For EACH component boundary:
  - Log what data enters the component
  - Log what data exits the component
  - Verify environment/config propagation
  - Check state at each layer

Run once to gather evidence showing WHERE it breaks
THEN analyze evidence to identify the failing component
THEN investigate that specific component
```

**Example (multi-layer system):**

```bash
# Layer 1: Workflow
echo "=== Secrets available in workflow: ==="
echo "IDENTITY: ${IDENTITY:+SET}${IDENTITY:-UNSET}"

# Layer 2: Build script
echo "=== Env vars in build script: ==="
env | grep IDENTITY || echo "IDENTITY not in environment"

# Layer 3: Signing script
echo "=== Keychain state: ==="
security list-keychains
security find-identity -v

# Layer 4: Actual signing
codesign --sign "$IDENTITY" --verbose=4 "$APP"
```

**This reveals:** Which layer fails (secrets → workflow ✓, workflow → build ✗).

## 5. Trace data flow when error is deep in call stack

See [`../references/root-cause-tracing.md`](../references/root-cause-tracing.md) for the complete backward tracing technique.

**Quick version:**
- Where does the bad value originate?
- What called this with the bad value?
- Keep tracing up until you find the source
- Fix at source, not at symptom

## 6. Find working examples

- Locate similar working code in the same codebase
- What works that's similar to what's broken?
- If implementing a known pattern, read the reference implementation **completely** — don't skim
- What's different between working and broken? List **every** difference, however small. Don't assume "that can't matter."

## 7. Understand dependencies

- What other components does this need?
- What settings, config, environment does it depend on?
- What assumptions does it make?
