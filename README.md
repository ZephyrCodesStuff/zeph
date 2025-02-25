# 🌙 zeph

A fancy personal website, with a minimalistic blog built with NextJS, featuring:
- 3D homepage, with a modern design, pretty info and animations
- Markdown blog posts with syntax highlighting
- Light/dark mode with theme persistence
- Responsive design with Tailwind CSS
- Monospace aesthetic with the Geist font

## Tech Stack

- **Framework**: NextJS (with App Router), ThreeJS
- **Language**: TypeScript
- **Styling**: Tailwind CSS with Typography plugin
- **Content**: Markdown with remark
- **Deployment**: Docker

## Development

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## Blog Posts

Blog posts are written in Markdown and stored in the `posts` directory. Each post should include frontmatter:

```markdown
---
title: "Post Title"
date: "YYYY-MM-DD"
excerpt: "Brief description of the post"
---

Content goes here...
```

## Docker

Build and run using Docker:

```bash
# Build the image
docker build -t zeph .

# Run the container
docker run -p 3000:3000 zeph
```

Or use Docker Compose:

```bash
docker-compose up
```

## Project Structure

```
.
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   └── lib/                 # Utility functions
├── posts/                   # Markdown blog posts
├── public/                  # Static assets
└── docker-compose.yml       # Docker configuration
```

## License

GNU General Public License (Version 3) - feel free to use this code as inspiration for your own projects!
