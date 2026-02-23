package com.blog.api.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardStatsResponse {
    private long postCount;
    private long categoryCount;
    private long tagCount;
    private long friendLinkCount;
    private long totalViewCount;
    private List<RecentPost> recentPosts;

    @Data
    @Builder
    public static class RecentPost {
        private Long id;
        private String title;
        private Integer status;
        private Integer viewCount;
        private String publishedAt;
        private String createdAt;
    }
}
