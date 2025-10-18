// src/types.ts

export type Film = {
  id: string;
  title: string;
  release_year?: number;
  genres?: string[];
  image_url?: string;
  video_url?: string;

  // Optional cast list for director and credits lookup
  cast?: {
    id: string;
    name: string;
    credits?: string[];
  }[];
};

export type Review = {
  id: string;
  filmId: string;
  filmTitle: string;
  reviewText: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
};
