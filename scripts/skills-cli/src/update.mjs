import {
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { discoverSkills } from "./discover.mjs";
import { readJson, replaceDirectory, writeJsonAtomic } from "./fs.mjs";
import { runOfficial } from "./official.mjs";
import {
  createStepper,
  header,
  info,
  skillLine,
  summary,
  warn,
} from "./ui.mjs";

export async function updateSkills(
  agentsHome,
  skillsRoot,
  lockPath,
  requestedNames,
) {
  header("update", agentsHome);
  const step = createStepper();

  try {
    if (!existsSync(lockPath)) {
      throw new Error(`global lock file not found: ${lockPath}`);
    }

    step.start("Discovering skills");
    const locations = discoverSkills(skillsRoot);
    step.succeed(`Discovered ${locations.size} skill(s)`);

    step.start("Reading lock file");
    const originalLock = readJson(lockPath);
    const lockedSkills = originalLock.skills ?? {};
    const names =
      requestedNames.length > 0
        ? requestedNames
        : Object.keys(lockedSkills).filter((name) => locations.has(name));
    step.succeed(
      requestedNames.length > 0
        ? `Validating ${names.length} requested skill(s)`
        : `Selected ${names.length} locked skill(s)`,
    );

    if (names.length === 0) {
      warn("No installed, locked skills were found.");
      summary({ checked: 0, unchanged: 0, updated: 0 });
      return 0;
    }

    for (const name of names) {
      if (!lockedSkills[name]) {
        throw new Error(`skill is not present in ${lockPath}: ${name}`);
      }
      if (!locations.has(name)) {
        throw new Error(
          `cannot locate ${name} recursively under ${skillsRoot}; no files were changed`,
        );
      }
    }

    const stagingHome = mkdtempSync(join(tmpdir(), "skills-update-"));
    const stagingAgents = join(stagingHome, ".agents");
    const stagingLockPath = join(stagingAgents, ".skill-lock.json");
    const stagingSkillsRoot = join(stagingAgents, "skills");

    try {
      step.start("Preparing staging environment");
      mkdirSync(stagingSkillsRoot, { recursive: true });
      cpSync(lockPath, stagingLockPath);
      step.succeed("Staging environment ready");

      step.start(`Running official update for ${names.length} skill(s)`);
      // Finish the spinner before inheriting stdio so upstream output is clean.
      step.succeed(
        `Delegating to npx skills update (${names.length} skill(s))`,
      );
      info("Official CLI output follows…");
      console.log();

      const environment = {
        ...process.env,
        HOME: stagingHome,
        USERPROFILE: stagingHome,
        AGENTS_HOME: stagingAgents,
      };
      const status = await runOfficial(["update", "-g", "-y", ...names], {
        env: environment,
      });
      if (status !== 0) {
        summary({
          checked: names.length,
          unchanged: 0,
          updated: 0,
          failed: names.length,
        });
        return status;
      }

      console.log();
      step.start("Comparing skill hashes");
      const stagedLock = readJson(stagingLockPath);
      const changedNames = names.filter(
        (name) =>
          stagedLock.skills?.[name]?.skillFolderHash !==
          originalLock.skills?.[name]?.skillFolderHash,
      );
      const unchanged = names.length - changedNames.length;
      step.succeed(
        changedNames.length === 0
          ? "All skills already up to date"
          : `${changedNames.length} skill(s) changed, ${unchanged} unchanged`,
      );

      if (changedNames.length === 0) {
        summary({
          checked: names.length,
          unchanged: names.length,
          updated: 0,
        });
        return 0;
      }

      info(`Applying ${changedNames.length} update(s) in place…`);

      const successfullyReplaced = [];
      for (const name of changedNames) {
        const stagedSkill = join(stagingSkillsRoot, name);
        if (!existsSync(stagedSkill) || !lstatSync(stagedSkill).isDirectory()) {
          throw new Error(`updated files were not staged for ${name}`);
        }

        replaceDirectory(stagedSkill, locations.get(name));
        successfullyReplaced.push(name);
        skillLine(name, relative(skillsRoot, locations.get(name)));
      }

      step.start("Writing lock file");
      const currentLock = readJson(lockPath);
      currentLock.skills ??= {};
      for (const name of successfullyReplaced) {
        currentLock.skills[name] = stagedLock.skills[name];
      }
      writeJsonAtomic(lockPath, currentLock);
      step.succeed("Lock file updated");

      summary({
        checked: names.length,
        unchanged,
        updated: successfullyReplaced.length,
      });
      return 0;
    } finally {
      rmSync(stagingHome, { recursive: true, force: true });
    }
  } catch (error) {
    step.silence();
    throw error;
  }
}
