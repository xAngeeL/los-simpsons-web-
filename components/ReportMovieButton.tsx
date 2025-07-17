'use client';

import { useState } from 'react';
import { ReportModal } from './ReportModal';

export default function ReportMovieButton({ slug, title }: { slug: string; title: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
      >
        Reportar problema
      </button>
      {open && (
        <ReportModal
          movie={{ slug, title }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
