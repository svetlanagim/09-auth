import { Note } from "@/types/note";
import { User } from "@/types/user";
import { cookies } from "next/headers";
import { api } from "./api";

async function getHeaders() {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const headers = await getHeaders();
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: { page, perPage: 12, search, tag },
    headers,
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getHeaders();
  const { data } = await api.get<Note>(`/notes/${id}`, { headers });
  return data;
};

export const getMe = async (): Promise<User> => {
  const headers = await getHeaders();
  const { data } = await api.get<User>("/users/me", { headers });
  return data;
};

export const checkSession = async (): Promise<User | null> => {
  const headers = await getHeaders();
  const { data } = await api.get<User | null>("/auth/session", { headers });
  return data;
};
