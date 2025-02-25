import Link from 'next/link';
import { ReactNode } from 'react';

interface BlogPostLayoutProps {
  title: string;
  date: string;
  content: ReactNode;
}

export default function BlogPost({ title, date, content }: BlogPostLayoutProps) {
  return (
    <article className="w-full max-w-4xl px-8 py-12">
      <header className="mb-8">
        <Link href="/blog" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          {'<<<'} back
        </Link>

        <h1 className="text-3xl font-medium text-[var(--text-primary)] mb-2">{title}</h1>
        <time className="text-[var(--text-secondary)]">{date}</time>
      </header>
      
      <div className="prose prose-neutral max-w-none
        prose-headings:text-[var(--text-primary)]
        prose-p:text-[var(--text-primary)]
        prose-a:text-[var(--text-primary)]
        prose-strong:text-[var(--text-primary)]
        prose-code:text-[var(--text-primary)]
        prose-pre:bg-[var(--background)]
        prose-pre:border prose-pre:border-[var(--separator-color)]
        prose-li:text-[var(--text-primary)]
        hover:prose-a:text-[var(--text-secondary)]
        prose-a:no-underline hover:prose-a:underline
      ">
        {content}
      </div>
    </article>
  );
} 