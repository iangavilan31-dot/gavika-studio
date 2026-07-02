import type { ReactNode } from "react";

/**
 * Server-safe word splitter: real text in the DOM, one span per word
 * for the choreography layer to address. No JS required to read it.
 */
export default function Words({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-visible align-top">
          <span data-word className={`inline-block ${className}`}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </>
  );
}

export function Chars({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}): ReactNode {
  return (
    <span aria-label={text} role="text">
      {text.split("").map((c, i) => (
        <span key={i} aria-hidden="true" data-char className={`inline-block ${className}`}>
          {c}
        </span>
      ))}
    </span>
  );
}
