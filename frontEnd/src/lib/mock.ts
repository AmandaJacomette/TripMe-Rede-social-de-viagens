export type Post = {
  id: string;
  author: { name: string; handle: string; avatar: string };
  location: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  time: string;
};

export type Place = {
  id: string;
  name: string;
  image: string;
  rating: number;
  posts: number;
  region: string;
};

export type Stop = {
  id: string;
  name: string;
  image: string;
  description: string;
};

export type Route = {
  id: string;
  title: string;
  cover: string;
  days: number;
  stops: Stop[];
  author: { name: string; avatar: string };
  likes: number;
  description?: string;
};

export type Creator = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  bio: string;
};

const img = (q: string, w = 1200) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=${w}&q=80`;

export const posts: Post[] = [
  { id: "1", author: { name: "Giovana Santos", handle: "@giosantos", avatar: "https://i.pravatar.cc/80?img=32" },
    location: "Fernando de Noronha, PE", image: img("photo-1507525428034-b723cf961d3e"),
    caption: "Sem palavras pra esse paraíso. A água é tão cristalina que dá pra ver os peixes nadando ao redor 🐠💙", likes: 1240, comments: 86, time: "2h" },
  { id: "2", author: { name: "Bruno Pacheco", handle: "@brupacheco", avatar: "https://i.pravatar.cc/80?img=12" },
    location: "Paraty, RJ", image: img("photo-1564594985645-4427056e22e2"),
    caption: "Centro histórico de Paraty é um verdadeiro museu a céu aberto. Vale cada centavo da viagem.", likes: 432, comments: 21, time: "5h" },
  { id: "3", author: { name: "James Yamada", handle: "@jamesyam", avatar: "https://i.pravatar.cc/80?img=15" },
    location: "Cabo Frio, RJ", image: img("photo-1519046904884-53103b34b206"),
    caption: "Descobri esse cantinho escondido na praia, vento na cara e cara de criança o dia inteiro ☀️", likes: 980, comments: 54, time: "1d" },
  { id: "4", author: { name: "Amanda Lis", handle: "@amandalis", avatar: "https://i.pravatar.cc/80?img=47" },
    location: "Arraial do Cabo, RJ", image: img("photo-1473496169904-658ba7c44d8a"),
    caption: "Praias lotadas? Que nada, achei esse paraíso pra mim 🏝️", likes: 612, comments: 33, time: "1d" },
];

export const trending = [
  { name: "Cabo Frio", posts: "12k" },
  { name: "Rio de Janeiro", posts: "32k" },
  { name: "São Paulo", posts: "26k" },
  { name: "Búzios", posts: "8k" },
  { name: "Florianópolis", posts: "9k" },
];

export const suggestions: Creator[] = [
  { id: "c1", name: "Anna Clara Sousa", handle: "@annaclara", avatar: "https://i.pravatar.cc/80?img=49", followers: "12k", bio: "Mochileira pelo Brasil" },
  { id: "c2", name: "Paulo Ribeiro", handle: "@pauloribeiro", avatar: "https://i.pravatar.cc/80?img=13", followers: "8k", bio: "Trilhas e cachoeiras" },
  { id: "c3", name: "Camila Sernandes", handle: "@camisernandes", avatar: "https://i.pravatar.cc/80?img=10", followers: "5k", bio: "Praias escondidas" },
  { id: "c4", name: "Rafael Monteiro", handle: "@rafamont", avatar: "https://i.pravatar.cc/80?img=14", followers: "3k", bio: "Fotografia de viagem" },
  { id: "c5", name: "Júlia Carvalho", handle: "@jucarv", avatar: "https://i.pravatar.cc/80?img=20", followers: "21k", bio: "Roteiros gastronômicos" },
  { id: "c6", name: "Diego Almeida", handle: "@diegoalm", avatar: "https://i.pravatar.cc/80?img=33", followers: "1.2k", bio: "Surf e litoral nordestino" },
];

export const popularPlaces: Place[] = [
  { id: "p1", name: "Cabo Frio", image: img("photo-1507525428034-b723cf961d3e"), rating: 4.8, posts: 1200, region: "RJ" },
  { id: "p2", name: "Rio de Janeiro", image: img("photo-1483729558449-99ef09a8c325"), rating: 4.7, posts: 3200, region: "RJ" },
  { id: "p3", name: "São Paulo", image: img("photo-1543059080-f9b1272213d5"), rating: 4.5, posts: 2600, region: "SP" },
  { id: "p4", name: "Fernando de Noronha", image: img("photo-1559827260-dc66d52bef19"), rating: 4.9, posts: 980, region: "PE" },
  { id: "p5", name: "Ouro Preto", image: img("photo-1564594985645-4427056e22e2"), rating: 4.6, posts: 740, region: "MG" },
  { id: "p6", name: "Santos", image: img("photo-1502602898657-3e91760cbb34"), rating: 4.3, posts: 510, region: "SP" },
];

export const routes: Route[] = [
  {
    id: "r1",
    title: "Fugindo das praias lotadas",
    cover: img("photo-1473496169904-658ba7c44d8a"),
    days: 4,
    description: "Um roteiro tranquilo por praias menos conhecidas do litoral fluminense, perfeito pra fugir da multidão.",
    stops: [
      { id: "s1", name: "Praia do Foguete", image: img("photo-1473496169904-658ba7c44d8a"), description: "Areia clara, mar agitado e ótimo para um pôr do sol sem multidão." },
      { id: "s2", name: "Praia das Conchas", image: img("photo-1519046904884-53103b34b206"), description: "Pequena, cercada por morros e com águas calmas — ideal pra família." },
      { id: "s3", name: "Praia do Peró", image: img("photo-1502933691298-84fc14542831"), description: "Longa faixa de areia e ventos perfeitos para kitesurf." },
      { id: "s4", name: "Pontal do Atalaia", image: img("photo-1507525428034-b723cf961d3e"), description: "Mirante natural com vista 360º das praias da região." },
    ],
    author: { name: "Amanda Lis", avatar: "https://i.pravatar.cc/80?img=47" },
    likes: 320,
  },
  {
    id: "r2",
    title: "Roteiro pelas cidades históricas de MG",
    cover: img("photo-1564594985645-4427056e22e2"),
    days: 7,
    description: "Uma semana mergulhando na história colonial mineira, com gastronomia e arquitetura barroca.",
    stops: [
      { id: "s1", name: "Ouro Preto", image: img("photo-1564594985645-4427056e22e2"), description: "Capital do barroco brasileiro, ruas de pedra e igrejas históricas." },
      { id: "s2", name: "Tiradentes", image: img("photo-1483729558449-99ef09a8c325"), description: "Pequena, charmosa e com a melhor gastronomia mineira." },
      { id: "s3", name: "São João del Rei", image: img("photo-1543059080-f9b1272213d5"), description: "Maria Fumaça histórica e centro preservado." },
      { id: "s4", name: "Mariana", image: img("photo-1559827260-dc66d52bef19"), description: "Primeira cidade de Minas, cheia de história." },
    ],
    author: { name: "James Yamada", avatar: "https://i.pravatar.cc/80?img=15" },
    likes: 540,
  },
  {
    id: "r3",
    title: "Surf trip pelo litoral sul",
    cover: img("photo-1502933691298-84fc14542831"),
    days: 5,
    description: "Picos de surf no sul da Bahia, com vibe alternativa e praias paradisíacas.",
    stops: [
      { id: "s1", name: "Itacaré", image: img("photo-1502933691298-84fc14542831"), description: "Base perfeita pra explorar as praias do entorno." },
      { id: "s2", name: "Praia da Tiririca", image: img("photo-1473496169904-658ba7c44d8a"), description: "Pico clássico de surf em Itacaré." },
      { id: "s3", name: "Engenhoca", image: img("photo-1519046904884-53103b34b206"), description: "Acesso por trilha, recompensa com mar perfeito." },
      { id: "s4", name: "Havaizinho", image: img("photo-1507525428034-b723cf961d3e"), description: "Praia paradisíaca com piscinas naturais." },
    ],
    author: { name: "Bruno Pacheco", avatar: "https://i.pravatar.cc/80?img=12" },
    likes: 410,
  },
];

export const notifications = [
  { id: "n1", who: "Anna Clara Sousa", avatar: "https://i.pravatar.cc/80?img=49", action: "curtiu sua publicação", time: "2 min" },
  { id: "n2", who: "Paulo Ribeiro", avatar: "https://i.pravatar.cc/80?img=13", action: "publicou um novo roteiro", time: "1h" },
  { id: "n3", who: "Camila Sernandes", avatar: "https://i.pravatar.cc/80?img=10", action: "comentou no seu roteiro", time: "3h" },
  { id: "n4", who: "James Yamada", avatar: "https://i.pravatar.cc/80?img=15", action: "salvou seu roteiro", time: "1d" },
  { id: "n5", who: "Bruno Pacheco", avatar: "https://i.pravatar.cc/80?img=12", action: "marcou você em uma foto", time: "2d" },
];
