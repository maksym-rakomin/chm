// Client-side encryption/decryption for cookies using Web Crypto (AES-GCM)
// WARNING: Requires NEXT_PUBLIC_COOKIE_SECRET to be defined. This provides confidentiality at-rest in cookies,
// but since the secret is present on the client, it does not protect against a fully compromised client.

function getSecret(): string {
  const secret = process.env.NEXT_PUBLIC_COOKIE_SECRET || "";
  if (!secret) {
    // In dev, fall back to a default to avoid crashes, but log a warning
    if (process.env.NODE_ENV !== "production") {
      console.warn("NEXT_PUBLIC_COOKIE_SECRET is not set. Using a weak default for development only.");
      return "dev-insecure-secret";
    }
  }
  return secret;
}

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const secretBytes = enc.encode(getSecret());
  // Derive a 256-bit key from the secret using SHA-256
  const hash = await crypto.subtle.digest("SHA-256", secretBytes);
  return crypto.subtle.importKey(
    "raw",
    hash,
    { name: "AES-GCM" },
    false,
    ["encrypt", "decrypt"]
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let str = typeof Buffer !== "undefined" ? Buffer.from(bytes).toString("base64") : btoa(String.fromCharCode(...bytes));
  return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64url.length + 3) % 4);
  const bin = typeof Buffer !== "undefined" ? Buffer.from(b64, "base64") : atob(b64);
  if (typeof bin === "string") {
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  return new Uint8Array(bin);
}

export async function encryptValue(plain: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(plain));
  // Pack iv + ciphertext in base64url
  const out = new Uint8Array(iv.byteLength + (ciphertext as ArrayBuffer).byteLength);
  out.set(iv, 0);
  out.set(new Uint8Array(ciphertext as ArrayBuffer), iv.byteLength);
  return toBase64Url(out);
}

export async function decryptValue(payload: string | null): Promise<string | null> {
  if (!payload) return null;
  try {
    const key = await getKey();
    const bytes = fromBase64Url(payload);
    const iv = bytes.slice(0, 12);
    const data = bytes.slice(12);
    const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
    return new TextDecoder().decode(plainBuf);
  } catch (e) {
    console.warn("Failed to decrypt cookie value", e);
    return null;
  }
}
