import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { errMsg } from "../services/api.js";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!email || !senha) return setErro("Preencha e-mail e senha.");
    setLoading(true); setErro("");
    try { await login(email, senha); nav("/admin"); }
    catch (err) { setErro(errMsg(err)); }
    finally { setLoading(false); }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <form onSubmit={submit} className="space-y-4 rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-3xl">Área do administrador</h1>
        <label className="block text-sm">E-mail<input className="input mt-1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="block text-sm">Senha<input className="input mt-1" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} /></label>
        {erro && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      </form>
    </main>
  );
}
