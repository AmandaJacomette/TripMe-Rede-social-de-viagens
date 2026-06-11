import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell"; // mapeado na sua estrutura
import { PostCard } from "@/components/PostCard"; // mapeado na sua estrutura
import { FeedSidebar } from "@/components/FeedSidebar"; // mapeado na sua estrutura
import { useState, useEffect } from "react";
import { postsApi, type Post } from "@/lib/api"; // Importando sua API real e a tipagem

export const Route = createFileRoute("/")({ component: Page });

function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchFeed = async (pageToFetch: number) => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const data = await postsApi.getForYouFeed(pageToFetch, 10);
      
      setPosts((prev) => (pageToFetch === 1 ? data.items : [...prev, ...data.items]));
      console.log(data.items); 
      if (data.next_page === null) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erro ao carregar o feed inteligente:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(page);
  }, [page]);

  return (
    <AppShell right={<FeedSidebar />}>
      <div className="mx-auto max-w-2xl space-y-5">
        <h1 className="font-display text-2xl font-bold text-slate-900">Para você</h1>
        
        <div className="space-y-5">
          {posts.map((p) => (
            <PostCard key={p.id} post={p as any} />
          ))}
        </div>

        <div className="pt-4 text-center">
          {loading && <p className="text-sm text-slate-500 animate-pulse">Carregando viagens incríveis...</p>}
          
          {!loading && hasMore && posts.length > 0 && (
            <button 
              onClick={() => setPage((prev) => prev + 1)}
              className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
            >
              Ver mais publicações
            </button>
          )}

          {!hasMore && (
            <p className="text-xs text-slate-400 font-medium">Você chegou ao fim do seu feed inteligente por hoje! 🌍</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}