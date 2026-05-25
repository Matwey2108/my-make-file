import { Heart, Clock, Flame } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";

interface RecipeCardProps {
  image: string;
  title: string;
  time: string;
  calories: string;
  tags?: string[];
  isFavorite?: boolean;
}

export function RecipeCard({ image, title, time, calories, tags, isFavorite = false }: RecipeCardProps) {
  return (
    <div className="bg-card rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-primary text-primary' : 'text-foreground/60'}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="mb-3">{title}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4" />
            <span>{calories}</span>
          </div>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-secondary rounded-full text-xs text-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
