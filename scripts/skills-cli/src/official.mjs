import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { color } from "./ui.mjs";

export function npxInvocation(args) {
  if (process.platform !== "win32") {
    return { command: "npx", args: ["--yes", "skills", ...args] };
  }

  const npxCli = join(
    dirname(process.execPath),
    "node_modules",
    "npm",
    "bin",
    "npx-cli.js",
  );
  if (!existsSync(npxCli)) {
    throw new Error(`cannot locate the npx CLI beside ${process.execPath}`);
  }

  return {
    command: process.execPath,
    args: [npxCli, "--yes", "skills", ...args],
  };
}

function resolveGithubToken() {
  if (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) {
    return process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  }

  try {
    const result = spawnSync("gh", ["auth", "token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      shell: false,
      timeout: 5000,
    });
    const token = result.stdout?.trim();
    if (result.status === 0 && token) return token;
  } catch {
    // gh not installed or not logged in
  }
  return null;
}

/**
 * Run the official skills CLI with inherited stdio and periodic stderr
 * heartbeats so long npx / GitHub waits aren't silent.
 *
 * @returns {Promise<number>}
 */
export function runOfficial(args, options = {}) {
  const invocation = npxInvocation(args);
  const env = { ...process.env, ...(options.env ?? {}) };

  const token = resolveGithubToken();
  if (token) {
    env.GITHUB_TOKEN ??= token;
    env.GH_TOKEN ??= token;
  }

  const startedAt = Date.now();
  let heartbeat = null;
  const isTty = Boolean(process.stderr.isTTY);

  if (isTty) {
    process.stderr.write(
      `  ${color.dim("Waiting on official CLI (npx / GitHub API)…")}\n`,
    );
    heartbeat = setInterval(() => {
      const seconds = Math.round((Date.now() - startedAt) / 1000);
      process.stderr.write(
        `  ${color.dim(`… still working (${seconds}s) — Ctrl+C to cancel`)}\n`,
      );
    }, 15000);
  }

  return new Promise((resolve, reject) => {
    const child = spawn(invocation.command, invocation.args, {
      stdio: "inherit",
      shell: false,
      ...options,
      env,
    });

    child.on("error", (error) => {
      if (heartbeat) clearInterval(heartbeat);
      reject(error);
    });

    child.on("close", (code, signal) => {
      if (heartbeat) clearInterval(heartbeat);
      if (signal) {
        resolve(1);
        return;
      }
      resolve(code ?? 1);
    });
  });
}
