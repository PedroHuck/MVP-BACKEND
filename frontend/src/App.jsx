import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import Explorar from "./pages/Explorar.jsx";
import Detalhe from "./pages/Detalhe.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explorar" element={<Explorar />} />
        <Route path="/atracoes/:id" element={<Detalhe tipo="atracoes" />} />
        <Route path="/eventos/:id" element={<Detalhe tipo="eventos" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Protected><Admin /></Protected>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
