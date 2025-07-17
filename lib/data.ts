import { supabase } from './supabase'

export async function getEpisodes(seasonId: number) {
  const { data, error } = await supabase
    .from('episodes')
    .select('season_id, episode_number, title, description, date, duration, language, cover, download_link, qualities, latino_link, castellano_link')
    .eq('season_id', seasonId)
    .order('episode_number', { ascending: true });

  if (error) {
    console.error('Error cargando episodios desde Supabase:', error.message);
    return [];
  }

  return data || [];
}

export async function getSeasons() {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error cargando temporadas desde Supabase:', error.message);
    return [];
  }

  return data || [];
}
