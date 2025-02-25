import Link from 'next/link';
import { getAllPosts } from '@/app/lib/blog/posts';

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Centered header section */}
      <div className="flex flex-col items-center w-full m-16">
        <h1 className="text-4xl font-medium text-[var(--text-primary)]">zephyr.flac &bull; 2025</h1>

        {/* Separator line */}
        <div className="w-24 h-px bg-[var(--separator-color)] my-6"></div>

        {/* List of links separated by em-dash */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-[var(--text-primary)] hover:text-[var(--text-secondary)] hover:underline">home</Link>
          <span className="text-[var(--text-secondary)]">—</span>
          <Link href="https://discord.com/users/110107013207306240" className="text-[var(--text-primary)] hover:text-[var(--text-secondary)] hover:underline">discord</Link>
          <span className="text-[var(--text-secondary)]">—</span>
          <Link href="https://github.com/ZephyrCodesStuff" className="text-[var(--text-primary)] hover:text-[var(--text-secondary)] hover:underline">github</Link>
        </div>
      </div>

      {/* Blog posts section - full width with max-width container */}
      <div className="w-full max-w-4xl px-8">
        {/* Blog posts separator */}
        <div className="my-12 text-[var(--separator-color)] text-center">
          <div className="text-sm">{'<<<<<'}</div>
          <div className="text-xs my-1">blog posts</div>
          <div className="text-sm">{'>>>>>'}</div>
        </div>

        {/* Blog posts */}
        <div className="flex flex-col space-y-8">
          {posts.map(post => (
            <article key={post.slug} className="flex flex-col space-y-2">
              <Link 
                href={`/blog/posts/${post.slug}`}
                className="text-xl font-medium text-[var(--text-primary)] hover:text-[var(--text-secondary)] hover:underline"
              >
                {post.title}
              </Link>
              <time className="text-sm text-[var(--text-secondary)]">{post.date}</time>
              {post.excerpt && (
                <p className="text-[var(--text-secondary)]">{post.excerpt}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
