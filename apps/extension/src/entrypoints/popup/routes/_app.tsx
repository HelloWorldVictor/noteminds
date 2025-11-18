import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  loader(ctx) {
    if (true)
      throw redirect({
        to: "/welcome",
      });
  },
});

function RouteComponent() {
  return <Outlet />;
}
