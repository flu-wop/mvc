import { redirect } from "next/navigation";

// The gallery was an unfinished placeholder; the portfolio is the real thing.
export default function GalleryPage() {
  redirect("/portfolio");
}
