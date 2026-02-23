package com.blog.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "Tag Request")
public class TagRequest {

    @NotBlank(message = "Tag name is required")
    @Size(max = 50, message = "Tag name must not exceed 50 characters")
    @Schema(description = "Tag name", example = "Java")
    private String name;

    @Size(max = 50, message = "Slug must not exceed 50 characters")
    @Schema(description = "URL slug", example = "java")
    private String slug;
}
