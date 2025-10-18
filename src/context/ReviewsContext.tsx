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

type ReviewsStore = {
  films: Film[];
  reviews: Review[];
  loadingFilms: boolean;
  search: string;
  setSearch: (v: string) => void;
  addReview: (input: {
    film: Film;
    reviewText: string;
    rating: number;
  }) => string;
  deleteReview: (id: string) => void;
  getReviewById: (id: string) => Review | undefined;
  loadFilms: () => void;
};

const STORAGE_KEY = "mubi-reviews:v1";
const ReviewsContext = createContext<ReviewsStore | null>(null);

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
    // ignore write errors
  }
}

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [films, setFilms] = useState<Film[]>([]);
  const [reviews, setReviews] = useState<Review[]>(() =>
    loadReviewsFromStorage()
  );
  const [loadingFilms, setLoadingFilms] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    saveReviewsToStorage(reviews);
  }, [reviews]);

  const loadedRef = useRef(false);

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

  const addReview: ReviewsStore["addReview"] = ({
    film,
    reviewText,
    rating,
  }) => {
    const now = new Date().toISOString();

    // Simple, readable ID using API id and year
    let id = `${film.id}-${film.release_year ?? ""}`;

    // ensure uniqueness if duplicate year/title combo somehow exists
    if (reviews.some((r) => r.id === id)) {
      id = `${id}-${Math.random().toString(36).slice(2, 5)}`;
    }

    const review: Review = {
      id,
      filmId: film.id,
      filmTitle: film.title,
      reviewText: reviewText.trim(),
      createdAt: now,
      updatedAt: now,
      rating, // ← store rating
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

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used inside <ReviewsProvider>");
  return ctx;
}
