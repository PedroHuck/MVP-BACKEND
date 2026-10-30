import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { atracoesService, eventosService } from "../services/api.js";
import { AtracaoCard, EventoCard } from "../components/Cards.jsx";

const HERO = "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1920";

function Section({ title, children }) {
  return (
    <section className="mx-auto mt-16 max-w-6xl px-4">
      <div className="mb-6 flex items-end justify-between"><h2 className="text-3xl">{title}</h2><Link to="/explorar" className="text-sm font-semibold">Ver todos →</Link></div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

export default function Home() {
  const [atracoes, setAtracoes] = useState([]);
  const [eventos, setEventos] = useState([]);
  useEffect(() => {
    atracoesService.list().then(setAtracoes).catch(() => {});
    eventosService.list({ disponivel: true }).then(setEventos).catch(() => {});
  }, []);
  const trilhas = atracoes.filter((a) => a.tipo === "Trilha").slice(0, 3);
  const cachoeiras = atracoes.filter((a) => a.tipo === "Cachoeira").slice(0, 3);

  return (
    <main className="pb-20">
      <section className="relative flex min-h-[80vh] items-end bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg,rgba(23,56,38,.2),rgba(23,56,38,.9)),url(${HERO})` }}>
        <div className="mx-auto w-full max-w-6xl px-4 pb-14 text-cream">
          <p className="text-sm uppercase tracking-[.3em] text-sun">Teresópolis · RJ</p>
          <h1 className="mt-3 text-5xl md:text-7xl">Circuito Terê Verde</h1>
          <p className="mt-4 max-w-xl text-lg opacity-90">Trilhas, cachoeiras e eventos entre as montanhas — informação atualizada para planejar sua visita.</p>
          <Link to="/explorar" className="btn-sun mt-8">Explorar atrações →</Link>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-cream/30 pt-6">
            <div><p className="font-display text-3xl">869m</p><p className="text-xs opacity-80">de altitude</p></div>
            <div><p className="font-display text-3xl">3</p><p className="text-xs opacity-80">unidades de conservação</p></div>
            <div><p className="font-display text-3xl">{atracoes.length}</p><p className="text-xs opacity-80">atrações</p></div>
          </div>
        </div>
      </section>
      <section className="mx-auto mt-16 grid max-w-6xl gap-8 px-4 md:grid-cols-2">
        <h2 className="text-3xl">Uma cidade serrana cercada de natureza protegida</h2>
        <p className="opacity-80">A área urbana de Teresópolis fica a 869 metros de altitude, abraçada por três unidades de conservação. (Texto de exemplo — edite com a história real do circuito.)</p>
      </section>
      {trilhas.length > 0 && <Section title="Trilhas">{trilhas.map((a) => <AtracaoCard key={a.id} a={a} />)}</Section>}
      {cachoeiras.length > 0 && <Section title="Cachoeiras">{cachoeiras.map((a) => <AtracaoCard key={a.id} a={a} />)}</Section>}
      {eventos.length > 0 && <Section title="Eventos próximos">{eventos.slice(0, 3).map((e) => <EventoCard key={e.id} e={e} />)}</Section>}
    </main>
  );
}
