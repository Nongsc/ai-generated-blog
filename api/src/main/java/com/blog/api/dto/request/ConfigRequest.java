package com.blog.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "配置请求")
public class ConfigRequest {

    @NotBlank(message = "配置键不能为空")
    @Schema(description = "配置键", example = "site")
    private String key;

    @Schema(description = "配置值（JSON格式）")
    private String value;
}
