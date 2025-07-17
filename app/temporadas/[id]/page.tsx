export const dynamic = 'force-dynamic';
export const dynamicParams = true;

import { getEpisodes, getSeasons } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import EpisodeListWithReport from '@/components/EpisodeListWithReport';
import { type Metadata, type ResolvingMetadata } from 'next';

interface PageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const seasons = await getSeasons();
  return seasons.map((s) => ({ id: s.id.toString() }));
}

export async function generateMetadata(
  { params }: PageProps,
  _parent?: ResolvingMetadata
): Promise<Metadata> {
  const seasonId = Number(params.id);
  if (isNaN(seasonId)) {
    return {
      title: 'Temporada inválida | Homerverso.tv',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const seasons = await getSeasons();
  const season = seasons.find((s) => s.id === seasonId);

  if (!season) {
    return {
      title: 'Temporada no encontrada | Homerverso.tv',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = `Disfruta de todos los episodios de la temporada ${season.number} de Los Simpsons (${season.year}) en castellano y latino. ¡Ver online y descargar en HD gratis!`;

  return {
    title: `Los Simpsons – Temporada ${season.number} en HD | Homerverso.tv`,
    description,
    openGraph: {
      title: `Temporada ${season.number} – Los Simpsons | Homerverso.tv`,
      description,
      url: `https://homerverso.tv/temporadas/${season.id}`,
      siteName: 'Homerverso.tv',
      images: [
        {
          url: season.cover,
          width: 800,
          height: 600,
          alt: `Temporada ${season.number} de Los Simpsons`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Temporada ${season.number} – Los Simpsons`,
      description,
      images: [season.cover],
    },
  };
}

export default async function SeasonPage({ params }: PageProps) {
  const seasonId = Number(params.id);
  if (isNaN(seasonId)) return notFound();

  const seasons = await getSeasons();
  const season = seasons.find((s) => s.id === seasonId);
  if (!season) return notFound();

  const episodes = await getEpisodes(seasonId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white relative pb-32">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <Image
            src={season.cover}
            alt={`Temporada ${season.number}`}
            width={220}
            height={220}
            className="rounded-md object-cover shadow-md"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-yellow-400">
              Los Simpsons - Temporada {season.number}
            </h1>
            <p className="text-sm text-gray-200 mt-2">
              La temporada {season.number} incluye {episodes.length} episodio
              {episodes.length === 1 ? '' : 's'}.
            </p>
            <div className="flex gap-4 mt-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                {season.year}
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                {episodes.length} episodio{episodes.length === 1 ? '' : 's'}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Episodios</h2>
          <EpisodeListWithReport episodes={episodes} />
        </div>
      </div>

      <>
        {seasons.find((s) => s.id === seasonId - 1) && (
          <Link
            href={`/temporadas/${seasonId - 1}`}
            className="fixed bottom-6 left-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full shadow-lg transition-transform hover:scale-105 z-50"
          >
            ← Temporada {seasonId - 1}
          </Link>
        )}
        {seasons.find((s) => s.id === seasonId + 1) && (
          <Link
            href={`/temporadas/${seasonId + 1}`}
            className="fixed bottom-6 right-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full shadow-lg transition-transform hover:scale-105 z-50"
          >
            Temporada {seasonId + 1} →
          </Link>
        )}
      </>
    </div>
  );
}
