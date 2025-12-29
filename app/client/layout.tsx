import { auth } from "@/app/api/(features)/auth";
import { AuthProvider } from "@/components/providers/session-provider";

export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  return <AuthProvider session={session}>{children}</AuthProvider>;
}
