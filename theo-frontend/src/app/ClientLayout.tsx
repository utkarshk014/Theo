import { ClerkProvider } from "@clerk/nextjs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSideBar";
import { NotificationContextProvider } from "./hooks/useNotifications";
import { ApiProvider } from "./hooks/useApi";

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ApiProvider>
        <SidebarProvider open={true}>
          <NotificationContextProvider>
            <AppSidebar />
            {children}
          </NotificationContextProvider>
        </SidebarProvider>
      </ApiProvider>
    </ClerkProvider>
  );
}
