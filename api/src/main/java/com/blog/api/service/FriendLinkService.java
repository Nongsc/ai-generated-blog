package com.blog.api.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.blog.api.dto.request.FriendLinkRequest;
import com.blog.api.dto.response.FriendLinkResponse;
import com.blog.api.entity.FriendLink;
import com.blog.api.exception.BusinessException;
import com.blog.api.exception.ErrorCode;
import com.blog.api.mapper.FriendLinkMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendLinkService {

    private final FriendLinkMapper friendLinkMapper;

    @Transactional
    public FriendLinkResponse create(FriendLinkRequest request) {
        // Check if URL exists
        LambdaQueryWrapper<FriendLink> query = new LambdaQueryWrapper<>();
        query.eq(FriendLink::getUrl, request.getUrl());
        if (friendLinkMapper.selectCount(query) > 0) {
            throw new BusinessException(ErrorCode.FRIEND_LINK_EXISTS, "该链接URL已存在");
        }

        FriendLink link = new FriendLink();
        link.setName(request.getName());
        link.setUrl(request.getUrl());
        link.setAvatar(request.getAvatar());
        link.setDescription(request.getDescription());
        link.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);
        link.setStatus(1);
        link.setCreatedAt(LocalDateTime.now());
        link.setUpdatedAt(LocalDateTime.now());

        friendLinkMapper.insert(link);
        return toResponse(link);
    }

    public FriendLinkResponse getById(Long id) {
        FriendLink link = friendLinkMapper.selectById(id);
        if (link == null) {
            throw new BusinessException(ErrorCode.FRIEND_LINK_NOT_FOUND);
        }
        return toResponse(link);
    }

    public List<FriendLinkResponse> getAll() {
        LambdaQueryWrapper<FriendLink> query = new LambdaQueryWrapper<>();
        query.orderByAsc(FriendLink::getSortOrder)
             .orderByDesc(FriendLink::getCreatedAt);
        List<FriendLink> links = friendLinkMapper.selectList(query);
        return links.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FriendLinkResponse update(Long id, FriendLinkRequest request) {
        FriendLink link = friendLinkMapper.selectById(id);
        if (link == null) {
            throw new BusinessException(ErrorCode.FRIEND_LINK_NOT_FOUND);
        }

        // Check if new URL exists
        if (!link.getUrl().equals(request.getUrl())) {
            LambdaQueryWrapper<FriendLink> query = new LambdaQueryWrapper<>();
            query.eq(FriendLink::getUrl, request.getUrl())
                 .ne(FriendLink::getId, id);
            if (friendLinkMapper.selectCount(query) > 0) {
                throw new BusinessException(ErrorCode.FRIEND_LINK_EXISTS, "该链接URL已存在");
            }
        }

        link.setName(request.getName());
        link.setUrl(request.getUrl());
        link.setAvatar(request.getAvatar());
        link.setDescription(request.getDescription());
        if (request.getSortOrder() != null) {
            link.setSortOrder(request.getSortOrder());
        }
        link.setUpdatedAt(LocalDateTime.now());

        friendLinkMapper.updateById(link);
        return toResponse(link);
    }

    @Transactional
    public void delete(Long id) {
        FriendLink link = friendLinkMapper.selectById(id);
        if (link == null) {
            throw new BusinessException(ErrorCode.FRIEND_LINK_NOT_FOUND);
        }
        friendLinkMapper.deleteById(id);
    }

    private FriendLinkResponse toResponse(FriendLink link) {
        return FriendLinkResponse.builder()
                .id(link.getId())
                .name(link.getName())
                .url(link.getUrl())
                .avatar(link.getAvatar())
                .description(link.getDescription())
                .sortOrder(link.getSortOrder())
                .status(link.getStatus())
                .createdAt(link.getCreatedAt())
                .updatedAt(link.getUpdatedAt())
                .build();
    }
}
