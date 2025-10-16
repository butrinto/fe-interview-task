import { createContext, useContext, useMemo, useRef, useState } from "react";
import { API_URL } from "../constants";
import type { Film, Review } from "../types";

// Global shape of our store
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

const ReviewsContext = createContext<ReviewsStore | null>(null);

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [films, setFilms] = useState<Film[]>([]);
  const [reviews] = useState<Review[]>([]);
  const [loadingFilms, setLoadingFilms] = useState(false);
  const [search, setSearch] = useState("");

  // Prevent multiple fetches on re-render
  const loadedRef = useRef(false);

  // Fetch film data from API_URL
  const loadFilms = () => {
    if (loadedRef.current || loadingFilms) return;
    loadedRef.current = true;
    setLoadingFilms(true);

    fetch(API_URL)
      .then((r) => r.json())
      .then((data: Film[]) => {
        setFilms(data);
      })
      .catch((err) => {
        console.error("Failed to load films:", err);
      })
      .finally(() => setLoadingFilms(false));
  };

  const value = useMemo<ReviewsStore>(
    () => ({
      films,
      reviews,
      loadingFilms,
      search,
      setSearch,
      addReview: () => "",
      deleteReview: () => {},
      getReviewById: () => undefined,
      loadFilms,
    }),
    [films, reviews, loadingFilms, search]
  );

  return (
    <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>
  );
}

// Hook for consuming the context
export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used inside <ReviewsProvider>");
  return ctx;
}
