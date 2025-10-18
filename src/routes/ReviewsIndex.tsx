import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useReviews } from "../context/ReviewsContext";
import { StarRating } from "react-flexible-star-rating";

export default function ReviewsIndex() {
  const { loadFilms, films, reviews, loadingFilms } = useReviews();

  // Start with no selection so the placeholder shows
  const [genre, setGenre] = useState<string>("");

  // Load films on mount
  useEffect(() => {
    loadFilms();
  }, [loadFilms]);

  const genres = useMemo(() => {
    const set = new Set<string>();
    films.forEach((f) => f.genres?.forEach((g) => set.add(g)));
    return ["All", ...Array.from(set).sort()];
  }, [films]);

  // Helpers
  const getFilm = (filmId: string) => films.find((f) => f.id === filmId);
  const getTitle = (filmId: string, fallback: string) =>
    getFilm(filmId)?.title ?? fallback;
  const getYear = (filmId: string) => getFilm(filmId)?.release_year;
  const getImage = (filmId: string) => getFilm(filmId)?.image_url ?? "";
  const getDirector = (filmId: string): string | undefined => {
    const film = getFilm(filmId);
    const director = film?.cast?.find((p) => p.credits?.includes("Director"));
    return director?.name;
  };

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (genre === "" || genre === "All") return true;
      const film = getFilm(r.filmId);
      return film?.genres?.includes(genre) ?? false;
    });
  }, [reviews, genre, films]);

  // Wireframe-style thumbnail on the right
  const THUMB_W = 180;
  const THUMB_H = 90;

  return (
    <div>
      {/* Controls */}
      <div style={{ marginBottom: 12, padding: "0 12px" }}>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid var(--border)",
            fontSize: 16,
            background: "var(--surface)",
            color: "inherit",
          }}
          aria-label="Filter reviews by genre"
        >
          <option value="" disabled>
            Filter by genre
          </option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {loadingFilms && <p>Loading film data...</p>}

      {!loadingFilms && filtered.length === 0 && (
        <p>
          No matching reviews.{" "}
          <Link to="/new" style={{ color: "var(--link)" }}>
            Write one
          </Link>
        </p>
      )}

      {!loadingFilms && filtered.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gridTemplateColumns: "1fr",
          }}
        >
          {filtered.map((r, idx) => {
            const title = getTitle(r.filmId, r.filmTitle);
            const year = getYear(r.filmId);
            const director = getDirector(r.filmId);
            const img = getImage(r.filmId);

            return (
              <li
                key={r.id}
                style={{
                  padding: "16px 0",
                  borderTop: idx === 0 ? "none" : "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `1fr ${THUMB_W}px`,
                    gridTemplateRows: "auto auto",
                    gridTemplateAreas: `
                      "meta thumb"
                      "body body"
                    `,
                    columnGap: 12,
                    rowGap: 20,
                    padding: "0 12px",
                    alignItems: "center",
                  }}
                >
                  {/* Meta (title, director, year, rating) */}
                  <div style={{ gridArea: "meta", minWidth: 0 }}>
                    <h3 style={{ margin: "0 0 6px", fontSize: 16 }}>
                      <strong>{title}</strong>
                    </h3>
                    {director && (
                      <div
                        style={{
                          margin: 0,
                          opacity: 0.9,
                          fontSize: 12,
                          lineHeight: 1.3,
                          color: "var(--muted-text)",
                        }}
                      >
                        {director}
                      </div>
                    )}
                    {year && (
                      <div
                        style={{
                          marginTop: 2,
                          opacity: 0.9,
                          fontSize: 12,
                          lineHeight: 1.3,
                          color: "var(--muted-text)",
                        }}
                      >
                        {year}
                      </div>
                    )}

                    {/* Rating under the year */}
                    {typeof r.rating === "number" && (
                      <div style={{ marginTop: 6 }}>
                        <StarRating
                          initialRating={r.rating}
                          onRatingChange={() => {}}
                          starsLength={5}
                          isReadOnly={true}
                          dimension={5}
                          color="var(--star-colour)"
                        />
                      </div>
                    )}
                  </div>

                  {/* Poster (right) */}
                  <div
                    style={{
                      gridArea: "thumb",
                      width: THUMB_W,
                      height: THUMB_H,
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      background: "var(--card-bg)",
                      overflow: "hidden",
                    }}
                  >
                    {img ? (
                      <img
                        src={img}
                        alt={`${title} poster`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0.6,
                          fontSize: 12,
                        }}
                      >
                        No image
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div style={{ gridArea: "body", minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        opacity: 0.85,
                        whiteSpace: "pre-line",
                        fontSize: 13,
                        lineHeight: 1.4,
                      }}
                    >
                      {truncate(r.reviewText, 120)}
                    </p>

                    <div style={{ marginTop: 10 }}>
                      <Link
                        to={`/reviews/${r.id}`}
                        style={{
                          color: "var(--link)",
                          fontWeight: 600,
                          fontSize: 12,
                          textDecoration: "none",
                        }}
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                </div>
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
