package com.blog.api.controller.blog;

import com.blog.api.dto.response.ApiResponse;
import com.blog.api.dto.response.FriendLinkResponse;
import com.blog.api.service.FriendLinkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Blog 前台 - 友情链接接口（公开）
 */
@Tag(name = "Blog - 友情链接", description = "Blog 前台友情链接接口")
@RestController
@RequestMapping("/api/blog/links")
@RequiredArgsConstructor
public class BlogFriendLinkController {

    private final FriendLinkService friendLinkService;

    @Operation(summary = "获取所有友情链接")
    @GetMapping
    public ApiResponse<List<FriendLinkResponse>> getAll() {
        List<FriendLinkResponse> links = friendLinkService.getAll();
        return ApiResponse.success(links);
    }
}
