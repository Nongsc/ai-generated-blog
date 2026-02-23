package com.blog.api.controller.admin;

import com.blog.api.dto.request.TagRequest;
import com.blog.api.dto.response.ApiResponse;
import com.blog.api.dto.response.PageResponse;
import com.blog.api.dto.response.TagResponse;
import com.blog.api.service.TagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin 后台 - 标签管理接口（需认证）
 */
@Tag(name = "Admin - 标签管理", description = "Admin 标签管理接口")
@RestController
@RequestMapping("/api/admin/tags")
@RequiredArgsConstructor
public class AdminTagController {

    private final TagService tagService;

    @Operation(summary = "创建标签")
    @PostMapping
    public ApiResponse<TagResponse> create(@Valid @RequestBody TagRequest request) {
        TagResponse response = tagService.create(request);
        return ApiResponse.success("标签创建成功", response);
    }

    @Operation(summary = "根据ID获取标签")
    @GetMapping("/{id}")
    public ApiResponse<TagResponse> getById(
            @Parameter(description = "标签ID") @PathVariable Long id) {
        TagResponse response = tagService.getById(id);
        return ApiResponse.success(response);
    }

    @Operation(summary = "获取所有标签")
    @GetMapping
    public ApiResponse<List<TagResponse>> getAll() {
        List<TagResponse> tags = tagService.getAll();
        return ApiResponse.success(tags);
    }

    @Operation(summary = "分页获取标签列表")
    @GetMapping("/page")
    public ApiResponse<PageResponse<TagResponse>> getPage(
            @Parameter(description = "页码（从0开始）") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int size) {
        PageResponse<TagResponse> response = tagService.getPage(page, size);
        return ApiResponse.success(response);
    }

    @Operation(summary = "更新标签")
    @PutMapping("/{id}")
    public ApiResponse<TagResponse> update(
            @Parameter(description = "标签ID") @PathVariable Long id,
            @Valid @RequestBody TagRequest request) {
        TagResponse response = tagService.update(id, request);
        return ApiResponse.success("标签更新成功", response);
    }

    @Operation(summary = "删除标签")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @Parameter(description = "标签ID") @PathVariable Long id) {
        tagService.delete(id);
        return ApiResponse.success("标签删除成功", null);
    }
}
