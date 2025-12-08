import { Route, Routes } from "react-router-dom";
import OnboardingSplash from "@pages/OnboardingSplash";
import HomePage from "@pages/HomePage";
import LoginPage from "@pages/LoginPage";
import SearchPage from "@pages/SearchPage";
import RootLayout from "layouts/RootLayout";
import VoiceDebugPage from "@pages/VoiceDedugPage";
import ServerTestPage from "@pages/ServerTestPage";
import GoogleCallbackPage from "@pages/GoogleCallbackPage";
import CookingPage from "@pages/CookingPage";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/onboarding" element={<OnboardingSplash />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/debug/voice" element={<VoiceDebugPage />} />
        <Route path="/test" element={<ServerTestPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route path="/cook" element={<CookingPage />} />
      </Route>
    </Routes>
  )
}