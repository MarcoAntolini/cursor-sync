const isTty = Boolean(process.stdout.isTTY);
const useColor =
  isTty &&
  !process.env.NO_COLOR &&
  process.env.FORCE_COLOR !== "0" &&
  process.env.TERM !== "dumb";

const ansi = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

function paint(code, text) {
  if (!useColor) return text;
  return `${code}${text}${ansi.reset}`;
}

export const color = {
  dim: (text) => paint(ansi.dim, text),
  bold: (text) => paint(ansi.bold, text),
  cyan: (text) => paint(ansi.cyan, text),
  green: (text) => paint(ansi.green, text),
  yellow: (text) => paint(ansi.yellow, text),
  red: (text) => paint(ansi.red, text),
  magenta: (text) => paint(ansi.magenta, text),
};

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function flush() {
  try {
    process.stdout.write("");
    process.stderr.write("");
  } catch {
    // ignore
  }
}

export function header(command, agentsHome) {
  console.log();
  console.log(
    `${color.bold(color.cyan("skills-tree"))} ${color.bold(command)}`,
  );
  console.log(color.dim(`  agents home  ${agentsHome}`));
  console.log();
  flush();
}

export function info(message) {
  console.log(`  ${color.dim("·")} ${message}`);
}

export function success(message) {
  console.log(`  ${color.green("✓")} ${message}`);
}

export function warn(message) {
  console.log(`  ${color.yellow("!")} ${message}`);
}

export function fail(message) {
  console.error(`  ${color.red("✗")} ${message}`);
}

export function skillLine(name, location) {
  console.log(
    `  ${color.green("→")} ${color.bold(name)} ${color.dim(`at ${location}`)}`,
  );
}

export function forwardNotice(args) {
  console.log(
    `${color.dim("→")} ${color.cyan("npx skills")} ${args.join(" ")}`,
  );
  console.log();
  flush();
}

/**
 * @returns {{ start: (label: string) => void, succeed: (label?: string) => void, fail: (label?: string) => void, update: (label: string) => void }}
 */
export function createStepper() {
  let frameIndex = 0;
  let timer = null;
  let currentLabel = "";
  let active = false;

  function clearLine() {
    if (!isTty) return;
    process.stdout.write("\r\x1b[2K");
  }

  function stopSpinner() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function renderSpinner() {
    const frame = SPINNER_FRAMES[frameIndex % SPINNER_FRAMES.length];
    frameIndex += 1;
    process.stdout.write(
      `\r  ${color.cyan(frame)} ${currentLabel}${color.dim("…")}`,
    );
  }

  return {
    start(label) {
      this.succeed();
      currentLabel = label;
      active = true;

      if (!isTty) {
        console.log(`  ${color.dim("…")} ${label}`);
        return;
      }

      frameIndex = 0;
      renderSpinner();
      timer = setInterval(renderSpinner, 80);
    },

    update(label) {
      currentLabel = label;
      if (!isTty || !active) return;
      renderSpinner();
    },

    succeed(label = currentLabel) {
      if (!active && !label) return;
      stopSpinner();
      if (active) {
        clearLine();
        console.log(`  ${color.green("✓")} ${label || currentLabel}`);
      }
      active = false;
      currentLabel = "";
    },

    fail(label = currentLabel) {
      if (!active && !label) return;
      stopSpinner();
      if (active) {
        clearLine();
        console.error(`  ${color.red("✗")} ${label || currentLabel}`);
      }
      active = false;
      currentLabel = "";
    },

    /** Stop an in-flight step without printing (for error paths that log elsewhere). */
    silence() {
      stopSpinner();
      if (active && isTty) clearLine();
      active = false;
      currentLabel = "";
    },
  };
}

/**
 * @param {{ checked?: number, unchanged?: number, updated?: number, failed?: number }} counts
 */
export function summary(counts) {
  const parts = [];
  if (counts.checked != null) {
    parts.push(`${counts.checked} checked`);
  }
  if (counts.unchanged != null) {
    parts.push(`${color.dim(`${counts.unchanged} unchanged`)}`);
  }
  if (counts.updated != null) {
    parts.push(`${color.green(`${counts.updated} updated`)}`);
  }
  if (counts.failed != null && counts.failed > 0) {
    parts.push(`${color.red(`${counts.failed} failed`)}`);
  }

  console.log();
  console.log(`  ${color.bold("Summary")}  ${parts.join(color.dim(" · "))}`);
  console.log();
}

export function errorMessage(message) {
  console.error(`${color.red("skills-tree:")} ${message}`);
}
