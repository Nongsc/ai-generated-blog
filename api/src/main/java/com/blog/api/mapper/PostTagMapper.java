package com.blog.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.api.entity.PostTag;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Delete;

@Mapper
public interface PostTagMapper extends BaseMapper<PostTag> {

    @Delete("DELETE FROM post_tag WHERE post_id = #{postId}")
    void deleteByPostId(@Param("postId") Long postId);
}
