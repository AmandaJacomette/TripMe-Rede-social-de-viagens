import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { PostCard } from "@/components/PostCard";
import { FeedSidebar } from "@/components/FeedSidebar";
import { posts } from "@/lib/mock";

export const Route = createFileRoute("/seguindo")({ component: Page });

function Page() {
  return (
    <AppShell right={<FeedSidebar />}>
      <div className="mx-auto max-w-2xl space-y-5">
        <h1 className="font-display text-2xl font-bold">Seguindo</h1>
        <p className="text-sm text-muted-foreground">Publicações de quem você segue</p>
        {posts.slice(1).map((p) => <PostCard key={p.id} post={p} />)}
      </div>
    </AppShell>
  );
}
