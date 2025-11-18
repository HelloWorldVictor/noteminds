import { AppSidebar } from "@/components/inc/app-sidebar";
import { NotemindsButton } from "@/components/inc/noteminds-button";
import { ThemeProvider } from "@/components/inc/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { contentAuthClient } from "@/lib/auth-client";
import { useState } from "react";

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data } = contentAuthClient.useSession();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <div id="new-portal-for-all"></div>
      <ThemeProvider contentScript defaultTheme="light">
        <TooltipProvider>
          <NotemindsButton
            user={data?.user}
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
          />
          {data?.user && <AppSidebar {...{ sidebarOpen, toggleSidebar }} />}
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}
