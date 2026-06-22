import type { Task } from "../types/tasks";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArchiveRestore, Eye, GripVertical, Trash } from "lucide-react";

interface TaskComponentProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onOpenDetails: (task: Task) => void;
}

export const TaskComponent = ({
  task,
  onToggleComplete,
  onDelete,
  onRestore,
  onOpenDetails,
}: TaskComponentProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        /* 📱 OPTIMIZACIÓN 1: Reducción de padding en móvil (p-3) para maximizar espacio de texto */
        flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl border bg-white 
                ${
                  isDragging
                    ? "shadow-2xl border-indigo-500 bg-indigo-50/80 backdrop-blur-sm scale-102 z-50 cursor-grabbing"
                    : "shadow-sm border-gray-200/80 hover:shadow-md hover:border-gray-300 cursor-grab"
                }
      `}
    >
      {/* Checkbox */}
      <div className="flex items-center justify-center shrink-0">
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={() => onToggleComplete(task.id)}
          className="
            w-5 h-5 cursor-pointer rounded-md border border-gray-300 bg-gray-50
            text-indigo-600 focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-0 
            checked:bg-indigo-600 checked:border-indigo-600
            transition-all duration-200 ease-in-out appearance-none
            flex items-center justify-center
            relative shrink-0
            after:content-[''] after:absolute after:hidden checked:after:block
            after:w-1.5 after:h-2.5 after:border-white after:border-r-2 after:border-b-2
            after:rotate-45 after:top-[4%] after:left-[32%]
          "
        />
      </div>

      {/* Botón de agarre (Grip) */}
      <div
        {...attributes}
        {...listeners}
        style={{ touchAction: "none" }}
        className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors shrink-0"
      >
        <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      {/* Contenido de la tarea */}
      {/* 📱 OPTIMIZACIÓN 2: min-w-0 previene que el contenedor flex empuje los iconos fuera de la pantalla */}
      <div className="flex-1 min-w-0 select-none text-left">
        <h3
          className={`text-sm sm:text-base font-semibold wrap-break-word leading-tight ${
            task.is_completed ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          /* 📱 OPTIMIZACIÓN 3: Se usa 'line-clamp-2' para que si la descripción es kilométrica,  
             se adapte visualmente saltando de línea en móvil sin desarmar la tarjeta */
          <p className="text-xs text-gray-500 wrap-break-word line-clamp-2 mt-1 font-normal leading-normal">
            {task.description}
          </p>
        )}
      </div>

      {/* Botones de Acción */}
      {/* 📱 OPTIMIZACIÓN 4: Reducción del margen izquierdo en móvil (ml-2) e incremento del área táctil (p-1) */}
      <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4 shrink-0">
        {task.deleted ? (
          <button
            onClick={() => onRestore(task.id)}
            className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            title="Restaurar tarea"
          >
            <ArchiveRestore className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            title="Eliminar tarea"
          >
            <Trash className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => onOpenDetails(task)}
          className="p-1 text-gray-400 hover:text-blue-500 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          title="Ver detalles"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
