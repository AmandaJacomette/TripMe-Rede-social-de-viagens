import { Heart, MessageCircle, Share2, MapPin, X, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { postsApi } from "@/lib/api"; 
import { useAuth } from "@/lib/auth"; 

type Comment = { id: string; author: string; avatar: string; text: string; time: string };

export function PostCard({ post }: { post: any }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [draft, setDraft] = useState("");
  const [likesCount, setLikesCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const loggedInUserId = useAuth()?.user;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (post) {
      setLikesCount(post.likes_count ?? post.likes?.length ?? 0);
      const userAlreadyLiked = post.likes?.some(
        (like: any) => like.user_id === loggedInUserId?.id || like.author_id === loggedInUserId?.id
      );
      setHasLiked(post.has_liked ?? userAlreadyLiked ?? false);

      const formattedComments = (post.comments || []).map((c: any) => ({
        id: c.id,
        author: c.author?.name || "Viajante",
        avatar: c.author?.profile_pic || "https://i.pravatar.cc/80?img=20",
        text: c.text,
        time: new Date(c.created_at).toLocaleDateString("pt-BR")
      }));
      setComments(formattedComments); 
    }
  }, [post, loggedInUserId]);


  // Efeito apenas para travar o scroll e escutar a tecla ESC ao abrir o modal
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  if (!post) return null;

  const authorName = post.author?.name || "Viajante";
  const authorHandle = post.author?.username ? `@${post.author.username}` : "";
  const authorAvatar = post.author?.profile_pic || "https://i.pravatar.cc/80?img=47";
  const locationName = post.place?.name || "Lugar desconhecido";
  const locationId = post.place?.id || "1";
  const postCaption = post.content || "";
  
  const postTime = post.created_at 
    ? new Date(post.created_at).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })
    : "agora";

  useEffect(() => {
    if (!open) return;

    const loadComments = async () => {
      try {
        const response = await postsApi.getComments(post.id);
        const resData = response;
        
        const formatted = resData.map((c: any) => ({
          id: c.id,
          author: c.author?.name || c.user?.name || "Viajante",
          avatar: c.author?.profile_pic || c.user?.avatar || "https://i.pravatar.cc/80?img=20",
          text: c.text,
          time: new Date(c.created_at).toLocaleDateString("pt-BR")
        }));
        setComments(formatted);
        setCommentsCount(formatted.length);
      } catch (err) {
        console.error("Erro ao buscar comentários:", err);
      }
    };

    loadComments();

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, post.id]);

  const handleLike = async () => {
    try {
      const response = await postsApi.toggleLike(post.id);
      setLikesCount(response.likes_count);
      setHasLiked(response.has_liked);
    } catch (err) {
      console.error("Erro ao curtir:", err);
    }
  };

  const submit = async () => {
    const t = draft.trim();
    if (!t) return;
    try {
      const response = await postsApi.addComment(post.id, t);
      const newCommentData = response;
      
      setComments((c) => [...c, { 
        id: newCommentData.id, 
        author: "Você", 
        avatar: "https://i.pravatar.cc/80?img=47", 
        text: t, 
        time: "agora" 
      }]);
      setDraft("");
    } catch (err) {
      console.error("Erro ao comentar:", err);
    }
  };

  return (
    <>
      <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <header className="flex items-center gap-3 p-4">
          <img src={authorAvatar} alt="" className="size-10 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{authorName}</div>
            <Link to="/local/$id" params={{ id: locationId }} className="flex items-center gap-1 truncate text-xs text-muted-foreground hover:text-[color:var(--brand-red)]">
              <MapPin className="size-3" /> {locationName}
            </Link>
          </div>
          <span className="text-xs text-muted-foreground">{postTime}</span>
        </header>
<div className="relative w-full aspect-[4/3] group overflow-hidden bg-black">
  {/* Imagem Atual */}
  {post.photos && post.photos.length > 0 ? (
    <img
      src={post.photos[currentImageIndex]?.url}
      alt={`Foto ${currentImageIndex + 1}`}
      crossOrigin="anonymous"
      className="w-full h-full object-cover transition-all duration-300"
    />
  ) : (
    <img
      src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500"
      alt="Padrão"
      className="w-full h-full object-cover"
    />
  )
  }

  {/* Botões de Navegação (Só aparecem se houver mais de uma imagem e ao passar o mouse) */}
  {post.photos && post.photos.length > 1 && (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentImageIndex((prev) => (prev === 0 ? post.photos.length - 1 : prev - 1));
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        &#10094; {/* Seta Esquerda */}
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          setCurrentImageIndex((prev) => (prev === post.photos.length - 1 ? 0 : prev + 1));
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
      >
        &#10095; {/* Seta Direita */}
      </button>

      {/* Indicadores (Bolinhas na parte inferior) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {post.photos.map((_: any, idx: number) => (
          <button
            key={idx}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentImageIndex(idx);
            }}
            className={`size-2 rounded-full transition-all cursor-pointer ${
              idx === currentImageIndex ? "bg-white w-4" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </>
  )}
</div>
        <div className="flex items-center gap-4 px-4 pt-3 text-foreground/80">
          {/* Botão de curtir dinâmico */}
          <button 
            onClick={handleLike} 
            className={`flex items-center gap-1.5 transition-colors ${hasLiked ? "text-[color:var(--brand-red)]" : "hover:text-[color:var(--brand-red)]"}`}
          >
            <Heart className="size-5" fill={hasLiked ? "currentColor" : "none"} />
            <span className="text-sm">{likesCount}</span>
          </button>
          
          <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 hover:text-[color:var(--brand-purple)]">
            <MessageCircle className="size-5" /><span className="text-sm">{comments.length}</span>
          </button>
          <button className="ml-auto hover:text-foreground"><Share2 className="size-5" /></button>
        </div>
        <p className="px-4 py-3 text-sm leading-relaxed text-foreground/90">
          <span className="font-semibold mr-1">{authorHandle}</span>{postCaption}
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
              <img src={authorAvatar} className="size-9 rounded-full object-cover" alt="" />
              <div className="text-sm">
                <span className="font-semibold mr-1">{authorHandle}</span>
                <span className="text-foreground/80">{postCaption}</span>
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
              <img src={loggedInUserId?.avatar || "https://i.pravatar.cc/80?img=47"} className="size-8 rounded-full object-cover" alt="" />
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