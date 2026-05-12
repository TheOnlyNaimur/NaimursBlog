import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserFromRequest, type SessionUser } from "@/lib/auth";

type LibraryPayload = {
  title?: string;
  slug?: string;
  itemType?: string;
  authors?: unknown;
  year?: number | string | null;
  publisher?: string | null;
  subject?: string;
  tags?: string[] | string;
  coverImage?: string | null;
  resourceUrl?: string | null;
  notes?: string;
  status?: "draft" | "published";
  featured?: boolean;
  pinned?: boolean;
  visible?: boolean;
  priority?: number | string | null;
};

const allowedItemTypes = new Set([
  "TEXTBOOK",
  "PAPER",
  "ARTICLE",
  "THESIS",
  "NOTE",
  "LINK",
]);

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
  if (!Array.isArray(authors) || authors.length === 0) {
    return [{ id: "primary-author", name: "Naimur Islam" }];
  }

  return authors.map((author, index) => {
    if (author && typeof author === "object") {
      const candidate = author as Record<string, unknown>;

      return {
        id:
          typeof candidate.id === "string"
            ? candidate.id
            : `author-${index + 1}-${Date.now()}`,
        name: typeof candidate.name === "string" ? candidate.name : "",
      };
    }

    return {
      id: `author-${index + 1}-${Date.now()}`,
      name: "",
    };
  });
}

function parseYear(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
}

function parsePriority(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizeContentNotes(notes: string | undefined) {
  return typeof notes === "string" ? notes.trim() : "";
}

export async function GET(request: NextRequest) {
  const sessionUser = getSessionUserFromRequest(request);

  if (!isAdmin(sessionUser)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const items = await prisma.libraryItem.findMany({
    orderBy: [
      { pinned: "desc" },
      { featured: "desc" },
      { priority: "asc" },
      { updatedAt: "desc" },
    ],
  });

  return NextResponse.json({ items }, { status: 200 });
}

export async function POST(request: NextRequest) {
  const sessionUser = getSessionUserFromRequest(request);

  if (!isAdmin(sessionUser)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as LibraryPayload;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    const itemType = typeof body.itemType === "string" ? body.itemType.trim().toUpperCase() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const notes = normalizeContentNotes(body.notes);

    if (!title || !slug || !itemType || !subject || !notes) {
      return NextResponse.json(
        { message: "Title, slug, item type, subject, and notes are required." },
        { status: 400 }
      );
    }

    if (!allowedItemTypes.has(itemType)) {
      return NextResponse.json(
        { message: "Item type is not valid." },
        { status: 400 }
      );
    }

    const existingItem = await prisma.libraryItem.findUnique({
      where: { slug },
    });

    if (existingItem) {
      return NextResponse.json(
        { message: "A library item with this slug already exists." },
        { status: 409 }
      );
    }

    const status = body.status === "published" ? "PUBLISHED" : "DRAFT";
    const publishedAt = status === "PUBLISHED" ? new Date() : null;

    const item = await prisma.libraryItem.create({
      data: {
        title,
        slug,
        itemType,
        authors: normalizeAuthors(body.authors),
        year: parseYear(body.year),
        publisher:
          typeof body.publisher === "string" && body.publisher.trim()
            ? body.publisher.trim()
            : null,
        subject,
        tags: normalizeTags(body.tags),
        coverImage:
          typeof body.coverImage === "string" && body.coverImage.trim()
            ? body.coverImage.trim()
            : null,
        resourceUrl:
          typeof body.resourceUrl === "string" && body.resourceUrl.trim()
            ? body.resourceUrl.trim()
            : null,
        notes,
        status,
        featured: Boolean(body.featured),
        pinned: Boolean(body.pinned),
        visible: body.visible !== false,
        priority: parsePriority(body.priority),
        publishedAt,
        createdById: sessionUser.id,
      },
    });

    return NextResponse.json(
      {
        message: "Library item created successfully.",
        item,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong while creating the library item." },
      { status: 500 }
    );
  }
}
