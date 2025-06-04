import type { Cancion } from "../types/models/Cancion";
import api from "./apiServices";

export const getCanciones = () => api.get<Cancion[]>("/Canciones");

export const getCancion = (id: number) => api.get<Cancion>(`/Canciones/${id}`);

export const postCancion = (cancion: Cancion) =>
  api.post<Cancion>("/Canciones", cancion);

export const putCancion = (id: number, cancion: Cancion) =>
  api.put(`/Canciones/${id}`, cancion);

export const deleteCancion = (id: number) => api.delete(`/Canciones/${id}`);
