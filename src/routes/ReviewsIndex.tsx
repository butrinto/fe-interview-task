import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useReviews } from "../context/ReviewsContext";

export default function ReviewsIndex() {
  const { loadFilms, films, reviews, loadingFilms } = useReviews();

  // Load films when the page mounts
  useEffect(() => {
    loadFilms();
  }, [loadFilms]);

  // Lookup helpers
  const getFilm = (filmId: string) => films.find((f) => f.id === filmId);
  const getTitle = (filmId: string, fallback: string) =>
    getFilm(filmId)?.title ?? fallback;
  const getYear = (filmId: string) =>
    getFilm(filmId)?.release_year ?? undefined;
  const getImage = (filmId: string) => getFilm(filmId)?.image_url ?? "";

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
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 12,
          }}
        >
          {reviews.map((r) => {
            const title = getTitle(r.filmId, r.filmTitle);
            const year = getYear(r.filmId);
            const img = getImage(r.filmId);

            return (
              <li
                key={r.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "#fff",
                }}
              >
                <Link
                  to={`/reviews/${r.id}`}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      background: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span style={{ opacity: 0.6 }}>No image</span>
                    )}
                  </div>

                  <div style={{ padding: 12 }}>
                    <h3 style={{ margin: "0 0 4px" }}>
                      {title}{" "}
                      {year ? (
                        <span style={{ opacity: 0.7, fontWeight: 400 }}>
                          ({year})
                        </span>
                      ) : null}
                    </h3>

                    <p
                      style={{
                        margin: 0,
                        opacity: 0.85,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {truncate(r.reviewText, 120)}
                    </p>

                    <small
                      style={{
                        opacity: 0.7,
                        display: "inline-block",
                        marginTop: 8,
                      }}
                    >
                      {new Date(r.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </small>
                  </div>
                </Link>
              </li>
            );
          })}
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
