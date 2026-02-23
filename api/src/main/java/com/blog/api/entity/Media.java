package com.blog.api.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("media")
public class Media {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String filename;

    private String originalFilename;

    private String filepath;

    private String mimeType;

    private Long size;

    private Long uploaderId;

    private LocalDateTime createdAt;
}
