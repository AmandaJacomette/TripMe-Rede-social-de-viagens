import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Mail, Lock, User, Phone, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { authApi } from "@/lib/api"; 
import { auth } from "@/lib/auth"; // Importando o seu gerenciador de sessão nativo

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

export const Route = createFileRoute("/cadastro")({ component: PageWrapper });

const perks = ["Previsão de gastos", "Conteúdos exclusivos", "Dicas e experiências", "Roteiros personalizáveis", "Avaliações de quem viveu", "E muito mais"];

function PageWrapper() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Page />
    </GoogleOAuthProvider>
  );
}

function Page() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    username: "", // O campo do @ que vai pro back-end
    email: "",
    password: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const [dialogConfig, setDialogConfig] = useState({
    open: false,
    title: "",
    description: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleManualRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Cadastra o usuário
      await authApi.register({
        name: formData.name,
        username: formData.username, // Mandando o @
        email: formData.email,
        password: formData.password,
        // Envie o phone também se sua API estiver esperando!
      });
      
      // 2. Faz o login automático logo após cadastrar
      const loginResponse = await authApi.login({
        email: formData.email,
        password: formData.password
      }) as any;
      
      const token = loginResponse.access_token || loginResponse.data?.access_token;
      
      if (!token) throw new Error("Token não recebido");

      // 3. Salva o token com a chave exata para o seu fetch ler no cabeçalho
      localStorage.setItem("tripme.token", token);

      // 4. Busca os dados do usuário completos do back-end (com o @)
      const userData = await authApi.getMe() as any;

      // 5. Salva a sessão emitindo o evento global para o AppShell atualizar na hora
      auth.setSession(token, {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        username: userData.username, // Puxando o @
        avatar: userData.profile_pic
      });

      navigate({ to: "/" });
      
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      // Usando error.status da sua ApiError
      const status = error.status; 
      
      if (status === 400) {
        setDialogConfig({
          open: true,
          title: "Dados já em uso",
          description: "Este e-mail ou @ já está cadastrado no sistema! Verifique os dados ou vá para a tela de Entrar."
        });
      } else {
        setDialogConfig({
          open: true,
          title: "Ops, algo deu errado",
          description: "Não foi possível realizar o cadastro. Verifique os dados e tente novamente."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          username: userData.username, // Puxando o @
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
      <div className="w-full max-w-4xl rounded-3xl bg-card p-8 shadow-xl border grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm text-muted-foreground">Bem vindo ao</p>
          <Logo size="lg" />
          <h3 className="mt-6 font-display text-lg font-bold">Aqui você encontra:</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-[color:var(--brand-green)]" />{p}</li>
            ))}
          </ul>
        </div>

        <form className="space-y-3" onSubmit={handleManualRegister}>
          <p className="text-sm text-muted-foreground">Faça agora mesmo o seu cadastro!</p>
          
          <Field icon={User} name="name" value={formData.name} onChange={handleInputChange} placeholder="Insira seu nome completo" required />
          <Field icon={User} name="username" value={formData.username} onChange={handleInputChange} placeholder="Insira seu @ aqui" />
          <Field icon={Mail} name="email" value={formData.email} onChange={handleInputChange} placeholder="Insira seu e-mail" type="email" required />
          <Field icon={Lock} name="password" value={formData.password} onChange={handleInputChange} placeholder="Insira sua senha" type="password" required />
          <Field icon={Phone} name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Insira seu telefone" />
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full rounded-full bg-[color:var(--brand-red)] py-3 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            CADASTRAR
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
          
          <p className="text-center text-xs text-muted-foreground">Já tem conta? <Link to="/login" className="font-semibold text-[color:var(--brand-red)]">Entrar</Link></p>
        </form>
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