import { AppSidebar } from "@/components/inc/app-sidebar";
import { NotemindsButton } from "@/components/inc/noteminds-button";
import { ThemeProvider } from "@/components/inc/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { $api } from "@/lib/api";
import { contentAuthClient } from "@/lib/auth-client";
import { extractContent } from "@/lib/content-extractor";
import { useMessageListener } from "@/lib/messaging";
import { use, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data, refetch } = contentAuthClient.useSession();
  const [webpageId, setWebpageId] = useState<string | null>(null);
  const { mutate, isPending } = $api.useMutation("post", "/webpage/analyze", {
    onSuccess: (data) => {
      console.log("Webpage analyzed:", data);
    },
  });

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  useMessageListener("TOKEN_UPDATED", () => {
    refetch();
  });
  useMessageListener("POPUP_LOGOUT", () => {
    refetch();
  });

  return (
    // <QueryClientProvider client={queryClient}>
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

    // </QueryClientProvider>
  );
}
