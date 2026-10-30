import { createContext, useContext, useState } from "react";
import { authService, TOKEN_KEY } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [nome, setNome] = useState(() => localStorage.getItem("tereverde_nome"));

  async function login(email, senha) {
    const data = await authService.login(email, senha);
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem("tereverde_nome", data.nome);
    setToken(data.access_token);
    setNome(data.nome);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("tereverde_nome");
    setToken(null);
    setNome(null);
  }

  return <AuthContext.Provider value={{ token, nome, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
