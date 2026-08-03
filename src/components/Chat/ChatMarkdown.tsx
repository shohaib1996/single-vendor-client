"use client";

import ReactMarkdown from "react-markdown";

// Shared renderer for assistant chat bubbles (ChatWidget + AI Insights).
// The backend's system prompt tells the model to reply in Markdown and to
// use image/link syntax for products — this is what actually turns that
// into a real <img>/<a> instead of literal asterisks and brackets.
export function ChatMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-4 mb-1 space-y-0.5">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-4 mb-1 space-y-0.5">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="underline underline-offset-2 font-medium hover:opacity-80"
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        img: ({ src, alt }) =>
          typeof src === "string" ? (
            // eslint-disable-next-line @next/next/no-img-element -- remote/relative
            // product image URLs from the AI service, not a known-optimizable Next asset
            <img src={src} alt={alt ?? ""} className="rounded-md max-h-40 w-auto object-cover my-1" />
          ) : null,
        code: ({ children }) => (
          <code className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 text-xs">{children}</code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
