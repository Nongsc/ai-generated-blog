package com.blog.api.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.api.dto.request.PostRequest;
import com.blog.api.dto.response.PageResponse;
import com.blog.api.dto.response.PostResponse;
import com.blog.api.entity.Category;
import com.blog.api.entity.Post;
import com.blog.api.entity.PostTag;
import com.blog.api.entity.Tag;
import com.blog.api.entity.User;
import com.blog.api.exception.BusinessException;
import com.blog.api.exception.ErrorCode;
import com.blog.api.mapper.CategoryMapper;
import com.blog.api.mapper.PostMapper;
import com.blog.api.mapper.PostTagMapper;
import com.blog.api.mapper.TagMapper;
import com.blog.api.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostMapper postMapper;
    private final PostTagMapper postTagMapper;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;
    private final UserMapper userMapper;

    @Transactional
    public PostResponse create(PostRequest request, String username) {
        // Get author
        User author = userMapper.selectByUsername(username);
        if (author == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        // Handle slug
        String slug = request.getSlug();
        if (!StringUtils.hasText(slug)) {
            slug = generateSlug(request.getTitle());
        }
        LambdaQueryWrapper<Post> slugQuery = new LambdaQueryWrapper<>();
        slugQuery.eq(Post::getSlug, slug);
        if (postMapper.selectCount(slugQuery) > 0) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setSlug(slug);
        post.setSummary(request.getSummary());
        post.setContent(request.getContent());
        post.setCover(request.getCover());
        post.setAuthorId(author.getId());
        post.setCategoryId(request.getCategoryId());
        post.setStatus(request.getStatus() != null ? request.getStatus() : 0);
        post.setViewCount(0);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        // Set published date if status is published
        if (post.getStatus() == 1) {
            post.setPublishedAt(request.getPublishedAt() != null ? request.getPublishedAt() : LocalDateTime.now());
        }

        postMapper.insert(post);

        // Save tags
        savePostTags(post.getId(), request.getTagIds());

        return toResponse(post);
    }

    public PostResponse getById(Long id) {
        Post post = postMapper.selectById(id);
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }
        return toResponse(post);
    }

    public PostResponse getBySlug(String slug) {
        LambdaQueryWrapper<Post> query = new LambdaQueryWrapper<>();
        query.eq(Post::getSlug, slug);
        Post post = postMapper.selectOne(query);
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }
        return toResponse(post);
    }

    public PageResponse<PostResponse> getPage(int page, int size, Integer status, Long categoryId) {
        Page<Post> pageParam = new Page<>(page + 1, size);
        LambdaQueryWrapper<Post> query = new LambdaQueryWrapper<>();

        if (status != null) {
            query.eq(Post::getStatus, status);
        }
        if (categoryId != null) {
            query.eq(Post::getCategoryId, categoryId);
        }
        query.orderByDesc(Post::getCreatedAt);

        Page<Post> result = postMapper.selectPage(pageParam, query);

        List<PostResponse> content = result.getRecords().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.of(content, page, size, result.getTotal());
    }

    public PageResponse<PostResponse> getPageByTagId(int page, int size, Long tagId) {
        Page<Post> pageParam = new Page<>(page + 1, size);
        
        // Get post IDs by tag ID
        List<Long> postIds = postMapper.selectPostIdsByTagId(tagId);
        if (postIds.isEmpty()) {
            return PageResponse.of(List.of(), page, size, 0);
        }

        LambdaQueryWrapper<Post> query = new LambdaQueryWrapper<>();
        query.in(Post::getId, postIds)
             .eq(Post::getStatus, 1) // Only published posts
             .orderByDesc(Post::getCreatedAt);

        Page<Post> result = postMapper.selectPage(pageParam, query);

        List<PostResponse> content = result.getRecords().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.of(content, page, size, result.getTotal());
    }

    @Transactional
    public PostResponse update(Long id, PostRequest request) {
        Post post = postMapper.selectById(id);
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }

        // Handle slug update
        String slug = request.getSlug();
        if (StringUtils.hasText(slug) && !slug.equals(post.getSlug())) {
            LambdaQueryWrapper<Post> slugQuery = new LambdaQueryWrapper<>();
            slugQuery.eq(Post::getSlug, slug).ne(Post::getId, id);
            if (postMapper.selectCount(slugQuery) > 0) {
                throw new BusinessException(ErrorCode.POST_SLUG_EXISTS);
            }
            post.setSlug(slug);
        }

        post.setTitle(request.getTitle());
        post.setSummary(request.getSummary());
        post.setContent(request.getContent());
        post.setCover(request.getCover());
        post.setCategoryId(request.getCategoryId());
        post.setStatus(request.getStatus());
        post.setUpdatedAt(LocalDateTime.now());

        // Handle published date
        if (post.getStatus() == 1 && post.getPublishedAt() == null) {
            post.setPublishedAt(LocalDateTime.now());
        }

        postMapper.updateById(post);

        // Update tags
        if (request.getTagIds() != null) {
            postTagMapper.deleteByPostId(post.getId());
            savePostTags(post.getId(), request.getTagIds());
        }

        return toResponse(post);
    }

    @Transactional
    public void delete(Long id) {
        Post post = postMapper.selectById(id);
        if (post == null) {
            throw new BusinessException(ErrorCode.POST_NOT_FOUND);
        }
        postTagMapper.deleteByPostId(id);
        postMapper.deleteById(id);
    }

    @Transactional
    public void incrementViewCount(Long id) {
        Post post = postMapper.selectById(id);
        if (post != null) {
            post.setViewCount(post.getViewCount() + 1);
            postMapper.updateById(post);
        }
    }

    private void savePostTags(Long postId, List<Long> tagIds) {
        if (tagIds != null && !tagIds.isEmpty()) {
            for (Long tagId : tagIds) {
                PostTag postTag = new PostTag();
                postTag.setPostId(postId);
                postTag.setTagId(tagId);
                postTagMapper.insert(postTag);
            }
        }
    }

    private PostResponse toResponse(Post post) {
        PostResponse.PostResponseBuilder builder = PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .slug(post.getSlug())
                .summary(post.getSummary())
                .content(post.getContent())
                .cover(post.getCover())
                .authorId(post.getAuthorId())
                .categoryId(post.getCategoryId())
                .status(post.getStatus())
                .viewCount(post.getViewCount())
                .publishedAt(post.getPublishedAt())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt());

        // Get category name
        if (post.getCategoryId() != null) {
            Category category = categoryMapper.selectById(post.getCategoryId());
            if (category != null) {
                builder.categoryName(category.getName());
                builder.categorySlug(category.getSlug());
            }
        }

        // Get tags
        List<Long> tagIds = postMapper.selectTagIdsByPostId(post.getId());
        if (!tagIds.isEmpty()) {
            List<PostResponse.TagInfo> tags = tagIds.stream()
                    .map(tagId -> {
                        Tag tag = tagMapper.selectById(tagId);
                        if (tag != null) {
                            return PostResponse.TagInfo.builder()
                                    .id(tag.getId())
                                    .name(tag.getName())
                                    .slug(tag.getSlug())
                                    .build();
                        }
                        return null;
                    })
                    .filter(t -> t != null)
                    .collect(Collectors.toList());
            builder.tags(tags);
        }

        return builder.build();
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\u4e00-\\u9fa5]+", "-")
                .replaceAll("^-|-$", "");
    }
}
