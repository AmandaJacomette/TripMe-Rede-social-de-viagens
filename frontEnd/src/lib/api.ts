// Cliente HTTP para o backend Python (FastAPI/Flask).
import { auth } from "./auth";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// --- TIPAGENS DA API (Contratos com o FastAPI) ---
export interface User {
  id: string;
  name: string;
  email: string;
  profile_pic?: string;
}

export interface Location {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  order?: number; // Ordem do ponto dentro de um roteiro
}

export interface Route {
  id: string;
  title: string;
  description?: string;
  creator_id: string;
  creator_name: string;
  locations: Location[];
  cloned_from_id?: string | null;
}

export interface Post {
  id: string;
  content: string;
  image_url?: string;
  created_at: string;
  user: User;
  likes_count: number;
  has_liked: boolean;
  comments_count: number;
  route_id?: Route | null; // Posts podem ou não estar vinculados a roteiros
  location_name?: string;
  latitude?: number;
  longitude?: number;
  photo_urls: string[];
}

export interface Comment {
  id: string;
  post_id: string;
  content: string;
  user: User;
  created_at: string;
}

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
}

export interface RegisterInput {
  name: string;
  email: string;
  password?: string;    
  profile_pic?: string; 
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
    profile_pic?: string;
  };
}

// --- INFRAESTRUTURA HTTP ---
export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_URL) throw new ApiError(0, "VITE_API_URL não configurada");
  
  const token = auth.getToken();
  const headers = new Headers(init.headers);
  
  if (!(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const text = await res.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
  
  if (!res.ok) throw new ApiError(res.status, (data as any)?.detail || res.statusText, data);
  return data as T;
}

export const api = {
  get: <T>(p: string) => request<T>(p),
  post: <T>(p: string, body?: unknown) => request<T>(p, { 
    method: "POST", 
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined 
  }),
  put: <T>(p: string, body?: unknown) => request<T>(p, { 
    method: "PUT", 
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined 
  }),
  del: <T>(p: string) => request<T>(p, { method: "DELETE" }),
};

// --- MÓDULOS DE ENDPOINTS ---

export const authApi = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/users/me"),
};

export interface PaginatedPosts {
  items: Post[];
  next_page: number | null; // Informa a próxima página (ou null se o feed chegou ao fim)
}

// --- ENDPOINTS DO FEED ---
export const postsApi = {
  /**
   * Puxa o feed "For You" alimentado pelo algoritmo de recomendação do Back-end.
   * @param page Número da página para a paginação.
   * @param limit Quantidade de posts carregados por vez (padrão: 10).
   */
  getForYouFeed: (page: number = 1, limit: number = 10) => 
    api.get<PaginatedPosts>(`/posts/foryou?page=${page}&limit=${limit}`),
  
  /**
   * Sistema de Curtidas (Toggle Like).
   * Se já curtiu, o back remove a curtida; se não curtiu, adiciona. Salva direto no banco.
   */
  toggleLike: (postId: string) => 
    api.post<{ likes_count: number; has_liked: boolean }>(`/posts/${postId}/like`),

  /**
   * Puxa a lista de comentários vinculados ao post (Validação Cascade Delete no Banco).
   */
  getComments: (postId: string) => 
    api.get<Comment[]>(`/posts/${postId}/comments`),

  /**
   * Cria um novo comentário vinculado ao post e salva imediatamente no banco de dados.
   */
  addComment: (postId: string, content: string) => 
    api.post<Comment>(`/posts/${postId}/comments`, { content }),

  uploadImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file)); // "files" deve bater com o back-end
    
    return api.post<string[]>("/posts/uploads", formData);
  },

  create: (data: Post) => 
    api.post<any>("/posts/", data),
};

export const routesApi = {
  getById: (id: string) => api.get<Route>(`/routes/${id}`),
  clone: (id: string) => api.post<Route>(`/routes/${id}/clone`),
};

export const mapsApi = {
  // Consulta diretamente a API do Nominatim de forma gratuita
  searchPlace: async (query: string): Promise<LocationData[]> => {
    if (!query || query.length < 3) return [];
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((item: any) => ({
      name: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    }));
  },
};