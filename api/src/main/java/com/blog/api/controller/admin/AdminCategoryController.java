package com.blog.api.controller.admin;

import com.blog.api.dto.request.CategoryRequest;
import com.blog.api.dto.response.ApiResponse;
import com.blog.api.dto.response.CategoryResponse;
import com.blog.api.dto.response.PageResponse;
import com.blog.api.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin 后台 - 分类管理接口（需认证）
 */
@Tag(name = "Admin - 分类管理", description = "Admin 分类管理接口")
@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "创建分类")
    @PostMapping
    public ApiResponse<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.create(request);
        return ApiResponse.success("分类创建成功", response);
    }

    @Operation(summary = "根据ID获取分类")
    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getById(
            @Parameter(description = "分类ID") @PathVariable Long id) {
        CategoryResponse response = categoryService.getById(id);
        return ApiResponse.success(response);
    }

    @Operation(summary = "获取所有分类")
    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAll() {
        List<CategoryResponse> categories = categoryService.getAll();
        return ApiResponse.success(categories);
    }

    @Operation(summary = "分页获取分类列表")
    @GetMapping("/page")
    public ApiResponse<PageResponse<CategoryResponse>> getPage(
            @Parameter(description = "页码（从0开始）") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int size) {
        PageResponse<CategoryResponse> response = categoryService.getPage(page, size);
        return ApiResponse.success(response);
    }

    @Operation(summary = "更新分类")
    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> update(
            @Parameter(description = "分类ID") @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse response = categoryService.update(id, request);
        return ApiResponse.success("分类更新成功", response);
    }

    @Operation(summary = "删除分类")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @Parameter(description = "分类ID") @PathVariable Long id) {
        categoryService.delete(id);
        return ApiResponse.success("分类删除成功", null);
    }
}
