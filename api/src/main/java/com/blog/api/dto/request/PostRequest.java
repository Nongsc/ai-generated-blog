package com.blog.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Schema(description = "Post Request")
public class PostRequest {

    @NotBlank(message = "Post title is required")
    @Size(max = 200, message = "Post title must not exceed 200 characters")
    @Schema(description = "Post title", example = "Getting Started with Spring Boot")
    private String title;

    @Size(max = 200, message = "Slug must not exceed 200 characters")
    @Schema(description = "URL slug", example = "getting-started-with-spring-boot")
    private String slug;

    @Size(max = 500, message = "Summary must not exceed 500 characters")
    @Schema(description = "Post summary")
    private String summary;

    @Schema(description = "Post content (Markdown)")
    private String content;

    @Size(max = 500, message = "Cover URL must not exceed 500 characters")
    @Schema(description = "Cover image URL")
    private String cover;

    @Schema(description = "Category ID", example = "1")
    private Long categoryId;

    @Schema(description = "Tag IDs", example = "[1, 2, 3]")
    private List<Long> tagIds;

    @Schema(description = "Status: 0-draft, 1-published, 2-archived", example = "0")
    private Integer status;

    @Schema(description = "Published at")
    private LocalDateTime publishedAt;
}
