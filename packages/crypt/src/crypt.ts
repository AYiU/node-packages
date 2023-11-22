import crypto from "node:crypto";

const iv = crypto.randomBytes(16);

export class Crypt {
  constructor(private secretKey: string) {}

  encrypt(text: string) {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(this.secretKey),
      iv
    );
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString("hex");
  }

  decrypt(encryptedText: string) {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(this.secretKey),
      iv
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encryptedText, "hex")),
      decipher.final(),
    ]);
    return decrypted.toString();
  }
}
