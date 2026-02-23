package com.blog.api.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.api.dto.response.DashboardStatsResponse;
import com.blog.api.entity.Category;
import com.blog.api.entity.FriendLink;
import com.blog.api.entity.Post;
import com.blog.api.entity.Tag;
import com.blog.api.mapper.CategoryMapper;
import com.blog.api.mapper.FriendLinkMapper;
import com.blog.api.mapper.PostMapper;
import com.blog.api.mapper.TagMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PostMapper postMapper;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;
    private final FriendLinkMapper friendLinkMapper;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public DashboardStatsResponse getStats() {
        // Count posts
        long postCount = postMapper.selectCount(null);

        // Count categories
        long categoryCount = categoryMapper.selectCount(null);

        // Count tags
        long tagCount = tagMapper.selectCount(null);

        // Count friend links
        long friendLinkCount = friendLinkMapper.selectCount(null);

        // Total view count
        Long totalViewCount = postMapper.selectTotalViewCount();
        if (totalViewCount == null) {
            totalViewCount = 0L;
        }

        // Recent posts (limit 5)
        LambdaQueryWrapper<Post> query = new LambdaQueryWrapper<>();
        query.orderByDesc(Post::getCreatedAt).last("LIMIT 5");
        List<Post> recentPosts = postMapper.selectList(query);

        List<DashboardStatsResponse.RecentPost> recentPostList = recentPosts.stream()
                .map(post -> DashboardStatsResponse.RecentPost.builder()
                        .id(post.getId())
                        .title(post.getTitle())
                        .status(post.getStatus())
                        .viewCount(post.getViewCount())
                        .publishedAt(post.getPublishedAt() != null ? post.getPublishedAt().format(DATE_FORMATTER) : null)
                        .createdAt(post.getCreatedAt() != null ? post.getCreatedAt().format(DATE_FORMATTER) : null)
                        .build())
                .collect(Collectors.toList());

        return DashboardStatsResponse.builder()
                .postCount(postCount)
                .categoryCount(categoryCount)
                .tagCount(tagCount)
                .friendLinkCount(friendLinkCount)
                .totalViewCount(totalViewCount)
                .recentPosts(recentPostList)
                .build();
    }
}
