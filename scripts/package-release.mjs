import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { access, copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const args = process.argv.slice(2);

function option(name) {
  const index = args.indexOf(name);
  return index < 0 ? undefined : args[index + 1];
}

const version = option("--version");
const outputArgument = option("--out");
if (!version || version === "." || version === ".." || !/^[A-Za-z0-9._-]+$/.test(version)) {
  throw new Error("Pass a path-safe immutable version with --version <version>.");
}

const output = resolve(root, outputArgument ?? `release/${version}`);
const relativeOutput = output.startsWith(`${root}${sep}`) ? output.slice(root.length + 1) : undefined;
if (!relativeOutput || relativeOutput === ".") {
  throw new Error("The package output directory must be inside the repository.");
}

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const sourceSha = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
const status = execFileSync("git", ["status", "--porcelain", "--untracked-files=all"], {
  cwd: root,
  encoding: "utf8"
}).trim();
if (status) throw new Error("Refusing to package a dirty source checkout.");

const lockPath = join(root, "package-lock.json");
const lockHash = sha256(await readFile(lockPath));
const evidencePaths = [
  "docs/evidence/verification-results.json",
  "docs/evidence/browser-results.json",
  "docs/evidence/improvement/README.md"
];
const evidence = [];
for (const path of evidencePaths) {
  evidence.push({ path, sha256: sha256(await readFile(join(root, path))) });
}

const payloadPaths = [
  "index.html",
  "src/app.js",
  "src/bootstrap.js",
  "src/content.js",
  "src/evaluator.js",
  "src/format.js",
  "src/session.js",
  "src/style.css"
];
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

const files = [];
for (const path of payloadPaths) {
  const sourcePath = join(root, path);
  const bytes = await readFile(sourcePath);
  const fileStat = await stat(sourcePath);
  files.push({
    path,
    bytes: fileStat.size,
    sha256: sha256(bytes),
    contentType: contentTypes[extname(path)] ?? "application/octet-stream"
  });
}

const aggregateBuildHash = sha256(JSON.stringify(files));
const verificationRecord = JSON.parse(
  await readFile(join(root, "docs/evidence/verification-results.json"), "utf8")
);
const manifest = {
  schemaVersion: 1,
  gameSlug: "night-relay",
  releaseVersion: version,
  sourceSha,
  dependencyLockIdentity: `package-lock.json#sha256:${lockHash}`,
  aggregateBuildHash,
  publishedR2Prefix: `night-relay/${version}/`,
  entryFile: "index.html",
  files,
  validationEvidenceRefs: evidence,
  evidenceScope: {
    verificationRecord: {
      path: evidence[0].path,
      sha256: evidence[0].sha256,
      recordedImplementationCommit: verificationRecord.implementation_commit,
      recordedBaseSha: verificationRecord.base_sha
    },
    hostedCi: "not-recorded-for-this-packaging-commit",
    acceptance: "pending",
    productionPromotion: "not-authorized"
  }
};

try {
  await access(output);
  throw new Error(`Refusing to overwrite an existing immutable output directory: ${relativeOutput}`);
} catch (error) {
  if (error instanceof Error && error.message.startsWith("Refusing to overwrite")) throw error;
}
await mkdir(output, { recursive: true });
for (const file of files) {
  const destination = join(output, file.path);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(join(root, file.path), destination);
}
await writeFile(join(output, "release-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

process.stdout.write(
  `Packaged ${files.length} local files for ${manifest.publishedR2Prefix}\n` +
    `source=${sourceSha}\naggregate=${aggregateBuildHash}\noutput=${relativeOutput}\n`
);
