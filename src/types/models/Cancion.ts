import type { Artista } from "./Artista";
import type { Genero } from "./Genero";

export interface Cancion {
  id: number;
  titulo: string;
  duracionMinutos: number;
  isDeleted: boolean;
  generoId: number;
  genero?: Genero;
  artistaId: number;
  artista?: Artista;
}
