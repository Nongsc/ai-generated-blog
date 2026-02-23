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
@Schema(description = "Media Response")
public class MediaResponse {

    @Schema(description = "Media ID")
    private Long id;

    @Schema(description = "Stored filename")
    private String filename;

    @Schema(description = "Original filename")
    private String originalFilename;

    @Schema(description = "File path/URL")
    private String filepath;

    @Schema(description = "MIME type")
    private String mimeType;

    @Schema(description = "File size in bytes")
    private Long size;

    @Schema(description = "Uploader ID")
    private Long uploaderId;

    @Schema(description = "Created at")
    private LocalDateTime createdAt;
}
