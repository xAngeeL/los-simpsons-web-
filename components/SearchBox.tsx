// components/SearchBox.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Fuse from 'fuse.js';
import { Calendar, Clock, Search, X } from 'lucide-react';
import type { Episode } from '@/types';

interface Props {
  episodes: Episode[];
}

export default function SearchBox({ episodes }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Episode[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setQuery('');
        setResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!query.trim()) return setResults([]);
    const fuse = new Fuse(episodes, {
      keys: ['title', 'description', 'language', 'season_number', 'date'],
      threshold: 0.3,
    });
    setResults(fuse.search(query).map((res) => res.item));
  }, [query, episodes]);

  return (
    <div ref={searchRef} className="relative mx-auto w-full max-w-md mt-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search size={16} className="text-gray-500 dark:text-gray-400" />
      </div>
      {query && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <X
            size={16}
            className="text-gray-500 dark:text-gray-400 cursor-pointer"
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
          />
        </div>
      )}
      <input
        type="text"
        placeholder="Buscar episodios..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-600 bg-white text-black dark:bg-[#1C2A4A] dark:text-white dark:border-gray-400 focus:outline-none transition-colors"
      />
      {query.trim() && (
        <div className="absolute z-30 mt-2 w-full bg-[#0F172A] max-h-[400px] overflow-y-auto rounded-lg shadow-lg ring-1 ring-white/10">
          <ul className="divide-y divide-white/10">
            {results.length ? (
              results.map((ep, idx) => (
                <li key={idx}>
                  <Link
                    href={`/temporada/${ep.season_id}x${String(ep.episode_number).padStart(2, '0')}`}
                    className="flex items-start gap-4 p-4 hover:bg-white/10 transition text-sm text-white"
                  >
                    <Image
                      src={ep.cover}
                      alt={ep.title}
                      width={80}
                      height={80}
                      className="rounded object-cover w-20 h-20"
                    />
                    <div>
                      <p className="font-semibold">
                        T{ep.season_id}E{ep.episode_number}: {ep.title}
                      </p>
                      <p className="text-xs text-gray-300 line-clamp-2">{ep.description}</p>
                      <div className="flex items-center gap-4 text-gray-400 mt-1 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {ep.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {ep.duration}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-sm text-gray-400">Sin resultados</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
