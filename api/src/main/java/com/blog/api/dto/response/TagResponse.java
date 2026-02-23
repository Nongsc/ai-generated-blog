package com.blog.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Tag Response")
public class TagResponse {

    @Schema(description = "Tag ID")
    private Long id;

    @Schema(description = "Tag name")
    private String name;

    @Schema(description = "URL slug")
    private String slug;

    @Schema(description = "Created at")
    private LocalDateTime createdAt;

    @Schema(description = "Updated at")
    private LocalDateTime updatedAt;

    @Schema(description = "Post count")
    private Long postCount;
}
