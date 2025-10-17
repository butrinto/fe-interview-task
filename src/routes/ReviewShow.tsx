import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useReviews } from "../context/ReviewsContext";

export default function ReviewShow() {
  const { id } = useParams<{ id: string }>();
  const { getReviewById, films, loadFilms } = useReviews();

  // Make sure films are loaded
  useEffect(() => {
    if (films.length === 0) loadFilms();
  }, [films.length, loadFilms]);

  const review = id ? getReviewById(id) : undefined;

  if (!review) {
    return (
      <div style={{ padding: "16px 12px" }}>
        <h2>Review not found</h2>
        <Link to="/reviews">← Back to reviews</Link>
      </div>
    );
  }

  const film = films.find((f) => f.id === review.filmId);
  const title = film?.title ?? review.filmTitle;
  const year = film?.release_year;
  const director = film?.cast?.find((p) =>
    p.credits?.includes("Director")
  )?.name;
  const img = film?.image_url;

  return (
    <div style={{ padding: "20px 16px 24px" }}>
      {/* Header row: meta (left) + image (right) */}
      <div className="review-header-row">
        {/* Left meta */}
        <div className="review-meta">
          <h2 style={{ margin: "0 0 10px" }}>{title}</h2>
          {director && (
            <div style={{ margin: 0, opacity: 0.9 }}>{director}</div>
          )}
          {year && <div style={{ marginTop: 2, opacity: 0.9 }}>{year}</div>}
        </div>

        {/* Poster on the right */}
        <div className="review-image">
          {img ? (
            <img src={img} alt={title} />
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

      {/* Review body sits beneath the header block */}
      <p style={{ whiteSpace: "pre-line", margin: "20px 0 6px" }}>
        {review.reviewText}
      </p>

      <p style={{ margin: 0 }}>
        <small>
          Created on{" "}
          {new Date(review.createdAt).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </small>
      </p>
    </div>
  );
}
