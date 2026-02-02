const { subtle } = globalThis.crypto;

export async function sha1(string: string | Buffer) {
  return digest(string, "SHA-1");
}

export async function sha512(input: string | Buffer) {
  return digest(input, "SHA-512");
}

export async function digest(
  input: string | Buffer,
  algorithm: "SHA-1" | "SHA-512",
) {
  const inputData =
    typeof input === "string"
      ? new TextEncoder().encode(input)
      : new Uint8Array(input);

  const hashBuffer = await subtle.digest(algorithm, inputData);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function md5(_string: string): Promise<string> {
  // Web Crypto API doesn't support MD5 directly as it's considered insecure
  // This would require a separate implementation or a library
  throw new Error(
    "MD5 is not supported by Web Crypto API due to security concerns",
  );
}
