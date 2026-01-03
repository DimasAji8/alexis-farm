import { auth } from "@/app/api/(features)/auth";
import { AuthProvider } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/app/client/components/ui/sonner";

export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  return (
    <AuthProvider session={session}>
      <QueryProvider>
        {children}
        <Toaster 
          position="bottom-right" 
          expand={true}
          closeButton={false}
        />
      </QueryProvider>
    </AuthProvider>
  );
}
