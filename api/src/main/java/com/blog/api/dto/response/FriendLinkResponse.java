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
@Schema(description = "友情链接响应")
public class FriendLinkResponse {

    @Schema(description = "ID")
    private Long id;

    @Schema(description = "网站名称")
    private String name;

    @Schema(description = "网站URL")
    private String url;

    @Schema(description = "头像URL")
    private String avatar;

    @Schema(description = "网站描述")
    private String description;

    @Schema(description = "排序顺序")
    private Integer sortOrder;

    @Schema(description = "状态：0-禁用，1-启用")
    private Integer status;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
