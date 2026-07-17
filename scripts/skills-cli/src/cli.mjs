import { homedir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { discoverSkills } from "./discover.mjs";
import { runOfficial } from "./official.mjs";
import { updateSkills } from "./update.mjs";
import {
  color,
  createStepper,
  errorMessage,
  forwardNotice,
  header,
  summary,
} from "./ui.mjs";

const HELP = `Usage: skills-tree <command> [options]
       skills <command> [options]          (via shell wrapper)

Hierarchy-aware commands:
  check                 Check global skills for updates
  update [skills...]    Update global skills in their current locations
  locations             Show discovered root and nested skill locations

All other commands are forwarded to the official npx skills CLI.

Environment:
  AGENTS_HOME           Override ~/.agents (useful for testing)
  NO_COLOR              Disable ANSI colors
  GITHUB_TOKEN / GH_TOKEN   Used for GitHub API (auto-filled from \`gh auth token\` when possible)
`;

function showLocations(agentsHome, skillsRoot) {
  header("locations", agentsHome);
  const step = createStepper();

  try {
    step.start("Discovering skills");
    const locations = discoverSkills(skillsRoot);
    step.succeed(`Found ${locations.size} skill(s)`);
    console.log();

    const rows = [...locations]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([name, path]) => {
        const location = relative(skillsRoot, path);
        const kind = dirname(location) === "." ? "root" : "nested";
        const kindText = kind.padEnd(7);
        const kindLabel =
          kind === "root" ? color.dim(kindText) : color.magenta(kindText);
        return `  ${color.bold(name.padEnd(34))} ${kindLabel} ${color.dim(location)}`;
      });

    console.log(rows.join("\n"));
    summary({ checked: locations.size });
    return 0;
  } catch (error) {
    step.silence();
    throw error;
  }
}

export async function main(argv = process.argv.slice(2)) {
  const args = argv;
  const command = args[0];
  const agentsHome = resolve(
    process.env.AGENTS_HOME || join(homedir(), ".agents"),
  );
  const skillsRoot = join(agentsHome, "skills");
  const lockPath = join(agentsHome, ".skill-lock.json");

  if (!command || command === "--help" || command === "-h") {
    console.log(HELP);
    return 0;
  }

  if (command === "locations") {
    return showLocations(agentsHome, skillsRoot);
  }

  if (command === "check") {
    header("check", agentsHome);
    const forwarded = ["check", "-g", ...args.slice(1)];
    forwardNotice(forwarded);
    return runOfficial(forwarded);
  }

  if (command === "update" || command === "upgrade") {
    const names = args.slice(1).filter((arg) => !arg.startsWith("-"));
    return updateSkills(agentsHome, skillsRoot, lockPath, names);
  }

  forwardNotice(args);
  return runOfficial(args);
}

export async function run(argv) {
  try {
    process.exitCode = await main(argv);
  } catch (error) {
    errorMessage(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
