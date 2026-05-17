import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import { NoteTag } from "@/types/note";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const filter = slug[0] ?? "All";
  const capitalizedFilter = filter.charAt(0).toUpperCase() + filter.slice(1);

  return {
    title: `${capitalizedFilter} Notes | NoteHub`,
    description: `Browse your ${capitalizedFilter} notes in NoteHub.`,
    openGraph: {
      title: `${capitalizedFilter} Notes | NoteHub`,
      description: `Browse your ${capitalizedFilter} notes in NoteHub.`,
      url: `https://08-zustand-gamma-tawny.vercel.app/notes/filter/${slug.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function Notes({ params }: Props) {
  const { slug = [] } = await params;

  const currentSlug = slug[0]?.toLowerCase();

  const tag = currentSlug === "all" ? undefined : (slug[0] as NoteTag);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes(1, "", tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
