export type Episode = {
  id: number;
  episode_number: number;
  title: string;
  description: string;
  date: string;
  duration: string;
  language: string;
  cover: string;
  download_link: string;
  qualities: string[];
  season_id: number;
  latino_link?: string;
  castellano_link?: string;
};
