package com.blog.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.api.entity.Post;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PostMapper extends BaseMapper<Post> {

    @Select("SELECT tag_id FROM post_tag WHERE post_id = #{postId}")
    List<Long> selectTagIdsByPostId(@Param("postId") Long postId);

    @Select("SELECT COALESCE(SUM(view_count), 0) FROM post")
    Long selectTotalViewCount();

    @Select("SELECT post_id FROM post_tag WHERE tag_id = #{tagId}")
    List<Long> selectPostIdsByTagId(@Param("tagId") Long tagId);
}
