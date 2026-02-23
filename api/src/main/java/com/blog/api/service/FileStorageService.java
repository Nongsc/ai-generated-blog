package com.blog.api.service;

import com.blog.api.exception.BusinessException;
import com.blog.api.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    @Value("${file.upload.path:./uploads}")
    private String uploadPath;

    @Value("${file.upload.max-size:10485760}")
    private long maxFileSize;

    private static final List<String> ALLOWED_TYPES = Arrays.asList(
            // 图片
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
            // 视频
            "video/mp4", "video/mpeg", "video/quicktime", "video/x-msvideo", "video/webm",
            // 音频
            "audio/mpeg", "audio/wav", "audio/ogg", "audio/aac", "audio/x-m4a",
            // 文档
            "application/pdf", "text/plain", "text/markdown"
    );

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            // 图片
            "jpg", "jpeg", "png", "gif", "webp", "svg",
            // 视频
            "mp4", "mpeg", "mpg", "mov", "avi", "webm",
            // 音频
            "mp3", "wav", "ogg", "aac", "m4a",
            // 文档
            "pdf", "txt", "md"
    );

    public String store(MultipartFile file) {
        log.info("Starting file upload: originalFilename={}, contentType={}, size={}",
                file.getOriginalFilename(), file.getContentType(), file.getSize());

        // Validate file
        if (file.isEmpty()) {
            log.error("File is empty");
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED, "File is empty");
        }

        if (file.getSize() > maxFileSize) {
            log.error("File size exceeded: {} > {}", file.getSize(), maxFileSize);
            throw new BusinessException(ErrorCode.FILE_SIZE_EXCEEDED);
        }

        String contentType = file.getContentType();
        log.debug("Content type: {}", contentType);
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            log.error("File type not allowed: {}", contentType);
            throw new BusinessException(ErrorCode.FILE_TYPE_NOT_ALLOWED);
        }

        // Generate filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        log.debug("File extension: {}", extension);
        if (extension.isEmpty() || !ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            log.error("Extension not allowed: {}", extension);
            throw new BusinessException(ErrorCode.FILE_TYPE_NOT_ALLOWED);
        }

        String newFilename = UUID.randomUUID().toString() + "." + extension;

        // Create date-based directory
        String dateDir = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM"));
        Path uploadDir = Paths.get(uploadPath, dateDir);

        try {
            Files.createDirectories(uploadDir);
            log.debug("Created upload directory: {}", uploadDir.toAbsolutePath());
        } catch (IOException e) {
            log.error("Failed to create upload directory: {}", e.getMessage(), e);
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED, "Failed to create upload directory");
        }

        // Store file
        Path targetPath = uploadDir.resolve(newFilename);
        try {
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("File stored successfully: {}", targetPath.toAbsolutePath());
        } catch (IOException e) {
            log.error("Failed to store file: {}", e.getMessage(), e);
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED, "Failed to store file");
        }

        return dateDir + "/" + newFilename;
    }

    public boolean delete(String filepath) {
        Path path = Paths.get(uploadPath, filepath);
        try {
            return Files.deleteIfExists(path);
        } catch (IOException e) {
            return false;
        }
    }

    public Path getFilePath(String filepath) {
        return Paths.get(uploadPath, filepath);
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex > 0 && dotIndex < filename.length() - 1) {
            return filename.substring(dotIndex + 1);
        }
        return "";
    }
}
