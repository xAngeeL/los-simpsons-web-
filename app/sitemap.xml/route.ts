import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const urls = [
    { loc: '/', priority: '1.0' },
    { loc: '/peliculas', priority: '0.9' },
  ];

  const { data: seasons } = await supabase.from('seasons').select('id');
  const { data: episodes } = await supabase.from('episodes').select('season_id, episode_number');
  const { data: movies } = await supabase.from('movies').select('slug');

  if (seasons) {
    seasons.forEach(({ id }) => {
      urls.push({ loc: `/temporadas/${id}`, priority: '0.8' });
    });
  }

  if (episodes) {
    episodes.forEach(({ season_id, episode_number }) => {
      const ep = String(episode_number).padStart(2, '0');
      urls.push({ loc: `/temporada/${season_id}x${ep}`, priority: '0.7' });
    });
  }

  if (movies) {
    movies.forEach(({ slug }) => {
      urls.push({ loc: `/pelicula/${slug}`, priority: '0.7' });
    });
  }

  const baseUrl = 'https://homerverso.tv';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ loc, priority }) => `
  <url>
    <loc>${baseUrl}${loc}</loc>
    <priority>${priority}</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
