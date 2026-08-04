import Image from "next/image";

export default function FlowerDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden="true">
      <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-border to-border" />
      <div className="relative w-4 h-7 opacity-60 shrink-0">
        <Image src="/images/floral-motif.png" alt="" fill className="object-contain" />
      </div>
      <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent via-border to-border" />
    </div>
  );
}
