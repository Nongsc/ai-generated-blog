package com.blog.api.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "友情链接请求")
public class FriendLinkRequest {

    @NotBlank(message = "名称不能为空")
    @Size(max = 50, message = "名称不能超过50个字符")
    @Schema(description = "网站名称", example = "我的博客")
    private String name;

    @NotBlank(message = "URL不能为空")
    @Size(max = 255, message = "URL不能超过255个字符")
    @Schema(description = "网站URL", example = "https://example.com")
    private String url;

    @Size(max = 255, message = "头像URL不能超过255个字符")
    @Schema(description = "头像URL")
    private String avatar;

    @Size(max = 255, message = "描述不能超过255个字符")
    @Schema(description = "网站描述")
    private String description;

    @Schema(description = "排序顺序", example = "0")
    private Integer sortOrder;
}
