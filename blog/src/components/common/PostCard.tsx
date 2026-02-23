import Link from "next/link";
import { Calendar, Folder, Tag } from "lucide-react";
import { PostMeta } from "@/types";

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <article className="group h-full bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        {/* Cover Image */}
        {post.cover && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.cover}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          </div>
        )}
        
        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
          
          {/* Excerpt */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
          
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {/* Date */}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            
            {/* Categories */}
            {post.categories.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5" />
                <span>{post.categories[0]}</span>
              </div>
            )}
          </div>
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}
