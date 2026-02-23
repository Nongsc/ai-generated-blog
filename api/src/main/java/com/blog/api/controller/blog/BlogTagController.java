package com.blog.api.controller.blog;

import com.blog.api.dto.response.ApiResponse;
import com.blog.api.dto.response.TagResponse;
import com.blog.api.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Blog 前台 - 标签接口（公开）
 */
@Tag(name = "Blog - 标签", description = "Blog 前台标签接口")
@RestController
@RequestMapping("/api/blog/tags")
@RequiredArgsConstructor
public class BlogTagController {

    private final TagService tagService;

    @Operation(summary = "获取所有标签")
    @GetMapping
    public ApiResponse<List<TagResponse>> getAll() {
        List<TagResponse> tags = tagService.getAll();
        return ApiResponse.success(tags);
    }

    @Operation(summary = "根据Slug获取标签")
    @GetMapping("/{slug}")
    public ApiResponse<TagResponse> getBySlug(
            @Parameter(description = "标签别名") @PathVariable String slug) {
        TagResponse response = tagService.getBySlug(slug);
        return ApiResponse.success(response);
    }
}
