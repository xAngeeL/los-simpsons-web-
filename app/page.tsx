import Image from 'next/image';
import Link from 'next/link';
import { getSeasons, getEpisodes } from '@/lib/data';
import { Calendar, Clock } from 'lucide-react';
import SearchBox from '@/components/SearchBox';
import { Episode } from '@/types';

export default async function HomePage() {
  const seasons = await getSeasons();
  const allEpisodes: Episode[] = [];

  for (const season of seasons) {
    const eps = await getEpisodes(season.id);
    allEpisodes.push(
      ...eps.map((ep: any) => ({
        ...ep,
        season_number: season.number,
      }))
    );
    season.uploadedEpisodes = eps.length;
  }

  return (
    <div className="min-h-screen pb-8 relative bg-gradient-to-b from-yellow-400 to-orange-400 dark:from-[#0B1E3D] dark:to-[#08162D] transition-colors">
      {/* Hero + Search */}
      <section className="text-center py-16 px-4 relative z-10">
        <h2 className="text-5xl font-extrabold mb-2 text-[#0B1E3D] dark:text-yellow-400">
          Todos los episodios en un lugar
        </h2>
        <p className="mb-6 text-lg text-[#334155] dark:text-gray-300">
          Explora y disfruta de todas las temporadas de Los Simpsons.
        </p>
        <SearchBox episodes={allEpisodes} />
      </section>

      {/* Seasons grid */}
      <section className="px-6 pb-16 pt-6 max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold mb-6 text-[#0F172A] dark:text-white">
          Todas las Temporadas ({seasons.length})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {seasons.map((season) => (
            <Link
              key={season.id}
              href={`/temporadas/${season.id}`}
              className="block rounded-lg overflow-hidden shadow-lg bg-white hover:scale-105 dark:bg-[#112344] transition"
            >
              <Image
                src={season.cover}
                alt={`Temporada ${season.number}`}
                width={300}
                height={400}
                className="w-full h-auto"
              />
              <div className="p-3 text-sm">
                <h4 className="font-semibold text-[#0F172A] dark:text-white">
                  Temporada {season.number}
                </h4>
                <p className="text-[#64748B] dark:text-gray-400">{season.year}</p>
                <p className="text-[#64748B] dark:text-gray-400">
                  {season.uploadedEpisodes} episodio{season.uploadedEpisodes === 1 ? '' : 's'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Banner: Películas y especiales */}
      <section className="px-6 max-w-7xl mx-auto mb-4">
        <Link href="/peliculas">
          <div className="relative w-full pb-[25%] cursor-pointer">
            <Image
              src="/peliculas-banner.jpg"
              alt="Películas y especiales"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40" />
          </div>
        </Link>
      </section>
    </div>
  );
}
