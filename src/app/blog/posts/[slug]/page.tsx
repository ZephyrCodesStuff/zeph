import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import BlogPost from '@/app/components/blog/BlogPost';

type Metadata = {
  title: string;
  date: string;
  excerpt: string;
}

// Get post data based on slug
async function getPostData(slug: string): Promise<{ slug: string; contentHtml: string; metadata: Metadata }> {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const { data, content } = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    metadata: data as Metadata,
  };
}

export default async function Post({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const post = await getPostData(slug);
  
  return (
    <div className="flex flex-col items-center min-h-screen">
      <BlogPost 
        title={post.metadata.title} 
        date={post.metadata.date}
        content={<div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />}
      />
    </div>
  );
} 