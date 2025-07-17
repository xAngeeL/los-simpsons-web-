'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { Calendar, Clock, Home } from 'lucide-react';
import { ReportModal } from '@/components/ReportModal';
import { createClient } from '@/lib/utils/supabase/client';

interface Pelicula {
  id: number;
  title: string;
  slug: string;
  cover: string;
  year: number;
  duration: string;
  description: string;
}

export default function PeliculasPage() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [reportMovie, setReportMovie] = useState<Pelicula | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPeliculas = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('movies')
      .select('id, title, slug, cover, year, duration, description')
      .order('year', { ascending: true });

    if (error) {
      console.error('Error al obtener películas:', error.message);
    }

    setPeliculas(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPeliculas();
  }, [fetchPeliculas]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1E3D] to-[#08162D] text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-white text-yellow-400 flex items-center gap-1">
            <Home size={14} /> Inicio
          </Link>
          <span className="text-gray-500">›</span>
          <span className="text-white font-semibold">Películas</span>
        </nav>

        {/* Grid de películas */}
        {loading ? (
          <p className="text-white">Cargando películas...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {peliculas.map((pelicula) => (
              <div
                key={pelicula.id}
                className="bg-[#112344] rounded-lg overflow-hidden shadow flex flex-col min-h-[520px]"
              >
                <Image
                  src={pelicula.cover}
                  alt={pelicula.title}
                  width={300}
                  height={260}
                  className="w-full h-[260px] object-cover"
                  loading="lazy"
                />
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-md font-semibold text-white">{pelicula.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {pelicula.year}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {pelicula.duration}</span>
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-3 min-h-[48px]">
                      {pelicula.description}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`/pelicula/${pelicula.slug}`}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded shadow"
                    >
                      ▶ Ver Película
                    </Link>
                    <button
                      onClick={() => setReportMovie(pelicula)}
                      className="text-red-400 border border-red-400 px-3 py-1 rounded text-xs cursor-pointer"
                    >
                      Reportar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de reporte */}
      {reportMovie && (
        <ReportModal
          movie={{ slug: reportMovie.slug, title: reportMovie.title }}
          onClose={() => setReportMovie(null)}
        />
      )}
    </div>
  );
}
