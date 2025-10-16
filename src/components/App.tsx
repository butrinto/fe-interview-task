import { Navigate, Route, Routes } from "react-router-dom";
import ReviewsIndex from "../routes/ReviewsIndex";
import ReviewShow from "../routes/ReviewShow";
import ReviewNew from "../routes/ReviewNew";
import { ReviewsProvider } from "../context/ReviewsContext";
import HeaderRouter from "./HeaderRouter";

export default function App() {
  return (
    <ReviewsProvider>
      <HeaderRouter />

      <main style={{ padding: 16, maxWidth: 920, margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/reviews" replace />} />
          <Route path="/reviews" element={<ReviewsIndex />} />
          <Route path="/reviews/:id" element={<ReviewShow />} />
          <Route path="/new" element={<ReviewNew />} />
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </main>
    </ReviewsProvider>
  );
}
