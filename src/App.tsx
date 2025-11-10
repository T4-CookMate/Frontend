import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { AppLayout } from "@components/layout/AppLayout";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </AppLayout>
  )
}