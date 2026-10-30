import { Link } from "react-router-dom";

export const fmt = (d) => d.split("-").reverse().join("/");

export function StatusBadge({ open, label }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold text-white ${open ? "bg-green-700" : "bg-red-600"}`}>{label}</span>;
}

export function AtracaoCard({ a }) {
  return (
    <Link to={`/atracoes/${a.id}`} className="card">
      <div className="relative aspect-[4/3]"><img src={a.imagem_url} alt={a.nome} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute left-3 top-3"><StatusBadge open={a.disponivel} label={a.disponivel ? "Aberto" : "Temporariamente Fechado"} /></div></div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider opacity-60">{a.tipo} · {a.nivel_dificuldade}</p>
        <h3 className="mt-1 text-xl">{a.nome}</h3>
        <p className="mt-2 line-clamp-2 text-sm opacity-75">{a.descricao}</p>
      </div>
    </Link>
  );
}

export function EventoCard({ e }) {
  return (
    <Link to={`/eventos/${e.id}`} className="card">
      <div className="relative aspect-[4/3]"><img src={e.imagem_url} alt={e.titulo} className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute left-3 top-3"><StatusBadge open={e.disponivel} label={e.disponivel ? "Temporada Ativa" : "Temporariamente Fechado"} /></div></div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider opacity-60">Evento · {fmt(e.data_inicio)} – {fmt(e.data_fim)}</p>
        <h3 className="mt-1 text-xl">{e.titulo}</h3>
        <p className="mt-2 line-clamp-2 text-sm opacity-75">{e.descricao}</p>
      </div>
    </Link>
  );
}
