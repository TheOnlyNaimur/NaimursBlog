import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);
const SESSION_SECRET = process.env.SESSION_SECRET;

export const SESSION_COOKIE_NAME = "naimurs_blog_session";

export type AuthRole = "USER" | "ADMIN";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  avatar: string;
};

export function getDefaultAvatar(role: AuthRole) {
  return role === "ADMIN"
    ? "/avatars/admin.png"
    : "/avatars/default-user.png";
}

function getSessionSecret() {
  if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET is missing.");
  }

  return SESSION_SECRET;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");

  if (!salt || !key) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  const storedKey = Buffer.from(key, "hex");

  return (
    storedKey.length === derivedKey.length &&
    timingSafeEqual(storedKey, derivedKey)
  );
}

export function createSessionValue(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify(user), "utf8").toString(
    "base64url"
  );
  const signature = createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

export function readSessionValue(sessionValue: string | undefined | null) {
  if (!sessionValue) {
    return null;
  }

  try {
    const [payload, signature] = sessionValue.split(".");

    if (!payload || !signature) {
      return null;
    }

    const expectedSignature = createHmac("sha256", getSessionSecret())
      .update(payload)
      .digest("base64url");

    const receivedSignature = Buffer.from(signature, "base64url");
    const expectedSignatureBuffer = Buffer.from(expectedSignature, "base64url");

    if (
      receivedSignature.length !== expectedSignatureBuffer.length ||
      !timingSafeEqual(receivedSignature, expectedSignatureBuffer)
    ) {
      return null;
    }

    const decoded = Buffer.from(payload, "base64url").toString("utf8");
    return JSON.parse(decoded) as SessionUser;
  } catch {
    return null;
  }
}

export function getSessionUserFromRequest(request: Request) {
  const sessionCookie = request.headers
    .get("cookie")
    ?.split(";")
    .find((part) => part.trim().startsWith(`${SESSION_COOKIE_NAME}=`));

  const sessionValue = sessionCookie?.split("=")[1];
  return readSessionValue(sessionValue);
}
