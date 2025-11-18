import { authClient } from "@/lib/auth-client";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  async loader(ctx) {
    const { data } = await authClient.getSession();
    if (!data?.user)
      throw redirect({
        to: "/welcome",
      });
  },
});

function RouteComponent() {
  return <Outlet />;
}
