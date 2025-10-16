import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useReviews } from "../context/ReviewsContext";

export default function ReviewsIndex() {
  const { loadFilms, films, reviews, loadingFilms } = useReviews();

  // Load films when the page mounts
  useEffect(() => {
    loadFilms();
  }, [loadFilms]);

  const getFilmTitle = (filmId: string) => {
    const film = films.find((f) => f.id === filmId);
    return film ? film.title : "Unknown film";
  };

  return (
    <div>
      <h2>My Reviews</h2>

      {loadingFilms && <p>Loading film data...</p>}

      {!loadingFilms && reviews.length === 0 && (
        <p>
          No reviews yet. <Link to="/new">Write one</Link>
        </p>
      )}

      {!loadingFilms && reviews.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {reviews.map((r) => (
            <li
              key={r.id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "12px 0",
                marginBottom: 8,
              }}
            >
              <h3 style={{ margin: "0 0 4px" }}>
                <Link to={`/reviews/${r.id}`}>
                  {r.filmTitle || getFilmTitle(r.filmId)}
                </Link>
              </h3>
              <p
                style={{
                  margin: "4px 0 8px",
                  color: "#444",
                  whiteSpace: "pre-line",
                }}
              >
                {truncate(r.reviewText, 180)}
              </p>
              <small style={{ opacity: 0.7 }}>
                {new Date(r.createdAt).toLocaleDateString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Simple text truncation for the list view
function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}
