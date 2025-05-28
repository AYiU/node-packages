const { subtle } = globalThis.crypto;

export async function sha1(string: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(string);
  const hashBuffer = await subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function md5(string: string): Promise<string> {
  // Web Crypto API doesn't support MD5 directly as it's considered insecure
  // This would require a separate implementation or a library
  throw new Error(
    "MD5 is not supported by Web Crypto API due to security concerns",
  );
}
