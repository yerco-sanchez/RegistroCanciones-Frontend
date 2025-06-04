import type { Cancion } from "./Cancion";

export interface Genero {
  id: number;
  generoNombre: string;
  isDeleted: boolean;
  canciones?: Cancion[];
}
