package com.blog.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Category Response")
public class CategoryResponse {

    @Schema(description = "Category ID")
    private Long id;

    @Schema(description = "Category name")
    private String name;

    @Schema(description = "URL slug")
    private String slug;

    @Schema(description = "Category description")
    private String description;

    @Schema(description = "Parent category ID")
    private Long parentId;

    @Schema(description = "Sort order")
    private Integer sortOrder;

    @Schema(description = "Created at")
    private LocalDateTime createdAt;

    @Schema(description = "Updated at")
    private LocalDateTime updatedAt;

    @Schema(description = "Post count")
    private Long postCount;

    @Schema(description = "Child categories")
    private List<CategoryResponse> children;
}
