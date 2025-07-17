'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getEpisodes, getSeasons } from '@/lib/data';
import { Calendar, Clock } from 'lucide-react';
import { ReportModal } from '@/components/ReportModal';

export default function SeasonPage() {
  const { id } = useParams();
  const seasonId = parseInt(id as string, 10);

  const [season, setSeason] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [reportEpisode, setReportEpisode] = useState<any | null>(null);
  const [seasons, setSeasons] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const allSeasons = await getSeasons();
      setSeasons(allSeasons);

      const foundSeason = allSeasons.find((s: any) => s.id === seasonId);
      setSeason(foundSeason);

      const ep = await getEpisodes(seasonId);
      setEpisodes(ep);
    }

    fetchData();
  }, [seasonId]);

  if (!season) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Episodio no encontrado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e3a8a] text-white relative pb-32">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Encabezado */}
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
              La temporada {season.number} incluye {episodes.length} episodio{episodes.length === 1 ? '' : 's'}.
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

        {/* Lista de episodios */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">Episodios</h2>
          <div className="flex flex-col gap-10">
            {episodes.map((ep) => (
              <div key={ep.episode_number} className="flex flex-col md:flex-row items-start gap-6 p-4 bg-white/5 rounded-lg shadow">
                <Image
                  src={ep.cover}
                  alt={ep.title}
                  width={200}
                  height={200}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">
                    {ep.episode_number}. {ep.title}
                  </h3>
                  <div className="flex gap-4 text-sm text-gray-300 mt-1">
                    <span>{ep.date}</span>
                    <span>{ep.duration}</span>
                  </div>
                  <p className="text-gray-300 mt-2 text-sm">{ep.description}</p>
                  <div className="mt-3 flex gap-2 flex-wrap text-xs">
                    <span className="bg-blue-600 px-2 py-1 rounded">1 enlaces</span>
                    {ep.qualities.map((q: string) => (
                      <span key={q} className="bg-slate-700 px-2 py-1 rounded">
                        {q}
                      </span>
                    ))}
                    <span className="bg-slate-700 px-2 py-1 rounded">{ep.language}</span>
                  </div>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <Link
                      href={ep.download_link}
                      className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                    >
                      Descargar episodio
                    </Link>
                    <button
                      onClick={() => setReportEpisode(ep)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                    >
                      Reportar problema
                    </button>
                    <Link
                      href={`/temporada/${ep.season_id}x${String(ep.episode_number).padStart(2, '0')}`}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                    >
                      ▶ Ver episodio
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botones de navegación lateral */}
      <>
        {seasons.find((s: any) => s.id === seasonId - 1) && (
          <Link
            href={`/temporadas/${seasonId - 1}`}
            className="fixed bottom-6 left-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full shadow-lg transition-transform hover:scale-105 z-50"
          >
            ← Temporada {seasonId - 1}
          </Link>
        )}

        {seasons.find((s: any) => s.id === seasonId + 1) && (
          <Link
            href={`/temporadas/${seasonId + 1}`}
            className="fixed bottom-6 right-4 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full shadow-lg transition-transform hover:scale-105 z-50"
          >
            Temporada {seasonId + 1} →
          </Link>
        )}
      </>

      {/* Modal de reporte */}
      {reportEpisode && (
        <ReportModal episode={reportEpisode} onClose={() => setReportEpisode(null)} />
      )}
    </div>
  );
}
