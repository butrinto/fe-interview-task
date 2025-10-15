import { createContext, useContext, useMemo, useState } from "react";
import type { Film, Review } from "../types";

// Global shape
type ReviewsStore = {
  films: Film[];
  reviews: Review[];
  loadingFilms: boolean;
  search: string;
  setSearch: (v: string) => void;
  addReview: (input: { film: Film; reviewText: string }) => string;
  deleteReview: (id: string) => void;
  getReviewById: (id: string) => Review | undefined;
  loadFilms: () => void;
};

const ReviewsCtx = createContext<ReviewsStore | null>(null);

// Provider with placeholder state
export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [films] = useState<Film[]>([]);
  const [reviews] = useState<Review[]>([]);
  const [loadingFilms] = useState(false);
  const [search, setSearch] = useState("");

  const value = useMemo<ReviewsStore>(
    () => ({
      films,
      reviews,
      loadingFilms,
      search,
      setSearch,
      // empty placeholders
      addReview: () => "",
      deleteReview: () => {},
      getReviewById: () => undefined,
      loadFilms: () => {},
    }),
    [films, reviews, loadingFilms, search]
  );

  return <ReviewsCtx.Provider value={value}>{children}</ReviewsCtx.Provider>;
}

// Hooks for consuming the content
export function useReviews() {
  const ctx = useContext(ReviewsCtx);
  if (!ctx) throw new Error("useReviews must be used inside <ReviewsProvider>");
  return ctx;
}
