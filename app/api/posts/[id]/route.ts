import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getSessionUserFromRequest,
  type SessionUser,
} from "@/lib/auth";

type PostPayload = {
  title?: string;
  slug?: string;
  category?: string;
  titleImage?: string;
  technologyTags?: string[] | string;
  authors?: unknown;
  publishDate?: string | null;
  status?: "draft" | "published";
  featured?: boolean;
  keepInFeed?: boolean;
  feedOrder?: number | string | null;
  content?: unknown;
};

function isAdmin(user: SessionUser | null): user is SessionUser & { role: "ADMIN" } {
  return user?.role === "ADMIN";
}

function normalizeTags(tags: string[] | string | undefined) {
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeAuthors(authors: unknown) {
  if (!Array.isArray(authors)) {
    return [];
  }

  return authors.map((author) => {
    if (author && typeof author === "object") {
      const candidate = author as Record<string, unknown>;
      return {
        id:
          typeof candidate.id === "string"
            ? candidate.id
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: typeof candidate.name === "string" ? candidate.name : "",
        role: typeof candidate.role === "string" ? candidate.role : "",
      };
    }

    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: "",
      role: "",
    };
  });
}

function normalizeContent(content: unknown) {
  if (content && typeof content === "object") {
    return content;
  }

  return {
    type: "doc",
    content: [],
  };
}

function parseFeedOrder(feedOrder: number | string | null | undefined) {
  if (typeof feedOrder === "number" && Number.isFinite(feedOrder)) {
    return feedOrder;
  }

  if (typeof feedOrder === "string" && feedOrder.trim()) {
    const parsed = Number.parseInt(feedOrder, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const sessionUser = getSessionUserFromRequest(request);
  const { id } = await context.params;
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    return NextResponse.json({ message: "Post not found." }, { status: 404 });
  }

  if (post.status !== "PUBLISHED" && !isAdmin(sessionUser)) {
    return NextResponse.json({ message: "Post not found." }, { status: 404 });
  }

  return NextResponse.json({ post }, { status: 200 });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const sessionUser = getSessionUserFromRequest(request);

  if (!isAdmin(sessionUser)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = (await request.json()) as PostPayload;
    const status = body.status === "published" ? "PUBLISHED" : "DRAFT";

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: typeof body.title === "string" ? body.title.trim() : undefined,
        slug: typeof body.slug === "string" ? body.slug.trim() : undefined,
        category:
          typeof body.category === "string" ? body.category.trim() : undefined,
        titleImage:
          typeof body.titleImage === "string" && body.titleImage.trim()
            ? body.titleImage.trim()
            : null,
        technologyTags: normalizeTags(body.technologyTags),
        authors: normalizeAuthors(body.authors),
        publishDate:
          typeof body.publishDate === "string" && body.publishDate.trim()
            ? new Date(body.publishDate)
            : null,
        status,
        featured: Boolean(body.featured),
        keepInFeed: Boolean(body.keepInFeed),
        feedOrder: parseFeedOrder(body.feedOrder),
        content: normalizeContent(body.content),
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json(
      {
        message: "Post updated successfully.",
        post,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong while updating the post." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const sessionUser = getSessionUserFromRequest(request);

  if (!isAdmin(sessionUser)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await context.params;

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Post deleted successfully." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong while deleting the post." },
      { status: 500 }
    );
  }
}
