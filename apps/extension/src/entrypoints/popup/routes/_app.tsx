import { authClient } from "@/lib/auth-client";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  async loader(ctx) {
    const { data } = await authClient.getSession();

    if (!data?.user)
      throw redirect({
        to: "/welcome",
      });
  },
  pendingMs: 0,
  pendingComponent: LoadingSkeleton,
});

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between border-b px-3 pt-4 pb-2">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="flex gap-3 px-3">
        <Card className="flex-1 gap-4 px-3 py-4 shadow-none">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex items-center justify-center gap-3 *:flex-1">
            <div className="grid place-items-center">
              <Skeleton className="h-[60px] w-[60px] rounded-full" />
            </div>
            <div className="space-y-2 text-left">
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </Card>

        <Card className="w-1/2 gap-4 p-4 shadow-none">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-10" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="col-span-2 h-16 w-full" />
            <Skeleton className="col-span-3 h-3 w-full" />
          </div>
        </Card>
      </div>

      {/* Active Learning Skeleton */}
      <div className="space-y-3 px-3">
        <Card className="p-3 shadow-none">
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </Card>
        <Card className="bg-muted rounded-xl px-3 py-2 shadow-none">
          <Skeleton className="h-4 w-full" />
        </Card>
      </div>

      {/* Settings Skeleton */}
      <div className="mx-3 border-t p-3">
        <Skeleton className="mb-4 h-4 w-28" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-2 px-3">
        <Skeleton className="h-10 w-1/2 rounded-md" />
        <Skeleton className="h-10 w-1/2 rounded-md" />
      </div>
    </div>
  );
}

function RouteComponent() {
  return <Outlet />;
}
