import { Link, useNavigate, useParams } from "react-router-dom";
import { useReviews } from "../context/ReviewsContext";

export default function ReviewShow() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReviewById, deleteReview, films, loadFilms } = useReviews();

  // Ensure films are loaded for lookup
  if (films.length === 0) {
    loadFilms();
  }

  const review = id ? getReviewById(id) : undefined;

  if (!review) {
    return (
      <div>
        <h2>Review not found</h2>
        <Link to="/reviews">← Back to reviews</Link>
      </div>
    );
  }

  const film = films.find((f) => f.id === review.filmId);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this review?")) {
      deleteReview(review.id);
      navigate("/reviews");
    }
  };

  return (
    <div>
      <h2>{film ? film.title : review.filmTitle}</h2>

      {film && (
        <img
          src={film.image_url}
          alt={film.title}
          style={{
            maxWidth: "100%",
            borderRadius: 6,
            marginBottom: 16,
          }}
        />
      )}

      <p style={{ whiteSpace: "pre-line" }}>{review.reviewText}</p>

      <p>
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
