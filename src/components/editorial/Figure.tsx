import type { PublicMedia } from "@/lib/data/types";

/**
 * An image with caption and credit line. Plain <img>: media are served from
 * /media/[id] (with visibility checks), already sized at upload.
 */
export function Figure({
  media,
  caption,
  className = "",
  size = "body",
}: {
  media: PublicMedia;
  caption?: string;
  className?: string;
  size?: "body" | "portrait";
}) {
  const text = caption || media.caption;
  const credit = [media.creator, media.year, media.credit].filter(Boolean).join(", ");
  const rights = media.license || media.rights;
  return (
    <figure className={`${size === "body" ? "!my-8" : ""} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={media.url}
        alt={media.alt}
        width={media.width ?? undefined}
        height={media.height ?? undefined}
        loading="lazy"
        className={`h-auto w-full border border-rule bg-beige/40 ${size === "portrait" ? "aspect-[4/5] object-cover grayscale-[15%]" : ""}`}
      />
      {(text || credit || rights) && (
        <figcaption className="mt-2 border-l border-red pl-3 text-[0.82rem] leading-snug text-muted">
          {text && <span className="block text-ink-warm">{text}</span>}
          {(credit || rights) && (
            <span className="label mt-1 block text-faint">
              {credit}
              {credit && rights ? " · " : ""}
              {rights}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
