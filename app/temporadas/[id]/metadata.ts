
import { getSeasons } from '@/lib/data';

export async function generateMetadata({ params }: { params: { id: string } }) {
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
