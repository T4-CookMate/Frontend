import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <nav style={{ padding: 12 }}>
        <Link to = "/">Cook-mate</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}