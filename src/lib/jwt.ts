import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "edupulse-super-secret-key-2026";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  fullName: string;
}

export function signToken(payload: TokenPayload, expiresInSeconds = 604800): string {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  
  const fullPayload = { ...payload, exp };
  
  const base64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
  const base64Payload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest("base64url");
    
  return `${base64Header}.${base64Payload}.${signature}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const [header, payload, signature] = parts;
    
    const validSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64url");
      
    if (signature !== validSignature) return null;
    
    const decodedPayload = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    
    // Check expiration
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expired
    }
    
    return {
      userId: decodedPayload.userId,
      email: decodedPayload.email,
      role: decodedPayload.role,
      fullName: decodedPayload.fullName,
    };
  } catch (error) {
    return null;
  }
}
