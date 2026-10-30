import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { atracoesService, eventosService, errMsg } from "../services/api.js";
import FormModal, { Field } from "../components/FormModal.jsx";
import { StatusBadge, fmt } from "../components/Cards.jsx";

const TIPOS = ["Trilha", "Cachoeira", "Parque"];
const NIVEIS = ["Fácil", "Médio", "Difícil"];

function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} aria-label="Alternar disponibilidade" className={`relative h-6 w-11 rounded-full transition ${on ? "bg-forest" : "bg-gray-300"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${on ? "left-5" : "left-0.5"}`} />
    </button>
  );
}

function useCrud(service) {
  const [items, setItems] = useState([]);
  const load = () => service.list().then(setItems);
  useEffect(() => { load(); }, []);
  return { items, load };
}

export default function Admin() {
  const [tab, setTab] = useState("atracoes");
  const A = useCrud(atracoesService);
  const E = useCrud(eventosService);
  const [editA, setEditA] = useState(null);
  const [editE, setEditE] = useState(null);
  const [msg, setMsg] = useState("");

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 2500); };
  const act = async (fn, ok, reload) => { try { await fn(); flash(ok); reload(); } catch (e) { flash(errMsg(e)); } };

  async function saveA(e) {
    e.preventDefault();
    const f = editA;
    if (!f.nome || !f.descricao || !f.localizacao) return flash("Preencha os campos obrigatórios.");
    await act(() => f.id ? atracoesService.update(f.id, f) : atracoesService.create(f), "Atração salva", A.load);
    setEditA(null);
  }
  async function saveE(e) {
    e.preventDefault();
    const f = { ...editE, vagas_ou_capacidade: editE.vagas_ou_capacidade === "" ? null : editE.vagas_ou_capacidade, atracao_id: editE.atracao_id || null };
    if (!f.titulo || !f.descricao || !f.data_inicio || !f.data_fim) return flash("Preencha os campos obrigatórios.");
    await act(() => f.id ? eventosService.update(f.id, f) : eventosService.create(f), "Evento salvo", E.load);
    setEditE(null);
  }

  const setA = (k) => (ev) => setEditA({ ...editA, [k]: ev.target.type === "checkbox" ? ev.target.checked : ev.target.value });
  const setE = (k) => (ev) => setEditE({ ...editE, [k]: ev.target.type === "checkbox" ? ev.target.checked : ev.target.value });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex gap-2">
        {[["atracoes", "Atrações"], ["eventos", "Eventos e temporadas"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`rounded-full px-4 py-1.5 ${tab === k ? "bg-forest text-cream" : "bg-moss"}`}>{l}</button>
        ))}
      </div>

      {tab === "atracoes" ? (
        <>
          <div className="my-6 flex justify-between"><h1 className="text-3xl">Atrações</h1>
            <button className="btn-primary" onClick={() => setEditA({ tipo: "Trilha", nivel_dificuldade: "Fácil", disponivel: true, imagem_url: "" })}>+ Novo</button></div>
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full text-left text-sm">
              <thead className="bg-moss/60"><tr><th className="p-3">Nome</th><th>Tipo</th><th>Status</th><th>Disponível</th><th className="p-3 text-right">Ações</th></tr></thead>
              <tbody>{A.items.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3 font-medium">{a.nome}</td><td>{a.tipo}</td>
                  <td><StatusBadge open={a.disponivel} label={a.disponivel ? "Aberto" : "Fechado"} /></td>
                  <td><Toggle on={a.disponivel} onClick={() => act(() => atracoesService.toggle(a.id), "Disponibilidade alterada", A.load)} /></td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Link className="btn-ghost" to={`/atracoes/${a.id}`}>Ver</Link>
                    <button className="btn-ghost" onClick={() => setEditA(a)}>Editar</button>
                    <button className="btn-ghost text-red-600" onClick={() => confirm(`Excluir "${a.nome}"?`) && act(() => atracoesService.remove(a.id), "Excluída", A.load)}>Excluir</button>
                  </td>
                </tr>))}</tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          <div className="my-6 flex justify-between"><h1 className="text-3xl">Eventos e temporadas</h1>
            <button className="btn-primary" onClick={() => setEditE({ disponivel: true, imagem_url: "", vagas_ou_capacidade: "" })}>+ Novo</button></div>
          <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="w-full text-left text-sm">
              <thead className="bg-moss/60"><tr><th className="p-3">Título</th><th>Período</th><th>Status</th><th>Ativo</th><th className="p-3 text-right">Ações</th></tr></thead>
              <tbody>{E.items.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-3 font-medium">{e.titulo}</td><td className="whitespace-nowrap">{fmt(e.data_inicio)} – {fmt(e.data_fim)}</td>
                  <td><StatusBadge open={e.disponivel} label={e.disponivel ? "Ativo" : "Inativo"} /></td>
                  <td><Toggle on={e.disponivel} onClick={() => act(() => eventosService.toggle(e.id), "Disponibilidade alterada", E.load)} /></td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Link className="btn-ghost" to={`/eventos/${e.id}`}>Ver</Link>
                    <button className="btn-ghost" onClick={() => setEditE({ ...e, vagas_ou_capacidade: e.vagas_ou_capacidade ?? "" })}>Editar</button>
                    <button className="btn-ghost text-red-600" onClick={() => confirm(`Excluir "${e.titulo}"?`) && act(() => eventosService.remove(e.id), "Excluído", E.load)}>Excluir</button>
                  </td>
                </tr>))}</tbody>
            </table>
          </div>
        </>
      )}

      {editA && (
        <FormModal title={editA.id ? "Editar atração" : "Nova atração"} onClose={() => setEditA(null)} onSubmit={saveA}>
          <Field label="Nome *"><input required className="input" value={editA.nome || ""} onChange={setA("nome")} /></Field>
          <Field label="Tipo *"><select className="input" value={editA.tipo} onChange={setA("tipo")}>{TIPOS.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Dificuldade"><select className="input" value={editA.nivel_dificuldade} onChange={setA("nivel_dificuldade")}>{NIVEIS.map((t) => <option key={t}>{t}</option>)}</select></Field>
          <Field label="Localização *"><input required className="input" value={editA.localizacao || ""} onChange={setA("localizacao")} /></Field>
          <Field label="Descrição *"><textarea required rows={4} className="input" value={editA.descricao || ""} onChange={setA("descricao")} /></Field>
          <Field label="URL da imagem"><input type="url" className="input" value={editA.imagem_url || ""} onChange={setA("imagem_url")} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editA.disponivel} onChange={setA("disponivel")} /> Disponível</label>
        </FormModal>
      )}
      {editE && (
        <FormModal title={editE.id ? "Editar evento" : "Novo evento"} onClose={() => setEditE(null)} onSubmit={saveE}>
          <Field label="Título *"><input required className="input" value={editE.titulo || ""} onChange={setE("titulo")} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Início *"><input required type="date" className="input" value={editE.data_inicio || ""} onChange={setE("data_inicio")} /></Field>
            <Field label="Fim *"><input required type="date" className="input" value={editE.data_fim || ""} onChange={setE("data_fim")} /></Field>
          </div>
          <Field label="Vagas / capacidade"><input type="number" min="0" className="input" value={editE.vagas_ou_capacidade} onChange={setE("vagas_ou_capacidade")} /></Field>
          <Field label="Local (atração)"><select className="input" value={editE.atracao_id || ""} onChange={setE("atracao_id")}>
            <option value="">— Nenhum —</option>{A.items.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}</select></Field>
          <Field label="Descrição *"><textarea required rows={4} className="input" value={editE.descricao || ""} onChange={setE("descricao")} /></Field>
          <Field label="URL da imagem"><input type="url" className="input" value={editE.imagem_url || ""} onChange={setE("imagem_url")} /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editE.disponivel} onChange={setE("disponivel")} /> Temporada ativa</label>
        </FormModal>
      )}
      {msg && <div className="fixed bottom-4 right-4 rounded-lg bg-forest px-4 py-2 text-cream shadow-lg">{msg}</div>}
    </main>
  );
}
