package com.blog.api.controller.blog;

import com.blog.api.dto.response.ApiResponse;
import com.blog.api.dto.response.CategoryResponse;
import com.blog.api.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Blog 前台 - 分类接口（公开）
 */
@Tag(name = "Blog - 分类", description = "Blog 前台分类接口")
@RestController
@RequestMapping("/api/blog/categories")
@RequiredArgsConstructor
public class BlogCategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "获取所有分类")
    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAll() {
        List<CategoryResponse> categories = categoryService.getAll();
        return ApiResponse.success(categories);
    }

    @Operation(summary = "根据Slug获取分类")
    @GetMapping("/{slug}")
    public ApiResponse<CategoryResponse> getBySlug(
            @Parameter(description = "分类别名") @PathVariable String slug) {
        CategoryResponse response = categoryService.getBySlug(slug);
        return ApiResponse.success(response);
    }
}
