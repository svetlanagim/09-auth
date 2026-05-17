import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    return {
      title: `${note.title} | NoteHub`,
      description: note.content
        ? note.content.slice(0, 150)
        : `View note "${note.title}" in NoteHub.`,
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: note.content
          ? note.content.slice(0, 150)
          : `View note "${note.title}" in NoteHub.`,
        url: `https://08-zustand-gamma-tawny.vercel.app/notes/${id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            alt: "NoteHub",
          },
        ],
      },
    };
  } catch {
    return {
      title: "Note | NoteHub",
      description: "View note details in NoteHub.",
    };
  }
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
