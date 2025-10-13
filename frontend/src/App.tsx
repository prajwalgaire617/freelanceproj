import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Homepage from "./pages/Freelancer/Homepage";
import JobsPage from "./pages/Freelancer/JobsPage";
import LoginPage from "./pages/login";
import SignUpPage from "./pages/signup";
import JobApplyPage from "./pages/Freelancer/JobApplyPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientHomepage from "./pages/Client/ClientHomepage";
import FreeLancerProfile from "./pages/Freelancer/FreeLancerProfile";
import MessagePage from "./pages/Freelancer/Message";
import ClientMessagePage from "./pages/Client/ClientMessagePage";
import FreelancerSearch from "./pages/Client/Freelancerspage";
import JobApplicationsPage from "./pages/Client/JobApplicationsPage";
import CreateContractPage from "./pages/Client/CreateContractPage";
import ContractsPage from "./pages/Freelancer/ContractsPage";
import OAuthCallback from "./pages/auth/OAuthCallback";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";
import { RealTimeNotifications } from "./components/notifications/RealTimeNotifications";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RealTimeNotifications />
        <Routes>
      {/* <Route path="/" element={<Homepage />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />
      <Route path="/messages" element={<MessagePage/>}/>
      <Route path="/clientmessages" element={<ClientMessagePage/>} />
      <Route path="/freelancers" element={<FreelancerSearch />} />
      <Route path="/jobs" element={<JobsPage />} /> {/* Public jobs page */}

      {/* Freelancer-only routes */}
      <Route path="/freelancerhomepage" element={<ProtectedRoute element={<Homepage/>} allowedRoles={["freelancer"]} />} />

      <Route
        path="/apply/:jobId"
        element={<ProtectedRoute element={<JobApplyPage />} allowedRoles={["freelancer"]} />}
      />

      <Route path="/freelancerprofile" element={<ProtectedRoute element={<FreeLancerProfile/>} allowedRoles={["freelancer"]} />} />
      <Route
        path="/contracts"
        element={<ProtectedRoute element={<ContractsPage />} allowedRoles={["freelancer"]} />}
      />

      {/* Client-only routes */}
      <Route
        path="/clienthomepage"
        element={<ProtectedRoute element={<ClientHomepage/>} allowedRoles={["client"]} />}
      />
      <Route
        path="/job-applications/:jobId"
        element={<ProtectedRoute element={<JobApplicationsPage />} allowedRoles={["client"]} />}
      />
      <Route
        path="/contracts/create"
        element={<ProtectedRoute element={<CreateContractPage />} allowedRoles={["client"]} />}
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<p>Not found</p>} />
        </Routes>
        <Toaster position="top-right" richColors />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
