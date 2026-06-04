import { Heart, MessageCircle, Share2, MapPin, X, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Post } from "@/lib/mock";

type Comment = { id: string; author: string; avatar: string; text: string; time: string };

const seed = (postId: string): Comment[] => [
  { id: postId + "-1", author: "Anna Clara", avatar: "https://i.pravatar.cc/80?img=49", text: "Que lugar incrível! Anotado pro próximo feriado 😍", time: "1h" },
  { id: postId + "-2", author: "Paulo Ribeiro", avatar: "https://i.pravatar.cc/80?img=13", text: "Já fui, é tudo isso mesmo!", time: "30 min" },
];

export function PostCard({ post }: { post: Post }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>(() => seed(post.id));
  const [draft, setDraft] = useState("");

  const submit = () => {
    const t = draft.trim();
    if (!t) return;
    setComments((c) => [...c, { id: String(Date.now()), author: "Você", avatar: "https://i.pravatar.cc/80?img=47", text: t, time: "agora" }]);
    setDraft("");
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <header className="flex items-center gap-3 p-4">
          <img src={post.author.avatar} alt="" className="size-10 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{post.author.name}</div>
            <Link to="/local/$id" params={{ id: "1" }} className="flex items-center gap-1 truncate text-xs text-muted-foreground hover:text-[color:var(--brand-red)]">
              <MapPin className="size-3" /> {post.location}
            </Link>
          </div>
          <span className="text-xs text-muted-foreground">{post.time}</span>
        </header>
        <img src={post.image} alt="" className="w-full aspect-[4/3] object-cover" />
        <div className="flex items-center gap-4 px-4 pt-3 text-foreground/80">
          <button className="flex items-center gap-1.5 hover:text-[color:var(--brand-red)]"><Heart className="size-5" /><span className="text-sm">{post.likes}</span></button>
          <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 hover:text-[color:var(--brand-purple)]">
            <MessageCircle className="size-5" /><span className="text-sm">{comments.length}</span>
          </button>
          <button className="ml-auto hover:text-foreground"><Share2 className="size-5" /></button>
        </div>
        <p className="px-4 py-3 text-sm leading-relaxed text-foreground/90">
          <span className="font-semibold mr-1">{post.author.handle}</span>{post.caption}
        </p>
        {comments.length > 0 && (
          <button onClick={() => setOpen(true)} className="block px-4 pb-3 text-left text-xs text-muted-foreground hover:text-foreground">
            Ver todos os {comments.length} comentários
          </button>
        )}
      </article>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4" onClick={() => setOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg max-h-[90vh] sm:rounded-2xl rounded-t-2xl bg-card shadow-xl flex flex-col"
          >
            <header className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="font-display text-base font-bold">Comentários</h3>
              <button onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-muted"><X className="size-4" /></button>
            </header>

            <div className="flex items-center gap-3 border-b px-4 py-3">
              <img src={post.author.avatar} className="size-9 rounded-full object-cover" alt="" />
              <div className="text-sm">
                <span className="font-semibold mr-1">{post.author.handle}</span>
                <span className="text-foreground/80">{post.caption}</span>
              </div>
            </div>

            <ul className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {comments.map((c) => (
                <li key={c.id} className="flex items-start gap-3">
                  <img src={c.avatar} className="size-9 rounded-full object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">
                      <span className="font-semibold mr-1">{c.author}</span>
                      <span className="text-foreground/90">{c.text}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span>{c.time}</span>
                      <button className="hover:text-foreground">Curtir</button>
                      <button className="hover:text-foreground">Responder</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <form
              onSubmit={(e) => { e.preventDefault(); submit(); }}
              className="flex items-center gap-2 border-t bg-card px-3 py-2.5"
            >
              <img src="https://i.pravatar.cc/80?img=47" className="size-8 rounded-full object-cover" alt="" />
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Adicione um comentário..."
                className="flex-1 rounded-full border bg-card px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30"
              />
              <button type="submit" disabled={!draft.trim()} className="rounded-full bg-[color:var(--brand-red)] p-2 text-white disabled:opacity-40">
                <Send className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
