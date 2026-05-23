import { verifyToken, TokenPayload } from "./jwt";

export function getAuthenticatedUser(request: Request): TokenPayload | null {
  try {
    const cookiesHeader = request.headers.get("cookie") || "";
    
    // Parse cookies to find edupulse-session
    const match = cookiesHeader.match(/edupulse-session=([^;]+)/);
    const token = match ? match[1] : null;

    if (!token) return null;

    return verifyToken(token);
  } catch (error) {
    return null;
  }
}
