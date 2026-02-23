/**
 * Migration Script: Import existing Markdown posts to database
 * 
 * Usage: npx tsx scripts/migrate-posts.ts
 * 
 * This script:
 * 1. Reads all Markdown files from blog/src/data/posts
 * 2. Extracts frontmatter metadata
 * 3. Creates categories and tags if they don't exist
 * 4. Imports posts to the database
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BLOG_POSTS_PATH = path.resolve(__dirname, '../blog/src/data/posts');

interface FrontMatter {
  id: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  cover?: string;
  excerpt: string;
}

async function createOrGetCategory(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let category = await prisma.category.findFirst({
    where: { OR: [{ name }, { slug }] },
  });

  if (!category) {
    category = await prisma.category.create({
      data: { name, slug },
    });
    console.log(`Created category: ${name}`);
  }

  return category;
}

async function createOrGetTag(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let tag = await prisma.tag.findFirst({
    where: { OR: [{ name }, { slug }] },
  });

  if (!tag) {
    tag = await prisma.tag.create({
      data: { name, slug },
    });
    console.log(`Created tag: ${name}`);
  }

  return tag;
}

async function migratePost(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const frontMatter = data as FrontMatter;

  // Check if post already exists
  const existingPost = await prisma.post.findUnique({
    where: { slug: frontMatter.id },
  });

  if (existingPost) {
    console.log(`Post already exists: ${frontMatter.title}`);
    return null;
  }

  // Create categories
  const categories = await Promise.all(
    (frontMatter.categories || []).map((name) => createOrGetCategory(name))
  );

  // Create tags
  const tags = await Promise.all(
    (frontMatter.tags || []).map((name) => createOrGetTag(name))
  );

  // Create post
  const post = await prisma.post.create({
    data: {
      slug: frontMatter.id,
      title: frontMatter.title,
      content: content.trim(),
      excerpt: frontMatter.excerpt || '',
      cover: frontMatter.cover || null,
      status: 'PUBLISHED',
      publishedAt: new Date(frontMatter.date),
      categories: {
        create: categories.map((cat) => ({
          categoryId: cat.id,
        })),
      },
      tags: {
        create: tags.map((tag) => ({
          tagId: tag.id,
        })),
      },
    },
  });

  console.log(`Migrated: ${frontMatter.title}`);
  return post;
}

async function main() {
  console.log('Starting migration...\n');
  console.log(`Reading posts from: ${BLOG_POSTS_PATH}\n`);

  // Check if directory exists
  if (!fs.existsSync(BLOG_POSTS_PATH)) {
    console.error(`Directory not found: ${BLOG_POSTS_PATH}`);
    console.log('Please ensure the blog posts directory exists.');
    process.exit(1);
  }

  // Get all markdown files
  const files = fs.readdirSync(BLOG_POSTS_PATH).filter((f) => f.endsWith('.md'));

  console.log(`Found ${files.length} markdown files\n`);

  let migrated = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(BLOG_POSTS_PATH, file);
    try {
      const result = await migratePost(filePath);
      if (result) {
        migrated++;
      } else {
        skipped++;
      }
    } catch (error) {
      console.error(`Error migrating ${file}:`, error);
    }
  }

  console.log('\n--- Migration Summary ---');
  console.log(`Total files: ${files.length}`);
  console.log(`Migrated: ${migrated}`);
  console.log(`Skipped: ${skipped}`);
}

main()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
