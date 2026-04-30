import { Navigate, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "../constants/routes";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import AntennaAnalyzerPage from "../pages/analysis/AntennaAnalyzerPage";
import HomePage from "../pages/home/HomePage";
import MetaWaveAIPage from "../pages/meta-wave-ai/MetaWaveAIPage";
import { getToken } from "../services/api";

function ProtectedRoute({ children }) {
  if (!getToken()) {
    return <Navigate to={APP_ROUTES.signup} replace />;
  }

  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path={APP_ROUTES.home} element={<HomePage />} />
      <Route
        path={APP_ROUTES.analysis}
        element={
          <ProtectedRoute>
            <AntennaAnalyzerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={APP_ROUTES.ai}
        element={
          <ProtectedRoute>
            <MetaWaveAIPage />
          </ProtectedRoute>
        }
      />
      <Route path={APP_ROUTES.login} element={<LoginPage />} />
      <Route path={APP_ROUTES.signup} element={<SignupPage />} />
      <Route path="*" element={<Navigate to={APP_ROUTES.home} replace />} />
    </Routes>
  );
}
