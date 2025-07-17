'use client';

import { useState } from 'react';

interface Props {
  castellanoLink: string;
  latinoLink: string;
}

export default function VideoPlayer({ castellanoLink, latinoLink }: Props) {
  const [selectedLang, setSelectedLang] = useState<'castellano' | 'latino'>('castellano');

  const videoSrc = selectedLang === 'castellano' ? castellanoLink : latinoLink;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="mb-4 flex gap-4">
        {castellanoLink && (
          <button
            onClick={() => setSelectedLang('castellano')}
            className={`px-4 py-2 text-sm rounded font-semibold ${
              selectedLang === 'castellano'
                ? 'bg-yellow-400 text-black'
                : 'border border-white text-white'
            }`}
          >
            CASTELLANO
          </button>
        )}
        {latinoLink && (
          <button
            onClick={() => setSelectedLang('latino')}
            className={`px-4 py-2 text-sm rounded font-semibold ${
              selectedLang === 'latino'
                ? 'bg-yellow-400 text-black'
                : 'border border-white text-white'
            }`}
          >
            LATINO
          </button>
        )}
      </div>

      {/* Reproductor */}
      <div className="aspect-video w-full max-w-4xl bg-black rounded-lg overflow-hidden">
        {videoSrc ? (
          <iframe
            src={videoSrc}
            className="w-full h-full"
            allowFullScreen
          />
        ) : (
          <div className="text-white text-center p-6">Enlace no disponible</div>
        )}
      </div>
    </div>
  );
}
