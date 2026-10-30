export default function FormModal({ title, onClose, onSubmit, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={onSubmit} className="max-h-[90vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-2xl bg-white p-6">
        <h2 className="text-2xl">{title}</h2>
        {children}
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn border border-forest/20" onClick={onClose}>Cancelar</button>
          <button className="btn-primary">Salvar</button>
        </div>
      </form>
    </div>
  );
}

export const Field = ({ label, children }) => <label className="block text-sm">{label}<div className="mt-1">{children}</div></label>;
