package com.blog.api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "配置响应")
public class ConfigResponse {

    @Schema(description = "配置键")
    private String key;

    @Schema(description = "配置值")
    private String value;

    @Schema(description = "描述")
    private String description;
}
