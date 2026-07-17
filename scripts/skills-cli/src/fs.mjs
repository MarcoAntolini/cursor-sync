import {
  cpSync,
  existsSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join } from "node:path";

export function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function writeJsonAtomic(path, value) {
  const temporaryPath = `${path}.tmp-${process.pid}`;
  writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  renameSync(temporaryPath, path);
}

export function replaceDirectory(source, target) {
  const parent = dirname(target);
  const incoming = join(
    parent,
    `.${basename(target)}.skills-incoming-${process.pid}`,
  );
  const backup = join(
    parent,
    `.${basename(target)}.skills-backup-${process.pid}`,
  );

  rmSync(incoming, { recursive: true, force: true });
  rmSync(backup, { recursive: true, force: true });
  cpSync(source, incoming, { recursive: true, dereference: true });

  try {
    if (existsSync(target)) renameSync(target, backup);
    renameSync(incoming, target);
    rmSync(backup, { recursive: true, force: true });
  } catch (error) {
    rmSync(incoming, { recursive: true, force: true });
    if (!existsSync(target) && existsSync(backup)) renameSync(backup, target);
    throw error;
  }
}
