import { useState, useEffect, useMemo } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useReviews } from "../context/ReviewsContext";

export default function ReviewNew() {
  const navigate = useNavigate();
  const { films, addReview, loadFilms } = useReviews();

  const [filmId, setFilmId] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Ensure films are loaded
  useEffect(() => {
    if (films.length === 0) loadFilms();
  }, [films, loadFilms]);

  // Filter films by search query
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

    const newId = addReview({ film, reviewText });
    navigate(`/reviews/${newId}`);
  };

  const selectedFilm = films.find((f) => f.id === filmId);

  return (
    <div>
      <h2>Write a Review</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        <label style={{ position: "relative" }}>
          <span style={{ display: "block", marginBottom: 6 }}>
            Search for a Film
          </span>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Type a film title..."
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              fontSize: 16,
            }}
          />

          {/* Dropdown results */}
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
            >
              {filteredFilms.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setFilmId(f.id);
                    setSearch(f.title);
                    setShowDropdown(false);
                  }}
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

        {selectedFilm && (
          <div
            style={{
              marginTop: 4,
              fontSize: 15,
              opacity: 0.9,
              color: "#333",
            }}
          >
            Selected: <strong>{selectedFilm.title}</strong>
          </div>
        )}

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
