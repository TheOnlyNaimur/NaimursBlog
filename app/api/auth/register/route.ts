import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getDefaultAvatar,
  hashPassword,
  type AuthRole,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 409 }
      );
    }

    const role: AuthRole = "USER";
    const passwordHash = await hashPassword(password);
    const avatar = getDefaultAvatar(role);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        avatar,
      },
    });

    return NextResponse.json(
      {
        message: "User registered successfully.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong while registering the user." },
      { status: 500 }
    );
  }
}
