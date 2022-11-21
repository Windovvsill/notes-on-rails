const BASE_URL = "http://localhost:3000/api/v1/";
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
  const body = notePipe(note);

  const res = await fetch(a(id), {
    method: "PUT",
    headers: [["Content-Type", "application/json"]],
    body,
  });
  return await res.json();
};

export const remove = async (id: number) => {
  const res = await fetch(a(id), {
    method: "DELETE",
    headers: [["Content-Type", "application/json"]],
  });
  return await res.json();
};

export const getNew = async () => {
  const res = await fetch(a("new"), {
    method: "GET",
    headers: [["Content-Type", "application/json"]],
  });
  return await res.json();
};

export const create = async (note: Note) => {
  const body = notePipe(note);

  const res = await fetch(a(), {
    method: "POST",
    headers: [["Content-Type", "application/json"]],
    body,
  });
  return await res.json();
};

const pipe =
  (...fns) =>
  (input) =>
    fns.reduce((a, f) => f(a), input);

const serialize = JSON.stringify;

const removeUnpermittedAttributes = (note: Note) => {
  const { created_at, updated_at, id, ...rest } = note;
  return rest;
};

const notePipe = pipe(removeUnpermittedAttributes, serialize);
