export class Task {
  public id?: string | undefined;
  public title: string;
  public description?: string | undefined;
  public is_completed: boolean;
  public created_at: string | undefined;
  public deleted: boolean = false; // Nueva propiedad para marcar como eliminada

  constructor(
    title: string,
    id?: string | undefined,
    description?: string,
    isCompleted?: boolean,
    createdAt?: string | undefined,
    deleted?: boolean,
  ) {
    // Regla de negocio básica: Una tarea no puede nacer sin título
    if (!title || title.trim() === "") {
      throw new Error("El título de la tarea no puede estar vacío");
    }

    this.title = title;
    this.id = id;
    this.description = description;
    this.is_completed = isCompleted || false;
    this.created_at = createdAt || undefined;
    this.deleted = deleted || false; // Inicialmente no está eliminada
  }

  public complete(): void {
    if (this.deleted) {
      throw new Error(
        "No puedes completar una tarea que se encuentra eliminada",
      );
    }
    this.is_completed = true;
  }

  public deleteEntity(): void {
    if (this.deleted) {
      throw new Error("La tarea ya se encuentra eliminada");
    }
    this.deleted = true;
  }

  public restore(): void {
    this.deleted = false;
  }
}
