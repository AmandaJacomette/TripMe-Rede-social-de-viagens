import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Home, Users, Compass, Map, Sparkles, Bell, PlusCircle, Search, LogOut, Settings,
} from "lucide-react";
import { Logo } from "./Logo";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth"; // Presumo que este hook gerencie a rota /users/me
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: "/", label: "Para você", icon: Home },
  { to: "/explorar", label: "Explorar", icon: Compass },
  { to: "/roteiros", label: "Roteiros", icon: Map },
  { to: "/criadores", label: "Criadores", icon: Sparkles },
  { to: "/notificacoes", label: "Notificações", icon: Bell },
  { to: "/publicar", label: "Publicar", icon: PlusCircle },
];

export function AppShell({ children, right }: { children: ReactNode; right?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  
  // Pegando os dados reais vindos do seu contexto de autenticação
  const { user, logout } = useAuth();
  console.log(user)
  
  // Mapeando os dados do usuário logado (com fallbacks de segurança)
  const displayName = user?.name || "Usuário";
  const rawHandle = user?.username || user?.handle || "";
  const handle = rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`;
  const avatar = user?.avatar || (user as any)?.avatar_url || user?.profile_pic || "https://i.pravatar.cc/80?img=47";

  const handleLogout = () => { 
    logout(); 
    navigate({ to: "/login" }); 
  };

  return (
    <div className="min-h-screen bg-[color:var(--brand-mint)]/40">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 border-b bg-card/90 backdrop-blur px-4 h-14">
        <Logo size="sm" />
        <Link to="/explorar" className="ml-auto rounded-full p-2 hover:bg-muted">
          <Search className="size-5" />
        </Link>
        <Link to="/notificacoes" className="rounded-full p-2 hover:bg-muted">
          <Bell className="size-5" />
        </Link>
      </header>

      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar desktop */}
        <aside className="hidden md:flex sticky top-0 h-screen w-60 lg:w-64 shrink-0 flex-col gap-1 border-r bg-card px-4 py-5">
          <div className="px-2 pb-5"><Logo /></div>
          <nav className="flex flex-col gap-1">
            {nav.map((n) => {
              const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[color:var(--brand-red)]/10 text-[color:var(--brand-red)]"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  <n.icon className="size-5" /> {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t pt-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted text-left outline-none">
                <img src={avatar} alt={`Avatar de ${displayName}`} className="size-9 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{displayName}</div>
                  {rawHandle && <div className="truncate text-xs text-muted-foreground">{handle}</div>}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/perfil"><Users className="size-4 mr-2" /> Meu perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/perfil/ajustes"><Settings className="size-4 mr-2" /> Ajustes</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout} className="text-[color:var(--brand-red)] cursor-pointer">
                  <LogOut className="size-4 mr-2" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 flex">
          <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-5 pb-24 md:pb-10">{children}</div>
          {right && (
            <aside className="hidden xl:block w-80 shrink-0 border-l bg-card/60 px-5 py-6 sticky top-0 h-screen overflow-y-auto scroll-thin">
              {right}
            </aside>
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-card/95 backdrop-blur px-2 py-1.5">
        <ul className="grid grid-cols-5 text-[10px]">
          {nav.slice(0, 4).concat(nav[5]).map((n) => {
            const active = pathname === n.to || (n.to !== "/" && pathname.startsWith(n.to));
            return (
              <li key={n.to}>
                <Link to={n.to} className={`flex flex-col items-center gap-0.5 rounded-lg py-1.5 ${active ? "text-[color:var(--brand-red)]" : "text-muted-foreground"}`}>
                  <n.icon className="size-5" />
                  <span>{n.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}