import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  composeInvocation,
  nextState,
  parseArgs,
  readEnvFile,
  readReleaseState,
  validateReleaseName,
  withDeploymentLock,
  writeReleaseState,
} from "./deployment-common.mjs";

describe("deployment argument parsing", () => {
  it("supports repeated compose files and explicit safety flags", () => {
    expect(parseArgs([
      "--release",
      "abc123",
      "--compose-file",
      "compose.production.yml",
      "--compose-file",
      "compose.preproduction.yml",
      "--confirm",
    ])).toEqual({
      values: {
        release: "abc123",
        composeFiles: ["compose.production.yml", "compose.preproduction.yml"],
      },
      flags: new Set(["confirm"]),
    });
  });

  it("rejects release names that could become unsafe image tags", () => {
    expect(validateReleaseName("release-20260726")).toBe("release-20260726");
    expect(() => validateReleaseName("../latest")).toThrow(/Release/);
    expect(() => validateReleaseName("contains spaces")).toThrow(/Release/);
  });

  it("rejects unknown deployment options instead of silently ignoring typos", () => {
    expect(() => parseArgs(["--comfirm", "true"])).toThrow(/Unknown option/);
  });

  it("builds deterministic compose arguments", () => {
    expect(composeInvocation({
      envFile: ".env.production",
      composeFiles: ["a.yml", "b.yml"],
    })).toEqual([
      "compose",
      "--env-file",
      ".env.production",
      "-f",
      "a.yml",
      "-f",
      "b.yml",
    ]);
  });
});

describe("deployment state", () => {
  it("moves the active release to previous and keeps unique history", () => {
    const oldRelease = { release: "old", image: "app:old", deployedAt: "old-date" };
    const newRelease = { release: "new", image: "app:new", deployedAt: "new-date" };
    const state = nextState(
      { schemaVersion: 1, current: oldRelease, previous: null, history: [oldRelease] },
      newRelease,
    );
    expect(state.current).toEqual(newRelease);
    expect(state.previous).toEqual(oldRelease);
    expect(state.history).toEqual([newRelease, oldRelease]);
  });

  it("persists state atomically and prevents overlapping deployments", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "qiaoshen-deploy-"));
    const release = { release: "one", image: "app:one", deployedAt: "now" };
    await writeReleaseState(directory, nextState(
      { schemaVersion: 1, current: null, previous: null, history: [] },
      release,
    ));
    expect((await readReleaseState(directory)).current).toEqual(release);

    await withDeploymentLock(directory, async () => {
      await expect(withDeploymentLock(directory, async () => undefined))
        .rejects.toThrow(/Another deployment/);
    });
  });
});

describe("environment file parsing", () => {
  it("reads values without evaluating shell syntax", async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "qiaoshen-env-"));
    const file = path.join(directory, ".env");
    await writeFile(file, [
      "# comment",
      "APP_ORIGIN=https://example.test",
      "QUOTED=\"hello world\"",
      "LITERAL=$(do-not-run)",
    ].join("\n"));
    await expect(readEnvFile(file)).resolves.toEqual({
      APP_ORIGIN: "https://example.test",
      QUOTED: "hello world",
      LITERAL: "$(do-not-run)",
    });
  });
});
