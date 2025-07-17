import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clapperboard } from "lucide-react";
import type { Season } from "@/lib/data";

type Props = {
  season: Season;
};

export function SeasonCard({ season }: Props) {
  return (
    <Link href={`/temporada/${season.id}`}>
      <div className="bg-[#0B1E3D] rounded-md overflow-hidden">
        <Image
          src={season.cover}
          alt={`Temporada ${season.number}`}
          width={300}
          height={400}
          className="w-full h-auto object-cover"
        />
        <div className="p-2 text-xs">
          <h3 className="font-semibold text-white">Temporada {season.number}</h3>
          <div className="flex items-center text-gray-400 gap-1 mt-1">
            <CalendarDays className="w-4 h-4" />
            <span>{season.year}</span>
          </div>
          <div className="flex items-center text-gray-400 gap-1">
            <Clapperboard className="w-4 h-4" />
            <span>{season.episodes} episodios</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
