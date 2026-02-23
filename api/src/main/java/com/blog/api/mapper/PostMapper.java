package com.blog.api.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.blog.api.entity.Post;
import lombok.Data;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface PostMapper extends BaseMapper<Post> {

    @Select("SELECT tag_id FROM post_tag WHERE post_id = #{postId}")
    List<Long> selectTagIdsByPostId(@Param("postId") Long postId);

    @Select("SELECT COALESCE(SUM(view_count), 0) FROM post")
    Long selectTotalViewCount();

    @Select("SELECT post_id FROM post_tag WHERE tag_id = #{tagId}")
    List<Long> selectPostIdsByTagId(@Param("tagId") Long tagId);

    /**
     * 原子更新浏览量（解决并发问题）
     */
    @Update("UPDATE post SET view_count = view_count + 1 WHERE id = #{id}")
    int incrementViewCount(@Param("id") Long id);

    /**
     * 批量查询文章关联的分类信息
     */
    @Select("<script>" +
            "SELECT DISTINCT c.id, c.name, c.slug " +
            "FROM category c " +
            "WHERE c.id IN " +
            "<foreach item='id' collection='categoryIds' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    List<CategoryInfo> selectCategoriesByIds(@Param("categoryIds") List<Long> categoryIds);

    /**
     * 批量查询文章关联的标签信息
     */
    @Select("<script>" +
            "SELECT DISTINCT t.id, t.name, t.slug, pt.post_id as postId " +
            "FROM tag t " +
            "INNER JOIN post_tag pt ON t.id = pt.tag_id " +
            "WHERE pt.post_id IN " +
            "<foreach item='id' collection='postIds' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    List<TagWithPostId> selectTagsByPostIds(@Param("postIds") List<Long> postIds);

    /**
     * 分类信息（用于批量查询）
     */
    @Data
    class CategoryInfo {
        private Long id;
        private String name;
        private String slug;
    }

    /**
     * 标签信息（包含文章 ID，用于批量查询）
     */
    @Data
    class TagWithPostId {
        private Long id;
        private String name;
        private String slug;
        private Long postId;
    }
}
