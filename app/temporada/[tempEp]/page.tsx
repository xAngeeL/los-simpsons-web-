'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getEpisodes } from '@/lib/data';
import { slugify } from '@/lib/utils/slugify';

const resolveProxy = (url: string) => {
  return `/api/proxy?url=${encodeURIComponent(url)}`;
};


export default function EpisodePage() {
  const params = useParams();
  const [seasonId, episodeNumber] = (params.tempEp as string)
    .split('x')
    .map((val) => parseInt(val, 10));

  const [episodes, setEpisodes] = useState<any[]>([]);
  const [episode, setEpisode] = useState<any | null>(null);
  const [selectedLang, setSelectedLang] = useState<'castellano' | 'latino' | null>(null);

  useEffect(() => {
    async function fetchData() {
      const eps = await getEpisodes(seasonId);
      setEpisodes(eps);

      const found = eps.find(
        (ep: any) =>
          ep.season_id === seasonId && ep.episode_number === episodeNumber
      );
      setEpisode(found || null);

      const lastLang = localStorage.getItem('selected-language') as 'castellano' | 'latino' | null;
      if (found && lastLang) {
        setSelectedLang(lastLang);
      }

      (window as any).__EPISODE__ = found;
    }

    fetchData();
  }, [seasonId, episodeNumber]);

  if (!episode) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold">Episodio no encontrado</h1>
        <Link href="/" className="text-blue-500 underline mt-2 inline-block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const getUrl = () => {
    const baseUrl = selectedLang === 'castellano' ? episode.castellano_link :
                    selectedLang === 'latino' ? episode.latino_link : null;
    return baseUrl ? resolveProxy(baseUrl) : null;
  };

  const selectedUrl = getUrl();

  const currentIndex = episodes.findIndex((ep) => ep.episode_number === episode.episode_number);
  const previous = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const next = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : null;

  function handleSelect(lang: 'castellano' | 'latino') {
    setSelectedLang(lang);
    localStorage.setItem('selected-language', lang);
    const videoSection = document.getElementById('video');
    if (videoSection) videoSection.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-2">{episode.title}</h1>
      <p className="text-sm text-gray-400 mb-6">
        Temporada {episode.season_id} - Episodio {episode.episode_number}
      </p>

      <div className="flex gap-6 mb-6">
        <button
          onClick={() => handleSelect('castellano')}
          className={`px-6 py-2 rounded-lg border transition ${
            selectedLang === 'castellano'
              ? 'bg-yellow-400 text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          CASTELLANO
        </button>
        <button
          onClick={() => handleSelect('latino')}
          className={`px-6 py-2 rounded-lg border transition ${
            selectedLang === 'latino'
              ? 'bg-yellow-400 text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          LATINO
        </button>
      </div>

      {selectedLang && (
        <div
          id="video"
          className="w-full h-[720px] bg-black rounded-lg overflow-hidden flex items-center justify-center"
        >
          {selectedUrl ? (
            <iframe
              src={selectedUrl}
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          ) : (
            <span className="text-white opacity-50 text-sm">
              No disponible en {selectedLang}
            </span>
          )}
        </div>
      )}

      <div className="mt-10 flex justify-between items-center text-base gap-4 font-medium">
        {previous ? (
          <Link
            href={`/temporada/${seasonId}x${String(previous.episode_number).padStart(2, '0')}`}
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg"
          >
            ⬅ Anterior
          </Link>
        ) : <div />}

        <Link
          href={`/temporadas/${seasonId}`}
          className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg"
        >
          📺 Episodios
        </Link>

        {next ? (
          <Link
            href={`/temporada/${seasonId}x${String(next.episode_number).padStart(2, '0')}`}
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg"
          >
            Siguiente ➡
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
