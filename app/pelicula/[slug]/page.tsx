'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const resolveProxy = (url: string) => {
  return `/api/proxy?url=${encodeURIComponent(url)}`;
};

export default function PeliculaPage() {
  const { slug } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [selectedLang, setSelectedLang] = useState<'castellano' | 'latino' | null>(null);

  useEffect(() => {
    async function fetchMovie() {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error al obtener la película:', error);
        return;
      }

      setMovie(data);

      const lastLang = localStorage.getItem('selected-movie-language') as 'castellano' | 'latino' | null;
      if (lastLang) {
        setSelectedLang(lastLang);
      }
    }

    fetchMovie();
  }, [slug]);

  function handleSelect(lang: 'castellano' | 'latino') {
    setSelectedLang(lang);
    localStorage.setItem('selected-movie-language', lang);
    const videoSection = document.getElementById('video');
    if (videoSection) videoSection.scrollIntoView({ behavior: 'smooth' });
  }

  const getUrl = () => {
    const baseUrl = selectedLang === 'castellano' ? movie?.castellano_link :
                    selectedLang === 'latino' ? movie?.latino_link : null;
    return baseUrl ? resolveProxy(baseUrl) : null;
  };

  const selectedUrl = getUrl();

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] p-8 text-white">
        <h1 className="text-2xl font-bold">Película no encontrada</h1>
        <Link href="/" className="text-blue-400 underline mt-2 inline-block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] text-white">
      <div className="max-w-5xl mx-auto p-6">
        <div className="text-sm text-gray-400 mb-6 space-x-1">
          <Link href="/" className="hover:underline text-yellow-400">🏠 Inicio</Link>
          <span>{'>'}</span>
          <Link href="/peliculas" className="hover:underline text-yellow-400">Películas</Link>
          <span>{'>'}</span>
          <span className="text-white">{movie.title}</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
        <p className="text-sm text-gray-400 mb-6">
          {movie.year} · {movie.duration} · {movie.language || 'Castellano y Latino'}
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

        <div
          id="video"
          className="w-full h-[720px] bg-black rounded-lg overflow-hidden flex items-center justify-center"
        >
          {/* Iframe fijo visible siempre */}
          <iframe
            src="//mxdrop.to/e/el1zkqkphr7xgj"
            width="100%"
            height="100%"
            scrolling="no"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/peliculas"
            className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-lg text-white text-sm"
          >
            🎬 Películas
          </Link>
        </div>
      </div>
    </div>
  );
}
