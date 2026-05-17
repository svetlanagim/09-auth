import { Note, NoteTag } from "@/types/note";
import { User } from "@/types/user";
import { api } from "./api";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteBody {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface AuthBody {
  email: string;
  password: string;
}

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: { page, perPage: 12, search, tag },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (body: CreateNoteBody): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", body);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export const register = async (body: AuthBody): Promise<User> => {
  const { data } = await api.post<User>("/auth/register", body);
  return data;
};

export const login = async (body: AuthBody): Promise<User> => {
  const { data } = await api.post<User>("/auth/login", body);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await api.get<User | null>("/auth/session");
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (body: Partial<User>): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", body);
  return data;
};
