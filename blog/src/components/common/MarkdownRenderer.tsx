"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none",
        // Headings
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8",
        "prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6",
        "prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4",
        // Paragraphs
        "prose-p:leading-7 prose-p:mb-4",
        // Links
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        // Code blocks
        "prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4",
        "prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded",
        "prose-code:before:content-none prose-code:after:content-none",
        // Lists
        "prose-li:marker:text-muted-foreground",
        // Blockquote
        "prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:not-italic",
        // Images
        "prose-img:rounded-lg prose-img:shadow-lg",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom link rendering
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          // Custom code block rendering with copy button
          pre: ({ children, className: preClassName }) => (
            <CodeBlock className={preClassName}>{children}</CodeBlock>
          ),
          // Custom image rendering - aspect ratio preserved
          img: ({ src, alt }) => (
            <span className="block my-6 not-prose">
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
              />
            </span>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
