import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useReviews } from "../context/ReviewsContext";

export default function ReviewsIndex() {
  const { loadFilms, films, reviews, loadingFilms } = useReviews();
  const [genre, setGenre] = useState<string>("All");

  // Load films on mount
  useEffect(() => {
    loadFilms();
  }, [loadFilms]);

  // Unique, sorted genre list
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

  // Apply genre filter (search hidden for now)
  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (genre === "All") return true;
      const film = getFilm(r.filmId);
      return film?.genres?.includes(genre) ?? false;
    });
  }, [reviews, genre, films]);

  // Thumbnail size
  const THUMB_W = 120;
  const THUMB_H = 80;

  return (
    <div>
      {/* Controls */}
      <div
        style={{
          marginBottom: 12,
          padding: "0 12px", // keeps spacing consistent with header sides
        }}
      >
        {/* Search bar hidden as not part of wireframe - kept for future use */}
        {false && (
          <input
            value={""}
            onChange={() => {}}
            placeholder="Search by film title…"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
            aria-label="Search reviews by film title"
          />
        )}

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{
            width: "100%", // full width across the screen
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd",
            fontSize: 16,
            background: "#fff",
          }}
          aria-label="Filter reviews by genre"
        >
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
          No matching reviews. <Link to="/new">Write one</Link>
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
                  borderTop: idx === 0 ? "none" : "1px solid #e6e6e6",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "0 12px",
                  }}
                >
                  {/* Text on the left */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Reserve height so the paragraph starts under the thumbnail */}
                    <div style={{ minHeight: THUMB_H }}>
                      <h3 style={{ margin: "0 0 4px", fontSize: 18 }}>
                        <strong>{title}</strong>
                      </h3>
                      {director && (
                        <div style={{ margin: 0, opacity: 0.9 }}>
                          {director}
                        </div>
                      )}
                      {year && (
                        <div style={{ margin: "2px 0 0", opacity: 0.9 }}>
                          {year}
                        </div>
                      )}
                    </div>

                    <p
                      style={{
                        margin: 0,
                        marginTop: 10,
                        opacity: 0.85,
                        whiteSpace: "pre-line",
                        fontSize: 14,
                        lineHeight: 1.4,
                      }}
                    >
                      {truncate(r.reviewText, 120)}
                    </p>

                    <div style={{ marginTop: 10 }}>
                      <Link
                        to={`/reviews/${r.id}`}
                        style={{
                          color: "rebeccapurple",
                          fontWeight: 600,
                          fontSize: 13, // reduced size
                          textDecoration: "none",
                        }}
                      >
                        Read more
                      </Link>
                    </div>
                  </div>

                  {/* Poster on the right, cropped to fill */}
                  <div
                    style={{
                      width: THUMB_W,
                      height: THUMB_H,
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      background: "#f3f3f3",
                      overflow: "hidden",
                      flexShrink: 0,
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
