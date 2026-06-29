import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders post markdown with the site's editorial styling. */
export default function Markdown({ content }: { content: string }) {
  return (
    <div className="space-y-6 text-base leading-relaxed text-muted sm:text-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h2 className="mt-12 font-serif text-3xl text-cream sm:text-4xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 font-serif text-2xl text-cream">{children}</h3>
          ),
          p: ({ children }) => <p>{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline underline-offset-4 transition-colors hover:text-gold-soft"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-cream">{children}</strong>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-2.5 pl-5 marker:text-gold">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-2.5 pl-5 marker:text-gold">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1.5">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-8 border-l-2 border-gold pl-6 font-serif text-2xl italic leading-snug text-cream">
              {children}
            </blockquote>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={typeof src === "string" ? src : ""}
              alt={alt ?? ""}
              className="my-8 w-full rounded-2xl border border-line"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
