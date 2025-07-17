'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ReportModal } from './ReportModal';

export default function EpisodeListWithReport({ episodes }: { episodes: any[] }) {
  const [reportEpisode, setReportEpisode] = useState<any | null>(null);

  return (
    <>
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
                  <span key={q} className="bg-slate-700 px-2 py-1 rounded">{q}</span>
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

      {/* Modal de reporte */}
      {reportEpisode && (
        <ReportModal episode={reportEpisode} onClose={() => setReportEpisode(null)} />
      )}
    </>
  );
}
