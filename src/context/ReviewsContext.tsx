import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const STORAGE_KEY = "mubi-reviews:v1";
const ReviewsContext = createContext<ReviewsStore | null>(null);

// Helper functions for loading/saving reviews in localStorage
function loadReviewsFromStorage(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function saveReviewsToStorage(reviews: Review[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // ignore write errors (e.g. private mode)
  }
}

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [films, setFilms] = useState<Film[]>([]);
  const [reviews, setReviews] = useState<Review[]>(() =>
    loadReviewsFromStorage()
  );
  const [loadingFilms, setLoadingFilms] = useState(false);
  const [search, setSearch] = useState("");

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    saveReviewsToStorage(reviews);
  }, [reviews]);

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

  // Placeholder logic for adding/deleting reviews
  const addReview: ReviewsStore["addReview"] = ({ film, reviewText }) => {
    const now = new Date().toISOString();
    const id = Math.random().toString(36).slice(2, 10);
    const review: Review = {
      id,
      filmId: film.id,
      filmTitle: film.title,
      reviewText: reviewText.trim(),
      createdAt: now,
      updatedAt: now,
    };
    setReviews((prev) => [review, ...prev]);
    return id;
  };

  const deleteReview: ReviewsStore["deleteReview"] = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const getReviewById: ReviewsStore["getReviewById"] = (id) => {
    return reviews.find((r) => r.id === id);
  };

  const value = useMemo<ReviewsStore>(
    () => ({
      films,
      reviews,
      loadingFilms,
      search,
      setSearch,
      addReview,
      deleteReview,
      getReviewById,
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
