import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { authApi } from "@/lib/api"; // Ajuste o caminho se necessário (ex: "@/server")
import { auth } from "@/lib/auth"; // Importando o seu gerenciador de sessão nativo

// Importando o seu AlertDialog
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const Route = createFileRoute("/login")({ component: PageWrapper });

function PageWrapper() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Page />
    </GoogleOAuthProvider>
  );
}

function Page() {
  const navigate = useNavigate();

  // Estados do formulário e carregamento
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Estado para o seu Modal de Alerta
  const [dialogConfig, setDialogConfig] = useState({
    open: false,
    title: "",
    description: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -----------------------------------------------------
  // FLUXO 1: LOGIN MANUAL
  // -----------------------------------------------------
  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Tenta fazer o login direto com o back-end
      const loginResponse = await authApi.login({
        email: formData.email,
        password: formData.password
      }) as any;
      
      const token = loginResponse.access_token || loginResponse.data?.access_token;
      
      if (!token) throw new Error("Token não recebido");

      // 2. Salva o token temporariamente com a chave exata para o seu fetch ler no cabeçalho
      localStorage.setItem("tripme.token", token);

      // 3. Busca os dados do usuário completos do back-end (com o @)
      const userData = await authApi.getMe() as any;

      // 4. Salva a sessão emitindo o evento global para o AppShell atualizar na hora
      auth.setSession(token, {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        username: userData.username, // Puxando o @
        avatar: userData.profile_pic
      });

      navigate({ to: "/" });
      
    } catch (error: any) {
      console.error("Erro no login:", error);
      // Usando error.status porque sua ApiError customizada coloca o status na raiz
      const status = error.status; 
      
      if (status === 401) {
        setDialogConfig({
          open: true,
          title: "Acesso Negado",
          description: "E-mail ou senha incorretos. Verifique seus dados e tente novamente."
        });
      } else {
        setDialogConfig({
          open: true,
          title: "Ops, algo deu errado",
          description: "Não foi possível conectar ao servidor. Tente novamente mais tarde."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------------------------------
  // FLUXO 2: LOGIN COM O GOOGLE
  // -----------------------------------------------------
  const handleGoogleClick = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        const googlePayload = {
          name: userInfo.name,
          email: userInfo.email,
          profile_pic: userInfo.picture,
          password: `OAuth_${userInfo.sub}`,
          // Adicionamos um username temporário caso o usuário do Google seja novo e o banco exija o campo
          username: `user_${userInfo.sub.slice(0, 8)}` 
        };

        try {
          await authApi.register(googlePayload);
        } catch (err: any) {
          const status = err.status;
          if (status !== 400) throw err; 
        }

        // 1. Faz o login para pegar o Token
        const loginResponse = await authApi.login({
          email: googlePayload.email,
          password: googlePayload.password
        }) as any;

        const token = loginResponse.access_token || loginResponse.data?.access_token;
        if (!token) throw new Error("Token não recebido");

        // 2. Salva o token temporariamente
        localStorage.setItem("tripme.token", token);

        // 3. Busca os dados reais gerados/existentes no banco de dados
        const userData = await authApi.getMe() as any;

        // 4. Salva a sessão com a arquitetura de eventos nativa
        auth.setSession(token, {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          username: userData.username,
          avatar: userData.profile_pic
        });

        navigate({ to: "/" });

      } catch (error) {
        console.error("Erro no fluxo do Google:", error);
        
        setDialogConfig({
          open: true,
          title: "Erro de Autenticação",
          description: "Não foi possível sincronizar com o Google. Tente novamente em instantes."
        });
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--brand-mint)] p-4">
      <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-xl border">
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">Bem vindo de volta!</p>
          <div className="mt-2 flex justify-center"><Logo size="lg" /></div>
        </div>
        
        <form className="space-y-4" onSubmit={handleManualLogin}>
          <Field icon={Mail} name="email" value={formData.email} onChange={handleInputChange} placeholder="Insira o seu e-mail" type="email" required />
          <Field icon={Lock} name="password" value={formData.password} onChange={handleInputChange} placeholder="Insira sua senha" type="password" required />
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full rounded-full bg-[color:var(--brand-red)] py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            ENTRAR
          </button>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" /> ou <div className="h-px flex-1 bg-border" /></div>
          
          <button 
            type="button" 
            onClick={() => handleGoogleClick()}
            disabled={isLoading}
            className="w-full cursor-pointer rounded-full border bg-card py-3 text-sm font-semibold hover:bg-muted flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
          >
            <img src="https://www.google.com/favicon.ico" className="size-4" alt="" /> CONTINUE COM O GOOGLE
          </button>
        </form>
        
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Não tem conta? <Link to="/cadastro" className="font-semibold text-[color:var(--brand-red)]">Cadastre-se já!</Link>
        </p>
      </div>

      <AlertDialog 
        open={dialogConfig.open} 
        onOpenChange={(open) => setDialogConfig(prev => ({ ...prev, open }))}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogConfig.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDialogConfig(prev => ({ ...prev, open: false }))}>
              Entendi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

function Field({ icon: Icon, ...props }: any) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <input {...props} className="w-full rounded-full border bg-card pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30" />
    </div>
  );
}