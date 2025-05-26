import crypto from "node:crypto";

export function sha1(string: crypto.BinaryLike) {
  return crypto.createHash("sha1").update(string).digest("hex");
}

export function md5(string: crypto.BinaryLike) {
  return crypto.createHash("md5").update(string).digest("hex");
}
