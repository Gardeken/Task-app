import type { Task } from "../types/tasks";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, GripVertical, Trash } from "lucide-react"; // Librería de iconos que instalamos

interface TaskComponentProps {
  task: Task;
  onToggleComplete: (id: string) => void; // 👈 Agregamos la función para avisar al padre
  onDelete: (id: string) => void; // 👈 Aprovechamos de conectar el botón de borrar
  onOpenDetails: (task: Task) => void; // 👈 Agregamos la función para abrir los detalles de la tarea
}

export const TaskComponent = ({
  task,
  onToggleComplete,
  onDelete,
  onOpenDetails,
}: TaskComponentProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    // Usamos el método nativo recomendado por dnd-kit para evitar bugs de estiramiento
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-4 p-4 rounded-xl border bg-white 
        ${
          isDragging
            ? "shadow-2xl border-indigo-500 bg-indigo-50/80 backdrop-blur-sm scale-102 z-50 cursor-grabbing"
            : "shadow-sm border-gray-200/80 hover:shadow-md hover:border-gray-300 cursor-grab"
        }
      `}
    >
      <div>
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={() => onToggleComplete(task.id)} // 👈 Lógica conectada al hacer click
          className="
            w-5 h-5 cursor-pointer rounded-md border border-gray-300 bg-gray-50
            text-indigo-600 focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-0 
            checked:bg-indigo-600 checked:border-indigo-600
            transition-all duration-200 ease-in-out appearance-none
            flex items-center justify-center
            relative
            after:content-[''] after:absolute after:hidden checked:after:block
            after:w-1.5 after:h-2.5 after:border-white after:border-r-2 after:border-b-2
            after:rotate-45 after:top-[4%] after:left-[32%]
          "
        />
      </div>
      {/* Botón de agarre (Grip) exclusivo para arrastrar la tarjeta */}
      <div
        {...attributes}
        {...listeners}
        style={{ touchAction: "none" }}
        className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      {/* Contenido de la tarea */}
      <div className="flex-1 min-w-0 select-none">
        <h3
          className={`text-base font-semibold truncate ${task.is_completed ? "line-through text-gray-400" : "text-gray-800"}`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 ml-4">
        {/* Aquí podríamos añadir botones de acción como editar o eliminar */}
        <Trash
          className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={() => onDelete(task.id)}
        />
        <Eye
          className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer"
          onClick={() => onOpenDetails(task)}
        />
      </div>
    </div>
  );
};
