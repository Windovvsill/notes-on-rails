import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000/";
const PATH = "notes/";

export type Note = { title: string; body: string; id: number };

const a = (s: string | number = "") => `${BASE_URL}${PATH}${s}`;

export const fetchAll = async () => {
  const res = await fetch(a());
  return await res.json();
};

export const fetchOne = async (id: number) => {
  const res = await fetch(a(id));
  return await res.json();
};

export const post = async (id: number, note: Note) => {
  const res = await fetch(a(id), {
    method: "PUT",
    body: JSON.stringify(note),
  });
  return await res.json();
};
