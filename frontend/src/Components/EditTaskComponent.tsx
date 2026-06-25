import { useState, useEffect } from "react";
import { X, AlignLeft, Type } from "lucide-react";
import type { Task } from "../types/tasks";

interface UpdateTaskModalProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}

export const UpdateTaskModal = ({
  task,
  onClose,
  onUpdate,
}: UpdateTaskModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 🔄 Sincronizar los estados locales cuando se selecciona una tarea para editar
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
    }
  }, [task]);

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const updatedTask = {
      ...task,
      title: title.trim(),
      description: description.trim(),
    };
    onUpdate(updatedTask);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Fondo oscuro con desenfoque (Backdrop) */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor del Modal - Completamente Responsivo */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 transition-all">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 select-none">
            Editar Tarea
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input: Título */}
          <div className="text-left">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 select-none">
              <Type className="w-3.5 h-3.5" /> Título de la tarea
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Estructurar el Repositorio"
              className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Input: Descripción */}
          <div className="text-left">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 select-none">
              <AlignLeft className="w-3.5 h-3.5" /> Descripción{" "}
              <span className="text-gray-400 lowercase italic">(opcional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Añade más detalles sobre esta tarea..."
              rows={3}
              className="w-full bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
