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
@Schema(description = "Post Response")
public class PostResponse {

    @Schema(description = "Post ID")
    private Long id;

    @Schema(description = "Post title")
    private String title;

    @Schema(description = "URL slug")
    private String slug;

    @Schema(description = "Post summary")
    private String summary;

    @Schema(description = "Post content")
    private String content;

    @Schema(description = "Cover image URL")
    private String cover;

    @Schema(description = "Author ID")
    private Long authorId;

    @Schema(description = "Author name")
    private String authorName;

    @Schema(description = "Category ID")
    private Long categoryId;

    @Schema(description = "Category name")
    private String categoryName;

    @Schema(description = "Category slug")
    private String categorySlug;

    @Schema(description = "Status: 0-draft, 1-published, 2-archived")
    private Integer status;

    @Schema(description = "View count")
    private Integer viewCount;

    @Schema(description = "Published at")
    private LocalDateTime publishedAt;

    @Schema(description = "Created at")
    private LocalDateTime createdAt;

    @Schema(description = "Updated at")
    private LocalDateTime updatedAt;

    @Schema(description = "Tags")
    private List<TagInfo> tags;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Tag Info")
    public static class TagInfo {
        private Long id;
        private String name;
        private String slug;
    }
}
