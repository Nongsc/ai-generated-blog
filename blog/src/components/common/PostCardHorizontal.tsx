import Link from "next/link";
import { Calendar, Folder, Tag } from "lucide-react";
import { PostMeta } from "@/types";

interface PostCardHorizontalProps {
  post: PostMeta;
}

export function PostCardHorizontal({ post }: PostCardHorizontalProps) {
  return (
    <Link href={`/posts/${post.id}`}>
      <article className="group flex bg-card/70 backdrop-blur-sm rounded-2xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        {/* Cover Image - Left Side (50%) */}
        {post.cover && (
          <div className="relative w-1/2 aspect-[4/3] overflow-hidden shrink-0">
            <img
              src={post.cover}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
          </div>
        )}
        
        {/* Content - Right Side (50%) */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          {/* Categories */}
          {post.categories.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-primary mb-2">
              <Folder className="w-3.5 h-3.5" />
              <span>{post.categories[0]}</span>
            </div>
          )}
          
          {/* Title */}
          <h2 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-3">
            {post.title}
          </h2>
          
          {/* Excerpt */}
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>
          
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground text-xs"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>
      </article>
    </Link>
  );
}
