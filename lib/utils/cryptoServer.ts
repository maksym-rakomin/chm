// Server-side encryption/decryption for cookies using Node crypto (AES-256-GCM)
import crypto from "crypto";

function getSecret(): Buffer {
  const secret = process.env.COOKIE_SECRET || process.env.NEXT_PUBLIC_COOKIE_SECRET || "";
  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("COOKIE_SECRET is not set. Using a weak default for development only.");
      return Buffer.from("dev-insecure-secret");
    }
  }
  // Derive 32-byte key via SHA-256
  return crypto.createHash("sha256").update(secret).digest();
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
  const out = Buffer.concat([iv, tag, enc]); // iv(12) + tag(16) + ciphertext
  return toBase64Url(out);
}

export function decryptValueServer(payload: string | null): string | null {
  if (!payload) return null;
  try {
    const key = getSecret();
    const buf = fromBase64Url(payload);
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const data = buf.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(data), decipher.final()]);
    return dec.toString("utf8");
  } catch (e) {
    console.warn("Failed to decrypt cookie value (server)", e);
    return null;
  }
}
