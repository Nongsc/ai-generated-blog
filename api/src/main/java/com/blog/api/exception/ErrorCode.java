package com.blog.api.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    SUCCESS(200, "Success"),
    BAD_REQUEST(400, "Bad Request"),
    UNAUTHORIZED(401, "Unauthorized"),
    FORBIDDEN(403, "Forbidden"),
    NOT_FOUND(404, "Resource Not Found"),
    METHOD_NOT_ALLOWED(405, "Method Not Allowed"),
    CONFLICT(409, "Resource Conflict"),
    INTERNAL_ERROR(500, "Internal Server Error"),

    // User Errors (1000-1099)
    USER_NOT_FOUND(1000, "User Not Found"),
    USER_ALREADY_EXISTS(1001, "User Already Exists"),
    INVALID_CREDENTIALS(1002, "Invalid Username or Password"),
    USERNAME_ALREADY_EXISTS(1003, "Username Already Exists"),
    EMAIL_ALREADY_EXISTS(1004, "Email Already Exists"),

    // Auth Errors (1100-1199)
    TOKEN_EXPIRED(1100, "Token Expired"),
    TOKEN_INVALID(1101, "Token Invalid"),
    TOKEN_BLACKLISTED(1102, "Token Blacklisted"),

    // Post Errors (2000-2099)
    POST_NOT_FOUND(2000, "Post Not Found"),
    POST_TITLE_EXISTS(2001, "Post Title Already Exists"),
    POST_SLUG_EXISTS(2002, "Post Slug Already Exists"),

    // Category Errors (3000-3099)
    CATEGORY_NOT_FOUND(3000, "Category Not Found"),
    CATEGORY_NAME_EXISTS(3001, "Category Name Already Exists"),
    CATEGORY_HAS_POSTS(3002, "Cannot Delete Category With Posts"),

    // Tag Errors (4000-4099)
    TAG_NOT_FOUND(4000, "Tag Not Found"),
    TAG_NAME_EXISTS(4001, "Tag Name Already Exists"),

    // Media Errors (5000-5099)
    MEDIA_NOT_FOUND(5000, "Media Not Found"),
    FILE_UPLOAD_FAILED(5001, "File Upload Failed"),
    FILE_TYPE_NOT_ALLOWED(5002, "File Type Not Allowed"),
    FILE_SIZE_EXCEEDED(5003, "File Size Exceeded"),

    // FriendLink Errors (6000-6099)
    FRIEND_LINK_NOT_FOUND(6000, "Friend Link Not Found"),
    FRIEND_LINK_EXISTS(6001, "Friend Link Already Exists"),

    // Config Errors (7000-7099)
    CONFIG_NOT_FOUND(7000, "Config Not Found");

    private final int code;
    private final String message;
}
