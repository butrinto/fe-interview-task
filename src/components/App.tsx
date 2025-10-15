import { Link, NavLink, Navigate, Route, Routes } from "react-router-dom";
import ReviewsIndex from "../routes/ReviewsIndex";
import ReviewShow from "../routes/ReviewShow";
import ReviewNew from "../routes/ReviewNew";

export default function App() {
  return (
    <div style={{ padding: 16, maxWidth: 920, margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Film Log</h1>
        <nav style={{ display: "flex", gap: 8 }}>
          <NavLink to="/reviews">Index</NavLink>
          <NavLink to="/new">New</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Navigate to="/reviews" replace />} />
        <Route path="/reviews" element={<ReviewsIndex />} />
        <Route path="/reviews/:id" element={<ReviewShow />} />
        <Route path="/new" element={<ReviewNew />} />
        <Route path="*" element={<p>Not found</p>} />
      </Routes>
    </div>
  );
}
