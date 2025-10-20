import crypto from "crypto";

function base64UrlEncode(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
    .slice(0, 200);
}

function deterministic(
  phrase,
  salt,
  bytes = 32,
  iterations = 100_000,
  digest = "sha256"
) {
  const derived = crypto.pbkdf2Sync(
    phrase,
    crypto.randomBytes(salt),
    bytes,
    iterations,
    digest
  );
  return base64UrlEncode(derived);
}

function hash(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export { deterministic, hash };
