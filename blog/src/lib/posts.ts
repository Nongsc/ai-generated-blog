import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Post, PostMeta } from "@/types";

const postsDirectory = path.join(process.cwd(), "src/data/posts");

/**
 * 获取所有文章的元数据
 */
export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        id,
        title: data.title || "Untitled",
        date: data.date || new Date().toISOString(),
        categories: data.categories || [],
        tags: data.tags || [],
        cover: data.cover,
        excerpt: data.excerpt || "",
      } as PostMeta;
    });

  // 按日期降序排序
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

/**
 * 根据ID获取文章内容
 */
export function getPostById(id: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.title || "Untitled",
      date: data.date || new Date().toISOString(),
      categories: data.categories || [],
      tags: data.tags || [],
      cover: data.cover,
      excerpt: data.excerpt || "",
      content,
    } as Post;
  } catch {
    return null;
  }
}

/**
 * 获取所有分类
 */
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set<string>();
  posts.forEach((post) => {
    post.categories.forEach((category) => categories.add(category));
  });
  return Array.from(categories);
}

/**
 * 获取所有标签
 */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
}

/**
 * 根据分类获取文章
 */
export function getPostsByCategory(category: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.categories.includes(category));
}

/**
 * 根据标签获取文章
 */
export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}
