// Server-side encryption/decryption for cookies using Node crypto (AES-256-GCM)
import crypto from "crypto";

function getSecret(): Buffer {
  console.log(3)
  const secret = process.env.NEXT_PUBLIC_COOKIE_SECRET || "";
  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("NEXT_PUBLIC_COOKIE_SECRET is not set. Using a weak default for development only.");
      return Buffer.from("dev-insecure-secret");
    }
  }
  try {
    // Derive 32-byte key via SHA-256
    return crypto.createHash("sha256").update(secret).digest();
  } catch (e) {
    console.warn(3, e.message)
  }
}

function toBase64Url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(b64url: string): Buffer {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64url.length + 3) % 4);
  return Buffer.from(b64, "base64");
}

export function encryptValueServer(plain: string): string {
  const key = getSecret();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  const out = Buffer.concat([iv, enc, tag]); // iv + ciphertext + tag
  return toBase64Url(out);
}

export function decryptValueServer(payload: string | null): string | null {
  if (!payload) return null;
  try {
    const key = getSecret();
    const buf = fromBase64Url(payload);

    if (buf.length < 12 + 16) {
      throw new Error("Malformed payload");
    }

    const iv = buf.subarray(0, 12);
    const rest = buf.subarray(12);

    let ciphertext = rest.subarray(0, rest.length - 16);
    let tag = rest.subarray(rest.length - 16);

    const tryDecrypt = (data: Buffer, atag: Buffer) => {
      const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
      decipher.setAuthTag(atag);
      const dec = Buffer.concat([decipher.update(data), decipher.final()]);
      return dec.toString("utf8");
    };

    try {
      return tryDecrypt(ciphertext, tag);
    } catch {

      const legacyTag = rest.subarray(0, 16);
      const legacyCiphertext = rest.subarray(16);
      return tryDecrypt(legacyCiphertext, legacyTag);
    }
  } catch (e) {
    console.warn("Failed to decrypt cookie value (server)", e);
    return null;
  }
}
