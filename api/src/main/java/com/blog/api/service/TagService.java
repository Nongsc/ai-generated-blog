package com.blog.api.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.api.dto.request.TagRequest;
import com.blog.api.dto.response.PageResponse;
import com.blog.api.dto.response.TagResponse;
import com.blog.api.entity.Tag;
import com.blog.api.exception.BusinessException;
import com.blog.api.exception.ErrorCode;
import com.blog.api.mapper.TagMapper;
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
public class TagService {

    private final TagMapper tagMapper;

    @Transactional
    public TagResponse create(TagRequest request) {
        // Check if name exists
        LambdaQueryWrapper<Tag> nameQuery = new LambdaQueryWrapper<>();
        nameQuery.eq(Tag::getName, request.getName());
        if (tagMapper.selectCount(nameQuery) > 0) {
            throw new BusinessException(ErrorCode.TAG_NAME_EXISTS);
        }

        // Handle slug
        String slug = request.getSlug();
        if (!StringUtils.hasText(slug)) {
            slug = SlugUtils.generateSlug(request.getName());
        }
        LambdaQueryWrapper<Tag> slugQuery = new LambdaQueryWrapper<>();
        slugQuery.eq(Tag::getSlug, slug);
        if (tagMapper.selectCount(slugQuery) > 0) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        Tag tag = new Tag();
        tag.setName(request.getName());
        tag.setSlug(slug);
        tag.setCreatedAt(LocalDateTime.now());
        tag.setUpdatedAt(LocalDateTime.now());

        tagMapper.insert(tag);
        return toResponse(tag);
    }

    public TagResponse getById(Long id) {
        Tag tag = tagMapper.selectById(id);
        if (tag == null) {
            throw new BusinessException(ErrorCode.TAG_NOT_FOUND);
        }
        return toResponse(tag);
    }

    public List<TagResponse> getAll() {
        List<Tag> tags = tagMapper.selectList(null);
        return tags.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TagResponse getBySlug(String slug) {
        LambdaQueryWrapper<Tag> query = new LambdaQueryWrapper<>();
        query.eq(Tag::getSlug, slug);
        Tag tag = tagMapper.selectOne(query);
        if (tag == null) {
            throw new BusinessException(ErrorCode.TAG_NOT_FOUND);
        }
        return toResponse(tag);
    }

    public PageResponse<TagResponse> getPage(int page, int size) {
        Page<Tag> pageParam = new Page<>(page + 1, size);
        Page<Tag> result = tagMapper.selectPage(pageParam, null);

        List<TagResponse> content = result.getRecords().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.of(content, page, size, result.getTotal());
    }

    @Transactional
    public TagResponse update(Long id, TagRequest request) {
        Tag tag = tagMapper.selectById(id);
        if (tag == null) {
            throw new BusinessException(ErrorCode.TAG_NOT_FOUND);
        }

        // Check if new name exists
        if (!tag.getName().equals(request.getName())) {
            LambdaQueryWrapper<Tag> nameQuery = new LambdaQueryWrapper<>();
            nameQuery.eq(Tag::getName, request.getName())
                    .ne(Tag::getId, id);
            if (tagMapper.selectCount(nameQuery) > 0) {
                throw new BusinessException(ErrorCode.TAG_NAME_EXISTS);
            }
        }

        // Handle slug update
        String slug = request.getSlug();
        if (StringUtils.hasText(slug) && !slug.equals(tag.getSlug())) {
            LambdaQueryWrapper<Tag> slugQuery = new LambdaQueryWrapper<>();
            slugQuery.eq(Tag::getSlug, slug)
                    .ne(Tag::getId, id);
            if (tagMapper.selectCount(slugQuery) > 0) {
                throw new BusinessException(ErrorCode.TAG_NAME_EXISTS, "Slug already exists");
            }
            tag.setSlug(slug);
        }

        tag.setName(request.getName());
        tag.setUpdatedAt(LocalDateTime.now());

        tagMapper.updateById(tag);
        return toResponse(tag);
    }

    @Transactional
    public void delete(Long id) {
        Tag tag = tagMapper.selectById(id);
        if (tag == null) {
            throw new BusinessException(ErrorCode.TAG_NOT_FOUND);
        }
        tagMapper.deleteById(id);
    }

    private TagResponse toResponse(Tag tag) {
        return TagResponse.builder()
                .id(tag.getId())
                .name(tag.getName())
                .slug(tag.getSlug())
                .createdAt(tag.getCreatedAt())
                .updatedAt(tag.getUpdatedAt())
                .build();
    }

}
