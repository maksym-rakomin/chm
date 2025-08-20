function toUint8ArrayFromString(str: string): Uint8Array {
  const enc = new TextEncoder();
  return enc.encode(str);
}

function fromBase64Url(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64url.length + 3) % 4);
  const bin = typeof atob !== "undefined" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function getKey(): Promise<CryptoKey> {
  console.log(2)
  try {
    const secret = process.env.NEXT_PUBLIC_COOKIE_SECRET || "";
    const secretBytes = toUint8ArrayFromString(secret);
    const hash = await crypto.subtle.digest("SHA-256", secretBytes);
    return crypto.subtle.importKey("raw", hash, {name: "AES-GCM"}, false, ["decrypt"]);
  } catch (e) {
    console.warn(2, e.message)
  }
}

export async function decryptValueEdge(payload: string | null): Promise<string | null> {
  if (!payload) return null;
  try {
    const key = await getKey();
    const buf = fromBase64Url(payload);

    if (buf.length < 12 + 16) {
      throw new Error("Malformed payload");
    }

    const iv = buf.slice(0, 12);
    const rest = buf.slice(12);

    const tryDecrypt = async (ciphertext: Uint8Array, tag: Uint8Array) => {
      const combined = new Uint8Array(ciphertext.length + tag.length);
      combined.set(ciphertext, 0);
      combined.set(tag, ciphertext.length);
      const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, combined);
      return new TextDecoder().decode(plainBuf);
    };

    try {
      const ciphertext = rest.slice(0, rest.length - 16);
      const tag = rest.slice(rest.length - 16);
      return await tryDecrypt(ciphertext, tag);
    } catch {
      const legacyTag = rest.slice(0, 16);
      const legacyCiphertext = rest.slice(16);
      return await tryDecrypt(legacyCiphertext, legacyTag);
    }
  } catch (e) {
    console.warn("Failed to decrypt cookie value (edge)", e);
    return null;
  }
}

