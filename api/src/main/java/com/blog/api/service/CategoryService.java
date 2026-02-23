package com.blog.api.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.api.dto.request.CategoryRequest;
import com.blog.api.dto.response.CategoryResponse;
import com.blog.api.dto.response.PageResponse;
import com.blog.api.entity.Category;
import com.blog.api.exception.BusinessException;
import com.blog.api.exception.ErrorCode;
import com.blog.api.mapper.CategoryMapper;
import com.blog.api.mapper.PostMapper;
import com.blog.api.util.SlugUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryMapper categoryMapper;
    private final PostMapper postMapper;

    @Transactional
    public CategoryResponse create(CategoryRequest request) {
        // Check if name exists
        LambdaQueryWrapper<Category> nameQuery = new LambdaQueryWrapper<>();
        nameQuery.eq(Category::getName, request.getName());
        if (categoryMapper.selectCount(nameQuery) > 0) {
            throw new BusinessException(ErrorCode.CATEGORY_NAME_EXISTS);
        }

        // Check if slug exists
        String slug = request.getSlug();
        if (!StringUtils.hasText(slug)) {
            slug = SlugUtils.generateSlug(request.getName());
        }
        LambdaQueryWrapper<Category> slugQuery = new LambdaQueryWrapper<>();
        slugQuery.eq(Category::getSlug, slug);
        if (categoryMapper.selectCount(slugQuery) > 0) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(slug);
        category.setDescription(request.getDescription());
        category.setParentId(request.getParentId());
        category.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());

        categoryMapper.insert(category);
        return toResponse(category);
    }

    public CategoryResponse getById(Long id) {
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        return toResponse(category);
    }

    public List<CategoryResponse> getAll() {
        List<Category> categories = categoryMapper.selectList(null);
        return categories.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getBySlug(String slug) {
        LambdaQueryWrapper<Category> query = new LambdaQueryWrapper<>();
        query.eq(Category::getSlug, slug);
        Category category = categoryMapper.selectOne(query);
        if (category == null) {
            throw new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        return toResponse(category);
    }

    public PageResponse<CategoryResponse> getPage(int page, int size) {
        Page<Category> pageParam = new Page<>(page + 1, size);
        Page<Category> result = categoryMapper.selectPage(pageParam, null);

        List<CategoryResponse> content = result.getRecords().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.of(content, page, size, result.getTotal());
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        // Check if new name exists (excluding current category)
        if (!category.getName().equals(request.getName())) {
            LambdaQueryWrapper<Category> nameQuery = new LambdaQueryWrapper<>();
            nameQuery.eq(Category::getName, request.getName())
                    .ne(Category::getId, id);
            if (categoryMapper.selectCount(nameQuery) > 0) {
                throw new BusinessException(ErrorCode.CATEGORY_NAME_EXISTS);
            }
        }

        // Handle slug update
        String slug = request.getSlug();
        if (StringUtils.hasText(slug) && !slug.equals(category.getSlug())) {
            LambdaQueryWrapper<Category> slugQuery = new LambdaQueryWrapper<>();
            slugQuery.eq(Category::getSlug, slug)
                    .ne(Category::getId, id);
            if (categoryMapper.selectCount(slugQuery) > 0) {
                throw new BusinessException(ErrorCode.CATEGORY_NAME_EXISTS, "Slug already exists");
            }
            category.setSlug(slug);
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setParentId(request.getParentId());
        category.setSortOrder(request.getSortOrder());
        category.setUpdatedAt(LocalDateTime.now());

        categoryMapper.updateById(category);
        return toResponse(category);
    }

    @Transactional
    public void delete(Long id) {
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        // Check if category has posts
        LambdaQueryWrapper<com.blog.api.entity.Post> postQuery = new LambdaQueryWrapper<>();
        postQuery.eq(com.blog.api.entity.Post::getCategoryId, id);
        if (postMapper.selectCount(postQuery) > 0) {
            throw new BusinessException(ErrorCode.CATEGORY_HAS_POSTS);
        }

        categoryMapper.deleteById(id);
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .parentId(category.getParentId())
                .sortOrder(category.getSortOrder())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

}
