import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CreatorShell } from "@/components/shared/creator/creatorShell";
import { readSessionValue, SESSION_COOKIE_NAME } from "@/lib/auth";

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const user = readSessionValue(sessionValue);

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return <CreatorShell>{children}</CreatorShell>;
}
