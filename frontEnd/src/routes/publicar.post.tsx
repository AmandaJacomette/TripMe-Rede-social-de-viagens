import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { ImagePlus, MapPin, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { mapsApi, postsApi, type LocationData } from "@/lib/api"; 
import { useAuth } from "@/lib/auth"; // Importando o seu auth para deixar o avatar dinâmico

type PostCreate = {
  content?: string;
  route_id?: string;
  photo_urls?: string[];
  location_name?: string;
  latitude?: number;
  longitude?: number;
};

export const Route = createFileRoute("/publicar/post")({ component: Page });

function Page() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const user = useAuth()?.user;
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [loadingMap, setLoadingMap] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 3 && !selectedLocation) {
        setLoadingMap(true);
        const results = await mapsApi.searchPlace(searchQuery);
        setSuggestions(results);
        setLoadingMap(false);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedLocation]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...filesArray]);
      
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handlePublish = async () => {
    if (!content.trim() && imageFiles.length === 0) return;
    setIsSubmitting(true);

    try {
      let uploadedUrls: string[] = [];

      if (imageFiles.length > 0) {
        uploadedUrls = await postsApi.uploadImages(imageFiles);
      }

      const postPayload: PostCreate = {
        content: content.trim() || undefined,
        route_id: undefined, 
        photo_urls: uploadedUrls,
        location_name: selectedLocation ? selectedLocation.name : undefined,
        latitude: selectedLocation ? selectedLocation.latitude : undefined,
        longitude: selectedLocation ? selectedLocation.longitude : undefined,
      };

      await postsApi.create(postPayload as any);
      
      navigate({ to: "/" });
    } catch (error) {
      console.error("Erro ao publicar:", error);
      alert("Erro ao salvar publicação no banco de dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold mb-4">Nova publicação</h1>
        <div className="rounded-2xl border bg-card p-5 space-y-4 shadow-sm">
          
          <div className="flex items-center gap-3">
            <img 
              src={user?.avatar || "https://i.pravatar.cc/80?img=47"} 
              className="size-10 rounded-full object-cover border" 
              alt="Avatar" 
            />
            <div className="font-semibold text-sm">
              {user?.name || "Viajante"}{" "}
              <span className="text-muted-foreground font-normal block text-xs">
                {user?.username ? `@${user.username}` : ""}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1 border rounded-xl bg-muted/20">
                {imagePreviews.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border bg-background group">
                    <img src={url} className="w-full h-full object-cover" alt="Preview" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 hover:bg-black transition-colors cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="block h-24 rounded-2xl border-2 border-dashed bg-muted/40 hover:bg-muted cursor-pointer flex items-center justify-center text-muted-foreground transition-all">
              <div className="text-center">
                <ImagePlus className="mx-auto size-6" />
                <div className="text-xs mt-1">
                  {imagePreviews.length > 0 ? "Adicionar mais fotos" : "Adicionar fotos"}
                </div>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                className="hidden" 
                onChange={handleImagesChange} 
                disabled={isSubmitting} 
              />
            </label>
          </div>

          <textarea 
            placeholder="Escreva uma legenda..." 
            rows={3} 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            className="w-full rounded-xl border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30 resize-none" 
          />

          <div className="relative">
            <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <input 
              placeholder="Adicionar localização (Ex: Copacabana...)" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (selectedLocation) setSelectedLocation(null);
              }}
              disabled={isSubmitting}
              className="w-full rounded-full border bg-card pl-10 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--brand-red)]/30" 
            />
            {loadingMap && <Loader2 className="absolute right-3 top-3 size-4 animate-spin text-muted-foreground" />}

            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border rounded-xl shadow-lg overflow-hidden z-50 max-h-48 overflow-y-auto">
                {suggestions.map((place, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => {
                      setSelectedLocation(place);
                      setSearchQuery(place.name);
                      setSuggestions([]);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs hover:bg-slate-50 border-b last:border-0 truncate block text-slate-700 cursor-pointer"
                  >
                    {place.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handlePublish}
            disabled={isSubmitting || (!content.trim() && imageFiles.length === 0)}
            className="w-full rounded-full bg-[color:var(--brand-red)] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Salvando {imageFiles.length} foto(s) na nuvem...
              </>
            ) : "Publicar"}
          </button>

        </div>
      </div>
    </AppShell>
  );
}