"use client";

import { useQuery } from "@tanstack/react-query";
import css from "./NoteDetails.client.module.css";

import { useParams } from "next/navigation";

import { fetchNoteById } from "@/lib/api/clientApi";

type Params = {
  id: string;
};

export default function NoteDetailsClient() {
  const { id } = useParams<Params>();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading notes...</p>;
  if (isError) return <p>Error loading notes</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data?.title}</h2>
        </div>
        <p className={css.tag}>{data?.tag}</p>
        <p className={css.content}>{data?.content}</p>
        <p className={css.date}>{data?.createdAt}</p>
      </div>
    </div>
  );
}
