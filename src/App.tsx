import { Route, Routes } from "react-router-dom";
import { AppLayout } from "@components/layout/AppLayout";
import OnboardingSplash from "@pages/OnboardingSplash";
import HomePage from "@pages/HomePage";
import LoginPage from "@pages/LoginPage";
import SearchPage from "@pages/SearchPage";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/onboarding" replace />} /> */}
        <Route path="/onboarding" element={<OnboardingSplash />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </AppLayout>
  )
}