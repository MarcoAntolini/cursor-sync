import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export function parseSkillName(skillFile, fallback) {
  const contents = readFileSync(skillFile, "utf8");
  const frontmatter = contents.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  const name = frontmatter?.[1].match(/^name:\s*["']?([^"'#\r\n]+?)["']?\s*$/m);
  return name?.[1].trim() || fallback;
}

export function discoverSkills(root) {
  const locations = new Map();
  const duplicates = new Map();

  function visit(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (!entry.isDirectory()) continue;

      const skillFile = join(path, "SKILL.md");
      if (existsSync(skillFile)) {
        const name = parseSkillName(skillFile, entry.name);
        if (locations.has(name)) {
          duplicates.set(name, [locations.get(name), path]);
        } else {
          locations.set(name, path);
        }
      } else {
        visit(path);
      }
    }
  }

  if (existsSync(root)) visit(root);

  if (duplicates.size > 0) {
    const details = [...duplicates]
      .map(([name, paths]) => `  ${name}:\n    ${paths.join("\n    ")}`)
      .join("\n");
    throw new Error(`duplicate skill names found:\n${details}`);
  }

  return locations;
}
