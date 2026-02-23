package com.blog.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Category Request")
public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 50, message = "Category name must not exceed 50 characters")
    @Schema(description = "Category name", example = "Technology")
    private String name;

    @Size(max = 50, message = "Slug must not exceed 50 characters")
    @Schema(description = "URL slug", example = "technology")
    private String slug;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    @Schema(description = "Category description", example = "Technology related posts")
    private String description;

    @Schema(description = "Parent category ID", example = "1")
    private Long parentId;

    @Schema(description = "Sort order", example = "0")
    private Integer sortOrder;
}
