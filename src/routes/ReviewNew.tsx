import { useState, useEffect, useMemo, useRef } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useReviews } from "../context/ReviewsContext";
import { StarRating } from "react-flexible-star-rating";

export default function ReviewNew() {
  const navigate = useNavigate();
  const { films, addReview, loadFilms } = useReviews();

  const [filmId, setFilmId] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number>(0); // ★ new
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapRef = useRef<HTMLLabelElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  const listboxId = "film-search-results";

  useEffect(() => {
    if (films.length === 0) loadFilms();
  }, [films, loadFilms]);

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  const filteredFilms = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return films;
    return films.filter((f) => f.title.toLowerCase().includes(q));
  }, [films, search]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!filmId) {
      setError("Please select a film.");
      return;
    }
    if (!reviewText.trim()) {
      setError("Please enter your review.");
      return;
    }

    const film = films.find((f) => f.id === filmId);
    if (!film) {
      setError("Selected film not found.");
      return;
    }

    const newId = addReview({ film, reviewText, rating }); // ★ send rating
    navigate(`/reviews/${newId}`);
  };

  return (
    <div>
      <h2>Write a Review</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <label ref={wrapRef} style={{ position: "relative", display: "block" }}>
          <span style={{ display: "block", marginBottom: 6 }}>
            Search for a Film
          </span>

          <input
            ref={inputRef}
            type="search"
            value={search}
            onChange={(e) => {
              const val = e.target.value;
              setSearch(val);
              setShowDropdown(true);
              if (filmId) setFilmId("");
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowDropdown(false);
                return;
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                firstOptionRef.current?.focus();
              }
            }}
            onBlur={() => {
              setTimeout(() => setShowDropdown(false), 120);
            }}
            placeholder="Type a film title..."
            style={{
              width: "100%",
              padding: "12px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 16,
              lineHeight: 1.4,
            }}
            aria-label="Search for a film"
            aria-expanded={showDropdown}
            aria-controls={listboxId}
            aria-autocomplete="list"
            autoComplete="off"
          />

          {showDropdown && filteredFilms.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: 8,
                marginTop: 4,
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                maxHeight: 240,
                overflowY: "auto",
                zIndex: 20,
              }}
              role="listbox"
              id={listboxId}
              aria-label="Search results"
            >
              {filteredFilms.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setFilmId(f.id);
                    setSearch(f.title);
                    setShowDropdown(false);
                  }}
                  ref={i === 0 ? firstOptionRef : undefined}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "10px 12px",
                    background:
                      f.id === filmId ? "rgba(0,0,0,0.05)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                  role="option"
                  aria-selected={f.id === filmId}
                >
                  {f.title}{" "}
                  {f.release_year && (
                    <span style={{ opacity: 0.7 }}>({f.release_year})</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </label>

        {/* ★ Rating picker */}
        <div>
          <span style={{ display: "block", marginBottom: 6 }}>Rating</span>
          <StarRating
            initialRating={rating}
            onRatingChange={setRating}
            starsLength={5}
            dimension={10} // adjust size to taste
            isHalfRatingEnabled={false}
            isReadOnly={false}
            color="var(--star-colour)"
          />
        </div>

        <label>
          <span style={{ display: "block", marginBottom: 6 }}>Review</span>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={6}
            placeholder="What did you think of this film?"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              resize: "vertical",
              fontSize: 15,
            }}
          />
        </label>

        {error && <p style={{ color: "red", margin: "4px 0 0" }}>{error}</p>}

        <button
          type="submit"
          style={{
            padding: "10px 16px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            alignSelf: "start",
            marginTop: 10,
          }}
        >
          Save Review
        </button>
      </form>
    </div>
  );
}
