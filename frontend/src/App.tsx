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
import LandingPage from "./pages/LandingPage";
import AdminCustomSupport from "./pages/cat/admin-customer-support";
import DesignCreative from "./pages/cat/designcreative";
import SalesMarketing from "./pages/cat/salesandmarketing";
import DevIt from "./pages/cat/dev-it";
import WritingTranslation from "./pages/cat/writing-translation";
import HrTraning from "./pages/cat/hr-training";
import Legal from "./pages/cat/legal";
import EngineeringArchitecture from "./pages/cat/engineering-architecture";
import FinanceAccounting from "./pages/cat/finance-accounting";
import SuccessStories from "./pages/success-stories";
import HowToHire from "./pages/howtohire";
import HowToFindWork from "./pages/howtofindwork";
import Enterprise from "./pages/enterprise/enterprise";
import Reviews from "./pages/reviews";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { RealTimeNotifications } from "./components/notifications/RealTimeNotifications";

function App() {
  return (
    <AuthProvider>
       <NotificationProvider> 
        <RealTimeNotifications /> 
        <Routes>

          <Route path="/" element={<LandingPage />} />
          <Route path="/cat/admin-customer-support" element={<AdminCustomSupport />} />
          <Route path="/cat/design-creative" element={<DesignCreative />} />
          <Route path="/cat/sales-marketing" element={<SalesMarketing />} />
          <Route path="/cat/dev-it" element={<DevIt />} />
          <Route path="/cat/writing-translation" element={<WritingTranslation />} />
          <Route path="/cat/hr-training" element={<HrTraning />} />
          <Route path="/cat/legal" element={<Legal />} />
          <Route path="/cat/engineering-architecture" element={<EngineeringArchitecture />} />
          <Route path="/cat/finance-accounting" element={<FinanceAccounting />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route path="/how-to-hire" element={<HowToHire />} />
          <Route path="/how-to-find-work" element={<HowToFindWork />} />
          <Route path="/enterprise" element={<Enterprise />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/auth/callback" element={<OAuthCallback />} />
          <Route path="/messages" element={<MessagePage />} />
          <Route path="/clientmessages" element={<ClientMessagePage />} />
          <Route path="/freelancers" element={<FreelancerSearch />} />
          <Route path="/jobs" element={<JobsPage />} /> {/* Public jobs page */}

          {/* Freelancer-only routes */}
          <Route path="/freelancerhomepage" element={<ProtectedRoute element={<Homepage />} allowedRoles={["freelancer"]} />} />

          <Route
            path="/apply/:jobId"
            element={<ProtectedRoute element={<JobApplyPage />} allowedRoles={["freelancer"]} />}
          />

          <Route path="/freelancerprofile" element={<ProtectedRoute element={<FreeLancerProfile />} allowedRoles={["freelancer"]} />} />
          <Route
            path="/contracts"
            element={<ProtectedRoute element={<ContractsPage />} allowedRoles={["freelancer"]} />}
          />

          {/* Client-only routes */}
          <Route
            path="/clienthomepage"
            element={<ProtectedRoute element={<ClientHomepage />} allowedRoles={["client"]} />}
          />
          <Route
            path="/job-applications/:jobId"
            element={<ProtectedRoute element={<JobApplicationsPage />} allowedRoles={["client"]} />}
          />
          <Route
            path="/contracts/create"
            element={<ProtectedRoute element={<CreateContractPage />} allowedRoles={["client"]} />}
          />
           <Route
        path="/jobs"
        element={<ProtectedRoute element={<JobsPage />} allowedRoles={["freelancer"]} />}
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


