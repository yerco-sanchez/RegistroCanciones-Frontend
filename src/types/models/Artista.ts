import type { Cancion } from "./Cancion";

export interface Artista {
  id: number;
  nombre: string;
  nacionalidad: string;
  fechaNacimiento?: string;
  isDeleted: boolean;
  canciones?: Cancion[];
}
