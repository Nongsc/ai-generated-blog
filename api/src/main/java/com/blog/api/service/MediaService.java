package com.blog.api.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.blog.api.dto.response.MediaResponse;
import com.blog.api.dto.response.PageResponse;
import com.blog.api.entity.Media;
import com.blog.api.exception.BusinessException;
import com.blog.api.exception.ErrorCode;
import com.blog.api.mapper.MediaMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaMapper mediaMapper;
    private final FileStorageService fileStorageService;

    @Transactional
    public MediaResponse upload(MultipartFile file, Long uploaderId) {
        // Store file
        String filepath = fileStorageService.store(file);

        // Create media record
        Media media = new Media();
        media.setFilename(filepath.substring(filepath.lastIndexOf('/') + 1));
        media.setOriginalFilename(file.getOriginalFilename());
        media.setFilepath(filepath);
        media.setMimeType(file.getContentType());
        media.setSize(file.getSize());
        media.setUploaderId(uploaderId);
        media.setCreatedAt(LocalDateTime.now());

        mediaMapper.insert(media);
        return toResponse(media);
    }

    public MediaResponse getById(Long id) {
        Media media = mediaMapper.selectById(id);
        if (media == null) {
            throw new BusinessException(ErrorCode.MEDIA_NOT_FOUND);
        }
        return toResponse(media);
    }

    public PageResponse<MediaResponse> getPage(int page, int size, Long uploaderId) {
        Page<Media> pageParam = new Page<>(page + 1, size);
        LambdaQueryWrapper<Media> query = new LambdaQueryWrapper<>();

        if (uploaderId != null) {
            query.eq(Media::getUploaderId, uploaderId);
        }
        query.orderByDesc(Media::getCreatedAt);

        Page<Media> result = mediaMapper.selectPage(pageParam, query);

        List<MediaResponse> content = result.getRecords().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.of(content, page, size, result.getTotal());
    }

    public List<MediaResponse> getRecent(int limit) {
        LambdaQueryWrapper<Media> query = new LambdaQueryWrapper<>();
        query.orderByDesc(Media::getCreatedAt)
                .last("LIMIT " + limit);

        List<Media> mediaList = mediaMapper.selectList(query);
        return mediaList.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        Media media = mediaMapper.selectById(id);
        if (media == null) {
            throw new BusinessException(ErrorCode.MEDIA_NOT_FOUND);
        }

        // Delete file from storage
        fileStorageService.delete(media.getFilepath());

        // Delete record from database
        mediaMapper.deleteById(id);
    }

    private MediaResponse toResponse(Media media) {
        return MediaResponse.builder()
                .id(media.getId())
                .filename(media.getFilename())
                .originalFilename(media.getOriginalFilename())
                .filepath("/uploads/" + media.getFilepath())
                .mimeType(media.getMimeType())
                .size(media.getSize())
                .uploaderId(media.getUploaderId())
                .createdAt(media.getCreatedAt())
                .build();
    }
}
