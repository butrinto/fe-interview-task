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

  // Image size for the header row
  const IMG_W = 180;
  const IMG_H = 100;

  return (
    <div style={{ padding: "20px 16px 24px" }}>
      {/* Header row: meta (left) + image (right) */}
      <div
        style={{
          display: "flex",
          alignItems: "center", // vertically centre left meta against the image
          gap: 16,
          marginBottom: 18, // space before the review body starts
        }}
      >
        {/* Left meta, centred vertically within the row */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: IMG_H, // ensures the meta block is centred relative to the image height
          }}
        >
          <h2 style={{ margin: "0 0 6px" }}>{title}</h2>
          {director && (
            <div style={{ margin: 0, opacity: 0.9 }}>{director}</div>
          )}
          {year && <div style={{ marginTop: 2, opacity: 0.9 }}>{year}</div>}
        </div>

        {/* Poster on the right */}
        <div
          style={{
            width: IMG_W,
            height: IMG_H,
            border: "1px solid #ddd",
            borderRadius: 10,
            background: "#f3f3f3",
            overflow: "hidden",
            flexShrink: 0,
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

      {/* Review body sits beneath the whole header block */}
      <p style={{ whiteSpace: "pre-line", margin: "0 0 14px" }}>
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
