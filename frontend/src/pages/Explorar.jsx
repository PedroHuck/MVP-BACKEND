import { useEffect, useMemo, useState } from "react";
import { atracoesService, eventosService } from "../services/api.js";
import { AtracaoCard, EventoCard } from "../components/Cards.jsx";

const CATS = ["Todos", "Trilha", "Cachoeira", "Parque", "Evento"];
const STATUS = ["Todos", "Disponível", "Fechado"];

const Chip = ({ active, ...p }) => <button {...p} className={`rounded-full border px-4 py-1.5 text-sm ${active ? "border-forest bg-forest text-cream" : "border-forest/20 bg-white"}`} />;

export default function Explorar() {
  const [atracoes, setAtracoes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cat, setCat] = useState("Todos");
  const [status, setStatus] = useState("Todos");
  const [q, setQ] = useState("");

  useEffect(() => {
    atracoesService.list().then(setAtracoes);
    eventosService.list().then(setEventos);
  }, []);

  const okS = (d) => status === "Todos" || (status === "Disponível" ? d : !d);
  const t = q.toLowerCase();
  const as = useMemo(() => cat === "Evento" ? [] : atracoes.filter((a) => (cat === "Todos" || a.tipo === cat) && okS(a.disponivel) && `${a.nome} ${a.descricao}`.toLowerCase().includes(t)), [atracoes, cat, status, t]);
  const es = useMemo(() => !["Todos", "Evento"].includes(cat) ? [] : eventos.filter((e) => okS(e.disponivel) && `${e.titulo} ${e.descricao}`.toLowerCase().includes(t)), [eventos, cat, status, t]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-4xl">Explorar o circuito</h1>
      <input className="input mt-6 max-w-md" placeholder="Buscar..." value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="mt-4 flex flex-wrap gap-2">{CATS.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}</div>
      <div className="mt-2 flex flex-wrap gap-2">{STATUS.map((s) => <Chip key={s} active={status === s} onClick={() => setStatus(s)}>{s}</Chip>)}</div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {as.map((a) => <AtracaoCard key={`a${a.id}`} a={a} />)}
        {es.map((e) => <EventoCard key={`e${e.id}`} e={e} />)}
      </div>
      {as.length + es.length === 0 && <p className="mt-8 opacity-70">Nenhum resultado.</p>}
    </main>
  );
}
