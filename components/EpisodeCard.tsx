import Image from "next/image";
import { CalendarDays, Clock } from "lucide-react";
import type { Episode } from "@/lib/data";

type Props = { episode: Episode };

export function EpisodeCard({ episode }: Props) {
  return (
    <div className="bg-[#112344] rounded-lg overflow-hidden md:flex mb-6">
      <Image
        src={episode.cover}
        alt={episode.title}
        width={200}
        height={120}
        className="w-full md:w-48 h-auto object-cover"
      />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {episode.id}. {episode.title}
          </h3>
          <div className="flex flex-wrap items-center text-gray-400 text-sm gap-4 mt-2">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              {episode.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {episode.duration}
            </span>
          </div>
          <p className="mt-2 text-gray-300">{episode.description}</p>
          <div className="mt-3 text-sm">
            <span className="font-medium text-white">Enlaces disponibles</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {episode.qualities.map((q) => (
                <span
                  key={q}
                  className="bg-[#1C2A4A] px-2 py-1 rounded text-xs"
                >
                  {q}
                </span>
              ))}
              <span className="bg-[#1C2A4A] px-2 py-1 rounded text-xs">
                {episode.language}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          <button className="text-orange-400 border border-orange-400 px-3 py-1 rounded text-sm">
            Reportar Problema
          </button>
          <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-semibold">
            Ver
          </button>
        </div>
      </div>
    </div>
  );
}
