import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { atracoesService, eventosService } from "../services/api.js";
import { StatusBadge, fmt } from "../components/Cards.jsx";

export default function Detalhe({ tipo }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [erro, setErro] = useState(false);
  useEffect(() => {
    (tipo === "atracoes" ? atracoesService : eventosService).get(id).then(setItem).catch(() => setErro(true));
  }, [id, tipo]);
  if (erro) return <p className="p-10 text-center">Registro não encontrado.</p>;
  if (!item) return <p className="p-10 text-center">Carregando...</p>;
  const isA = tipo === "atracoes";
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/explorar" className="text-sm opacity-70">← Voltar</Link>
      {item.imagem_url && <img src={item.imagem_url} alt="" className="mt-4 aspect-video w-full rounded-2xl object-cover" />}
      <div className="mt-6"><StatusBadge open={item.disponivel} label={item.disponivel ? (isA ? "Aberto" : "Temporada Ativa") : "Temporariamente Fechado"} /></div>
      <h1 className="mt-3 text-4xl">{isA ? item.nome : item.titulo}</h1>
      <p className="mt-2 text-sm opacity-70">
        {isA ? `${item.tipo} · ${item.localizacao} · Dificuldade: ${item.nivel_dificuldade}` : `${fmt(item.data_inicio)} – ${fmt(item.data_fim)}${item.vagas_ou_capacidade != null ? ` · ${item.vagas_ou_capacidade} vagas` : ""}`}
      </p>
      <p className="mt-6 whitespace-pre-line text-lg">{item.descricao}</p>
    </main>
  );
}
