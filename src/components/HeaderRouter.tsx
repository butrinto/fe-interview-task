import { Link, matchPath, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useReviews } from "../context/ReviewsContext";

export default function HeaderRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const { deleteReview } = useReviews();

  const showMatch = matchPath({ path: "/reviews/:id" }, location.pathname);
  const reviewId = (showMatch?.params as { id?: string } | undefined)?.id;
  const isNew = location.pathname === "/new";

  // Header for /reviews/:id
  if (reviewId) {
    const handleDelete = () => {
      if (confirm("Delete this review?")) {
        deleteReview(reviewId);
        navigate("/reviews");
      }
    };

    return (
      <Header
        left={
          <button className="icon-btn" onClick={() => navigate(-1)}>
            Back
          </button>
        }
        right={
          <button className="icon-btn" onClick={handleDelete}>
            Delete
          </button>
        }
      />
    );
  }

  // Header for /new
  if (isNew) {
    return (
      <Header
        title="Film Log"
        right={
          <button
            className="icon-btn circle"
            onClick={() => navigate("/reviews")}
          >
            ×
          </button>
        }
      />
    );
  }

  // Default header for /reviews
  return (
    <Header
      title="Film Log"
      right={
        <Link to="/new" className="icon-btn circle">
          +
        </Link>
      }
    />
  );
}
