import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useReviews } from "../context/ReviewsContext";

export default function ReviewNew() {
  const navigate = useNavigate();
  const { films, addReview, loadFilms } = useReviews();
  const [filmId, setFilmId] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [error, setError] = useState("");

  // Ensure film data is loaded
  if (films.length === 0) {
    loadFilms();
  }

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

  return (
    <div>
      <h2>Write a Review</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <label>
          <span>Film</span>
          <select
            value={filmId}
            onChange={(e) => setFilmId(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          >
            <option value="">Select a film</option>
            {films.map((f) => (
              <option key={f.id} value={f.id}>
                {f.title} ({f.release_year})
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Review</span>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={6}
            placeholder="What did you think of this film?"
            style={{ width: "100%", padding: 8 }}
          />
        </label>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          type="submit"
          style={{
            padding: "8px 16px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            alignSelf: "start",
          }}
        >
          Save Review
        </button>
      </form>
    </div>
  );
}
