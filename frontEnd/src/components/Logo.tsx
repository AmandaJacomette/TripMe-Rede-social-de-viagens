import { Link } from "@tanstack/react-router";
import { Plane } from "lucide-react";

export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sz = size === "lg" ? "text-4xl" : size === "sm" ? "text-xl" : "text-2xl";
  return (
    <Link to="/" className={`inline-flex items-center gap-1 font-display font-bold ${sz} text-[color:var(--brand-red)] leading-none`}>
      <span>TripMe</span>
      <Plane className="size-5 -rotate-12 text-[color:var(--brand-green)]" strokeWidth={2.4} />
    </Link>
  );
}
