import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Freelancer/Homepage";
import JobsPage from "./pages/Freelancer/JobsPage";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import JobApplyPage from "./pages/Freelancer/JobApplyPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Freelancer-only routes */}
      <Route
        path="/jobs"
        element={<ProtectedRoute element={<JobsPage />} allowedRoles={["freelancer"]} />}
      />
      <Route
        path="/apply/:jobId"
        element={<ProtectedRoute element={<JobApplyPage />} allowedRoles={["freelancer"]} />}
      />

      {/* Client-only routes example */}
      <Route
        path="/post-job"
        element={<ProtectedRoute element={<p>Post Job Page</p>} allowedRoles={["client"]} />}
      />

      <Route path="*" element={<p>Not found</p>} />
    </Routes>
  );
}

export default App;
