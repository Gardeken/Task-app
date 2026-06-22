import {
  X,
  Calendar,
  Fingerprint,
  Info,
  CheckCircle2,
  Circle,
  Trash2,
} from "lucide-react";
import type { Task } from "../types/tasks";

interface ViewTaskModalProps {
  task: Task | null; // Si es null, el modal estará cerrado
  onClose: () => void;
}

export const ViewTaskModal = ({ task, onClose }: ViewTaskModalProps) => {
  if (!task) return null;

  // Formatear la fecha de Supabase (created_at) a algo legible en español
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("es-ES", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop con desenfoque */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor principal del Modal */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 transition-all">
        {/* Botón superior cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado: Estado de la tarea */}
        <div className="flex items-center gap-2.5 mb-4 select-none">
          {task.is_completed ? (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completada
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <Circle className="w-3.5 h-3.5" /> Pendiente
            </span>
          )}

          {task.deleted && (
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200">
              <Trash2 className="w-3.5 h-3.5" /> En Papelera
            </span>
          )}
        </div>

        {/* Título y Descripción */}
        <div className="space-y-3 mb-6">
          <h2 className="text-xl font-bold text-gray-900 wrap-break-word pr-6">
            {task.title}
          </h2>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 min-h-20">
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 select-none">
              <Info className="w-3.5 h-3.5" /> Descripción
            </span>
            <p className="text-sm text-gray-600 whitespace-pre-wrap wrap-break-word leading-relaxed">
              {task.description || (
                <span className="italic text-gray-400">
                  Sin descripción disponible.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Metadata de Supabase (Sección Técnica) */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 select-none">
            Datos del Registro (Supabase)
          </h4>

          {/* Fila: ID (UUID) */}
          <div className="flex items-start gap-3 text-sm">
            <div className="p-1.5 rounded-lg bg-gray-100 text-gray-500 mt-0.5">
              <Fingerprint className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-400 select-none">
                ID único (UUID)
              </p>
              <p className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100 break-all mt-1 select-all">
                {task.id}
              </p>
            </div>
          </div>

          {/* Fila: Creado el */}
          <div className="flex items-start gap-3 text-sm">
            <div className="p-1.5 rounded-lg bg-gray-100 text-gray-500 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 select-none">
                Fecha de creación
              </p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">
                {formatDate(task.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Botón de cierre inferior */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
