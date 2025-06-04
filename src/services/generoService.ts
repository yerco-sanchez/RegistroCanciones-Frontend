import type { Genero } from "../types/models/Genero";
import api from "./apiServices";

export const getGeneros = () => api.get<Genero[]>("/Generos");

export const getGenero = (id: number) => api.get<Genero>(`/Generos/${id}`);

export const postGenero = (genero: Genero) =>
  api.post<Genero>("/Generos", genero);

export const putGenero = (id: number, genero: Genero) =>
  api.put(`/Generos/${id}`, genero);

export const deleteGenero = (id: number) => api.delete(`/Generos/${id}`);
